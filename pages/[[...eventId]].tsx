import type { NextPage } from 'next';
import Head from 'next/head';
import { Calendar } from '../components/Calendar';
import { useEffect, useRef, useState } from 'react';
import {
  currentUserGet,
  eventsIdGet,
  eventsIntervalsGet,
  eventsIntervalsPost,
  eventsPost,
  eventsResultGet,
  getDateOfMonday,
  loginPost,
} from '../utils';
import s from '../styles/index.module.scss';
import { Button } from '../components/Button';
import { MS_IN_DAY } from '../consts';
import { Input } from '../components/Input';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { Dialog } from '../components/Dialog';
import { useInput } from '../customHooks';
import { useCallback } from 'react';
import { Copyboard } from '../components/Copyboard/Copyboard';
import internal from 'stream';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const [adminIntervals, setAdminIntervals] = useState([]);
  const [myIntervals, setMyIntervals] = useState([]);
  const [resultsIntervals, setResultsIntervals] = useState([]);
  const [dateOfMonday, setDateOfMonday] = useState(getDateOfMonday(new Date()));
  const [participants, setParticipants] = useState(getDateOfMonday(new Date()));
  const [isResults, setIsResults] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventId, setEventId] = useState('');
  // const [isTitleError, setIsTitleError] = useState(false);
  // const [isNameError, setIsNameError] = useState(false);
  const name = useInput('');
  const titleInput = useInput('');
  const draggingElement = useRef(null);

  const router = useRouter();
  const queryEventId = router.query.eventId;
  useEffect(() => {
    const func = async () => {
      if (!router.isReady) return;
      const queryEventId = router.query.eventId?.[0];
      console.log(queryEventId);
      if (queryEventId) {
        console.log('enter11');
        setEventId(queryEventId);
        const adminIntervalsGet = await eventsIntervalsGet(queryEventId);
        console.log(adminIntervalsGet);
        // @ts-ignore
        setAdminIntervals(adminIntervalsGet);
        const { owner, title } = await eventsIdGet(queryEventId);
        titleInput.setValue(title);
        const user = await currentUserGet().catch(() => {
          console.log('err');
          setIsInputModalOpen(true);
        });
        if (owner.id === user?.id) {
          console.log('enter111');
          setIsAdmin(true);
          setIsResults(true);
        }
      } else {
        setIsAdmin(true);
      }
    };
    func();
  }, [router.isReady]);

  function previousWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() - MS_IN_DAY * 7));
  }

  function nextWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() + MS_IN_DAY * 7));
  }
  async function setResults() {
    const { intervals, participants } = await eventsResultGet(eventId);
    setResultsIntervals(intervals);
    setParticipants(participants);
  }
  async function createEvent() {
    console.log(name.value);
    loginPost({ name: name.value });
    const event = await eventsPost({
      title: titleInput.value,
      description: '',
    });
    const eventIdCreated = event.split('/')[event.split('/').length - 1];
    setEventId(eventIdCreated);
    eventsIntervalsPost(adminIntervals, eventIdCreated);
    setIsResults(true);
  }

  async function saveIntervals() {
    await eventsIntervalsPost(myIntervals, eventId);
  }

  async function goToResults() {
    await setResults();
    setIsResults(true);
  }

  async function goToVoting() {
    setIsResults(false);
  }

  const propsForCalendar = {
    resultsIntervals,
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
            setIsInputModalOpen={setIsInputModalOpen}
            isInputModalOpen={isInputModalOpen}
            eventId={eventId}
            titleInput={titleInput}
            adminIntervals={adminIntervals}
            myIntervals={myIntervals}
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
  isInputModalOpen,
  setIsInputModalOpen,
  eventId,
  titleInput,
  adminIntervals,
  myIntervals,
}: any) => {
  const prevUrl = 'http://localhost:3000/';
  if (isAdmin) {
    return (
      <div>
        <Button
          disabled={!titleInput.value || !adminIntervals.length}
          onClick={() => setIsInputModalOpen(true)}
        >
          Создать событие
        </Button>
        <Dialog close={() => setIsInputModalOpen(false)} open={isInputModalOpen}>
          {!isResults ? (
            <>
              <br />
              <Input style={{ width: '100%' }} {...name.bind} placeholder="введите имя" />
              <br />
              <Button onClick={createEvent} disabled={!name.value} style={{ width: '100%' }}>
                Сохранить
              </Button>
            </>
          ) : (
            <>
              <br />
              <Copyboard url={prevUrl + eventId} />
            </>
          )}
        </Dialog>
      </div>
    );
  } else {
    if (isResults) {
      return <Button onClick={goToVoting}>К голосованию</Button>;
    } else {
      return (
        <>
          <Button onClick={goToResults}>Результаты</Button>
          <Button disabled={!myIntervals.length} onClick={saveIntervals}>
            Сохранить
          </Button>
          <Dialog close={() => setIsInputModalOpen(false)} open={isInputModalOpen}>
            <br />
            <Input style={{ width: '100%' }} {...name.bind} placeholder="введите имя" />
            <br />
            <Button
              onClick={() => {
                loginPost({ name: name.value });
                setIsInputModalOpen(false);
              }}
              disabled={!name.value}
              style={{ width: '100%' }}
            >
              Сохранить
            </Button>
          </Dialog>
        </>
      );
    }
  }
};
export default Home;
