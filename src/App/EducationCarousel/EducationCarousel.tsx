import React from 'react';
import Carousel, { CarouselChild } from '../../components/Carousel/Carousel';

interface IProps {}

const EducationCarousel = (props: IProps) => {
  return (
    <div
      style={{ width: '700px', position: 'absolute', zIndex: 100000, inset: 'auto 10px 10px auto' }}
    >
      <Carousel>
        <CarouselChild>1</CarouselChild>
        <CarouselChild>2</CarouselChild>
        <CarouselChild>3</CarouselChild>
      </Carousel>
    </div>
  );
};

export default EducationCarousel;
