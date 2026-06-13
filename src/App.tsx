import { useEffect, useMemo, useState } from "react";
import Gear from "./components/Gear.tsx";
import Timer from "./components/Timer.tsx";
import {
  BASE_LITERS,
  bottlesLine,
  equipment,
  faqs,
  ingredients,
  intro,
  maltingSteps,
  notes,
  steps,
} from "./data/recipe.ts";

// Mass/volume units that scale with batch size. Longer tokens first so e.g.
// "кг" wins over "г" and "мл" over "л" during alternation.
const SCALABLE_UNIT = "кг|мл|литри|литър|литра|г|л";

// Whole numbers stay integers; otherwise keep a single decimal.
function fmtNumber(n: number): string {
  return Math.abs(n - Math.round(n)) < 0.05
    ? String(Math.round(n))
    : n.toFixed(1);
}

/**
 * Scales only mass/volume quantities (г, кг, мл, л, литра) by the batch factor.
 * Temperatures (70°C), durations (60 мин), layer/day counts and other numbers
 * are left untouched. Ranges sharing a trailing unit ("7–9 г") scale both ends.
 */
function scaleText(text: string, factor: number): string {
  if (factor === 1) return text;
  const re = new RegExp(
    `(?:(\\d+(?:[.,]\\d+)?)\\s*([–-])\\s*)?(\\d+(?:[.,]\\d+)?)(\\s*)(${SCALABLE_UNIT})(?![А-Яа-яA-Za-z°])`,
    "gu",
  );
  return text.replace(re, (_m, lo, dash, hi, space, unit) => {
    const hiOut = fmtNumber(parseFloat(hi.replace(",", ".")) * factor);
    if (lo !== undefined) {
      const loOut = fmtNumber(parseFloat(lo.replace(",", ".")) * factor);
      return `${loOut}${dash}${hiOut}${space}${unit}`;
    }
    return `${hiOut}${space}${unit}`;
  });
}

const BATCHES = [1, 2, 3] as const;

