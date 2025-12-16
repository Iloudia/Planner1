﻿import { useEffect, useState } from "react"
import recipeImg1 from "../../assets/planner-01.jpg"
import recipeImg2 from "../../assets/planner-02.jpg"
import recipeImg3 from "../../assets/planner-03.jpg"
import recipeImg4 from "../../assets/planner-04.jpg"
import recipeImg5 from "../../assets/planner-05.jpg"
import recipeImg6 from "../../assets/planner-06.jpg"
import "./DietPage.css"

type Recipe = {
  id: string
  title: string
  flavor: "sucre" | "sale"
  prepTime: string
  servings: string
  image: string
  ingredients: string[]
  steps: string[]
}

const massRecipes: Recipe[] = [
  {
    id: "mass-pancakes",
    title: "Pancakes avoine proteines",
    flavor: "sucre",
    prepTime: "20 min",
    servings: "2 pers",
    image: recipeImg1,
    ingredients: ["80 g de flocons d'avoine", "2 oeufs ou 1 yaourt proteine", "1 banane ecrasee", "1 c.s. de beurre de cacahuete", "Lait vegetal"],
    steps: ["Mixer les flocons pour obtenir une farine.", "Ajouter oeufs, banane, beurre de cacahuete et lait.", "Cuire des pancakes a feu doux et servir avec fruits."],
  },
  {
    id: "mass-bowl-saumon",
    title: "Bowl riz saumon croustillant",
    flavor: "sale",
    prepTime: "30 min",
    servings: "2 pers",
    image: recipeImg2,
    ingredients: ["200 g de riz basmati", "2 paves de saumon", "Avocat et edamame", "Sauce soja et miel", "Graines de sesame"],
    steps: ["Cuire le riz et reserver.", "Saisir le saumon avec sauce soja et miel.", "Composer le bowl riz + legumes + saumon + toppings."],
  },
  {
    id: "mass-wrap-poulet",
    title: "Wrap poulet croquant",
    flavor: "sale",
    prepTime: "15 min",
    servings: "1 pers",
    image: recipeImg4,
    ingredients: ["Tortilla ble entier", "Poulet cuit", "Houmous", "Legumes croquants", "Huile d'olive"],
    steps: ["Tartiner la tortilla de houmous.", "Ajouter poulet et legumes, assaisonner et rouler."],
  },
  {
    id: "mass-omelette-power",
    title: "Omelette power a la feta",
    flavor: "sale",
    prepTime: "12 min",
    servings: "1 pers",
    image: recipeImg3,
    ingredients: ["3 oeufs", "Feta emiettee", "Epinards", "Huile d'olive", "Poivre"],
    steps: ["Battre les oeufs avec sel poivre.", "Saisir les epinards, verser les oeufs et ajouter la feta.", "Plier l'omelette et servir avec pain complet."],
  },
  {
    id: "mass-smoothie-gain",
    title: "Smoothie banane beurre de cacahuete",
    flavor: "sucre",
    prepTime: "10 min",
    servings: "1 pers",
    image: recipeImg5,
    ingredients: ["1 banane", "Beurre de cacahuete", "Flocons d'avoine", "Lait vegetal", "Graines de chia"],
    steps: ["Mixer tous les ingredients avec des glacons.", "Verser dans un grand verre et ajouter topping croquant."],
  },
  {
    id: "mass-pates-cremeuses",
    title: "Pates cremeuses poulet champignons",
    flavor: "sale",
    prepTime: "25 min",
    servings: "2 pers",
    image: recipeImg6,
    ingredients: ["Pates completes", "Blanc de poulet", "Champignons", "Creme legere", "Parmesan"],
    steps: ["Cuire les pates.", "Saisir poulet et champignons, ajouter creme.", "M meler aux pates et servir avec parmesan."],
  },
  {
    id: "mass-quinoa-bowl",
    title: "Quinoa bowl legumes rotis",
    flavor: "sale",
    prepTime: "20 min",
    servings: "2 pers",
    image: recipeImg1,
    ingredients: ["Quinoa", "Pois chiches", "Courgette et poivron", "Tahini", "Citron"],
    steps: ["Cuire le quinoa.", "Rotir legumes et pois chiches.", "Composer le bowl et arroser de sauce tahini citron."],
  },
  {
    id: "mass-patate-bowl",
    title: "Bowl patate douce tempeh",
    flavor: "sale",
    prepTime: "30 min",
    servings: "2 pers",
    image: recipeImg3,
    ingredients: ["Patate douce", "Tempeh ou tofu ferme", "Chou kale", "Sauce soja", "Graines de sesame"],
    steps: ["Rotir les patates douces.", "Carameliser le tempeh avec sauce soja.", "Assembler avec kale masse."],
  },
  {
    id: "mass-chili-boost",
    title: "Chili haricots rouges",
    flavor: "sale",
    prepTime: "35 min",
    servings: "4 pers",
    image: recipeImg4,
    ingredients: ["Haricots rouges", "Boeuf hache ou lentilles", "Tomates concassees", "Maïs", "Epices chili"],
    steps: ["Faire revenir oignon et proteine.", "Ajouter epices, tomates et legumes.", "Laisser mijoter 20 minutes."],
  },
  {
    id: "mass-curry-coco",
    title: "Curry coco pois chiches",
    flavor: "sale",
    prepTime: "25 min",
    servings: "3 pers",
    image: recipeImg5,
    ingredients: ["Pois chiches", "Lait de coco", "Pate de curry", "Legumes", "Riz"],
    steps: ["Faire revenir curry et legumes.", "Ajouter lait coco et pois chiches.", "Servir avec du riz chaud."],
  },
  {
    id: "mass-riz-cajou",
    title: "Riz saute cajou et tofu",
    flavor: "sale",
    prepTime: "22 min",
    servings: "2 pers",
    image: recipeImg6,
    ingredients: ["Riz basmati", "Tofu ferme", "Noix de cajou", "Petits pois", "Sauce soja sucree"],
    steps: ["Cuire le riz et reserver.", "Sauter tofu et legumes, ajouter sauce.", "Melanger au riz et parsemer de cajou."],
  },
  {
    id: "mass-overnight-prot",
    title: "Overnight oats proteines",
    flavor: "sucre",
    prepTime: "5 min",
    servings: "1 pers",
    image: recipeImg1,
    ingredients: ["Flocons d'avoine", "Lait vegetal", "Yaourt proteine", "Graines de chia", "Fruits"],
    steps: ["Melanger tous les ingredients.", "Laisser reposer au frais toute la nuit.", "Ajouter fruits le matin."],
  },
  {
    id: "mass-brownie-beans",
    title: "Brownie haricots noirs",
    flavor: "sucre",
    prepTime: "35 min",
    servings: "6 pers",
    image: recipeImg2,
    ingredients: ["Haricots noirs cuits", "Cacao", "Oeufs", "Beurre de cacahuete", "Sirop d'erable"],
    steps: ["Mixer tous les ingredients.", "Verser dans un moule et cuire 25 min a 180C."],
  },
  {
    id: "mass-salade-pates",
    title: "Salade de pates pesto poulet",
    flavor: "sale",
    prepTime: "18 min",
    servings: "2 pers",
    image: recipeImg3,
    ingredients: ["Pates torsades", "Poulet grille", "Pesto", "Tomates cerises", "Roquette"],
    steps: ["Cuire les pates et refroidir.", "Melanger avec poulet, pesto et legumes."],
  },
]

