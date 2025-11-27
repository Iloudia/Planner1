import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import planner01 from "../../assets/planner-01.jpg";
import planner02 from "../../assets/planner-02.jpg";
import planner03 from "../../assets/planner-03.jpg";
import planner04 from "../../assets/planner-04.jpg";
import planner05 from "../../assets/planner-05.jpg";
import planner06 from "../../assets/planner-06.jpg";
import planner07 from "../../assets/planner-07.jpg";
import planner08 from "../../assets/planner-08.jpg";
import "./Home.css";

type Task = {
  date: string;
  title: string;
  note: string;
};

type CardItem = {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  description: string;
  path: string;
};

const cards: CardItem[] = [
  {
    image: planner01,
    alt: "Sport",
    kicker: "Energie",
    title: "Sport",
    description: "Suivi des séances, objectifs cardio et forces.",
    path: "/sport"
  },
  {
    image: planner02,
    alt: "Activités",
    kicker: "Fun",
    title: "Activités",
    description: "Idées sorties, ateliers, moments à deux.",
    path: "/activites"
  },
  {
    image: planner03,
    alt: "Journaling",
    kicker: "Reflet",
    title: "Journaling",
    description: "Pages du matin, gratitude et journal de bord.",
    path: "/journaling"
  },
  {
    image: planner04,
    alt: "S'aimer soi-même",
    kicker: "Care",
    title: "S'aimer soi-même",
    description: "Rituels, skincare, affirmations et repos.",
    path: "/self-love"
  },
  {
    image: planner05,
    alt: "Wishlist",
    kicker: "Envie",
    title: "Wishlist",
    description: "Objets à tester, cadeaux, envies à budgéter.",
    path: "/wishlist"
  },
  {
    image: planner06,
    alt: "Calendrier mensuel",
    kicker: "Vue globale",
    title: "Calendrier mensuel",
    description: "Rendez-vous clés, repères et jalons.",
    path: "/calendrier"
  },
  {
    image: planner07,
    alt: "Finances",
    kicker: "Budget",
    title: "Finances",
    description: "Suivi dépenses, épargne et objectifs.",
    path: "/finances"
  },
  {
    image: planner08,
    alt: "Routine",
    kicker: "Rythme",
    title: "Routine",
    description: "Matin, soir, weekly reset et ancrages.",
    path: "/routine"
  }
];

const taskData: Task[] = [
  {
    date: "2025-11-27",
    title: "Ranger l'espace de travail",
    note: "20 min pour désencombrer le bureau avant la prochaine session de focus."
  },
  {
    date: "2025-11-28",
    title: "Session sport - force",
    note: "Upper body - 45 min, noter la progression sur les tractions et le développé."
  },
  {
    date: "2025-11-29",
    title: "Planifier les repas",
    note: "Lister 3 dîners simples + batch cooking du dimanche soir."
  },
  {
    date: "2025-11-30",
    title: "Journaling longue forme",
    note: "Bilan du mois, victoires + obstacles, intentions pour la semaine prochaine."
  },
  {
    date: "2025-12-01",
    title: "Check finances",
    note: "Mettre à jour le suivi budget et programmer l'épargne automatique."
  },
  {
    date: "2025-12-02",
    title: "Routine self-care",
    note: "1h pour soi : lecture + soin visage, sans écran."
  }
];

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

const todayLabel = () =>
  new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

const findFirstFutureIndex = (tasks: Task[]) => {
  const now = new Date();
  const idx = tasks.findIndex((task) => new Date(task.date).getTime() >= now.getTime());
  return idx >= 0 ? idx : 0;
};

const computeProgress = () => {
  const now = new Date();

  const startYear = new Date(now.getFullYear(), 0, 1);
  const endYear = new Date(now.getFullYear() + 1, 0, 1);

  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const progress = (start: Date, end: Date) =>
    clamp(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);

  return {
    year: progress(startYear, endYear),
    month: progress(startMonth, endMonth),
    day: progress(startDay, endDay)
  };
};

function HomePage() {
  const navigate = useNavigate();
  const sortedTasks = useMemo(
    () => [...taskData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    []
  );
  const [currentTask, setCurrentTask] = useState(() => findFirstFutureIndex(sortedTasks));
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(() => computeProgress());
  const taskOffset = sortedTasks.length ? (currentTask / sortedTasks.length) * 100 : 0;

  useEffect(() => {
    const saved = localStorage.getItem("planner-notes");
    if (saved !== null) setNotes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("planner-notes", notes);
  }, [notes]);

  useEffect(() => {
    if (!sortedTasks.length) return;
    const id = setInterval(() => setCurrentTask((prev) => (prev + 1) % sortedTasks.length), 6500);
    return () => clearInterval(id);
  }, [sortedTasks.length]);

  useEffect(() => {
    const update = () => setProgress(computeProgress());
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const goToNext = () => setCurrentTask((prev) => (prev + 1) % sortedTasks.length);
  const goToPrev = () => setCurrentTask((prev) => (prev - 1 + sortedTasks.length) % sortedTasks.length);
  const handleClearNotes = () => {
    setNotes("");
    localStorage.removeItem("planner-notes");
  };

  return (
    <div className="page home-page">
      <aside className="aside-right">
        <div className="profile-card">
          <div className="avatar">
            <img src={planner02} alt="Profil" />
            <div className="status-dot" />
          </div>
          <div>
            <p className="eyebrow">Profil</p>
            <h3>Ta semaine</h3>
            <p className="muted">Mood: focus & douceur</p>
          </div>
          <button className="pill">Mettre à jour</button>
        </div>

        <div className="progress-panel">
          <div className="progress-row">
            <div className="progress-label">
              <span>Année</span>
              <span>{progress.year.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.year}%` }} />
            </div>
          </div>
          <div className="progress-row">
            <div className="progress-label">
              <span>Mois</span>
              <span>{progress.month.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.month}%` }} />
            </div>
          </div>
          <div className="progress-row">
            <div className="progress-label">
              <span>Journée</span>
              <span>{progress.day.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.day}%` }} />
            </div>
          </div>
        </div>

        <div className="notes">
          <div className="notes-header">
            <div>
              <p className="eyebrow">Bloc-notes</p>
              <h3>Idées rapides</h3>
            </div>
            <button className="pill pill-ghost" onClick={handleClearNotes}>
              Effacer
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Capture une idée, une intention ou un rappel..."
          />
        </div>
      </aside>

      <main className="board">
        <section className="home-hero-strip">
          <div>
            <p className="eyebrow">Planner Home</p>
            <h1>Organise tes journées avec intention</h1>
          </div>
          <div className="today">{todayLabel()}</div>
        </section>
        <section className="card-grid">
          {cards.map((card) => (
            <article
              key={card.title}
              className="card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(card.path)}
              onKeyDown={(event) => {
                if (event.key === "Enter") navigate(card.path);
              }}
            >
              <img src={card.image} alt={card.alt} />
              <div className="card-body">
                <p className="card-kicker">{card.kicker}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="aside-left">
        <div className="aside-title">
          <span className="dot" />
          Prochaines tâches
        </div>
        <div className="task-window">
          <div className="task-list" style={{ transform: `translateY(-${taskOffset}%)` }}>
            {sortedTasks.map((task) => (
              <article key={`${task.title}-${task.date}`} className="task-card">
                <p className="task-date">{formatDate(task.date)}</p>
                <h4 className="task-title">{task.title}</h4>
                <p className="task-note">{task.note}</p>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default HomePage;
