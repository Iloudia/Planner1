import strip1 from "../../assets/planner-01.jpg"
import strip2 from "../../assets/planner-02.jpg"
import strip3 from "../../assets/planner-03.jpg"
import strip4 from "../../assets/planner-04.jpg"
import strip5 from "../../assets/planner-05.jpg"
import strip6 from "../../assets/planner-06.jpg"
import "../Alimentation/Alimentation.css"

const stripImages = [strip1, strip2, strip3, strip4, strip5, strip6]

const DietClassicPage = () => (
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
          Optimise ton energie, ta recuperation et tes resultats grace a une alimentation simple, structuree et adaptee a
          ton entrainement.
        </p>
      </header>

      <section className="page-section diet-section">
        <h3>Choisis ton objectif</h3>
        <p className="diet-section__intro">
          Les principes restent les memes, mais ton objectif influence les quantites et les priorites. Voici trois
          approches.
        </p>
        <div className="diet-grid diet-grid--3">
          <article className="diet-card">
            <h4>Perte de poids</h4>
            <ul>
              <li>Deficit calorique leger (-10 a -20 %)</li>
              <li>Legumes en grande quantite pour la satiété</li>
              <li>Proteines a chaque repas pour proteger la masse musculaire</li>
              <li>Limiter les produits ultra-transformes</li>
            </ul>
          </article>
          <article className="diet-card">
            <h4>Prise de muscle</h4>
            <ul>
              <li>Surplus calorique controle (+5 a +15 %)</li>
              <li>2 g de proteines / kg de poids de corps environ</li>
              <li>Glucides autour de l entrainement pour la performance</li>
              <li>Bonnes graisses (olive, colza, noix, avocat...)</li>
            </ul>
          </article>
          <article className="diet-card">
            <h4>Performance & energie</h4>
            <ul>
              <li>Glucides de qualite (riz, pates completes, avoine, quinoa...)</li>
              <li>Hydratation reguliere toute la journee</li>
              <li>Repas legers avant l effort, plus complets apres</li>
              <li>Sommeil et recuperation integres a la routine</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section diet-section">
        <h3>Que manger autour de l entrainement ?</h3>
        <div className="diet-grid diet-grid--3">
          <article className="diet-card diet-card--light">
            <h4>Avant l entrainement (2-3 h avant)</h4>
            <ul>
              <li>Glucides : riz, pates, patate douce, pain complet</li>
              <li>Proteines : poulet, oeufs, tofu, yaourt grec</li>
              <li>Un peu de lipides : huile d olive, noix, avocat</li>
              <li>Evite les plats trop gras ou lourds</li>
            </ul>
          </article>
          <article className="diet-card diet-card--light">
            <h4>Juste avant / pendant</h4>
            <ul>
              <li>Snack rapide 30-45 min avant (banane, compote, barre simple)</li>
              <li>Eau en priorite, boisson legerement sucree pour longues seances</li>
              <li>Evite les aliments difficiles a digerer</li>
            </ul>
          </article>
          <article className="diet-card diet-card--light">
            <h4>Apres l entrainement</h4>
            <ul>
              <li>Proteines pour la recuperation (shake, oeufs, poisson...)</li>
              <li>Glucides pour recharger les reserves (riz, pates, fruits)</li>
              <li>Beaucoup d eau + eau mineralisee si besoin</li>
              <li>Un repas complet dans les 2 heures si possible</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section diet-section">
        <h3>Exemple de journee type</h3>
        <div className="diet-grid diet-grid--2">
          <div>
            <p className="diet-section__intro">
              Exemple pour quelqu un qui s entraine en fin d apres-midi. Ajuste les quantites selon ton poids, ton niveau
              d activite et ta faim.
            </p>
            <ul className="diet-key-points">
              <li>Une source de proteines a chaque repas</li>
              <li>Des legumes au moins deux fois par jour</li>
              <li>Des glucides placés autour de l entrainement</li>
              <li>Des pauses repas sans ecran si possible</li>
            </ul>
          </div>
          <div className="diet-day">
            <div className="diet-day__item">
              <span className="diet-day__time">Matin</span>
              <p>Flocons d avoine + yaourt grec + fruits rouges + quelques noix.</p>
            </div>
            <div className="diet-day__item">
              <span className="diet-day__time">Collation</span>
              <p>Fruit (banane ou pomme) + poignée d amandes ou fromage blanc.</p>
            </div>
            <div className="diet-day__item">
              <span className="diet-day__time">Midi</span>
              <p>Poulet ou tofu + riz complet + legumes verts + huile d olive.</p>
            </div>
            <div className="diet-day__item">
              <span className="diet-day__time">Avant séance</span>
              <p>Tranche de pain complet + beurre de cacahuete ou compote.</p>
            </div>
            <div className="diet-day__item">
              <span className="diet-day__time">Apres séance</span>
              <p>Shake de proteines ou yaourt riche en proteines + fruit.</p>
            </div>
            <div className="diet-day__item">
              <span className="diet-day__time">Soir</span>
              <p>Poisson ou oeufs + legumes varies + portion de feculents si besoin.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section diet-section">
        <h3>Hydratation & bases a ne pas negliger</h3>
        <div className="diet-grid diet-grid--2">
          <article className="diet-card">
            <h4>Hydratation</h4>
            <ul>
              <li>Objectif : 1,5 a 2 L d eau par jour minimum</li>
              <li>Ajoute 500-750 ml les jours d entrainement intense</li>
              <li>Boire par petites gorgees toute la journee</li>
              <li>Surveiller la couleur des urines (clair = ok, fonce = manque d eau)</li>
            </ul>
          </article>
          <article className="diet-card">
            <h4>Habitudes simples</h4>
            <ul>
              <li>Preparer tes repas ou au moins tes bases (feculents + proteines)</li>
              <li>Avoir 1-2 collations saines prêtes a emporter</li>
              <li>Limiter alcool et sodas autant que possible</li>
              <li>Ne pas diaboliser un aliment : c est la moyenne de la semaine qui compte</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section diet-section">
        <h3>Questions frequentes</h3>
        <div className="diet-faq">
          <details>
            <summary>Faut-il peser tous ses aliments ?</summary>
            <p>
              Pas obligatoire. Peser peut aider au debut pour se rendre compte des portions mais l objectif est de pouvoir
              s en passer progressivement.
            </p>
          </details>
          <details>
            <summary>Est-ce grave si je fais un “cheat meal” ?</summary>
            <p>
              Tant que cela reste occasionnel et que le reste de la semaine est coherent, aucun souci. C est la tendance
              globale qui compte.
            </p>
          </details>
          <details>
            <summary>Les complements alimentaires sont-ils necessaires ?</summary>
            <p>
              Non. Whey, creatine ou vitamine D peuvent aider selon les cas mais priorise alimentation reelle, sommeil,
              hydratation et regularite sportive.
            </p>
          </details>
        </div>
      </section>

      <div className="page-footer-bar" aria-hidden="true" />
    </main>
  </>
)

export default DietClassicPage
