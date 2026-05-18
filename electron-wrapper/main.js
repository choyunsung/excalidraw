const { app, BrowserWindow, Menu, protocol, shell, net } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");

const APP_DIR = path.join(__dirname, "app");
const SCHEME = "excalidraw";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font-woff",
  ".woff2": "font-woff2",
  ".ttf": "font-ttf",
  ".otf": "font-otf",
  ".wasm": "application/wasm",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

// Must run before app.whenReady() so the scheme is treated like https for
// origin purposes — gives us a stable origin (e.g. excalidraw://app/) so the
// renderer's localStorage / IndexedDB persist across launches.
protocol.registerSchemesAsPrivileged([
  {
    scheme: SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      allowServiceWorkers: true,
      stream: true,
    },
  },
]);

function resolveFile(requestUrl) {
  const { pathname } = new url.URL(requestUrl);
  let relative = decodeURIComponent(pathname);
  if (relative.endsWith("/")) {
    relative += "index.html";
  }
  let filePath = path.join(APP_DIR, relative);
  if (!filePath.startsWith(APP_DIR)) {
    return null;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback to index.html for any unknown route
    filePath = path.join(APP_DIR, "index.html");
  }
  return filePath;
}

function registerProtocol() {
  protocol.handle(SCHEME, async (request) => {
    const filePath = resolveFile(request.url);
    if (!filePath) {
      return new Response("Forbidden", { status: 403 });
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    const fileUrl = url.pathToFileURL(filePath).toString();
    const response = await net.fetch(fileUrl);
    return new Response(response.body, {
      status: 200,
      headers: { "Content-Type": mime, "Cache-Control": "no-cache" },
    });
  });
}

async function createWindow() {
  registerProtocol();

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Excalidraw",
    backgroundColor: "#ffffff",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // Explicit partition makes the storage location predictable and
      // persistent for the renderer's localStorage / IDB.
      partition: "persist:main",
    },
  });

  win.webContents.setWindowOpenHandler(({ url: openUrl }) => {
    shell.openExternal(openUrl);
    return { action: "deny" };
  });

  win.loadURL(`${SCHEME}://app/`);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const template = [
  { role: "appMenu" },
  { role: "editMenu" },
  { role: "viewMenu" },
  { role: "windowMenu" },
];
Menu.setApplicationMenu(Menu.buildFromTemplate(template));
