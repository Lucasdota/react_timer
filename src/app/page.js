"use client"
import { ArrowClockwise, PlayPause, ArrowFatLinesUp, ArrowFatLinesDown } from "@phosphor-icons/react"
import { useState, useEffect } from "react"

export default function Home() {
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [breaktime, setBreakTime] = useState(5);
  const [session, setSession] = useState(25);
  const [time, setTime] = useState(formatTime(currentTime));
  const [isOn, setOn] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [end, setEnd] = useState(false);

  //format time with 2 digits before and after the decimal dot
  function formatTime(value) {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function handleReset() {
    const beep = document.getElementById("beep");
    beep.currentTime = 0;
    if (isOn) {
      stopTime();
      setOn(!isOn);
    }
    setBreakTime(5);
    setSession(25);
    setCurrentTime(25 * 60);
  }

  function breakDecrement() {
    if (breaktime > 1 && !isOn) {
      setBreakTime(breaktime - 1);
    }
  }

  function breakIncrement() {
    if (breaktime < 60 && !isOn) {
      setBreakTime(breaktime + 1)
    }
  }

  function sessionDecrement() {
    if (session > 1 && !isOn) {
     setSession(session - 1);
     setCurrentTime((session - 1) * 60)
    }
  }

  function sessionIncrement() {
    if (session < 60 && !isOn) {
      setSession(session + 1);
      setCurrentTime((session + 1) * 60)
    }
  }

  function handlePlay() {
    setOn(!isOn);
  }

  function runTime() {
    setCurrentTime((prevTime) => {
      const newTime = prevTime - 1;
      return newTime;
    });
  }

  function stopTime() {
    clearInterval(intervalId);
    setIntervalId(null);
  }

  //when isOn state changes, checks it and apply the according function
  useEffect(() => {
    if (isOn) {
      const id = setInterval(runTime, 100);
      setIntervalId(id);
    } else {
      stopTime();
    }
  }, [isOn]);

  useEffect(() => {
    //updates the display everytime currentTime changes
    setTime(formatTime(currentTime));
    const beep = document.getElementById("beep");
    if (currentTime === 0 && !end) {//enter break when currentTime ends
      beep.play();
      stopTime();
      setTimeout(() => {//stops for 3 sec at 0 to sync with beep sound  
        setCurrentTime(breaktime * 60);
        setEnd(!end);
        const id = setInterval(runTime, 100);
        setIntervalId(id);
      }, 3000)  
    } else if (currentTime === 0 && end) {//initialize a new session when break ends
      beep.play();
      stopTime();
      setTimeout(() => {//stops for 3 sec at 0 to sync with beep sound 
        setCurrentTime(session * 60);
        setEnd(!end);
        const id = setInterval(runTime, 100);
        setIntervalId(id);
      }, 3000)     
    }
  }, [currentTime]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-16 bg-slate-50 tracking-wider md:p-2">
      <div className="w-[40rem] h-[17rem] bg-zinc-900 flex items-center justify-center p-12 text-white rounded-full drop-shadow-xl outline outline-4 outline-zinc-900 border-2 border-yellow-300 md:flex-col md:w-4/5 md:h-[35rem] md:rounded-xl md:pt-0">

        <div id="controls-container" className="w-full flex flex-col items-center gap-2 p-6 rounded-l-full md:gap-6">
          <h1 className="text-5xl drop-shadow-xl text-yellow-300 md:text-6xl">Timer</h1>

          <div className="flex gap-6">

            <div id="break-label" className="text-center">
              <h2 className="text-lg md:text-xl xs:text-base">Break</h2>
              <div className="flex bg-black outline outline-1 outline-zinc-600 rounded-full">
                <button id="break-decrement" className="p-1 rounded-l-full bg-black outline outline-1 outline-zinc-600 group md:py-2 md:px-4 xs:p-1" onClick={breakDecrement}>
                  <ArrowFatLinesDown size={20} className={`${isOn ? null : 'group-active:scale-75'} text-yellow-300 md:scale-150 xs:scale-100`} />
                </button>
                <span id="break-length" className="w-12 text-xl md:text-2xl xs:text-lg">{breaktime}</span>
                <button id="break-increment" className="p-1 rounded-r-full bg-black outline outline-1 outline-zinc-600 group md:py-2 md:px-4 xs:p-1" onClick={breakIncrement}>
                  <ArrowFatLinesUp size={20} className={`${isOn ? null : 'group-active:scale-75'} text-yellow-300 md:scale-150 xs:scale-100`} />
                </button>
              </div>
            </div>

            <div id="session-label" className="text-center">
              <h2 className="text-lg md:text-xl xs:text-base">Session</h2>
              <div className="flex bg-black outline outline-1 outline-zinc-600 rounded-full">
                <button id="session-decrement" className="p-1 rounded-l-full bg-black outline outline-1 outline-zinc-600 group md:py-2 md:px-4 xs:p-1" onClick={sessionDecrement}>
                  <ArrowFatLinesDown size={20} className={`${isOn ? null : 'group-active:scale-75'} text-yellow-300 md:scale-150 xs:scale-100`} />
                </button>
                <span id="session-length" className="w-12 text-xl md:text-2xl xs:text-lg">{session}</span>
                <button id="session-increment" className="p-1 rounded-r-full bg-black outline outline-1 outline-zinc-600 group md:py-2 md:px-4 xs:p-1" onClick={sessionIncrement}>
                  <ArrowFatLinesUp size={20} className={`${isOn ? null : 'group-active:scale-75'} text-yellow-300 md:scale-150 xs:scale-100`} />
                </button>
              </div>
            </div>
          </div>

          <div id="controls" className="flex bg-black outline outline-1 outline-zinc-600 rounded-full mt-5">
            <button id="start_stop" className="px-3 py-1 rounded-l-full bg-black outline outline-1 outline-zinc-600 group md:px-6 md:py-2 xs:p-1 xs:px-2" onClick={handlePlay}>
              <PlayPause size={28} className="group-active:scale-75 text-yellow-300 md:scale-150 xs:scale-100" />
            </button>
            <button id="reset" className="px-3 py-1 rounded-r-full bg-black outline outline-1 outline-zinc-600 group md:px-6 md:py-2 xs:p-1 xs:px-2" onClick={handleReset}>
              <ArrowClockwise size={24} className="group-active:scale-75 text-yellow-300 md:scale-150 xs:scale-100" />
            </button>
          </div>

        </div>

        <div id="timer-label" className={`min-w-[16rem] h-full bg-black rounded-r-full pr-4 flex justify-center items-center outline outline-1 outline-zinc-800 relative ${currentTime < 60 ? "text-red-600" : "text-yellow-300"} md:rounded-xl md:h-1/3`}>
          <span className="absolute top-2 font-bold">{end ? "break" : "session"}</span>
          <span id="time-left" className="text-[5.5em]">{time}</span>
        </div>

        <audio id="beep" src="/audios/beep.mp3" type="audio/mpeg"></audio>
      </div>
    </main>
  )
}
