'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');
const url = require('url');
const fs = require('fs');
const electron = require('electron');
const shell = electron.shell;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let printWindow;
let barcodePrintWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1200, height: 1000, webPreferences: {
    nodeIntegration: true
  } })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    console.log(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
  await installVueDevtools()
} catch (e) {
  console.error('Vue Devtools failed to install:', e.toString())
}

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


//// Printing bits
ipcMain.on('plate:print', function(event, plateObject) {
  const printOptions = {
      deviceName: 'TSC TTP-247',
      silent: true
  };
  mainWindow.webContents.print(printOptions);

});

ipcMain.on("printRenderedHandler", function(event) {
  printWindow.webContents.send("printPlate",'print');
});

ipcMain.on("sendPlateToPrinterHandler", function(event) {
  console.log('Ok...print it!');
  /*
  dialog.showMessageBox({
      type: "info",
      title: "Plate has been printed",
      message: "This is when the plate will be printed. This is for the demo purposes only."
  });
  */
  
  //alert('This is when the plate will be printed. This is for the demo purposes only.');
  const printOptions = {
    printBackground: false,
    silent: false
  };
  printWindow.webContents.print(printOptions);
  

  /*
  let pdfSettings = function() {
    var pageSize = {
      height: 111000,
      width: 530000
    };
    var option = {
        landscape: true,
        marginsType: 2,
        printBackground: false,
        printSelectionOnly: false,
        pageSize: pageSize
    };
    return option;
  }

  console.log('Ok...pdf it');
  var pdfPath = path.join(__dirname, '/print.pdf');
  console.log(pdfPath);
  const pdfSettingsObj = pdfSettings();

  try {
    printWindow.webContents.printToPDF(pdfSettingsObj, function(err, data) {
      console.log('Ok...');
      console.log(data);
      if (err) {
        console.log(err);
        return;
      }
  
      try {
        fs.writeFileSync(pdfPath, data);
      }
      catch(errord) {
        console.log("Tried but: ", errord)
      }
    });
  }
  catch (printError) {
    console.log("print but: ", printError)
  }
  */
  
});

ipcMain.on("printPlateHandler", function(event, content) {
  printWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  printWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'platePrint.html'),
      protocol: 'file:',
      slashes: true
  }));
  

  printWindow.webContents.on('did-finish-load', function() {
    console.log("Sending this to print windows: ", content);
    printWindow.webContents.send("preparePrint", content);
  });
  
});

///// Barcode printing
ipcMain.on("printBarcodeHandler", function(event, content) {
  barcodePrintWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  barcodePrintWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'barcodePrint.html'),
      protocol: 'file:',
      slashes: true
  }));
  

  barcodePrintWindow.webContents.on('did-finish-load', function() {
    console.log("Sending this to print barcode windows: ", content);
    barcodePrintWindow.webContents.send("prepareBarcodePrint", content);
  });
  
});

ipcMain.on("barcodePrintRenderedHandler", function(event) {
  barcodePrintWindow.webContents.send("barcodePrint",'print');
});

ipcMain.on("sendBarcodeToPrinterHandler", function(event) {
  console.log('Ok...print it!');
  /*
  dialog.showMessageBox({
      type: "info",
      title: "Plate has been printed",
      message: "This is when the plate will be printed. This is for the demo purposes only."
  });
  */
  //alert('This is when the plate will be printed. This is for the demo purposes only.');
  const printOptions = {
    printBackground: false,
    silent: false
  };
  barcodePrintWindow.webContents.print(printOptions);
  
});