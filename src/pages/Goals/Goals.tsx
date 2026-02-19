import { useEffect, useState, type ChangeEvent } from "react";
import DailyGoalsTracker from "../../components/DailyGoalsTracker";
import PageHeading from "../../components/PageHeading";
import goalsHero from "../../assets/olivia-roberts-dupe.jpeg";
import "./Goals.css";

const BODY_GOALS_STORAGE_KEY = "goals:bodyPhotos";
const DEFAULT_BODY_GOALS: Array<string | null> = [null, null, null, null];

const GoalsPage = () => {
  const [bodyGoals, setBodyGoals] = useState<Array<string | null>>(DEFAULT_BODY_GOALS);

  useEffect(() => {
    const stored = localStorage.getItem(BODY_GOALS_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const normalized = DEFAULT_BODY_GOALS.map((_, index) =>
          typeof parsed[index] === "string" ? parsed[index] : null
        );
        setBodyGoals(normalized);
      }
    } catch {
      // Ignore invalid stored data.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BODY_GOALS_STORAGE_KEY, JSON.stringify(bodyGoals));
  }, [bodyGoals]);
  useEffect(() => {
    document.body.classList.add("goals-page--lux");
    return () => {
      document.body.classList.remove("goals-page--lux");
    };
  }, []);

  const handleBodyPhotoChange = (index: number) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
        reader.readAsDataURL(file);
      });
      setBodyGoals((prev) => prev.map((item, idx) => (idx === index ? dataUrl : item)));
    } catch {
      // Ignore failed file reads.
    }
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
</>
  );
};

export default GoalsPage;


