const {
    app,
    BrowserWindow,
    ipcMain,
    nativeTheme,
    Notification,
} = require("electron");

// include the Node.js 'path' module at the top of your file
const path = require("path");

// modify your existing createWindow() function
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadFile("index.html");

    ipcMain.handle("dark-mode:toggle", () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = "light";
        } else {
            nativeTheme.themeSource = "dark";
        }
        return nativeTheme.shouldUseDarkColors;
    });

    ipcMain.handle("dark-mode:system", () => {
        nativeTheme.themeSource = "system";
    });
};

const NOTIFICATION_TITLE = "Basic Notification";
const NOTIFICATION_BODY = "Notification from the Main process";

function showNotification() {
    new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
    }).show();
}

app.whenReady()
    .then(() => {
        createWindow();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    })
    .then(showNotification);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
