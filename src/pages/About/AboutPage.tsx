import "./AboutPage.css"

const supportPoints = [
  "clarifier ce que tu veux vraiment",
  "poser tes intentions",
  "reprendre le controle de tes pensees",
  "avancer avec plus de confiance",
]

const audienceSignals = [
  "tu te sens parfois perdue ou depassee",
  "tu as beaucoup de pensees et besoin de clarte",
  "tu crois que l'ecriture peut transformer les choses",
  "tu veux reprendre ta vie en main, en douceur",
]

const AboutPage = () => (
  <div className="about-page content-page">
    <div className="page-accent-bar" aria-hidden="true" />

    <header className="about-hero">
      <p className="about-hero__eyebrow">?? A propos</p>
      <h1>Parce que le vrai changement commence toujours a l'interieur.</h1>
      <p>
        Planner est ne d'un besoin tres personnel: retrouver un cap quand la vie semble brouillee. Ce n'est pas seulement un outil de
        planification, c'est une respiration qui aide a faire le tri dans ses pensees pour faire de la place a ce qui compte.
      </p>
    </header>

    <section className="about-section">
      <h2>Mon histoire</h2>
      <p>A un moment de ma vie, je me suis sentie perdue. Trop de pensees. Trop de doutes. Trop de reves mis de cote.</p>
      <p>Je savais que je voulais plus. Mais je ne savais pas par ou commencer.</p>
    </section>

    <section className="about-section">
      <h2>Le declic</h2>
      <p>C'est alors que j'ai compris une chose essentielle : le changement commence toujours a l'interieur.</p>
      <p>
        En mettant des mots sur mes intentions, en ecrivant mes objectifs, en apprenant a diriger mes pensees plutot que de les subir, ma realite a
        commence a changer. Pas du jour au lendemain, mais un pas apres l'autre.
      </p>
    </section>

    <section className="about-section">
      <h2>La naissance du projet</h2>
      <p>De cette transformation est ne ce projet. Ce site n'est pas seulement un planificateur de journees. C'est un espace pense pour t'aider a :</n</p>
      <ul>
        {supportPoints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>Un lieu pour ecrire, reflechir et te recentrer.</p>
    </section>

    <section className="about-section">
      <h2>La philosophie</h2>
      <p>Ici, il ne s'agit pas d'en faire toujours plus mais de faire mieux, avec intention.</p>
      <div className="about-mantra">
        <span>Un jour a la fois.</span>
        <span>A ton rythme.</span>
        <span>Avec bienveillance.</span>
      </div>
    </section>

    <section className="about-section">
      <h2>Pour qui est ce site</h2>
      <p>Ce site est fait pour toi si :</p>
      <ul>
        {audienceSignals.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>

    <section className="about-section about-invitation">
      <h2>Invitation</h2>
      <p>
        Si toi aussi tu ressens ce besoin de changement, si tu sais que quelque chose doit evoluer mais que tu ne sais pas encore par ou commencer... Alors tu es exactement au bon endroit.
      </p>
      <p>Je t'invite a respirer, a prendre un carnet, et a laisser les mots tracer la suite.</p>
    </section>

    <div className="page-footer-bar" aria-hidden="true" />
  </div>
)

export default AboutPage
