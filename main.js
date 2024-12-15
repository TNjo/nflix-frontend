// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Function to create the main window
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration for security
      contextIsolation: true, // Enable context isolation for security
      preload: path.join(__dirname, 'preload.js') // Optional: Preload script
    }
  });

  // Check if the app is running in development mode or production mode
  const isDev = process.argv.includes('--dev');

  if (isDev) {
    // Load the React app from the development server
    mainWindow.loadURL('http://localhost:3000');
    // Open Developer Tools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // Load the production build of the React app
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  // Handle window close
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
