const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isProd = process.env.NODE_ENV === 'production';

  const startUrl = isProd
    ? 'http://localhost:3000' // replace with your deployed frontend URL
    : 'http://localhost:3000';

  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
