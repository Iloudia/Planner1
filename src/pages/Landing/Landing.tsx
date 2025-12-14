import { useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useMoodboard } from "../../context/MoodboardContext"
import "./Landing.css"

const dailyFeatures = [
  {
    title: "Planification de tes journees",
    description: "Organise tes journees avec clarte, intention et douceur pour faire avancer ce qui compte sans pression.",
  },
  {
    title: "Planification des repas",
    description: "Prepare tes repas et debarasse-toi du fameux \"On mange quoi ce soir ?\" grace a des menus anticipes.",
  },
  {
    title: "Activites et projets futurs",
    description: "Note les voyages, sorties, projets perso et moments pour toi afin de nourrir tes reves au quotidien.",
  },
  {
    title: "Journaling et ecriture positive",
    description: "Depose tes pensees, gratitudes et emotions dans un safe place mental pour retrouver ta clarte.",
  },
  {
    title: "Wishlist inspiration",
    description: "Regroupe tous les objets, experiences ou idees que tu veux explorer pour liberer ta tete.",
  },
  {
    title: "Routines matin et soir",
    description: "Cree des rituels qui te ressemblent pour des matins plus doux et des soirees apaisantes.",
  },
  {
    title: "Finances en toute simplicite",
    description: "Suis budget, depenses et objectifs financiers avec une approche feminine et sans culpabilite.",
  },
  {
    title: "Sport et mouvement",
    description: "Planifie ton mouvement et ton energie pour te sentir bien dans ton corps, loin de la performance.",
  },
]

const differentiatorHighlights = [
  "alleger ta charge mentale",
  "t'aider a te sentir plus serenne",
  "reprendre le controle de ton temps",
  "creer une vie qui te ressemble",
  "te reconnecter a toi-meme",
]

const reasonsToLove = [
  "100 % positif et bienveillant",
  "Cree specialement pour les femmes",
  "Tout ton quotidien au meme endroit",
  "Clair, simple et agreable a utiliser",
  "Pense pour ton bien-etre mental",
]

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, userEmail, logout } = useAuth()
  const { moodboardSrc } = useMoodboard()

  const destinationPath = useMemo(() => {
    const fromRoute = location.state as { from?: { pathname: string } } | undefined
    return fromRoute?.from?.pathname ?? "/home"
  }, [location.state])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destinationPath, { replace: true })
    }
  }, [destinationPath, isAuthenticated, navigate])

  return (
    <div className="landing-page">
      <div className="page-accent-bar" aria-hidden="true" />
      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-hero__tagline">Organisation positive feminine</span>
          <h1>
            {"\u2728"} Le site qui transforme ton quotidien en une vie plus organisee, plus douce et plus alignee {"\u2728"}
          </h1>
          <p className="landing-hero__subtitle">
            Un espace cree pour les femmes, ou tout ce dont tu as besoin pour t'organiser, rever, planifier et prendre soin de ton
            mental se trouve au meme endroit.
          </p>
          <p className="landing-hero__accent">
            Parce que tu merites une vie structuree sans pression, productive sans stress, et inspirante au quotidien.
          </p>
          <div className="landing-hero__actions">
            <button type="button" className="landing-cta-button" onClick={() => navigate("/login")}>
              Commencer mon organisation positive
            </button>
            {isAuthenticated ? (
              <button type="button" className="landing-secondary-button" onClick={() => navigate("/home")}>
                Reprendre ma planification
              </button>
            ) : null}
          </div>
          {isAuthenticated ? (
            <div className="landing-hero__status">
              Connecte en tant que <strong>{userEmail}</strong>
              <button type="button" onClick={logout}>
                Se deconnecter
              </button>
            </div>
          ) : null}
        </div>
        <div className="landing-hero__visual">
          <img src={moodboardSrc} alt="Moodboard Planner" />
        </div>
      </section>

      <section className="landing-identification" aria-labelledby="landing-identification-title">
        <div className="landing-identification__intro">
          <span className="landing-section-label">A qui s'adresse ce site ?</span>
          <h2 id="landing-identification-title">{"\u2764"} Pense par une femme, pour les femmes</h2>
          <p>
            Si tu es une femme qui veut mieux s'organiser sans s'epuiser, visualiser ses reves et prendre soin de son bien-etre
            mental, cet espace a ete pense pour toi.
          </p>
        </div>
        <div className="landing-identification__panel">
          <p className="landing-identification__subtitle">Si tu es une femme qui :</p>
          <ul className="landing-identification__list">
            <li>a mille idees en tete</li>
            <li>veut mieux s'organiser sans s'epuiser</li>
            <li>reve d'une vie plus alignee, plus serenne</li>
            <li>aime planifier, ecrire, visualiser, rever</li>
            <li>veut prendre soin de son bien-etre mental</li>
          </ul>
          <p className="landing-identification__note">
            Ici, on ne parle pas de productivite toxique. On parle d'organisation bienveillante, de clarte mentale et du plaisir a
            planifier sa vie.
          </p>
        </div>
      </section>

      <section className="landing-daily-hub" aria-labelledby="landing-daily-hub-title">
        <div className="landing-section-heading">
          <h2 id="landing-daily-hub-title">{"\u{1F338}"} Un espace unique pour organiser ta vie... et te sentir bien</h2>
          <p>
            Fini les carnets eparpilles, les notes sur ton telephone et les applis dans tous les sens. Ici, tout est centralise pour
            simplifier ton quotidien et te liberer de la charge mentale.
          </p>
        </div>
        <ul className="landing-daily-list">
          {dailyFeatures.map((feature) => (
            <li key={feature.title}>
              <strong>{feature.title}</strong>
              <span>{feature.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-differentiator" aria-labelledby="landing-differentiator-title">
        <div className="landing-section-heading">
          <h2 id="landing-differentiator-title">{"\u{1F337}"} Bien plus qu'un outil d'organisation</h2>
          <p>
            Ce site n'est pas qu'un planner digital. C'est un veritable cocon positif concu pour te rappeler que tu peux avancer a
            ton rythme, en restant douce avec toi-meme.
          </p>
          <p>Tout est pense pour que tu te sentes bien, inspiree et alignee.</p>
        </div>
        <ul className="landing-differentiator__list">
          {differentiatorHighlights.map((highlight) => (
            <li key={highlight}>
              <span aria-hidden="true">{"\u2728"}</span>
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-reasons" aria-labelledby="landing-reasons-title">
        <h2 id="landing-reasons-title">Pourquoi tu vas l'adorer {"\u{1F497}"}</h2>
        <ul className="landing-reasons__list">
          {reasonsToLove.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="landing-final-cta" aria-labelledby="landing-final-cta-title">
        <h2 id="landing-final-cta-title">{"\u{1F497}"} Et si tu t'offrais enfin une organisation qui te fait du bien ?</h2>
        <p>
          Tu n'as pas besoin d'en faire plus. Tu as besoin d'un espace qui t'aide a respirer, structurer et t'epanouir. Rejoins un
          univers cree pour les femmes qui veulent une vie plus organisee sans oublier leur bien-etre.
        </p>
        <button type="button" className="landing-cta-button" onClick={() => navigate("/login")}>
          Je commence mon organisation positive des maintenant
        </button>
      </section>

      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default LandingPage
