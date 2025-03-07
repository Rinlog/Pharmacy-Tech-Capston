import { useState, useRef, useEffect } from "react";
import $ from 'jquery'
import Image from 'react-bootstrap/Image'
import { pdfjs } from 'react-pdf';
import axios from "axios";
import { useLocation } from "react-router-dom";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
//converts a number range to another number range
function scale (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
export default function PrescriptionUpload({savedImage,setSavedImage, OrderID = "",setPreloaded = null, onlyRotate = false}) {
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(null);
  const [ImageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState("");
  const [LoadedOrderID, setLoadedOrderID] = useState(null);
  const fileInputRef = useRef(null);
  
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  function Animate(Div,x,y){
    Div.animate({ 
      left: `${x}px`,
      top: `${y}px`
    }, {duration:1,fill:"forwards"})
  }

  function setOverLay(Image,OverLay,relativePos,BoxSize){
    if (Image.width >= 500 && Image.height >= 500){
      
      //we map whatever max image lengths we can have to 0-whatever so it covers the whole preview size
      if (rotation == 0 || rotation == 360){
        let leftScale = scale(relativePos.left,1,Image.width-BoxSize[0],0,900)
        let topScale = scale(relativePos.top,1,Image.height-BoxSize[1],0,900)
        OverLay.css("background-position",(-(leftScale))+"px "+(-(topScale))+"px")
      }
      else if (rotation == 90){
        let leftScale = scale(relativePos.top,1,Image.height-BoxSize[1],0,900)
        let topScale = scale(relativePos.left,1,Image.width-BoxSize[0],900,0)
        OverLay.css("background-position",(-(leftScale))+"px "+(-(topScale))+"px")
      }
      else if (rotation == 180){
        let leftScale = scale(relativePos.left,1,Image.width-BoxSize[0],900,0)
        let topScale = scale(relativePos.top,1,Image.height-BoxSize[1],900,0)
        OverLay.css("background-position",(-(leftScale))+"px "+(-(topScale))+"px")
      }
      else if (rotation == 270){
        let leftScale = scale(relativePos.top,1,Image.height-BoxSize[1],900,0)
        let topScale = scale(relativePos.left,1,Image.width-BoxSize[0],0,900)
        OverLay.css("background-position",(-(leftScale))+"px "+(-(topScale))+"px")
      }
    }
  }
  function HoverBox(Image,CubeSizeX,CubeSizeY,OffsetX,OffsetY,WhiteSquare){
    if (!(OffsetX >= CubeSizeX && OffsetY >= CubeSizeY) || (OffsetX > Image.width-CubeSizeX || OffsetY > Image.height-CubeSizeY)){
            
      //top left
      if ((OffsetX <= CubeSizeX && OffsetY <= CubeSizeY)){
        let Clientx = 0
        let Clienty = 0
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //top right
      else if ((!(OffsetY >= CubeSizeY) && OffsetX >= Image.width-CubeSizeX)){
        let Clientx = Image.width-CubeSizeX*2
        let Clienty = 0
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //bottom left
      else if ((!(OffsetX >= CubeSizeX) && OffsetY >= Image.height-CubeSizeY)){
        let Clientx = 0
        let Clienty = Image.height-CubeSizeY*2
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //bottom right
      else if ((OffsetX > Image.width-CubeSizeX) && OffsetY >= Image.height-CubeSizeY){
        let Clientx = Image.width-CubeSizeX*2
        let Clienty = Image.height-CubeSizeY*2
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //left inbetween
      else if (!(OffsetX >= CubeSizeX)){
        let Clientx = 0
        let Clienty = OffsetY - CubeSizeY
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //top inbetween
      else if (!(OffsetY >= CubeSizeY)){
        let Clientx = OffsetX - CubeSizeX
        let Clienty = 0
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //right inbetween
      else if (OffsetX >= Image.width-CubeSizeX){
        let Clientx = Image.width-CubeSizeX*2
        let Clienty = OffsetY - CubeSizeY
        Animate(WhiteSquare,Clientx,Clienty)
      }
      //bottom inbetween
      else if (OffsetY >= Image.height-CubeSizeY){
        let Clientx = OffsetX - CubeSizeX
        let Clienty = Image.height-CubeSizeY*2
        Animate(WhiteSquare,Clientx,Clienty)
      }
    }
    else{
      let Clientx = OffsetX - CubeSizeX
      let Clienty = OffsetY - CubeSizeY
      Animate(WhiteSquare,Clientx,Clienty)
    }
  }
  useEffect(function(){
    if (savedImage != null || ImageLoaded == true){
      //only one image should be visible at a time
      let Image = $(".ImageStylingForUpload")[0]
      let Size = {}
      //choosing from a preset size because only images with matching width and height get a proper hover box that matchs the preview
      if (Image.clientWidth > 575  && Image.clientHeight > 575){
        Size.clientWidth = 600
        Size.clientHeight = 600
      }
      else if (Image.clientWidth > 550  && Image.clientHeight > 550){
        Size.clientWidth = 575
        Size.clientHeight = 575
      }
      else if (Image.clientWidth > 525  && Image.clientHeight > 525){
        Size.clientWidth = 550
        Size.clientHeight = 550
      }
      else if (Image.clientWidth > 500  && Image.clientHeight > 500){
        Size.clientWidth = 525
        Size.clientHeight = 525
      }
      else{
        Size.clientWidth = 500
        Size.clientHeight = 500
      }
      Image.style.width = Size.clientWidth + "px"
      Image.style.height = Size.clientHeight + "px"
      Image.parentNode.style.width = Size.clientWidth + "px"
      Image.parentNode.style.height = Size.clientHeight + "px"
      $("#HoverEffect").remove()
      const WhiteSquare = document.createElement("div")
      WhiteSquare.classList.add("hide")
      WhiteSquare.style.backgroundColor = "rgb(200,200,255,0.5)"
      //this calculates how big the box shadow should be based on the size of the image, 
      // the multiplication amount i got through trial and error, finding what made the preview line up with the shadow best
      let Width = (Size.clientWidth / 100) * 40
      let Height = (Size.clientHeight / 100) * 40

      WhiteSquare.style.height = Width + "px"
      WhiteSquare.style.width = Height + "px"
      WhiteSquare.style.zIndex = 999
      WhiteSquare.style.position = "absolute"
      WhiteSquare.style.pointerEvents = "none"
      WhiteSquare.id = "HoverEffect"
      Image.parentNode.insertBefore(WhiteSquare,Image)
      let move;
      let leave;
      let OverLay = $("#ImageOverLay")
      let OverLayLink = (savedImage == null) ? previewUrl : savedImage.previewUrl
      OverLay.css("background-image","url("+OverLayLink+")")
      Image.addEventListener("mousemove", move = function(ev){
        OverLay.removeClass("hide")
        //moves the blueish white square

        WhiteSquare.classList.remove("hide")

        let CubeSize = [Width/2, Height/2]//this is used for the box to no go off the screen, it is half the actual size
        
        let fullCubeSize = [Width,Height]

        if (rotation == 0 || rotation == 360){
          HoverBox(Image,CubeSize[0],CubeSize[1],ev.offsetX,ev.offsetY,WhiteSquare)
          OverLay.css("transform","rotate("+0+"deg)")
          //gets relative position of shadow box so we can move it appropriatly
          let rect = WhiteSquare.getBoundingClientRect()
          let Parentrect = WhiteSquare.parentElement.getBoundingClientRect()
          const relativePos = {}
          relativePos.left = rect.left - Parentrect.left
          relativePos.top = rect.top - Parentrect.top

          setOverLay(Image,OverLay,relativePos,fullCubeSize)
        }
        else if (rotation == 90){
          HoverBox(Image,CubeSize[0],CubeSize[1],Image.height - (ev.offsetY),(ev.offsetX),WhiteSquare)


          //gets relative position of shadow box so we can move it appropriatly
          OverLay.css("transform","rotate("+90+"deg)")
          let rect = WhiteSquare.getBoundingClientRect()
          let Parentrect = WhiteSquare.parentElement.getBoundingClientRect()
          const relativePos = {}
          relativePos.left = rect.left - Parentrect.left
          relativePos.top = rect.top - Parentrect.top

          setOverLay(Image,OverLay,relativePos,fullCubeSize)
        }
        else if (rotation == 180){
          HoverBox(Image,CubeSize[0],CubeSize[1],Image.width - (ev.offsetX),Image.height - (ev.offsetY),WhiteSquare)


          //gets relative position of shadow box so we can move it appropriatly
          OverLay.css("transform","rotate("+180+"deg)")
          let rect = WhiteSquare.getBoundingClientRect()
          let Parentrect = WhiteSquare.parentElement.getBoundingClientRect()
          const relativePos = {}
          relativePos.left = rect.left - Parentrect.left
          relativePos.top = rect.top - Parentrect.top

          setOverLay(Image,OverLay,relativePos,fullCubeSize)
        }
        else if (rotation == 270){
          HoverBox(Image,CubeSize[0],CubeSize[1],(ev.offsetY),Image.width - (ev.offsetX),WhiteSquare)


          //gets relative position of shadow box so we can move it appropriatly
          OverLay.css("transform","rotate("+270+"deg)")
          let rect = WhiteSquare.getBoundingClientRect()
          let Parentrect = WhiteSquare.parentElement.getBoundingClientRect()
          const relativePos = {}
          relativePos.left = rect.left - Parentrect.left
          relativePos.top = rect.top - Parentrect.top

          setOverLay(Image,OverLay,relativePos,fullCubeSize)
        }
      })
      Image.addEventListener("mouseleave",leave = function(ev){
        WhiteSquare.classList.add("hide")
        let OverLay = $("#ImageOverLay")
        OverLay.addClass("hide")
      })

      return(function(){
        Image.removeEventListener("mousemove",move)
        Image.removeEventListener("mouseleave",leave)
      })
    }
  },[rotation,savedImage, ImageLoaded])
  const handleFileChange = async (event) => {
    if (file){
      setError("An image is already selected. Please remove it before uploading a new one.");
      return;
    }
    if (savedImage) {
      setError("An image is already saved. Please remove it before uploading a new one.");
      return;
    }
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        setError("File size cannot exceed 2MB. Please select a smaller file.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      const url = URL.createObjectURL(uploadedFile);
      if (uploadedFile.type.includes("pdf")){
        let Image = await getPage(url,1)
        setPreviewUrl(Image)
        return;
      }
      setError("");

      setFile(uploadedFile);
      setPreviewUrl(url);
    }
  };
  //used to get a pdf page as an image
  async function getPage(url,pageNumber){
    let pdf = await pdfjs.getDocument(url).promise
    let Page = await pdf.getPage(pageNumber)
    const scale = "1";
    const viewport = Page.getViewport({
      scale: scale
    });
    //creating a canvas for the image
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height || viewport.viewBox[3]; /* viewport.height is NaN */
    canvas.width = viewport.width || viewport.viewBox[2];  /* viewport.width is also NaN */

    await Page.render({
      canvasContext:canvasContext, viewport:viewport
    }).promise

    
    canvas.toBlob(function(Blob){
      setFile(Blob)
    })
    return canvas.toDataURL()
  }
  function SetImageSize(e){
      let height = e.target.offsetHeight
      let width = e.target.offsetWidth
      setImageSize({width: width, height:height})
  }

  const handleRemove = () => {
    setFile(null);
    setImageLoaded(false)
    setPreviewUrl(null);
    setImageSize({ width: 0, height: 0 });
    setRotation(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  function handleRotate(){
    setRotation(rotation + 90)
    if (rotation == 360){
      setRotation(90)
    }
  }
  const handleSaveImage = async () => {
    if (file && previewUrl) {
      setSavedImage({file:file,previewUrl:previewUrl})
      handleRemove()
    }
  };
  //this is used to preload a saved image for an order if one exists
  useEffect(function(){
    async function LoadImage(OrderID){
      let response = await axios({
        url: "https://"+BackendIP+":"+BackendPort+"/api/order/getorderimagebyid",
        headers:{
          "Content-Type":"application/json",
          "Key-Auth":ApiAccess
        },
        method:"POST",
        responseType:"json",
        data:JSON.stringify(OrderID)
      })
      if (response.data.imagePath != "None"){
        setSavedImage({filePath:response.data.imagePath,previewUrl:response.data.imagePath,})
        setLoadedOrderID(OrderID)
        if (setPreloaded != null){setPreloaded(true)}
      }
      else{
        setLoadedOrderID(null)
        setSavedImage(null)
        if (setPreloaded != null){setPreloaded(false)}
        handleRemove()
      }
    }
    if (OrderID != ""){
      LoadImage(OrderID)

    }
  },[OrderID])
  const handleRemoveSavedImage = async () => {
    try{
      //if this is on the add order screen it will do a fake remove, otherwise it will fully remove it
      if (savedImage.filePath != undefined && LoadedOrderID != null){

        //delete image first
        let response = await axios({
          url: "https://"+BackendIP+":"+BackendPort+"/api/order/removeorderimage",
          headers:{
            "Content-Type":"application/json",
            "Key-Auth":ApiAccess
          },
          method:"POST",
          responseType:"json",
          data:JSON.stringify(savedImage.filePath)
        })
        //then remove association in db
        let response2 = await axios({
          url: "https://"+BackendIP+":"+BackendPort+"/api/order/updateOrderImagePathByID",
          headers:{
            "Content-Type":"application/json",
            "Key-Auth":ApiAccess
          },
          method:"POST",
          responseType:"json",
          data:JSON.stringify(LoadedOrderID +"~!~"+"None")
        })
      }
      if (setPreloaded != null){setPreloaded(false)}
      setSavedImage(null)
      handleRemove()
    }
    catch(error){
      if (error.response.data != undefined){
        setError(error.response.data)
      }
      else{
        setError("Could not remove image for unknown reason.. please try again later")
      }
    }
  };

  const calculateSize = (container) => {
    if (imageSize.width === 0 || imageSize.height === 0) {
      return { width: "auto", height: "auto" };
    }

    //flips width and height depending on rotation so things are accurate and fit in div
    if (rotation == 0 || rotation == 180){
      return {
        width: imageSize.width,
        height: imageSize.height,
        left: 0,
        top: 0,
      };
    }
    else if (rotation == 90 || rotation == 270){
      if (container == true){
        //if this is a the container we need to make it as big as possible
        return {
          width:600,
          height:600,
        }
      }
      //if width is bigger than height we need to center from the left
      if (imageSize.width > imageSize.height){
        return {
          width: imageSize.height,
          height: imageSize.width,
          left: 0,
          top:0
        };  
      }
      else{
        return {
          width: imageSize.height,
          height: imageSize.width,
          left: 0,
          top:0,
        };  
      }
    }
    else{
      return {
        width: imageSize.width,
        height: imageSize.height,
        left: 0,
        top: 0,
      };
    }
  };

  return (
    <div>
      <div id="ImageOverLay" className="hide"></div>
      {onlyRotate == false &&(
        <span>
              <h2>Upload Prescription Image</h2>
              <hr></hr>
              <input 
              type="file" 
              accept=".jpg,.png,.pdf" 
              onChange={handleFileChange} 
              className="hidden" 
              ref={fileInputRef} 
              />
        </span>
      )}

      <div>
      </div>
      <div>
        {previewUrl && (
          <>
            <button onClick={handleRotate}>Rotate</button>
            <button onClick={handleSaveImage}>Save Image</button>
            <button onClick={handleRemove}>Remove Image</button>
          </>
        ) || savedImage &&(
          <div>
            <button onClick={handleRotate}>Rotate</button>
            {onlyRotate == false && (
              <button onClick={handleRemoveSavedImage}>Remove Saved Image</button>
            )}
          </div>
        )}
      </div>
      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}
      {previewUrl && !error && (
        <div className="mt-4 UploadedImageContainer position-relative d-flex"
          style={{
            width: `${calculateSize(true).width}px`,
            height: `${calculateSize(true).height}px`,
          }}
        >
            <Image
              src={previewUrl}
              alt="Loaded"
              style={{
                transform: `rotate(${rotation}deg)`,
                width: `${calculateSize().width}px`,
                height: `${calculateSize().height}px`,
                left: `${calculateSize().left}px`,
                top: `${calculateSize().top}px`
              }}
              className="ImageStylingForUpload position-relative"
              onLoad={function(e){
                SetImageSize(e)
                setImageLoaded(true)
              }}
              >
              </Image>
        </div>
      )}
      {savedImage && (
        <div>
          <h2>Saved Image</h2>
          <div className="mt-4 UploadedImageContainer position-relative d-flex"
          style={{
            width: `${calculateSize(true).width}px`,
            height: `${calculateSize(true).height}px`,
          }}
        >
            <Image
              src={savedImage.previewUrl}
              alt="Saved"
              style={{
                transform: `rotate(${rotation}deg)`,
                width: `${calculateSize().width}px`,
                height: `${calculateSize().height}px`,
                left: `${calculateSize().left}px`,
                top: `${calculateSize().top}px`
              }}
              className="ImageStylingForUpload position-relative"
              onLoad={function(e){
                SetImageSize(e)
                setImageLoaded(true)
              }}
              >

              </Image>
        </div>
        </div>
      )}
    </div>
  );
}
