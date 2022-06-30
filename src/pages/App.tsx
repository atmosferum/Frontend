import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Interval } from '../components/Calendar';
import {
  convertIntervalToFrontend,
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
import { Copyboard } from '../components/Copyboard/Copyboard';
import * as Icon from 'react-feather';
// TODO добавить кнопку загрузки актуальных интервалов
// TODO сделать кнопку учасников во всех состояниях

export const App = () => {
  const [adminIntervals, setAdminIntervals] = useState<Interval[]>([]);
  const [myIntervals, setMyIntervals] = useState<Interval[]>([]);
  const [resultsIntervals, setResultsIntervals] = useState<Interval[]>([]);
  const [dateOfMonday, setDateOfMonday] = useState(getDateOfMonday(new Date()));
  const [participants, setParticipants] = useState<any[]>([]);
  const [isResults, setIsResults] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventId, setEventId] = useState('');
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const name = useInput('');
  const titleInput = useInput('');
  const draggingElement = useRef(null);

  const queryEventId = location.pathname.substring(1);
  useEffect(() => {
    const func = async () => {
      if (queryEventId) {
        await setResults(queryEventId);
        setEventId(queryEventId);
        const eventIntervals = await eventsIntervalsGet(queryEventId);
        const { owner, title } = await eventsIdGet(queryEventId);
        titleInput.setValue(title);
        const user = await currentUserGet().catch(console.log);
        setAdminIntervals(
          convertIntervalToFrontend(
            eventIntervals.filter(
              (interval: { owner: { id: any } }) => interval.owner.id === owner.id,
            ),
          ),
        );
        setMyIntervals(
          convertIntervalToFrontend(
            eventIntervals.filter(
              (interval: { owner: { id: any } }) => interval.owner.id === user.id,
            ),
          ),
        );
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
  }, []);

  function previousWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() - MS_IN_DAY * 7));
  }

  function nextWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() + MS_IN_DAY * 7));
  }

  async function setResults(eventId: string) {
    const { intervals, participants, event } = await eventsResultGet(eventId);
    setResultsIntervals(convertIntervalToFrontend(intervals) as any);
    setParticipants(
      participants.map((user: { id: any }) => ({
        ...user,
        isAdmin: user.id === event.owner.id,
      })),
    );
  }

  async function createEvent() {
    setIsInputModalOpen(true);
    const { name } = await currentUserGet();
    if (!name) return;
    const event = await eventsPost({
      title: titleInput.value,
      description: '',
    });
    const eventIdCreated = event.split('/')[event.split('/').length - 1];
    setEventId(eventIdCreated);
    await eventsIntervalsPost(adminIntervals, eventIdCreated);
    await setResultsIntervals(adminIntervals);
    setIsResults(true);
  }

  async function saveIntervals() {
    await currentUserGet().catch(() => {
      setIsInputModalOpen(true);
    });
    await eventsIntervalsPost(myIntervals, eventId);
  }

  async function goToResults() {
    await setResults(eventId);
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
      <div className={s.header}>
        <WeekSlider right={nextWeek} left={previousWeek} date={dateOfMonday} />
        {!isAdmin ? (
          <h1>{titleInput.value}</h1>
        ) : (
          <input {...titleInput.bind} placeholder="Название события" className={s.eventNameInput} />
        )}
        <div>
          {participants.length > 0 && (
            <Dialog
              title="Участники"
              open={isParticipantsModalOpen}
              close={() => setIsParticipantsModalOpen(false)}
            >
              <div className={s.participantsModalContent}>
                {participants.map((participant) => (
                  <p className={s.user} key={participant.id}>
                    {participant.name}{' '}
                    <span style={{ color: 'var(--success-dark)' }}>
                      {participant.isAdmin && 'Организатор'}
                    </span>
                  </p>
                ))}
              </div>
            </Dialog>
          )}
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
            showParticipantsModal={() => {
              setIsParticipantsModalOpen(true);
            }}
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
  showParticipantsModal,
}: any) => {
  const getHost = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/`;
    }
    return '';
  };

  if (isAdmin) {
    return (
      <div>
        <Button disabled={!titleInput.value || !adminIntervals.length} onClick={createEvent}>
          {isResults ? 'Копировать ссылку' : 'Создать событие'}
        </Button>
        <Dialog
          close={() => setIsInputModalOpen(false)}
          open={isInputModalOpen}
          title={isResults ? 'Событие создано' : 'Введите имя'}
        >
          {!isResults ? (
            <>
              <br />
              <Input style={{ width: '100%' }} {...name.bind} placeholder="Иван Иванов" />
              <br />
              <Button
                onClick={() => {
                  loginPost({ name: name.value }).then(() => createEvent());
                }}
                disabled={!name.value}
                style={{ width: '100%' }}
              >
                Создать
              </Button>
            </>
          ) : (
            <>
              <br />
              <Copyboard url={getHost() + eventId} />
              <br />
              <Button
                style={{ width: '100%' }}
                onClick={() => {
                  goToResults();
                  setIsInputModalOpen(false);
                }}
              >
                <a href={eventId}>Посмотреть результаты</a>
              </Button>
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
          <div className={s.headerControls}>
            <Button onClick={goToResults} variant="ghost">
              Результаты
            </Button>
            <Button variant="secondary" onClick={showParticipantsModal}>
              <Icon.Users />
            </Button>
            <Button disabled={!myIntervals.length} onClick={saveIntervals}>
              Сохранить
            </Button>
          </div>
          <Dialog
            title="Введите имя"
            close={() => setIsInputModalOpen(false)}
            open={isInputModalOpen}
          >
            <br />
            <Input style={{ width: '100%' }} {...name.bind} placeholder="Иван Иванов" />
            <br />
            <Button
              onClick={async () => {
                await loginPost({ name: name.value });
                await eventsIntervalsPost(myIntervals, eventId);
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
