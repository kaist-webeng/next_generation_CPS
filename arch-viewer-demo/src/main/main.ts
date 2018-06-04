import { app, BrowserWindow, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as http from 'http'
import * as fs from 'fs'
import * as util from './util'
import { ErrorOccurredChannel, GraphSubstitutionChannel } from '../IPCTypes'
import { Graph, ICommand } from 'godeptypes'

// Declare global variables
const CanvasIndexUrl = url.format({
  pathname: path.join(__dirname, '../canvas/index.html'),
  protocol: 'file:',
  slashes: true
})

const port = '3030'

let canvasWindow: Electron.BrowserWindow

// Declare global functions
function createCanvasWindow(initGraph: Graph.IListGraph) {
  const windowOpts = {
    height: 800,
    width: 1200
  }

  // Create the window for the canvas process
  canvasWindow = new BrowserWindow(windowOpts)
  if (BrowserWindow.getDevToolsExtensions() !== null) {
    // Attach dev tools to the windows
    const reactDevTool = util.getDevToolPath(util.ReactDevAppID)
    if (reactDevTool) {
      BrowserWindow.addDevToolsExtension(reactDevTool)
    }

    const reduxDevTool = util.getDevToolPath(util.ReduxDevAppID)
    if (reduxDevTool) {
      BrowserWindow.addDevToolsExtension(reduxDevTool)
    }
  }

  canvasWindow.loadURL(CanvasIndexUrl)
  if (initGraph) {
    // @ts-ignore
    canvasWindow.initGraph = initGraph
  }

  // TODO: move to main menu
  // TODO: add dev flag
  canvasWindow.webContents.openDevTools()

  // Subscribe the window events
  canvasWindow.on('closed', () => {
    canvasWindow = null
  })
}

function initializeApp() {
  // Subscribe the app events
  app.on('ready', () => {
    globalShortcut.register('CommandOrControl+R', () => {
      // @ts-ignore
    })

    const requestHandler = (
      request: http.IncomingMessage,
      response: http.ServerResponse
    ) => {
      let incomingData = ''
      request.setEncoding('utf-8')
      request.on('data', (data: any) => {
        incomingData += data
      })
      request.on('end', () => {
        const command: ICommand = JSON.parse(incomingData)
        if (command.cmd) {
          switch (command.cmd) {
            case 'error':
              canvasWindow.webContents.send(ErrorOccurredChannel, command.arg)
              break
            case 'alt':
              canvasWindow.webContents.send(GraphSubstitutionChannel, command.arg)
              break
            default:
              break
          }
        }

        response.end()
      })
    }

    const server = http.createServer(requestHandler)
    server.listen(port)

    const initGraph = JSON.parse(fs.readFileSync(path.join(__dirname, '../../initGraph.json')).toString())
    createCanvasWindow(initGraph)
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (canvasWindow === null) {
      createCanvasWindow(null)
    }
  })
}

// Running scripts
initializeApp()
