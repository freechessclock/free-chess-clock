import { ArrowPathIcon, Cog6ToothIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'preact/hooks';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import Settings from './settings'


export default function App() {
  const [minutes_per_player1, setMinutesPerPlayer1] = useState(10);
  const [minutes_per_player2, setMinutesPerPlayer2] = useState(10);
  const [different_time, setDifferentTime] = useState(false);
  const [extra_seconds, setExtraSeconds] = useState(5);
  const [notifications, setNotifications] = useState(true);
  const [turn, setTurn] = useState(false);
  const [settings_open, setSettingsOpen] = useState(true);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [time1, setTime1] = useState<number>(minutes_per_player1 * 60000);
  const [time2, setTime2] = useState<number>(minutes_per_player2 * 60000);
  const [played_sound, setPlayedSound] = useState(false);
  const [registered_sound, setRegisteredSound] = useState(false);
  const countdown1 = useRef<Countdown>(null);
  const countdown2 = useRef<Countdown>(null);

  const sound = useRef<HTMLAudioElement>(null);

  console.log(minutes_per_player1, minutes_per_player2);

  useEffect(() => {
    document.addEventListener("touchstart", () => {
      if (sound.current && notifications && !registered_sound) {
        sound.current.src = "alarm.mp3";
        sound.current.play();
        sound.current.pause();
        sound.current.currentTime = 0;
        setRegisteredSound(true);
      }
    });
  })

  useEffect(() => {
    if (!different_time) {
      setMinutesPerPlayer1(minutes_per_player2);
    }
  }, [different_time, minutes_per_player1]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (started && !paused && time1 > 0 && time2 > 0) {
          if (turn) {
            setTime2(time2 - 100);
          } else {
            setTime1(time1 - 100);
          }
        }
      }, 100);

    if (started && sound.current && !played_sound && (time1 <= 0 || time2 <= 0)) {
      sound.current.play();
      setPlayedSound(true);
    }
    return () => clearInterval(interval);
  }, [started, paused, time1, time2])

  useEffect(() => {
    setTime1(minutes_per_player1 * 60000);
    setTime2(minutes_per_player2 * 60000);
  }, [minutes_per_player1, minutes_per_player2, different_time])

  useEffect(() => {
    if (started) {
      if (!paused) {
        if (turn) {
          countdown2.current?.api?.start()
          countdown1.current?.api?.pause()
        } else {
          countdown1.current?.api?.start()
          countdown2.current?.api?.pause()
        }
      } else {
        countdown1.current?.api?.pause()
        countdown2.current?.api?.pause()
      }
    } else {
      countdown1.current?.api?.stop()
      countdown2.current?.api?.stop()
    }
  }, [started, turn, paused])

  useEffect(() => {
    const callback = () => {
      if (started) {
        setTurn(!turn)
      }
    }
    window.addEventListener('keypress', callback);

    return () => { window.removeEventListener('keypress', callback) };
  }, [started, setTurn, turn]);

  const renderer = ({ hours, formatted }: CountdownRenderProps) => {
    const time = hours !== 0 ? `${formatted.hours}:${formatted.minutes}:${formatted.seconds}` : `${formatted.minutes}:${formatted.seconds}`
    return (
      <div className={classNames('w-full h-full grow flex items-center justify-center', { "text-7xl lg:text-8xl": hours !== 0 }, { "text-8xl lg:text-9xl": hours === 0 })}>
        {time}
      </div >
    );
  };

  const pause_icons = started && (
    <>
      {
        paused ?
          <button onClick={() => { setPaused(false) }}>
            < PlayIcon className='w-16 bg-neutral-600 rounded-lg' />
          </button >
          :
          <button onClick={() => { setPaused(true) }}>
            <PauseIcon className='w-16 bg-neutral-600 rounded-lg' />
          </button>
      }
    </>
  )

  function reset() {
    setPaused(true);
    setPlayedSound(false);
    setStarted(false);
    setTime1(minutes_per_player1 * 60000);
    setTime2(minutes_per_player2 * 60000);
    setTurn(false);
    sound.current?.pause();
  }

  const icons = (
    <>
      <button
        onClick={() => {
          reset();
        }}
      >
        <ArrowPathIcon className='w-16 bg-neutral-600 rounded-lg' />
      </button>
      {pause_icons}
      <button
        onClick={() => {
          reset();
          setSettingsOpen(true);
        }}
      >
        <Cog6ToothIcon className='w-16 bg-neutral-600 rounded-lg' />
      </button>
    </>
  );
  return (
    <div className='bg-neutral-700 w-screen h-screen text-neutral-100'
      style={{ maxHeight: "-webkit-fill-available" }}
      onKeyDown={() => setTurn(!turn)}
    >
      {notifications && <audio ref={sound}>
        <source src="alarm.mp3"></source>
      </audio>}
      <Settings
        open={settings_open}
        setOpen={setSettingsOpen}
        different_time={different_time}
        setDifferentTime={setDifferentTime}
        minutes_per_player1={minutes_per_player2}
        minutes_per_player2={minutes_per_player1}
        extra_seconds={extra_seconds}
        notifications={notifications}
        setMinutesPerPlayer1={setMinutesPerPlayer2}
        setMinutesPerPlayer2={setMinutesPerPlayer1}
        setExtraSeconds={setExtraSeconds}
        setNotifications={setNotifications}
      />
      <div className='flex flex-col lg:flex-row h-full p-4 gap-4'>
        <button
          className={classNames('rotate-180 lg:rotate-0 p-4 grow w-full flex items-center justify-center h-full  rounded-xl',
            started && turn ? "bg-neutral-800" : "bg-neutral-400"
          )}
          onClick={() => {
            setTurn(true)
            if (started) {
              setTime1(time1 + extra_seconds * 1000);
            }
            setStarted(true);
            setPaused(false);
          }}
          disabled={started && turn}
        >
          <Countdown
            ref={countdown1}
            autoStart={false}
            renderer={renderer}
            date={time1}
            controlled={true}
          />
        </button>
        <div className='flex lg:flex-col lg:h-full justify-center gap-16 h-40 lg:w-40'>
          {icons}
        </div>
        <button
          className={classNames('p-4 grow w-full flex items-center justify-center h-full  rounded-xl',
            started && !turn ? "bg-neutral-800" : "bg-neutral-400"
          )}
          onClick={() => {
            setTurn(false);
            if (started) {
              setTime2(time2 + extra_seconds * 1000);
            }
            setStarted(true);
            setPaused(false);
          }}
          disabled={started && !turn}
        >
          <Countdown
            ref={countdown2}
            autoStart={false}
            renderer={renderer}
            date={time2}
            controlled={true}
          />
        </button>
      </div>
    </div>
  )
}
