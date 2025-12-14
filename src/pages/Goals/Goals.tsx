import { useState, type ChangeEvent } from "react";
import DailyGoalsTracker from "../../components/DailyGoalsTracker";
import photo1 from "../../assets/planner-01.jpg";
import photo2 from "../../assets/planner-02.jpg";
import photo3 from "../../assets/planner-03.jpg";
import photo4 from "../../assets/planner-04.jpg";
import photo5 from "../../assets/planner-05.jpg";
import photo6 from "../../assets/planner-06.jpg";
import "./Goals.css";

const stripImages = [photo1, photo2, photo3, photo4, photo5, photo6];

const sportGoals = [
  {
    id: "goal-strength",
    title: "Strength cycle",
    detail: "Full body + core 3x semaine",
    metric: "6 semaines",
    progress: 65,
    image: photo1,
  },
  {
    id: "goal-cardio",
    title: "Cardio doux",
    detail: "Zone 2 + une sortie longue",
    metric: "4 sorties / sem",
    progress: 45,
    image: photo2,
  },
  {
    id: "goal-mobility",
    title: "Mobilite",
    detail: "15 min apres chaque seance",
    metric: "Quotidien",
    progress: 30,
    image: photo3,
  },
  {
    id: "goal-technique",
    title: "Technique squat",
    detail: "Vidéo + feedback hebdo",
    metric: "Progression charge",
    progress: 55,
    image: photo4,
  },
];

const GoalsPage = () => {
  const [bodyGoals, setBodyGoals] = useState<Array<string | null>>([null, null, null, null]);

  const handleBodyPhotoChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBodyGoals((prev) => prev.map((item, idx) => (idx === index ? url : item)));
  };

  const handleClearBodyPhoto = (index: number) => {
    setBodyGoals((prev) => prev.map((item, idx) => (idx === index ? null : item)));
  };

  return (
    <>
      <div className="page-photo-strip" aria-hidden="true">
        {stripImages.map((src, index) => (
          <div key={index} className="page-photo-strip__item">
            <img src={src} alt={`Inspiration ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="page-accent-bar" aria-hidden="true" />
      <div className="content-page goals-page">

        <header className="goals-hero">
          <div>
            <div className="hero-chip">Goals</div>
            <h2>Sport goals</h2>
            <p className="muted">Visualise tes priorites sportives et suis leur avancee.</p>
          </div>
        </header>

        <section className="goals-grid" aria-label="Goals sport">
          {sportGoals.map((goal) => (
            <article key={goal.id} className="goal-card">
              <div className="goal-card__media">
                <img src={goal.image} alt={goal.title} />
              </div>
              <div className="goal-card__body">
                <div className="goal-card__meta">
                  <span className="goal-card__tag">{goal.metric}</span>
                </div>
                <h3>{goal.title}</h3>
                <p>{goal.detail}</p>
                <div className="goal-card__progress">
                  <div className="goal-card__progress-bar" style={{ width: `${goal.progress}%` }} />
                  <span className="goal-card__progress-value">{goal.progress}%</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="goals-daily">
          <DailyGoalsTracker />
        </section>

        <section className="body-goals" aria-label="Body goals photos">
          <header className="body-goals__header">
            <h3>Body goals (photos)</h3>
            <p className="muted">Ajoute des references visuelles pour tes objectifs corps.</p>
          </header>
          <div className="body-goals__grid">
            {bodyGoals.map((image, index) => (
              <div key={index} className="body-goal-slot">
                {image ? (
                  <>
                    <img src={image} alt={`Body goal ${index + 1}`} />
                    <button type="button" className="body-goal-slot__action" onClick={() => handleClearBodyPhoto(index)}>
                      Retirer
                    </button>
                  </>
                ) : (
                  <label className="body-goal-slot__upload">
                    <input type="file" accept="image/*" onChange={handleBodyPhotoChange(index)} />
                    <span>Ajouter une photo</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
      <div className="page-footer-bar" aria-hidden="true" />
    </>
  );
};

export default GoalsPage;