const healthyRecipes: Recipe[] = [
  {
    id: "healthy-parfait",
    title: "Parfait yaourt fruits rouges",
    flavor: "sucre",
    prepTime: "10 min",
    servings: "1 pers",
    image: recipeImg3,
    ingredients: ["Yaourt grec", "Fruits rouges", "Granola maison", "Noix et graines"],
    steps: ["Alterner les couches de yaourt et fruits.", "Ajouter granola et noix juste avant de servir."],
  },
  {
    id: "healthy-granola",
    title: "Granola croustillant maison",
    flavor: "sucre",
    prepTime: "25 min",
    servings: "8 pers",
    image: recipeImg5,
    ingredients: ["Flocons d'avoine", "Noix et graines", "Miel ou sirop d'agave", "Huile de coco"],
    steps: ["Melanger tous les ingredients.", "Cuire 20 min a 170C en remuant a mi-cuisson."],
  },
  {
    id: "healthy-tartine-avocat",
    title: "Tartine avocat et oeuf mollet",
    flavor: "sale",
    prepTime: "15 min",
    servings: "1 pers",
    image: recipeImg6,
    ingredients: ["Pain complet", "Avocat ecrase", "Oeuf mollet", "Citron, paprika, graines"],
    steps: ["Cuire l'oeuf 6 minutes.", "Tartiner le pain d'avocat, deposer l'oeuf et assaisonner."],
  },
  {
    id: "healthy-bowl-mediterraneen",
    title: "Bowl mediterraneen",
    flavor: "sale",
    prepTime: "20 min",
    servings: "2 pers",
    image: recipeImg1,
    ingredients: ["Boulgour", "Pois chiches", "Concombre et tomates", "Feta", "Herbes fraiches"],
    steps: ["Cuire le boulgour.", "Melanger legumes, pois chiches et feta.", "Assembler et arroser d'huile d'olive citron."],
  },
  {
    id: "healthy-soupe-verte",
    title: "Soupe verte detox",
    flavor: "sale",
    prepTime: "25 min",
    servings: "3 pers",
    image: recipeImg2,
    ingredients: ["Brocoli", "Courgette", "Epinards", "Bouillon legumes", "Citron"],
    steps: ["Cuire legumes dans le bouillon.", "Mixer pour obtenir une soupe lisse.", "Ajouter citron et topping graines."],
  },
  {
    id: "healthy-salade-pates",
    title: "Salade de pates fraiches",
    flavor: "sale",
    prepTime: "18 min",
    servings: "2 pers",
    image: recipeImg3,
    ingredients: ["Pates torsades", "Courgette crue", "Tomates cerises", "Pesto leger", "Roquette"],
    steps: ["Cuire les pates.", "Melanger avec legumes crus et pesto.", "Servir frais."],
  },
  {
    id: "healthy-overnight-oats",
    title: "Overnight oats coco framboise",
    flavor: "sucre",
    prepTime: "5 min",
    servings: "1 pers",
    image: recipeImg4,
    ingredients: ["Flocons d'avoine", "Lait d'amande", "Noix de coco rapee", "Framboises", "Sirop d'agave"],
    steps: ["Melanger les ingredients dans un bocal.", "Laisser reposer au frais une nuit.", "Ajouter fruits le matin."],
  },
  {
    id: "healthy-smoothie-glow",
    title: "Smoothie glow mangue passion",
    flavor: "sucre",
    prepTime: "8 min",
    servings: "1 pers",
    image: recipeImg5,
    ingredients: ["Mangue", "Fruit de la passion", "Lait de coco leger", "Gingembre", "Graines de lin"],
    steps: ["Mixer tous les ingredients.", "Servir bien frais avec glace pilée."],
  },
  {
    id: "healthy-wrap-legumes",
    title: "Wrap legumes croquants",
    flavor: "sale",
    prepTime: "12 min",
    servings: "1 pers",
    image: recipeImg6,
    ingredients: ["Tortilla ble complet", "Houmous", "Carotte rapee", "Concombre", "Herbes"],
    steps: ["Tartiner la tortilla de houmous.", "Ajouter legumes croquants et rouler serré."],
  },
  {
    id: "healthy-tofu-bowl",
    title: "Bowl tofu sesame",
    flavor: "sale",
    prepTime: "22 min",
    servings: "2 pers",
    image: recipeImg1,
    ingredients: ["Tofu ferme", "Riz complet", "Brocoli", "Sauce soja", "Graines de sesame"],
    steps: ["Cuire le riz et le brocoli vapeur.", "Carameliser le tofu avec sauce soja.", "Assembler et saupoudrer de sesame."],
  },
  {
    id: "healthy-saumon-tray",
    title: "Saumon au four citron",
    flavor: "sale",
    prepTime: "25 min",
    servings: "2 pers",
    image: recipeImg2,
    ingredients: ["Paves de saumon", "Citron", "Haricots verts", "Pommes de terre grenailles", "Aneth"],
    steps: ["Disposer les ingredients sur une plaque.", "Assaisonner et enfourner 18 minutes a 190C."],
  },
  {
    id: "healthy-potage-lentilles",
    title: "Potage lentilles corail",
    flavor: "sale",
    prepTime: "30 min",
    servings: "4 pers",
    image: recipeImg3,
    ingredients: ["Lentilles corail", "Carotte", "Lait de coco leger", "Curcuma", "Coriandre"],
    steps: ["Faire revenir les legumes et epices.", "Ajouter lentilles et eau, cuire 20 min.", "Mixer selon la texture voulue."],
  },
  {
    id: "healthy-quinoa-menthe",
    title: "Taboule quinoa menthe",
    flavor: "sale",
    prepTime: "20 min",
    servings: "3 pers",
    image: recipeImg4,
    ingredients: ["Quinoa", "Menthe fraiche", "Persil", "Concombre", "Citron"],
    steps: ["Cuire le quinoa puis refroidir.", "Hacher fines herbes et legumes.", "Melanger et assaisonner d'huile d'olive."],
  },
  {
    id: "healthy-snack-energetique",
    title: "Energy balls cacao dattes",
    flavor: "sucre",
    prepTime: "15 min",
    servings: "6 pers",
    image: recipeImg5,
    ingredients: ["Dattes", "Noix", "Cacao", "Flocons d'avoine", "Graines de chia"],
    steps: ["Mixer tous les ingredients.", "Former des boules et placer au frais 30 minutes."],
  },
]

