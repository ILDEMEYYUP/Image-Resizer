
const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');



function LoadImage(event){
    const file = event.target.files[0];
    if(!isImage(file)){
        errorMessage("please enter a file ");
        return ; 
    }
    successMessage("success");

    // get original dimensions 
    const image = new Image ();
    image.src= URL.createObjectURL(file);
    image.onload= function(){
        widthInput.value = this.width ;
        heightInput.value = this.height; 
    }

    form.style.display="block";
    filename.innerText=file.name ; 
    outputPath.innerText = path.join(os.homedir(), "imageResizer");

}

// send image to main procees 

function sendImage(e){
    e.preventDefault();
    const height= heightInput.value;
    const width= widthInput.value ; 
    const file = img.files[0];
    const imgPath = window.webUtils.getFilePath(file); 
    
    if(height==='' || width ===''){
        errorMessage("enter a width and height value ");
        return ; 
    }
    // send to main using IPc renderer 
    window.ipcRenderer.send('image:resize', {
    imgPath,
    height,
    width,
    dest: path.join(os.homedir(), "imageResizer")
  });

}


// checking is file image 

function isImage(file){
    const acceptedTypes = ["image/png","image/gif","image/jpeg"];

    return file && acceptedTypes.includes(file["type"]); 
}


// respond main 

ipcRenderer.on("image:done", ()=>{
    successMessage("image resized succesfully");
})


// alert message 
function errorMessage(message){
    Toastify.toast({
        text:message,
        duration:3000,
        close:false,
        style:{
            color:"white",
            background:"red",
            textAlign:"center",
        }
    })
}
function successMessage(message){
    Toastify.toast({
        text:message,
        duration:3000,
        close:false,
        style:{
            color:"white",
            background:"green",
            textAlign:"center",
        }
    })

}


img.addEventListener("change", LoadImage);
form.addEventListener("submit",sendImage);