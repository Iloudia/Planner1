import { useState, type ChangeEvent } from "react";
import DailyGoalsTracker from "../../components/DailyGoalsTracker";
import PageHeading from "../../components/PageHeading";
import photo1 from "../../assets/planner-01.jpg";
import photo2 from "../../assets/planner-02.jpg";
import photo3 from "../../assets/planner-03.jpg";
import photo4 from "../../assets/planner-04.jpg";
import photo5 from "../../assets/planner-05.jpg";
import photo6 from "../../assets/planner-06.jpg";
import "./Goals.css";

const stripImages = [photo1, photo2, photo3, photo4, photo5, photo6];

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
      <PageHeading eyebrow="Goals" title="Sport goals" className="goals-page-heading" />
      <div className="content-page goals-page">

        
        <p className="muted goals-page-heading__intro">Visualise tes priorités sportives et suis leur avancée.</p>

        <section className="goals-daily">
          <DailyGoalsTracker />
        </section>
        <section className="body-goals" aria-label="Body goals photos">
          <header className="body-goals__header">
            <h3>Body goals (photos)</h3>
            <p className="muted">Ajoute des références visuelles pour tes objectifs corps.</p>
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
