'use strict'

import { app, BrowserWindow, dialog } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow()
  const details = {
    appId: "com.test.relaunch",
    relaunchCommand: app.getPath('exe') + ' arg1="hello" arg2="world"',
    relaunchDisplayName: 'Hello'
  }
  dialog.showMessageBox({message: JSON.stringify(details)})
  window.setAppDetails(details)

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    dialog.showMessageBox({message: JSON.stringify(commandLine)})
  })

  // Create myWindow, load the rest of the app, etc...
  // create main BrowserWindow when electron is ready
  app.on('ready', () => {
    mainWindow = createMainWindow()
  })
}