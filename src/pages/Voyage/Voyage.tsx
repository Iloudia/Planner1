import { useEffect } from "react"
import travelCity from "../../assets/voyage.webp"
import travelBeach from "../../assets/victoria-harder-dupe.webp"
import travelNature from "../../assets/amy-rikard-dupe.webp"
import PageHeading from "../../components/PageHeading"
import "./Voyage.css"

type TripStatus = "booked" | "ideation" | "packing"

type TripCard = {
  id: string
  title: string
  location: string
  dates: string
  focus: string
  budget: string
  status: TripStatus
  cover: string
}

const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  booked: "Reserve",
  ideation: "A planifier",
  packing: "Check-in",
}

const TRIPS: TripCard[] = [
  {
    id: "lisbon-weekend",
    title: "City break Lisbonne",
    location: "Portugal",
    dates: "20 - 23 mars",
    focus: "Cafés, librairies, balade à Belém",
    budget: "450 EUR",
    status: "booked",
    cover: travelCity,
  },
  {
    id: "crete-ete",
    title: "Crête en été",
    location: "Chania",
    dates: "5 - 12 juillet",
    focus: "Plages, sunset boat, marche local",
    budget: "980 EUR",
    status: "packing",
    cover: travelBeach,
  },
  {
    id: "alpines",
    title: "Cabane en montagne",
    location: "Haute-Savoie",
    dates: "11 - 13 octobre",
    focus: "Randos faciles + spa nordique",
    budget: "320 EUR",
    status: "ideation",
    cover: travelNature,
  },
]

const packingList = [
  "Passeport + billets",
  "Trousse sante / assurances",
  "Chargeurs + adaptateur",
  "Tenues jour et soir",
  "Maillot, lunettes, creme SPF",
  "Kindle + playlist offline",
  "Mini kit photo / video",
]

const quickReminders = [
  "Verifier les check-in en ligne la veille",
  "Screenshot des confirmations (airbnb, vols, transferts)",
  "Preparer 2 resto coup de coeur sur place",
  "Partager l'itineraire avec le +1",
]

const VoyagePage = () => {
  useEffect(() => {
    document.body.classList.add("planner-page--white")
    return () => {
      document.body.classList.remove("planner-page--white")
    }
  }, [])

  return (
    <div className="content-page voyage-page">
      <PageHeading eyebrow="Voyage" title="Planifier les escapades" />
      <div className="page-hero">
        <div className="hero-chip">Voyage</div>
        <h2>Planifier les prochaines escapades</h2>
        <p className="muted">Dossiers voyages, budget et checklist cabine regroupes au meme endroit.</p>
        <div className="hero-actions">
          <button type="button" className="pill">
            Ajouter une idée
          </button>
          <button type="button" className="pill pill-ghost">
            Exporter en PDF
          </button>
        </div>
      </div>

      <div className="voyage-layout">
        <section className="voyage-trips">
          <header className="voyage-section-header">
            <div>
              <p className="eyebrow">Prochains departs</p>
              <h2>Itineraires</h2>
            </div>
            <span className="voyage-tag">{TRIPS.length} voyages</span>
          </header>

          <div className="voyage-grid">
            {TRIPS.map((trip) => (
              <article key={trip.id} className="voyage-card">
                <div className="voyage-card__media">
                  <img src={trip.cover} alt={trip.title} loading="lazy" decoding="async" />
                  <span className={`voyage-status voyage-status--${trip.status}`}>
                    {TRIP_STATUS_LABELS[trip.status]}
                  </span>
                </div>
                <div className="voyage-card__body">
                  <div className="voyage-card__meta">
                    <span className="voyage-location">{trip.location}</span>
                    <span className="voyage-budget">{trip.budget}</span>
                  </div>
                  <h3>{trip.title}</h3>
                  <p className="voyage-focus">{trip.focus}</p>
                  <div className="voyage-dates">{trip.dates}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="voyage-sidebar">
          <div className="voyage-panel">
            <p className="eyebrow">Checklist bagage</p>
            <ul className="voyage-list">
              {packingList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="voyage-panel">
            <p className="eyebrow">Notes rapides</p>
            <ul className="voyage-list">
              {quickReminders.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default VoyagePage
