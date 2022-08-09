import React, { useState, useEffect } from 'react';
import s from './Carousel.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../Button';
import { ChevronLeft, ChevronRight } from 'react-feather';
const cx = classNames.bind(s);
interface ChildProps {
  children: any;
  width: any;
}
interface CarouselProps {
  childrens: any;
}

export function CarouselChild(props: any) {
  const { children, width } = props;
  return (
    <div className={cx('carousel-item')} style={{ width }}>
      {children}
    </div>
  );
}

function Carousel(props: any) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [disableLeft, setDisableLeft] = useState(true);
  const [disableRight, setDisablRight] = useState(false);
  const { children } = props;
  function updateIndex(newIndex: number) {
    if (newIndex === 0) {
      setDisableLeft(true);
    } else if (newIndex === React.Children.count(children) - 1) {
      setDisablRight(true);
    } else {
      setDisablRight(false);
      setDisableLeft(false);
    }
    setSlideIndex(newIndex);
  }
  return (
    <div className={cx('carousel')}>
      <div className={cx('inner')} style={{ transform: `translate(-${slideIndex * 100}%)` }}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, { width: '100%' });
        })}
      </div>
      <div className={cx('buttons')}>
        <Button onClick={() => updateIndex(slideIndex - 1)} variant="ghost" disabled={disableLeft}>
          <ChevronLeft />
        </Button>
        <Button onClick={() => updateIndex(slideIndex + 1)} variant="ghost" disabled={disableRight}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default Carousel;
