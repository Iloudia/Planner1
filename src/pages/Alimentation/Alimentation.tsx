import photo1 from "../../assets/planner-01.jpg";
import photo2 from "../../assets/planner-02.jpg";
import photo3 from "../../assets/planner-03.jpg";
import photo4 from "../../assets/planner-04.jpg";
import photo5 from "../../assets/planner-05.jpg";
import photo6 from "../../assets/planner-06.jpg";
import "./Alimentation.css";

const stripImages = [photo1, photo2, photo3, photo4, photo5, photo6];

function DietPage() {
  return (
    <>
      <div className="page-photo-strip" aria-hidden="true">
        {stripImages.map((src, index) => (
          <div key={index} className="page-photo-strip__item">
            <img src={src} alt={`Inspiration ${index + 1}`} />
          </div>
        ))}
      </div>

      <main className="content-page diet-page">
        <div className="page-accent-bar" aria-hidden="true" />

        <header className="page-hero">
          <div className="hero-chip">Diet</div>
          <h2>Alimentation & sport</h2>
          <p className="page-hero__subtitle">
            Optimise ton énergie, ta récupération et tes résultats grâce à une alimentation
            simple, structurée et adaptée à ton entraînement.
          </p>
        </header>

        {/* SECTION : objectifs */}
        <section className="page-section diet-section">
          <h3>Choisis ton objectif</h3>
          <p className="diet-section__intro">
            La base de ton alimentation dépend de ce que tu veux prioriser. Les principes
            restent similaires, mais les quantités et les priorités changent légèrement.
          </p>
          <div className="diet-grid diet-grid--3">
            <article className="diet-card">
              <h4>Perte de poids</h4>
              <ul>
                <li>Déficit calorique léger (−10 à −20 %)</li>
                <li>Beaucoup de légumes pour le volume et la satiété</li>
                <li>Protéines à chaque repas pour protéger la masse musculaire</li>
                <li>Limiter les produits ultra-transformés et le sucre ajouté</li>
              </ul>
            </article>

            <article className="diet-card">
              <h4>Prise de muscle</h4>
              <ul>
                <li>Léger surplus calorique (+5 à +15 %)</li>
                <li>Protéines régulières (2 g/kg de poids de corps environ)</li>
                <li>Glucides autour de l’entraînement pour la performance</li>
                <li>Bonnes graisses (olive, colza, noix, avocat…)</li>
              </ul>
            </article>

            <article className="diet-card">
              <h4>Performance & énergie</h4>
              <ul>
                <li>Glucides de qualité (riz, pâtes complètes, avoine, quinoa…)</li>
                <li>Hydratation régulière tout au long de la journée</li>
                <li>Repas légers avant l’effort, plus complets après</li>
                <li>Sommeil et récupération pris en compte dans la routine</li>
              </ul>
            </article>
          </div>
        </section>

        {/* SECTION : autour de l'entraînement */}
        <section className="page-section diet-section">
          <h3>Que manger autour de l’entraînement ?</h3>
          <div className="diet-grid diet-grid--3">
            <article className="diet-card diet-card--light">
              <h4>Avant l’entraînement (2–3 h avant)</h4>
              <ul>
                <li>Source de glucides : riz, pâtes, patate douce, pain complet</li>
                <li>Source de protéines : poulet, œufs, tofu, yaourt grec</li>
                <li>Un peu de bons lipides : huile d’olive, noix, avocat</li>
                <li>Évite les plats trop gras ou trop lourds</li>
              </ul>
            </article>

            <article className="diet-card diet-card--light">
              <h4>Juste avant / pendant</h4>
              <ul>
                <li>Si besoin : petit snack 30–45 min avant (banane, compote, barre simple)</li>
                <li>Eau en priorité, éventuellement boisson légèrement sucrée sur séances longues</li>
                <li>Évite les aliments difficiles à digérer et riches en fibres</li>
              </ul>
            </article>

            <article className="diet-card diet-card--light">
              <h4>Après l’entraînement</h4>
              <ul>
                <li>Protéines pour la récupération musculaire (shake, œufs, poisson…)</li>
                <li>Glucides pour recharger les réserves (riz, pâtes, fruits)</li>
                <li>Beaucoup d’eau + éventuellement eau minéralisée</li>
                <li>Un vrai repas complet dans les 2 heures si possible</li>
              </ul>
            </article>
          </div>
        </section>

        {/* SECTION : journée type */}
        <section className="page-section diet-section">
          <h3>Exemple de journée type</h3>
          <div className="diet-grid diet-grid--2">
            <div>
              <p className="diet-section__intro">
                Voici un exemple de journée pour quelqu’un qui s’entraîne en fin
                d’après-midi. Les quantités sont à ajuster selon ton poids, ton sexe et
                ton niveau d’activité.
              </p>
              <ul className="diet-key-points">
                <li>1 source de protéines à chaque repas</li>
                <li>Des légumes au moins 2 fois par jour</li>
                <li>Des glucides autour de l’entraînement</li>
                <li>Des “vraies” pauses repas, sans téléphone si possible</li>
              </ul>
            </div>
            <div className="diet-day">
              <div className="diet-day__item">
                <span className="diet-day__time">Matin</span>
                <p>
                  Flocons d’avoine + yaourt grec + fruits rouges + quelques noix.
                </p>
              </div>
              <div className="diet-day__item">
                <span className="diet-day__time">Collation</span>
                <p>
                  Fruit (banane ou pomme) + poignée d’amandes ou fromage blanc.
                </p>
              </div>
              <div className="diet-day__item">
                <span className="diet-day__time">Midi</span>
                <p>
                  Poulet ou tofu + riz complet + légumes verts + huile d’olive.
                </p>
              </div>
              <div className="diet-day__item">
                <span className="diet-day__time">Avant séance</span>
                <p>
                  Tranche de pain complet + beurre de cacahuète ou petite compote.
                </p>
              </div>
              <div className="diet-day__item">
                <span className="diet-day__time">Après séance</span>
                <p>
                  Shake de protéines ou yaourt riche en protéines + fruit.
                </p>
              </div>
              <div className="diet-day__item">
                <span className="diet-day__time">Soir</span>
                <p>
                  Poisson ou œufs + légumes variés + petite portion de féculents si besoin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION : hydratation & bases */}
        <section className="page-section diet-section">
          <h3>Hydratation & bases à ne pas négliger</h3>
          <div className="diet-grid diet-grid--2">
            <article className="diet-card">
              <h4>Hydratation</h4>
              <ul>
                <li>Objectif général : 1,5 à 2 L d’eau par jour minimum</li>
                <li>Ajoute 500–750 ml les jours d’entraînement intense</li>
                <li>Boire par petites gorgées tout au long de la journée</li>
                <li>Surveiller la couleur des urines (clair = ok, foncé = manque d’eau)</li>
              </ul>
            </article>
            <article className="diet-card">
              <h4>Habitudes simples</h4>
              <ul>
                <li>Préparer tes repas ou au moins tes bases (féculents + protéines)</li>
                <li>Avoir toujours 1–2 collations “clean” prêtes à emporter</li>
                <li>Limiter alcool et sodas le plus possible</li>
                <li>Ne pas diaboliser un aliment : c’est l’ensemble de la semaine qui compte</li>
              </ul>
            </article>
          </div>
        </section>

        {/* SECTION : FAQ rapide */}
        <section className="page-section diet-section">
          <h3>Questions fréquentes</h3>
          <div className="diet-faq">
            <details>
              <summary>Faut-il peser tous ses aliments ?</summary>
              <p>
                Ce n’est pas obligatoire. Peser peut aider au début pour se rendre compte des
                portions, mais l’objectif est de pouvoir s’en détacher progressivement et
                fonctionner à l’œil.
              </p>
            </details>
            <details>
              <summary>Est-ce grave si je fais un “cheat meal” ?</summary>
              <p>
                Non, tant que ça reste occasionnel et que le reste de ta semaine est cohérent.
                Ce qui compte, c’est la moyenne sur plusieurs jours, pas un seul repas.
              </p>
            </details>
            <details>
              <summary>Les compléments alimentaires sont-ils obligatoires ?</summary>
              <p>
                Non. Une whey protéinée, de la créatine ou de la vitamine D peuvent être utiles
                selon les cas, mais ta priorité doit rester : alimentation réelle, sommeil,
                hydratation et régularité à l’entraînement.
              </p>
            </details>
          </div>
        </section>

        <div className="page-footer-bar" aria-hidden="true" />
      </main>
    </>
  );
}

export default DietPage;
