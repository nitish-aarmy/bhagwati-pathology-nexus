
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			// preload: path.join(__dirname, 'preload.js'),
		},
		show: false,
	});

	win.once('ready-to-show', () => {
		win.show();
	});

	if (isDev) {
		// Development: load Vite dev server
		const devURL = 'http://localhost:5173';
		console.log('DEV MODE: Loading', devURL);
		win.loadURL(devURL);
		win.webContents.openDevTools();
	} else {
		// Production: load built index.html
		const indexPath = path.join(__dirname, 'dist', 'index.html');
		console.log('__dirname:', __dirname);
		console.log('Loading:', indexPath);
		if (!fs.existsSync(indexPath)) {
			console.error('❌ dist/index.html not found. Did you run the frontend build?');
			return;
		}
		win.loadFile(indexPath)
			.catch((err) => {
				console.error('Failed to load index.html:', err);
			});
	}

	win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
		console.error('Failed to load:', errorDescription);
	});

	win.on('closed', () => {
		// Dereference window
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection:', reason);
});

