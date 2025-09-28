const { app, BrowserWindow ,Menu , ipcMain, shell}= require("electron");

const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require("resize-img");

process.env.NODE_ENV = "production";
const isMac = process.platform==="darwin";
const isDev = process.env.NODE_ENV !==`production` ; 

async function startApp() {
    await app.whenReady();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        }
    })
    createMainWindow();

    // Implement Menu 
    let mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
}

let mainWindow;

function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: "Image Resizer",
        width: isDev ? 1000: 500,
        height:600,
        webPreferences: {
          contextIsolation:true,
          nodeIntegration:true,

          preload: path.join(__dirname, "preload.js"),
        }
    });
    // dev tools 
    if(isDev){
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}


// about page 

let aboutPage ; 
function createAboutWindow(){
    aboutPage = new BrowserWindow({
        title: "About Image Resizer",
        width: 300,
        height:300,
    });
  
    aboutPage.loadFile(path.join(__dirname, "./renderer/about.html"));

}

// menu template 
// const  menu =[{
//     label: "File",
//     submenu:[{
//         label: "Quit",
//         click: ()=> app.quit() ,
//         accelerator:"CmdOrCtrl + W "
//     }]
// }]; 

// or 
// Menu template 
const menu = [
  // macOS uygulama menüsü
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: "about", label: `About ${app.name}` , click: createAboutWindow ,},
      { type: "separator" },
      { role: "quit", label: `Quit ${app.name}`}
    ]
  }] : []),

  // File menüsü
  { role: "fileMenu" },

  // Help menüsü (macOS dışında)
  ...(!isMac ? [{
    label: "Help",
    submenu: [
      { label: "About" , click: createAboutWindow,
      }  // istersen buraya tıklanınca kendi popup pencereni açabilirsin
    ]
  }] : [])
];

/// responde renderer

ipcMain.on("image:resize", (event, data) => {
  console.log("Renderer'dan gelen veri:", data);
  ResizeImage(data);
});

async function ResizeImage({imgPath , width, height, dest}){
  try{
    const newPath  = await resizeImg(fs.readFileSync(imgPath),{
      width:+width,
      height:+height
    });

    // new file path and name 
    const fileName = path.basename(imgPath);

    if(!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }

    //write file to dest 
    fs.writeFileSync(path.join(dest,fileName), newPath);

    // successs
    mainWindow.webContents.send("image:done");

    // open new image 
    shell.openPath(dest);
  }
  catch(err){
    console.log(err);
  }

}



app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

startApp();


// npx electronmon . // değişiklikleri görmek için 