import { ArrowPathIcon, Cog6ToothIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'preact/hooks';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import Settings from './settings'


export default function App() {
  const [minutes_per_player, setMinutesPerPlayer] = useState(10);
  const [extra_seconds, setExtraSeconds] = useState(5);
  const [notifications, setNotifications] = useState(true);
  const [turn, setTurn] = useState(false);
  const [settings_open, setSettingsOpen] = useState(true);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [time1, setTime1] = useState<number>(minutes_per_player * 60000);
  const [time2, setTime2] = useState<number>(minutes_per_player * 60000);
  const countdown1 = useRef<Countdown>(null);
  const countdown2 = useRef<Countdown>(null);

  const sound = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.addEventListener("touchstart", () => {
      if (sound.current && notifications) {
        sound.current.src = "alarm.mp3";
        sound.current.play();
        sound.current.pause();
      }
    });
  })
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

    if (sound.current && (time1 <= 0 || time2 <= 0)) {
      sound.current.play();
    }
    return () => clearInterval(interval);
  }, [started, paused, time1, time2])

  useEffect(() => {
    setTime1(minutes_per_player * 60000);
    setTime2(minutes_per_player * 60000);
  }, [minutes_per_player])

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

  const renderer = ({ formatted }: CountdownRenderProps) => {
    return (
      <div className='w-full h-full grow flex items-center justify-center text-8xl lg:text-9xl '>
        {formatted.minutes}:{formatted.seconds}
      </div>
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

  const icons = (
    <>
      <button
        onClick={() => {
          setStarted(false);
          setPaused(true);
          setTurn(false);
          sound.current?.pause();
          setTime1(minutes_per_player * 60000);
          setTime2(minutes_per_player * 60000);
        }}
      >
        <ArrowPathIcon className='w-16 bg-neutral-600 rounded-lg' />
      </button>
      {pause_icons}
      <button
        onClick={() => {
          setStarted(false);
          sound.current?.pause();
          setPaused(true);
          setSettingsOpen(true);
          setTurn(false);
          setTime1(minutes_per_player * 60000);
          setTime2(minutes_per_player * 60000);
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
        minutes_per_player={minutes_per_player}
        extra_seconds={extra_seconds}
        notifications={notifications}
        setMinutesPerPlayer={setMinutesPerPlayer}
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
