import { useEffect, useRef, useState } from "react";

interface TimerProps {
  minutes: number;
  label: string;
}

/** Simple countdown timer for the mash/boil steps. */
export default function Timer({ minutes, label }: TimerProps) {
  const total = minutes * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(tick.current!);
          setRunning(false);
          setDone(true);
          beep();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running]);

  function beep() {
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 440;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
      // Release the audio context once the beep finishes.
      osc.onended = () => ctx.close().catch(() => {});
    } catch {
      /* no sound if the browser blocks audio */
    }
  }

  function reset() {
    setRunning(false);
    setDone(false);
    setRemaining(total);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = ((total - remaining) / total) * 100;

  return (
    <div className={`timer ${done ? "timer-done" : ""}`}>
      <div className="timer-face">
        <span className="timer-label">{done ? "⏰ ГОТОВО!" : label}</span>
        <span className="timer-clock">
          {mm}:{ss}
        </span>
      </div>
      <div className="timer-bar">
        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="timer-controls">
        <button
          className="btn btn-brass"
          onClick={() => {
            setDone(false);
            setRunning((r) => !r);
          }}
          disabled={remaining === 0}
        >
          {running ? "⏸ Пауза" : "▶ Старт"}
        </button>
        <button className="btn" onClick={reset}>
          ↺ Нулирай
        </button>
      </div>
    </div>
  );
}
