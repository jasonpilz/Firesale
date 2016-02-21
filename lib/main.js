'use strict'

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const fs = require('fs');

var mainWindow = null;

app.on('ready', () => {
  console.log('The application is ready');

  mainWindow = new BrowserWindow();

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

const openFile = () => {
  let files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files',
        extensions: ['md', 'markdown', 'txt'] }
    ]
  });

  if (!files) { return };

  let file = files[0];
  let content = fs.readFileSync(file).toString();

  mainWindow.webContents.send('file-opened', content);
};

exports.openFile = openFile;
