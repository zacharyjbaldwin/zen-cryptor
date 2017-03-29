var { app, BrowserWindow } = require('electron');
var path = require('path');
var url = require('url');

app.on('ready', function() {
    var window = new BrowserWindow({
        fullscreenable: false,
        height: 700,
        maximizable: true,
        minHeight: 700,
        minWidth: 1025,
        show: false,
        width: 1025
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    window.once('ready-to-show', function() {
        window.show();
    });
});