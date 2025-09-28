const os  = require("os");
const path = require("path");
const Toastify = require("toastify-js");
const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('os', {
    homedir: ()=>os.homedir( )
})


contextBridge.exposeInMainWorld('path', {
    join:(...args)=> path.join(...args) ,
})


contextBridge.exposeInMainWorld('Toastify', {
    toast:(options) => Toastify(options).showToast(), 
})



contextBridge.exposeInMainWorld('ipcRenderer', {
    send:(channel, data)=> ipcRenderer.send(channel,data) ,
    on:(channel, func) => ipcRenderer.on(channel,(event, ...args)=> func(...args)),
})

// *** Yeni Eklenen Güvenli Path Fonksiyonu ***
contextBridge.exposeInMainWorld('webUtils', {
    // Renderer'dan gelen File objesini alır ve dosya yolunu döndürür.
    getFilePath: (file) => webUtils.getPathForFile(file), 
});


