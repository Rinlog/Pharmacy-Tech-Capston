import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images correctly
import camera from '../CarouselImage/boxes.jpg';
import dog from '../CarouselImage/handing.jpg';
import woman from '../CarouselImage/store.jpg';

function IndividualIntervalsExample() {
  return (
    <Carousel>
      <Carousel.Item interval={5000}>
        <img className="d-block w-100" src={camera} alt="Camera" height={300} width={400}/>
      </Carousel.Item>
      <Carousel.Item interval={5000}>
        <img className="d-block w-100" src={dog} alt="Medicine" height={300} width={400}/>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={woman} alt="Pills" height={300} width={400}/>
      </Carousel.Item>
    </Carousel>
  );
}

export default IndividualIntervalsExample;
