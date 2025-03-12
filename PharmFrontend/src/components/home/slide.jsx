import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery'
// Import images correctly
import camera from '../CarouselImage/pharmtech.jpg';
import dog from '../CarouselImage/crossedarms.jpg';
import woman from '../CarouselImage/store.jpg';
import papers from '../CarouselImage/papers.jpg';
import { useState } from 'react';
function homepageslide() {
   const [Loaded,setLoaded] = useState(false)
   const loadingSVG = (
    <svg className="pictures-rounded loadingAnim" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="e59qthQWJXs1" viewBox="0 0 1920 1080" shapeRendering="geometricPrecision" textRendering="geometricPrecision" project-id="48827d0584e448e09aaf5ea0a40cd5c2" export-id="401eec5ea37b4e3a81e63ec0c59192be" cached="false">
        <defs>
            <linearGradient id="e59qthQWJXs4-fill" x1="0" y1="0.5" x2="1" y2="0.5" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)">
                <stop id="e59qthQWJXs4-fill-0" offset="0%" stopColor="rgba(255,255,255,0)"/>
                <stop id="e59qthQWJXs4-fill-1" offset="90%" stopColor="#015872"/>
                <stop id="e59qthQWJXs4-fill-2" offset="100%" stopColor="#015872"/>
            </linearGradient>
            <linearGradient id="e59qthQWJXs5-fill" x1="0.5" y1="0" x2="0.5" y2="1" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)">
                <stop id="e59qthQWJXs5-fill-0" offset="0%" stopColor="rgba(255,255,255,0)"/>
                <stop id="e59qthQWJXs5-fill-1" offset="100%" stopColor="#010022"/>
            </linearGradient>
        </defs>
        <g id="e59qthQWJXs2" transform="matrix(0.942769 0 0 1 54.941763 0) scale(3,3) translate(-650,-350)">
            <path d="M1130.35584,528.04c0-80.38524,68.74305-145.55036,153.5419-145.55036s153.5419,65.16512,153.5419,145.55036c0,4.02696-.17252,8.01572-.51092,11.96h-20.81854c.39993-3.93612.60449-7.92566.60449-11.96c0-68.78407-59.46417-124.54458-132.81693-124.54458s-132.81693,55.76051-132.81693,124.54458c0,3.28272.13544,6.53578.40137,9.75454h-20.78698c-.22505-3.22395-.33935-6.47659-.33935-9.75454h-.00001Z" transform="translate(-323.897737 11.558554)" fill="#015872" strokeWidth="0"/><path d="M1303.18381,672.45322v-21.17213c60.84755-8.29995,108.32094-55.28426,113.12949-113.48655h20.78698c-4.86864,69.74695-61.56546,126.06358-133.91648,134.65868h.00001Z" transform="translate(-324.069337 13.077279)" fill="url(#e59qthQWJXs4-fill)" strokeWidth="0"/>
        </g>
    </svg>
    )
  return (
    <div className='CarouselSizing'>
        <div className='carousel slide'>
        {Loaded == false && loadingSVG}
        <Carousel id="CarouselMain" className='hide' onLoad={function(e){
            $(e.target).removeClass("hide")
            $("#CarouselMain").removeClass("hide")
            setLoaded(true);
          }}>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100 hide" src={camera} alt="Camera" height={300} />
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100 hide" src={dog} alt="Medicine" height={300} />
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100 hide" src={papers} alt="Medicine" height={300} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 hide" src={woman} alt="Pills" height={300} />
          </Carousel.Item>
        </Carousel>
    </div>
    </div>
  );
}

export default homepageslide;
