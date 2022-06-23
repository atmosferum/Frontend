import type { NextPage } from 'next';
import Head from 'next/head';
import { Calendar } from '../components/Calendar';
import { useRef, useState } from 'react';
import { getDateOfMonday } from '../utils';
import s from '../styles/index.module.scss';
import { Button } from '../components/Button';
import { MS_IN_DAY } from '../consts';
import { Input } from '../components/Input';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { Dialog } from '../components/Dialog';
import { useInput } from '../customHooks';
import { useCallback } from 'react';
import { Copyboard } from '../components/Copyboard/Copyboard';

const Home: NextPage = () => {
  const [adminIntervals, setAdminIntervals] = useState([]);
  const [myIntervals, setMyIntervals] = useState([]);
  const [dateOfMonday, setDateOfMonday] = useState(getDateOfMonday(new Date()));
  const [isResults, setIsResults] = useState(false);
  const name = useInput('');
  const titleInput = useInput('');
  const draggingElement = useRef(null);
  const isAdmin = false;
  function previousWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() - MS_IN_DAY * 7));
  }

  function nextWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() + MS_IN_DAY * 7));
  }

  async function createEvent() {
    console.log(name.value);
    if (!name.value) return;
    setIsResults(true);
  }

  async function saveIntervals() {}

  async function goToResults() {
    setIsResults(true);
  }

  async function goToVoting() {
    setIsResults(false);
  }

  const propsForCalendar = {
    adminIntervals,
    myIntervals,
    draggingElement,
    dateOfMonday,
    setIntervals: isAdmin ? setAdminIntervals : setMyIntervals,
    isAdmin,
    isResults,
  };
  return (
    <div className={s.window}>
      <Head>
        <title>Time Manager</title>
      </Head>
      <div className={s.header}>
        <WeekSlider right={nextWeek} left={previousWeek} date={dateOfMonday} />
        {!isAdmin ? (
          <h1>{titleInput.value}</h1>
        ) : (
          <Input {...titleInput.bind} placeholder="введите название события" />
        )}
        <div>
          <Buttons
            isAdmin={isAdmin}
            isResults={isResults}
            name={name}
            goToVoting={goToVoting}
            goToResults={goToResults}
            saveIntervals={saveIntervals}
            createEvent={createEvent}
          />
        </div>
      </div>
      <Calendar {...propsForCalendar} />
    </div>
  );
};
const Buttons = ({
  isResults,
  isAdmin,
  name,
  createEvent,
  goToVoting,
  goToResults,
  saveIntervals,
}: any) => {
  if (isAdmin) {
    return (
      <div>
        <Dialog trigger={<Button>создать событие</Button>}>
          {!isResults ? (
            <>
              <br />
              <Input style={{ width: '100%' }} {...name.bind} placeholder="введите имя" />
              <br />
              <Button onClick={createEvent} style={{ width: '100%' }}>
                сохранить
              </Button>
            </>
          ) : (
            <>
              <br />
              <Copyboard url={'pornhub.com'} />
            </>
          )}
        </Dialog>
      </div>
    );
  } else {
    if (isResults) {
      return <Button onClick={goToVoting}>к голосованию</Button>;
    } else {
      return (
        <>
          <Button onClick={goToResults}>Результаты</Button>
          <Button onClick={saveIntervals}>Сохранить</Button>
        </>
      );
    }
  }
};
export default Home;
