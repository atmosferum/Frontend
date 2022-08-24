import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Interval } from '../components/Calendar';
import s from './App.module.scss';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { Buttons } from './Buttons/Buttons';
import { isPhone } from '../utils';
import { getDateOfMonday, isIntervalsAfter, isIntervalsBefore } from '../dateUtils';
import { DaySlider } from '../components/DaySlider/DaySlider';
import { useInitState } from './useInitState';
import { State } from '../types';
import TimeClicker from '../components/TimeClicker/TimeClicker';
import { useAppSelector } from '../hooks/redux';
import { useActions } from '../hooks/actions';
import { createSelector } from 'reselect';
import { selectCurrentIntervals } from '../store/selectors';
import Carousel, { CarouselChild } from '../components/Carousel/Carousel';
export const AppContext = React.createContext<State | null>(null);

function Instruction() {
  return (
    <div
      style={{
        position: 'fixed',
        right: '3%',
        bottom: '3%',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <Carousel>
        <CarouselChild>
          <p>1. Выделите интервалы времени, когда возможно провести событие</p>
          <div
            style={{
              backgroundImage:
                'url("https://static.tildacdn.com/tild3238-6134-4461-b734-383265623636/image.png")',
            }}
            className={s.img}
          ></div>
        </CarouselChild>
        <CarouselChild>
          <p>2. Скопируйте ссылку и отправьте её участникам события</p>
          <div
            style={{
              backgroundImage:
                'url("https://static.tildacdn.com/tild6166-6438-4539-b732-316532663631/image.png")',
            }}
            className={s.img}
          ></div>
        </CarouselChild>
        <CarouselChild>
          <p>3. Голосующие выделят интервалы, когда им удобно участвовать в событии</p>
          <div
            style={{
              backgroundImage:
                'url("https://static.tildacdn.com/tild3437-3363-4331-a635-616366373433/image.png")',
            }}
            className={s.img}
          ></div>
        </CarouselChild>
        <CarouselChild>
          <p>4. В результате вы получите оптимальные интервалы времени с большинством участников</p>
          <div
            style={{
              backgroundImage:
                'url("https://static.tildacdn.com/tild3035-6537-4230-b866-333262663764/image.png")',
            }}
            className={s.img}
          ></div>
        </CarouselChild>
      </Carousel>
    </div>
  );
}

export const App = () => {
  const reduxState = useAppSelector((state) => state.store);
  const state = useInitState();
  const { isResults, isAdmin, focusDate } = reduxState;

  const { titleInput } = state;
  const currentIntervals = useAppSelector(selectCurrentIntervals);
  const { nextInterval, relativelyTodayGoByDays } = useActions();

  return (
    <AppContext.Provider value={state}>
      <div className={s.window}>
        <div className={s.header}>
          {isPhone() ? (
            <DaySlider
              className={s.daySlider}
              right={
                !isResults && isAdmin
                  ? () => relativelyTodayGoByDays(1)
                  : () => nextInterval('next')
              }
              left={
                !isResults && isAdmin
                  ? () => relativelyTodayGoByDays(-1)
                  : () => nextInterval('previous')
              }
              highlightLeft={isIntervalsBefore(currentIntervals, focusDate)}
              highlightRight={isIntervalsAfter(currentIntervals, focusDate)}
              date={focusDate}
            />
          ) : (
            <WeekSlider
              right={() => relativelyTodayGoByDays(7)}
              left={() => relativelyTodayGoByDays(-7)}
              highlightLeft={isIntervalsBefore(currentIntervals, focusDate)}
              highlightRight={isIntervalsAfter(currentIntervals, focusDate)}
              date={getDateOfMonday(focusDate)}
            />
          )}

          {!isAdmin || isResults ? (
            <h1>{titleInput.value}</h1>
          ) : (
            <input
              {...titleInput.bind}
              placeholder="Название события"
              className={s.eventNameInput}
              maxLength={35}
            />
          )}
          <div className={s.buttonsWrapper}>
            <Buttons />
          </div>
        </div>

        <Calendar />
      </div>
      <TimeClicker />
      <Instruction />
    </AppContext.Provider>
  );
};
