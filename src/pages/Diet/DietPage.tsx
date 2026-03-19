import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import useUserDietData from "../../hooks/useUserDietData"
import { deleteMedia, uploadImage } from "../../services/media/api"
import { getWeekKey } from "../../utils/weekKey"
import wrapPouletImg from "../../assets/wrap-poulet.webp"
import pancakesProteineImg from "../../assets/Pancakes-proteine.webp"
import butterChickenImg from "../../assets/butter-chicken.webp"
import alfredoPastaImg from "../../assets/alfredo-pasta.webp"
import avocadoToastImg from "../../assets/avocado-toast.webp"
import curryPoischicheImg from "../../assets/curry-poischiche.webp"
import smoothieBananeImg from "../../assets/smoothie-banane.webp"
import brownieProteineImg from "../../assets/brownie-proteine.webp"
import overnightOatsImg from "../../assets/Overnight oats.png"
import fruitsRougesGranolaImg from "../../assets/fruitsrouges-granola.webp"
import bowlThonImg from "../../assets/Bowl au thon.png"
import bowlMediteraneenImg from "../../assets/bowl-mediteraneen.webp"
import soupeDetoxImg from "../../assets/soupe-detox.webp"
import bananaBreadImg from "../../assets/banana-bread.webp"
import brownieSaleImg from "../../assets/Brownie salé.png"
import biscuitsAvoineImg from "../../assets/biscuits-avoine.webp"
import saumonCitronImg from "../../assets/Saumon au four citron.png"
import puddingChiaCocoFraisesImg from "../../assets/Pudding de chia coco & fraises1.webp"
import saladeCesarImg from "../../assets/salade-cesar.webp"
import granolaMaisonImg from "../../assets/granola-maison.webp"
import brochettesImg from "../../assets/brochettes.webp"
import smoothieMangueImg from "../../assets/Smoothie glow mangue passion.png"
import saladeDeFruitImg from "../../assets/salade-de-fruit.webp"
import omeletteFetaImg from "../../assets/Omelette feta epinards.png"
import steackPommeDeTerreImg from "../../assets/Steak, pommes de terre & haricots verts.png"
import saumonBowlImg from "../../assets/Saumon marininé sriracha & riz.png"
import bowlPouletImg from "../../assets/Burrito bowl healthy.png"
import bagelSaumonImg from "../../assets/Bagel saumon & cream cheese avocat1.jpg"
import dattesBeurreCacahueteImg from "../../assets/Dattes au beurre de cacahuete.png"
import bananaOatBarsImg from "../../assets/Banana Oat Bars.png"
import barresSnickersCaramelImg from "../../assets/Barres type Snickers au caramel.png"
import cookiesChocolatFleurSelImg from "../../assets/Cookies chocolat & fleur de sel.png"
import carrotCakeBreadImg from "../../assets/Carrot Cake Bread1.png"
import saladeDeFruitsAnanasImg from "../../assets/Salade de fruits ananas.png"
import saumonGrilleSalsaTomateAvocatImg from "../../assets/Saumon grille, salsa tomate-avocat.png"
import saladeBurrataJambonSecImg from "../../assets/Salade burrata, jambon sec, tomates cerises & basilic.png"
import patesPestoPouletParmesanImg from "../../assets/Pates pesto, poulet, parmesan & tomates cerises.png"
import houmousMaisonUltraCremeuxImg from "../../assets/Houmous maison ultra cremeux.png"
import saladePastequeFetaImg from "../../assets/Salade pasteque & feta.png"
import saladeGrecqueImg from "../../assets/Salade grecque.png"
import wrapPouletCroquantImg from "../../assets/Wrap poulet croquant.png"
import smoothieFraiseBananeWheyImg from "../../assets/Smoothie fraise, banane, eau de coco & whey vanille.jpeg"
import boissonDetoxPommeCeleriCitronImg from "../../assets/Boisson detox pomme, celeri & citron.png"
import boissonDetoxOrangeCarotteGingembreImg from "../../assets/Boisson detox orange, carotte & gingembre.png"
import eauDetoxConcombreCitronVertImg from "../../assets/Eau detox concombre, citron, citron vert.png"
import cafeLatteVanilleImg from "../../assets/Cafe latte a la vanille.jpeg"
import matchaLatteCremeuxImg from "../../assets/Matcha latte cremeux.jpeg"
import mokaChocolatCafeImg from "../../assets/Moka chocolat & cafe.png"
import smoothieSainAvocatBananeAmandesImg from "../../assets/Smoothie sain avocat, banane & amandes.jpeg"
import boissonSaineEpinardPommeConcombreImg from "../../assets/Boisson saine epinard, pomme & concombre.jpeg"
import eauInfuseePamplemousseRomarinImg from "../../assets/Eau infusee pamplemousse & romarin.png"
import eauInfuseeMyrtillesOrangeMentheImg from "../../assets/Eau infusee myrtilles, orange & menthe.png"
import eauInfuseeFraiseCitronJauneMentheImg from "../../assets/Eau infusee fraise, citron jaune & menthe.png"
import boissonAvoineCacahueteLaitAmandeImg from "../../assets/Boisson avoine, beurre de cacahuete & lait d'amande.jpeg"
import jusSainBetteraveCeleriPommeImg from "../../assets/Jus sain betterave, celeri & pomme.png"
import smoothieBananeBeurreCacahueteImg from "../../assets/Smoothie banane beurre de cacahuete.png"
import focacciaBurrataMortadelleRoquetteImg from "../../assets/Focaccia garnie burrata, mortadelle & roquette.jpeg"
import tzatzikiImg from "../../assets/Tzatziki.jpeg"
import vinaigretteMielMoutardeBalsamiqueImg from "../../assets/Vinaigrette miel, moutarde & balsamique.png"
import sauceTahiniCremeuseImg from "../../assets/Sauce tahini cremeuse.png"
import caviarAubergineImg from "../../assets/Caviar d'aubergine.png"
import saucePestoMaisonImg from "../../assets/Sauce pesto maison.jpeg"
import guacamoleMaisonImg from "../../assets/Guacamole maison.png"
import sauceViergeImg from "../../assets/Sauce vierge.png"
import chimichurriLegerementSucreImg from "../../assets/Chimichurri legerement sucre.png"
import saucePoivreImg from "../../assets/Sauce au poivre.png"
import tapenadeImg from "../../assets/Tapenade.png"
import sauceTeriyakiImg from "../../assets/Sauce teriyaki.png"
import huilePimenteeImg from "../../assets/Huile pimentee.png"
import oignonsConfitsImg from "../../assets/Oignons confits.png"
import ailConfitImg from "../../assets/Ail confit.png"
import sauceAuberginesPoivronsGrillesImg from "../../assets/Sauce aux aubergines & poivrons grilles.png"
import picklesOignonsImg from "../../assets/Pickles d'oignons.png"
import sauceAsiatiqueCacahuetesImg from "../../assets/Sauce asiatique aux cacahuetes.png"
import citronsConfitsImg from "../../assets/Citrons confits.png"
import sauceBlancheHerbesImg from "../../assets/Sauce blanche aux herbes.png"
import picklesConcombreImg from "../../assets/Pickles de concombre.png"
import picklesCarottesImg from "../../assets/Pickles de carottes.png"
import picklesChouFleurImg from "../../assets/Pickles de chou-fleur.png"
import chutneyMangueImg from "../../assets/Chutney de mangue.png"
import thonCuitIngredientImg from "../../assets/Aliments/Thon cuit.png"
import rizIngredientImg from "../../assets/Aliments/Riz.png"
import avocatIngredientImg from "../../assets/Aliments/Avocat.png"
import concombreIngredientImg from "../../assets/Aliments/Concombre.png"
import tomateIngredientImg from "../../assets/Aliments/Tomate.png"
import grainesSesameIngredientImg from "../../assets/Aliments/Graines de sesame.png"
import huileOliveIngredientImg from "../../assets/Aliments/Huile d'olive.png"
import vinaigreBalsamiqueIngredientImg from "../../assets/Aliments/Vinaigre balsamique.png"
import selIngredientImg from "../../assets/Aliments/Sel.png"
import poivreIngredientImg from "../../assets/Aliments/Poivre.png"
import moutardeIngredientImg from "../../assets/Aliments/Moutarde.png"
import mielIngredientImg from "../../assets/Aliments/Miel.png"
import oeufIngredientImg from "../../assets/Aliments/Oeuf.png"
import tomatesCerisesIngredientImg from "../../assets/Aliments/Tomates cerises.png"
import olivesNoiresIngredientImg from "../../assets/Aliments/Olives noires.png"
import olivesVertesIngredientImg from "../../assets/Aliments/Olives vertes.png"
import burrataIngredientImg from "../../assets/Aliments/Burrata.png"
import fetaIngredientImg from "../../assets/Aliments/Feta.png"
import basilicIngredientImg from "../../assets/Aliments/Basilic.png"
import origanIngredientImg from "../../assets/Aliments/Origan.png"
import painIngredientImg from "../../assets/Aliments/Pain.png"
import oignonRougeIngredientImg from "../../assets/Aliments/Oignon rouge.png"
import oignonJauneIngredientImg from "../../assets/Aliments/Oignon jaune.png"
import jambonSecIngredientImg from "../../assets/Aliments/Jambon sec.png"
import saumonFumeIngredientImg from "../../assets/Aliments/Saumon fume.png"
import anethIngredientImg from "../../assets/Aliments/Aneth.png"
import bagelIngredientImg from "../../assets/Aliments/Bagel.png"
import creamCheeseIngredientImg from "../../assets/Aliments/Cream cheese.png"
import pastequeIngredientImg from "../../assets/Aliments/Pasteque.png"
import mentheIngredientImg from "../../assets/Aliments/Menthe.png"
import ailIngredientImg from "../../assets/Aliments/Ail.png"
import epinardIngredientImg from "../../assets/Aliments/Epinard.png"
import saumonIngredientImg from "../../assets/Aliments/Saumon.png"
import citronIngredientImg from "../../assets/Aliments/Citron.png"
import citronVertIngredientImg from "../../assets/Aliments/Citron vert.png"
import beurreIngredientImg from "../../assets/Aliments/Beurre.png"
import aspergesIngredientImg from "../../assets/Aliments/Asperges.png"
import eauIngredientImg from "../../assets/Aliments/Eau.png"
import laitueIngredientImg from "../../assets/Aliments/Laitue.png"
import melangeSaladeIngredientImg from "../../assets/Aliments/Melange de salade.png"
import pouletIngredientImg from "../../assets/Aliments/Poulet.png"
import parmesanIngredientImg from "../../assets/Aliments/Parmesan.png"
import yaourtGrecIngredientImg from "../../assets/Aliments/Yaourt grecque.png"
import croutonsIngredientImg from "../../assets/Aliments/Croutons.png"
import cubeBouillonIngredientImg from "../../assets/Aliments/Cube bouillon de legume.png"
import brocolisIngredientImg from "../../assets/Aliments/Brocolis.png"
import paprikaIngredientImg from "../../assets/Aliments/Paprika.png"
import cuminIngredientImg from "../../assets/Aliments/Cumin.png"
import coriandreIngredientImg from "../../assets/Aliments/Coriandre.png"
import boulgourIngredientImg from "../../assets/Aliments/Boulgour.png"
import concentreTomateIngredientImg from "../../assets/Aliments/Concentre de tomate.png"
import edamameIngredientImg from "../../assets/Aliments/Edamame.png"
import haricotsRougesIngredientImg from "../../assets/Aliments/Haricots rouges.png"
import floconsPimentIngredientImg from "../../assets/Aliments/Flocons de piment.png"
import persilIngredientImg from "../../assets/Aliments/Persil.png"
import pestoIngredientImg from "../../assets/Aliments/Pesto.png"
import poudreOignonIngredientImg from "../../assets/Aliments/Poudre d'oignon.png"
import tagliatellesIngredientImg from "../../assets/Aliments/Tagliatelles.png"
import wrapIngredientImg from "../../assets/Aliments/Wrap.png"
import foccaciaIngredientImg from "../../assets/Aliments/Foccacia.png"
import farineIngredientImg from "../../assets/Aliments/Farine.png"
import laitIngredientImg from "../../assets/Aliments/Lait.png"
import lardonsIngredientImg from "../../assets/Aliments/Lardons.png"
import mortadelleIngredientImg from "../../assets/Aliments/Mortadelle.png"
import roquetteIngredientImg from "../../assets/Aliments/Roquette.png"
import pistachesIngredientImg from "../../assets/Aliments/Pistaches.png"
import ailPoudreIngredientImg from "../../assets/Aliments/Ail en poudre.png"
import comteRapeIngredientImg from "../../assets/Aliments/Comté râpé.png"
import haricotsVertsIngredientImg from "../../assets/Aliments/Haricots verts.png"
import herbesProvenceIngredientImg from "../../assets/Aliments/Herbes de provence.png"
import steakIngredientImg from "../../assets/Aliments/Steak.png"
import quinoaIngredientImg from "../../assets/Aliments/Quinoa.png"
import poisChicheIngredientImg from "../../assets/Aliments/pois chiche.png"
import mayonnaiseIngredientImg from "../../assets/Aliments/Mayonnaise.png"
import srirachaIngredientImg from "../../assets/Aliments/Sriracha.png"
import feuilleNoriIngredientImg from "../../assets/Aliments/Feuille de nori.png"
import sauceSojaIngredientImg from "../../assets/Aliments/Sauce soja.png"
import huileSesameIngredientImg from "../../assets/Aliments/Huile de sesame.png"
import gingembrePoudreIngredientImg from "../../assets/Aliments/Gingembre en poudre.png"
import gingembreIngredientImg from "../../assets/Aliments/Gingembre.png"
import laitCocoIngredientImg from "../../assets/Aliments/Lait de coco.png"
import curryIngredientImg from "../../assets/Aliments/Curry.png"
import garamMassalaIngredientImg from "../../assets/Aliments/Garam massala.png"
import curcumaIngredientImg from "../../assets/Aliments/Curcuma.png"
import coriandreFraicheIngredientImg from "../../assets/Aliments/Coriandre fraiche.png"
import PageHeading from "../../components/PageHeading"
import "./DietPage.css"

export type Recipe = {
  id: string
  title: string
  flavor: "sucre" | "sale" | "boisson"
  prepTime: string
  servings: string
  image: string
  ingredients: string[]
  steps: string[]
  toppings?: string[]
  tips?: string[]
}

type RenderRecipe = Recipe & {
  source: "builtin" | "custom"
  imagePath?: string
}

type RecipeSnapshot = {
  id: string
  title: string
  flavor: "sucre" | "sale" | "boisson"
  prepTime: string
  servings: string
  image: string
  ingredients: string[]
  steps: string[]
  toppings?: string[]
  tips?: string[]
}

type IngredientVisual = {
  id: string
  label: string
  detail: string
  image: string
  sectionTitle?: string
}