export default function App() {
  const [factor, setFactor] = useState<number>(1);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("brew-progress") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("brew-progress", JSON.stringify(checked));
  }, [checked]);

  const totalSteps = steps.length;
  const doneSteps = useMemo(
    () => steps.filter((s) => checked[`step-${s.id}`]).length,
    [checked],
  );
  const progress = Math.round((doneSteps / totalSteps) * 100);

  function toggle(key: string) {
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  }

  const liters = scaleText(`${BASE_LITERS} л`, factor);

  return (
    <div className="page">
      <RivetBar />

      {/* ░░ HEADER ░░ */}
      <header className="hero">
        <div className="hero-gears">
          <Gear teeth={14} size={120} spin="cw" speed={26} className="g1" />
          <Gear teeth={10} size={78} spin="ccw" speed={16} className="g2" />
          <Gear teeth={18} size={150} spin="cw" speed={40} className="g3" />
        </div>
        <p className="hero-kicker">⚙ РЪЧНА ПИВОВАРНА · ЕДИЦИЯ 001 ⚙</p>
        <h1 className="hero-title">
          МАЛЦ <span className="amp">&amp;</span> МАШИНА
        </h1>
        <p className="hero-sub">
          Домашна бира от собствен малц и сух хмел
        </p>
        <div className="hero-badges">
          <span className="tag tag-brass">🍺 ~{liters}</span>
          <span className="tag">🔥 без специално оборудване</span>
          <span className="tag">⏱ ~30 дни до чаша</span>
        </div>
      </header>

      <main className="stack">
        {/* ░░ INTRO ░░ */}
        <section className="panel panel-paper">
          <h2 className="panel-h">
            <span className="panel-num">00</span> Какво ще получите?
          </h2>
          <p className="lead">{scaleText(intro, factor)}</p>
        </section>

        {/* ░░ BATCH SCALER ░░ */}
        <section className="panel panel-dark scaler">
          <div className="scaler-head">
            <Gear teeth={9} size={44} spin="cw" speed={10} />
            <div>
              <h2 className="panel-h panel-h-light">Размер на партидата</h2>
              <p className="muted">
                Всички количества по-долу се преизчисляват автоматично.
              </p>
            </div>
          </div>
          <div className="scaler-btns">
            {BATCHES.map((b) => (
              <button
                key={b}
                className={`lever ${factor === b ? "lever-on" : ""}`}
                onClick={() => setFactor(b)}
              >
                ×{b}
                <small>{scaleText(`${BASE_LITERS} л`, b)}</small>
              </button>
            ))}
          </div>
        </section>

        {/* ░░ INGREDIENTS ░░ */}
        <section className="panel panel-paper">
          <h2 className="panel-h">
            <span className="panel-num">01</span> 🛒 Съставки
          </h2>
          <div className="table-wrap">
            <table className="recipe-table">
              <thead>
                <tr>
                  <th>Продукт</th>
                  <th>Количество</th>
                  <th>Бележки</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing) => (
                  <tr key={ing.product}>
                    <td data-label="Продукт">{ing.product}</td>
                    <td data-label="Количество" className="amount">
                      {ing.scalable
                        ? scaleText(ing.amount, factor)
                        : ing.amount}
                    </td>
                    <td data-label="Бележки" className="note-cell">
                      {ing.scalable ? scaleText(ing.note, factor) : ing.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ░░ EQUIPMENT ░░ */}
        <section className="panel panel-paper">
          <h2 className="panel-h">
            <span className="panel-num">02</span> 🔧 Оборудване
          </h2>
          <ul className="cog-list">
            {equipment.map((e) => (
              <li key={e}>{e}</li>
            ))}
            <li>{bottlesLine(factor)}</li>
          </ul>
        </section>

        {/* ░░ STEP 0: MALTING ░░ */}
        <section className="panel panel-rust">
          <h2 className="panel-h panel-h-light">
            <span className="panel-num">⌬</span> Стъпка 0 · Направи си малц
          </h2>
          <p className="muted-light">
            По желание. Ако искате бира напълно от нулата, малцирайте ечемика у
            дома.{" "}
            <a
              href="https://www.chelseagreen.com/blog/malt-your-own-grain-at-home/"
              target="_blank"
              rel="noreferrer"
            >
              Виж ръководството ↗
            </a>
          </p>
          <ol className="num-list num-list-light">
            {maltingSteps.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ol>
        </section>

        {/* ░░ PROGRESS ░░ */}
        <section className="panel panel-dark progress-panel">
          <h2 className="panel-h panel-h-light">📋 Прогрес на варенето</h2>
          <div className="progress-meta">
            <span>
              {doneSteps} / {totalSteps} стъпки
            </span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="big-bar">
            <div className="big-bar-fill" style={{ width: `${progress}%` }}>
              <span className="rivets" />
            </div>
          </div>
          {progress === 100 && (
            <p className="done-banner">🍻 НАЗДРАВЕ! Бирата е на път!</p>
          )}
        </section>

        {/* ░░ BREW STEPS ░░ */}
        <section className="steps">
          <h2 className="section-title">🍺 Стъпки за варене</h2>
          {steps.map((step) => {
            const key = `step-${step.id}`;
            return (
              <article
                key={step.id}
                className={`step ${checked[key] ? "step-done" : ""}`}
              >
                <div className="step-side">
                  <span className="step-no">{step.id}</span>
                  <span className="step-badge">{step.badge}</span>
                </div>
                <div className="step-body">
                  <header className="step-head">
                    <h3>{step.title}</h3>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={!!checked[key]}
                        onChange={() => toggle(key)}
                      />
                      <span className="check-box" />
                      <span className="check-txt">готово</span>
                    </label>
                  </header>
                  <ul className="step-lines">
                    {step.lines.map((line, i) => (
                      <li key={i}>
                        {step.scalable === false
                          ? line
                          : scaleText(line, factor)}
                      </li>
                    ))}
                  </ul>
                  {step.timer && (
                    <Timer
                      minutes={step.timer.minutes}
                      label={step.timer.label}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {/* ░░ IMPORTANT NOTES ░░ */}
        <section className="panel panel-warn">
          <h2 className="panel-h">📌 Важни бележки</h2>
          <ul className="warn-list">
            {notes.map((n, i) => (
              <li key={i}>{scaleText(n, factor)}</li>
            ))}
          </ul>
        </section>

        {/* ░░ FAQ ░░ */}
        <section className="panel panel-paper">
          <h2 className="panel-h">❓ Често задавани въпроси</h2>
          <div className="faq">
            {faqs.map((f, i) => (
              <Faq key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <Gear teeth={12} size={60} spin="cw" speed={20} />
        <p className="cheers">Наздраве и приятно варене! 🍻</p>
        <p className="footer-fine">
          Сглобено с React + Bun · стиймпънк / нео-бруталист
        </p>
        <Gear teeth={12} size={60} spin="ccw" speed={20} />
      </footer>

      <RivetBar />
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "faq-open" : ""}`}>
      <button
        type="button"
        className="faq-q"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="faq-a">{a}</p>}
    </div>
  );
}

function RivetBar() {
  return <div className="rivet-bar" aria-hidden="true" />;
}
