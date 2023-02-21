import { ArrowPathIcon, Cog6ToothIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'preact/hooks';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import Settings from './settings'

const MINUTES_TO_MILLISECONDS = 60000;
const SECONDS_TO_MILLISECONDS = 1000;
const UPDATE_INTERVAL = 250;

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
  const [time1, setTime1] = useState<number>(minutes_per_player1 * MINUTES_TO_MILLISECONDS);
  const [time2, setTime2] = useState<number>(minutes_per_player2 * MINUTES_TO_MILLISECONDS);
  const [played_sound, setPlayedSound] = useState(false);
  const [inc1, setInc1] = useState(false);
  const [inc2, setInc2] = useState(false);
  const [dec1, setDec1] = useState(false);
  const [dec2, setDec2] = useState(false);
  const countdown1 = useRef<Countdown>(null);
  const countdown2 = useRef<Countdown>(null);

  const alarm = useRef<HTMLAudioElement>(null);
  const click = useRef<HTMLAudioElement>(null);

  const button1 = useRef<HTMLButtonElement>(null);
  const button2 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const touchRegister = () => {
      if (notifications) {
        alarm.current?.load();
        click.current?.load();
      }
    }

    const playClick = () => {
      if (notifications) {
        click.current?.play()
      }
    }

    document.addEventListener("touchstart", touchRegister);
    button1.current?.addEventListener("click", playClick)
    button2.current?.addEventListener("click", playClick)

    return () => {
      document.removeEventListener("touchstart", touchRegister);
      button1.current?.removeEventListener("click", playClick);
      button2.current?.removeEventListener("click", playClick);
    }
  }, [notifications])

  useEffect(() => {
    if (!different_time) {
      setMinutesPerPlayer1(minutes_per_player2);
    }
  }, [different_time, minutes_per_player1]);

  useEffect(() => {
    let new_time1 = time1
    if (dec1) {
      new_time1 -= UPDATE_INTERVAL;
    }
    if (inc1) {
      new_time1 += extra_seconds * SECONDS_TO_MILLISECONDS;
    }

    let new_time2 = time2
    if (dec2) {
      new_time2 -= UPDATE_INTERVAL;
    }
    if (inc2) {
      new_time2 += extra_seconds * SECONDS_TO_MILLISECONDS
    }

    if (new_time1 !== time1) {
      setTime1(new_time1);
    }
    if (new_time2 !== time2) {
      setTime2(new_time2);
    }

    setDec1(false);
    setDec2(false);
    setInc1(false);
    setInc2(false);
  }, [dec1, dec2, inc1, inc2])

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (started && !paused && time1 > 0 && time2 > 0) {
          if (turn) {
            setDec2(true);
          } else {
            setDec1(true);
          }
        }
      }, UPDATE_INTERVAL);

    if (started && alarm.current && !played_sound && (time1 <= 0 || time2 <= 0)) {
      alarm.current?.play();
      setPlayedSound(true);
    }
    return () => { clearTimeout(timeout) };
  }, [started, paused, time1, time2, played_sound])

  useEffect(() => {
    setTime1(minutes_per_player1 * MINUTES_TO_MILLISECONDS);
    setTime2(minutes_per_player2 * MINUTES_TO_MILLISECONDS);
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
        if (turn) {
          setInc2(true);
        } else {
          setInc1(true);
        }
      }
    }
    window.addEventListener('keypress', callback);

    return () => { window.removeEventListener('keypress', callback) };
  }, [started, setTurn, turn, time1, time2,]);

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
          <button onClick={() => {
            setPaused(true)
          }}>
            <PauseIcon className='w-16 bg-neutral-600 rounded-lg' />
          </button>
      }
    </>
  )

  const reset = () => {
    setPaused(true);
    setPlayedSound(false);
    setStarted(false);
    setTime1(minutes_per_player1 * MINUTES_TO_MILLISECONDS);
    setTime2(minutes_per_player2 * MINUTES_TO_MILLISECONDS);
    setTurn(false);
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
          setSettingsOpen(true);
          setPaused(true);
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
      <audio ref={click}>
        <source src="click.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={alarm}>
        <source src="alarm.mp3" type="audio/mpeg" />
      </audio>
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
          ref={button1}
          className={classNames('rotate-180 lg:rotate-0 p-4 grow w-full flex items-center justify-center h-full  rounded-xl',
            started && turn ? "bg-neutral-800" : "bg-neutral-400 drop-shadow-lg"
          )}
          onClick={() => {
            setTurn(true)
            if (started) {
              setInc1(true);
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
          ref={button2}
          className={classNames('p-4 grow w-full flex items-center justify-center h-full  rounded-xl',
            started && !turn ? "bg-neutral-800" : "bg-neutral-400 shadow-lg"
          )}
          onClick={() => {
            setTurn(false);
            if (started) {
              setInc2(true);
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
    </div >
  )
}
