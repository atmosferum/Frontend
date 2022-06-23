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

const Home: NextPage = () => {
  const [adminIntervals, setAdminIntervals] = useState([]);
  const [myIntervals, setMyIntervals] = useState([]);
  const [dateOfMonday, setDateOfMonday] = useState(getDateOfMonday(new Date()));
  const [isResults, setIsResults] = useState(false);
  const draggingElement = useRef(null);
  const isAdmin = true;
  const title = 'Название события';

  function previousWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() - MS_IN_DAY * 7));
  }

  function nextWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() + MS_IN_DAY * 7));
  }

  function createEvent() {}

  function saveIntervals() {}

  function goToResults() {}

  function goToVoting() {}

  const Buttons = () => {
    if (isAdmin) {
      return (
        <Dialog trigger={<Button>Создать</Button>}>
          <div>
            <br />
            <Input style={{ width: '100%' }} placeholder="введите имя"></Input>
            <br />
            <Button style={{ width: '100%' }} onClick={createEvent}>
              Создать
            </Button>
          </div>
        </Dialog>
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
        {!isAdmin ? <h1>{title}</h1> : <Input placeholder="введите название события" />}
        <div>
          <Buttons />
        </div>
      </div>
      <Calendar {...propsForCalendar} />
    </div>
  );
};

export default Home;