const recipeCollections = {
  mass: massRecipes,
  healthy: healthyRecipes,
} as const

const MassContent = () => (
  <article className="diet-blog">
    <p className="diet-eyebrow">Prise de masse</p>
    <h1>4 repas pour une prise de masse</h1>
    <p>
      Ici tu boostes ton corps sans malbouffe ni pression. Les repas restent chaleureux, les collations restent gourmandes et chaque bouchee nourrit
      reellement tes entrainements.
    </p>
  </article>
)

const HealthyContent = () => (
  <article className="diet-blog">
    <p className="diet-eyebrow">Healthy lifestyle</p>
    <h1>Manger sain sans se priver</h1>
    <p>
      Manger healthy, c'est choisir des assiettes qui respectent ton energie et ton rythme. Ici, pas de restriction: juste des idees claires pour rester
      legere, concentree et inspiree.
    </p>
  </article>
)

const RECIPE_FAVORITES_KEY = "planner.diet.recipeFavorites"

const DietClassicPage = () => {
  const [tab, setTab] = useState<"mass" | "healthy">("mass")
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = window.localStorage.getItem(RECIPE_FAVORITES_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const activeRecipes = recipeCollections[tab]

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(RECIPE_FAVORITES_KEY, JSON.stringify(Array.from(favoriteIds)))
    } catch {
      // ignore
    }
  }, [favoriteIds])

  const toggleFavorite = (recipeId: string) => {
    setFavoriteIds((previous) => {
      const next = new Set(previous)
      if (next.has(recipeId)) {
        next.delete(recipeId)
      } else {
        next.add(recipeId)
      }
      return next
    })
  }

  return (
    <main className="diet-gymgirl-page">
      <div className="diet-toggle">
        <button type="button" className={tab === "mass" ? "is-active" : ""} onClick={() => setTab("mass")}>
          Prise de masse
        </button>
        <button type="button" className={tab === "healthy" ? "is-active" : ""} onClick={() => setTab("healthy")}>
          Healthy
        </button>
      </div>

      {tab === "mass" ? <MassContent /> : <HealthyContent />}

      <section className="diet-blog">
        <div className="diet-recipe-grid">
          {activeRecipes.map((recipe) => (
            <article
              key={recipe.id}
              className="diet-recipe-card"
              style={{ backgroundImage: `url(${recipe.image})` }}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="diet-recipe-card__overlay" />
              <div className="diet-recipe-card__content">
                <div className="diet-recipe-card__header">
                  <button
                    type="button"
                    className={favoriteIds.has(recipe.id) ? "diet-favorite is-active" : "diet-favorite"}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleFavorite(recipe.id)
                    }}
                    aria-label="Ajouter en favoris"
                  >
                    {favoriteIds.has(recipe.id) ? "\u2665" : "\u2661"}
                  </button>
                </div>
                <div className="diet-recipe-card__body">
                  <h3>{recipe.title}</h3>
                  <div className="diet-recipe-info">
                    <span className="diet-info-pill" data-icon={recipe.flavor === "sucre" ? "S" : "L"}>
                      {recipe.flavor === "sucre" ? "Sucre" : "Sale"}
                    </span>
                    <span className="diet-info-pill" data-icon="T">
                      {recipe.prepTime}
                    </span>
                    <span className="diet-info-pill" data-icon="P">
                      {recipe.servings}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="diet-blog">
        <h2>Message final</h2>
        <p>
          Ton corps n'a pas besoin d'etre puni. Il a besoin d'etre nourri, respecte et aime. Que tu sois en prise de masse ou en mode healthy, cet espace
          est la pour t'aider a construire une relation saine avec la nourriture.
        </p>
      </section>

      {selectedRecipe ? (
        <div className="diet-recipe-modal" role="dialog" aria-label={`Recette ${selectedRecipe.title}`}>
          <div className="diet-recipe-modal__backdrop" onClick={() => setSelectedRecipe(null)} />
          <div className="diet-recipe-modal__panel">
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="diet-recipe-modal__image" />
            <div className="diet-recipe-modal__content">
              <header className="diet-recipe-modal__header">
                <div>
                  <h3>{selectedRecipe.title}</h3>
                  <div className="diet-recipe-info">
                    <span className="diet-info-pill" data-icon={selectedRecipe.flavor === "sucre" ? "S" : "L"}>
                      {selectedRecipe.flavor === "sucre" ? "Sucre" : "Sale"}
                    </span>
                    <span className="diet-info-pill" data-icon="T">
                      {selectedRecipe.prepTime}
                    </span>
                    <span className="diet-info-pill" data-icon="P">
                      {selectedRecipe.servings}
                    </span>
                  </div>
                </div>
                <button type="button" className="diet-recipe-close-icon" onClick={() => setSelectedRecipe(null)} aria-label="Fermer">
                  <span aria-hidden="true" />
                </button>
              </header>
              <div className="diet-recipe-modal__body">
                <section>
                  <h4>Ingredients</h4>
                  <ul>
                    {selectedRecipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4>Etapes</h4>
                  <ol>
                    {selectedRecipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default DietClassicPage