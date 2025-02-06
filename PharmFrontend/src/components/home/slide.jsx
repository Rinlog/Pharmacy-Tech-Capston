import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images correctly
import camera from '../CarouselImage/pharmtech.jpg';
import dog from '../CarouselImage/crossedarms.jpg';
import woman from '../CarouselImage/store.jpg';
import papers from '../CarouselImage/papers.jpg';

function homepageslide() {
  return (
    <div className='CarouselSizing'>
        <div className='carousel slide'>
        <Carousel>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100" src={camera} alt="Camera" height={300} />
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100" src={dog} alt="Medicine" height={300} />
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100" src={papers} alt="Medicine" height={300} />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={woman} alt="Pills" height={300} />
          </Carousel.Item>
        </Carousel>
    </div>
    </div>
  );
}

export default homepageslide;
