import styles from './style.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../Button/index';
import { ChevronLeft, ChevronRight } from 'react-feather';

const cx = classNames.bind(styles);

interface WeekSliderProps {
  text?: string;
}

export function WeekSlider(props: WeekSliderProps) {
  return (
    <div className={cx('week-slider')}>
      <button className={cx('slider slider--left')}>
        <ChevronLeft size="1rem" />
      </button>
      <div className={cx('date-div')}>
        <span className={cx('date-span')}>{props.text}</span>
      </div>
      <button className={cx('slider slider--right')}>
        <ChevronRight size="1rem" />
      </button>
    </div>
  );
}