const ingredientVisualsByRecipeId: Record<string, IngredientVisual[]> = {
  "healthy-bowl-thon": [
    { id: "thon-cuit", label: "Thon cuit", detail: "1 boite de thon au naturel", image: thonCuitIngredientImg },
    { id: "riz", label: "Riz", detail: "100 g de riz", image: rizIngredientImg },
    { id: "avocat", label: "Avocat", detail: "1/2 avocat", image: avocatIngredientImg },
    { id: "concombre", label: "Concombre", detail: "1/4 concombre", image: concombreIngredientImg },
    { id: "tomate", label: "Tomate", detail: "1 petite tomate (ou tomates cerises)", image: tomateIngredientImg },
    { id: "oeuf", label: "Oeuf", detail: "1 oeuf", image: oeufIngredientImg },
    {
      id: "graines-sesame",
      label: "Graines de sesame",
      detail: "1 cuillere a cafe de graines de sesame",
      image: grainesSesameIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "2 c. a soupe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    {
      id: "vinaigre-balsamique",
      label: "Vinaigre balsamique",
      detail: "1 c. a soupe de vinaigre balsamique",
      image: vinaigreBalsamiqueIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "moutarde", label: "Moutarde", detail: "1 c. a cafe de moutarde", image: moutardeIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "poivre", label: "Poivre", detail: "1 pincee de poivre", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "healthy-bowl-mediterraneen": [
    { id: "quinoa", label: "Quinoa", detail: "60 g de quinoa", image: quinoaIngredientImg, sectionTitle: "Base" },
    { id: "pois-chiche", label: "pois chiche", detail: "100 g de pois chiches cuits (egouttes)", image: poisChicheIngredientImg, sectionTitle: "Base" },
    { id: "concombre", label: "Concombre", detail: "1/2 concombre", image: concombreIngredientImg, sectionTitle: "Legumes & garnitures" },
    { id: "tomate", label: "Tomate", detail: "1 tomate", image: tomateIngredientImg, sectionTitle: "Legumes & garnitures" },
    { id: "oignon-rouge", label: "Oignon rouge", detail: "1/4 d'oignon rouge", image: oignonRougeIngredientImg, sectionTitle: "Legumes & garnitures" },
    { id: "feta", label: "Feta", detail: "50 g de feta emiettee", image: fetaIngredientImg, sectionTitle: "Legumes & garnitures" },
    { id: "olives-noires", label: "Olives noires", detail: "Quelques olives noires", image: olivesNoiresIngredientImg, sectionTitle: "Legumes & garnitures" },
    { id: "basilic", label: "Basilic", detail: "Persil ou basilic frais", image: basilicIngredientImg, sectionTitle: "Legumes & garnitures" },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Assaisonnement" },
    { id: "citron", label: "Citron", detail: "1 c. a cafe de jus de citron", image: citronIngredientImg, sectionTitle: "Assaisonnement" },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg, sectionTitle: "Assaisonnement" },
    { id: "poivre", label: "Poivre", detail: "Poivre", image: poivreIngredientImg, sectionTitle: "Assaisonnement" },
  ],
  "healthy-burrito-bowl": [
    { id: "riz", label: "Riz", detail: "80 g de riz cru (ou quinoa)", image: rizIngredientImg, sectionTitle: "Base" },
    { id: "eau", label: "Eau", detail: "160 ml d'eau", image: eauIngredientImg, sectionTitle: "Base" },
    { id: "poulet", label: "Poulet", detail: "120 g de blanc de poulet", image: pouletIngredientImg, sectionTitle: "Poulet marine" },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Poulet marine" },
    { id: "paprika", label: "Paprika", detail: "1 c. a cafe de paprika", image: paprikaIngredientImg, sectionTitle: "Poulet marine" },
    { id: "cumin", label: "Cumin", detail: "1/2 c. a cafe de cumin", image: cuminIngredientImg, sectionTitle: "Poulet marine" },
    { id: "ail-poudre", label: "Ail en poudre", detail: "1/2 c. a cafe d'ail en poudre", image: ailPoudreIngredientImg, sectionTitle: "Poulet marine" },
    { id: "citron-vert", label: "Citron vert", detail: "1 c. a cafe de jus de citron vert", image: citronVertIngredientImg, sectionTitle: "Poulet marine" },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg, sectionTitle: "Poulet marine" },
    { id: "poivre", label: "Poivre", detail: "Poivre", image: poivreIngredientImg, sectionTitle: "Poulet marine" },
    { id: "haricots-rouges", label: "Haricots rouges", detail: "Haricots rouges", image: haricotsRougesIngredientImg, sectionTitle: "Garnitures" },
    { id: "mais", label: "Mais", detail: "Mais", image: poisChicheIngredientImg, sectionTitle: "Garnitures" },
    { id: "laitue", label: "Laitue", detail: "Laitue", image: laitueIngredientImg, sectionTitle: "Garnitures" },
    { id: "tomate", label: "Tomate", detail: "Tomate", image: tomateIngredientImg, sectionTitle: "Garnitures" },
    { id: "oignons-rouges", label: "Oignons rouges", detail: "Oignons rouges", image: oignonRougeIngredientImg, sectionTitle: "Garnitures" },
    { id: "avocat", label: "Avocat", detail: "Avocat", image: avocatIngredientImg, sectionTitle: "Garnitures" },
    { id: "coriandre", label: "Coriandre", detail: "Coriandre", image: coriandreIngredientImg, sectionTitle: "Garnitures" },
  ],
  "mass-salade-grecque": [
    { id: "concombre", label: "Concombre", detail: "1 concombre", image: concombreIngredientImg },
    { id: "tomates-cerises", label: "Tomates cerises", detail: "200 g de tomates cerises", image: tomatesCerisesIngredientImg },
    { id: "feta", label: "Feta", detail: "120 g de feta", image: fetaIngredientImg },
    { id: "olives-noires", label: "Olives noires", detail: "40 g d'olives noires", image: olivesNoiresIngredientImg },
    { id: "olives-vertes", label: "Olives vertes", detail: "40 g d'olives vertes", image: olivesVertesIngredientImg },
    { id: "oignon-rouge", label: "Oignon rouge", detail: "1/2 oignon rouge", image: oignonRougeIngredientImg },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "3 c. a soupe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    {
      id: "origan",
      label: "Origan",
      detail: "1/2 c. a cafe d'origan",
      image: origanIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "poivre", label: "Poivre noir", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "mass-bagel-saumon": [
    { id: "bagel", label: "Bagel", detail: "1 bagel nature ou au sesame", image: bagelIngredientImg },
    { id: "cream-cheese", label: "Cream cheese", detail: "2 cuilleres a soupe de cream cheese", image: creamCheeseIngredientImg },
    { id: "saumon-fume", label: "Saumon fume", detail: "60-80 g de saumon fume", image: saumonFumeIngredientImg },
    { id: "avocat", label: "Avocat", detail: "1/2 avocat", image: avocatIngredientImg },
    { id: "tomate", label: "Tomate", detail: "1 petite tomate", image: tomateIngredientImg },
    { id: "aneth", label: "Aneth", detail: "1 pincee d'aneth", image: anethIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "poivre", label: "Poivre", detail: "Poivre noir (selon ton gout)", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "mass-salade-pasteque-feta": [
    { id: "pasteque", label: "Pasteque", detail: "400 g de pasteque", image: pastequeIngredientImg },
    { id: "menthe", label: "Menthe", detail: "6-8 feuilles de menthe fraiche", image: mentheIngredientImg },
    { id: "feta", label: "Feta", detail: "120 g de feta", image: fetaIngredientImg },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "2 c. a soupe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    {
      id: "vinaigre-balsamique",
      label: "Vinaigre balsamique",
      detail: "(Optionnel mais tres bon) 1 c. a cafe de vinaigre balsamique",
      image: vinaigreBalsamiqueIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
  ],
  "mass-omelette-power": [
    { id: "oeuf", label: "Oeuf", detail: "2 ou 3 oeufs", image: oeufIngredientImg },
    { id: "epinards", label: "Epinards", detail: "1 poignee d'epinards frais (environ 1 tasse)", image: epinardIngredientImg },
    { id: "feta", label: "Feta", detail: "40 g de feta", image: fetaIngredientImg },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "1 c. a cafe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "ail", label: "Ail", detail: "(Optionnel) 1 petite gousse d'ail hachee", image: ailIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "oignon", label: "Oignon", detail: "1 petit oignon", image: oignonRougeIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "healthy-saumon-tray": [
    { id: "saumon", label: "Saumon", detail: "2 paves de saumon (150-180 g chacun)", image: saumonIngredientImg },
    { id: "riz", label: "Riz", detail: "150 g de riz blanc", image: rizIngredientImg },
    { id: "eau", label: "Eau", detail: "165 ml d'eau", image: eauIngredientImg },
    { id: "asperges", label: "Asperges", detail: "Asperges (accompagnement, selon envie)", image: aspergesIngredientImg },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "2 c. a soupe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "citron", label: "Citron", detail: "1 citron", image: citronIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "aneth", label: "Aneth", detail: "1 pincee d'aneth ou d'herbes", image: anethIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "ail", label: "Ail", detail: "(Optionnel) 1 petite gousse d'ail", image: ailIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "oignon", label: "Oignon", detail: "(Optionnel) 1 petit oignon", image: oignonRougeIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "healthy-quinoa-menthe": [
    { id: "laitue", label: "Laitue", detail: "1 laitue romaine", image: laitueIngredientImg },
    { id: "poulet", label: "Poulet", detail: "2 filets de poulet", image: pouletIngredientImg },
    { id: "parmesan", label: "Parmesan", detail: "20 g de parmesan", image: parmesanIngredientImg },
    { id: "croutons", label: "Croutons", detail: "1 petite poignee de croutons", image: croutonsIngredientImg },
    {
      id: "yaourt-grecque",
      label: "Yaourt grecque",
      detail: "3 c. a soupe de yaourt grec",
      image: yaourtGrecIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "citron", label: "Citron", detail: "1 c. a soupe de jus de citron", image: citronIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "moutarde", label: "Moutarde", detail: "1 c. a cafe de moutarde", image: moutardeIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "parmesan-rape", label: "Parmesan", detail: "1 c. a soupe de parmesan rape", image: parmesanIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "healthy-soupe-verte": [
    { id: "brocoli", label: "Brocoli", detail: "120 g de brocoli", image: brocolisIngredientImg },
    { id: "courgette", label: "Courgette", detail: "1 petite courgette", image: concombreIngredientImg },
    { id: "epinards", label: "Epinards", detail: "1 poignee d'epinards frais", image: epinardIngredientImg },
    { id: "eau", label: "Eau", detail: "300 ml d'eau", image: eauIngredientImg },
    {
      id: "cube-bouillon",
      label: "Cube bouillon de legume",
      detail: "1/2 cube de bouillon de legumes",
      image: cubeBouillonIngredientImg,
    },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "1 c. a cafe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "ail", label: "Ail", detail: "(Optionnel) 1 petite gousse d'ail", image: ailIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
  ],
  "healthy-overnight-oats": [
    { id: "poulet", label: "Poulet", detail: "120 g de blanc de poulet", image: pouletIngredientImg, sectionTitle: "Brochettes de poulet" },
    { id: "huile-olive-brochettes", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Brochettes de poulet" },
    { id: "citron-brochettes", label: "Citron", detail: "1 c. a cafe de jus de citron", image: citronIngredientImg, sectionTitle: "Brochettes de poulet" },
    { id: "poivre-brochettes", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Brochettes de poulet" },
    { id: "paprika-brochettes", label: "Paprika", detail: "1 pincee de paprika (optionnel)", image: paprikaIngredientImg, sectionTitle: "Brochettes de poulet" },
    { id: "boulgour", label: "Boulgour", detail: "60 g de boulgour", image: boulgourIngredientImg, sectionTitle: "Boulgour a la tomate" },
    { id: "eau-boulgour", label: "Eau", detail: "120 ml d'eau", image: eauIngredientImg, sectionTitle: "Boulgour a la tomate" },
    { id: "tomate-boulgour", label: "Tomate", detail: "1 petite tomate", image: tomateIngredientImg, sectionTitle: "Boulgour a la tomate" },
    { id: "concentre-tomate", label: "Concentre de tomate", detail: "1 c. a cafe de concentre de tomate", image: concentreTomateIngredientImg, sectionTitle: "Boulgour a la tomate" },
    { id: "huile-boulgour", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Boulgour a la tomate" },
    { id: "poivre-boulgour", label: "Poivre", detail: "Poivre", image: poivreIngredientImg, sectionTitle: "Boulgour a la tomate" },
    { id: "laitue", label: "Laitue", detail: "1 poignee de salade verte", image: laitueIngredientImg, sectionTitle: "Salade" },
    { id: "tomate-salade", label: "Tomate", detail: "1/2 tomate", image: tomateIngredientImg, sectionTitle: "Salade" },
    { id: "concombre-salade", label: "Concombre", detail: "1/4 concombre", image: concombreIngredientImg, sectionTitle: "Salade" },
    { id: "huile-salade", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Salade" },
    { id: "citron-salade", label: "Citron", detail: "Un peu de citron", image: citronIngredientImg, sectionTitle: "Salade" },
    { id: "poivre-salade", label: "Poivre", detail: "Poivre", image: poivreIngredientImg, sectionTitle: "Salade" },
    { id: "sel-salade", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Salade" },
  ],
  "mass-bowl-saumon": [
    { id: "riz", label: "Riz", detail: "100 g de riz blanc", image: rizIngredientImg, sectionTitle: "Riz" },
    { id: "eau-riz", label: "Eau", detail: "110 ml d'eau", image: eauIngredientImg, sectionTitle: "Riz" },
    { id: "vinaigre-riz", label: "Vinaigre de riz", detail: "1 c. a soupe de vinaigre de riz", image: vinaigreBalsamiqueIngredientImg, sectionTitle: "Riz" },
    { id: "saumon", label: "Saumon", detail: "120 g de saumon frais", image: saumonIngredientImg, sectionTitle: "Saumon marine" },
    { id: "huile-sesame", label: "Huile de sesame", detail: "1 c. a cafe d'huile de sesame", image: huileSesameIngredientImg, sectionTitle: "Saumon marine" },
    { id: "gingembre", label: "Gingembre en poudre", detail: "1 c. a cafe de gingembre rape", image: gingembrePoudreIngredientImg, sectionTitle: "Saumon marine" },
    { id: "sauce-soja", label: "Sauce soja", detail: "1 c. a cafe de sauce soja (optionnel)", image: sauceSojaIngredientImg, sectionTitle: "Saumon marine" },
    { id: "avocat", label: "Avocat", detail: "1/2 avocat", image: avocatIngredientImg, sectionTitle: "Garnitures" },
    { id: "edamame", label: "Edamame", detail: "50 g d'edamame", image: edamameIngredientImg, sectionTitle: "Garnitures" },
    { id: "nori", label: "Feuille de nori", detail: "1 petite feuille d'algue seche (nori)", image: feuilleNoriIngredientImg, sectionTitle: "Garnitures" },
    { id: "mayonnaise", label: "Mayonnaise", detail: "1 c. a soupe de mayonnaise", image: mayonnaiseIngredientImg, sectionTitle: "Sauce sriracha mayo" },
    { id: "sriracha", label: "Sriracha", detail: "1 c. a cafe de sauce sriracha", image: srirachaIngredientImg, sectionTitle: "Sauce sriracha mayo" },
  ],
  "mass-saumon-grille-salsa-riz": [
    { id: "riz", label: "Riz", detail: "80 g de riz blanc cru", image: rizIngredientImg, sectionTitle: "Base" },
    { id: "eau", label: "Eau", detail: "160 ml d'eau", image: eauIngredientImg, sectionTitle: "Base" },
    { id: "saumon", label: "Saumon", detail: "1 pave de saumon (120-150 g)", image: saumonIngredientImg, sectionTitle: "Saumon grille" },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Saumon grille" },
    { id: "citron", label: "Citron", detail: "1 c. a cafe de jus de citron", image: citronIngredientImg, sectionTitle: "Saumon grille" },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg, sectionTitle: "Saumon grille" },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg, sectionTitle: "Saumon grille" },
    { id: "avocat", label: "Avocat", detail: "1/2 avocat", image: avocatIngredientImg, sectionTitle: "Salsa tomate-avocat" },
    { id: "tomate", label: "Tomate", detail: "1 petite tomate", image: tomateIngredientImg, sectionTitle: "Salsa tomate-avocat" },
    { id: "oignon-rouge", label: "Oignon rouge", detail: "1 c. a soupe d'oignon rouge finement coupe", image: oignonRougeIngredientImg, sectionTitle: "Salsa tomate-avocat" },
    { id: "citron-vert-salsa", label: "Citron vert", detail: "1 c. a cafe de jus de citron vert", image: citronVertIngredientImg, sectionTitle: "Salsa tomate-avocat" },
    { id: "huile-olive-salsa", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Salsa tomate-avocat" },
    { id: "poivre-salsa", label: "Poivre", detail: "poivre", image: poivreIngredientImg, sectionTitle: "Salsa tomate-avocat" },
    { id: "coriandre-salsa", label: "Coriandre", detail: "coriandre ou persil (optionnel) ", image: coriandreIngredientImg, sectionTitle: "Salsa tomate-avocat" },
  ],
  "mass-wrap-poulet": [
    { id: "poulet", label: "Poulet", detail: "600 g de blanc de poulet coupe en lanieres", image: pouletIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "ail-poulet", label: "Ail", detail: "3 gousses d'ail hachees", image: ailIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "origan-poulet", label: "Origan", detail: "1 c. a soupe d'origan", image: origanIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "paprika-poulet", label: "Paprika", detail: "1 c. a soupe de paprika", image: paprikaIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "poudre-oignon-poulet", label: "Poudre d'oignon", detail: "1 c. a cafe de poudre d'oignon", image: poudreOignonIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "flocons-piment-poulet", label: "Flocons de piment", detail: "1 c. a cafe de flocons de piment", image: floconsPimentIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "sel-poulet", label: "Sel", detail: "1 c. a cafe de sel", image: selIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "poivre-poulet", label: "Poivre", detail: "1/2 c. a cafe de poivre", image: poivreIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "citron-poulet", label: "Citron", detail: "Jus de citron (selon gout)", image: citronIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "huile-olive-poulet", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Pour le poulet" },
    { id: "yaourt-sauce", label: "Yaourt grecque", detail: "100 g de yaourt ecreme", image: yaourtGrecIngredientImg, sectionTitle: "Pour la sauce" },
    { id: "sriracha-sauce", label: "Sriracha", detail: "20 g de sriracha", image: srirachaIngredientImg, sectionTitle: "Pour la sauce" },
    { id: "ail-sauce", label: "Ail", detail: "1 gousse d'ail emincee", image: ailIngredientImg, sectionTitle: "Pour la sauce" },
    { id: "persil-sauce", label: "Persil", detail: "Persil (selon gout)", image: persilIngredientImg, sectionTitle: "Pour la sauce" },
    { id: "sel-sauce", label: "Sel", detail: "Sel", image: selIngredientImg, sectionTitle: "Pour la sauce" },
    { id: "poivre-sauce", label: "Poivre", detail: "Poivre", image: poivreIngredientImg, sectionTitle: "Pour la sauce" },
    { id: "wrap-montage", label: "Wrap", detail: "Tortillas faibles en calories", image: wrapIngredientImg, sectionTitle: "Pour le montage" },
    { id: "laitue-montage", label: "Laitue", detail: "Laitue", image: laitueIngredientImg, sectionTitle: "Pour le montage" },
    { id: "oignon-rouge-montage", label: "Oignon rouge", detail: "Oignons rouges", image: oignonRougeIngredientImg, sectionTitle: "Pour le montage" },
    { id: "tomate-montage", label: "Tomate", detail: "Tomates coupees en des", image: tomateIngredientImg, sectionTitle: "Pour le montage" },
  ],
  "mass-pates-cremeuses": [
    { id: "tagliatelles", label: "Tagliatelles", detail: "80 g de pates (idealement pates proteinees ou completes)", image: tagliatellesIngredientImg },
    { id: "poulet", label: "Poulet", detail: "120 g de blanc de poulet", image: pouletIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg },
    { id: "parmesan", label: "Parmesan", detail: "40 g de parmesan rape", image: parmesanIngredientImg },
    { id: "yaourt-grec", label: "Yaourt grecque", detail: "2 c. a soupe de yaourt grec", image: yaourtGrecIngredientImg },
    { id: "eau-cuisson", label: "Eau", detail: "60 ml d'eau de cuisson des pates", image: eauIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg },
    { id: "poivre-noir", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg },
    { id: "persil", label: "Persil", detail: "(Optionnel mais tres bon) persil", image: persilIngredientImg },
  ],
  "mass-pates-pesto-poulet": [
    { id: "tagliatelles", label: "Tagliatelles", detail: "80 g de pates (penne, fusilli ou farfalle)", image: tagliatellesIngredientImg },
    { id: "poulet", label: "Poulet", detail: "120 g de blanc de poulet", image: pouletIngredientImg },
    { id: "tomates-cerises", label: "Tomates cerises", detail: "80 g de tomates cerises", image: tomatesCerisesIngredientImg },
    { id: "pesto", label: "Pesto", detail: "2 c. a soupe de pesto", image: pestoIngredientImg },
    { id: "parmesan", label: "Parmesan", detail: "20 g de parmesan rape", image: parmesanIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg },
    { id: "basilic", label: "Basilic", detail: "(optionnel mais excellent) quelques feuilles de basilic", image: basilicIngredientImg },
  ],
  "mass-salade-burrata-jambon": [
    { id: "burrata", label: "Burrata", detail: "1 burrata (environ 100-125 g)", image: burrataIngredientImg },
    { id: "jambon-sec", label: "Jambon sec", detail: "40 g de jambon sec (type prosciutto ou jambon cru)", image: jambonSecIngredientImg },
    { id: "melange-salade", label: "Melange de salade", detail: "1 poignee de melange de salade", image: melangeSaladeIngredientImg },
    { id: "tomates-cerises", label: "Tomates cerises", detail: "120 g de tomates cerises", image: tomatesCerisesIngredientImg },
    { id: "basilic", label: "Basilic", detail: "Quelques feuilles de basilic", image: basilicIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Vinaigrette" },
    { id: "vinaigre-balsamique", label: "Vinaigre balsamique", detail: "1 c. a cafe de vinaigre balsamique", image: vinaigreBalsamiqueIngredientImg, sectionTitle: "Vinaigrette" },
    { id: "moutarde", label: "Moutarde", detail: "1/2 c. a cafe de moutarde", image: moutardeIngredientImg, sectionTitle: "Vinaigrette" },
    { id: "miel", label: "Miel", detail: "1/2 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Vinaigrette" },
    { id: "poivre-noir", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Vinaigrette" },
  ],
  "mass-focaccia-burrata-mortadelle": [
    { id: "foccacia", label: "Foccacia", detail: "1 morceau de focaccia (environ 120 g)", image: foccaciaIngredientImg },
    { id: "mortadelle", label: "Mortadelle", detail: "60-80 g de mortadelle tranchee fine", image: mortadelleIngredientImg },
    { id: "burrata", label: "Burrata", detail: "1 petite burrata (80-100 g)", image: burrataIngredientImg },
    { id: "roquette", label: "Roquette", detail: "1 poignee de roquette", image: roquetteIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive extra vierge", image: huileOliveIngredientImg },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg },
    { id: "pesto", label: "Pesto", detail: "1 c. a cafe de pesto", image: pestoIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "vinaigre-balsamique", label: "Vinaigre balsamique", detail: "Un filet de creme balsamique", image: vinaigreBalsamiqueIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "pistaches", label: "Pistaches", detail: "Quelques pistaches concassees", image: pistachesIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-quinoa-bowl": [
    { id: "riz", label: "Riz", detail: "80 g de riz basmati cru", image: rizIngredientImg, sectionTitle: "Base" },
    { id: "eau", label: "Eau", detail: "160 ml d'eau", image: eauIngredientImg, sectionTitle: "Base" },
    { id: "brocolis", label: "Brocolis", detail: "120 g de brocolis", image: brocolisIngredientImg, sectionTitle: "Base" },
    { id: "poulet", label: "Poulet", detail: "150 g de blanc de poulet", image: pouletIngredientImg, sectionTitle: "Poulet marine" },
    { id: "yaourt-grecque", label: "Yaourt grecque", detail: "2 c. a soupe de yaourt grec", image: yaourtGrecIngredientImg, sectionTitle: "Poulet marine" },
    { id: "paprika", label: "Paprika", detail: "1 c. a cafe de paprika", image: paprikaIngredientImg, sectionTitle: "Poulet marine" },
    { id: "curry", label: "Curry", detail: "1/2 c. a cafe de curry", image: curryIngredientImg, sectionTitle: "Poulet marine" },
    { id: "cumin", label: "Cumin", detail: "1/2 c. a cafe de cumin", image: cuminIngredientImg, sectionTitle: "Poulet marine" },
    { id: "garam-massala", label: "Garam massala", detail: "1/2 c. a cafe de garam masala", image: garamMassalaIngredientImg, sectionTitle: "Poulet marine" },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail rapee", image: ailIngredientImg, sectionTitle: "Poulet marine" },
    { id: "citron", label: "Citron", detail: "1 c. a cafe de jus de citron", image: citronIngredientImg, sectionTitle: "Poulet marine" },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg, sectionTitle: "Poulet marine" },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg, sectionTitle: "Poulet marine" },
    { id: "tomate", label: "Tomate", detail: "200 g de tomates concassees", image: tomateIngredientImg, sectionTitle: "Sauce butter chicken" },
    { id: "lait-coco", label: "Lait de coco", detail: "50 ml de lait de coco leger", image: laitCocoIngredientImg, sectionTitle: "Sauce butter chicken" },
    { id: "beurre", label: "Beurre", detail: "1 c. a cafe de beurre ou huile", image: beurreIngredientImg, sectionTitle: "Sauce butter chicken" },
    { id: "garam-massala-sauce", label: "Garam massala", detail: "1/2 c. a cafe de garam masala", image: garamMassalaIngredientImg, sectionTitle: "Sauce butter chicken" },
    { id: "paprika-sauce", label: "Paprika", detail: "1/2 c. a cafe de paprika", image: paprikaIngredientImg, sectionTitle: "Sauce butter chicken" },
    { id: "sel-sauce", label: "Sel", detail: "sel", image: selIngredientImg, sectionTitle: "Sauce butter chicken" },
  ],
  "healthy-wrap-legumes": [
    { id: "brocoli", label: "Brocoli", detail: "1 brocoli", image: brocolisIngredientImg },
    { id: "oeuf", label: "Oeuf", detail: "2 oeufs", image: oeufIngredientImg },
    { id: "farine", label: "Farine", detail: "160 g de farine", image: farineIngredientImg },
    { id: "feta", label: "Feta", detail: "1/2 feta (environ 100 g)", image: fetaIngredientImg },
    { id: "lardons", label: "Lardons", detail: "120 g de lardons", image: lardonsIngredientImg },
    { id: "lait", label: "Lait", detail: "250 ml de lait", image: laitIngredientImg },
    { id: "comte-rape", label: "Comte rape", detail: "60 g de comte rape", image: comteRapeIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "2 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "ail-poudre", label: "Ail en poudre", detail: "1/2 c. a cafe d'ail en poudre", image: ailPoudreIngredientImg },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "Poivre", image: poivreIngredientImg },
  ],
  "mass-patate-bowl": [
    { id: "pain", label: "Pain", detail: "1 tranche de pain (idealement pain complet ou levain)", image: painIngredientImg },
    { id: "avocat", label: "Avocat", detail: "1/2 avocat", image: avocatIngredientImg },
    { id: "oeuf", label: "Oeuf", detail: "1 oeuf", image: oeufIngredientImg },
    { id: "citron", label: "Citron", detail: "1 c. a cafe de jus de citron", image: citronIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a cafe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
    { id: "flocons-piment", label: "Flocons de piment", detail: "flocons de piment", image: floconsPimentIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "graines-sesame", label: "Graines de sesame", detail: "graines de sesame", image: grainesSesameIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "persil", label: "Persil", detail: "ciboulette ou persil", image: persilIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-curry-coco": [
    { id: "pois-chiche", label: "Pois chiche", detail: "1 boite de pois chiches (400 g, egouttes)", image: poisChicheIngredientImg },
    { id: "oignon-jaune", label: "Oignon jaune", detail: "1 oignon jaune", image: oignonJauneIngredientImg },
    { id: "ail", label: "Ail", detail: "2 gousses d'ail", image: ailIngredientImg },
    { id: "gingembre", label: "Gingembre", detail: "1 c. a cafe de gingembre rape", image: gingembreIngredientImg },
    { id: "tomate", label: "Tomate", detail: "200 g de tomates concassees", image: tomateIngredientImg },
    { id: "lait-coco", label: "Lait de coco", detail: "200 ml de lait de coco", image: laitCocoIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive ou huile de coco", image: huileOliveIngredientImg },
    { id: "curry", label: "Curry", detail: "1 c. a cafe de curry en poudre", image: curryIngredientImg, sectionTitle: "Epices" },
    { id: "cumin", label: "Cumin", detail: "1/2 c. a cafe de cumin", image: cuminIngredientImg, sectionTitle: "Epices" },
    { id: "paprika", label: "Paprika", detail: "1/2 c. a cafe de paprika", image: paprikaIngredientImg, sectionTitle: "Epices" },
    { id: "curcuma", label: "Curcuma", detail: "1/2 c. a cafe de curcuma", image: curcumaIngredientImg, sectionTitle: "Epices" },
    { id: "garam-massala", label: "Garam massala", detail: "1/2 c. a cafe de garam masala", image: garamMassalaIngredientImg, sectionTitle: "Epices" },
    { id: "sel", label: "Sel", detail: "Sel", image: selIngredientImg, sectionTitle: "Epices" },
    { id: "poivre", label: "Poivre", detail: "Poivre", image: poivreIngredientImg, sectionTitle: "Epices" },
    { id: "citron-vert", label: "Citron vert", detail: "Jus de citron ou citron vert", image: citronVertIngredientImg, sectionTitle: "Finition" },
    { id: "coriandre-fraiche", label: "Coriandre fraiche", detail: "Coriandre fraiche (optionnel)", image: coriandreFraicheIngredientImg, sectionTitle: "Finition" },
  ],
  "mass-riz-cajou": [
    { id: "steak", label: "Steak", detail: "1 steak hache (150-200 g)", image: steakIngredientImg },
    { id: "pommes-terre", label: "Pommes de terre", detail: "300 g de pommes de terre", image: steackPommeDeTerreImg },
    { id: "haricots-verts", label: "Haricots verts", detail: "150 g de haricots verts", image: haricotsVertsIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail (optionnel)", image: ailIngredientImg },
    { id: "sel-poivre", label: "Sel & poivre", detail: "Sel et poivre", image: poivreIngredientImg },
    { id: "persil", label: "Persil", detail: "Optionnel: persil", image: persilIngredientImg },
    { id: "herbes-provence", label: "Herbes de Provence", detail: "Optionnel: herbes de Provence", image: herbesProvenceIngredientImg },
  ],
}

export const massRecipes: Recipe[] = [
{
  id: "mass-pancakes",
  title: "Pancake protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©",
  flavor: "sucre",
  prepTime: "10 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  15 min",
  servings: "1 pers",
  image: pancakesProteineImg,
  ingredients: [
    "1 ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œuf",
    "25 ml de lait",
    "35 g de farine",
    "30 g de fromage blanc",
    "20 g de whey",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de levure chimique",
    "Quelques gouttes d'arÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´me vanille",
  ],
  steps: [
    "1. Preparer la pate",
    "Mixer les ingredients",
    "Dans un blender ou un bol, ajoute :",
    "- les flocons d'avoine",
    "- la whey",
    "- l'oeuf",
    "- le lait",
    "- la levure",
    "- la vanille",
    "- le sel",
    "Mixe ou melange jusqu'a obtenir une pate lisse et legerement epaisse.",
    "Laisser reposer",
    "Laisse reposer la pate environ 2 minutes.",
    "Cela permet aux flocons d'avoine d'absorber le liquide.",
    "2. Cuire les pancakes",
    "Chauffer la poele",
    "Fais chauffer une poele antiadhesive a feu moyen.",
    "Ajoute un peu d'huile ou de beurre.",
    "Cuire",
    "Verse une petite louche de pate dans la poele.",
    "Laisse cuire 1 a 2 minutes, jusqu'a voir apparaitre de petites bulles a la surface.",
    "Retourne le pancake, puis poursuis la cuisson 1 minute de l'autre cote.",
    "3. Servir",
    "Empiler",
    "Empile 3 a 4 pancakes dans une assiette.",
  ],
  toppings: [
    "Ajouter les toppings",
    "Tu peux ajouter selon tes envies :",
    "Du yaourt grec",
    "Des fruits rouges",
    "Du beurre de cacahuete",
    "Du sirop d'erable ou du miel",
    "A adapter selon ton gout et ton niveau de gourmandise.",
  ],
  tips: [
    "Astuce : si la pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢te est trop ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©paisse, ajoute quelques gouttes de lait. Si elle est trop liquide, ajoute un peu de farine.",
  ],
},
{
  id: "mass-cookies-chocolat-fleur-sel",
  title: "Cookies chocolat & fleur de sel",
  flavor: "sucre",
  prepTime: "20 a 25 min",
  servings: "12 cookies",
  image: cookiesChocolatFleurSelImg,
  ingredients: [
    "Pour les cookies",
    "120 g de beurre mou",
    "100 g de sucre blanc",
    "80 g de sucre roux",
    "1 oeuf",
    "1 cuillere a cafe d'extrait de vanille",
    "200 g de farine",
    "1/2 cuillere a cafe de bicarbonate de sodium",
    "1 pincee de sel",
    "150 g de chocolat noir en morceaux ou pepites",
    "Pour la finition",
    "1 pincee de fleur de sel",
  ],
  steps: [
    "1. Preparer la pate",
    "Prechauffer et melanger",
    "Prechauffe le four a 180C.",
    "Dans un saladier, melange le beurre mou, le sucre roux et le sucre blanc.",
    "Fouette jusqu'a obtenir une texture cremeuse.",
    "Le melange doit devenir leger et homogene.",
    "2. Ajouter les ingredients liquides",
    "Incorporer",
    "Ajoute l'oeuf et la vanille, puis melange jusqu'a obtenir une pate homogene.",
    "La preparation doit etre bien lisse.",
    "3. Ajouter les ingredients secs",
    "Melanger",
    "Ajoute les ingredients secs et melange juste assez pour les incorporer.",
    "Ne melange pas trop pour garder des cookies moelleux.",
    "4. Ajouter le chocolat",
    "Incorporer",
    "Ajoute les morceaux de chocolat et melange delicatement.",
    "Repartis-les bien dans toute la pate.",
    "5. Former les cookies",
    "Faconner",
    "Forme des boules de pate (environ 2 cuilleres a soupe).",
    "Dispose-les sur une plaque recouverte de papier cuisson.",
    "Laisse de l'espace entre chaque cookie pour eviter qu'ils ne se collent.",
    "6. Cuisson",
    "Enfourner",
    "Fais cuire 12 a 14 minutes.",
    "Les bords doivent etre dores, mais le centre encore legerement mou.",
    "7. Ajouter la fleur de sel",
    "Finaliser",
    "A la sortie du four, ajoute une pincee de fleur de sel sur chaque cookie.",
    "Laisser refroidir",
    "Laisse refroidir environ 10 minutes avant de deguster.",
    "Les cookies vont legerement se raffermir tout en restant moelleux.",
    "Tes cookies chocolat & fleur de sel sont prets.",
    "Les 3 secrets pour les cookies parfaits",
    "- utiliser du beurre bien mou",
    "- ne pas trop cuire les cookies",
    "- laisser refroidir sur la plaque pour garder un centre fondant.",
  ],
},
{
  id: "mass-framboises-chocolat-yaourt",
  title: "Framboises enrobees chocolat & yaourt",
  flavor: "sucre",
  prepTime: "1 h 30 min",
  servings: "2 pers",
  image: fruitsRougesGranolaImg,
  ingredients: [
    "Pour les bouchees",
    "150 g de framboises",
    "120 g de yaourt nature",
    "150 g de chocolat noir",
    "Optionnel",
    "1 cuillere a cafe de miel",
    "1 cuillere a cafe d'huile de coco (pour un chocolat plus lisse)",
  ],
  steps: [
    "1. Preparer le melange framboises",
    "Melanger",
    "Dans un bol, ajoute les framboises et le yaourt.",
    "Ajoute un peu de miel si tu souhaites une version plus sucree.",
    "Melange delicatement.",
    "L'objectif est de garder des morceaux de framboises pour plus de texture.",
    "2. Former les bouchees",
    "Former les bouchees",
    "Recouvre une plaque de papier cuisson.",
    "Depose des petites cuilleres du melange pour former des petits tas.",
    "Congeler",
    "Place la plaque au congelateur pendant environ 1 heure.",
    "Les bouchees doivent etre bien fermes pour etre manipulees facilement.",
    "3. Faire fondre le chocolat",
    "Faire fondre",
    "Place le chocolat en morceaux dans un bol.",
    "Ajoute un peu d'huile de coco si tu le souhaites.",
    "Fais fondre :",
    "- au micro-ondes par intervalles de 30 secondes",
    "- ou au bain-marie",
    "Melanger",
    "Remue jusqu'a obtenir un chocolat bien lisse.",
    "La texture doit etre fluide pour enrober facilement.",
    "4. Enrober les bouchees",
    "Tremper",
    "Sors les bouchees du congelateur.",
    "A l'aide d'une fourchette, trempe-les dans le chocolat fondu.",
    "Deposer",
    "Replace-les sur la plaque recouverte de papier cuisson.",
    "Travaille rapidement pour eviter qu'elles ne ramollissent.",
    "5. Faire durcir le chocolat",
    "Refroidir",
    "Place les bouchees au refrigerateur pendant 10 minutes ou au congelateur 5 minutes.",
    "Le chocolat va durcir et devenir croquant.",
    "Tes framboises chocolat & yaourt sont pretes.",
    "Astuces pour que la recette soit incroyable",
    "- utilise un chocolat noir 70 % pour un meilleur gout",
    "- ajoute un peu de zeste de citron dans le yaourt",
    "- saupoudre un peu de noix de coco ou pistaches sur le chocolat avant qu'il durcisse.",
  ],
},
{
  id: "mass-dattes-beurre-cacahuete",
  title: "Dattes fourrees au beurre de cacahuete",
  flavor: "sucre",
  prepTime: "10 min",
  servings: "2 pers",
  image: dattesBeurreCacahueteImg,
  ingredients: [
    "Pour les bouchees",
    "8 a 10 dattes (type Medjool de preference)",
    "4 cuilleres a cafe de beurre de cacahuete",
    "Optionnel",
    "50 g de chocolat noir fondu",
    "1 pincee de fleur de sel",
  ],
  steps: [
    "1. Preparer les dattes",
    "Preparer les dattes",
    "Coupe chaque datte dans la longueur, sans aller jusqu'au bout.",
    "Retire le noyau.",
    "Garde la datte legerement ouverte pour pouvoir la garnir facilement.",
    "2. Ajouter le beurre de cacahuete",
    "Remplis chaque datte avec une petite cuillere de beurre de cacahuete.",
    "Lisse legerement pour bien repartir.",
    "3. Ajouter la fleur de sel",
    "Saupoudre une petite pincee de fleur de sel sur le beurre de cacahuete.",
    "4. Option chocolat (tres recommande)",
    "Fais fondre environ 30 g de chocolat noir.",
    "Verse un filet de chocolat sur chaque datte.",
    "Le chocolat apporte une texture croquante en refroidissant.",
    "5. Finition",
    "Finaliser",
    "Ajoute, si tu le souhaites, quelques cacahuetes concassees.",
    "Place au refrigerateur pendant 5 minutes pour faire durcir le chocolat.",
    "Tes dattes fourrees sont pretes.",
    "Astuces pour les rendre incroyables",
    "- utilise des dattes Medjool bien moelleuses",
    "- ajoute un peu de zeste d'orange dans le chocolat",
    "- mets les dattes 10 minutes au congelateur avant de les manger : texture incroyable.",
  ],
},
{
  id: "mass-carrot-cake-cream-cheese",
  title: "Carrot cake moelleux au glacage cream cheese",
  flavor: "sucre",
  prepTime: "55 min",
  servings: "8 pers",
  image: carrotCakeBreadImg,
  ingredients: [
    "Pour le gateau",
    "250 g de carottes rapees",
    "200 g de farine",
    "150 g de sucre",
    "100 ml d'huile vegetale",
    "3 oeufs",
    "1 cuillere a cafe de cannelle",
    "1 cuillere a cafe de levure chimique",
    "1/2 cuillere a cafe de bicarbonate de sodium",
    "1 pincee de sel",
    "80 g de noix concassees (optionnel)",
    "Pour le glacage",
    "200 g de cream cheese",
    "60 g de sucre glace",
    "30 g de beurre mou",
    "1/2 cuillere a cafe d'extrait de vanille",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 180C.",
    "Beurre ou chemise un moule d'environ 20 cm.",
    "2. Melanger les ingredients liquides",
    "Melanger les ingredients liquides",
    "Dans un grand bol, fouette :",
    "- les oeufs",
    "- le sucre roux",
    "- le sucre blanc",
    "Ajoute ensuite l'huile et la vanille, puis melange.",
    "La preparation doit etre bien homogene.",
    "3. Ajouter les ingredients secs",
    "Incorporer",
    "Ajoute les ingredients secs au melange.",
    "Melange juste jusqu'a incorporation.",
    "4. Ajouter les carottes",
    "Incorporer",
    "Ajoute les carottes rapees, puis les noix si tu en utilises.",
    "Melange delicatement.",
    "5. Cuisson",
    "Enfourner",
    "Verse la pate dans le moule.",
    "Fais cuire 40 a 45 minutes.",
    "Verifier",
    "Plante la lame d'un couteau : elle doit ressortir presque seche.",
    "Le gateau doit rester moelleux a l'interieur.",
    "6. Preparer le glacage",
    "Melanger",
    "Dans un bol, fouette tous les ingredients jusqu'a obtenir une creme lisse et epaisse.",
    "Le glacage doit etre onctueux et facile a etaler.",
    "7. Glacer le gateau",
    "Refroidir",
    "Laisse le carrot cake refroidir completement.",
    "Glacer",
    "Etale le glacage au cream cheese sur le dessus.",
    "Ton carrot cake est pret.",
    "Les secrets pour un carrot cake incroyable",
    "- raper les carottes tres finement",
    "- utiliser du sucre roux pour plus de moelleux",
    "- laisser reposer le gateau quelques heures : il devient encore meilleur.",
  ],
},
{
  id: "mass-barres-snickers-caramel-chocolat",
  title: "Barres type Snickers au caramel, chocolat noir & beurre de cacahuete",
  flavor: "sucre",
  prepTime: "1 h 45 min",
  servings: "12 barres",
  image: barresSnickersCaramelImg,
  ingredients: [
    "Pour la base biscuit",
    "200 g de biscuits (type petit beurre ou digestive)",
    "100 g de beurre fondu",
    "Pour la couche caramel cacahuete",
    "150 g de caramel (caramel beurre sale ou caramel mou fondu)",
    "120 g de beurre de cacahuete",
    "Pour le dessus",
    "200 g de chocolat noir",
  ],
  steps: [
    "1. Preparer la base biscuit",
    "Ecraser les biscuits",
    "Reduis les biscuits en miettes fines a l'aide d'un mixeur ou d'un rouleau.",
    "Melanger",
    "Ajoute le beurre fondu et melange jusqu'a obtenir une texture sableuse.",
    "Former la base",
    "Tapisse un moule carre de papier cuisson.",
    "Verse le melange, puis presse bien avec une cuillere pour former une base compacte.",
    "Refrigerer",
    "Place au refrigerateur pendant 15 minutes pour que la base durcisse.",
    "2. Preparer la couche caramel cacahuete",
    "Melanger",
    "Dans un bol, melange le caramel et le beurre de cacahuete jusqu'a obtenir une creme lisse et epaisse.",
    "Etaler",
    "Verse ce melange sur la base biscuit.",
    "Lisse bien avec une spatule.",
    "Refrigerer",
    "Remets au refrigerateur pendant 20 minutes.",
    "La couche doit se raffermir legerement.",
    "4. Faire fondre le chocolat",
    "Faire fondre",
    "Coupe le chocolat en morceaux, puis fais-le fondre :",
    "- au micro-ondes par intervalles de 30 secondes, ou",
    "- au bain-marie.",
    "Melanger",
    "Remue jusqu'a obtenir un chocolat bien lisse.",
    "Il doit etre fluide pour etre etale facilement.",
    "Finaliser",
    "Ajouter le chocolat",
    "Verse le chocolat fondu sur la couche caramel-cacahuete.",
    "Etale uniformement.",
    "Tu peux ajouter de la fleur de sel ou des cacahuetes concassees (optionnel).",
    "Laisser durcir",
    "Place au refrigerateur pendant 30 a 40 minutes.",
    "Decouper",
    "Lorsque le chocolat est bien dur, coupe en barres ou en carres.",
    "Tes barres type Snickers maison sont pretes.",
    "Astuces pour qu'elles soient incroyables",
    "- utilise un caramel beurre sale maison ou de bonne qualite",
    "- ajoute des cacahuetes dans la couche caramel pour plus de croquant",
    "- coupe les barres avec un couteau chaud pour des bords parfaits.",
  ],
},
{
  id: "mass-banana-oat-bars",
  title: "Banana Oat Bars",
  flavor: "sucre",
  prepTime: "30 a 35 min",
  servings: "8 barres",
  image: bananaOatBarsImg,
  ingredients: [
    "Pour les banana oat bars",
    "2 bananes bien mures",
    "120 g de flocons d'avoine",
    "2 oeufs",
    "2 cuilleres a soupe de sirop d'erable",
    "1/2 cuillere a cafe de bicarbonate de sodium",
    "1/2 cuillere a cafe de cannelle",
    "60 g de pepites de chocolat",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 180C.",
    "Tapisse un petit moule carre de papier cuisson.",
    "2. Ecraser les bananes",
    "Ecraser les bananes",
    "Place les bananes dans un bol.",
    "Ecrase-les a l'aide d'une fourchette jusqu'a obtenir une puree lisse.",
    "Il ne doit plus rester de gros morceaux.",
    "3. Melanger les ingredients liquides",
    "Ajoute :",
    "- l'oeuf",
    "- le lait",
    "- la vanille",
    "- le miel (optionnel)",
    "Melange bien jusqu'a obtenir une preparation homogene.",
    "4. Ajouter les ingredients secs",
    "Incorporer",
    "Ajoute les flocons d'avoine, la levure et le sel.",
    "Melange jusqu'a obtenir une pate epaisse.",
    "La texture doit etre dense mais facile a etaler.",
    "5. Ajouter le chocolat",
    "Incorporer",
    "Ajoute les pepites de chocolat et melange delicatement.",
    "Repartis-les bien dans toute la pate.",
    "6. Cuisson",
    "Enfourner",
    "Verse la pate dans le moule et lisse le dessus.",
    "Fais cuire 20 minutes.",
    "Verifier",
    "Le dessus doit etre legerement dore, tout en restant moelleux.",
    "Le centre doit rester tendre.",
    "7. Refroidir",
    "Laisser refroidir",
    "Laisse refroidir environ 10 minutes.",
    "Decouper",
    "Coupe en 8 barres.",
    "Tes Banana Oat Bars sont pretes.",
    "Astuces pour les rendre incroyables",
    "- utilise des bananes tres mures (presque noires)",
    "- ajoute un peu de cannelle",
    "- mets quelques pepites de chocolat sur le dessus avant cuisson.",
  ],
},
{
  id: "mass-bowl-saumon",
  title: "Saumon marinÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© sriracha & riz",
  flavor: "sale",
  prepTime: "30 min",
  servings: "1 pers",
  image: saumonBowlImg,
  ingredients: [
    "Riz",
    "100 g de riz blanc",
    "110 ml d'eau",
    "1 c. a soupe de vinaigre de riz",
    "Saumon marine",
    "120 g de saumon frais",
    "1 c. a cafe d'huile de sesame",
    "1 c. a cafe de gingembre rape",
    "1 c. a cafe de sauce soja (optionnel mais tres bon)",
    "Garnitures",
    "1/2 avocat",
    "50 g d'edamame",
    "1 petite feuille d'algue seche (nori)",
    "Sauce sriracha mayo",
    "1 c. a soupe de mayonnaise",
    "1 c. a cafe de sauce sriracha",
  ],
  steps: [
    "1. Cuire le riz",
    "Rincer le riz",
    "Place le riz dans un bol et rince-le a l'eau froide plusieurs fois, jusqu'a ce que l'eau devienne claire.",
    "Cela enleve l'exces d'amidon et ameliore la texture.",
    "Cuire le riz",
    "Verse le riz dans une casserole avec l'eau.",
    "Porte a ebullition, puis couvre et baisse le feu.",
    "Laisse cuire 15 minutes a feu doux.",
    "Laisser reposer",
    "Retire du feu et laisse reposer 10 minutes, toujours couvert.",
    "Le riz finit d'absorber l'eau et devient bien tendre.",
    "Assaisonner",
    "Ajoute le vinaigre de riz et melange delicatement.",
    "2. Mariner le saumon",
    "Couper et assaisonner",
    "Coupe le saumon en cubes et place-le dans un bol.",
    "Ajoute l'huile de sesame, le gingembre et la sauce soja.",
    "Melanger et mariner",
    "Melange delicatement pour enrober le saumon.",
    "Laisse mariner environ 10 minutes.",
    "3. Cuire le saumon",
    "Cuire",
    "Fais chauffer une poele a feu moyen.",
    "Ajoute le saumon marine et fais cuire 3 a 4 minutes en remuant legerement.",
    "Le saumon doit rester tendre et legerement rose a coeur.",
    "4. Preparer les garnitures",
    "Preparer",
    "Coupe l'avocat en lamelles.",
    "Si les edamame sont surgeles, fais-les cuire 3 minutes dans l'eau bouillante, puis egoutte-les.",
    "Coupe les algues nori en fines bandes.",
    "5. Preparer la sauce sriracha mayo",
    "Melanger",
    "Dans un petit bol, melange la mayonnaise et la sriracha.",
    "6. Monter le bowl",
    "Disposer la base",
    "Place le riz vinaigre dans un bol.",
    "Ajouter les garnitures",
    "Ajoute :",
    "le saumon cuit",
    "les edamame",
    "l'avocat",
    "Ajoute ensuite les algues nori.",
    "Finaliser",
    "Verse la sauce sriracha mayo sur le dessus.",
    "Ton bowl de saumon marine est pret.",
  ],
},
{
  id: "mass-bagel-saumon",
  title: "Bagel saumon & cream cheese avocat",
  flavor: "sale",
  prepTime: "10 min",
  servings: "1 pers",
  image: bagelSaumonImg,
  ingredients: [
    "1 bagel nature ou au sesame",
    "2 cuilleres a soupe de cream cheese",
    "60-80 g de saumon fume",
    "1/2 avocat",
    "1 petite tomate",
    "Pour l'assaisonnement",
    "1 pincee d'aneth",
    "Poivre noir",
  ],
  steps: [
    "1. Preparer le bagel",
    "Coupe le bagel en deux dans l'epaisseur.",
    "Fais-le griller 2 a 3 minutes au grille-pain.",
    "Il doit etre legerement croustillant a l'exterieur tout en restant moelleux.",
    "2. Preparer les garnitures",
    "Coupe l'avocat en fines lamelles.",
    "Coupe la tomate en rondelles fines.",
    "Des tranches fines rendent le bagel plus agreable a manger.",
    "3. Etaler le cream cheese",
    "Sur chaque moitie du bagel grille, etale environ 1 cuillere a soupe de cream cheese.",
    "Repartis bien jusqu'aux bords pour une texture cremeuse a chaque bouchee.",
    "4. Ajouter le saumon",
    "Dispose le saumon fume en plis legers sur le cream cheese.",
    "Cela apporte du volume et une texture plus fondante.",
    "5. Ajouter les legumes",
    "Ajoute les lamelles d'avocat, puis les rondelles de tomate.",
    "Cela apporte fraicheur et equilibre.",
    "6. Assaisonner",
    "Ajoute une pincee d'aneth et un peu de poivre noir.",
    "L'aneth se marie parfaitement avec le saumon.",
    "7. Refermer et servir",
    "Referme le bagel en pressant legerement.",
    "Coupe-le en deux pour faciliter la degustation.",
    "Ton bagel au saumon fume est pret.",
  ],
},
{
  id: "mass-saumon-grille-salsa-riz",
  title: "Saumon grille, salsa tomate-avocat & riz blanc",
  flavor: "sale",
  prepTime: "25 min",
  servings: "2 pers",
  image: saumonGrilleSalsaTomateAvocatImg,
  ingredients: [
    "Base",
    "80 g de riz blanc cru",
    "160 ml d'eau",
    "Saumon grille",
    "1 pave de saumon (120-150 g)",
    "1 c. a cafe d'huile d'olive",
    "1 c. a cafe de jus de citron",
    "sel et poivre",
    "Salsa tomate-avocat",
    "1/2 avocat",
    "1 petite tomate",
    "1 c. a soupe d'oignon rouge finement coupe",
    "1 c. a cafe de jus de citron vert",
    "1 c. a cafe d'huile d'olive",
    "poivre",
    "(optionnel mais tres bon) coriandre ou persil",
  ],
  steps: [
    "1. Cuire le riz",
    "Rincer le riz",
    "Place le riz dans une passoire fine et rince-le sous l'eau froide pendant quelques secondes.",
    "Cela permet d'enlever l'exces d'amidon et d'obtenir un riz moins collant.",
    "Mettre en cuisson",
    "Verse le riz rince dans une casserole, puis ajoute les 160 ml d'eau.",
    "Melange legerement pour bien repartir les grains.",
    "Porter a ebullition",
    "Fais chauffer a feu moyen jusqu'a ce que l'eau arrive a ebullition.",
    "Cuire a feu doux",
    "Des que l'eau bout, couvre la casserole et baisse le feu.",
    "Laisse cuire a feu doux pendant 12 minutes, sans soulever le couvercle.",
    "Laisser reposer",
    "Retire la casserole du feu et laisse reposer 5 minutes, toujours couverte.",
    "Cette etape permet au riz de finir d'absorber l'humidite.",
    "Aerer le riz",
    "A l'aide d'une fourchette, melange delicatement pour separer les grains.",
    "2. Preparer la salsa",
    "Preparer les ingredients",
    "Commence par laver soigneusement la tomate et les herbes si tu en utilises.",
    "Coupe egalement un petit morceau d'oignon rouge et hache-le tres finement pour qu'il s'integre bien a la salsa sans etre trop fort en bouche.",
    "Coupe la tomate en petits des reguliers.",
    "Retire legerement les graines si la tomate est tres juteuse, pour eviter que la salsa ne devienne trop liquide.",
    "Preparer l'avocat",
    "Coupe l'avocat en deux, retire le noyau puis recupere la chair a l'aide d'une cuillere.",
    "Decoupe-le ensuite en petits cubes.",
    "Il doit etre mur mais encore ferme pour garder une belle texture.",
    "Assembler les ingredients solides",
    "Dans un petit bol :",
    "ajoute les des de tomate",
    "ajoute les cubes d'avocat",
    "incorpore l'oignon rouge finement coupe",
    "Si tu utilises de la coriandre ou du persil, c'est le moment de les ciseler finement et de les ajouter.",
    "Assaisonner",
    "Verse ensuite :",
    "le jus de citron vert",
    "l'huile d'olive",
    "un peu de poivre",
    "Le citron est essentiel : il apporte de la fraicheur et empeche l'avocat de noircir.",
    "Melanger delicatement",
    "Melange doucement avec une cuillere.",
    "Il est important de ne pas ecraser l'avocat, le but est de garder de jolis morceaux pour une texture fraiche et agreable.",
    "3. Cuire le saumon",
    "Preparer le saumon",
    "Sors le saumon du refrigerateur environ 10 minutes avant la cuisson pour qu'il ne soit pas trop froid.",
    "Eponge-le delicatement avec du papier absorbant, surtout cote peau, cela permet d'obtenir une peau bien croustillante.",
    "Assaisonner",
    "Depose le saumon sur une assiette et assaisonne :",
    "une pincee de sel",
    "du poivre",
    "un leger filet de jus de citron",
    "N'en mets pas trop pour ne pas cuire le poisson avant la cuisson.",
    "Chauffer la poele",
    "Fais chauffer une poele a feu moyen-fort.",
    "Ajoute l'huile d'olive et laisse-la chauffer quelques secondes.",
    "L'huile doit etre chaude mais pas fumante.",
    "Cuire cote peau",
    "Depose le saumon dans la poele cote peau vers le bas.",
    "Appuie legerement avec une spatule pendant les premieres secondes pour eviter que le poisson ne se retracte.",
    "Laisse cuire environ 4 minutes sans le toucher.",
    "La peau doit devenir doree et croustillante.",
    "Retourner le saumon",
    "Retourne delicatement le saumon a l'aide d'une spatule.",
    "Poursuis la cuisson pendant 2 a 3 minutes selon l'epaisseur du pave.",
    "Verifier la cuisson",
    "Le saumon est pret lorsque :",
    "l'exterieur est bien dore",
    "l'interieur reste tendre et legerement rose",
    "Il doit se detacher facilement en lamelles a la fourchette.",
    "4. Servir",
    "Mets le riz dans l'assiette.",
    "Ajoute le saumon grille.",
    "Ajoute la salsa tomate-avocat sur le saumon ou a cote.",
    "Il ne reste plus qu’à savourer, bon appétit !",
    "Astuces pour que la recette soit vraiment incroyable",
    "- mets quelques graines de sesame grillees sur le saumon",
  ],
},
{
  id: "mass-salade-pasteque-feta",
  title: "Salade pasteque & feta",
  flavor: "sale",
  prepTime: "10 Ã  15 min",
  servings: "2 pers",
  image: saladePastequeFetaImg,
  ingredients: [
    "400 g de pasteque",
    "120 g de feta",
    "6-8 feuilles de menthe fraiche",
    "2 c. a soupe d'huile d'olive",
    "Poivre noir",
    "(Optionnel mais tres bon) 1 c. a cafe de vinaigre balsamique",
  ],
  steps: [
    "1. Preparer la pasteque",
    "Coupe la pasteque, retire la peau puis decoupe la chair en cubes d'environ 2 a 3 cm.",
    "Place-les dans un saladier.",
    "Des morceaux reguliers rendent la salade plus agreable a deguster.",
    "2. Ajouter la feta",
    "Coupe la feta en cubes ou emiette-la grossierement.",
    "Ajoute-la dans le saladier avec la pasteque.",
    "La feta apporte une touche salee qui contraste avec la douceur de la pasteque.",
    "3. Ajouter la menthe",
    "Lave les feuilles de menthe, puis coupe-les finement ou dechire-les a la main.",
    "Ajoute-les a la salade.",
    "La menthe apporte fraicheur et parfum.",
    "4. Assaisonner",
    "Verse l'huile d'olive et ajoute du poivre noir.",
    "Tu peux aussi ajouter un leger filet de balsamique (optionnel).",
    "L'assaisonnement doit rester leger pour ne pas masquer les saveurs.",
    "5. Melanger et servir",
    "Melange delicatement pour ne pas ecraser la pasteque.",
    "Sers bien frais.",
    "Ta salade pasteque & feta est prete.",
    "Conseil pour qu'elle soit vraiment excellente :",
    "- utilise une pasteque bien froide",
    "- prends une feta en bloc (plus cremeuse)",
    "- ajoute la feta a la fin pour garder de beaux morceaux.",
    "Ces details ameliorent beaucoup la texture et l'equilibre sucre-sale de la salade.",
  ],
},
{
  id: "mass-salade-grecque",
  title: "Salade grecque (concombre, feta, tomates cerises & olives)",
  flavor: "sale",
  prepTime: "15 min",
  servings: "2 pers",
  image: saladeGrecqueImg,
  ingredients: [
    "200 g de tomates cerises",
    "1 concombre",
    "1/2 oignon rouge",
    "120 g de feta",
    "40 g d'olives noires",
    "40 g d'olives vertes",
    "3 c. à soupe d'huile d'olive",
    "1/2 c. à café d'origan",
    "Poivre noir",
  ],
  steps: [
    "1. Preparer les tomates",
    "Lave les tomates cerises, puis coupe-les en deux.",
    "Place-les dans un grand saladier.",
    "2. Couper le concombre",
    "Lave le concombre.",
    "Tu peux eplucher une bande sur deux (optionnel), puis coupe-le en fines demi-rondelles.",
    "Ajoute-le dans le saladier.",
    "3. Preparer l'oignon",
    "Epluche le demi-oignon rouge et coupe-le en fines lamelles.",
    "Pour un gout plus doux, laisse-le tremper 5 minutes dans de l'eau froide, puis egoutte-le avant de l'ajouter a la salade.",
    "4. Ajouter les olives",
    "Ajoute les olives noires et vertes.",
    "Si necessaire, retire les noyaux.",
    "5. Assaisonner",
    "Verse l'huile d'olive, ajoute l'origan et le poivre noir.",
    "Melange delicatement.",
    "L'assaisonnement reste simple pour mettre en valeur les ingredients.",
    "6. Ajouter la feta",
    "Coupe la feta en gros cubes ou en morceaux.",
    "Depose-la sur le dessus de la salade.",
    "Ajoute un leger filet d'huile d'olive et un peu d'origan.",
    "Traditionnellement, la feta est ajoutee en gros morceaux plutot qu'emiettee.",
  ],
},
{
  id: "mass-wrap-poulet",
  title: "Wrap poulet croquant",
  flavor: "sale",
  prepTime: "25 min",
  servings: "4 wraps",
  image: wrapPouletCroquantImg,
  ingredients: [
    "Pour le poulet",
    "600 g de blanc de poulet coupe en lanieres",
    "3 gousses d'ail hachees",
    "1 c. a soupe d'origan",
    "1 c. a soupe de paprika",
    "1 c. a cafe de poudre d'oignon",
    "1 c. a cafe de flocons de piment",
    "1 c. a cafe de sel",
    "1/2 c. a cafe de poivre",
    "Jus de citron (selon gout)",
    "1 c. a soupe d'huile d'olive",
    "Les marinades avec ail, paprika, origan et citron sont tres utilisees pour donner du gout au poulet dans les wraps grilles.",
    "Pour la sauce",
    "100 g de yaourt ecreme",
    "20 g de sriracha",
    "1 gousse d'ail emincee",
    "Persil (selon gout)",
    "Sel et poivre",
    "Les sauces de wraps utilisent souvent yaourt + sriracha + ail pour obtenir une sauce cremeuse et legerement epicee.",
    "Pour le montage",
    "Tortillas faibles en calories",
    "Laitue",
    "Oignons rouges",
    "Tomates coupees en des",
  ],
  steps: [
    "1. Mariner le poulet",
    "Preparer la marinade",
    "Dans un saladier, ajoute :",
    "l'ail",
    "l'origan",
    "le paprika",
    "la poudre d'oignon",
    "les flocons de piment",
    "le sel et le poivre",
    "le jus de citron",
    "un filet d'huile d'olive",
    "Melange pour obtenir une marinade homogene.",
    "Enrober le poulet",
    "Ajoute les lanieres de poulet et melange soigneusement.",
    "Chaque morceau doit etre bien enrobe.",
    "Laisser mariner",
    "Laisse reposer 10 a 15 minutes.",
    "Cela permet au poulet de s'impregner des saveurs.",
    "2. Cuire le poulet",
    "Chauffer la poele",
    "Fais chauffer une poele a feu moyen-fort.",
    "Cuire",
    "Ajoute le poulet marine et fais cuire 8 a 10 minutes, en remuant regulierement.",
    "Le poulet doit etre bien dore et cuit a coeur.",
    "3. Preparer la sauce",
    "Melanger",
    "Dans un bol, melange :",
    "le yaourt",
    "la sriracha",
    "l'ail",
    "le persil",
    "le sel et le poivre",
    "Melange jusqu'a obtenir une sauce lisse et cremeuse.",
    "4. Preparer les legumes",
    "Couper",
    "Coupe les tomates en des.",
    "Emince l'oignon rouge en fines lamelles.",
    "Lave et coupe la laitue.",
    "5. Monter les wraps",
    "Garnir",
    "Pose une tortilla sur une assiette.",
    "Etale un peu de sauce sur la base.",
    "Ajoute ensuite :",
    "la laitue",
    "le poulet chaud",
    "les tomates",
    "l'oignon rouge",
    "Ajoute un peu de sauce supplementaire.",
    "Rouler",
    "Plie les cotes vers l'interieur, puis roule le wrap bien serre.",
    "Coupe en deux si tu le souhaites.",
    "Tes wraps au poulet sont prets.",
  ],
},
{
  id: "mass-omelette-power",
  title: "Omelette power ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  la feta",
  flavor: "sale",
  prepTime: "10 Ã  15 min",
  servings: "1 pers",
  image: omeletteFetaImg,
  ingredients: [
    "2 ou 3 oeufs",
    "1 poignee d'epinards frais (environ 1 tasse)",
    "40 g de feta",
    "1 c. a cafe d'huile d'olive",
    "1 petite noix de beurre",
    "Poivre noir",
    "(Optionnel) 1 petite gousse d'ail hachee",
    "1 petit oignon",
    "Sel",
  ],
  steps: [
    "1. Cuire les epinards",
    "Fais chauffer 1 c. a cafe d'huile d'olive dans une poele a feu moyen.",
    "Ajoute les epinards et fais-les cuire environ 1 minute.",
    "Ils vont rapidement tomber et reduire de volume.",
    "Mets-les de cote.",
    "2. Preparer les oeufs",
    "Casse les oeufs dans un bol.",
    "Ajoute une pincee de poivre, puis fouette pendant environ 30 secondes.",
    "Cela permet d'incorporer de l'air et d'obtenir une omelette plus moelleuse.",
    "3. Cuire l'omelette",
    "Fais fondre 1 petite noix de beurre dans la poele a feu moyen-doux.",
    "Verse les oeufs battus et laisse cuire 10 a 15 secondes sans toucher.",
    "Ensuite, a l'aide d'une spatule, pousse doucement les oeufs vers le centre pour cuire le reste.",
    "L'omelette doit rester legerement cremeuse.",
    "4. Ajouter la garniture",
    "Ajoute les epinards sur une moitie de l'omelette.",
    "Emiette la feta par-dessus.",
    "Laisse cuire 30 a 60 secondes pour que la feta se rechauffe et devienne plus fondante.",
    "5. Plier et servir",
    "Plie l'omelette en deux a l'aide d'une spatule.",
    "Laisse cuire encore 30 secondes, puis fais-la glisser dans une assiette.",
    "Ton omelette feta & epinards est prete.",
    "Astuce pour qu'elle soit vraiment excellente :",
    "- ne cuis pas trop les oeufs -> l'omelette doit rester legerement cremeuse au centre",
    "- ajoute la feta a la fin pour garder son gout et sa texture",
    "- utilise une bonne feta en bloc (beaucoup plus savoureuse).",
  ],
},
{
  id: "mass-smoothie-gain",
  title: "Smoothie banane beurre de cacahuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨te",
  flavor: "boisson",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieBananeBeurreCacahueteImg,
  ingredients: [
    "1 banane",
    "300 ml de lait vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tal",
    "80 g de flocons dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢avoine",
    "1 scoop de protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ine whey",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de beurre de cacahuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨te",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de sirop dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rable",
    "Cannelle (facultatif)",
  ],
  steps: [
    "1. Mettre les ingredients dans le blender",
    "Ajoute dans le blender :",
    "- la banane",
    "- la whey",
    "- le beurre de cacahuete",
    "- le lait",
    "- les glacons",
    "2. Mixer",
    "Mixe 30 a 40 secondes jusqu'a obtenir une texture tres lisse et cremeuse.",
    "3. Ajuster la texture",
    "Si le smoothie est trop epais -> ajoute un peu de lait.",
    "Si tu le veux plus epais -> ajoute quelques glacons.",
    "4. Servir",
    "Verse dans un grand verre.",
    "Ton smoothie est pret.",
    "Valeurs approximatives",
    "(selon whey utilisee)",
    "- Proteines : 30 a 35 g",
    "- Calories : ~350 kcal",
  ],
},
{
  id: "mass-smoothie-fraise-banane-coco-whey",
  title: "Smoothie fraise, banane, eau de coco & whey vanille",
  flavor: "boisson",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieFraiseBananeWheyImg,
  ingredients: [
    "Pour le smoothie",
    "150 g de fraises",
    "1 banane",
    "250 ml d'eau de coco",
    "1 dose de whey protein gout vanille",
    "Optionnel (pour une texture encore meilleure)",
    "4 a 5 glacons",
  ],
  steps: [
    "1. Preparer les fruits",
    "Coupe les fraises en morceaux.",
    "Coupe la banane en rondelles.",
    "2. Mettre dans le blender",
    "Ajoute dans le blender :",
    "- les fraises",
    "- la banane",
    "- la whey vanille",
    "- l'eau de coco",
    "- les glacons",
    "3. Mixer",
    "Mixe 30 a 40 secondes jusqu'a obtenir une texture lisse et cremeuse.",
    "4. Ajuster la texture",
    "Si le smoothie est trop epais -> ajoute un peu d'eau de coco.",
    "Si tu veux une texture plus milkshake -> ajoute une demi banane congelee.",
    "5. Servir",
    "Verse dans un grand verre ou un shaker.",
    "Ton smoothie est pret.",
    "Valeurs approximatives",
    "(selon whey)",
    "- Proteines : 25-30 g",
    "- Calories : ~300 kcal",
  ],
},
{
  id: "mass-boisson-detox-pomme-celeri-citron",
  title: "Boisson detox pomme, celeri & citron",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: boissonDetoxPommeCeleriCitronImg,
  ingredients: [
    "Pour la boisson detox",
    "1 pomme",
    "2 branches de celeri",
    "1/2 citron",
    "1 petit morceau de gingembre frais (environ 1 cm)",
    "300 ml d'eau froide",
    "Optionnel",
    "4 a 5 glacons",
    "Quelques feuilles de menthe",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Lave la pomme et le celeri.",
    "Coupe la pomme en morceaux (retire les pepins).",
    "Coupe les branches de celeri en morceaux.",
    "Presse le demi citron.",
    "Epluche legerement le gingembre.",
    "2. Mixer la boisson",
    "Mets dans un blender :",
    "- les morceaux de pomme",
    "- le celeri",
    "- le gingembre",
    "- le jus de citron",
    "- 300 ml d'eau",
    "Mixe 30 a 40 secondes jusqu'a obtenir une boisson lisse.",
    "3. Filtrer (optionnel)",
    "Si tu veux une texture plus lisse, filtre avec une passoire fine.",
    "Sinon, bois-la avec la pulpe pour plus de fibres.",
    "4. Servir",
    "Ajoute les glacons.",
    "Melange et bois bien frais.",
    "Ta boisson detox est prete.",
    "Astuces pour qu'elle soit encore meilleure",
    "- utilise une pomme verte pour un gout plus frais",
  ],
},
{
  id: "mass-boisson-detox-orange-carotte-gingembre",
  title: "Boisson detox orange, carotte & gingembre",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: boissonDetoxOrangeCarotteGingembreImg,
  ingredients: [
    "Pour la boisson detox",
    "2 oranges",
    "2 carottes",
    "1 petit morceau de gingembre frais (1 cm)",
    "200 ml d'eau froide",
    "Optionnel",
    "1 cuillere a cafe de miel",
    "Quelques glacons",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Epluche les oranges et coupe-les en morceaux.",
    "Epluche les carottes puis coupe-les en rondelles.",
    "Epluche legerement le gingembre.",
    "2. Mixer la boisson",
    "Mets dans un blender :",
    "- les oranges",
    "- les carottes",
    "- le gingembre",
    "- 200 ml d'eau froide",
    "Mixe 40 secondes jusqu'a obtenir une texture lisse.",
    "3. Filtrer (optionnel)",
    "Passe le melange dans une passoire fine si tu veux un jus plus lisse.",
    "Tu peux aussi garder la pulpe pour plus de fibres.",
    "4. Ajuster le gout",
    "Ajoute le miel si tu veux une boisson plus douce.",
    "Melange bien.",
    "5. Servir",
    "Ajoute les glacons.",
    "Bois bien frais.",
    "Ta boisson detox est prete.",
    "Astuces pour qu'elle soit encore meilleure",
    "- ajoute un peu de jus de citron pour plus de fraicheur",
    "- mets une pincee de curcuma pour un effet encore plus detox",
    "- utilise des carottes bien sucrees pour un gout plus doux.",
  ],
},
{
  id: "mass-eau-detox-concombre-citron-menthe-gingembre",
  title: "Eau detox concombre, citron, citron vert, menthe & gingembre",
  flavor: "boisson",
  prepTime: "10 min + infusion",
  servings: "4 pers",
  image: eauDetoxConcombreCitronVertImg,
  ingredients: [
    "Pour l'eau detox",
    "1/2 concombre",
    "1 citron jaune",
    "1 citron vert",
    "1 petit morceau de gingembre frais (1 a 2 cm)",
    "6 a 8 feuilles de menthe",
    "1 litre d'eau froide",
    "Optionnel",
    "Quelques glacons",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Lave bien le concombre, le citron et le citron vert.",
    "Coupe le concombre en fines rondelles.",
    "Coupe le citron et le citron vert en rondelles.",
    "Coupe le gingembre en fines tranches.",
    "2. Preparer la menthe",
    "Froisse legerement les feuilles de menthe entre les mains.",
    "Cela permet de liberer les aromes.",
    "3. Assembler l'eau detox",
    "Mets dans une carafe ou bouteille :",
    "- les rondelles de concombre",
    "- le citron",
    "- le citron vert",
    "- le gingembre",
    "- la menthe",
    "Verse 1 litre d'eau froide.",
    "4. Repos",
    "Mets la carafe au refrigerateur pendant au moins 1 heure.",
    "Idealement 2 a 4 heures pour que les saveurs se diffusent bien.",
    "5. Servir",
    "Ajoute des glacons si tu veux.",
    "Serre bien frais.",
    "Ton eau detox est prete.",
    "Astuces pour une eau detox incroyable",
    "- laisse infuser toute la nuit au frigo",
    "- ajoute quelques baies ou framboises",
    "- ecrase legerement une tranche de citron pour liberer plus de jus.",
  ],
},
{
  id: "mass-cafe-latte-vanille",
  title: "Cafe latte a la vanille",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: cafeLatteVanilleImg,
  ingredients: [
    "Pour le latte",
    "1 espresso (ou 60 ml de cafe fort)",
    "200 ml de lait",
    "1 cuillere a cafe d'extrait de vanille",
    "Optionnel",
    "1 a 2 cuilleres a cafe de sucre ou de sirop de vanille",
  ],
  steps: [
    "1. Preparer le cafe",
    "Prepare 1 espresso avec une machine espresso ou cafetiere.",
    "Verse-le dans une grande tasse.",
    "2. Chauffer le lait",
    "Verse 180 ml de lait vegetal dans une casserole.",
    "Chauffe doucement jusqu'a environ 60-65C (chaud mais pas bouillant).",
    "3. Faire la mousse",
    "Utilise un mousseur a lait ou un petit fouet.",
    "Fouette le lait 10 a 15 secondes pour creer une mousse legere.",
    "Astuce barista : la mousse doit etre fine et cremeuse (microfoam).",
    "4. Assembler le latte",
    "Verse le lait chaud sur l'espresso.",
    "Ajoute la mousse sur le dessus.",
    "5. Ajouter les toppings",
    "Optionnel :",
    "- une pincee de cannelle",
    "- un peu de cacao",
    "- un filet de sirop d'erable.",
    "Ton cafe latte au lait vegetal est pret.",
    "Astuces pour un latte incroyable",
    "- utilise du lait d'avoine barista",
    "- chauffe le lait sans le faire bouillir",
    "- verse le lait lentement au centre de l'espresso pour une meilleure texture.",
  ],
},
{
  id: "mass-matcha-latte-cremeux",
  title: "Matcha latte cremeux",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: matchaLatteCremeuxImg,
  ingredients: [
    "Pour le matcha latte",
    "1 cuillere a cafe de matcha",
    "60 ml d'eau chaude (pas bouillante)",
    "200 ml de lait",
    "Optionnel",
    "1 a 2 cuilleres a cafe de miel ou de sirop d'erable",
    "1/2 cuillere a cafe d'extrait de vanille",
  ],
  steps: [
    "1. Tamiser le matcha",
    "Mets 1 c. a cafe de matcha dans un bol ou une tasse.",
    "Passe-le dans une petite passoire pour eviter les grumeaux.",
    "2. Ajouter l'eau chaude",
    "Verse 60 ml d'eau chaude (environ 80C).",
    "Fouette avec un fouet a matcha (chasen) ou un petit fouet.",
    "Fouette en mouvement en \"W\" pendant 15 secondes jusqu'a obtenir une mousse legere.",
    "3. Chauffer le lait",
    "Chauffe 180 ml de lait vegetal dans une casserole.",
    "Ne fais pas bouillir (environ 60C).",
    "4. Faire la mousse",
    "Fouette le lait avec un mousseur a lait.",
    "Obtiens une mousse legere et cremeuse.",
    "5. Assembler le latte",
    "Verse le lait chaud dans le matcha fouette.",
    "Ajoute la mousse sur le dessus.",
    "6. Ajouter la touche sucree",
    "Ajoute miel ou sirop d'erable si tu veux.",
    "Melange legerement.",
    "Ton matcha latte cremeux est pret.",
    "Astuces pour le meilleur matcha latte",
    "- utilise du matcha de bonne qualite (matcha ceremonial)",
    "- ne mets jamais de l'eau bouillante",
    "- le lait d'avoine barista donne la mousse la plus cremeuse.",
  ],
},
{
  id: "mass-moka-chocolat-cafe",
  title: "Moka chocolat & cafe",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: mokaChocolatCafeImg,
  ingredients: [
    "Pour le moka",
    "1 espresso (ou 60 ml de cafe fort)",
    "200 ml de lait",
    "1 cuillere a soupe de cacao en poudre ou de chocolat fondu",
    "Optionnel",
    "1 cuillere a cafe de sucre",
    "Un peu de chantilly",
    "Copeaux de chocolat",
  ],
  steps: [
    "1. Preparer le cafe",
    "Prepare 1 espresso avec une machine ou cafetiere.",
    "Verse-le dans une grande tasse.",
    "2. Faire fondre le chocolat",
    "Mets le chocolat dans une petite casserole avec un peu de lait.",
    "Chauffe doucement en melangeant jusqu'a obtenir une base chocolat lisse.",
    "3. Chauffer le lait",
    "Ajoute le reste du lait dans la casserole.",
    "Chauffe jusqu'a ce qu'il soit bien chaud mais pas bouillant.",
    "4. Assembler le moka",
    "Verse le melange chocolat-lait dans la tasse avec l'espresso.",
    "Melange bien.",
    "5. Preparer la chantilly",
    "Fouette la creme liquide avec le sucre glace.",
    "Continue jusqu'a obtenir une chantilly legere.",
    "6. Ajouter la chantilly",
    "Depose la chantilly sur le moka.",
    "Ajoute :",
    "- cacao en poudre",
    "- copeaux de chocolat",
    "- filet de chocolat.",
    "Ton moka chocolat cafe est pret.",
  ],
},
{
  id: "mass-jus-betterave-celeri-pomme",
  title: "Jus sain betterave, celeri & pomme",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: jusSainBetteraveCeleriPommeImg,
  ingredients: [
    "Pour le jus",
    "1 betterave crue (petite)",
    "1 pomme",
    "1 branche de celeri",
    "200 ml d'eau froide",
    "Optionnel",
    "1/2 citron (jus)",
    "1 petit morceau de gingembre",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Epluche la betterave.",
    "Coupe-la en petits morceaux.",
    "Coupe la pomme en morceaux (retire les pepins).",
    "Coupe la branche de celeri.",
    "2. Mixer le jus",
    "Mets dans un blender :",
    "- la betterave",
    "- la pomme",
    "- le celeri",
    "- 200 ml d'eau",
    "Mixe 40 a 60 secondes jusqu'a obtenir une texture lisse.",
    "3. Ajouter les extras",
    "Ajoute le jus de citron.",
    "Ajoute le gingembre si tu veux une boisson plus tonique.",
    "4. Filtrer (optionnel)",
    "Passe le jus dans une passoire fine si tu veux une texture plus lisse.",
    "Tu peux aussi garder la pulpe pour plus de fibres.",
    "5. Servir",
    "Verse dans un verre.",
    "Bois bien frais.",
    "Ton jus betterave pomme celeri est pret.",
    "Astuces pour un jus incroyable",
    "- utilise une pomme verte pour plus de fraicheur",
    "- ajoute quelques glacons.",
  ],
},
{
  id: "mass-smoothie-avocat-banane-amandes",
  title: "Smoothie sain avocat, banane & amandes",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: smoothieSainAvocatBananeAmandesImg,
  ingredients: [
    "Pour le smoothie",
    "1/2 avocat",
    "1 banane",
    "250 ml de lait",
    "20 g d'amandes",
    "Optionnel",
    "1 cuillere a cafe de miel",
    "3 a 4 glacons",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Coupe l'avocat et recupere la chair.",
    "Coupe la banane en rondelles.",
    "2. Mettre dans le blender",
    "Ajoute dans le blender :",
    "- l'avocat",
    "- la banane",
    "- les amandes",
    "- le lait",
    "- les glacons",
    "- le miel (optionnel)",
    "3. Mixer",
    "Mixe 40 secondes jusqu'a obtenir une texture tres lisse et cremeuse.",
    "4. Ajuster la texture",
    "Si le smoothie est trop epais -> ajoute un peu de lait.",
    "Si tu veux une texture plus milkshake -> ajoute plus de glacons.",
    "5. Servir",
    "Verse dans un grand verre et bois immediatement.",
    "Ton smoothie avocat banane amandes est pret.",
  ],
},
{
  id: "mass-boisson-epinard-pomme-concombre",
  title: "Boisson saine epinard, pomme & concombre",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: boissonSaineEpinardPommeConcombreImg,
  ingredients: [
    "Pour la boisson",
    "1 poignee d'epinards frais",
    "1 pomme",
    "1/2 concombre",
    "250 ml d'eau froide",
    "Optionnel",
    "1/2 citron (jus)",
    "1 petit morceau de gingembre",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Lave bien les epinards.",
    "Coupe la pomme en morceaux (retire les pepins).",
    "Coupe le concombre en rondelles.",
    "2. Mixer",
    "Mets dans un blender :",
    "- les epinards",
    "- la pomme",
    "- le concombre",
    "- 200 ml d'eau",
    "Mixe 40 secondes jusqu'a obtenir une texture lisse.",
    "3. Ajouter les extras",
    "Ajoute le jus de citron et le gingembre si tu veux plus de gout.",
    "Mixe encore 5 secondes.",
    "4. Servir",
    "Ajoute les glacons.",
    "Bois bien frais.",
    "Ta boisson saine est prete.",
    "Astuces pour la rendre incroyable",
    "- utilise une pomme verte pour un gout plus frais",
    "- ajoute quelques feuilles de menthe",
    "- mets un peu de jus de citron vert pour relever le gout.",
  ],
},
{
  id: "mass-eau-infusee-pamplemousse-romarin",
  title: "Eau infusee pamplemousse & romarin",
  flavor: "boisson",
  prepTime: "10 min + infusion",
  servings: "4 pers",
  image: eauInfuseePamplemousseRomarinImg,
  ingredients: [
    "Pour l'eau infusee",
    "1/2 pamplemousse",
    "1 branche de romarin frais",
    "1 litre d'eau froide",
    "Optionnel",
    "Quelques glacons",
    "1 cuillere a cafe de miel",
  ],
  steps: [
    "1. Preparer le pamplemousse",
    "Lave le pamplemousse.",
    "Coupe-le en fines rondelles.",
    "2. Preparer le romarin",
    "Rince la branche de romarin.",
    "Froisse-la legerement entre les doigts pour liberer les aromes.",
    "3. Assembler l'eau infusee",
    "Mets dans une carafe :",
    "- les rondelles de pamplemousse",
    "- la branche de romarin",
    "Verse 1 litre d'eau froide.",
    "4. Infusion",
    "Mets la carafe au refrigerateur pendant 1 a 2 heures.",
    "Pour un gout plus intense, laisse infuser toute la nuit.",
    "5. Servir",
    "Ajoute quelques glacons.",
    "Serre bien frais.",
    "Ton eau infusee pamplemousse romarin est prete.",
    "Astuces pour une eau infusee incroyable",
    "- ajoute quelques framboises ou fraises",
    "- mets un peu de zeste de pamplemousse",
    "- ecrase legerement une tranche de pamplemousse pour liberer plus de jus.",
  ],
},
{
  id: "mass-eau-infusee-myrtilles-orange-menthe",
  title: "Eau infusee myrtilles, orange & menthe",
  flavor: "boisson",
  prepTime: "10 min + infusion",
  servings: "4 pers",
  image: eauInfuseeMyrtillesOrangeMentheImg,
  ingredients: [
    "Pour l'eau infusee",
    "80 g de myrtilles",
    "1 orange",
    "6 a 8 feuilles de menthe",
    "1 litre d'eau froide",
    "Optionnel",
    "Quelques glacons",
    "1 cuillere a cafe de miel",
  ],
  steps: [
    "1. Preparer les fruits",
    "Lave les myrtilles.",
    "Coupe l'orange en fines rondelles.",
    "2. Preparer la menthe",
    "Rince les feuilles de menthe.",
    "Froisse-les legerement entre les doigts pour liberer les aromes.",
    "3. Assembler l'eau infusee",
    "Mets dans une carafe :",
    "- les myrtilles",
    "- les rondelles d'orange",
    "- les feuilles de menthe",
    "Verse 1 litre d'eau froide.",
    "4. Infusion",
    "Mets au refrigerateur pendant 1 a 2 heures.",
    "Pour plus de gout, laisse infuser 3 a 4 heures.",
    "5. Servir",
    "Ajoute quelques glacons.",
    "Serre bien frais.",
    "Ton eau infusee myrtilles orange menthe est prete.",
    "Astuces pour une eau infusee incroyable",
    "- ecrase legerement quelques myrtilles pour liberer le jus",
    "- ajoute un peu de citron vert",
    "- laisse infuser toute la nuit pour une saveur plus intense.",
  ],
},
{
  id: "mass-eau-infusee-fraise-citron-menthe",
  title: "Eau infusee fraise, citron jaune & menthe",
  flavor: "boisson",
  prepTime: "10 min + infusion",
  servings: "4 pers",
  image: eauInfuseeFraiseCitronJauneMentheImg,
  ingredients: [
    "Pour l'eau infusee",
    "150 g de fraises",
    "1 citron jaune",
    "6 a 8 feuilles de menthe",
    "1 litre d'eau froide",
    "Optionnel",
    "Quelques glacons",
    "1 cuillere a cafe de miel",
  ],
  steps: [
    "1. Preparer les fruits",
    "Lave les fraises.",
    "Coupe-les en deux ou en rondelles.",
    "Coupe le citron en fines rondelles.",
    "2. Preparer la menthe",
    "Rince les feuilles de menthe.",
    "Froisse-les legerement entre les mains pour liberer les aromes.",
    "3. Assembler l'eau infusee",
    "Mets dans une carafe :",
    "- les fraises",
    "- le citron",
    "- la menthe",
    "Verse 1 litre d'eau froide.",
    "4. Infusion",
    "Mets la carafe au refrigerateur pendant 1 a 2 heures.",
    "Pour plus de gout, laisse infuser 3 a 4 heures.",
    "5. Servir",
    "Ajoute quelques glacons.",
    "Serre bien frais.",
    "Ton eau infusee fraise citron menthe est prete.",
    "Astuces pour la rendre encore meilleure",
    "- ecrase legerement quelques fraises pour liberer le jus",
    "- ajoute un peu de citron vert",
    "- mets quelques framboises pour plus de gout.",
  ],
},
{
  id: "mass-boisson-avoine-cacahuete-amande",
  title: "Boisson avoine, beurre de cacahuete & lait d'amande",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: boissonAvoineCacahueteLaitAmandeImg,
  ingredients: [
    "Pour la boisson",
    "30 g de flocons d'avoine",
    "1 cuillere a soupe de beurre de cacahuete",
    "250 ml de lait d'amande",
    "1 cuillere a cafe de miel",
    "Optionnel",
    "3 a 4 glacons",
    "1/2 banane pour une texture plus cremeuse",
  ],
  steps: [
    "1. Ramollir l'avoine (astuce texture)",
    "Mets les flocons d'avoine dans un bol.",
    "Ajoute un peu de lait d'amande et laisse reposer 2 minutes.",
    "Cela rend la boisson beaucoup plus lisse.",
    "2. Mixer",
    "Mets dans un blender :",
    "- les flocons d'avoine",
    "- le beurre de cacahuete",
    "- le lait d'amande",
    "- le miel",
    "- les glacons",
    "Mix pendant 30 a 40 secondes jusqu'a obtenir une texture cremeuse.",
    "3. Ajuster la texture",
    "Si la boisson est trop epaisse -> ajoute un peu de lait d'amande.",
    "Si tu la veux plus epaisse -> ajoute quelques glacons.",
    "4. Servir",
    "Verse dans un grand verre et melange legerement.",
    "Ta boisson avoine beurre de cacahuete est prete.",
  ],
},
{
  id: "mass-pates-cremeuses",
  title: "Alfredo pasta protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©",
  flavor: "sale",
  prepTime: "20 min",
  servings: "1 pers",
  image: alfredoPastaImg,
  ingredients: [
    "80 g de pates (idealement pates proteinees ou completes)",
    "120 g de blanc de poulet",
    "1 gousse d'ail",
    "40 g de parmesan rape",
    "2 c. a soupe de yaourt grec",
    "60 ml d'eau de cuisson des pates",
    "1 c. a cafe d'huile d'olive",
    "Poivre noir",
    "(Optionnel mais tres bon) persil",
  ],
  steps: [
    "1. Cuire les pates",
    "Porter a ebullition",
    "Remplis une casserole d'eau, ajoute une bonne pincee de sel et porte a ebullition.",
    "Cuire les pates",
    "Ajoute les pates dans l'eau bouillante.",
    "Laisse cuire 8 a 10 minutes, selon le type de pates.",
    "Elles doivent etre al dente : tendres mais encore legerement fermes.",
    "Reserver l'eau de cuisson",
    "Avant d'egoutter, preleve environ 60 ml d'eau de cuisson.",
    "Cette eau riche en amidon est essentielle pour la sauce.",
    "2. Cuire le poulet",
    "Preparer et cuire",
    "Coupe le poulet en petits morceaux.",
    "Fais chauffer l'huile d'olive dans une poele, puis ajoute le poulet.",
    "Laisse cuire 6 a 7 minutes, en remuant de temps en temps.",
    "Assaisonner",
    "Ajoute du poivre noir en fin de cuisson.",
    "Le poulet doit etre bien dore et cuit a coeur.",
    "3. Faire la base de sauce",
    "Parfumer",
    "Ajoute l'ail hache dans la poele avec le poulet.",
    "Laisse cuire environ 30 secondes.",
    "L'ail doit juste devenir parfume sans bruler.",
    "4. Faire la sauce Alfredo proteinee",
    "Creer la base",
    "Ajoute l'eau de cuisson et le parmesan dans la poele.",
    "Melange jusqu'a ce que le fromage fonde.",
    "Rendre la sauce cremeuse",
    "Ajoute le yaourt grec et melange.",
    "La sauce devient onctueuse grace a l'amidon et au parmesan.",
    "5. Ajouter les pates",
    "Incorporer les pates",
    "Ajoute les pates egouttees dans la poele.",
    "Melanger",
    "Remue pendant 1 a 2 minutes a feu doux.",
    "6. Servir",
    "Servir",
    "Depose les pates dans une assiette.",
    "Finaliser",
    "Ajoute du parmesan supplementaire, du poivre noir et un peu de persil.",
    "Tes Alfredo pasta proteinees sont pretes.",
  ],
},
{
  id: "mass-pates-pesto-poulet",
  title: "Pates pesto, poulet, parmesan & tomates cerises",
  flavor: "sale",
  prepTime: "20 a 25 min",
  servings: "1 pers",
  image: patesPestoPouletParmesanImg,
  ingredients: [
    "80 g de pates (penne, fusilli ou farfalle)",
    "120 g de blanc de poulet",
    "80 g de tomates cerises",
    "2 c. a soupe de pesto",
    "20 g de parmesan rape",
    "1 gousse d'ail",
    "1 c. a cafe d'huile d'olive",
    "poivre noir",
    "(optionnel mais excellent) quelques feuilles de basilic",
  ],
  steps: [
    "1. Cuire les pates",
    "Porter l'eau a ebullition",
    "Remplis une casserole d'eau et ajoute une bonne pincee de sel.",
    "Porte a ebullition a feu vif.",
    "Cuire les pates",
    "Ajoute les pates dans l'eau bouillante.",
    "Melange legerement au debut pour eviter qu'elles ne collent.",
    "Laisse cuire 8 a 10 minutes, selon le temps indique sur le paquet.",
    "Les pates doivent etre al dente : tendres mais encore legerement fermes.",
    "Reserver un peu d'eau de cuisson",
    "Avant d'egoutter, preleve environ 2 cuilleres a soupe d'eau de cuisson.",
    "Cette eau riche en amidon est ideale pour lier une sauce.",
    "Egoutter",
    "Egoutte les pates dans une passoire, sans les rincer.",
    "2. Cuire le poulet",
    "Preparer le poulet",
    "Coupe le poulet en petits morceaux de taille reguliere.",
    "Cela permet une cuisson homogene.",
    "Chauffer la poele",
    "Fais chauffer une poele a feu moyen.",
    "Ajoute l'huile d'olive et laisse chauffer quelques secondes.",
    "Cuire le poulet",
    "Ajoute l'ail hache, puis le poulet.",
    "Melange legerement pour bien repartir.",
    "Laisse cuire 6 a 7 minutes, en remuant de temps en temps.",
    "Le poulet doit etre bien dore et cuit a coeur.",
    "3. Cuire les tomates",
    "Ajouter les tomates",
    "Coupe les tomates cerises en deux.",
    "Ajoute-les directement dans la poele avec le poulet.",
    "Cuire legerement",
    "Fais cuire environ 2 minutes a feu moyen.",
    "Les tomates doivent devenir legerement fondantes tout en gardant leur forme.",
    "4. Melanger les pates et le pesto",
    "Ajouter les pates",
    "Verse les pates egouttees directement dans la poele avec la preparation.",
    "Incorporer la sauce",
    "Ajoute le pesto ainsi qu'un petit filet d'eau de cuisson reservee.",
    "Melanger",
    "Melange pendant environ 1 minute a feu doux.",
    "Les pates doivent etre bien enrobees de sauce.",
    "5. Ajouter le parmesan",
    "Incorporer le fromage",
    "Ajoute le parmesan rape directement dans la poele.",
    "Melanger",
    "Remue jusqu'a ce que le fromage fonde legerement.",
    "6. Servir",
    "Servir",
    "Depose les pates dans une assiette ou un bol.",
    "Finaliser",
    "Ajoute un peu de parmesan supplementaire, du poivre noir et quelques feuilles de basilic frais.",
    "Tes pates pesto poulet tomates cerises sont pretes.",
    "Astuces pour que la recette soit vraiment incroyable (niveau restaurant)",
    "- ajoute quelques pignons de pin grilles",
    "- mets un peu de zeste de citron dans le pesto",
    "- garde toujours un peu d'eau de cuisson des pates pour rendre la sauce plus onctueuse.",
  ],
},
{
  id: "mass-salade-burrata-jambon",
  title: "Salade burrata, jambon sec, tomates cerises & basilic",
  flavor: "sale",
  prepTime: "10 min",
  servings: "1 pers",
  image: saladeBurrataJambonSecImg,
  ingredients: [
    "1 burrata (environ 100-125 g)",
    "40 g de jambon sec (type prosciutto ou jambon cru)",
    "1 poignee de melange de salade",
    "120 g de tomates cerises",
    "Quelques feuilles de basilic",
    "Vinaigrette",
    "1 c. a soupe d'huile d'olive",
    "1 c. a cafe de vinaigre balsamique",
    "1/2 c. a cafe de moutarde",
    "1/2 c. a cafe de miel",
    "Poivre noir",
  ],
  steps: [
    "1. Preparer les legumes",
    "Preparer les tomates",
    "Lave les tomates cerises, puis coupe-les en deux.",
    "Assembler",
    "Place-les dans un saladier avec le melange de salade.",
    "2. Preparer la vinaigrette",
    "Melanger",
    "Dans un petit bol, ajoute :",
    "l'huile d'olive",
    "le vinaigre balsamique",
    "la moutarde",
    "le miel",
    "le poivre",
    "Fouette energiquement jusqu'a obtenir une vinaigrette homogene.",
    "Elle doit etre legerement cremeuse et bien liee.",
    "3. Assaisonner la salade",
    "Ajouter la vinaigrette",
    "Verse environ la moitie de la vinaigrette sur la salade et les tomates.",
    "Melanger",
    "Melange delicatement pour bien enrober les feuilles sans les abimer.",
    "4. Monter l'assiette",
    "Disposer la salade",
    "Place la salade dans une assiette ou un plat.",
    "Ajouter la burrata",
    "Depose la burrata entiere au centre.",
    "Ajouter le jambon",
    "Dispose les tranches de jambon sec autour.",
    "5. Ajouter les finitions",
    "Ajouter les herbes",
    "Ajoute quelques feuilles de basilic frais.",
    "Assaisonner",
    "Verse le reste de vinaigrette sur la burrata.",
    "Ajoute un peu de poivre noir.",
    "La burrata absorbe la vinaigrette et devient encore plus savoureuse.",
    "Ta salade burrata est prete.",
  ],
},
{
  id: "mass-focaccia-burrata-mortadelle",
  title: "Focaccia garnie burrata, mortadelle & roquette",
  flavor: "sale",
  prepTime: "10 a 15 min",
  servings: "1 pers",
  image: focacciaBurrataMortadelleRoquetteImg,
  ingredients: [
    "1 morceau de focaccia (environ 120 g)",
    "60-80 g de mortadelle tranchee fine",
    "1 petite burrata (80-100 g)",
    "1 poignee de roquette",
    "1 c. a cafe d'huile d'olive extra vierge",
    "poivre noir",
    "Optionnel mais excellent :",
    "1 c. a cafe de pesto",
    "quelques pistaches concassees",
    "un filet de creme balsamique",
  ],
  steps: [
    "1. Toaster la focaccia",
    "Coupe la focaccia en deux dans l'epaisseur.",
    "Fais-la chauffer 2 a 3 minutes dans une poele ou au four.",
    "Elle doit etre legerement croustillante a l'exterieur tout en restant moelleuse a l'interieur.",
    "2. Ajouter la mortadelle",
    "Dispose les tranches de mortadelle sur la base du pain.",
    "Plie-les legerement au lieu de les poser a plat.",
    "Cela apporte plus de volume et une texture plus agreable en bouche.",
    "3. Ajouter la burrata",
    "Depose la burrata par-dessus la mortadelle.",
    "Ouvre-la delicatement avec les mains ou une cuillere.",
    "Etale legerement le coeur cremeux sur toute la surface.",
    "C'est ce qui rend le sandwich fondant et gourmand.",
    "4. Ajouter la roquette",
    "Ajoute une bonne poignee de roquette.",
    "Arrose avec un filet d'huile d'olive et ajoute un peu de poivre noir.",
    "La roquette apporte une touche de fraicheur et un leger cote poivre.",
    "5. Refermer et servir",
    "Referme la focaccia en pressant legerement.",
    "Coupe le sandwich en deux pour un service plus pratique.",
    "Astuce pour que ce soit vraiment incroyable (niveau sandwich italien)",
    "- ajoute un peu de pesto sur le pain",
    "- mets quelques pistaches concassees pour le croquant",
    "- laisse la burrata a temperature ambiante 10 min avant de la mettre.",
  ],
},
{
  id: "mass-quinoa-bowl",
  title: "Butter chicken protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©, riz et brocolis",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  35 min",
  servings: "1 pers",
  image: butterChickenImg,
  ingredients: [
    "Base",
    "80 g de riz basmati cru",
    "160 ml d'eau",
    "120 g de brocolis",
    "Poulet marine",
    "150 g de blanc de poulet",
    "2 c. a soupe de yaourt grec",
    "1 c. a cafe de paprika",
    "1/2 c. a cafe de curry",
    "1/2 c. a cafe de cumin",
    "1/2 c. a cafe de garam masala",
    "1 gousse d'ail rapee",
    "1 c. a cafe de jus de citron",
    "sel et poivre",
    "Sauce butter chicken",
    "200 g de tomates concassees",
    "50 ml de lait de coco leger",
    "1 c. a cafe de beurre ou huile",
    "1/2 c. a cafe de garam masala",
    "1/2 c. a cafe de paprika",
    "sel",
  ],
  steps: [
    "1. Mariner le poulet",
    "Preparer le poulet",
    "Decoupe le poulet en morceaux de taille reguliere.",
    "Cela permet une cuisson homogene et une meilleure absorption de la marinade.",
    "Preparer la marinade",
    "Dans un bol, ajoute :",
    "le yaourt grec",
    "les epices (paprika, curry, cumin, garam masala)",
    "l'ail",
    "le jus de citron",
    "Melange bien jusqu'a obtenir une texture homogene.",
    "Enrober le poulet",
    "Ajoute les morceaux de poulet dans le bol.",
    "Melange soigneusement pour bien les enrober de marinade.",
    "Chaque morceau doit etre entierement recouvert pour un maximum de gout.",
    "Laisser mariner",
    "Couvre le bol et laisse reposer 10 a 15 minutes.",
    "Si tu as plus de temps, tu peux laisser mariner plus longtemps pour des saveurs encore plus intenses.",
    "2. Cuire le riz",
    "Rincer le riz",
    "Place le riz dans une passoire fine et rince-le sous l'eau froide pendant quelques secondes.",
    "Cela permet d'enlever l'exces d'amidon et d'obtenir un riz moins collant.",
    "Mettre en cuisson",
    "Verse le riz rince dans une casserole, puis ajoute les 160 ml d'eau.",
    "Melange legerement pour bien repartir les grains.",
    "Porter a ebullition",
    "Fais chauffer a feu moyen jusqu'a ce que l'eau arrive a ebullition.",
    "Cuire a feu doux",
    "Des que l'eau bout, couvre la casserole et baisse le feu.",
    "Laisse cuire a feu doux pendant 12 minutes, sans soulever le couvercle.",
    "Laisser reposer",
    "Retire la casserole du feu et laisse reposer 5 minutes, toujours couverte.",
    "Cette etape permet au riz de finir d'absorber l'humidite.",
    "Aerer le riz",
    "A l'aide d'une fourchette, melange delicatement pour separer les grains.",
    "3. Cuire les brocolis",
    "Preparer les brocolis",
    "Rince le brocoli sous l'eau froide.",
    "Decoupe-le en petits bouquets de taille similaire.",
    "Cela permet une cuisson uniforme.",
    "Cuire a l'eau",
    "Porte une casserole d'eau a ebullition.",
    "Tu peux ajouter une pincee de sel si tu le souhaites.",
    "Plonge les brocolis dans l'eau bouillante et laisse cuire 4 a 5 minutes.",
    "Ils doivent rester legerement fermes et bien verts.",
    "Egoutter",
    "Egoutte immediatement les brocolis dans une passoire.",
    "Pour conserver leur couleur vive, tu peux les passer rapidement sous l'eau froide (optionnel).",
    "4. Cuire le poulet",
    "Chauffer la poele",
    "Fais chauffer une poele a feu moyen.",
    "Ajoute un peu de beurre ou d'huile et laisse fondre / chauffer quelques secondes.",
    "Depose les morceaux de poulet marines dans la poele.",
    "Repartis-les bien pour eviter qu'ils ne se chevauchent.",
    "Laisse cuire environ 6 a 7 minutes, en remuant de temps en temps.",
    "Le poulet doit etre bien dore a l'exterieur.",
    "Verifier la cuisson",
    "Assure-toi que le poulet est bien cuit a coeur, l'interieur ne doit plus etre rose.",
    "5. Faire la sauce",
    "Ajouter les ingredients",
    "Dans la poele (idealement apres cuisson du poulet), ajoute :",
    "les tomates concassees",
    "le lait de coco",
    "le paprika",
    "le garam masala",
    "Melange legerement des le debut pour bien repartir les saveurs.",
    "Melanger et chauffer",
    "Remue doucement pour obtenir une sauce homogene.",
    "Laisse chauffer a feu moyen jusqu'a ce que le melange commence a fremir.",
    "Laisser mijoter",
    "Baisse legerement le feu et laisse mijoter pendant 8 a 10 minutes.",
    "Remue de temps en temps pour eviter que la sauce n'accroche.",
    "La sauce va progressivement epaissir et developper ses aromes.",
    "Ajuster la texture",
    "Si la sauce te semble trop liquide, prolonge legerement la cuisson.",
    "A l'inverse, tu peux ajouter un petit filet d'eau ou de lait de coco si elle epaissit trop.",
    "6. Servir",
    "Disposer le riz",
    "Depose le riz chaud dans un bol ou une assiette creuse.",
    "Ajouter le butter chicken",
    "Verse le butter chicken par-dessus ou a cote du riz, selon ta preference.",
    "N'hesite pas a ajouter un peu de sauce pour bien napper le riz.",
    "Ajouter les brocolis",
    "Dispose les brocolis a cote.",
    "Il ne reste plus qu'a savourer, bon appetit !",
    "Astuces pour que la recette soit vraiment incroyable",
    "- ajoute un peu de coriandre fraiche",
    "- mets une noix de beurre a la fin dans la sauce",
    "- laisse mijoter 5 minutes de plus pour intensifier les saveurs.",
  ],
},

{
  id: "mass-patate-bowl",
  title: "Avocado toast",
  flavor: "sale",
  prepTime: "10 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  12 min",
  servings: "1 pers",
  image: avocadoToastImg,
  ingredients: [
    "1 tranche de pain (idealement pain complet ou levain)",
    "1/2 avocat",
    "1 oeuf",
    "1 c. a cafe de jus de citron",
    "1 c. a cafe d'huile d'olive",
    "sel et poivre",
    "Optionnel mais tres bon :",
    "flocons de piment",
    "graines de sesame",
    "ciboulette ou persil",
  ],
  steps: [
    "1. Griller le pain",
    "Place la tranche de pain au grille-pain ou dans une poele.",
    "Fais-la griller 2 a 3 minutes jusqu'a ce qu'elle soit bien croustillante.",
    "L'exterieur doit etre dore, tout en gardant un peu de moelleux a l'interieur.",
    "2. Preparer l'avocat",
    "Dans un bol, ecrase le demi-avocat a l'aide d'une fourchette.",
    "Ajoute :",
    "un filet de jus de citron",
    "une pincee de sel",
    "un peu de poivre",
    "Melange jusqu'a obtenir une texture cremeuse.",
    "Le citron apporte de la fraicheur et evite a l'avocat de noircir.",
    "3. Faire l'oeuf poche",
    "Porte une casserole d'eau a fremissement (sans forte ebullition).",
    "Ajoute une cuillere a cafe de vinaigre (optionnel).",
    "Casse l'oeuf dans un petit bol.",
    "A l'aide d'une cuillere, cree un leger tourbillon dans l'eau, puis verse delicatement l'oeuf au centre.",
    "Laisse cuire 2 min 30 a 3 minutes.",
    "Le blanc doit etre pris, tandis que le jaune reste coulant.",
    "4. Monter l'avocado toast",
    "Etale l'avocat ecrase sur le pain grille.",
    "Depose delicatement l'oeuf poche par-dessus.",
    "5. Ajouter les finitions",
    "Verse un filet d'huile d'olive.",
    "Ajoute du poivre noir.",
    "Tu peux aussi ajouter, selon tes envies :",
    "des flocons de piment",
    "des graines",
    "des herbes fraiches",
    "Ton avocado toast est pret.",
    "Astuces pour qu'il soit vraiment incroyable (comme au brunch)",
    "- utilise du pain au levain bien grille",
    "- ajoute un peu de zeste de citron sur l'avocat",
    "- mets une pincee de flocons de piment pour relever le gout.",
  ],
},
{
  id: "mass-curry-coco",
  title: "Curry coco pois chiches",
  flavor: "sale",
  prepTime: "25 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  30 min",
  servings: "2 pers",
  image: curryPoischicheImg,
  ingredients: [
    "1 boite de pois chiches (400 g, egouttes)",
    "1 oignon jaune",
    "2 gousses d'ail",
    "1 c. a cafe de gingembre rape",
    "200 g de tomates concassees",
    "200 ml de lait de coco",
    "1 c. a soupe d'huile d'olive ou huile de coco",
    "Epices",
    "1 c. a cafe de curry en poudre",
    "1/2 c. a cafe de cumin",
    "1/2 c. a cafe de paprika",
    "1/2 c. a cafe de curcuma",
    "1/2 c. a cafe de garam masala",
    "sel et poivre",
    "Finition",
    "jus de citron ou citron vert",
    "coriandre fraiche (optionnel)",
  ],
  steps: [
    "1. Faire revenir la base aromatique",
    "Fais chauffer 1 c. a soupe d'huile dans une grande poele a feu moyen.",
    "Ajoute l'oignon hache et fais-le revenir environ 5 minutes, jusqu'a ce qu'il devienne tendre et legerement translucide.",
    "Ajoute ensuite l'ail et le gingembre, puis laisse cuire 1 minute.",
    "Cette base apporte toute la profondeur de gout au curry.",
    "2. Ajouter les epices",
    "Ajoute :",
    "- curry",
    "- cumin",
    "- paprika",
    "- curcuma",
    "Melange pendant 30 secondes.",
    "Cela permet de liberer les aromes des epices.",
    "3. Preparer la sauce",
    "Ajoute les tomates concassees et laisse cuire environ 3 minutes.",
    "Verse ensuite le lait de coco et melange bien.",
    "La sauce doit devenir homogene et legerement onctueuse.",
    "4. Ajouter les pois chiches",
    "Ajoute les pois chiches egouttes dans la sauce.",
    "Melange, puis laisse mijoter a feu doux pendant 10 a 12 minutes.",
    "Si la sauce devient trop epaisse, ajoute un petit peu d'eau pour ajuster la texture.",
    "5. Finaliser",
    "Ajoute le garam masala en fin de cuisson.",
    "Presse un peu de citron (ou citron vert), puis ajuste avec du sel et du poivre.",
    "Le citron apporte une touche de fraicheur qui equilibre les epices.",
    "6. Servir",
    "Sers le curry bien chaud, accompagne de :",
    "- riz basmati",
    "- naan",
    "- ou quinoa",
    "Ton curry de pois chiches est pret.",
  ],
},
{
  id: "mass-houmous-maison",
  title: "Houmous maison ultra cremeux",
  flavor: "sale",
  prepTime: "15 min",
  servings: "2 pers",
  image: houmousMaisonUltraCremeuxImg,
  ingredients: [
    "Pour le houmous",
    "400 g de pois chiches cuits (1 bocal)",
    "2 cuilleres a soupe de tahini",
    "2 cuilleres a soupe de huile d'olive",
    "1 citron (jus)",
    "1 petite gousse d'ail",
    "3 a 4 cuilleres a soupe d'eau froide",
    "Sel",
    "Poivre",
    "Pour la garniture",
    "1 filet d'huile d'olive",
    "1 pincee de paprika",
    "Quelques feuilles de persil",
  ],
  steps: [
    "1. Preparer les pois chiches",
    "Egoutte les pois chiches.",
    "Si tu veux un houmous tres lisse, retire la peau des pois chiches (optionnel mais recommande).",
    "2. Mixer la base",
    "Dans un blender ou robot ajoute :",
    "- pois chiches",
    "- tahini",
    "- jus de citron",
    "- ail",
    "- sel",
    "Mix pendant 30 secondes.",
    "3. Ajouter l'eau",
    "Ajoute 3 a 5 c. a soupe d'eau froide petit a petit.",
    "Mixe 1 a 2 minutes jusqu'a obtenir une texture tres lisse et cremeuse.",
    "L'eau froide aide a rendre le houmous plus leger et mousseux.",
    "4. Ajuster l'assaisonnement",
    "Goute et ajoute :",
    "- un peu de citron",
    "- un peu de sel",
    "- un filet d'huile d'olive.",
    "5. Servir",
    "Etale le houmous dans un bol.",
    "Ajoute :",
    "- un filet d'huile d'olive",
    "- du paprika",
    "- du persil.",
    "Ton houmous est pret.",
    "Secrets pour le meilleur houmous",
    "- mixer longtemps pour une texture tres lisse",
    "- ajouter de l'eau glacee pour une texture ultra cremeuse.",
  ],
},
{
  id: "mass-tzatziki",
  title: "Tzatziki",
  flavor: "sale",
  prepTime: "40 min",
  servings: "2 pers",
  image: tzatzikiImg,
  ingredients: [
    "Pour le tzatziki",
    "1 concombre",
    "200 g de yaourt grec",
    "1 petite gousse d'ail",
    "1 cuillere a soupe d'huile d'olive",
    "1 cuillere a soupe d'aneth ou de menthe",
    "1 cuillere a cafe de citron ou de vinaigre",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Preparer le concombre",
    "Rape le concombre.",
    "Presse-le dans un torchon ou avec les mains pour retirer un maximum d'eau.",
    "C'est essentiel pour eviter un tzatziki trop liquide.",
    "2. Preparer la base",
    "Dans un bol ajoute :",
    "- le yaourt grec",
    "- l'ail finement hache",
    "- le jus de citron",
    "- l'huile d'olive",
    "Melange bien.",
    "3. Ajouter le concombre",
    "Incorpore le concombre rape et bien egoutte.",
    "Ajoute l'aneth.",
    "4. Assaisonner",
    "Ajoute sel et poivre.",
    "Melange bien.",
    "5. Repos",
    "Mets le tzatziki au refrigerateur 30 minutes.",
    "Cela permet aux saveurs de bien se developper.",
    "6. Servir",
    "Verse dans un bol.",
    "Ajoute un filet d'huile d'olive et un peu d'aneth.",
    "Ton tzatziki est pret.",
    "Astuces pour un tzatziki incroyable",
    "- utiliser un yaourt grec tres epais",
    "- bien presser le concombre.",
  ],
},
{
  id: "mass-sauce-vierge",
  title: "Sauce vierge",
  flavor: "sale",
  prepTime: "15 min",
  servings: "2 pers",
  image: sauceViergeImg,
  ingredients: [
    "Pour la sauce vierge",
    "2 tomates",
    "3 cuilleres a soupe d'huile d'olive",
    "1/2 citron (jus)",
    "1 cuillere a soupe de basilic frais",
    "1 cuillere a soupe de persil",
    "1 petite echalote",
    "Sel",
    "Poivre",
    "Optionnel",
    "1 cuillere a soupe de capres",
  ],
  steps: [
    "1. Preparer les tomates",
    "Coupe les tomates en petits des.",
    "Si tu veux une sauce plus fine, retire les graines.",
    "2. Couper les aromates",
    "Emince tres finement l'echalote.",
    "Hache le basilic et le persil.",
    "3. Melanger la sauce",
    "Dans un bol melange :",
    "- les tomates",
    "- l'echalote",
    "- les herbes",
    "- les capres",
    "4. Ajouter l'assaisonnement",
    "Ajoute l'huile d'olive.",
    "Ajoute le jus de citron.",
    "Assaisonne avec sel et poivre.",
    "5. Repos",
    "Laisse reposer 10 minutes a temperature ambiante pour que les saveurs se melangent.",
    "Ta sauce vierge est prete.",
  ],
},
{
  id: "mass-vinaigrette-miel-moutarde-balsamique",
  title: "Vinaigrette miel, moutarde & balsamique",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: vinaigretteMielMoutardeBalsamiqueImg,
  ingredients: [
    "Pour la vinaigrette",
    "1 cuillere a soupe de moutarde",
    "1 cuillere a soupe de miel",
    "2 cuilleres a soupe de vinaigre balsamique",
    "4 cuilleres a soupe d'huile d'olive",
    "1 petite echalote",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Preparer l'echalote",
    "Epluche l'echalote.",
    "Coupe-la tres finement.",
    "2. Melanger la base",
    "Dans un bol ajoute :",
    "- la moutarde",
    "- le miel",
    "- le vinaigre balsamique",
    "Melange bien avec un fouet.",
    "3. Ajouter l'huile",
    "Verse l'huile d'olive progressivement en fouettant.",
    "Cela permet de creer une vinaigrette bien emulsionnee et legerement cremeuse.",
    "4. Ajouter l'echalote",
    "Incorpore l'echalote emincee.",
    "Ajoute sel et poivre.",
    "5. Repos",
    "Laisse reposer 5 minutes pour que l'echalote parfume la vinaigrette.",
    "Ta vinaigrette miel moutarde balsamique est prete.",
  ],
},
{
  id: "mass-sauce-tahini-cremeuse",
  title: "Sauce tahini cremeuse",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: sauceTahiniCremeuseImg,
  ingredients: [
    "Pour la sauce",
    "4 cuilleres a soupe de tahini (puree de sesame)",
    "4 cuilleres a soupe d'eau",
    "1 cuillere a cafe de miel liquide",
    "1 cuillere a soupe de sauce soja ou tamari (idealement allege en sel)",
    "1 cuillere a soupe de jus de citron",
    "1 gousse d'ail emincee",
  ],
  steps: [
    "1. Griller les graines de sesame",
    "Mets les graines de sesame dans une poele seche.",
    "Fais-les griller 3 a 4 minutes a feu moyen en remuant.",
    "Elles doivent etre legerement dorees et parfumees.",
    "2. Faire la puree de sesame",
    "Mets les graines grillees dans un mixeur ou robot.",
    "Ajoute l'huile et le sel.",
    "Mixe 2 a 3 minutes jusqu'a obtenir une pate lisse et cremeuse.",
    "C'est ton tahini maison.",
    "3. Preparer la sauce tahini",
    "Dans un bol melange :",
    "- 3 c. a soupe de tahini",
    "- le jus de citron",
    "- l'ail finement rape",
    "4. Ajouter l'eau",
    "Ajoute l'eau froide petit a petit en fouettant.",
    "La sauce va devenir plus claire et tres cremeuse.",
    "5. Assaisonner",
    "Ajoute l'huile d'olive.",
    "Ajoute sel et eventuellement cumin ou paprika.",
    "6. Ajuster la texture",
    "Si la sauce est trop epaisse -> ajoute un peu d'eau.",
    "Si elle est trop liquide -> ajoute un peu de tahini.",
    "Ta sauce tahini cremeuse maison est prete.",
  ],
},
{
  id: "mass-sauce-asiatique-cacahuetes",
  title: "Sauce asiatique aux cacahuetes",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: sauceAsiatiqueCacahuetesImg,
  ingredients: [
    "Pour la sauce",
    "2 a 3 grosses cuilleres a soupe de beurre de cacahuete (non sucre, non sale)",
    "2 grosses cuilleres a soupe de sauce soja ou tamari",
    "3 cuilleres a soupe d'eau",
    "1 cuillere a soupe de vinaigre de riz",
    "1 cuillere a soupe de sirop d'erable ou sirop d'agave",
    "Le jus d'1/2 citron vert",
    "1 a 2 gousses d'ail emincees",
    "Facultatif",
    "2 cuilleres a cafe de sriracha",
  ],
  steps: [
    "1. Melanger la base",
    "Dans un bol ajoute :",
    "- le beurre de cacahuete",
    "- la sauce soja",
    "- le jus de citron vert",
    "- le miel",
    "Melange bien.",
    "2. Ajouter les aromates",
    "Rape l'ail dans la sauce.",
    "Ajoute l'huile de sesame.",
    "3. Ajuster la texture",
    "Ajoute l'eau chaude petit a petit.",
    "Melange jusqu'a obtenir une sauce lisse et cremeuse.",
    "4. Ajouter les extras",
    "Ajoute sriracha et gingembre si tu veux une sauce plus parfumee.",
    "Melange bien.",
    "5. Servir",
    "Verse la sauce dans un petit bol.",
    "Ajoute des cacahuetes concassees sur le dessus.",
    "Ta sauce asiatique aux cacahuetes est prete.",
    "Astuces pour une sauce incroyable",
    "- utilise un beurre de cacahuete naturel.",
  ],
},
{
  id: "mass-sauce-blanche-herbes",
  title: "Sauce blanche aux herbes",
  flavor: "sale",
  prepTime: "20 min",
  servings: "2 pers",
  image: sauceBlancheHerbesImg,
  ingredients: [
    "Pour la sauce",
    "200 g de yaourt grec",
    "1 cuillere a soupe d'huile d'olive",
    "1 petite gousse d'ail",
    "1 cuillere a soupe de persil frais",
    "1 cuillere a soupe de ciboulette",
    "1 cuillere a soupe de citron (jus)",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Preparer les herbes",
    "Hache finement le persil.",
    "Coupe finement la ciboulette.",
    "2. Preparer la base",
    "Dans un bol ajoute :",
    "- le yaourt grec",
    "- l'huile d'olive",
    "- le jus de citron",
    "Melange bien.",
    "3. Ajouter les aromates",
    "Rape ou ecrase la gousse d'ail.",
    "Ajoute le persil et la ciboulette.",
    "4. Assaisonner",
    "Ajoute sel et poivre.",
    "Melange bien jusqu'a obtenir une sauce lisse et parfumee.",
    "5. Repos",
    "Mets la sauce 10 a 15 minutes au refrigerateur pour que les saveurs se developpent.",
    "Ta sauce blanche aux herbes est prete.",
  ],
},
{
  id: "mass-chimichurri-legerement-sucre",
  title: "Chimichurri legerement sucre",
  flavor: "sale",
  prepTime: "15 min",
  servings: "2 pers",
  image: chimichurriLegerementSucreImg,
  ingredients: [
    "Pour la sauce",
    "1/2 bouquet de persil frais",
    "1 petite gousse d'ail",
    "3 cuilleres a soupe d'huile d'olive",
    "1 cuillere a soupe de vinaigre de vin rouge",
    "1 cuillere a cafe de miel ou de sucre",
    "1/2 citron (jus)",
    "1 pincee de flocons de piment (optionnel)",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Preparer les herbes",
    "Lave le persil.",
    "Hache-le tres finement.",
    "2. Preparer l'ail",
    "Epluche les gousses d'ail.",
    "Hache-les tres finement ou rape-les.",
    "3. Melanger la sauce",
    "Dans un bol melange :",
    "- le persil",
    "- l'ail",
    "- l'origan",
    "- les flocons de piment",
    "4. Ajouter les liquides",
    "Verse :",
    "- l'huile d'olive",
    "- le vinaigre",
    "- le miel",
    "Melange bien.",
    "5. Assaisonner",
    "Ajoute sel et poivre.",
    "Melange encore.",
    "6. Repos",
    "Laisse reposer 10 a 15 minutes pour que les saveurs se developpent.",
    "Ton chimichurri legerement sucre est pret.",
    "Astuces pour un chimichurri incroyable",
    "- coupe les herbes au couteau et pas au mixeur",
    "- utilise une huile d'olive de bonne qualite.",
  ],
},
{
  id: "mass-sauce-aubergines-poivrons-grilles",
  title: "Sauce aux aubergines & poivrons grilles",
  flavor: "sale",
  prepTime: "40 min",
  servings: "3 pers",
  image: sauceAuberginesPoivronsGrillesImg,
  ingredients: [
    "Pour la sauce",
    "2 belles aubergines",
    "2 poivrons rouges",
    "1 gousse d'ail",
    "1/2 cuillere a cafe de paprika doux ou fume",
    "1/2 citron (jus)",
    "200 g de yaourt grec",
    "Sel",
    "Poivre",
    "Herbes fraiches (au choix)",
    "Persil, basilic, coriandre ou menthe",
  ],
  steps: [
    "1. Prechauffer le four",
    "Prechauffe le four a 200C.",
    "2. Preparer les legumes",
    "Coupe l'aubergine en deux dans la longueur.",
    "Coupe le poivron en deux et retire les graines.",
    "3. Griller les legumes",
    "Place les legumes sur une plaque avec papier cuisson.",
    "Arrose avec 1 c. a soupe d'huile d'olive.",
    "Enfourne 25 minutes.",
    "Les legumes doivent etre bien tendres et legerement grilles.",
    "4. Mixer la sauce",
    "Laisse refroidir legerement.",
    "Mets dans un blender :",
    "- l'aubergine",
    "- le poivron",
    "- l'ail",
    "- le jus de citron",
    "- l'huile d'olive restante",
    "- paprika",
    "Mixe 30 secondes jusqu'a obtenir une texture cremeuse.",
    "5. Assaisonner",
    "Ajoute sel, poivre et persil.",
    "Melange.",
    "6. Servir",
    "Verse la sauce dans un bol.",
    "Ajoute un filet d'huile d'olive et un peu de paprika.",
    "Ta sauce aubergines poivrons grilles est prete.",
  ],
},
{
  id: "mass-sauce-poivre",
  title: "Sauce au poivre",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: saucePoivreImg,
  ingredients: [
    "Pour la sauce",
    "1 cuillere a soupe de beurre",
    "1 petite echalote",
    "1 cuillere a soupe de poivre noir concasse",
    "4 cl de cognac",
    "150 ml de creme fraiche",
    "Sel",
    "Optionnel",
    "50 ml de fond de veau",
  ],
  steps: [
    "1. Faire revenir l'echalote",
    "Epluche et hache tres finement l'echalote.",
    "Fais fondre le beurre dans une petite casserole a feu moyen.",
    "Ajoute l'echalote et fais revenir 2 minutes jusqu'a ce qu'elle devienne translucide.",
    "2. Ajouter le poivre",
    "Ajoute le poivre noir concasse.",
    "Laisse cuire 30 secondes pour liberer les aromes.",
    "3. Deglacer au cognac",
    "Verse le cognac dans la casserole.",
    "Laisse reduire 1 minute.",
    "4. Ajouter le fond de veau",
    "Verse le fond de veau (si utilise).",
    "Laisse reduire 2 minutes.",
    "5. Ajouter la creme",
    "Ajoute la creme fraiche.",
    "Melange et laisse mijoter 3 a 4 minutes jusqu'a ce que la sauce epaississe.",
    "6. Ajuster l'assaisonnement",
    "Goute la sauce.",
    "Ajoute un peu de sel si necessaire.",
    "7. Servir",
    "Verse la sauce directement sur un steak ou une viande grillee.",
    "Ta sauce au poivre est prete.",
    "Astuces pour une sauce au poivre incroyable",
    "- ecrase le poivre grossierement au mortier",
    "- utilise une creme entiere pour une sauce plus onctueuse",
    "- ajoute un peu de beurre froid a la fin pour une texture brillante.",
  ],
},
{
  id: "mass-pickles-oignons",
  title: "Pickles d'oignons",
  flavor: "sale",
  prepTime: "35 min",
  servings: "2 pers",
  image: picklesOignonsImg,
  ingredients: [
    "Pour les oignons marines",
    "1 oignon rouge",
    "120 ml de vinaigre (vinaigre blanc ou vinaigre de cidre)",
    "120 ml d'eau",
    "1 cuillere a soupe de sucre",
    "1 cuillere a cafe de sel",
    "Optionnel",
    "1/2 citron (jus)",
    "1 pincee de poivre ou quelques graines de coriandre",
  ],
  steps: [
    "1. Couper les oignons",
    "Epluche l'oignon rouge.",
    "Coupe-le en fines rondelles.",
    "2. Preparer la marinade",
    "Dans une petite casserole melange :",
    "- vinaigre",
    "- eau",
    "- sucre",
    "- sel",
    "Chauffe 2 minutes jusqu'a ce que le sucre et le sel soient dissous.",
    "3. Mettre en bocal",
    "Place les rondelles d'oignon dans un bocal.",
    "Ajoute les epices optionnelles si tu veux.",
    "4. Verser la marinade",
    "Verse la marinade chaude sur les oignons.",
    "Assure-toi qu'ils soient bien recouverts.",
    "5. Repos",
    "Laisse refroidir.",
    "Mets au refrigerateur au moins 30 minutes.",
    "Ils sont encore meilleurs apres 2 a 3 heures.",
    "Tes pickles d'oignons sont prets.",
  ],
},
{
  id: "mass-pickles-concombre",
  title: "Pickles de concombre",
  flavor: "sale",
  prepTime: "20 min + repos",
  servings: "2 pers",
  image: picklesConcombreImg,
  ingredients: [
    "Pour les pickles",
    "1 concombre",
    "120 ml de vinaigre (vinaigre blanc ou vinaigre de cidre)",
    "120 ml d'eau",
    "1 cuillere a soupe de sucre",
    "1 cuillere a cafe de sel",
    "Optionnel",
    "1 gousse d'ail",
    "1 cuillere a cafe d'aneth",
    "1 pincee de poivre",
  ],
  steps: [
    "1. Preparer le concombre",
    "Lave le concombre.",
    "Coupe-le en rondelles fines ou en batonnets.",
    "2. Preparer la marinade",
    "Dans une casserole melange :",
    "- vinaigre",
    "- eau",
    "- sucre",
    "- sel",
    "Chauffe 2 minutes jusqu'a ce que le sucre et le sel soient dissous.",
    "3. Preparer le bocal",
    "Dans un bocal ajoute :",
    "- les concombres",
    "- l'ail ecrase",
    "- les graines de moutarde",
    "- l'aneth",
    "- les grains de poivre",
    "4. Ajouter la marinade",
    "Verse la marinade chaude sur les concombres.",
    "Assure-toi qu'ils soient completement recouverts.",
    "5. Repos",
    "Laisse refroidir.",
    "Mets au refrigerateur au moins 2 heures.",
    "Ils sont encore meilleurs le lendemain.",
    "Tes pickles de concombre sont prets.",
    "Astuces pour les meilleurs pickles",
    "- utilise des concombres fermes",
    "- laisse mariner 24 heures pour un gout plus intense.",
  ],
},
{
  id: "mass-pickles-carottes",
  title: "Pickles de carottes",
  flavor: "sale",
  prepTime: "20 min + repos",
  servings: "2 pers",
  image: picklesCarottesImg,
  ingredients: [
    "Pour les pickles",
    "2 carottes",
    "120 ml de vinaigre (vinaigre blanc ou vinaigre de riz)",
    "120 ml d'eau",
    "1 cuillere a soupe de sucre",
    "1 cuillere a cafe de sel",
    "Optionnel",
    "1 gousse d'ail",
    "1 petit morceau de gingembre",
    "1 pincee de piment",
  ],
  steps: [
    "1. Preparer les carottes",
    "Epluche les carottes.",
    "Coupe-les en batonnets fins ou en rondelles.",
    "Les batonnets donnent souvent les pickles les plus croquants.",
    "2. Preparer la saumure",
    "Dans une petite casserole melange :",
    "- vinaigre",
    "- eau",
    "- sucre",
    "- sel",
    "Chauffe 2 minutes jusqu'a ce que le sucre et le sel soient dissous.",
    "3. Preparer le bocal",
    "Dans un bocal ajoute :",
    "- les carottes",
    "- l'ail ecrase",
    "- le gingembre",
    "- les epices",
    "4. Ajouter la marinade",
    "Verse la saumure chaude sur les carottes.",
    "Les carottes doivent etre entierement recouvertes.",
    "5. Repos",
    "Laisse refroidir.",
    "Mets au refrigerateur au moins 2 heures.",
    "Elles sont encore meilleures apres 12 a 24 heures.",
    "Tes pickles de carottes sont prets.",
    "Astuces pour des pickles incroyables",
    "- ajoute un peu de citron vert pour plus de fraicheur",
    "- mets un peu de miel pour une version plus douce",
    "- coupe les carottes tres fines pour une marinade plus rapide.",
  ],
},
{
  id: "mass-pickles-chou-fleur",
  title: "Pickles de chou-fleur",
  flavor: "sale",
  prepTime: "20 min + repos",
  servings: "2 pers",
  image: picklesChouFleurImg,
  ingredients: [
    "Pour les pickles",
    "1 petit chou-fleur",
    "120 ml de vinaigre (vinaigre blanc ou vinaigre de cidre)",
    "120 ml d'eau",
    "1 cuillere a soupe de sucre",
    "1 cuillere a cafe de sel",
    "Optionnel",
    "1 gousse d'ail",
    "1 cuillere a cafe de graines de moutarde",
    "1 pincee de curcuma ou de piment",
  ],
  steps: [
    "1. Preparer le chou-fleur",
    "Lave le chou-fleur.",
    "Coupe-le en petites fleurettes.",
    "2. Preparer la saumure",
    "Dans une casserole melange :",
    "- vinaigre",
    "- eau",
    "- sucre",
    "- sel",
    "Chauffe 2 a 3 minutes jusqu'a ce que le sucre et le sel soient dissous.",
    "3. Preparer le bocal",
    "Dans un bocal ajoute :",
    "- les fleurettes de chou-fleur",
    "- l'ail ecrase",
    "- les epices",
    "4. Ajouter la marinade",
    "Verse la saumure chaude sur le chou-fleur.",
    "Les legumes doivent etre completement recouverts.",
    "5. Repos",
    "Laisse refroidir.",
    "Mets au refrigerateur au moins 4 heures.",
    "Ils sont encore meilleurs apres 24 heures.",
    "Tes pickles de chou-fleur sont prets.",
    "Astuces pour les meilleurs pickles",
    "- ajoute un peu de citron pour plus de fraicheur",
    "- mets une pincee de sucre supplementaire pour equilibrer l'acidite",
    "- laisse mariner une nuit entiere pour plus de gout.",
  ],
},
{
  id: "mass-sauce-pesto-maison",
  title: "Sauce pesto maison",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: saucePestoMaisonImg,
  ingredients: [
    "Pour le pesto",
    "1 gros bouquet de basilic frais (environ 40 g)",
    "40 g de parmesan rape",
    "30 g de pignons de pin",
    "1 petite gousse d'ail",
    "60 ml d'huile d'olive",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Lave et seche bien les feuilles de basilic.",
    "Epluche la gousse d'ail.",
    "2. Torrefier les pignons",
    "Mets les pignons dans une poele seche.",
    "Fais-les griller 2 a 3 minutes jusqu'a ce qu'ils soient legerement dores.",
    "Cela donne plus de gout au pesto.",
    "3. Mixer la base",
    "Dans un blender ou robot ajoute :",
    "- les pignons",
    "- l'ail",
    "- le basilic",
    "Mix quelques secondes.",
    "4. Ajouter le fromage",
    "Ajoute le parmesan.",
    "Mix legerement.",
    "5. Ajouter l'huile",
    "Verse l'huile d'olive progressivement en mixant.",
    "Continue jusqu'a obtenir une texture lisse mais legerement granuleuse.",
    "6. Assaisonner",
    "Ajoute une pincee de sel.",
    "Melange et goute.",
    "Ton pesto maison est pret.",
    "Secrets pour le meilleur pesto",
    "- utiliser un basilic tres frais",
    "- ajouter l'huile d'olive progressivement",
    "- ne pas trop mixer pour garder une texture legerement rustique.",
  ],
},
{
  id: "mass-guacamole-maison",
  title: "Guacamole maison",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: guacamoleMaisonImg,
  ingredients: [
    "Pour le guacamole",
    "2 avocats murs",
    "1/2 citron vert (jus)",
    "1 petite tomate",
    "1/4 d'oignon rouge",
    "1 cuillere a soupe de coriandre fraiche",
    "Sel",
    "Poivre",
    "Optionnel",
    "1 pincee de piment",
  ],
  steps: [
    "1. Preparer les avocats",
    "Coupe les avocats en deux.",
    "Retire le noyau.",
    "Recupere la chair avec une cuillere.",
    "2. Ecraser les avocats",
    "Mets la chair dans un bol.",
    "Ecrase avec une fourchette.",
    "Le guacamole doit rester legerement chunky (pas totalement lisse).",
    "3. Preparer les legumes",
    "Coupe l'oignon rouge tres finement.",
    "Coupe la tomate en petits des.",
    "Hache la coriandre.",
    "4. Melanger",
    "Ajoute dans le bol :",
    "- oignon",
    "- tomate",
    "- coriandre",
    "- jus de citron vert",
    "Melange doucement.",
    "5. Assaisonner",
    "Ajoute sel et piment.",
    "Goute et ajuste le citron.",
    "6. Servir",
    "Mets le guacamole dans un bol.",
    "Ajoute un filet d'huile d'olive ou un peu de coriandre sur le dessus.",
    "Ton guacamole est pret.",
    "Secrets pour le meilleur guacamole",
    "- utiliser des avocats bien murs mais pas trop mous",
    "- presser du citron vert frais",
    "- ecraser a la fourchette et pas au blender.",
  ],
},
{
  id: "mass-chutney-mangue",
  title: "Chutney de mangue",
  flavor: "sale",
  prepTime: "25 min",
  servings: "2 pers",
  image: chutneyMangueImg,
  ingredients: [
    "Pour le chutney",
    "1 mangue mure",
    "1/2 oignon",
    "1 gousse d'ail",
    "2 cuilleres a soupe de vinaigre de cidre",
    "2 cuilleres a soupe de sucre ou miel",
    "1/2 cuillere a cafe de gingembre frais rape",
    "1/2 cuillere a cafe de curry ou curcuma",
    "Sel",
    "Poivre",
    "Optionnel",
    "1 pincee de piment",
  ],
  steps: [
    "1. Preparer les mangues",
    "Epluche les mangues.",
    "Coupe la chair en petits des.",
    "2. Faire revenir les aromates",
    "Dans une casserole :",
    "Fais chauffer 1 c. a cafe d'huile.",
    "Ajoute :",
    "- oignon",
    "- ail",
    "- gingembre",
    "Fais revenir 2 minutes.",
    "3. Ajouter les epices",
    "Ajoute graines de moutarde, cumin, coriandre et piment.",
    "Laisse cuire 30 secondes pour liberer les aromes.",
    "4. Ajouter mangue et liquide",
    "Ajoute :",
    "- mangues",
    "- sucre",
    "- vinaigre",
    "- sel",
    "- raisins secs (optionnel)",
    "Melange bien.",
    "5. Cuisson lente",
    "Laisse mijoter a feu doux 25 a 30 minutes.",
    "Remue regulierement.",
    "Le chutney doit devenir epais, brillant et legerement caramelise.",
    "6. Refroidir",
    "Laisse refroidir completement.",
    "Mets dans un bocal sterilise.",
    "Le gout devient encore meilleur apres 24 heures.",
    "Ton chutney de mangue est pret.",
    "Secrets des meilleurs chutneys",
    "- utiliser des mangues mures mais fermes",
    "- cuire lentement pour concentrer les saveurs",
    "- laisser reposer 1 jour avant de manger.",
  ],
},
{
  id: "mass-caviar-aubergine",
  title: "Caviar d'aubergine",
  flavor: "sale",
  prepTime: "40 min",
  servings: "2 pers",
  image: caviarAubergineImg,
  ingredients: [
    "Pour le caviar d'aubergine",
    "2 aubergines",
    "1 gousse d'ail",
    "2 cuilleres a soupe d'huile d'olive",
    "1 cuillere a soupe de jus de citron",
    "Sel",
    "Poivre",
    "Optionnel",
    "1 cuillere a soupe de persil ou coriandre",
  ],
  steps: [
    "1. Cuire les aubergines",
    "Prechauffe le four a 200C.",
    "Coupe les aubergines en deux dans la longueur.",
    "Quadrille la chair avec un couteau.",
    "Arrose avec 1 c. a soupe d'huile d'olive.",
    "Enfourne 30 a 35 minutes jusqu'a ce que la chair soit tres tendre.",
    "2. Recuperer la chair",
    "Laisse tiedir 5 minutes.",
    "Recupere la chair avec une cuillere.",
    "Jette la peau.",
    "3. Mixer le caviar",
    "Mets dans un blender ou bol :",
    "- chair d'aubergine",
    "- ail",
    "- jus de citron",
    "- huile d'olive restante",
    "- cumin",
    "Mix 20 a 30 secondes.",
    "La texture doit etre cremeuse mais legerement rustique.",
    "4. Assaisonner",
    "Ajoute sel et poivre.",
    "Goute et ajuste le citron ou l'huile.",
    "5. Servir",
    "Mets dans un bol.",
    "Ajoute un filet d'huile d'olive et du persil.",
    "Ton caviar d'aubergine est pret.",
    "Secrets pour le meilleur caviar d'aubergine",
    "- cuire les aubergines jusqu'a ce qu'elles soient tres fondantes",
    "- utiliser une bonne huile d'olive",
    "- laisser reposer 30 minutes au frigo pour que les saveurs se developpent.",
  ],
},
{
  id: "mass-tapenade",
  title: "Tapenade",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: tapenadeImg,
  ingredients: [
    "Pour la tapenade",
    "200 g d'olives noires",
    "1 cuillere a soupe de capres",
    "1 gousse d'ail",
    "3 cuilleres a soupe d'huile d'olive",
    "1 cuillere a cafe de jus de citron",
    "Poivre",
    "Optionnel",
    "2 filets d'anchois",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Egoutte les olives et les capres.",
    "Epluche la gousse d'ail.",
    "2. Mixer la base",
    "Dans un robot ou blender ajoute :",
    "- olives",
    "- capres",
    "- anchois",
    "- ail",
    "Mix quelques secondes.",
    "3. Ajouter l'huile",
    "Verse l'huile d'olive progressivement.",
    "Mix jusqu'a obtenir une pate legerement granuleuse.",
    "4. Ajouter le citron",
    "Ajoute le jus de citron.",
    "Melange legerement.",
    "5. Assaisonner",
    "Ajoute poivre.",
    "Goute avant d'ajouter du sel (les olives sont deja salees).",
    "6. Servir",
    "Mets la tapenade dans un bol.",
    "Ajoute un filet d'huile d'olive et quelques herbes.",
    "Ta tapenade est prete.",
    "Secrets pour la meilleure tapenade",
    "- utiliser des olives noires de qualite (type Kalamata)",
    "- ne pas trop mixer pour garder une texture rustique",
    "- laisser reposer 30 minutes avant de servir.",
  ],
},
{
  id: "mass-sauce-teriyaki",
  title: "Sauce teriyaki",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: sauceTeriyakiImg,
  ingredients: [
    "Pour la sauce",
    "4 cuilleres a soupe de sauce soja",
    "2 cuilleres a soupe de mirin ou vinaigre de riz",
    "2 cuilleres a soupe de sucre ou miel",
    "1 cuillere a cafe de gingembre rape",
    "1 gousse d'ail",
    "Optionnel",
    "1 cuillere a cafe de maizena",
  ],
  steps: [
    "1. Melanger la base",
    "Dans une petite casserole ajoute :",
    "- sauce soja",
    "- mirin",
    "- sucre",
    "- eau",
    "- gingembre rape",
    "- ail hache",
    "Melange bien.",
    "2. Cuisson",
    "Porte a petite ebullition a feu moyen.",
    "Laisse mijoter 4 a 5 minutes.",
    "La sauce doit reduire legerement.",
    "3. Epaissir (optionnel)",
    "Melange la fecule avec 1 c. a soupe d'eau.",
    "Ajoute dans la sauce.",
    "Laisse cuire 1 minute jusqu'a epaississement.",
    "4. Finition",
    "Ajoute l'huile de sesame si tu veux.",
    "Melange bien.",
    "5. Servir",
    "La sauce doit etre brillante et legerement sirupeuse.",
    "Ta sauce teriyaki est prete.",
  ],
},
{
  id: "mass-huile-pimentee",
  title: "Huile pimentee",
  flavor: "sale",
  prepTime: "10 min + repos",
  servings: "2 pers",
  image: huilePimenteeImg,
  ingredients: [
    "Pour l'huile",
    "250 ml d'huile neutre ou d'huile d'olive",
    "2 cuilleres a soupe de flocons de piment",
    "1 gousse d'ail",
    "Optionnel",
    "1 etoile de badiane ou graines de sesame",
  ],
  steps: [
    "1. Preparer les aromates",
    "Epluche la gousse d'ail.",
    "Coupe-la en fines tranches.",
    "2. Mettre les ingredients dans un bol",
    "Dans un bol resistant a la chaleur ajoute :",
    "- les flocons de piment",
    "- l'ail",
    "- les graines de sesame (si utilisees)",
    "- la badiane",
    "3. Chauffer l'huile",
    "Mets l'huile dans une casserole.",
    "Chauffe jusqu'a environ 170C (huile chaude mais pas fumante).",
    "4. Verser l'huile chaude",
    "Verse lentement l'huile chaude sur les piments.",
    "Les piments vont crepiter legerement et liberer leur arome.",
    "5. Refroidir",
    "Laisse refroidir completement.",
    "Transfere dans un bocal hermetique.",
    "6. Repos",
    "L'huile est encore meilleure apres 12 a 24 heures.",
    "Ton huile pimentee est prete.",
    "Astuces pour une huile pimentee incroyable",
    "- laisse reposer au moins 12 heures avant de l'utiliser.",
  ],
},
{
  id: "mass-citrons-confits",
  title: "Citrons confits",
  flavor: "sale",
  prepTime: "15 min + repos",
  servings: "2 pers",
  image: citronsConfitsImg,
  ingredients: [
    "Pour les citrons",
    "4 citrons",
    "4 cuilleres a soupe de sel",
    "1 citron pour le jus",
    "Optionnel",
    "1 feuille de laurier",
  ],
  steps: [
    "1. Preparer les citrons",
    "Lave bien les citrons.",
    "Coupe chaque citron en croix (en 4) sans aller jusqu'au bout pour qu'il reste entier.",
    "2. Ajouter le sel",
    "Mets 1 c. a soupe de gros sel a l'interieur de chaque citron.",
    "Referme legerement les citrons.",
    "3. Mettre en bocal",
    "Place les citrons bien serres dans un bocal propre.",
    "Ajoute les epices optionnelles si tu veux.",
    "4. Ajouter le jus de citron",
    "Verse le jus de citron frais pour couvrir les citrons.",
    "Les citrons doivent etre completement immerges.",
    "5. Fermer le bocal",
    "Ferme le bocal hermetiquement.",
    "Laisse a temperature ambiante 24 heures.",
    "6. Maturation",
    "Mets ensuite le bocal au refrigerateur ou dans un endroit frais.",
    "Laisse fermenter 3 a 4 semaines.",
    "Les citrons deviennent tres tendres et parfumes.",
    "Tes citrons confits sont prets.",
    "Astuces pour les meilleurs citrons confits",
    "- utiliser des citrons bio (on consomme la peau)",
    "- secouer le bocal tous les 2 a 3 jours la premiere semaine",
    "- attendre au moins 3 semaines pour un gout parfait.",
  ],
},
{
  id: "mass-oignons-confits",
  title: "Oignons confits",
  flavor: "sale",
  prepTime: "25 min",
  servings: "2 pers",
  image: oignonsConfitsImg,
  ingredients: [
    "Pour les oignons",
    "3 oignons",
    "2 cuilleres a soupe de sucre",
    "2 cuilleres a soupe de vinaigre balsamique",
    "2 cuilleres a soupe d'huile d'olive",
    "Sel",
    "Poivre",
    "Optionnel",
    "1 cuillere a cafe de miel",
  ],
  steps: [
    "1. Couper les oignons",
    "Epluche les oignons.",
    "Coupe-les en fines lamelles.",
    "2. Faire revenir les oignons",
    "Dans une grande poele, chauffe l'huile d'olive et le beurre.",
    "Ajoute les oignons.",
    "Fais cuire 10 minutes a feu moyen en remuant.",
    "3. Ajouter le sucre",
    "Ajoute le sucre roux.",
    "Melange bien.",
    "Cela aide a carameliser les oignons.",
    "4. Cuisson lente",
    "Baisse le feu.",
    "Laisse cuire 15 a 20 minutes en remuant regulierement.",
    "Les oignons doivent devenir tres fondants et dores.",
    "5. Ajouter le vinaigre",
    "Verse le vinaigre balsamique.",
    "Laisse cuire 2 a 3 minutes.",
    "6. Assaisonner",
    "Ajoute sel et poivre.",
    "Melange bien.",
    "7. Servir",
    "Les oignons doivent etre tres fondants et legerement caramelises.",
    "Tes oignons confits sont prets.",
    "Astuces pour des oignons confits incroyables",
    "- cuire lentement pour developper le gout",
    "- ajouter un peu de miel pour plus de douceur",
    "- utiliser des oignons jaunes pour une meilleure caramelisation.",
  ],
},
{
  id: "mass-ail-confit",
  title: "Ail confit",
  flavor: "sale",
  prepTime: "35 min",
  servings: "2 pers",
  image: ailConfitImg,
  ingredients: [
    "Pour l'ail",
    "2 tetes d'ail",
    "200 ml d'huile d'olive",
    "Optionnel",
    "1 branche de thym",
  ],
  steps: [
    "1. Preparer l'ail",
    "Separe les gousses d'ail.",
    "Epluche-les.",
    "2. Mettre dans une casserole",
    "Place les gousses d'ail dans une petite casserole.",
    "Ajoute les herbes et epices si tu en utilises.",
    "3. Ajouter l'huile",
    "Verse l'huile d'olive pour recouvrir completement l'ail.",
    "4. Cuisson lente",
    "Fais chauffer a feu tres doux.",
    "L'huile doit etre chaude mais ne pas fremir fortement.",
    "Laisse cuire 30 a 40 minutes.",
    "Les gousses doivent devenir tres tendres et legerement dorees.",
    "5. Refroidir",
    "Laisse refroidir completement.",
    "Mets l'ail et l'huile dans un bocal hermetique.",
    "6. Conservation",
    "Conserve au refrigerateur jusqu'a 2 semaines.",
    "Ton ail confit est pret.",
    "Astuces pour un ail confit incroyable",
    "- cuire tres doucement pour eviter qu'il brule",
    "- ecraser une gousse pour faire une puree d'ail confit pour tartines",
    "- utiliser l'huile restante pour cuire legumes, pates ou viande.",
  ],
},
{
  id: "mass-riz-cajou",
  title: "Steak, pommes de terre & haricots verts",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  35 min",
  servings: "1 pers",
  image: steackPommeDeTerreImg,
  ingredients: [
    "1 steak hache (150-200 g)",
    "300 g de pommes de terre",
    "150 g de haricots verts",
    "1 c. a soupe d'huile d'olive",
    "1 gousse d'ail (optionnel)",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes de Provence",
  ],
  steps: [
    "1. Preparer les pommes de terre",
    "Preparer les pommes de terre",
    "Prechauffe le four a 200C.",
    "Coupe les pommes de terre en cubes ou en quartiers de taille similaire.",
    "Place-les dans un bol et ajoute :",
    "l'huile d'olive",
    "du sel et du poivre",
    "des herbes de Provence (optionnel)",
    "Melange bien pour enrober uniformement.",
    "Cuire au four",
    "Etale les pommes de terre sur une plaque de cuisson, sans les superposer.",
    "Enfourne pendant 20 a 25 minutes.",
    "A mi-cuisson, remue-les pour une cuisson homogene.",
    "Elles doivent etre dorees et croustillantes a l'exterieur, tout en restant tendres a l'interieur.",
    "2. Cuire les haricots verts",
    "Cuire les haricots verts",
    "Fais chauffer une poele avec un filet d'huile d'olive.",
    "Ajoute les haricots verts et l'ail hache.",
    "Verse 2 cuilleres a soupe d'eau, puis couvre.",
    "Laisse cuire 5 a 6 minutes a feu moyen.",
    "Les haricots doivent etre tendres tout en gardant une legere fermete.",
    "3. Cuire le steak",
    "Chauffer la poele",
    "Fais chauffer une poele a feu fort avec un peu d'huile d'olive.",
    "La poele doit etre bien chaude pour saisir la viande.",
    "Assaisonner et cuire",
    "Assaisonne le steak avec du sel et du poivre, puis depose-le dans la poele.",
    "Fais cuire selon la cuisson souhaitee :",
    "2 a 3 minutes par cote -> saignant",
    "3 a 4 minutes par cote -> a point",
    "Une cuisson rapide permet de former une belle croute tout en gardant la viande juteuse.",
    "4. Servir",
    "Disposer dans l'assiette",
    "Place les pommes de terre roties dans l'assiette.",
    "Ajoute les haricots verts a cote.",
    "Ajouter le steak",
    "Depose le steak chaud a cote des legumes.",
    "Finaliser",
    "Ajoute un peu de persil frais si tu le souhaites.",
    "Cela apporte une touche de fraicheur et de couleur.",
    "Ton steak pommes de terre haricots verts est pret.",
  ],
},

 {
  id: "mass-overnight-oats",
  title: "Overnight oats protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©s",
  flavor: "sucre",
  prepTime: "5 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  7 min",
  servings: "1 pers",
  image: overnightOatsImg,
  ingredients: [
    "50 g de flocons dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢avoine",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de graines de chia",
    "1 scoop de protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ine whey",
    "120 g de yaourt (nature)",
    "120 ml de lait dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢amande",
    "50 g de framboises",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢te ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  tartiner Biscoff (sur le dessus)",
  ],
  steps: [
    "1. Preparer la base d'avoine",
    "Preparer la base",
    "Dans un bocal ou un bol, melange :",
    "- les flocons d'avoine",
    "- le lait",
    "- le yaourt",
    "- le miel",
    "- la vanille",
    "Melange jusqu'a obtenir une texture bien cremeuse.",
    "La base doit etre homogene et legerement epaisse.",
    "2. Ajouter les framboises",
    "Ajouter les framboises",
    "Ecrase la moitie des framboises dans le melange.",
    "Remue legerement.",
    "3. Faire les couches",
    "Ajouter les toppings",
    "Ajoute une couche de pate Biscoff.",
    "Ajoute le reste des framboises entieres.",
    "Parseme de speculoos emiette.",
    "4. Repos",
    "Laisser reposer",
    "Couvre le bocal et place au refrigerateur pendant au moins 4 heures ou toute la nuit.",
    "Les flocons vont absorber le liquide et devenir cremeux, comme un pudding.",
    "5. Servir",
    "Avant de servir, melange legerement ou laisse les couches visibles selon ton envie.",
    "Ajoute un peu de speculoos emiette ou de Biscoff sur le dessus.",
    "Tes overnight oats framboises Biscoff sont prets.",
    "Astuces pour les rendre incroyables",
    "- chauffe legerement la pate Biscoff 10 secondes pour qu'elle coule dessus",
    "- ajoute quelques framboises congelees pour un effet tres frais",
    "- mets un peu de zeste de citron dans la base pour relever le gout.",
  ],
},
{
  id: "mass-brownie-beans",
  title: "Brownie protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©inÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©",
  flavor: "sucre",
  prepTime: "30 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  35 min",
  servings: "1 pers",
  image: brownieProteineImg,
  ingredients: [
    "60 g de whey protÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ine isolate OVERSTIM.s",
    "200 g de compote de pomme bio",
    "2 blancs dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œufs",
    "1 ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œuf entier",
    "100 g de farine de blÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© T65 ou T80",
    "Sel",
    "4 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨res ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de sucre roux ou de sucre de fleur de coco",
    "4 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨res ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de chocolat en poudre ou de cacao en poudre ou 50 g de chocolat noir ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢tisser (70 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  85% de cacao)",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de levure chimique",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 180C.",
    "Tapisse un moule carre (environ 20 cm) de papier cuisson.",
    "2. Faire fondre le chocolat",
    "Faire fondre le chocolat",
    "Dans un bol, mets le chocolat et le beurre.",
    "Fais fondre :",
    "- au bain-marie",
    "- ou au micro-ondes par intervalles de 30 secondes",
    "Melange jusqu'a obtenir une texture bien lisse.",
    "Le melange doit etre brillant et homogene.",
    "3. Ajouter le sucre et les oeufs",
    "Ajouter les ingredients liquides",
    "Ajoute le sucre au melange chocolat et melange bien.",
    "Incorpore ensuite les oeufs un par un, puis ajoute la vanille.",
    "4. Ajouter les ingredients secs",
    "Incorporer",
    "Ajoute la farine et le sel.",
    "Melange juste assez pour les incorporer.",
    "5. Ajouter les noix",
    "Incorporer",
    "Ajoute les noix grossierement concassees et melange delicatement.",
    "6. Cuisson",
    "Enfourner",
    "Verse la pate dans le moule et lisse le dessus.",
    "Fais cuire 20 a 25 minutes.",
    "Verifier",
    "Le brownie est pret lorsque :",
    "- le centre reste legerement fondant",
    "- les bords sont bien cuits",
    "C'est ce contraste qui donne un brownie parfait.",
    "7. Refroidir",
    "Laisser refroidir",
    "Laisse refroidir environ 15 minutes.",
    "Decouper",
    "Coupe en carres.",
    "Ton brownie aux noix est pret.",
    "Secrets pour le meilleur brownie",
    "- utiliser du chocolat noir de bonne qualite",
    "- ne pas trop cuire",
    "- laisser reposer avant de couper pour une texture parfaite.",
  ],
},
{
  id: "mass-salade-pates",
  title: "Bowl sucrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© fruits rouges & granola",
  flavor: "sucre",
  prepTime: "5 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  7 min",
  servings: "1 pers",
  image: fruitsRougesGranolaImg,
  ingredients: [
    "150 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  200 g de fromage blanc ou yaourt grec",
    "50 g de myrtilles",
    "3 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  4 fraises",
    "30 g de granola",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de sirop dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rable",
  ],
  steps: [
    "1. Preparer la base",
    "Preparer la base",
    "Dans un bol, ajoute le yaourt grec.",
    "Verse un peu de miel ou de sirop d'erable, puis melange legerement.",
    "2. Ajouter les fruits",
    "Ajouter les fruits",
    "Coupe les fraises en morceaux si necessaire.",
    "Dispose les fruits rouges sur le yaourt.",
    "3. Ajouter le granola",
    "Ajouter le croquant",
    "Saupoudre le granola sur le dessus.",
    "Ajoute egalement quelques graines.",
    "4. Ajouter les toppings",
    "Finaliser",
    "Ajoute un filet de miel.",
    "Tu peux aussi ajouter selon tes envies :",
    "du beurre de cacahuete",
    "des noix",
    "ou quelques morceaux de chocolat",
    "Ton bowl fruits rouges granola est pret.",
    "Astuces pour un bowl incroyable",
    "- mets les fruits legerement ecrases sur le yaourt pour creer un coulis naturel",
    "- ajoute un peu de zeste de citron",
    "- mets le granola au dernier moment pour garder le croquant.",
  ],
},
]

export const healthyRecipes: Recipe[] = [
{
  id: "healthy-granola",
  title: "Granola croustillant maison",
  flavor: "sucre",
  prepTime: "35 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  45 min",
  servings: "1 pers",
  image: granolaMaisonImg,
  ingredients: [
    "250 g de flocons dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢avoine",
    "60 g dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢amandes",
    "60 g de noisettes",
    "60 g de noix",
    "3 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨res ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de miel",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  cafÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© de cannelle",
    "1 pincÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©e de sel",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 170C.",
    "Recouvre une plaque de cuisson de papier cuisson.",
    "2. Melanger les ingredients secs",
    "Melanger les ingredients secs",
    "Dans un grand bol, melange :",
    "- les flocons d'avoine",
    "- les noix grossierement concassees",
    "- la cannelle",
    "- une pincee de sel",
    "3. Ajouter les ingredients liquides",
    "Ajoute :",
    "- le miel ou le sirop d'erable",
    "- l'huile",
    "- la vanille",
    "Melange jusqu'a ce que tout soit legerement enrobe.",
    "4. Cuisson",
    "Cuire au four",
    "Etale le granola sur la plaque en une couche uniforme.",
    "Enfourne pendant 20 a 25 minutes.",
    "A mi-cuisson, remue legerement.",
    "Le granola doit devenir bien dore.",
    "5. Refroidir",
    "Laisser refroidir",
    "Laisse refroidir completement sur la plaque.",
    "Il va durcir en refroidissant et devenir croustillant.",
    "6. Ajouter les extras",
    "Ajouter les toppings",
    "Une fois refroidi, ajoute les pepites de chocolat et les fruits secs.",
    "Cela apporte encore plus de texture et de gourmandise.",
    "Ton granola maison est pret.",
    "Astuces pour un granola incroyable",
    "- ne melange pas trop pendant la cuisson pour garder des clusters",
    "- ajoute un blanc d'oeuf dans le melange pour encore plus de croustillant",
    "- laisse refroidir completement avant de casser les morceaux.",
  ],
},
{
  id: "healthy-bowl-thon",
  title: "Bowl au thon",
  flavor: "sale",
  prepTime: "20 a 25 min",
  servings: "1 pers",
  image: bowlThonImg,
  ingredients: [
    "120 g de thon au naturel",
    "60 g de riz cru",
    "1/2 avocat",
    "1/2 concombre",
    "1 petite tomate",
    "1 oeuf",
    "1 c. a cafe de graines de sesame",
    "Pour la vinaigrette",
    "1 c. a cafe d'huile d'olive",
    "1 c. a cafe de vinaigre balsamique",
    "Sel et poivre",
  ],
  steps: [
    "1. Cuire le riz",
    "Rincer le riz",
    "Place le riz dans une passoire fine et rince-le sous l'eau froide pendant quelques secondes.",
    "Cela permet d'enlever l'exces d'amidon et d'obtenir un riz moins collant.",
    "Mettre en cuisson",
    "Verse le riz rince dans une casserole, puis ajoute les 160 ml d'eau.",
    "Melange legerement pour bien repartir les grains.",
    "Porter a ebullition",
    "Fais chauffer a feu moyen jusqu'a ce que l'eau arrive a ebullition.",
    "Cuire a feu doux",
    "Des que l'eau bout, couvre la casserole et baisse le feu.",
    "Laisse cuire a feu doux pendant 12 minutes, sans soulever le couvercle.",
    "Laisser reposer",
    "Retire la casserole du feu et laisse reposer 5 minutes, toujours couverte.",
    "Cette etape permet au riz de finir d'absorber l'humidite.",
    "Aerer le riz",
    "A l'aide d'une fourchette, melange delicatement pour separer les grains.",
    "2. Cuire l'oeuf",
    "Cuire",
    "Plonge l'oeuf dans une casserole d'eau bouillante et laisse cuire 9 a 10 minutes.",
    "Refroidir et couper",
    "Passe-le sous l'eau froide, ecale-le puis coupe-le en quartiers.",
    "3. Preparer les legumes",
    "Couper",
    "Coupe l'avocat en morceaux, le concombre en des et la tomate en morceaux.",
    "Des morceaux reguliers assurent un bon equilibre.",
    "4. Preparer la vinaigrette",
    "Melanger",
    "Dans un petit bol, melange l'huile d'olive, le vinaigre balsamique, le sel et le poivre.",
    "5. Assembler",
    "Assembler",
    "Dans un bol, ajoute le riz, le thon, les legumes et les quartiers d'oeuf.",
    "Assaisonner",
    "Verse la vinaigrette et ajoute les graines de sesame.",
  ],
},
{
  id: "healthy-bowl-mediterraneen",
  title: "Bowl mediterraneen",
  flavor: "sale",
  prepTime: "20 a 25 min",
  servings: "1 pers",
  image: bowlMediteraneenImg,
  ingredients: [
    "Base",
    "60 g de quinoa",
    "100 g de pois chiches cuits (egouttes)",
    "Legumes & garnitures",
    "1/2 concombre",
    "1 tomate",
    "1/4 d'oignon rouge",
    "50 g de feta emiettee",
    "Quelques olives noires",
    "Persil ou basilic frais",
    "Assaisonnement",
    "1 c. a soupe d'huile d'olive",
    "1 c. a cafe de jus de citron",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Cuire la base",
    "Rincer le quinoa",
    "Place le quinoa dans une passoire fine et rince-le soigneusement sous l'eau froide pendant quelques secondes.",
    "Cela enleve son amertume naturelle.",
    "Mettre en cuisson",
    "Verse le quinoa dans une casserole et ajoute l'eau (et le sel si souhaite).",
    "Melange legerement.",
    "Porter a ebullition",
    "Fais chauffer a feu moyen jusqu'a ce que l'eau arrive a ebullition.",
    "Cuire a feu doux",
    "Des que l'eau bout, couvre la casserole et baisse le feu.",
    "Laisse cuire 10 a 12 minutes.",
    "L'eau doit etre completement absorbee.",
    "Laisser reposer",
    "Retire du feu et laisse reposer 5 minutes, toujours couvert.",
    "Cela permet au quinoa de finir de gonfler.",
    "Aerer",
    "Aere le quinoa a l'aide d'une fourchette pour separer les grains.",
    "2. Preparer les legumes",
    "Couper",
    "Coupe le concombre et la tomate en petits morceaux.",
    "Emince l'oignon rouge en fines lamelles.",
    "Des morceaux reguliers permettent un melange harmonieux.",
    "3. Preparer les pois chiches",
    "Rincer",
    "Rince les pois chiches sous l'eau froide, puis egoutte-les.",
    "Cela enleve l'exces de sel et ameliore leur gout.",
    "4. Assaisonnement",
    "Melanger",
    "Dans un petit bol, melange l'huile d'olive, le jus de citron, le sel et le poivre.",
    "5. Assembler",
    "Disposer la base",
    "Place le quinoa dans un bol ou une assiette.",
    "Ajouter les garnitures",
    "Ajoute par-dessus :",
    "les pois chiches",
    "les legumes",
    "la feta",
    "les olives",
    "Assaisonner",
    "Verse la vinaigrette et ajoute les herbes.",
    "Melange legerement ou laisse tel quel pour un joli visuel.",
  ],
},
{
  id: "healthy-burrito-bowl",
  title: "Burrito bowl healthy",
  flavor: "sale",
  prepTime: "30 min",
  servings: "1 pers",
  image: bowlPouletImg,
  ingredients: [
    "Base",
    "80 g de riz cru (ou quinoa)",
    "160 ml d'eau",
    "Poulet marine",
    "120 g de blanc de poulet",
    "1 c. a cafe d'huile d'olive",
    "1 c. a cafe de paprika",
    "1/2 c. a cafe de cumin",
    "1/2 c. a cafe de poudre d'ail",
    "1 c. a cafe de jus de citron vert",
    "sel et poivre",
  ],
  steps: [
    "1. Cuire le riz",
    "Rincer le riz",
    "Place le riz dans une passoire fine et rince-le sous l'eau froide pendant quelques secondes.",
    "Cela permet d'enlever l'exces d'amidon et d'obtenir un riz moins collant.",
    "Mettre en cuisson",
    "Verse le riz rince dans une casserole, puis ajoute les 160 ml d'eau.",
    "Melange legerement pour bien repartir les grains.",
    "Porter a ebullition",
    "Fais chauffer a feu moyen jusqu'a ce que l'eau arrive a ebullition.",
    "Cuire a feu doux",
    "Des que l'eau bout, couvre la casserole et baisse le feu.",
    "Laisse cuire a feu doux pendant 12 minutes, sans soulever le couvercle.",
    "Laisser reposer",
    "Retire la casserole du feu et laisse reposer 5 minutes, toujours couverte.",
    "Cette etape permet au riz de finir d'absorber l'humidite.",
    "Aerer le riz",
    "A l'aide d'une fourchette, melange delicatement pour separer les grains.",
    "2. Mariner le poulet",
    "Preparer le poulet",
    "Coupe le poulet en petits morceaux de taille reguliere.",
    "Cela permet une cuisson homogene et une meilleure absorption de la marinade.",
    "Preparer la marinade",
    "Dans un bol, ajoute :",
    "un filet d'huile d'olive",
    "le paprika",
    "le cumin",
    "l'ail en poudre",
    "le jus de citron",
    "du sel et du poivre",
    "Melange bien pour obtenir une marinade homogene.",
    "Enrober le poulet",
    "Ajoute les morceaux de poulet dans le bol.",
    "Melange soigneusement pour bien les enrober.",
    "Chaque morceau doit etre bien impregne pour un maximum de saveur.",
    "Laisser mariner",
    "Laisse reposer environ 10 minutes.",
    "Meme un court temps de marinade permet deja de parfumer le poulet.",
    "3. Cuire le poulet",
    "Chauffer la poele",
    "Fais chauffer une poele a feu moyen-fort pendant quelques instants.",
    "La poele doit etre bien chaude pour saisir le poulet.",
    "Cuire le poulet",
    "Ajoute les morceaux de poulet dans la poele.",
    "Laisse cuire 6 a 8 minutes, en remuant de temps en temps.",
    "Le poulet doit etre bien dore a l'exterieur et cuit a coeur.",
    "4. Preparer les legumes",
    "Couper les legumes",
    "Coupe la tomate en petits des.",
    "Emince l'oignon rouge en fines lamelles.",
    "Preparer les autres ingredients",
    "Rince les haricots rouges et le mais sous l'eau froide, puis egoutte-les.",
    "Cela enleve l'exces de sel et ameliore le gout.",
    "5. Faire le guacamole",
    "Ecraser l'avocat",
    "Dans un bol, ecrase l'avocat a l'aide d'une fourchette.",
    "Assaisonner",
    "Ajoute :",
    "un filet de citron vert",
    "une pincee de sel",
    "un peu de poivre",
    "Melange jusqu'a obtenir une texture cremeuse.",
    "6. Monter le burrito bowl",
    "Disposer la base",
    "Depose le riz chaud au fond d'un bol.",
    "Tu peux le tasser legerement pour une base stable.",
    "Ajouter les garnitures",
    "Dispose harmonieusement par-dessus :",
    "le poulet marine",
    "les haricots rouges",
    "le mais",
    "la salade",
    "les tomates",
    "l'oignon rouge",
    "Ajouter le guacamole",
    "Depose une portion de guacamole sur le dessus du bowl.",
    "Ton burrito bowl healthy est pret.",
    "Astuces pour qu'il soit vraiment incroyable :",
    "ajoute un filet de citron vert sur tout le bowl",
    "mets un peu de coriandre fraiche",
    "ajoute une sauce yaourt citron vert pour encore plus de gout.",
  ],
},
{
  id: "healthy-soupe-verte",
  title: "Soupe verte dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tox",
  flavor: "sale",
  prepTime: "20 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  25 min",
  servings: "1 pers",
  image: soupeDetoxImg,
  ingredients: [
    "120 g de brocoli",
    "1 petite courgette",
    "1 poignee d'epinards frais",
    "300 ml d'eau + 1/2 cube de bouillon de legumes",
    "1 c. a cafe d'huile d'olive",
    "1 petite gousse d'ail (optionnel)",
    "Poivre noir",
  ],
  steps: [
    "1. Preparer les legumes",
    "Couper et laver",
    "Coupe le brocoli en petits morceaux.",
    "Decoupe la courgette en rondelles.",
    "Lave soigneusement les epinards.",
    "Des morceaux reguliers permettent une cuisson homogene.",
    "2. Faire revenir l'ail",
    "Chauffer",
    "Fais chauffer l'huile d'olive dans une casserole a feu moyen.",
    "Ajouter l'ail",
    "Ajoute l'ail hache et fais cuire environ 30 secondes.",
    "L'ail doit devenir parfume sans brunir.",
    "3. Cuire la soupe",
    "Ajouter les legumes",
    "Ajoute le brocoli et la courgette dans la casserole.",
    "Cuire",
    "Verse le bouillon de legumes, puis porte a ebullition.",
    "Reduis ensuite le feu et laisse mijoter 10 a 12 minutes.",
    "Les legumes doivent devenir bien tendres.",
    "4. Ajouter les epinards",
    "Incorporer",
    "Ajoute une poignee d'epinards dans la casserole.",
    "Cuire brievement",
    "Laisse cuire environ 1 minute.",
    "Les epinards vont tomber et reduire rapidement.",
    "5. Mixer",
    "Mixer",
    "Mixe la preparation a l'aide d'un mixeur plongeant ou d'un blender.",
    "Ajuster la texture",
    "Mixe jusqu'a obtenir une texture lisse et homogene.",
    "La soupe doit etre bien verte et veloutee.",
    "6. Assaisonner",
    "Finaliser",
    "Ajoute du poivre noir, puis goute et ajuste l'assaisonnement si necessaire.",
    "Ta soupe detox est prete.",
    "Astuce pour qu'elle soit encore meilleure :",
    "- ajoute un filet de citron a la fin",
    "- mixe bien pour obtenir une soupe tres cremeuse sans creme.",
  ],
},

 {
  id: "healthy-salade-pates",
  title: "Banana bread",
  flavor: "sucre",
  prepTime: "55 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  65 min",
  servings: "1 pers",
  image: bananaBreadImg,
  ingredients: [
    "3 bananes mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â»res (dont 1 pour la dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©coration)",
    "2 ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œufs ou 100 g de compote",
    "150 g de farine",
    "50 g de poudre dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢amande",
    "80 g de sucre roux",
    "50 g dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢huile vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tale (cacahuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨te, coco ou tournesol)",
    "100 ml de lait dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢amande ou de coco",
    "1/2 sachet de levure chimique",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  cafÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© de bicarbonate",
    "1 pincÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©e de sel",
    "1 sachet de sucre vanillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  cafÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© de cannelle",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 180C.",
    "Beurre ou tapisse un moule a cake.",
    "2. Ecraser les bananes",
    "Ecraser les bananes",
    "Place les bananes dans un bol.",
    "Ecrase-les a la fourchette jusqu'a obtenir une puree lisse.",
    "Plus la puree est lisse, plus la texture sera homogene.",
    "3. Melanger les ingredients liquides",
    "Ajouter les ingredients liquides",
    "Ajoute :",
    "- les oeufs",
    "- le sucre roux",
    "- le sucre blanc",
    "- l'huile",
    "- la vanille",
    "Melange bien jusqu'a obtenir une preparation homogene.",
    "4. Ajouter les ingredients secs",
    "Incorporer",
    "Ajoute les ingredients secs et melange juste assez pour les incorporer.",
    "5. Ajouter les extras",
    "Incorporer",
    "Ajoute les noix et les pepites de chocolat.",
    "Melange delicatement pour bien les repartir.",
    "6. Cuisson",
    "Enfourner",
    "Verse la pate dans le moule.",
    "Fais cuire environ 50 minutes.",
    "Verifier",
    "Plante la lame d'un couteau : elle doit ressortir presque propre.",
    "Le banana bread doit rester legerement humide a coeur.",
    "7. Refroidir",
    "Refroidir",
    "Laisse refroidir 10 a 15 minutes avant de demouler.",
    "Ton banana bread est pret.",
    "Secrets pour le banana bread parfait",
    "- utiliser des bananes tres mures (presque noires)",
    "- ne pas trop melanger la pate",
    "- laisser reposer 1 heure avant de couper pour plus de moelleux.",
  ],
},
{
  id: "healthy-overnight-oats",
  title: "Brochettes de poulet, salade fraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®che & boulghour ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  la tomate",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  35 min",
  servings: "1 pers",
  image: brochettesImg,
  ingredients: [
    "Brochettes de poulet",
    "120 g de blanc de poulet",
    "1 c. a soupe d'huile d'olive",
    "1 c. a cafe de jus de citron",
    "Poivre noir",
    "1 pincee de paprika (optionnel)",
    "Boulgour a la tomate",
    "60 g de boulgour",
    "120 ml d'eau",
    "1 petite tomate",
    "1 c. a cafe de concentre de tomate",
    "1 c. a cafe d'huile d'olive",
    "Poivre",
    "Salade",
    "1 poignee de salade verte",
    "1/2 tomate",
    "1/4 concombre",
    "1 c. a cafe d'huile d'olive",
    "Un peu de citron",
    "Poivre",
  ],
  steps: [
    "1. Preparer le poulet",
    "Preparer le poulet",
    "Coupe le poulet en cubes de taille reguliere, puis place-les dans un bol.",
    "Assaisonner",
    "Ajoute :",
    "un filet d'huile d'olive",
    "le jus de citron",
    "le paprika",
    "le poivre",
    "Melange bien pour enrober tous les morceaux.",
    "Laisser mariner",
    "Laisse reposer environ 5 minutes.",
    "Meme une courte marinade apporte deja beaucoup de saveur.",
    "2. Faire les brochettes",
    "Monter les brochettes",
    "Pique les morceaux de poulet sur des pics a brochettes.",
    "Cuire",
    "Fais chauffer une poele ou un grill a feu moyen.",
    "Depose les brochettes et fais cuire 10 a 12 minutes, en les retournant regulierement.",
    "Le poulet doit etre bien dore et cuit a coeur.",
    "3. Cuire le boulgour",
    "Mettre en cuisson",
    "Dans une casserole, ajoute le boulgour, l'eau, la tomate coupee en petits des et le concentre de tomate.",
    "Cuire",
    "Porte a ebullition, puis couvre et laisse cuire 10 a 12 minutes a feu doux.",
    "Le boulgour doit absorber le liquide.",
    "Finaliser",
    "Ajoute une cuillere a cafe d'huile d'olive, puis melange.",
    "4. Preparer la salade",
    "Couper",
    "Coupe la tomate en morceaux et le concombre en des.",
    "Assaisonner",
    "Melange avec la salade verte, puis ajoute un filet d'huile d'olive, du citron et du poivre.",
    "5. Servir",
    "Disposer",
    "Place le boulgour dans l'assiette.",
    "Ajouter le poulet",
    "Depose les brochettes de poulet grillees a cote.",
    "Completer",
    "Ajoute la salade fraiche.",
    "Ton plat complet est pret.",
  ],
},
{
  id: "healthy-smoothie-glow",
  title: "Smoothie glow mangue passion",
  flavor: "boisson",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieMangueImg,
  ingredients: [
    "150 g de mangue (fraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®che ou surgelÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©e)",
    "1 fruit de la passion",
    "200 ml de lait vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tal (amande, coco lÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ger ou avoine)",
    "100 g de yaourt nature ou yaourt grec allÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  cafÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© de jus de citron (optionnel)",
    "Quelques glaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ons (optionnel)",
  ],
  steps: [
    "1. Preparer les fruits",
    "Coupe la mangue en morceaux.",
    "Coupe le fruit de la passion et recupere la pulpe.",
    "2. Mettre dans le blender",
    "Ajoute dans le blender :",
    "- la mangue",
    "- la pulpe de passion",
    "- l'eau de coco",
    "- le jus de citron vert",
    "- les glacons",
    "3. Mixer",
    "Mixe 30 a 40 secondes jusqu'a obtenir une texture lisse et cremeuse.",
    "4. Ajuster la texture",
    "Si le smoothie est trop epais -> ajoute un peu d'eau de coco.",
    "Si tu le veux plus cremeux -> ajoute du yaourt.",
    "5. Servir",
    "Verse dans un verre et ajoute eventuellement quelques graines de chia ou de la mangue sur le dessus.",
    "Ton smoothie glow mangue passion est pret.",
  ],
},
{
  id: "healthy-wrap-legumes",
  title: "Brownie salÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© au brocoli, feta & lardons",
  flavor: "sale",
  prepTime: "40 min",
  servings: "4 à 6 parts",
  image: brownieSaleImg,
  ingredients: [
    "1 brocoli",
    "2 oeufs",
    "160 g de farine",
    "1/2 feta (environ 100 g)",
    "120 g de lardons",
    "250 ml de lait",
    "60 g de comte rape",
    "2 c. a soupe d'huile d'olive",
    "1/2 c. a cafe d'ail en poudre",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Preparer le brocoli",
    "Couper le brocoli",
    "Rince le brocoli, puis coupe-le en petits bouquets.",
    "Cuire",
    "Plonge les bouquets dans une casserole d'eau bouillante.",
    "Laisse cuire 4 a 5 minutes, jusqu'a ce qu'ils soient tendres.",
    "Egoutter et ajuster",
    "Egoutte soigneusement, puis coupe les morceaux en plus petits si necessaire.",
    "Le brocoli doit etre tendre mais encore legerement ferme.",
    "2. Cuire les lardons",
    "Faire revenir",
    "Depose les lardons dans une poele chaude.",
    "Fais-les cuire 3 a 4 minutes, jusqu'a ce qu'ils soient bien dores.",
    "Egoutter",
    "Si necessaire, retire l'exces de gras.",
    "Cela evite d'alourdir la preparation.",
    "3. Preparer la pate",
    "Melanger les liquides",
    "Dans un saladier, casse les oeufs.",
    "Ajoute le lait et l'huile d'olive, puis melange.",
    "Ajouter la farine",
    "Incorpore la farine progressivement et melange jusqu'a obtenir une pate lisse, sans grumeaux.",
    "4. Ajouter les garnitures",
    "Ajouter les ingredients",
    "Ajoute a la pate :",
    "le comte rape",
    "les lardons",
    "la feta",
    "le brocoli",
    "Assaisonner et melanger",
    "Ajoute l'ail en poudre, le sel et le poivre.",
    "Melange delicatement pour bien repartir les ingredients.",
    "La preparation doit etre homogene sans ecraser les morceaux.",
    "5. Cuisson",
    "Preparer le four",
    "Prechauffe le four a 180C.",
    "Enfourner",
    "Verse la preparation dans un moule carre legerement huile.",
    "Enfourne pendant 25 minutes.",
    "Le dessus doit etre legerement dore.",
    "Verifier la cuisson",
    "Plante la lame d'un couteau : elle doit ressortir propre.",
    "6. Servir",
    "Laisser refroidir",
    "Laisse tiedir pendant 10 minutes.",
    "Decouper",
    "Coupe en carres, comme un brownie.",
    "Ton brownie sale brocoli feta lardons est pret.",
  ],
},
{
  id: "healthy-tofu-bowl",
  title: "Biscuits croustillants avoine & chocolat",
  flavor: "sucre",
  prepTime: "25 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  30 min",
  servings: "1 pers",
  image: biscuitsAvoineImg,
  ingredients: [
    "1 banane mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â»re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©crasÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©e",
    "100 g de flocons dÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢avoine",
    "50 g de chocolat noir (en morceaux ou pÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©pites)",
    "8 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  10 noisettes entiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨res",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 180C.",
    "Recouvre une plaque de cuisson de papier cuisson.",
    "2. Preparer la base croustillante",
    "Preparer la pate",
    "Dans un bol, ajoute :",
    "- la banane ecrasee",
    "- les flocons d'avoine",
    "- une pincee de sel",
    "Melange jusqu'a obtenir une pate epaisse.",
    "La texture doit etre compacte et facile a faconner.",
    "3. Former les biscuits",
    "Former les biscuits",
    "Depose environ 6 petits tas sur la plaque.",
    "Aplatis-les legerement pour former des biscuits fins.",
    "Des biscuits fins seront plus croustillants apres cuisson.",
    "4. Cuisson",
    "Cuire",
    "Enfourne pendant 10 a 12 minutes.",
    "Les biscuits doivent etre legerement dores.",
    "5. Ajouter la couche chocolat",
    "Ajouter le chocolat",
    "Fais fondre le chocolat noir au micro-ondes (par intervalles) ou au bain-marie.",
    "Etale une fine couche sur chaque biscuit.",
    "6. Ajouter les noisettes",
    "Ajouter les noisettes",
    "Concasse legerement les noisettes, puis saupoudre-les sur le chocolat.",
    "7. Refroidir",
    "Laisser durcir",
    "Laisse refroidir environ 10 minutes pour que le chocolat durcisse.",
    "Tes biscuits croustillants avoine chocolat sont prets.",
  ],
},
{
  id: "healthy-saumon-tray",
  title: "Saumon au four citron",
  flavor: "sale",
  prepTime: "30 min",
  servings: "2 pers",
  image: saumonCitronImg,
  ingredients: [
    "2 paves de saumon (150-180 g chacun)",
    "1 citron",
    "2 c. a soupe d'huile d'olive",
    "Poivre noir",
    "1 pincee d'aneth ou d'herbes",
    "(Optionnel) 1 petite gousse d'ail",
    "150 g de riz blanc",
    "165 ml d'eau",
    "1 pincee de sel",
    "Asperges (accompagnement, selon envie)",
  ],
  steps: [
    "1. Laver le riz",
    "Rincer le riz",
    "Place le riz dans une passoire fine et rince-le sous l'eau froide pendant quelques secondes.",
    "Cela permet d'enlever l'exces d'amidon et d'obtenir un riz moins collant.",
    "Mettre en cuisson",
    "Verse le riz rince dans une casserole, puis ajoute les 160 ml d'eau.",
    "Melange legerement pour bien repartir les grains.",
    "Porter a ebullition",
    "Fais chauffer a feu moyen jusqu'a ce que l'eau arrive a ebullition.",
    "Cuire a feu doux",
    "Des que l'eau bout, couvre la casserole et baisse le feu.",
    "Laisse cuire a feu doux pendant 12 minutes, sans soulever le couvercle.",
    "Laisser reposer",
    "Retire la casserole du feu et laisse reposer 5 minutes, toujours couverte.",
    "Cette etape permet au riz de finir d'absorber l'humidite.",
    "Aerer le riz",
    "A l'aide d'une fourchette, melange delicatement pour separer les grains.",
    "3. Preparer le saumon",
    "Prechauffe le four a 200C.",
    "Place les paves de saumon dans un plat allant au four.",
    "Ajouter le citron",
    "Coupe la moitie du citron en rondelles et depose-les sur le saumon.",
    "Presse l'autre moitie directement par-dessus.",
    "4. Assaisonner",
    "Assaisonner",
    "Verse l'huile d'olive sur le saumon.",
    "Ajoute le poivre, l'aneth et eventuellement l'ail.",
    "L'assaisonnement doit bien enrober le poisson.",
    "5. Cuire le saumon",
    "Enfourner",
    "Place le plat au four et fais cuire 12 a 15 minutes a 200C.",
    "Verifier",
    "Le saumon est pret lorsqu'il devient tendre et se detache facilement a la fourchette.",
    "Il doit rester legerement fondant.",
    "6. Servir",
    "Disposer",
    "Place le riz dans les assiettes.",
    "Ajouter le saumon",
    "Depose le saumon au citron par-dessus ou a cote.",
    "Finaliser",
    "Verse un peu du jus de cuisson (citron + huile d'olive) sur le riz.",
    "Cela apporte encore plus de saveur.",
    "Ton saumon au four citron et riz est pret.",
    "Astuce pour qu'il soit vraiment excellent :",
    "- ne surcuis pas le saumon (il doit rester moelleux)",
    "- ajoute un peu du jus citron-huile du plat sur le riz",
    "- utilise du citron frais, pas du jus en bouteille.",
  ],
},

 {
  id: "healthy-potage-lentilles",
  title: "Pudding de chia coco & fraises",
  flavor: "sucre",
  prepTime: "5 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  7 min",
  servings: "1 pers",
  image: puddingChiaCocoFraisesImg,
  ingredients: [
    "250 ml de lait vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©gÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tal",
    "3 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨res ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de graines de chia",
    "1 cuillÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨re ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  soupe de miel",
    "100 g de yaourt ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  la noix de coco",
    "30 g de granola",
    "4 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  5 fraises",
  ],
  steps: [
    "1. Preparer la base de chia",
    "Preparer la base",
    "Dans un bocal ou un bol, melange :",
    "- les graines de chia",
    "- le lait de coco",
    "- le miel",
    "- la vanille",
    "Remue bien pour repartir les graines.",
    "Le melange doit etre homogene des le depart.",
    "2. Repos",
    "Laisser epaissir",
    "Laisse reposer 5 minutes, puis melange a nouveau pour eviter que les graines ne collent.",
    "Place ensuite au refrigerateur pendant au moins 4 heures ou toute la nuit.",
    "Les graines vont absorber le liquide et creer une texture de pudding.",
    "3. Ajouter les framboises",
    "Ajouter les framboises",
    "Ecrase la moitie des framboises pour obtenir un coulis naturel.",
    "Ajoute-le sur le pudding.",
    "4. Ajouter les toppings",
    "Finaliser",
    "Ajoute le reste des framboises entieres.",
    "Parseme de noix de coco rapee ou de granola.",
    "Ton pudding chia coco framboise est pret.",
    "Astuces pour le rendre incroyable",
    "- utilise du lait de coco bien cremeux",
    "- ajoute un peu de zeste de citron pour relever le gout",
    "- laisse reposer toute la nuit pour la meilleure texture.",
  ],
},
{
  id: "healthy-quinoa-menthe",
  title: "Salade CÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©sar healthy",
  flavor: "sale",
  prepTime: "20 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  25 min",
  servings: "2 pers",
  image: saladeCesarImg,
  ingredients: [
    "1 laitue romaine",
    "2 filets de poulet",
    "20 g de parmesan",
    "1 petite poignee de croutons",
    "Poivre noir",
    "Pour l'assaisonnement / sauce",
    "3 c. a soupe de yaourt grec",
    "1 c. a soupe d'huile d'olive",
    "1 c. a soupe de jus de citron",
    "1 c. a cafe de moutarde",
    "1 petite gousse d'ail",
    "1 c. a soupe de parmesan rape",
    "Poivre noir",
  ],
  steps: [
    "1. Cuire le poulet",
    "Preparer le poulet",
    "Coupe les filets de poulet en lanieres de taille reguliere.",
    "Cuire",
    "Fais chauffer l'huile d'olive dans une poele a feu moyen.",
    "Ajoute le poulet et fais cuire 5 a 6 minutes, en remuant de temps en temps.",
    "Le poulet doit etre bien dore et cuit a coeur.",
    "Assaisonner",
    "Ajoute un peu de poivre noir en fin de cuisson.",
    "2. Preparer la salade",
    "Laver et couper",
    "Lave la laitue romaine, puis coupe-la ou dechire-la en gros morceaux.",
    "Mettre en place",
    "Depose-la dans un grand saladier.",
    "3. Preparer la sauce Cesar healthy",
    "Melanger",
    "Dans un bol, ajoute tous les ingredients.",
    "Fouetter",
    "Melange jusqu'a obtenir une sauce lisse et cremeuse.",
    "4. Monter la salade",
    "Ajouter le poulet",
    "Ajoute le poulet chaud dans le saladier avec la laitue.",
    "Assaisonner",
    "Verse la sauce Cesar, puis melange pour bien enrober.",
    "5. Ajouter les toppings",
    "Ajouter les toppings",
    "Ajoute les croutons.",
    "Rape du parmesan par-dessus.",
    "Finaliser",
    "Ajoute un peu de poivre noir.",
    "Ta salade Cesar healthy est prete.",
  ],
},
{
  id: "healthy-snack-energetique",
  title: "Salade de fruits ananas, framboises, griottes & noix de coco",
  flavor: "sucre",
  prepTime: "8 a 10 min",
  servings: "1 pers",
  image: saladeDeFruitsAnanasImg,
  ingredients: [
    "Pour la salade de fruits",
    "300 g d'ananas frais",
    "100 g de framboises",
    "100 g de griottes (denoyautees)",
    "2 cuilleres a soupe de noix de coco en copeaux",
    "Optionnel",
    "1 cuillere a cafe de miel",
    "1/2 citron vert (jus)",
  ],
  steps: [
    "1. Couper l'ananas",
    "Preparer l'ananas",
    "Epluche l'ananas, puis coupe-le en petits cubes.",
    "Place-les dans un saladier.",
    "Des morceaux reguliers rendent la salade plus agreable a deguster.",
    "2. Ajouter les fruits rouges",
    "Ajouter les fruits",
    "Ajoute les framboises et les griottes.",
    "Melange delicatement pour ne pas ecraser les framboises.",
    "Les fruits doivent rester bien entiers.",
    "3. Ajouter l'assaisonnement",
    "Assaisonner",
    "Verse le miel et ajoute le jus de citron vert.",
    "Melange legerement.",
    "Cela cree un sirop naturel frais et parfume.",
    "4. Ajouter la noix de coco",
    "Ajouter la noix de coco",
    "Ajoute les copeaux de noix de coco.",
    "Melange doucement.",
    "5. Finition",
    "Finaliser",
    "Ajoute quelques feuilles de menthe si tu le souhaites.",
    "Sers bien frais.",
    "Ta salade de fruits est prete.",
    "Astuces pour la rendre incroyable",
    "- ajoute un peu de zeste de citron vert",
    "- fais griller legerement la noix de coco pour plus de gout",
    "- laisse reposer 10 minutes au frigo pour que les fruits fassent un jus naturel.",
  ],
},
]

const DIET_HEADINGS = {
  sweet: {
    eyebrow: "Sucre",
    title: "Ma Diet",
    description: "Toutes les idees sucrees du moment.",
  },
  savory: {
    eyebrow: "Sale",
    title: "Ma Diet",
    description: "Toutes les idees salees du moment.",
  },
  drinks: {
    eyebrow: "Boissons",
    title: "Ma Diet",
    description: "Toutes les idees boissons du moment.",
  },
  condiments: {
    eyebrow: "Condiments",
    title: "Ma Diet",
    description: "Tous les condiments du moment.",
  },
} as const

const CONDIMENT_RECIPE_IDS = [
  "mass-houmous-maison",
  "mass-tzatziki",
  "mass-sauce-vierge",
  "mass-vinaigrette-miel-moutarde-balsamique",
  "mass-sauce-tahini-cremeuse",
  "mass-sauce-asiatique-cacahuetes",
  "mass-sauce-blanche-herbes",
  "mass-chimichurri-legerement-sucre",
  "mass-sauce-aubergines-poivrons-grilles",
  "mass-sauce-poivre",
  "mass-pickles-oignons",
  "mass-pickles-concombre",
  "mass-pickles-carottes",
  "mass-pickles-chou-fleur",
  "mass-sauce-pesto-maison",
  "mass-guacamole-maison",
  "mass-chutney-mangue",
  "mass-caviar-aubergine",
  "mass-tapenade",
  "mass-sauce-teriyaki",
  "mass-huile-pimentee",
  "mass-citrons-confits",
  "mass-oignons-confits",
  "mass-ail-confit",
] as const

const RECIPE_FAVORITES_KEY = "planner.diet.recipeFavorites"
const CUSTOM_RECIPES_KEY = "planner.diet.customRecipes"
const DIET_WEEKLY_PLAN_KEY = "planner.diet.weeklyPlan"
const DIET_WEEKLY_PLAN_RECIPES_KEY = "planner.diet.weeklyPlanRecipes"

export const builtinDietRecipes: Recipe[] = [...massRecipes, ...healthyRecipes]

export const dietWeekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const
export type MealSlotId = "morning" | "midday" | "evening"
export const dietMealSlots: { id: MealSlotId; label: string }[] = [
  { id: "morning", label: "Matin" },
  { id: "midday", label: "Midi" },
  { id: "evening", label: "Soir" },
]
const weekDays = dietWeekDays
const mealSlots = dietMealSlots
const FLAVOR_OPTIONS: Array<{ value: "sucre" | "sale"; label: string }> = [
  { value: "sale", label: "SalÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©" },
  { value: "sucre", label: "SucrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©" },
]
const FLAVOR_PLACEHOLDER = "SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©lectionner un type"
const PLAN_DAY_PLACEHOLDER = "SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©lectionner un jour"
const PLAN_SLOT_PLACEHOLDER = "SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©lectionner un moment"
type WeeklyPlan = Record<typeof dietWeekDays[number], Record<MealSlotId, string>>
type DietTab = "sweet" | "savory" | "drinks" | "condiments" | "favorites" | "custom"
const DIET_TAB_STORAGE_KEY = "dietPageActiveTab"
const DIET_TABS: DietTab[] = ["sweet", "savory", "drinks", "condiments", "favorites", "custom"]

const buildDefaultWeeklyPlan = (): WeeklyPlan => {
  const plan = {} as WeeklyPlan
  dietWeekDays.forEach((day) => {
    plan[day] = { morning: "", midday: "", evening: "" }
  })
  return plan
}

const DietClassicPage = () => {
  const { isAuthReady, userId } = useAuth()
  const weekKey = getWeekKey()
  const {
    customRecipes: persistedCustomRecipes,
    favoriteRecipes: favoriteRecipeRefs,
    isLoading,
    error,
    assignRecipeToSlot,
    toggleFavoriteRecipe,
    createCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe,
  } = useUserDietData(weekKey)
  const canEdit = Boolean(userId)
  useEffect(() => {
    document.body.classList.add("diet-page--lux")
    return () => {
      document.body.classList.remove("diet-page--lux")
    }
  }, [])
  const [tab, setTab] = useState<DietTab>(() => {
    if (typeof window === "undefined") return "savory"
    const savedTab = window.localStorage.getItem(DIET_TAB_STORAGE_KEY)
    if (savedTab && DIET_TABS.includes(savedTab as DietTab)) {
      return savedTab as DietTab
    }
    return "savory"
  })
  const [selectedRecipe, setSelectedRecipe] = useState<RenderRecipe | null>(null)
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(true)
  const [planDay, setPlanDay] = useState<typeof weekDays[number]>(weekDays[0])
  const [planSlot, setPlanSlot] = useState<MealSlotId>("midday")
  const [planMealName, setPlanMealName] = useState("")
  const [planConfirmationVisible, setPlanConfirmationVisible] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [customMenuOpenId, setCustomMenuOpenId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftFlavor, setDraftFlavor] = useState<"sucre" | "sale">("sale")
  const [draftPrepTime, setDraftPrepTime] = useState("")
  const [draftServings, setDraftServings] = useState("")
  const [draftImage, setDraftImage] = useState<string | null>(null)
  const [draftImageFile, setDraftImageFile] = useState<File | null>(null)
  const [draftIngredients, setDraftIngredients] = useState("")
  const [draftSteps, setDraftSteps] = useState("")
  const [draftToppings, setDraftToppings] = useState("")
  const [draftTips, setDraftTips] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editFlavor, setEditFlavor] = useState<"sucre" | "sale">("sale")
  const [editPrepTime, setEditPrepTime] = useState("")
  const [editServings, setEditServings] = useState("")
  const [editImage, setEditImage] = useState<string | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editIngredients, setEditIngredients] = useState("")
  const [editSteps, setEditSteps] = useState("")
  const [editToppings, setEditToppings] = useState("")
  const [editTips, setEditTips] = useState("")
  const [isFlavorMenuOpen, setIsFlavorMenuOpen] = useState(false)
  const [isPlanDayMenuOpen, setIsPlanDayMenuOpen] = useState(false)
  const [isPlanSlotMenuOpen, setIsPlanSlotMenuOpen] = useState(false)
  const draftImageInputRef = useRef<HTMLInputElement | null>(null)
  const editImageInputRef = useRef<HTMLInputElement | null>(null)
  const flavorMenuRef = useRef<HTMLDivElement | null>(null)
  const planDayMenuRef = useRef<HTMLDivElement | null>(null)
  const planSlotMenuRef = useRef<HTMLDivElement | null>(null)
  const customMenuRef = useRef<HTMLDivElement | null>(null)
  const planConfirmationTimeout = useRef<number | null>(null)
  const customRecipes = useMemo<RenderRecipe[]>(
    () =>
      persistedCustomRecipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        flavor: recipe.flavor,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        image: recipe.imageUrl || wrapPouletImg,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        toppings: recipe.toppings,
        tips: recipe.tips,
        source: "custom",
        imagePath: recipe.imagePath,
      })),
    [persistedCustomRecipes],
  )
  const customRecipeIdSet = useMemo(() => new Set(customRecipes.map((recipe) => recipe.id)), [customRecipes])
  const favoriteIds = useMemo(() => new Set(favoriteRecipeRefs.map((recipe) => recipe.recipeId)), [favoriteRecipeRefs])
  const allRecipes = useMemo<RenderRecipe[]>(
    () => [
      ...builtinDietRecipes.map((recipe) => ({ ...recipe, source: "builtin" as const })),
      ...customRecipes,
    ],
    [customRecipes],
  )
  const currentHeading = tab === "favorites" || tab === "custom" ? null : DIET_HEADINGS[tab]
  const getFlavorLabel = (flavor: Recipe["flavor"]) => {
    if (flavor === "sucre") return "SucrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©"
    if (flavor === "sale") return "SalÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©"
    return "Boissons"
  }
  const getRecipeImageClass = (recipeId: string) => {
    if (recipeId === "mass-quinoa-bowl") return "diet-recipe-card__img diet-recipe-card__img--butter-chicken"
    if (recipeId === "mass-pates-cremeuses") return "diet-recipe-card__img diet-recipe-card__img--alfredo"
    if (recipeId === "mass-matcha-latte-cremeux") return "diet-recipe-card__img diet-recipe-card__img--matcha"
    if (recipeId === "mass-eau-infusee-pamplemousse-romarin") return "diet-recipe-card__img diet-recipe-card__img--pamplemousse"
    if (recipeId === "mass-boisson-avoine-cacahuete-amande") return "diet-recipe-card__img diet-recipe-card__img--boisson-avoine"
    if (recipeId === "mass-smoothie-gain") return "diet-recipe-card__img diet-recipe-card__img--smoothie-gain"
    if (recipeId === "mass-smoothie-fraise-banane-coco-whey") return "diet-recipe-card__img diet-recipe-card__img--smoothie-fraise-banane"
    if (recipeId === "mass-cafe-latte-vanille") return "diet-recipe-card__img diet-recipe-card__img--cafe-latte"
    if (recipeId === "mass-focaccia-burrata-mortadelle") return "diet-recipe-card__img diet-recipe-card__img--focaccia"
    if (recipeId === "healthy-smoothie-glow") return "diet-recipe-card__img diet-recipe-card__img--smoothie-glow"
    if (
      recipeId === "mass-jus-betterave-celeri-pomme" ||
      recipeId === "mass-moka-chocolat-cafe" ||
      recipeId === "mass-boisson-detox-orange-carotte-gingembre" ||
      recipeId === "mass-boisson-detox-pomme-celeri-citron"
    ) {
      return "diet-recipe-card__img diet-recipe-card__img--focus-top"
    }
    return "diet-recipe-card__img"
  }
  const favoriteRecipes = useMemo(() => allRecipes.filter((recipe) => favoriteIds.has(recipe.id)), [allRecipes, favoriteIds])
  const filteredRecipes = useMemo(() => {
    if (tab === "favorites") return favoriteRecipes
    if (tab === "sweet") return builtinDietRecipes.filter((recipe) => recipe.flavor === "sucre")
    if (tab === "savory") {
      return builtinDietRecipes.filter(
        (recipe) => recipe.flavor === "sale" && !CONDIMENT_RECIPE_IDS.includes(recipe.id as (typeof CONDIMENT_RECIPE_IDS)[number]),
      )
    }
    if (tab === "drinks") return builtinDietRecipes.filter((recipe) => recipe.flavor === "boisson")
    if (tab === "condiments") {
      return builtinDietRecipes.filter((recipe) =>
        CONDIMENT_RECIPE_IDS.includes(recipe.id as (typeof CONDIMENT_RECIPE_IDS)[number]),
      )
    }
    return []
  }, [favoriteRecipes, tab])

  useEffect(() => {
    window.localStorage.setItem(DIET_TAB_STORAGE_KEY, tab)
  }, [tab])

  useEffect(() => {
    if (!selectedRecipe) return
    setPlanMealName(selectedRecipe.title)
    setIsIngredientsOpen(true)
  }, [selectedRecipe])

  useEffect(() => {
    if (!isFlavorMenuOpen && !isPlanDayMenuOpen && !isPlanSlotMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (flavorMenuRef.current?.contains(target)) return
      if (planDayMenuRef.current?.contains(target)) return
      if (planSlotMenuRef.current?.contains(target)) return
      setIsFlavorMenuOpen(false)
      setIsPlanDayMenuOpen(false)
      setIsPlanSlotMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFlavorMenuOpen(false)
        setIsPlanDayMenuOpen(false)
        setIsPlanSlotMenuOpen(false)
      }
    }
    window.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFlavorMenuOpen, isPlanDayMenuOpen, isPlanSlotMenuOpen])

  useEffect(() => {
    if (!customMenuOpenId) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (customMenuRef.current?.contains(target)) return
      setCustomMenuOpenId(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCustomMenuOpenId(null)
      }
    }
    window.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [customMenuOpenId])

  useEffect(() => {
    return () => {
      if (planConfirmationTimeout.current !== null) {
        window.clearTimeout(planConfirmationTimeout.current)
      }
    }
  }, [])

  const toggleFavorite = async (recipeId: string) => {
    if (!canEdit) return
    await toggleFavoriteRecipe({
      source: customRecipeIdSet.has(recipeId) ? "custom" : "builtin",
      recipeId,
    })
  }
  const addRecipeToPlan = async () => {
    if (!selectedRecipe || !canEdit) return
    const mealName = planMealName.trim() || selectedRecipe.title
    if (!mealName) return
    await assignRecipeToSlot(planDay, planSlot, mealName, {
      source: selectedRecipe.source,
      recipeId: selectedRecipe.id,
    })
    setSelectedRecipe(null)
    setPlanConfirmationVisible(true)
    if (planConfirmationTimeout.current !== null) {
      window.clearTimeout(planConfirmationTimeout.current)
    }
    planConfirmationTimeout.current = window.setTimeout(() => {
      setPlanConfirmationVisible(false)
      planConfirmationTimeout.current = null
    }, 3000)
  }
  const handleDraftImageChange = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return
    setDraftImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null
      if (result) {
        setDraftImage(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const parseLines = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)

  const resetDraft = () => {
    setDraftTitle("")
    setDraftFlavor("sale")
    setDraftPrepTime("")
    setDraftServings("")
    setDraftImage(null)
    setDraftImageFile(null)
    setDraftIngredients("")
    setDraftSteps("")
    setDraftToppings("")
    setDraftTips("")
  }

  const resetEdit = () => {
    setEditId(null)
    setEditTitle("")
    setEditFlavor("sale")
    setEditPrepTime("")
    setEditServings("")
    setEditImage(null)
    setEditImageFile(null)
    setEditIngredients("")
    setEditSteps("")
    setEditToppings("")
    setEditTips("")
  }

  const handleCreateRecipe = async () => {
    if (!canEdit) return
    const title = draftTitle.trim()
    if (!title) return
    const ingredients = parseLines(draftIngredients)
    const steps = parseLines(draftSteps)
    let imageUrl = ""
    let imagePath: string | undefined
    if (draftImageFile) {
      const uploaded = await uploadImage(draftImageFile, "diet-custom-recipe-image", title)
      imageUrl = uploaded.url
      imagePath = uploaded.path
    }
    const recipeInput = {
      title,
      flavor: draftFlavor,
      prepTime: draftPrepTime.trim() || "-",
      servings: draftServings.trim() || "-",
      imageUrl,
      imagePath,
      ingredients,
      steps,
      toppings: parseLines(draftToppings),
      tips: parseLines(draftTips),
    }
    const createdId = await createCustomRecipe(recipeInput)
    const recipe: RenderRecipe = {
      id: createdId ?? `custom-${Date.now()}`,
      title: recipeInput.title,
      flavor: recipeInput.flavor,
      prepTime: recipeInput.prepTime,
      servings: recipeInput.servings,
      image: recipeInput.imageUrl || wrapPouletImg,
      ingredients: recipeInput.ingredients,
      steps: recipeInput.steps,
      toppings: recipeInput.toppings,
      tips: recipeInput.tips,
      source: "custom",
      imagePath: recipeInput.imagePath,
    }
    setSelectedRecipe(recipe)
    setPlanMealName(recipe.title)
    setIsCreateOpen(false)
    resetDraft()
  }

  const openEditRecipe = (recipe: RenderRecipe) => {
    setEditId(recipe.id)
    setEditTitle(recipe.title)
    setEditFlavor(recipe.flavor === "sucre" ? "sucre" : "sale")
    setEditPrepTime(recipe.prepTime)
    setEditServings(recipe.servings)
    setEditImage(recipe.image)
    setEditImageFile(null)
    setEditIngredients(recipe.ingredients.join("\n"))
    setEditSteps(recipe.steps.join("\n"))
    setEditToppings(recipe.toppings ? recipe.toppings.join("\n") : "")
    setEditTips(recipe.tips ? recipe.tips.join("\n") : "")
    setIsEditOpen(true)
  }

  const handleEditImageChange = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return
    setEditImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null
      if (result) {
        setEditImage(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateRecipe = async () => {
    if (!canEdit) return
    if (!editId) return
    const title = editTitle.trim()
    if (!title) return
    const ingredients = parseLines(editIngredients)
    const steps = parseLines(editSteps)
    const current = persistedCustomRecipes.find((recipe) => recipe.id === editId)
    let imageUrl = current?.imageUrl || ""
    let imagePath = current?.imagePath
    if (editImageFile) {
      const uploaded = await uploadImage(editImageFile, "diet-custom-recipe-image", editId)
      imageUrl = uploaded.url
      imagePath = uploaded.path
      if (current?.imagePath && current.imagePath !== uploaded.path) {
        void deleteMedia(current.imagePath).catch(() => undefined)
      }
    }
    const updatedRecipe: RenderRecipe = {
      id: editId,
      title,
      flavor: editFlavor,
      prepTime: editPrepTime.trim() || "-",
      servings: editServings.trim() || "-",
      image: imageUrl || editImage || wrapPouletImg,
      ingredients,
      steps,
      toppings: parseLines(editToppings),
      tips: parseLines(editTips),
      source: "custom",
      imagePath,
    }
    await updateCustomRecipe(editId, {
      title: updatedRecipe.title,
      flavor: updatedRecipe.flavor,
      prepTime: updatedRecipe.prepTime,
      servings: updatedRecipe.servings,
      imageUrl,
      imagePath,
      ingredients: updatedRecipe.ingredients,
      steps: updatedRecipe.steps,
      toppings: updatedRecipe.toppings,
      tips: updatedRecipe.tips,
    })
    if (selectedRecipe?.id === editId) {
      setSelectedRecipe(updatedRecipe)
    }
    setIsEditOpen(false)
    resetEdit()
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!canEdit) return
    const current = persistedCustomRecipes.find((recipe) => recipe.id === recipeId)
    if (favoriteIds.has(recipeId)) {
      await toggleFavoriteRecipe({ source: "custom", recipeId })
    }
    await deleteCustomRecipe(recipeId)
    if (current?.imagePath) {
      void deleteMedia(current.imagePath).catch(() => undefined)
    }
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(null)
    }
  }

  const renderHeartIcon = (isActive: boolean) =>
    isActive ? (
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ef4444" strokeWidth="1.5" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z"
          fill="#ef4444"
        />
      </svg>
    ) : (
      <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ef4444" aria-hidden="true">
        <path
          d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );

  const isDietLoading = !isAuthReady || isLoading

  if (isDietLoading) {
    return (
      <div className="diet-gymgirl-page diet-gymgirl-page--loading" aria-busy="true" aria-live="polite">
        <span className="diet-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
  <>
    

    <main className="diet-gymgirl-page">
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer tes recettes et favoris.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}
      <article className="diet-blog">
        {currentHeading ? (
          <>
            <PageHeading
              eyebrow={currentHeading.eyebrow}
              title="Ma diet"
              className="diet-page-heading"
            />
          </>
        ) : (
          <>
            <PageHeading
              eyebrow="Favoris"
              title="Ma diet"
              className="diet-page-heading"
            />
          </>
        )}
        <div className="diet-crosslink">
          <div>
            <p className="diet-crosslink__label">Planifier ta semaine</p>
            <p className="diet-crosslink__text">
              Passe sur la page Alimentation pour organiser tes repas et ta liste de courses.
            </p>
          </div>
          <Link to="/alimentation" className="pill pill--diet">
            Planifier les repas
          </Link>
        </div>
        <div className="diet-toggle diet-toggle--heading">
          <button
            type="button"
            className={tab === "savory" ? "is-active" : ""}
            onClick={() => setTab("savory")}
          >
            SalÃƒÆ’Ã‚Â©
          </button>
          <button
            type="button"
            className={tab === "sweet" ? "is-active" : ""}
            onClick={() => setTab("sweet")}
          >
            SucrÃƒÆ’Ã‚Â©
          </button>
          <button
            type="button"
            className={tab === "drinks" ? "is-active" : ""}
            onClick={() => setTab("drinks")}
          >
            Boissons
          </button>
          <button
            type="button"
            className={tab === "condiments" ? "is-active" : ""}
            onClick={() => setTab("condiments")}
          >
            Condiments
          </button>
          <button
            type="button"
            className={tab === "custom" ? "is-active" : ""}
            onClick={() => setTab("custom")}
          >
            Mes recettes
          </button>
          <button
            type="button"
            className={tab === "favorites" ? "is-active" : ""}
            onClick={() => setTab("favorites")}
          >
            Favoris
          </button>
        </div>
      </article>

      <section className="diet-blog">
        {tab === "favorites" ? (
          favoriteRecipes.length > 0 ? (
            <div className="diet-recipe-grid">
              {favoriteRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="diet-recipe-card"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="diet-recipe-card__media">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      loading="lazy"
                      decoding="async"
                      className={getRecipeImageClass(recipe.id)}
                    />
                  </div>
                  <div className="diet-recipe-card__overlay" />
                  <div className="diet-recipe-card__content">
                    <div className="diet-recipe-card__header">
                      <button
                        type="button"
                        className={
                          favoriteIds.has(recipe.id)
                            ? "diet-favorite is-active"
                            : "diet-favorite"
                        }
                        onClick={(event) => {
                          event.stopPropagation()
                          void toggleFavorite(recipe.id)
                        }}
                        aria-label="Ajouter aux favoris"
                        disabled={!canEdit}
                      >
                        {renderHeartIcon(favoriteIds.has(recipe.id))}
                      </button>
                    </div>
                    <div className="diet-recipe-card__body">
                      <h3>{recipe.title}</h3>
                      <div className="diet-recipe-meta">
                        <span className="diet-info-pill">
                          {getFlavorLabel(recipe.flavor)}
                        </span>
                        <span className="diet-info-pill">
                          {recipe.prepTime}
                        </span>
                        <span className="diet-info-pill">
                          {recipe.servings}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="routine-note__composer-hint diet-favorites-empty-message">Aucune recette favorite pour le moment. Ajoute des recettes a tes favoris pour les retrouver ici.</p>
          )
        ) : tab === "custom" ? (
          <>
            <div className="diet-custom-header">
              <div>
                <h3>Mes recettes</h3>
                <p className="diet-custom-header__hint">Clique sur "Creer une recette" pour ajouter tes propres recettes en quelques secondes.</p>
              </div>
              <button type="button" className="pill pill--diet" onClick={() => setIsCreateOpen(true)} disabled={!canEdit}>
                CrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©er une recette
              </button>
            </div>
            {customRecipes.length > 0 ? (
              <div className="diet-recipe-grid">
                  {customRecipes.map((recipe) => (
                    <article
                      key={recipe.id}
                      className="diet-recipe-card"
                      onClick={() => {
                        setCustomMenuOpenId(null)
                        setSelectedRecipe(recipe)
                      }}
                    >
                      <div className="diet-recipe-card__media">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          loading="lazy"
                          decoding="async"
                          className={getRecipeImageClass(recipe.id)}
                        />
                      </div>
                      <div className="diet-recipe-card__overlay" />
                      <div className="diet-recipe-card__content">
                        <div
                          ref={customMenuOpenId === recipe.id ? customMenuRef : null}
                          className="diet-recipe-card__header"
                        >
                          <button
                            type="button"
                            className="diet-recipe-card__menu"
                            onClick={(event) => {
                              event.stopPropagation()
                              setCustomMenuOpenId((prev) => (prev === recipe.id ? null : recipe.id))
                            }}
                            aria-label="Ouvrir le menu"
                          >
                            <span />
                            <span />
                            <span />
                          </button>
                          {customMenuOpenId === recipe.id ? (
                            <div
                              className="wishlist-card__menu-popover"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomMenuOpenId(null)
                                  openEditRecipe(recipe)
                                }}
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomMenuOpenId(null)
                                  void handleDeleteRecipe(recipe.id)
                                }}
                              >
                                Supprimer
                              </button>
                            </div>
                          ) : null}
                          <button
                            type="button"
                            className={favoriteIds.has(recipe.id) ? "diet-favorite is-active" : "diet-favorite"}
                            onClick={(event) => {
                              event.stopPropagation()
                            void toggleFavorite(recipe.id)
                          }}
                          aria-label="Ajouter aux favoris"
                          disabled={!canEdit}
                        >
                          {renderHeartIcon(favoriteIds.has(recipe.id))}
                        </button>
                      </div>
                      <div className="diet-recipe-card__body">
                        <h3>{recipe.title}</h3>
                        <div className="diet-recipe-meta">
                          <span className="diet-info-pill">
                            {getFlavorLabel(recipe.flavor)}
                          </span>
                          <span className="diet-info-pill">
                            {recipe.prepTime}
                          </span>
                          <span className="diet-info-pill">
                            {recipe.servings}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              null
            )}
          </>
        ) : (
          <div className="diet-recipe-grid">
            {filteredRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="diet-recipe-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="diet-recipe-card__media">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    loading="lazy"
                    decoding="async"
                    className={getRecipeImageClass(recipe.id)}
                  />
                </div>
                <div className="diet-recipe-card__overlay" />
                <div className="diet-recipe-card__content">
                  <div className="diet-recipe-card__header">
                    <button
                      type="button"
                      className={favoriteIds.has(recipe.id) ? "diet-favorite is-active" : "diet-favorite"}
                      onClick={(event) => {
                        event.stopPropagation()
                        void toggleFavorite(recipe.id)
                      }}
                      aria-label="Ajouter aux favoris"
                      disabled={!canEdit}
                    >
                      {renderHeartIcon(favoriteIds.has(recipe.id))}
                    </button>
                  </div>
                  <div className="diet-recipe-card__body">
                    <h3>{recipe.title}</h3>
                    <div className="diet-recipe-meta">
                      <span className="diet-info-pill">
                        {getFlavorLabel(recipe.flavor)}
                      </span>
                      <span className="diet-info-pill">
                        {recipe.prepTime}
                      </span>
                      <span className="diet-info-pill">
                        {recipe.servings}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

        {isCreateOpen ? (
          <div className="diet-recipe-modal" role="dialog" aria-label="CrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©er une recette">
            <div className="diet-recipe-modal__backdrop" onClick={() => setIsCreateOpen(false)} />
            <div className="diet-recipe-modal__panel">
              {draftImage ? (
                <div className="diet-recipe-modal__cover">
                  <img
                    src={draftImage}
                    alt="AperÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§u recette"
                    className="diet-recipe-modal__image"
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    type="button"
                    className="diet-recipe-close-icon diet-recipe-close-icon--cover"
                    onClick={() => setIsCreateOpen(false)}
                    aria-label="Fermer"
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              <div className="diet-recipe-modal__content">
                <header className="diet-recipe-modal__header">
                  <div>
                    <h3>CrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©er une recette</h3>
                  </div>
                </header>
                <div className="diet-recipe-modal__body">
                  <div className="diet-recipe-form">
                    <label>
                      Titre
                      <input type="text" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
                    </label>
                    <div className="diet-recipe-form__row">
                      <label>
                        Type
                        <div className="workout-form__select" ref={flavorMenuRef}>
                          <button
                            type="button"
                            className={
                              draftFlavor ? "workout-form__select-trigger" : "workout-form__select-trigger is-placeholder"
                            }
                            aria-haspopup="listbox"
                            aria-expanded={isFlavorMenuOpen}
                            onClick={() => {
                              setIsFlavorMenuOpen((prev) => !prev)
                              setIsPlanDayMenuOpen(false)
                              setIsPlanSlotMenuOpen(false)
                            }}
                          >
                            <span>
                              {draftFlavor
                                ? FLAVOR_OPTIONS.find((option) => option.value === draftFlavor)?.label ?? draftFlavor
                                : FLAVOR_PLACEHOLDER}
                            </span>
                            <svg className="workout-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                              <path
                                d="M5 7.5L10 12.5L15 7.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {isFlavorMenuOpen ? (
                            <div className="workout-form__select-menu" role="listbox">
                              {FLAVOR_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  role="option"
                                  aria-selected={draftFlavor === option.value}
                                  className={draftFlavor === option.value ? "is-selected" : undefined}
                                  onMouseDown={(event) => {
                                    event.preventDefault()
                                    setDraftFlavor(option.value)
                                    setIsFlavorMenuOpen(false)
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </label>
                      <label>
                        PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©paration
                        <input type="text" value={draftPrepTime} onChange={(event) => setDraftPrepTime(event.target.value)} placeholder="Ex : 20 min" />
                      </label>
                      <label>
                        Portions
                        <input type="text" value={draftServings} onChange={(event) => setDraftServings(event.target.value)} placeholder="Ex : 2 pers" />
                      </label>
                    </div>
                    <label className="diet-recipe-form__file">
                      Image
                      <input
                        ref={draftImageInputRef}
                        type="file"
                        accept="image/*"
                        className="diet-recipe-form__file-input"
                        onChange={(event) => {
                          handleDraftImageChange(event.target.files?.[0])
                          event.target.value = ""
                        }}
                      />
                      <button
                        type="button"
                        className="diet-recipe-form__file-button"
                        onClick={() => draftImageInputRef.current?.click()}
                      >
                        Choisir une image
                      </button>
                    </label>
                    <label>
                      IngrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dients (1 par ligne)
                      <textarea value={draftIngredients} onChange={(event) => setDraftIngredients(event.target.value)} rows={5} />
                    </label>
                    <label>
                      ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°tapes (1 par ligne)
                      <textarea value={draftSteps} onChange={(event) => setDraftSteps(event.target.value)} rows={6} />
                    </label>
                    <label>
                      Toppings (optionnel)
                      <textarea value={draftToppings} onChange={(event) => setDraftToppings(event.target.value)} rows={3} />
                    </label>
                    <label>
                      Astuces (optionnel)
                      <textarea value={draftTips} onChange={(event) => setDraftTips(event.target.value)} rows={3} />
                    </label>
                  </div>
                </div>
              </div>
              <footer className="diet-recipe-modal__actions">
                <button type="button" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </button>
                <button type="button" onClick={() => void handleCreateRecipe()} disabled={!canEdit}>
                  Enregistrer
                </button>
              </footer>
            </div>
          </div>
        ) : null}

        {isEditOpen ? (
          <div className="diet-recipe-modal" role="dialog" aria-label="Modifier une recette">
            <div
              className="diet-recipe-modal__backdrop"
              onClick={() => {
                setIsEditOpen(false)
                resetEdit()
              }}
            />
            <div className="diet-recipe-modal__panel">
              {editImage ? (
                <div className="diet-recipe-modal__cover">
                  <img
                    src={editImage}
                    alt="AperÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§u recette"
                    className="diet-recipe-modal__image"
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    type="button"
                    className="diet-recipe-close-icon diet-recipe-close-icon--cover"
                    onClick={() => {
                      setIsEditOpen(false)
                      resetEdit()
                    }}
                    aria-label="Fermer"
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              <div className="diet-recipe-modal__content">
                <header className="diet-recipe-modal__header">
                  <div>
                    <h3>Modifier une recette</h3>
                  </div>
                </header>
                <div className="diet-recipe-modal__body">
                  <div className="diet-recipe-form">
                    <label>
                      Titre
                      <input type="text" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                    </label>
                    <div className="diet-recipe-form__row">
                      <label>
                        Type
                        <select value={editFlavor} onChange={(event) => setEditFlavor(event.target.value as "sucre" | "sale")}>
                          <option value="sale">SalÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©</option>
                          <option value="sucre">SucrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©</option>
                        </select>
                      </label>
                      <label>
                        PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©paration
                        <input type="text" value={editPrepTime} onChange={(event) => setEditPrepTime(event.target.value)} placeholder="Ex : 20 min" />
                      </label>
                      <label>
                        Portions
                        <input type="text" value={editServings} onChange={(event) => setEditServings(event.target.value)} placeholder="Ex : 2 pers" />
                      </label>
                    </div>
                    <label className="diet-recipe-form__file">
                      Image
                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        className="diet-recipe-form__file-input"
                        onChange={(event) => {
                          handleEditImageChange(event.target.files?.[0])
                          event.target.value = ""
                        }}
                      />
                      <button
                        type="button"
                        className="diet-recipe-form__file-button"
                        onClick={() => editImageInputRef.current?.click()}
                      >
                        Choisir une image
                      </button>
                    </label>
                    <label>
                      IngrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dients (1 par ligne)
                      <textarea value={editIngredients} onChange={(event) => setEditIngredients(event.target.value)} rows={5} />
                    </label>
                    <label>
                      ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°tapes (1 par ligne)
                      <textarea value={editSteps} onChange={(event) => setEditSteps(event.target.value)} rows={6} />
                    </label>
                    <label>
                      Toppings (optionnel)
                      <textarea value={editToppings} onChange={(event) => setEditToppings(event.target.value)} rows={3} />
                    </label>
                    <label>
                      Astuces (optionnel)
                      <textarea value={editTips} onChange={(event) => setEditTips(event.target.value)} rows={3} />
                    </label>
                  </div>
                </div>
              </div>
              <footer className="diet-recipe-modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false)
                    resetEdit()
                  }}
                >
                  Annuler
                </button>
                <button type="button" onClick={() => void handleUpdateRecipe()} disabled={!canEdit}>
                  Enregistrer
                </button>
              </footer>
            </div>
          </div>
        ) : null}

        {planConfirmationVisible ? (
          <div className="diet-plan__confirmation-card" role="status" aria-live="polite">
            <p>La recette a bien ete ajoutee sur la page cuisine.</p>
          </div>
        ) : null}

        {selectedRecipe ? (
          <div className="diet-recipe-modal" role="dialog" aria-label={`Recette ${selectedRecipe.title}`}>
            <div className="diet-recipe-modal__backdrop" onClick={() => setSelectedRecipe(null)} />
            <div className="diet-recipe-modal__panel">
              <div className="diet-recipe-modal__cover">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} className="diet-recipe-modal__image" loading="lazy" decoding="async" />
                <button
                  type="button"
                  className="diet-recipe-close-icon diet-recipe-close-icon--cover"
                  onClick={() => setSelectedRecipe(null)}
                  aria-label="Fermer"
                >
                  <span aria-hidden="true" />
                </button>
              </div>
              <div className="diet-recipe-modal__content">
                <header className="diet-recipe-modal__header">
                  <div>
                    <h3>{selectedRecipe.title}</h3>
                    <div className="diet-plan-modal__meta">
                      <span>{getFlavorLabel(selectedRecipe.flavor)}</span>
                      <span>{selectedRecipe.prepTime}</span>
                      <span>{selectedRecipe.servings}</span>
                    </div>
                  </div>
                </header>
                <div className="diet-recipe-modal__body">
                  <section className="diet-recipe-plan">
                    <h4>Ajouter au planning</h4>
                    <div className="diet-recipe-plan__row">
                      <label>
                        Jour
                        <div className="workout-form__select" ref={planDayMenuRef}>
                          <button
                            type="button"
                            className={planDay ? "workout-form__select-trigger" : "workout-form__select-trigger is-placeholder"}
                            aria-haspopup="listbox"
                            aria-expanded={isPlanDayMenuOpen}
                            onClick={() => {
                              setIsPlanDayMenuOpen((prev) => !prev)
                              setIsFlavorMenuOpen(false)
                              setIsPlanSlotMenuOpen(false)
                            }}
                          >
                            <span>{planDay || PLAN_DAY_PLACEHOLDER}</span>
                            <svg className="workout-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                              <path
                                d="M5 7.5L10 12.5L15 7.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {isPlanDayMenuOpen ? (
                            <div className="workout-form__select-menu" role="listbox">
                              {weekDays.map((day) => (
                                <button
                                  key={day}
                                  type="button"
                                  role="option"
                                  aria-selected={planDay === day}
                                  className={planDay === day ? "is-selected" : undefined}
                                  onMouseDown={(event) => {
                                    event.preventDefault()
                                    setPlanDay(day)
                                    setIsPlanDayMenuOpen(false)
                                  }}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </label>
                      <label>
                        Moment
                        <div className="workout-form__select" ref={planSlotMenuRef}>
                          <button
                            type="button"
                            className={planSlot ? "workout-form__select-trigger" : "workout-form__select-trigger is-placeholder"}
                            aria-haspopup="listbox"
                            aria-expanded={isPlanSlotMenuOpen}
                            onClick={() => {
                              setIsPlanSlotMenuOpen((prev) => !prev)
                              setIsFlavorMenuOpen(false)
                              setIsPlanDayMenuOpen(false)
                            }}
                          >
                            <span>{mealSlots.find((slot) => slot.id === planSlot)?.label ?? PLAN_SLOT_PLACEHOLDER}</span>
                            <svg className="workout-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                              <path
                                d="M5 7.5L10 12.5L15 7.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {isPlanSlotMenuOpen ? (
                            <div className="workout-form__select-menu" role="listbox">
                              {mealSlots.map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  role="option"
                                  aria-selected={planSlot === slot.id}
                                  className={planSlot === slot.id ? "is-selected" : undefined}
                                  onMouseDown={(event) => {
                                    event.preventDefault()
                                    setPlanSlot(slot.id)
                                    setIsPlanSlotMenuOpen(false)
                                  }}
                                >
                                  {slot.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </label>
                    </div>
                    <label>
                      Plat
                      <input
                        type="text"
                        value={planMealName}
                        onChange={(event) => setPlanMealName(event.target.value)}
                        placeholder="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°cris ton plat"
                      />
                    </label>
                    <button type="button" className="diet-recipe-plan__add" onClick={() => void addRecipeToPlan()} disabled={!canEdit}>
                      Ajouter au planning
                    </button>
                  </section>
                  {selectedRecipe.ingredients.length > 0 ? (
                    <section>
                      <div className="diet-recipe-section__header">
                        <h4>IngrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dients</h4>
                        <button
                          type="button"
                          className={`diet-recipe-section__toggle${isIngredientsOpen ? " is-open" : ""}`}
                          onClick={() => setIsIngredientsOpen((prev) => !prev)}
                          aria-label={isIngredientsOpen ? "Masquer les ingredients" : "Afficher les ingredients"}
                          aria-expanded={isIngredientsOpen}
                        >
                          v
                        </button>
                      </div>
                      {isIngredientsOpen ? (
                        ingredientVisualsByRecipeId[selectedRecipe.id] ? (
                          <div className="diet-ingredient-visuals">
                            {ingredientVisualsByRecipeId[selectedRecipe.id].flatMap((item, index, items) => {
                              const previous = index > 0 ? items[index - 1] : null
                              const showSectionTitle = Boolean(item.sectionTitle) && item.sectionTitle !== previous?.sectionTitle
                              return [
                                ...(showSectionTitle
                                  ? [
                                      <p key={`${item.id}-section`} className="diet-ingredient-visuals__section">
                                        {item.sectionTitle}
                                      </p>,
                                    ]
                                  : []),
                                <article key={item.id} className="diet-ingredient-visual">
                                  <img src={item.image} alt={item.label} loading="lazy" decoding="async" />
                                  <p>{item.detail}</p>
                                </article>,
                              ]
                            })}
                          </div>
                        ) : (
                          <ul>
                            {selectedRecipe.ingredients.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        )
                      ) : null}
                    </section>
                  ) : null}
                  {selectedRecipe.steps.length > 0 ? (
                    <section>
                      <h4>ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°tapes</h4>
                      <ul className="diet-steps-list">
                        {selectedRecipe.steps.map((step, index, allSteps) => {
                          const normalizeStep = (value: string) => value.replace(/\u00A0/g, " ").trim()
                          const normalizedStep = normalizeStep(step)
                          const isTipBoxTitle = /^Astuces?\s+pour/i.test(normalizedStep)
                          const isStepTitle = /^\d+\.\s/.test(normalizedStep)
                          const isAdviceTitle =
                            /^Conseils? pour/.test(normalizedStep) ||
                            /^Astuces? pour/.test(normalizedStep) ||
                            /^Les 3 secrets/.test(normalizedStep) ||
                            /^Les secrets/.test(normalizedStep) ||
                            /^Secrets pour/.test(normalizedStep) ||
                            /^Valeurs approximatives/.test(normalizedStep)
                          const isStepSubTitle =
                            /^(Preparer les ingredients|Preparer l'avocat|Assembler les ingredients solides|Assaisonner|Melanger delicatement|Preparer le saumon|Preparer l'ananas|Chauffer la poele|Cuire cote peau|Retourner le saumon|Verifier la cuisson|Rincer le riz|Mettre en cuisson|Porter a ebullition|Cuire a feu doux|Laisser reposer|Aerer le riz|Preparer le poulet|Preparer la marinade|Enrober le poulet|Preparer les brocolis|Cuire a l'eau|Egoutter|Ajouter les ingredients|Ajouter les ingredients liquides|Melanger et chauffer|Laisser mijoter|Ajuster la texture|Disposer le riz|Ajouter le butter chicken|Ajouter les brocolis|Porter l'eau a ebullition|Cuire les pates|Reserver un peu d'eau de cuisson|Reserver l'eau de cuisson|Cuire le poulet|Ajouter les tomates|Cuire legerement|Ajouter les pates|Incorporer la sauce|Melanger|Incorporer le fromage|Servir|Finaliser|Couper les legumes|Preparer les autres ingredients|Ecraser l'avocat|Ecraser les bananes|Preparer la base|Preparer la pate|Disposer la base|Ajouter les garnitures|Ajouter le guacamole|Preparer les pommes de terre|Cuire au four|Cuire les haricots verts|Assaisonner et cuire|Disposer dans l'assiette|Ajouter le steak|Aerer|Couper|Rincer|Couper le brocoli|Cuire|Egoutter et ajuster|Faire revenir|Melanger les liquides|Melanger les ingredients liquides|Melanger les ingredients secs|Ajouter la farine|Assaisonner et melanger|Preparer le four|Prechauffer le four|Enfourner|Laisser refroidir|Decouper|Preparer les tomates|Ajouter les fruits|Ajouter le croquant|Ajouter la noix de coco|Former les biscuits|Assembler|Ajouter la vinaigrette|Disposer la salade|Ajouter la burrata|Ajouter le jambon|Ajouter les herbes|Preparer et cuire|Parfumer|Creer la base|Rendre la sauce cremeuse|Incorporer les pates|Garnir|Rouler|Cuire le riz|Couper et assaisonner|Melanger et mariner|Preparer|Laisser mariner|Monter les brochettes|Disposer|Ajouter le poulet|Completer|Couper et laver|Chauffer|Ajouter l'ail|Ajouter les legumes|Incorporer|Cuire brievement|Mettre en place|Fouetter|Ajouter les framboises|Ajouter les toppings|Ajouter les noisettes|Ajouter le citron|Verifier|Ajouter le saumon|Refroidir et couper|Mixer les ingredients|Empiler|Prechauffer et melanger|Faconner|Former les bouchees|Faire fondre|Tremper|Deposer|Refroidir|Preparer les dattes|Ecraser les biscuits|Former la base|Refrigerer|Etaler|Ajouter le chocolat|Laisser durcir|Laisser epaissir|Glacer)$/.test(
                              normalizedStep
                            )
                          const isSubItem = /^-\s/.test(normalizedStep)
                          const previousNonSubStep = (() => {
                            for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
                              const candidate = normalizeStep(allSteps[cursor])
                              if (!/^\-\s/.test(candidate)) return candidate
                            }
                            return ""
                          })()
                          const isTipBoxItem = isSubItem && /^Astuces?\s+pour/i.test(previousNonSubStep)
                          const nextIsTipBoxItem = (() => {
                            const nextIndex = index + 1
                            if (nextIndex >= allSteps.length) return false
                            const nextStep = normalizeStep(allSteps[nextIndex])
                            return /^\-\s/.test(nextStep)
                          })()
                          const isSubNoBullet =
                            /^Le saumon est pret lorsque\s*:$/i.test(normalizedStep) ||
                            /^Depose le saumon sur une assiette et assaisonne\s*:$/i.test(normalizedStep) ||
                            /^Dans un petit bol\s*:$/i.test(normalizedStep) ||
                            /^Ajoute\s*:$/i.test(normalizedStep) ||
                            /^Dans un bol, ajoute tous les ingredients\.$/i.test(normalizedStep) ||
                            /^Dans un bol,\s*ajoute\s*:$/i.test(normalizedStep) ||
                            /^Ajoute a la pate\s*:$/i.test(normalizedStep) ||
                            /^Dans la poele .* ajoute\s*:$/i.test(normalizedStep) ||
                            /^Place-les dans un bol et ajoute\s*:$/i.test(normalizedStep) ||
                            /^Ajoute ensuite\s*:$/i.test(normalizedStep) ||
                            /^Fais cuire selon la cuisson souhaitee\s*:$/i.test(normalizedStep) ||
                            /^Dispose harmonieusement par[- ]dessus\s*:$/i.test(normalizedStep) ||
                            /^Ajoute par[- ]dessus\s*:$/i.test(normalizedStep) ||
                            /^Tu peux aussi ajouter, selon tes envies\s*:$/i.test(normalizedStep) ||
                            /^Tu peux aussi ajouter selon tes envies\s*:$/i.test(normalizedStep) ||
                            /^Sers le curry bien chaud, accompagne de\s*:$/i.test(normalizedStep) ||
                            /^Verse ensuite\s*:$/i.test(normalizedStep) ||
                            /^Le brownie est pret lorsque\s*:$/i.test(normalizedStep) ||
                            /^du beurre de cacahuete$/i.test(normalizedStep) ||
                            /^des noix$/i.test(normalizedStep) ||
                            /^ou quelques morceaux de chocolat$/i.test(normalizedStep)
                          const isItalicNote =
                            /^N'en mets pas trop pour ne pas cuire le poisson avant la cuisson\.$/i.test(normalizedStep) ||
                            /^La peau doit devenir doree et croustillante\.$/i.test(normalizedStep) ||
                            /^L'huile doit etre chaude mais pas fumante\.$/i.test(normalizedStep) ||
                            /^Le citron est essentiel : il apporte de la fraicheur et empeche l'avocat de noircir\.$/i.test(normalizedStep) ||
                            /^Il doit etre mur mais encore ferme pour garder une belle texture\.$/i.test(normalizedStep) ||
                            /^Retire legerement les graines si la tomate est tres juteuse, pour eviter que la salsa ne devienne trop liquide\.$/i.test(normalizedStep) ||
                            /^Cela permet d'enlever l'exces d'amidon et d'obtenir un riz moins collant\.$/i.test(normalizedStep) ||
                            /^Cette etape permet au riz de finir d'absorber l'humidite\.$/i.test(normalizedStep) ||
                            /^Cela permet une cuisson homogene et une meilleure absorption de la marinade\.$/i.test(normalizedStep) ||
                            /^Chaque morceau doit etre entierement recouvert pour un maximum de gout\.$/i.test(normalizedStep) ||
                            /^Si tu as plus de temps, tu peux laisser mariner plus longtemps pour des saveurs encore plus intenses\.$/i.test(normalizedStep) ||
                            /^Ils doivent rester legerement fermes et bien verts\.$/i.test(normalizedStep) ||
                            /^Pour conserver leur couleur vive, tu peux les passer rapidement sous l'eau froide \(optionnel\)\.$/i.test(normalizedStep) ||
                            /^Le poulet doit etre bien dore a l'exterieur\.$/i.test(normalizedStep) ||
                            /^Melange legerement des le debut pour bien repartir les saveurs\.$/i.test(normalizedStep) ||
                            /^La sauce va progressivement epaissir et developper ses aromes\.$/i.test(normalizedStep) ||
                            /^N'hesite pas a ajouter un peu de sauce pour bien napper le riz\.$/i.test(normalizedStep) ||
                            /^Elle doit etre legerement croustillante a l'exterieur tout en restant moelleuse a l'interieur\.$/i.test(normalizedStep) ||
                            /^Cela apporte plus de volume et une texture plus agreable en bouche\.$/i.test(normalizedStep) ||
                            /^C'est ce qui rend le sandwich fondant et gourmand\.$/i.test(normalizedStep) ||
                            /^La roquette apporte une touche de fraicheur et un leger cote poivre\.$/i.test(normalizedStep) ||
                            /^Les pates doivent etre al dente : tendres mais encore legerement fermes\.$/i.test(normalizedStep) ||
                            /^Cette eau riche en amidon est ideale pour lier une sauce\.$/i.test(normalizedStep) ||
                            /^Cela permet une cuisson homogene\.$/i.test(normalizedStep) ||
                            /^Le poulet doit etre bien dore et cuit a coeur\.$/i.test(normalizedStep) ||
                            /^Les tomates doivent devenir legerement fondantes tout en gardant leur forme\.$/i.test(normalizedStep) ||
                            /^Les pates doivent etre bien enrobees de sauce\.$/i.test(normalizedStep) ||
                            /^L'exterieur doit etre dore, tout en gardant un peu de moelleux a l'interieur\.$/i.test(normalizedStep) ||
                            /^Le citron apporte de la fraicheur et evite a l'avocat de noircir\.$/i.test(normalizedStep) ||
                            /^Le blanc doit etre pris, tandis que le jaune reste coulant\.$/i.test(normalizedStep) ||
                            /^Cette base apporte toute la profondeur de gout au curry\.$/i.test(normalizedStep) ||
                            /^Cela permet de liberer les aromes des epices\.$/i.test(normalizedStep) ||
                            /^La sauce doit devenir homogene et legerement onctueuse\.$/i.test(normalizedStep) ||
                            /^Si la sauce devient trop epaisse, ajoute un petit peu d'eau pour ajuster la texture\.$/i.test(normalizedStep) ||
                            /^Le citron apporte une touche de fraicheur qui equilibre les epices\.$/i.test(normalizedStep) ||
                            /^Chaque morceau doit etre bien impregne pour un maximum de saveur\.$/i.test(normalizedStep) ||
                            /^Meme un court temps de marinade permet deja de parfumer le poulet\.$/i.test(normalizedStep) ||
                            /^La poele doit etre bien chaude pour saisir le poulet\.$/i.test(normalizedStep) ||
                            /^Le poulet doit etre bien dore a l'exterieur et cuit a coeur\.$/i.test(normalizedStep) ||
                            /^Cela enleve l'exces de sel et ameliore le gout\.$/i.test(normalizedStep) ||
                            /^Tu peux le tasser legerement pour une base stable\.$/i.test(normalizedStep) ||
                            /^Elles doivent etre dorees et croustillantes a l'exterieur, tout en restant tendres a l'interieur\.$/i.test(normalizedStep) ||
                            /^Les haricots doivent etre tendres tout en gardant une legere fermete\.$/i.test(normalizedStep) ||
                            /^Une cuisson rapide permet de former une belle croute tout en gardant la viande juteuse\.$/i.test(normalizedStep) ||
                            /^Cela apporte une touche de fraicheur et de couleur\.$/i.test(normalizedStep) ||
                            /^Cela enleve son amertume naturelle\.$/i.test(normalizedStep) ||
                            /^L'eau doit etre completement absorbee\.$/i.test(normalizedStep) ||
                            /^Cela permet au quinoa de finir de gonfler\.$/i.test(normalizedStep) ||
                            /^Des morceaux reguliers permettent un melange harmonieux\.$/i.test(normalizedStep) ||
                            /^Cela enleve l'exces de sel et ameliore leur gout\.$/i.test(normalizedStep) ||
                            /^Melange legerement ou laisse tel quel pour un joli visuel\.$/i.test(normalizedStep) ||
                            /^Le brocoli doit etre tendre mais encore legerement ferme\.$/i.test(normalizedStep) ||
                            /^Cela evite d'alourdir la preparation\.$/i.test(normalizedStep) ||
                            /^La preparation doit etre homogene sans ecraser les morceaux\.$/i.test(normalizedStep) ||
                            /^Le dessus doit etre legerement dore\.$/i.test(normalizedStep) ||
                            /^Elle doit etre legerement cremeuse et bien liee\.$/i.test(normalizedStep) ||
                            /^La burrata absorbe la vinaigrette et devient encore plus savoureuse\.$/i.test(normalizedStep) ||
                            /^Elles doivent etre al dente : tendres mais encore legerement fermes\.$/i.test(normalizedStep) ||
                            /^Cette eau riche en amidon est essentielle pour la sauce\.$/i.test(normalizedStep) ||
                            /^Le poulet doit etre bien dore et cuit a coeur\.$/i.test(normalizedStep) ||
                            /^L'ail doit juste devenir parfume sans bruler\.$/i.test(normalizedStep) ||
                            /^La sauce devient onctueuse grace a l'amidon et au parmesan\.$/i.test(normalizedStep) ||
                            /^Chaque morceau doit etre bien enrobe\.$/i.test(normalizedStep) ||
                            /^Cela permet au poulet de s'impregner des saveurs\.$/i.test(normalizedStep) ||
                            /^Melange jusqu'a obtenir une sauce lisse et cremeuse\.$/i.test(normalizedStep) ||
                            /^Coupe en deux si tu le souhaites\.$/i.test(normalizedStep) ||
                            /^Cela enleve l'exces d'amidon et ameliore la texture\.$/i.test(normalizedStep) ||
                            /^Le riz finit d'absorber l'eau et devient bien tendre\.$/i.test(normalizedStep) ||
                            /^L'assaisonnement doit bien enrober le poisson\.$/i.test(normalizedStep) ||
                            /^Il doit rester legerement fondant\.$/i.test(normalizedStep) ||
                            /^Cela apporte encore plus de saveur\.$/i.test(normalizedStep) ||
                            /^Le saumon doit rester tendre et legerement rose a coeur\.$/i.test(normalizedStep) ||
                            /^Meme une courte marinade apporte deja beaucoup de saveur\.$/i.test(normalizedStep) ||
                            /^Le boulgour doit absorber le liquide\.$/i.test(normalizedStep) ||
                            /^Des morceaux reguliers permettent une cuisson homogene\.$/i.test(normalizedStep) ||
                            /^L'ail doit devenir parfume sans brunir\.$/i.test(normalizedStep) ||
                            /^Les legumes doivent devenir bien tendres\.$/i.test(normalizedStep) ||
                            /^Les epinards vont tomber et reduire rapidement\.$/i.test(normalizedStep) ||
                            /^La soupe doit etre bien verte et veloutee\.$/i.test(normalizedStep) ||
                            /^Pour un gout plus doux, laisse-le tremper 5 minutes dans de l'eau froide, puis egoutte-le avant de l'ajouter a la salade\.$/i.test(normalizedStep) ||
                            /^L'assaisonnement reste simple pour mettre en valeur les ingredients\.$/i.test(normalizedStep) ||
                            /^Traditionnellement, la feta est ajoutee en gros morceaux plutot qu'emiettee\.$/i.test(normalizedStep) ||
                            /^Il doit etre legerement croustillant a l'exterieur tout en restant moelleux\.$/i.test(normalizedStep) ||
                            /^Des tranches fines rendent le bagel plus agreable a manger\.$/i.test(normalizedStep) ||
                            /^Repartis bien jusqu'aux bords pour une texture cremeuse a chaque bouchee\.$/i.test(normalizedStep) ||
                            /^Cela apporte du volume et une texture plus fondante\.$/i.test(normalizedStep) ||
                            /^Cela apporte fraicheur et equilibre\.$/i.test(normalizedStep) ||
                            /^L'aneth se marie parfaitement avec le saumon\.$/i.test(normalizedStep) ||
                            /^Des morceaux reguliers rendent la salade plus agreable a deguster\.$/i.test(normalizedStep) ||
                            /^La feta apporte une touche salee qui contraste avec la douceur de la pasteque\.$/i.test(normalizedStep) ||
                            /^La menthe apporte fraicheur et parfum\.$/i.test(normalizedStep) ||
                            /^L'assaisonnement doit rester leger pour ne pas masquer les saveurs\.$/i.test(normalizedStep) ||
                            /^Des morceaux reguliers assurent un bon equilibre\.$/i.test(normalizedStep) ||
                            /^Cela permet aux flocons d'avoine d'absorber le liquide\.$/i.test(normalizedStep) ||
                            /^Le melange doit devenir leger et homogene\.$/i.test(normalizedStep) ||
                            /^La preparation doit etre bien lisse\.$/i.test(normalizedStep) ||
                            /^Ne melange pas trop pour garder des cookies moelleux\.$/i.test(normalizedStep) ||
                            /^Repartis-les bien dans toute la pate\.$/i.test(normalizedStep) ||
                            /^Laisse de l'espace entre chaque cookie pour eviter qu'ils ne se collent\.$/i.test(normalizedStep) ||
                            /^Les bords doivent etre dores, mais le centre encore legerement mou\.$/i.test(normalizedStep) ||
                            /^Les cookies vont legerement se raffermir tout en restant moelleux\.$/i.test(normalizedStep) ||
                            /^L'objectif est de garder des morceaux de framboises pour plus de texture\.$/i.test(normalizedStep) ||
                            /^Les bouchees doivent etre bien fermes pour etre manipulees facilement\.$/i.test(normalizedStep) ||
                            /^La texture doit etre fluide pour enrober facilement\.$/i.test(normalizedStep) ||
                            /^Travaille rapidement pour eviter qu'elles ne ramollissent\.$/i.test(normalizedStep) ||
                            /^Le chocolat va durcir et devenir croquant\.$/i.test(normalizedStep) ||
                            /^Garde la datte legerement ouverte pour pouvoir la garnir facilement\.$/i.test(normalizedStep) ||
                            /^Le chocolat apporte une texture croquante en refroidissant\.$/i.test(normalizedStep) ||
                            /^La preparation doit etre bien homogene\.$/i.test(normalizedStep) ||
                            /^Le gateau doit rester moelleux a l'interieur\.$/i.test(normalizedStep) ||
                            /^Le glacage doit etre onctueux et facile a etaler\.$/i.test(normalizedStep) ||
                            /^Ils vont rapidement tomber et reduire de volume\.$/i.test(normalizedStep) ||
                            /^La couche doit se raffermir legerement\.$/i.test(normalizedStep) ||
                            /^Il doit etre fluide pour etre etale facilement\.$/i.test(normalizedStep) ||
                            /^Il ne doit plus rester de gros morceaux\.$/i.test(normalizedStep) ||
                            /^La texture doit etre dense mais facile a etaler\.$/i.test(normalizedStep) ||
                            /^Le centre doit rester tendre\.$/i.test(normalizedStep) ||
                            /^La base doit etre homogene et legerement epaisse\.$/i.test(normalizedStep) ||
                            /^Le melange doit etre brillant et homogene\.$/i.test(normalizedStep) ||
                            /^C'est ce contraste qui donne un brownie parfait\.$/i.test(normalizedStep) ||
                            /^Le granola doit devenir bien dore\.$/i.test(normalizedStep) ||
                            /^Il va durcir en refroidissant et devenir croustillant\.$/i.test(normalizedStep) ||
                            /^Cela apporte encore plus de texture et de gourmandise\.$/i.test(normalizedStep) ||
                            /^Plus la puree est lisse, plus la texture sera homogene\.$/i.test(normalizedStep) ||
                            /^Le banana bread doit rester legerement humide a coeur\.$/i.test(normalizedStep) ||
                            /^La texture doit etre compacte et facile a faconner\.$/i.test(normalizedStep) ||
                            /^Des biscuits fins seront plus croustillants apres cuisson\.$/i.test(normalizedStep) ||
                            /^Les biscuits doivent etre legerement dores\.$/i.test(normalizedStep) ||
                            /^Le melange doit etre homogene des le depart\.$/i.test(normalizedStep) ||
                            /^Les graines vont absorber le liquide et creer une texture de pudding\.$/i.test(normalizedStep) ||
                            /^Des morceaux reguliers rendent la salade plus agreable a deguster\.$/i.test(normalizedStep) ||
                            /^Les fruits doivent rester bien entiers\.$/i.test(normalizedStep) ||
                            /^Cela cree un sirop naturel frais et parfume\.$/i.test(normalizedStep)
                            || /^Cela permet d'incorporer de l'air et d'obtenir une omelette plus moelleuse\.$/i.test(normalizedStep)
                            || /^L'omelette doit rester legerement cremeuse\.$/i.test(normalizedStep)
                          const isPlainNoBullet =
                            /^Ces details/.test(normalizedStep) ||
                            /^Ta .+ est prete\./.test(normalizedStep) ||
                            /^Ton .+ est pret[e]?\./.test(normalizedStep) ||
                            /^Tes .+ sont pret[e]s\./.test(normalizedStep) ||
                            /^Il ne reste plus qu'a savourer\s*!$/i.test(normalizedStep) ||
                            /^Il ne reste plus qu['’]a savourer,\s*bon appetit\s*!$/i.test(normalizedStep)
                          return (
                            <li
                              key={`${selectedRecipe.id}-${step}`}
                              className={
                                isTipBoxTitle
                                  ? "diet-step-item--tipbox-title"
                                  : isTipBoxItem
                                    ? nextIsTipBoxItem
                                      ? "diet-step-item--tipbox-item"
                                      : "diet-step-item--tipbox-item diet-step-item--tipbox-item-last"
                                  : isStepTitle || isAdviceTitle
                                  ? "diet-step-item--title"
                                  : isStepSubTitle
                                    ? "diet-step-item--subtitle"
                                    : isItalicNote
                                      ? "diet-step-item--note"
                                  : isSubItem
                                    ? "diet-step-item--sub"
                                    : isSubNoBullet
                                      ? "diet-step-item--subplain"
                                    : isPlainNoBullet
                                      ? "diet-step-item--plain"
                                      : undefined
                              }
                            >
                              {isSubItem || isTipBoxItem ? normalizedStep.replace(/^-?\s*/, "") : normalizedStep}
                            </li>
                          )
                        })}
                      </ul>
                    </section>
                  ) : null}
                  {selectedRecipe.toppings && selectedRecipe.toppings.length > 0 ? (
                    <section>
                      <h4>{"IdÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©es de toppings (optionnel)"}</h4>
                      <ul>
                        {selectedRecipe.toppings.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {selectedRecipe.tips && selectedRecipe.tips.length > 0 ? (
                    <section>
                      <h4>{"Astuces"}</h4>
                      <ul>
                        {selectedRecipe.tips.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
              </div>
              <footer className="diet-recipe-modal__actions" />
            </div>
          </div>
        ) : null}
          </main>
</>
)
}

export default DietClassicPage










