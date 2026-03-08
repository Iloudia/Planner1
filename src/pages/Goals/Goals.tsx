import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import DailyGoalsTracker from "../../components/DailyGoalsTracker";
import PageHeading from "../../components/PageHeading";
import { useAuth } from "../../context/AuthContext";
import { deleteMedia, uploadImage } from "../../services/media/api";
import {
  deleteBodyGoalPhotoSlot,
  saveBodyGoalPhotoSlot,
  subscribeToBodyGoalPhotos,
} from "../../services/firestore/bodyGoals";
import type { BodyGoalPhotoSlot } from "../../types/personalization";
import "./Goals.css";

const BODY_GOALS_STORAGE_KEY = "goals:bodyPhotos";
const DEFAULT_BODY_GOALS: Array<string | null> = [null, null, null, null, null, null];

const buildBodyGoalSlotId = (index: number) => `body-goal-${index + 1}`;

const readLegacyBodyGoals = () => {
  if (typeof window === "undefined") {
    return DEFAULT_BODY_GOALS;
  }

  try {
    const stored = window.localStorage.getItem(BODY_GOALS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_BODY_GOALS;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return DEFAULT_BODY_GOALS;
    }
    return DEFAULT_BODY_GOALS.map((_, index) =>
      typeof parsed[index] === "string" ? parsed[index] : null,
    );
  } catch {
    return DEFAULT_BODY_GOALS;
  }
};

const dataUrlToFile = async (dataUrl: string, fileName: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const mimeType = blob.type || "image/png";
  const extension = mimeType.split("/")[1] || "png";
  return new File([blob], `${fileName}.${extension}`, { type: mimeType });
};

const GoalsPage = () => {
  const { userId } = useAuth();
  const canEdit = Boolean(userId);
  const [bodyGoalSlots, setBodyGoalSlots] = useState<BodyGoalPhotoSlot[]>([]);
  const [bodyGoalsError, setBodyGoalsError] = useState<string | null>(null);
  const [isBodyGoalsLoading, setIsBodyGoalsLoading] = useState(true);
  const migratedLegacyUserRef = useRef<string | null>(null);

  const bodyGoals = useMemo(
    () =>
      DEFAULT_BODY_GOALS.map((_, index) => {
        const slot = bodyGoalSlots.find((entry) => entry.slotIndex === index);
        return slot?.imageUrl ?? null;
      }),
    [bodyGoalSlots],
  );

  useEffect(() => {
    document.body.classList.add("goals-page--lux");
    return () => {
      document.body.classList.remove("goals-page--lux");
    };
  }, []);

  useEffect(() => {
    migratedLegacyUserRef.current = null;

    if (!userId) {
      setBodyGoalSlots([]);
      setBodyGoalsError(null);
      setIsBodyGoalsLoading(false);
      return;
    }

    setBodyGoalsError(null);
    setIsBodyGoalsLoading(true);

    return subscribeToBodyGoalPhotos(
      userId,
      (photos) => {
        setBodyGoalSlots(photos);
        setIsBodyGoalsLoading(false);
      },
      () => {
        setBodyGoalsError("Impossible de charger tes photos body goals.");
        setIsBodyGoalsLoading(false);
      },
    );
  }, [userId]);

  useEffect(() => {
    if (!userId || isBodyGoalsLoading) {
      return;
    }
    if (migratedLegacyUserRef.current === userId) {
      return;
    }

    migratedLegacyUserRef.current = userId;

    if (bodyGoalSlots.length > 0) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(BODY_GOALS_STORAGE_KEY);
      }
      return;
    }

    const legacyGoals = readLegacyBodyGoals();
    if (!legacyGoals.some(Boolean)) {
      return;
    }

    void (async () => {
      try {
        for (let index = 0; index < legacyGoals.length; index += 1) {
          const legacyImage = legacyGoals[index];
          if (!legacyImage) {
            continue;
          }

          const slotId = buildBodyGoalSlotId(index);

          if (legacyImage.startsWith("data:")) {
            const file = await dataUrlToFile(legacyImage, slotId);
            const uploaded = await uploadImage(file, "self-love-photo", slotId);
            await saveBodyGoalPhotoSlot(userId, {
              id: slotId,
              slotIndex: index,
              imageUrl: uploaded.url,
              imagePath: uploaded.path,
            });
            continue;
          }

          await saveBodyGoalPhotoSlot(userId, {
            id: slotId,
            slotIndex: index,
            imageUrl: legacyImage,
          });
        }

        if (typeof window !== "undefined") {
          window.localStorage.removeItem(BODY_GOALS_STORAGE_KEY);
        }
      } catch {
        setBodyGoalsError("Impossible de recuperer tes anciennes photos body goals.");
      }
    })();
  }, [bodyGoalSlots.length, isBodyGoalsLoading, userId]);

  const handleBodyPhotoChange = (index: number) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !userId) {
      return;
    }

    const slotId = buildBodyGoalSlotId(index);
    const previousPhoto = bodyGoalSlots.find((slot) => slot.slotIndex === index);
    setBodyGoalsError(null);

    try {
      const uploaded = await uploadImage(file, "self-love-photo", slotId);
      try {
        await saveBodyGoalPhotoSlot(userId, {
          id: slotId,
          slotIndex: index,
          imageUrl: uploaded.url,
          imagePath: uploaded.path,
        });
        if (previousPhoto?.imagePath && previousPhoto.imagePath !== uploaded.path) {
          void deleteMedia(previousPhoto.imagePath).catch(() => undefined);
        }
      } catch {
        void deleteMedia(uploaded.path).catch(() => undefined);
        throw new Error("save-body-goal-photo-failed");
      }
    } catch {
      setBodyGoalsError("Impossible d'enregistrer cette photo body goals.");
    }
  };

  const handleClearBodyPhoto = async (index: number) => {
    if (!userId) {
      return;
    }

    const slotId = buildBodyGoalSlotId(index);
    const previousPhoto = bodyGoalSlots.find((slot) => slot.slotIndex === index);
    setBodyGoalsError(null);

    try {
      await deleteBodyGoalPhotoSlot(userId, slotId);
      if (previousPhoto?.imagePath) {
        void deleteMedia(previousPhoto.imagePath).catch(() => undefined);
      }
    } catch {
      setBodyGoalsError("Impossible de retirer cette photo body goals.");
    }
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
            <p className="muted">Ajoute des references visuelles pour tes objectifs corps.</p>
            {bodyGoalsError ? <p className="muted">{bodyGoalsError}</p> : null}
            {isBodyGoalsLoading ? <p className="muted">Chargement de tes photos...</p> : null}
          </header>
          <div className="body-goals__grid">
            {bodyGoals.map((image, index) => (
              <div key={index} className="body-goal-slot">
                {image ? (
                  <>
                    <img src={image} alt={`Body goal ${index + 1}`} loading="lazy" decoding="async" />
                    <button
                      type="button"
                      className="body-goal-slot__action"
                      onClick={() => void handleClearBodyPhoto(index)}
                      disabled={!canEdit}
                    >
                      Retirer
                    </button>
                  </>
                ) : (
                  <label className="body-goal-slot__upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBodyPhotoChange(index)}
                      disabled={!canEdit}
                    />
                    <span>{canEdit ? "Ajouter une photo" : "Connecte-toi pour ajouter une photo"}</span>
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
