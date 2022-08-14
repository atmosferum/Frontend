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
import { useAppSelector, useCurrentIntervals } from '../hooks/redux';
import { useActions } from '../hooks/actions';
export const AppContext = React.createContext<State | null>(null);
export const App = () => {
  const reduxState = useAppSelector((state) => state.store);
  const state = useInitState();
  const { isResults, isAdmin, focusDate } = reduxState;

  const { titleInput } = state;
  const currentIntervals = useCurrentIntervals();
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
    </AppContext.Provider>
  );
};
