import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Interval } from '../components/Calendar';
import s from '../styles/App.module.scss';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { Buttons } from './Buttons/Buttons';
import { isPhone } from '../utils';
import { getDateOfMonday, isIntervalsAfter, isIntervalsBefore } from '../dateUtils';
import { DaySlider } from '../components/DaySlider/DaySlider';
import { useInitState } from './customHooks';
import { State } from '../types';
export const AppContext = React.createContext<State | null>(null);
export const App = () => {
  const state = useInitState();
  const {
    isResults,
    isAdmin,
    titleInput,
    focusDate,
    currentIntervals,
    previousInterval,
    relativelyTodayGoByDays,
    nextInterval,
  } = state;

  return (
    <AppContext.Provider value={state}>
      <div className={s.window}>
        <div className={s.header}>
          {isPhone() ? (
            <DaySlider
              className={s.daySlider}
              right={!isResults && isAdmin ? () => relativelyTodayGoByDays(1) : nextInterval}
              left={!isResults && isAdmin ? () => relativelyTodayGoByDays(-1) : previousInterval}
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

          {!isAdmin ? (
            <h1>{titleInput.value}</h1>
          ) : (
            <input
              {...titleInput.bind}
              placeholder="Название события"
              className={s.eventNameInput}
              maxLength={35}
            />
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Buttons />
          </div>
        </div>

        <Calendar />
      </div>
    </AppContext.Provider>
  );
};
