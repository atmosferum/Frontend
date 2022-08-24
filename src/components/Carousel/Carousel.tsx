import React, { useState, useEffect } from 'react';
import s from './Carousel.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../Button';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Cross } from '../Calendar/DayTimeline/Intervals/cross';
import { useAppSelector } from '../../hooks/redux';

const cx = classNames.bind(s);

interface ChildProps {
  children: any;
  width?: any;
}

export function CarouselChild(props: ChildProps) {
  const { children, width } = props;
  return (
    <div className={cx('carousel-item')} style={{ width }}>
      <div>{children}</div>
    </div>
  );
}

function Carousel(props: any) {
  const { currentUser, isAdmin, isResults } = useAppSelector((state) => state.store);

  const slide = isResults ? 3 : isAdmin ? 0 : 2;
  const [slideIndex, setSlideIndex] = useState(slide);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (currentUser !== undefined) setShow(!currentUser);
  }, [currentUser]);
  useEffect(() => setSlideIndex(slide), [slide]);
  const { children } = props;

  return (
    <>
      <div className={cx('carousel', show ? 'show' : 'hide')}>
        <div
          onClick={() => setShow(false)}
          style={{ zIndex: 100, position: 'absolute', top: 5, right: 5, cursor: 'pointer' }}
        >
          <Cross />
        </div>
        <div className={cx('inner')} style={{ transform: `translate(-${slideIndex * 100}%)` }}>
          {React.Children.map(children, (child, index) => {
            return React.cloneElement(child, { width: '100%' });
          })}
        </div>
        <div className={cx('buttons')}>
          <Button
            onClick={() => setSlideIndex(slideIndex - 1)}
            variant="ghost"
            disabled={slideIndex === 0}
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => setSlideIndex(slideIndex + 1)}
            variant="ghost"
            disabled={slideIndex === React.Children.count(children) - 1}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className={s.icon} onClick={() => setShow(true)}></div>
    </>
  );
}

export default Carousel;
