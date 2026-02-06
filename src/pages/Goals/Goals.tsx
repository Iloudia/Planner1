import { useEffect, useState, type ChangeEvent } from "react";
import DailyGoalsTracker from "../../components/DailyGoalsTracker";
import PageHeading from "../../components/PageHeading";
import goalsHero from "../../assets/olivia-roberts-dupe.jpeg";
import "./Goals.css";

const GoalsPage = () => {
  const [bodyGoals, setBodyGoals] = useState<Array<string | null>>([null, null, null, null]);
  useEffect(() => {
    document.body.classList.add("goals-page--beige");
    return () => {
      document.body.classList.remove("goals-page--beige");
    };
  }, []);

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

      <PageHeading eyebrow="Goals" title="Mes Goals" className="goals-page-heading" />
      <div className="content-page goals-page">

        <p className="muted goals-page-heading__intro" aria-hidden="true"></p>

        <section className="goals-daily">
          <DailyGoalsTracker />
        </section>
        <section className="body-goals" aria-label="Body goals">
          <header className="body-goals__header">
            <h3>Body goals</h3>
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
