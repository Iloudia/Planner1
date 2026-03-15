import type { ChangeEvent, FormEvent } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import stampLove from "../../assets/Timbre-1.webp"
import stampKey from "../../assets/Timbre-2.webp"
import PageHeading from "../../components/PageHeading"
import { useAuth } from "../../context/AuthContext"
import useUserSelfLove from "../../hooks/useUserSelfLove"
import { deleteMedia, uploadImage } from "../../services/media/api"
import "./SelfLove.css"

const buildDefaultFutureOpenDate = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return date.toISOString().slice(0, 10)
}

const SelfLovePage = () => {
  const { isAuthReady, userId } = useAuth()
  const {
    draft,
    photos,
    qualities,
    thoughts,
    isLoading,
    error,
    updateDraft,
    replacePhoto,
    clearPhoto,
    addQuality,
    removeQuality,
    addThought,
    removeThought,
    saveInnerChildArchive,
    saveBestFriendArchive,
    saveLetterArchive,
    saveFutureLetterArchive,
    sealFutureLetter,
  } = useUserSelfLove()
  const canEdit = Boolean(userId)
  const isSelfLoveLoading = !isAuthReady || isLoading

  const [qualityDraft, setQualityDraft] = useState("")
  const [thoughtDraft, setThoughtDraft] = useState("")
  const [releasingThoughtIds, setReleasingThoughtIds] = useState<Set<string>>(new Set())
  const [letterTemplate, setLetterTemplate] = useState<"classic" | "kitty">("classic")
  const [letterSaveConfirmationVisible, setLetterSaveConfirmationVisible] = useState(false)
  const [futureSealConfirmationVisible, setFutureSealConfirmationVisible] = useState(false)
  const [exerciseSaveConfirmationVisible, setExerciseSaveConfirmationVisible] = useState(false)
  const [draftState, setDraftState] = useState(draft)
  const letterSaveConfirmationTimeout = useRef<number | null>(null)
  const futureSealConfirmationTimeout = useRef<number | null>(null)
  const exerciseSaveConfirmationTimeout = useRef<number | null>(null)

  useEffect(() => {
    document.body.classList.add("self-love-page--lux")
    return () => {
      document.body.classList.remove("self-love-page--lux")
      if (letterSaveConfirmationTimeout.current !== null) {
        window.clearTimeout(letterSaveConfirmationTimeout.current)
      }
      if (exerciseSaveConfirmationTimeout.current !== null) {
        window.clearTimeout(exerciseSaveConfirmationTimeout.current)
      }
      if (futureSealConfirmationTimeout.current !== null) {
        window.clearTimeout(futureSealConfirmationTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    setDraftState(draft)
  }, [draft])

  const showLetterConfirmation = () => {
    setLetterSaveConfirmationVisible(true)
    if (letterSaveConfirmationTimeout.current !== null) {
      window.clearTimeout(letterSaveConfirmationTimeout.current)
    }
    letterSaveConfirmationTimeout.current = window.setTimeout(() => {
      setLetterSaveConfirmationVisible(false)
      letterSaveConfirmationTimeout.current = null
    }, 2000)
  }

  const showFutureConfirmation = () => {
    setFutureSealConfirmationVisible(true)
    if (futureSealConfirmationTimeout.current !== null) {
      window.clearTimeout(futureSealConfirmationTimeout.current)
    }
    futureSealConfirmationTimeout.current = window.setTimeout(() => {
      setFutureSealConfirmationVisible(false)
      futureSealConfirmationTimeout.current = null
    }, 2200)
  }

  const showExerciseConfirmation = () => {
    setExerciseSaveConfirmationVisible(true)
    if (exerciseSaveConfirmationTimeout.current !== null) {
      window.clearTimeout(exerciseSaveConfirmationTimeout.current)
    }
    exerciseSaveConfirmationTimeout.current = window.setTimeout(() => {
      setExerciseSaveConfirmationVisible(false)
      exerciseSaveConfirmationTimeout.current = null
    }, 2000)
  }

  const persistDraftField = async (field: keyof typeof draftState) => {
    await updateDraft({ [field]: draftState[field] })
  }

  const handlePhotoChange = async (slotId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const previousPhoto = photos.find((photo) => photo.id === slotId)
    const uploaded = await uploadImage(file, "self-love-photo", slotId)
    try {
      await replacePhoto(slotId, { url: uploaded.url, path: uploaded.path })
      if (previousPhoto?.imagePath) {
        void deleteMedia(previousPhoto.imagePath).catch(() => undefined)
      }
    } catch {
      void deleteMedia(uploaded.path).catch(() => undefined)
    }
  }

  const handleClearPhoto = async (slotId: string) => {
    const previousPhoto = photos.find((photo) => photo.id === slotId)
    await clearPhoto(slotId)
    if (previousPhoto?.imagePath) {
      void deleteMedia(previousPhoto.imagePath).catch(() => undefined)
    }
  }

  const handleAddQuality = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = qualityDraft.trim()
    if (!trimmed) return
    await addQuality(trimmed)
    setQualityDraft("")
  }

  const handleAddThought = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = thoughtDraft.trim()
    if (!trimmed) return
    await addThought(trimmed)
    setThoughtDraft("")
  }

  const handleReleaseThought = (thoughtId: string) => {
    setReleasingThoughtIds((previous) => new Set(previous).add(thoughtId))
    window.setTimeout(() => {
      void removeThought(thoughtId)
      setReleasingThoughtIds((previous) => {
        const next = new Set(previous)
        next.delete(thoughtId)
        return next
      })
    }, 620)
  }

  const handleSaveInnerChildExercise = async () => {
    const snapshot = {
      message: draftState.innerChildMessage.trim(),
      reassurance: draftState.innerChildReassurance.trim(),
      neededWords: draftState.innerChildNeededWords.trim(),
    }
    if (!Object.values(snapshot).some((value) => value.length > 0)) {
      window.alert("Commence par ecrire quelques phrases avant d'ajouter cet exercice.")
      return
    }
    await saveInnerChildArchive(snapshot)
    const clearedInnerChildDraft = {
      innerChildMessage: "",
      innerChildReassurance: "",
      innerChildNeededWords: "",
    }
    setDraftState((previous) => ({ ...previous, ...clearedInnerChildDraft }))
    await updateDraft(clearedInnerChildDraft)
    showExerciseConfirmation()
  }

  const handleSaveBestFriendExercise = async () => {
    const snapshot = {
      advice: draftState.bestFriendAdvice.trim(),
      selfTalk: draftState.bestFriendSelfTalk.trim(),
    }
    if (!Object.values(snapshot).some((value) => value.length > 0)) {
      window.alert("Commence par ecrire quelques phrases avant d'ajouter cet exercice.")
      return
    }
    await saveBestFriendArchive(snapshot)
    const clearedBestFriendDraft = {
      bestFriendAdvice: "",
      bestFriendSelfTalk: "",
    }
    setDraftState((previous) => ({ ...previous, ...clearedBestFriendDraft }))
    await updateDraft(clearedBestFriendDraft)
    showExerciseConfirmation()
  }

  const handleSaveLetter = async () => {
    const body = letterTemplate === "classic" ? draftState.letterBody : draftState.kittyLetterBody
    const trimmed = body.trim()
    if (!trimmed) {
      window.alert("Commence par ecrire ta lettre avant de l'enregistrer.")
      return
    }
    await saveLetterArchive({
      template: letterTemplate,
      to: letterTemplate === "classic" ? draftState.letterTo : undefined,
      from: letterTemplate === "classic" ? draftState.letterFrom : undefined,
      body: trimmed,
    })
    showLetterConfirmation()
  }

  const handleSaveFutureLetter = async () => {
    const trimmed = draftState.futureLetterBody.trim()
    if (!trimmed) {
      window.alert("Commence par ecrire ta lettre avant de l'enregistrer.")
      return
    }
    await saveFutureLetterArchive({
      to: draftState.futureLetterTo,
      from: draftState.futureLetterFrom,
      body: trimmed,
      openDate: draftState.futureLetterOpenDate || undefined,
    })
    showLetterConfirmation()
  }

  const handleSealFutureLetter = async () => {
    const trimmed = draftState.futureLetterBody.trim()
    if (!trimmed) {
      window.alert("Ecris quelques lignes avant de sceller ta lettre.")
      return
    }
    if (!draftState.futureLetterOpenDate) {
      window.alert("Choisis une date d'ouverture.")
      return
    }
    const openDate = new Date(`${draftState.futureLetterOpenDate}T00:00:00`)
    if (Number.isNaN(openDate.getTime()) || openDate.getTime() <= Date.now()) {
      window.alert("Choisis une date future valide.")
      return
    }
    await sealFutureLetter({
      to: draftState.futureLetterTo,
      from: draftState.futureLetterFrom,
      body: trimmed,
      openDate: draftState.futureLetterOpenDate,
    })
    showFutureConfirmation()
  }

  const today = useMemo(
    () => ({
      iso: new Date().toISOString().slice(0, 10),
    }),
    [],
  )
  const futureOpenDate = draftState.futureLetterOpenDate
  const openDateTimestamp = futureOpenDate ? new Date(`${futureOpenDate}T00:00:00`).getTime() : NaN
  const openDateLabel =
    futureOpenDate && !Number.isNaN(openDateTimestamp)
      ? new Date(`${futureOpenDate}T00:00:00`).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date d'ouverture a definir"

  if (isSelfLoveLoading) {
    return (
      <div className="self-love-page self-love-page--loading" aria-busy="true" aria-live="polite">
        <span className="self-love-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="self-love-page">
      <PageHeading eyebrow="Self love" title="mindset" />
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer ton espace self-love.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}
      <fieldset disabled={!canEdit} style={{ border: 0, margin: 0, padding: 0, minInlineSize: 0 }}>

      <section className="self-love-section self-love-section--photos">
        <div className="self-love-photos__intro">
          <h2 className="self-love-chocolate self-love-photos__title">Aime-toi</h2>
          <p className="self-love-chocolate self-love-photos__subtitle">
            Regarde-toi avec bienveillance et choisis 6 photos ou tu rayonnes.
          </p>
        </div>
        <div className="self-love-photos-frame">
          <div className="self-love-photos">
            {photos.map((photo, index) => (
              <div key={photo.id} className="self-love-photo-card">
                <label className="self-love-photo-card__drop">
                  {photo.imageUrl ? (
                    <img src={photo.imageUrl} alt={`Souvenir ${index + 1}`} loading="lazy" decoding="async" />
                  ) : (
                    <span className="self-love-photo-card__placeholder">
                      <span className="body-goal-slot__upload">
                        <span>Ajouter une photo</span>
                      </span>
                    </span>
                  )}
                  <input type="file" accept="image/*" onChange={(event) => void handlePhotoChange(photo.id, event)} />
                </label>
                {photo.imageUrl ? (
                  <button className="body-goal-slot__action" onClick={() => void handleClearPhoto(photo.id)}>
                    Retirer
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="self-love-sections-row">
        <section className="self-love-section self-love-section--qualities">
          <h2 className="self-love-chocolate">Liste tes qualites</h2>
          <form className="self-love-form-row" onSubmit={handleAddQuality}>
            <textarea
              className="self-love-exercise__textarea"
              placeholder="Ex : Je sais ecouter avec le coeur."
              value={qualityDraft}
              onChange={(event) => setQualityDraft(event.target.value)}
            />
            <button type="submit">Ajouter</button>
          </form>
          <div className="self-love-list-pad">
            <div className="self-love-list-pad__bow">
              <span aria-hidden="true" />
              <div>
                <strong>Ce que j'aime chez moi</strong>
              </div>
            </div>
            <ul className="self-love-list">
              {qualities.map((quality) => (
                <li key={quality.id}>
                  <span className="self-love-list__heart" aria-hidden="true">
                    *
                  </span>
                  <span className="self-love-list__text">{quality.text}</span>
                  <button
                    type="button"
                    className="modal__close"
                    onClick={() => void removeQuality(quality.id)}
                    aria-label="Retirer cette qualite"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
              {qualities.length === 0 ? (
                <li className="self-love-list__empty">
                  <span className="self-love-list__heart" aria-hidden="true">
                    *
                  </span>
                  <span className="self-love-list__text">Commence par noter une seule phrase douce.</span>
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <section className="self-love-section self-love-section--thoughts">
          <div>
            <h2 className="self-love-chocolate">Pensees negatives a laisser derriere toi</h2>
            <p className="self-love-chocolate">Clique sur une pensee pour la laisser s'envoler.</p>
          </div>
          <form className="self-love-form-row" onSubmit={handleAddThought}>
            <textarea
              className="self-love-exercise__textarea"
              placeholder="Ex. Je dois etre parfait(e)."
              value={thoughtDraft}
              onChange={(event) => setThoughtDraft(event.target.value)}
            />
            <button type="submit">Ajouter</button>
          </form>
          <div className="self-love-thoughts">
            {thoughts.map((thought) => {
              const releasing = releasingThoughtIds.has(thought.id)
              return (
                <button
                  type="button"
                  key={thought.id}
                  className={releasing ? "self-love-thought self-love-thought--releasing" : "self-love-thought"}
                  onClick={() => handleReleaseThought(thought.id)}
                >
                  <span>{thought.text}</span>
                  <em>Clique pour la dissoudre</em>
                </button>
              )
            })}
            {thoughts.length === 0 ? (
              <div className="self-love-thought self-love-thought--empty">
                <span>Plus aucune pensee limitante ici.</span>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="self-love-section self-love-exercises">
        <div />
        <div className="self-love-exercise__grid">
          <article className="self-love-exercise__card">
            <div className="self-love-exercise__eyebrow">L'enfant interieur</div>
            <h3 className="self-love-chocolate">Dialogue doux avec ton passe</h3>
            <p className="self-love-chocolate">
              Offre a ton enfant interieur les mots qui avaient manque.
            </p>
            <label className="self-love-exercise__prompt">
              <span>Que souhaiterais-tu lui dire maintenant ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={draftState.innerChildMessage}
                onChange={(event) => setDraftState((previous) => ({ ...previous, innerChildMessage: event.target.value }))}
                onBlur={() => void persistDraftField("innerChildMessage")}
                placeholder="Je te dirais..."
              />
            </label>
            <label className="self-love-exercise__prompt">
              <span>Comment pourrais-tu le rassurer ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={draftState.innerChildReassurance}
                onChange={(event) => setDraftState((previous) => ({ ...previous, innerChildReassurance: event.target.value }))}
                onBlur={() => void persistDraftField("innerChildReassurance")}
                placeholder="Je te rassure en..."
              />
            </label>
            <label className="self-love-exercise__prompt">
              <span>De quoi aurait-il eu besoin d'entendre ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={draftState.innerChildNeededWords}
                onChange={(event) => setDraftState((previous) => ({ ...previous, innerChildNeededWords: event.target.value }))}
                onBlur={() => void persistDraftField("innerChildNeededWords")}
                placeholder="Tu avais besoin d'entendre..."
              />
            </label>
            <button type="button" className="self-love-exercise__save" onClick={() => void handleSaveInnerChildExercise()}>
              Ajouter aux archives
            </button>
          </article>

          <article className="self-love-exercise__card">
            <div className="self-love-exercise__eyebrow">Jeu de roles</div>
            <h3 className="self-love-chocolate">Le meilleur ami comme boussole</h3>
            <p className="self-love-chocolate">
              Imagine qu'un ami vive exactement la meme situation que toi.
            </p>
            <label className="self-love-exercise__prompt">
              <span>Que lui dirais-tu ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={draftState.bestFriendAdvice}
                onChange={(event) => setDraftState((previous) => ({ ...previous, bestFriendAdvice: event.target.value }))}
                onBlur={() => void persistDraftField("bestFriendAdvice")}
                placeholder="Je lui dirais..."
              />
            </label>
            <label className="self-love-exercise__prompt">
              <span>Quelle est la difference avec ce que tu te dis a toi-meme ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={draftState.bestFriendSelfTalk}
                onChange={(event) => setDraftState((previous) => ({ ...previous, bestFriendSelfTalk: event.target.value }))}
                onBlur={() => void persistDraftField("bestFriendSelfTalk")}
                placeholder="Je remarque que..."
              />
            </label>
            <p className="self-love-exercise__hint">
              Cet exercice casse l'auto-critique et rappelle que tu merites la meme douceur.
            </p>
            <button type="button" className="self-love-exercise__save" onClick={() => void handleSaveBestFriendExercise()}>
              Ajouter aux archives
            </button>
          </article>
        </div>
        <div className={`self-love-toast self-love-toast--page${exerciseSaveConfirmationVisible ? " is-visible" : ""}`} role="status" aria-live="polite">
          <div className="self-love-toast__card">
            <h4>Page ajoutee</h4>
            <p>Ton contenu a bien ete ajoute dans les archives.</p>
          </div>
        </div>
      </section>

      <section className="self-love-section self-love-letter">
        <div className="self-love-letter__cards">
          <div className="self-love-letter__frame self-love-letter__card self-love-letter__card--classic is-active">
            <div className="self-love-future-letter__head">
              <div>
                <p className="self-love-letter__title">Lettre a mon moi du futur</p>
                <p className="self-love-future-letter__subtitle">Ecris-la aujourd'hui, laisse le temps faire le reste.</p>
              </div>
              <div className="self-love-future-letter__status">
                <span>Prete a sceller</span>
                <strong>{openDateLabel}</strong>
              </div>
            </div>
            <div className="self-love-letter__addresses self-love-future-letter__addresses">
              <label>
                <span>De</span>
                <input
                  type="text"
                  value={draftState.futureLetterFrom}
                  onChange={(event) => setDraftState((previous) => ({ ...previous, futureLetterFrom: event.target.value }))}
                  onBlur={() => void persistDraftField("futureLetterFrom")}
                  placeholder="Ta version presente"
                />
              </label>
              <label>
                <span>A</span>
                <input
                  type="text"
                  value={draftState.futureLetterTo}
                  onChange={(event) => setDraftState((previous) => ({ ...previous, futureLetterTo: event.target.value }))}
                  onBlur={() => void persistDraftField("futureLetterTo")}
                  placeholder="Ton moi futur"
                />
              </label>
              <label>
                <span>Date d'ouverture</span>
                <input
                  type="date"
                  min={today.iso}
                  value={draftState.futureLetterOpenDate || buildDefaultFutureOpenDate()}
                  onChange={(event) => setDraftState((previous) => ({ ...previous, futureLetterOpenDate: event.target.value }))}
                  onBlur={() => void persistDraftField("futureLetterOpenDate")}
                />
              </label>
            </div>
            <div className="self-love-letter__body self-love-future-letter__body">
              <p className="self-love-letter__salutation">Cher moi,</p>
              <textarea
                value={draftState.futureLetterBody}
                onChange={(event) => setDraftState((previous) => ({ ...previous, futureLetterBody: event.target.value }))}
                onBlur={() => void persistDraftField("futureLetterBody")}
                placeholder="Parle-lui de tes reves, de tes peurs, de ce que tu esperes garder vivant."
              />
            </div>
            <div className="self-love-future-letter__footer">
              <div className="self-love-future-letter__stamp">
                <img src={stampLove} alt="Timbre souvenir" loading="lazy" decoding="async" />
                <img src={stampKey} alt="Timbre secret" loading="lazy" decoding="async" />
              </div>
              <div className="self-love-future-letter__actions">
                <button type="button" className="self-love-future-letter__seal" onClick={() => void handleSealFutureLetter()}>
                  Sceller la lettre dans les archives
                </button>
              </div>
            </div>
          </div>

        </div>
        <div className={`self-love-toast self-love-toast--seal${futureSealConfirmationVisible ? " is-visible" : ""}`} role="status" aria-live="polite">
          <div className="self-love-toast__card">
            <h4>Lettre scellee</h4>
            <p>Ta lettre a bien ete scellee et archivee.</p>
          </div>
        </div>
        <div className={`self-love-toast self-love-toast--page${letterSaveConfirmationVisible ? " is-visible" : ""}`} role="status" aria-live="polite">
          <div className="self-love-toast__card">
            <h4>Page ajoutee</h4>
            <p>Ton contenu a bien ete ajoute dans les archives.</p>
          </div>
        </div>
      </section>
      </fieldset>
    </div>
  )
}

export default SelfLovePage


