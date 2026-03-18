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
import brownieSaleImg from "../../assets/brownie-sale.webp"
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
import saumonBowlImg from "../../assets/saumon-bowl.webp"
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
import fetaIngredientImg from "../../assets/Aliments/Feta.png"
import origanIngredientImg from "../../assets/Aliments/Origan.png"
import oignonRougeIngredientImg from "../../assets/Aliments/Oignon rouge.png"
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
import aspergesIngredientImg from "../../assets/Aliments/Asperges.png"
import eauIngredientImg from "../../assets/Aliments/Eau.png"
import laitueIngredientImg from "../../assets/Aliments/Laitue.png"
import pouletIngredientImg from "../../assets/Aliments/Poulet.png"
import parmesanIngredientImg from "../../assets/Aliments/Parmesan.png"
import yaourtGrecIngredientImg from "../../assets/Aliments/Yaourt grecque.png"
import croutonsIngredientImg from "../../assets/Aliments/Croutons.png"
import cubeBouillonIngredientImg from "../../assets/Aliments/Cube bouillon de legume.png"
import brocolisIngredientImg from "../../assets/Aliments/Brocolis.png"
import paprikaIngredientImg from "../../assets/Aliments/Paprika.png"
import boulgourIngredientImg from "../../assets/Aliments/Boulgour.png"
import concentreTomateIngredientImg from "../../assets/Aliments/Concentre de tomate.png"
import edamameIngredientImg from "../../assets/Aliments/Edamame.png"
import srirachaMayoIngredientImg from "../../assets/Aliments/Sriracha mayo.png"
import sauceSojaIngredientImg from "../../assets/Aliments/Sauce soja.png"
import huileSesameIngredientImg from "../../assets/Aliments/Huile de sesame.png"
import gingembrePoudreIngredientImg from "../../assets/Aliments/Gingembre en poudre.png"
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
  "healthy-tartine-avocat": [
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
  "mass-salade-grecque": [
    { id: "concombre", label: "Concombre", detail: "1 concombre", image: concombreIngredientImg },
    { id: "tomates-cerises", label: "Tomates cerises", detail: "200 g de tomates cerises", image: tomatesCerisesIngredientImg },
    { id: "feta", label: "Feta", detail: "120 g de feta", image: fetaIngredientImg },
    { id: "olives-noires", label: "Olives noires", detail: "30 g d'olives noires", image: olivesNoiresIngredientImg },
    { id: "olives-vertes", label: "Olives vertes", detail: "30 g d'olives vertes", image: olivesVertesIngredientImg },
    { id: "oignon-rouge", label: "Oignon rouge", detail: "1/4 d'oignon rouge", image: oignonRougeIngredientImg },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "2 cuilleres a soupe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    {
      id: "origan",
      label: "Origan",
      detail: "1 pincee d'origan",
      image: origanIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
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
    { id: "pasteque", label: "Pasteque", detail: "300 g de pasteque", image: pastequeIngredientImg },
    { id: "menthe", label: "Menthe", detail: "1 petite poignee de menthe fraiche", image: mentheIngredientImg },
    { id: "feta", label: "Feta", detail: "120 g de feta", image: fetaIngredientImg },
    {
      id: "huile-olive",
      label: "Huile d'olive",
      detail: "2 cuilleres a soupe d'huile d'olive",
      image: huileOliveIngredientImg,
      sectionTitle: "Pour l'assaisonnement / sauce",
    },
    { id: "poivre", label: "Poivre", detail: "Poivre noir", image: poivreIngredientImg, sectionTitle: "Pour l'assaisonnement / sauce" },
    {
      id: "vinaigre-balsamique",
      label: "Vinaigre balsamique",
      detail: "(Optionnel) un filet de balsamique",
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
    { id: "sriracha-mayo", label: "Sriracha mayo", detail: "1 c. a soupe de mayonnaise + 1 c. a cafe de sriracha", image: srirachaMayoIngredientImg, sectionTitle: "Sauce sriracha mayo" },
  ],
}

export const massRecipes: Recipe[] = [
{
  id: "mass-pancakes",
  title: "Pancake protÃƒÆ’Ã‚Â©inÃƒÆ’Ã‚Â©",
  flavor: "sucre",
  prepTime: "10 ÃƒÆ’Ã‚Â  15 min",
  servings: "1 pers",
  image: pancakesProteineImg,
  ingredients: [
    "1 Ãƒâ€¦Ã¢â‚¬Å“uf",
    "25 ml de lait",
    "35 g de farine",
    "30 g de fromage blanc",
    "20 g de whey",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de levure chimique",
    "Quelques gouttes d'arÃƒÆ’Ã‚Â´me vanille",
  ],
  steps: [
    "1. Preparer la pate",
    "Mets dans un blender ou bol :",
    "- flocons d'avoine",
    "- whey",
    "- oeuf",
    "- lait",
    "- levure",
    "- vanille",
    "- sel",
    "Mixe ou melange jusqu'a obtenir une pate lisse et assez epaisse.",
    "Laisse reposer 2 minutes.",
    "2. Cuire les pancakes",
    "Chauffe une poele antiadhesive a feu moyen.",
    "Ajoute un peu d'huile ou de beurre.",
    "Verse une petite louche de pate.",
    "Fais cuire 1 a 2 minutes jusqu'a voir des petites bulles.",
    "Retourne et cuis 1 minute de l'autre cote.",
    "3. Servir",
    "Empile 3 a 4 pancakes.",
    "Tu peux ajouter :",
    "- yaourt grec",
    "- fruits rouges",
    "- beurre de cacahuete",
    "- sirop d'erable ou miel",
    "Valeurs approximatives (selon whey utilisee)",
    "- Proteines : 30-35 g",
    "- Calories : ~350 kcal",
  ],
  toppings: [
    "Fruits rouges",
    "Beurre de cacahuÃƒÆ’Ã‚Â¨te",
    "Skyr ou fromage blanc",
    "Chocolat noir fondu",
    "Sirop d'ÃƒÆ’Ã‚Â©rable (lÃƒÆ’Ã‚Â©ger)",
  ],
  tips: [
    "Astuce : si la pÃƒÆ’Ã‚Â¢te est trop ÃƒÆ’Ã‚Â©paisse, ajoute quelques gouttes de lait. Si elle est trop liquide, ajoute un peu de farine.",
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
    "Prechauffe le four a 180 C.",
    "Dans un saladier, melange :",
    "- le beurre mou",
    "- le sucre roux",
    "- le sucre blanc",
    "Fouette jusqu'a obtenir une texture cremeuse.",
    "2. Ajouter les ingredients liquides",
    "Ajoute l'oeuf.",
    "Ajoute la vanille.",
    "Melange jusqu'a obtenir une pate homogene.",
    "3. Ajouter les ingredients secs",
    "Ajoute :",
    "- farine",
    "- bicarbonate",
    "- sel",
    "Melange juste jusqu'a incorporation.",
    "4. Ajouter le chocolat",
    "Incorpore les morceaux de chocolat.",
    "Melange delicatement.",
    "5. Former les cookies",
    "Fais des boules de pate (environ 2 c. a soupe).",
    "Pose-les sur une plaque avec du papier cuisson.",
    "Laisse de l'espace entre les cookies.",
    "6. Cuisson",
    "Enfourne 12 a 14 minutes.",
    "Les bords doivent etre dores mais le centre encore legerement mou.",
    "C'est ce qui permet d'avoir des cookies moelleux et pas trop durs.",
    "7. Ajouter la fleur de sel",
    "Des la sortie du four, ajoute une pincee de fleur de sel sur chaque cookie.",
    "Laisse refroidir 10 minutes.",
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
    "Mets les framboises dans un bol.",
    "Ajoute le yaourt nature.",
    "Ajoute le miel si tu veux une version un peu plus sucree.",
    "Melange delicatement pour garder des morceaux de framboises.",
    "2. Former les bouchees",
    "Pose une feuille de papier cuisson sur une plaque.",
    "Depose des petites cuilleres du melange sur la plaque (comme des petits tas).",
    "Mets la plaque au congelateur pendant 1 heure.",
    "Les bouchees doivent etre bien fermes pour pouvoir etre enrobees de chocolat.",
    "3. Faire fondre le chocolat",
    "Mets le chocolat noir en morceaux dans un bol.",
    "Ajoute l'huile de coco (optionnel).",
    "Fais fondre :",
    "- au micro-ondes par intervalles de 30 secondes, ou",
    "- au bain-marie.",
    "Melange jusqu'a obtenir un chocolat bien lisse.",
    "4. Enrober les bouchees",
    "Sors les bouchees du congelateur.",
    "Trempe-les dans le chocolat fondu a l'aide d'une fourchette.",
    "Replace-les sur la plaque avec papier cuisson.",
    "5. Faire durcir le chocolat",
    "Mets les bouchees au refrigerateur 10 minutes ou au congelateur 5 minutes.",
    "Le chocolat va devenir croquant autour du coeur framboise-yaourt.",
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
    "Coupe chaque datte dans la longueur.",
    "Retire le noyau.",
    "2. Ajouter le beurre de cacahuete",
    "Remplis chaque datte avec 1 petite cuillere de beurre de cacahuete.",
    "Lisse legerement pour bien remplir.",
    "3. Ajouter la fleur de sel",
    "Saupoudre une petite pincee de fleur de sel sur le beurre de cacahuete.",
    "La fleur de sel renforce le gout sucre des dattes et du beurre de cacahuete.",
    "4. Option chocolat (tres recommande)",
    "Fais fondre 30 g de chocolat noir.",
    "Verse un filet de chocolat sur les dattes.",
    "5. Finition",
    "Ajoute eventuellement des cacahuetes concassees.",
    "Mets au refrigerateur 5 minutes pour faire durcir le chocolat.",
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
    "Prechauffe le four a 180 C.",
    "Beurre ou chemise un moule de 20 cm.",
    "2. Melanger les ingredients liquides",
    "Dans un grand bol fouette :",
    "- les oeufs",
    "- le sucre roux",
    "- le sucre blanc",
    "Ajoute l'huile et la vanille.",
    "3. Ajouter les ingredients secs",
    "Ajoute :",
    "- farine",
    "- levure",
    "- bicarbonate",
    "- cannelle",
    "- muscade",
    "- sel",
    "Melange juste jusqu'a incorporation.",
    "4. Ajouter les carottes",
    "Incorpore les carottes rapees.",
    "Ajoute les noix si tu en utilises.",
    "5. Cuisson",
    "Verse la pate dans le moule.",
    "Enfourne 40 a 45 minutes.",
    "Verifie avec un couteau : il doit ressortir presque sec.",
    "6. Preparer le glacage",
    "Dans un bol melange :",
    "- cream cheese",
    "- beurre mou",
    "- sucre glace",
    "- vanille",
    "Fouette jusqu'a obtenir une creme lisse et epaisse.",
    "7. Glacer le gateau",
    "Laisse refroidir completement le carrot cake.",
    "Etale le glacage cream cheese sur le dessus.",
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
    "Ecrase les biscuits en miettes fines (mixeur ou rouleau).",
    "Melange avec le beurre fondu jusqu'a obtenir une texture sableuse.",
    "Etale ce melange dans un moule carre tapisse de papier cuisson.",
    "Presse bien avec une cuillere pour former une base compacte.",
    "Mets au refrigerateur 15 minutes pour durcir.",
    "2. Preparer la couche caramel cacahuete",
    "Dans un bol melange :",
    "- 150 g de caramel",
    "- 120 g de beurre de cacahuete",
    "Melange jusqu'a obtenir une creme epaisse et lisse.",
    "3. Ajouter la couche caramel",
    "Etale le melange caramel-cacahuete sur la base biscuit.",
    "Lisse bien avec une spatule.",
    "Remets au refrigerateur 20 minutes.",
    "4. Faire fondre le chocolat",
    "Coupe le chocolat noir en morceaux.",
    "Fais fondre :",
    "- au micro-ondes par intervalles de 30 secondes, ou",
    "- au bain-marie.",
    "Melange jusqu'a obtenir un chocolat bien lisse.",
    "5. Ajouter la couche chocolat",
    "Verse le chocolat fondu sur la couche caramel.",
    "Etale uniformement.",
    "Optionnel : ajoute fleur de sel ou cacahuetes concassees.",
    "6. Repos",
    "Mets le moule au refrigerateur 30 a 40 minutes.",
    "Quand le chocolat est dur, coupe en barres ou carres.",
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
    "Prechauffe le four a 180 C.",
    "Tapisse un petit moule carre de papier cuisson.",
    "2. Ecraser les bananes",
    "Mets les bananes dans un bol.",
    "Ecrase-les avec une fourchette jusqu'a obtenir une puree lisse.",
    "3. Melanger les ingredients liquides",
    "Ajoute :",
    "- l'oeuf",
    "- le lait",
    "- la vanille",
    "- le miel (optionnel)",
    "Melange bien.",
    "4. Ajouter les ingredients secs",
    "Ajoute :",
    "- les flocons d'avoine",
    "- la levure",
    "- le sel",
    "Melange jusqu'a obtenir une pate epaisse.",
    "5. Ajouter le chocolat",
    "Incorpore les pepites de chocolat.",
    "Melange delicatement.",
    "6. Cuisson",
    "Verse la pate dans le moule.",
    "Lisse le dessus.",
    "Enfourne 20 minutes.",
    "Le dessus doit etre legerement dore et la texture encore moelleuse.",
    "7. Refroidir",
    "Laisse refroidir 10 minutes.",
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
  title: "Saumon marinÃƒÆ’Ã‚Â© sriracha & riz",
  flavor: "sale",
  prepTime: "35 ÃƒÆ’Ã‚Â  50 min",
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
    "Mets 100 g de riz dans un bol.",
    "Rince-le a l'eau froide plusieurs fois jusqu'a ce que l'eau soit claire.",
    "Mets le riz dans une casserole avec 110 ml d'eau.",
    "Porte a ebullition puis couvre.",
    "Cuire 15 minutes a feu doux.",
    "Laisse reposer 10 minutes hors du feu.",
    "Melange ensuite avec 1 c. a soupe de vinaigre de riz.",
    "2. Mariner le saumon",
    "Coupe le saumon en cubes.",
    "Mets-le dans un bol.",
    "Ajoute :",
    "- huile de sesame",
    "- gingembre rape",
    "- sauce soja",
    "Melange et laisse mariner 10 minutes.",
    "3. Cuire le saumon",
    "Chauffe une poele a feu moyen.",
    "Ajoute le saumon marine.",
    "Fais cuire 3 a 4 minutes en melangeant legerement jusqu'a ce qu'il soit juste cuit et tendre.",
    "4. Preparer les garnitures",
    "Coupe 1/2 avocat en lamelles.",
    "Si les edamame sont surgeles, fais-les cuire 3 minutes dans l'eau bouillante puis egoutte.",
    "Coupe l'algue nori en fines bandes.",
    "5. Preparer la sauce sriracha mayo",
    "Dans un petit bol melange :",
    "- 1 c. a soupe de mayonnaise",
    "- 1 c. a cafe de sriracha",
    "6. Monter le bowl",
    "Mets le riz vinaigre dans un bol.",
    "Ajoute :",
    "- le saumon marine cuit",
    "- les edamame",
    "- l'avocat",
    "Ajoute les algues nori.",
    "Verse la sriracha mayo dessus.",
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
    "Coupe le bagel en deux.",
    "Fais-le griller au grille-pain 2 a 3 minutes jusqu'a ce qu'il soit legerement croustillant.",
    "2. Preparer les garnitures",
    "Coupe 1/2 avocat en fines lamelles.",
    "Coupe la tomate en fines rondelles.",
    "3. Etaler le cream cheese",
    "Sur chaque moitie du bagel grille, etale 1 cuillere a soupe de cream cheese.",
    "Repartis bien jusqu'aux bords.",
    "4. Ajouter le saumon",
    "Dispose le saumon fume en plis legers sur le cream cheese.",
    "Cela donne une texture plus moelleuse.",
    "5. Ajouter les legumes",
    "Ajoute les lamelles d'avocat.",
    "Ajoute les rondelles de tomate.",
    "6. Assaisonner",
    "Ajoute une pincee d'aneth.",
    "Ajoute du poivre noir selon ton gout.",
    "7. Fermer le bagel",
    "Referme le bagel.",
    "Coupe-le en deux pour le manger plus facilement.",
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
    "Pour le saumon",
    "2 paves de saumon",
    "1 cuillere a soupe d'huile d'olive",
    "Sel",
    "Poivre",
    "Pour la salsa",
    "1 avocat",
    "1 tomate (ou 150 g de tomates cerises)",
    "1/2 citron (jus)",
    "1 cuillere a soupe de coriandre ou persil",
    "Sel",
    "Poivre",
    "Pour l'accompagnement",
    "120 g de riz blanc",
  ],
  steps: [
    "1. Cuire le riz",
    "Rince 80 g de riz a l'eau froide.",
    "Mets-le dans une casserole avec 160 ml d'eau.",
    "Porte a ebullition.",
    "Couvre et laisse cuire 12 minutes a feu doux.",
    "Laisse reposer 5 minutes puis aere avec une fourchette.",
    "2. Preparer la salsa",
    "Coupe la tomate en petits des.",
    "Coupe l'avocat en petits cubes.",
    "Ajoute l'oignon rouge.",
    "Ajoute :",
    "- jus de citron",
    "- huile d'olive",
    "- poivre",
    "Melange delicatement.",
    "Cette salsa doit rester fraiche et legerement acidulee.",
    "3. Cuire le saumon",
    "Chauffe une poele a feu moyen-fort avec l'huile d'olive.",
    "Assaisonne le saumon avec sel, poivre et citron.",
    "Fais cuire 4 minutes cote peau.",
    "Retourne et cuis 2 a 3 minutes.",
    "Le saumon doit rester tendre et legerement rose a l'interieur.",
    "4. Servir",
    "Mets le riz dans l'assiette.",
    "Ajoute le saumon grille.",
    "Ajoute la salsa tomate-avocat sur le saumon ou a cote.",
    "Ton saumon grille avec salsa est pret.",
  ],
},
{
  id: "mass-salade-pasteque-feta",
  title: "Salade pasteque & feta",
  flavor: "sale",
  prepTime: "10 à 15 min",
  servings: "2 pers",
  image: saladePastequeFetaImg,
  ingredients: [
    "Pour la salade",
    "300 g de pasteque",
    "120 g de feta",
    "1 petite poignee de menthe fraiche",
    "Pour l'assaisonnement",
    "2 cuilleres a soupe d'huile d'olive",
    "Poivre noir",
    "(Optionnel) un filet de balsamique",
  ],
  steps: [
    "1. Couper la pasteque",
    "Coupe la pasteque.",
    "Retire la peau.",
    "Coupe la chair en cubes d'environ 2-3 cm.",
    "Mets-les dans un saladier.",
    "2. Preparer la feta",
    "Coupe la feta en cubes ou emiette-la grossierement.",
    "Ajoute-la dans le saladier avec la pasteque.",
    "3. Ajouter la menthe",
    "Lave les feuilles de menthe fraiche.",
    "Coupe-les finement ou dechire-les a la main.",
    "Ajoute-les a la salade.",
    "4. Assaisonner",
    "Verse 2 cuilleres a soupe d'huile d'olive.",
    "Ajoute du poivre noir.",
    "(Optionnel) ajoute un filet de balsamique.",
    "5. Melanger",
    "Melange tres doucement pour ne pas casser la pasteque.",
    "Serre bien frais.",
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
    "Pour la salade",
    "1 concombre",
    "200 g de tomates cerises",
    "120 g de feta",
    "60 g d'olives (noires ou Kalamata)",
    "1/4 d'oignon rouge",
    "Pour l'assaisonnement",
    "2 cuilleres a soupe d'huile d'olive",
    "1 pincee d'origan",
    "Poivre noir",
  ],
  steps: [
    "1. Preparer les tomates",
    "Lave les tomates cerises.",
    "Coupe-les en deux.",
    "Mets-les dans un grand saladier.",
    "2. Couper le concombre",
    "Lave le concombre.",
    "Epluche une bande sur deux (optionnel).",
    "Coupe-le en demi-rondelles fines.",
    "Ajoute-les dans le saladier.",
    "3. Preparer l'oignon",
    "Epluche 1/2 oignon rouge.",
    "Coupe-le en fines lamelles.",
    "(Astuce gout) Mets-le 5 minutes dans de l'eau froide pour enlever le gout trop fort.",
    "Egoutte puis ajoute dans la salade.",
    "4. Ajouter les olives",
    "Mets les olives noires et vertes dans le saladier.",
    "Si elles ont des noyaux, enleve-les.",
    "5. Assaisonner",
    "Ajoute 3 cuilleres a soupe d'huile d'olive.",
    "Ajoute 1/2 c. a cafe d'origan.",
    "Ajoute du poivre noir.",
    "Melange doucement.",
    "Dans la recette traditionnelle, l'assaisonnement est souvent simplement huile d'olive, origan et sel/poivre, pour laisser le gout des legumes et de la feta ressortir.",
    "6. Ajouter la feta",
    "Coupe la feta en gros cubes ou en gros morceaux.",
    "Pose-la sur le dessus de la salade.",
    "Ajoute un petit filet d'huile d'olive et un peu d'origan.",
    "Dans les vraies salades grecques, la feta est souvent en gros morceaux ou en bloc sur la salade plutot qu'emiettee.",
    "Ta salade grecque est prete.",
    "Conseil pour qu'elle soit vraiment tres bonne :",
    "- utilise une bonne huile d'olive",
    "- des tomates bien mures",
    "- de la feta en bloc (pas emiettee)",
    "Ces details font une grande difference dans ce plat tres simple.",
  ],
},
{
  id: "mass-wrap-poulet",
  title: "Wrap poulet croquant",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã‚Â  45 min",
  servings: "4 wraps",
  image: wrapPouletCroquantImg,
  ingredients: [
    "Pour le poulet",
    "600 g de blanc de poulet coupÃƒÆ’Ã‚Â© en laniÃƒÆ’Ã‚Â¨res",
    "3 gousses dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢origan",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de paprika",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de poudre dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de flocons de piment",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de sel et poivre",
    "Jus de citron (selon goÃƒÆ’Ã‚Â»t)",
    "Pour la sauce",
    "100 g de yaourt ÃƒÆ’Ã‚Â©crÃƒÆ’Ã‚Â©mÃƒÆ’Ã‚Â©",
    "20 g de sriracha",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail ÃƒÆ’Ã‚Â©mincÃƒÆ’Ã‚Â©e",
    "Persil (selon goÃƒÆ’Ã‚Â»t)",
    "Sel et poivre",
    "Pour le montage des wraps",
    "Tortillas faibles en calories",
    "Laitue",
    "Oignons rouges",
    "Tomates coupÃƒÆ’Ã‚Â©es en dÃƒÆ’Ã‚Â©s",
  ],
  steps: [
    "1. Mariner le poulet",
    "Mets les lanieres de poulet dans un saladier.",
    "Ajoute :",
    "- ail",
    "- origan",
    "- paprika",
    "- poudre d'oignon",
    "- flocons de piment",
    "- sel et poivre",
    "- jus de citron",
    "- huile d'olive",
    "Melange bien pour enrober le poulet.",
    "Laisse mariner 10 a 15 minutes.",
    "2. Cuire le poulet",
    "Chauffe une poele a feu moyen-fort.",
    "Ajoute le poulet marine.",
    "Fais cuire 8 a 10 minutes en remuant jusqu'a ce qu'il soit bien dore et cuit.",
    "Le poulet doit atteindre environ 74 C (165F) pour etre parfaitement cuit.",
    "3. Preparer la sauce",
    "Dans un bol melange :",
    "- yaourt",
    "- sriracha",
    "- ail",
    "- persil",
    "- sel et poivre",
    "Melange jusqu'a obtenir une sauce cremeuse.",
    "4. Preparer les legumes",
    "Coupe les tomates en des.",
    "Coupe les oignons rouges en fines lamelles.",
    "Lave et coupe la laitue.",
    "5. Monter les wraps",
    "Pose une tortilla sur une assiette.",
    "Etale un peu de sauce.",
    "Ajoute :",
    "- laitue",
    "- poulet chaud",
    "- tomates",
    "- oignons rouges",
    "Ajoute encore un peu de sauce.",
    "6. Fermer le wrap",
    "Plie les cotes vers l'interieur.",
    "Roule le wrap bien serre.",
    "Coupe en deux si tu veux.",
    "Tes wraps au poulet sont prets.",
  ],
},
{
  id: "mass-omelette-power",
  title: "Omelette power ÃƒÆ’Ã‚Â  la feta",
  flavor: "sale",
  prepTime: "10 à 15 min",
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
    "Chauffe 1 c. a cafe d'huile d'olive dans une poele a feu moyen.",
    "Ajoute les epinards.",
    "Fais-les cuire 1 minute jusqu'a ce qu'ils reduisent (ils vont \"tomber\").",
    "Mets-les de cote.",
    "Les epinards cuisent tres vite et deviennent tendres en environ 1 minute lorsqu'ils fletrissent dans la poele.",
    "2. Preparer les oeufs",
    "Casse 2 ou 3 oeufs dans un bol.",
    "Ajoute une pincee de poivre.",
    "Fouette 30 secondes pour incorporer de l'air et rendre l'omelette plus moelleuse.",
    "3. Cuire l'omelette",
    "Fais fondre 1 petite noix de beurre dans la poele a feu moyen-doux.",
    "Verse les oeufs battus.",
    "Laisse cuire 10-15 secondes sans toucher pour creer la base.",
    "Avec une spatule, pousse doucement les oeufs vers le centre pour cuire le reste.",
    "4. Ajouter la garniture",
    "Ajoute les epinards sur une moitie de l'omelette.",
    "Emiette 40 g de feta dessus.",
    "Laisse cuire 30 a 60 secondes pour que la feta se rechauffe et ramollisse.",
    "5. Plier l'omelette",
    "Plie l'omelette en deux avec une spatule.",
    "Laisse cuire 30 secondes de plus.",
    "Glisse-la dans une assiette.",
    "Ton omelette feta & epinards est prete.",
    "Astuce pour qu'elle soit vraiment excellente :",
    "- ne cuis pas trop les oeufs -> l'omelette doit rester legerement cremeuse au centre",
    "- ajoute la feta a la fin pour garder son gout et sa texture",
    "- utilise une bonne feta en bloc (beaucoup plus savoureuse).",
  ],
},
{
  id: "mass-smoothie-gain",
  title: "Smoothie banane beurre de cacahuÃƒÆ’Ã‚Â¨te",
  flavor: "boisson",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieBananeBeurreCacahueteImg,
  ingredients: [
    "1 banane",
    "300 ml de lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal",
    "80 g de flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine",
    "1 scoop de protÃƒÆ’Ã‚Â©ine whey",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de beurre de cacahuÃƒÆ’Ã‚Â¨te",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de sirop dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©rable",
    "Cannelle (facultatif)",
  ],
  steps: [
    "ÃƒÆ’Ã¢â‚¬Â°pluche la banane et coupe-la en morceaux.",
    "Verse le lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal dans un blender.",
    "Ajoute les flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine, la banane, la whey, le beurre de cacahuÃƒÆ’Ã‚Â¨te et le sirop dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©rable.",
    "Ajoute la cannelle si tu le souhaites.",
    "Mixe pendant 30 ÃƒÆ’Ã‚Â  60 secondes, jusqu'ÃƒÆ’Ã‚Â  obtenir une texture lisse et homogÃƒÆ’Ã‚Â¨ne.",
    "Ajuste la texture : ajoute un peu de lait si le smoothie est trop ÃƒÆ’Ã‚Â©pais. Mixe davantage si nÃƒÆ’Ã‚Â©cessaire.",
    "Verse dans un verre et consomme immÃƒÆ’Ã‚Â©diatement.",
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
    "Preparer les fruits",
    "Lave les fraises et retire les queues.",
    "Epluche la banane et coupe-la en morceaux.",
    "Mixer le smoothie",
    "Dans un blender, ajoute les fraises, la banane, l'eau de coco, la whey vanille et les glacons (optionnel).",
    "Mix pendant 30 a 40 secondes jusqu'a obtenir une texture lisse et cremeuse.",
    "Ajuster la texture",
    "Si le smoothie est trop epais, ajoute un peu d'eau de coco.",
    "S'il est trop liquide, ajoute quelques fraises ou glacons.",
    "Servir",
    "Verse dans un grand verre et deguste immediatement.",
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
    "Preparer les ingredients",
    "Lave la pomme et coupe-la en morceaux (retire le coeur).",
    "Lave les branches de celeri et coupe-les en morceaux.",
    "Epluche le gingembre et presse le citron.",
    "Mixer la boisson",
    "Dans un blender, ajoute les morceaux de pomme, le celeri, le jus de citron, le gingembre et l'eau.",
    "Mix pendant 30 a 45 secondes jusqu'a obtenir une texture bien lisse.",
    "Filtrer (optionnel)",
    "Si tu preferes une boisson plus legere, passe-la dans une passoire fine ou un filtre.",
    "Servir",
    "Verse dans un verre avec des glacons.",
    "Ajoute quelques feuilles de menthe pour plus de fraicheur.",
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
    "Preparer les ingredients",
    "Presse les oranges pour recuperer leur jus.",
    "Epluche les carottes et coupe-les en petits morceaux.",
    "Epluche le gingembre.",
    "Mixer la boisson",
    "Dans un blender, ajoute le jus d'orange, les morceaux de carottes, le gingembre et l'eau.",
    "Mix pendant 45 secondes a 1 minute jusqu'a obtenir une texture lisse.",
    "Filtrer (optionnel)",
    "Passe la boisson dans une passoire fine si tu preferes un jus plus leger.",
    "Servir",
    "Verse dans un verre avec des glacons.",
    "Ajoute un filet de miel si tu souhaites une boisson un peu plus douce.",
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
    "Preparer les ingredients",
    "Lave le concombre et coupe-le en fines rondelles.",
    "Coupe le citron jaune et le citron vert en tranches fines.",
    "Epluche le gingembre et coupe-le en petites lamelles.",
    "Assembler l'eau detox",
    "Dans une carafe ou une grande bouteille, ajoute les rondelles de concombre, les tranches de citron, les tranches de citron vert, le gingembre et les feuilles de menthe legerement froissees.",
    "Verse ensuite 1 litre d'eau froide.",
    "Infusion",
    "Laisse infuser au moins 1 heure au refrigerateur pour que les saveurs se diffusent bien.",
    "Pour un gout plus intense, laisse infuser 3 a 4 heures.",
    "Servir",
    "Verse dans un verre avec quelques glacons et quelques feuilles de menthe.",
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
    "Preparer le cafe",
    "Prepare un espresso avec une machine a cafe ou un cafe bien fort.",
    "Verse-le dans une grande tasse.",
    "Chauffer le lait",
    "Fais chauffer le lait dans une casserole ou au micro-ondes sans le faire bouillir.",
    "Ajoute l'extrait de vanille et melange.",
    "Faire mousser le lait",
    "Utilise un mousseur a lait, un fouet ou secoue le lait chaud dans un bocal ferme pour creer une mousse legere.",
    "Assembler le latte",
    "Verse le lait chaud sur l'espresso.",
    "Ajoute la mousse de lait sur le dessus.",
    "Servir",
    "Ajoute un peu de sucre ou de sirop de vanille selon ton gout.",
    "Astuce coffee shop : ajoute un peu de cannelle ou de poudre de cacao sur la mousse pour une touche gourmande.",
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
    "Preparer le matcha",
    "Dans un bol ou une tasse, ajoute la poudre de matcha puis verse l'eau chaude.",
    "Fouette avec un fouet a matcha ou un petit fouet jusqu'a obtenir un melange bien lisse et mousseux.",
    "Chauffer le lait",
    "Fais chauffer le lait dans une casserole ou au micro-ondes sans le faire bouillir.",
    "Faire mousser le lait",
    "Utilise un mousseur a lait ou fouette legerement pour creer une mousse legere.",
    "Assembler le latte",
    "Verse le lait chaud sur le matcha.",
    "Ajoute la mousse de lait sur le dessus.",
    "Servir",
    "Ajoute du miel ou du sirop d'erable si tu veux une boisson plus douce.",
    "Astuce : tamise la poudre de matcha avant de la fouetter pour eviter les grumeaux.",
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
    "Preparer le cafe",
    "Prepare un espresso ou un cafe bien fort et verse-le dans une grande tasse.",
    "Melanger le chocolat",
    "Ajoute le cacao en poudre (ou le chocolat fondu) dans le cafe chaud.",
    "Melange bien pour qu'il se dissolve completement.",
    "Chauffer le lait",
    "Fais chauffer le lait dans une casserole ou au micro-ondes sans le faire bouillir.",
    "Assembler le moka",
    "Verse le lait chaud dans la tasse avec le cafe chocolate.",
    "Melange legerement.",
    "Finition",
    "Ajoute un peu de chantilly sur le dessus et quelques copeaux de chocolat si tu veux une version plus gourmande.",
    "Astuce coffee shop : ajoute une pincee de cannelle ou de vanille pour un moka encore plus parfume.",
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
    "Preparer les ingredients",
    "Epluche la betterave et coupe-la en petits morceaux.",
    "Lave la pomme et coupe-la en quartiers (retire le coeur).",
    "Coupe la branche de celeri en morceaux.",
    "Mixer le jus",
    "Dans un blender, ajoute la betterave, la pomme, le celeri et l'eau.",
    "Mix pendant 45 secondes a 1 minute jusqu'a obtenir un melange lisse.",
    "Filtrer (optionnel)",
    "Passe le jus dans une passoire fine si tu preferes une boisson plus legere.",
    "Servir",
    "Verse dans un verre.",
    "Ajoute un filet de citron ou un peu de gingembre si tu veux plus de fraicheur.",
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
    "Preparer les ingredients",
    "Epluche la banane et coupe-la en morceaux.",
    "Coupe l'avocat en deux et recupere la chair.",
    "Mixer le smoothie",
    "Dans un blender, ajoute la banane, l'avocat, les amandes et le lait.",
    "Mix pendant 30 a 45 secondes jusqu'a obtenir une texture lisse et cremeuse.",
    "Ajuster la texture",
    "Si le smoothie est trop epais, ajoute un peu de lait.",
    "Si tu veux une boisson plus fraiche, ajoute quelques glacons.",
    "Servir",
    "Verse dans un verre et deguste immediatement.",
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
    "Preparer les ingredients",
    "Lave les epinards.",
    "Coupe la pomme en morceaux (retire le coeur).",
    "Coupe le concombre en rondelles.",
    "Mixer la boisson",
    "Dans un blender, ajoute les epinards, la pomme, le concombre et l'eau.",
    "Mix pendant 45 secondes a 1 minute jusqu'a obtenir une texture lisse.",
    "Ajuster la texture",
    "Ajoute un peu plus d'eau si la boisson est trop epaisse.",
    "Servir",
    "Verse dans un verre avec quelques glacons.",
    "Ajoute un filet de citron pour plus de fraicheur.",
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
    "Preparer les ingredients",
    "Lave le pamplemousse et coupe-le en fines tranches.",
    "Rince la branche de romarin.",
    "Assembler l'eau infusee",
    "Dans une carafe ou une grande bouteille, ajoute les tranches de pamplemousse et la branche de romarin.",
    "Verse ensuite 1 litre d'eau froide.",
    "Infusion",
    "Place la carafe au refrigerateur pendant au moins 1 heure pour que les saveurs se diffusent.",
    "Pour un gout plus intense, laisse infuser 2 a 3 heures.",
    "Servir",
    "Verse dans un verre avec quelques glacons.",
    "Astuce : ecrase legerement le romarin avec les doigts avant de l'ajouter pour liberer davantage d'aromes.",
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
    "Preparer les fruits",
    "Lave les myrtilles.",
    "Coupe l'orange en fines rondelles.",
    "Rince les feuilles de menthe.",
    "Assembler l'eau infusee",
    "Dans une carafe ou une grande bouteille, ajoute les myrtilles, les rondelles d'orange et les feuilles de menthe legerement froissees.",
    "Verse ensuite 1 litre d'eau froide.",
    "Infusion",
    "Place la carafe au refrigerateur pendant au moins 1 heure pour que les saveurs se diffusent.",
    "Pour un gout plus intense, laisse infuser 2 a 3 heures.",
    "Servir",
    "Verse dans un verre avec quelques glacons.",
    "Astuce : ecrase legerement quelques myrtilles avant de les ajouter pour donner plus de gout et une jolie couleur a l'eau.",
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
    "Preparer les fruits",
    "Lave les fraises et coupe-les en deux ou en tranches.",
    "Coupe le citron en fines rondelles.",
    "Rince les feuilles de menthe.",
    "Assembler l'eau infusee",
    "Dans une carafe, ajoute les fraises, les rondelles de citron et les feuilles de menthe legerement froissees.",
    "Verse ensuite 1 litre d'eau froide.",
    "Infusion",
    "Place la carafe au refrigerateur pendant 1 a 2 heures pour que les saveurs se diffusent bien.",
    "Servir",
    "Verse dans un verre avec quelques glacons.",
    "Astuce : ecrase legerement quelques fraises dans la carafe pour donner plus de gout et une belle couleur rosee a l'eau.",
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
    "Preparer l'avoine",
    "Si tu veux une texture plus lisse, laisse tremper les flocons d'avoine 5 minutes dans un peu de lait d'amande.",
    "Mixer la boisson",
    "Dans un blender, ajoute les flocons d'avoine, le beurre de cacahuete, le lait d'amande et le miel.",
    "Mix pendant 30 a 40 secondes jusqu'a obtenir une texture bien cremeuse.",
    "Ajuster la texture",
    "Ajoute un peu de lait d'amande si la boisson est trop epaisse.",
    "Servir",
    "Verse dans un verre et ajoute quelques glacons si tu veux une boisson plus fraiche.",
  ],
},
{
  id: "mass-pates-cremeuses",
  title: "Alfredo pasta protÃƒÆ’Ã‚Â©inÃƒÆ’Ã‚Â©",
  flavor: "sale",
  prepTime: "25 ÃƒÆ’Ã‚Â  30 min",
  servings: "1 pers",
  image: alfredoPastaImg,
  ingredients: [
    "150 g de blanc de poulet",
    "80 g de pÃƒÆ’Ã‚Â¢tes (crues, au choix)",
    "150 g de champignons (de Paris ou autres)",
    "100 g de fromage blanc ou yaourt grec nature",
    "30 g de parmesan rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes sÃƒÆ’Ã‚Â©chÃƒÆ’Ã‚Â©es",
  ],
  steps: [
    "1. Cuire les pates",
    "Porte une casserole d'eau salee a ebullition.",
    "Ajoute 80 g de pates.",
    "Fais cuire 8 a 10 minutes selon les pates.",
    "Avant d'egoutter, garde 60 ml d'eau de cuisson.",
    "2. Cuire le poulet",
    "Coupe le poulet en petits morceaux.",
    "Chauffe 1 c. a cafe d'huile d'olive dans une poele.",
    "Fais cuire le poulet 6 a 7 minutes jusqu'a ce qu'il soit dore.",
    "Ajoute du poivre noir.",
    "3. Faire la base de sauce",
    "Ajoute l'ail hache dans la poele.",
    "Fais cuire 30 secondes.",
    "4. Faire la sauce Alfredo proteinee",
    "Ajoute dans la poele :",
    "- 60 ml d'eau de cuisson des pates",
    "- 40 g de parmesan",
    "Melange jusqu'a ce que la sauce devienne cremeuse.",
    "Ajoute 2 c. a soupe de yaourt grec et melange.",
    "Le parmesan fond avec l'eau de cuisson riche en amidon pour creer une sauce naturellement epaisse et cremeuse.",
    "5. Ajouter les pates",
    "Ajoute les pates egouttees dans la poele.",
    "Melange 1 a 2 minutes pour bien enrober les pates de sauce.",
    "6. Servir",
    "Mets les pates dans une assiette.",
    "Ajoute du parmesan supplementaire.",
    "Ajoute du poivre noir et du persil.",
    "Tes Alfredo pasta proteinees sont pretes.",
  ],
},
{
  id: "mass-pates-pesto-poulet",
  title: "Pates pesto, poulet, parmesan & tomates cerises",
  flavor: "sale",
  prepTime: "25 a 30 min",
  servings: "2 pers",
  image: patesPestoPouletParmesanImg,
  ingredients: [
    "Pour les pates",
    "250 g de pates (penne, fusilli ou tagliatelles)",
    "2 blancs de poulet",
    "150 g de tomates cerises",
    "40 g de parmesan rape ou en copeaux",
    "2 cuilleres a soupe d'huile d'olive",
    "Sel",
    "Poivre noir",
    "Pour la sauce pesto",
    "3 cuilleres a soupe de pesto",
    "3 cuilleres a soupe d'eau de cuisson des pates",
    "1 cuillere a soupe de parmesan rape",
    "Poivre noir",
  ],
  steps: [
    "1. Cuire les pates",
    "Porte une casserole d'eau salee a ebullition.",
    "Ajoute 80 g de pates.",
    "Fais cuire 8 a 10 minutes jusqu'a ce qu'elles soient al dente.",
    "Garde 2 cuilleres a soupe d'eau de cuisson, puis egoutte.",
    "2. Cuire le poulet",
    "Coupe le poulet en petits morceaux.",
    "Chauffe 1 c. a cafe d'huile d'olive dans une poele.",
    "Ajoute l'ail hache et le poulet.",
    "Fais cuire 6 a 7 minutes jusqu'a ce qu'il soit bien dore.",
    "3. Cuire les tomates",
    "Ajoute les tomates cerises coupees en deux dans la poele.",
    "Fais cuire 2 minutes jusqu'a ce qu'elles deviennent legerement fondantes.",
    "Les tomates cerises apportent un contraste acide et juteux qui equilibre la richesse du pesto.",
    "4. Melanger les pates et le pesto",
    "Ajoute les pates egouttees dans la poele.",
    "Ajoute le pesto et un peu d'eau de cuisson des pates.",
    "Melange 1 minute pour bien enrober les pates.",
    "5. Ajouter le parmesan",
    "Ajoute le parmesan rape.",
    "Melange jusqu'a obtenir une sauce legerement cremeuse.",
    "6. Servir",
    "Mets les pates dans une assiette.",
    "Ajoute du parmesan supplementaire.",
    "Ajoute poivre noir et basilic frais.",
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
  prepTime: "10 a 15 min",
  servings: "2 pers",
  image: saladeBurrataJambonSecImg,
  ingredients: [
    "Pour la salade",
    "1 grosse burrata",
    "80 g de jambon sec (type prosciutto ou jambon cru)",
    "200 g de tomates cerises",
    "1 poignee de feuilles de basilic frais",
    "Pour l'assaisonnement",
    "2 cuilleres a soupe d'huile d'olive",
    "Poivre noir",
    "1 pincee de sel (optionnel)",
  ],
  steps: [
    "1. Preparer les legumes",
    "Lave les tomates cerises.",
    "Coupe-les en deux.",
    "Mets-les dans un saladier avec le melange de salade.",
    "2. Preparer la vinaigrette",
    "Dans un petit bol melange :",
    "- huile d'olive",
    "- vinaigre balsamique",
    "- moutarde",
    "- miel",
    "- poivre noir",
    "Fouette jusqu'a obtenir une vinaigrette legerement cremeuse.",
    "3. Assaisonner la salade",
    "Verse la moitie de la vinaigrette sur la salade et les tomates.",
    "Melange delicatement.",
    "4. Monter l'assiette",
    "Mets la salade assaisonnee dans une assiette.",
    "Depose la burrata entiere au centre.",
    "Ajoute les tranches de jambon sec autour.",
    "5. Ajouter les finitions",
    "Ajoute les feuilles de basilic.",
    "Verse le reste de vinaigrette sur la burrata.",
    "Ajoute un peu de poivre noir.",
    "Ta salade burrata est prete.",
  ],
},
{
  id: "mass-focaccia-burrata-mortadelle",
  title: "Focaccia garnie burrata, mortadelle & roquette",
  flavor: "sale",
  prepTime: "10 a 15 min",
  servings: "2 pers",
  image: focacciaBurrataMortadelleRoquetteImg,
  ingredients: [
    "Pour le sandwich",
    "1 grande focaccia",
    "1 grosse burrata",
    "120 g de mortadelle",
    "1 poignee de roquette",
    "Pour l'assaisonnement",
    "1 a 2 cuilleres a soupe d'huile d'olive",
    "Poivre noir",
  ],
  steps: [
    "1. Toaster la focaccia",
    "Coupe la focaccia en deux horizontalement.",
    "Fais-la chauffer 2-3 minutes dans une poele ou au four jusqu'a ce qu'elle soit croustillante a l'exterieur mais moelleuse a l'interieur.",
    "2. Ajouter la mortadelle",
    "Dispose les tranches de mortadelle sur la base du pain.",
    "Plie legerement les tranches au lieu de les poser a plat pour plus de texture.",
    "3. Ajouter la burrata",
    "Pose la burrata sur la mortadelle.",
    "Ouvre-la avec les mains ou une cuillere.",
    "Etale legerement le coeur cremeux sur le sandwich.",
    "4. Ajouter la roquette",
    "Ajoute une bonne poignee de roquette.",
    "Arrose avec un filet d'huile d'olive.",
    "Ajoute poivre noir.",
    "5. Fermer et servir",
    "Referme la focaccia.",
    "Coupe le sandwich en deux.",
    "Ta focaccia burrata mortadelle est prete.",
    "Astuce pour que ce soit vraiment incroyable (niveau sandwich italien)",
    "- ajoute un peu de pesto sur le pain",
    "- mets quelques pistaches concassees pour le croquant",
    "- laisse la burrata a temperature ambiante 10 min avant de la mettre.",
  ],
},
{
  id: "mass-quinoa-bowl",
  title: "Butter chicken protÃƒÆ’Ã‚Â©inÃƒÆ’Ã‚Â©, riz et brocolis",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã‚Â  35 min",
  servings: "1 pers",
  image: butterChickenImg,
  ingredients: [
    "Pour le poulet",
    "150 g de blanc de poulet",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Sel et poivre",
    "Pour la sauce butter chicken",
    "100 g de yaourt grec nature",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de concentrÃƒÆ’Ã‚Â© de tomate",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de garam masala",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de paprika",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de curry",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de gingembre (pÃƒÆ’Ã‚Â¢te ou moulu)",
    "Sel et poivre",
    "Pour lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢accompagnement",
    "60 g de riz cru",
    "150 g de brocolis",
  ],
  steps: [
    "Base",
    "- 80 g de riz basmati cru",
    "- 160 ml d'eau",
    "- 120 g de brocolis",
    "Poulet marine",
    "- 150 g de blanc de poulet",
    "- 2 c. a soupe de yaourt grec",
    "- 1 c. a cafe de paprika",
    "- 1/2 c. a cafe de curry",
    "- 1/2 c. a cafe de cumin",
    "- 1/2 c. a cafe de garam masala",
    "- 1 gousse d'ail rapee",
    "- 1 c. a cafe de jus de citron",
    "- sel et poivre",
    "La marinade yaourt + epices est une technique classique pour rendre le poulet tres tendre dans ce plat.",
    "Sauce butter chicken",
    "- 200 g de tomates concassees",
    "- 50 ml de lait de coco leger",
    "- 1 c. a cafe de beurre ou huile",
    "- 1/2 c. a cafe de garam masala",
    "- 1/2 c. a cafe de paprika",
    "- sel",
    "1. Mariner le poulet",
    "Coupe le poulet en morceaux.",
    "Dans un bol melange :",
    "- yaourt grec",
    "- paprika",
    "- curry",
    "- cumin",
    "- garam masala",
    "- ail",
    "- citron",
    "Ajoute le poulet et melange.",
    "Laisse mariner 10 a 15 minutes.",
    "2. Cuire le riz",
    "Rince 80 g de riz basmati a l'eau froide.",
    "Mets-le dans une casserole avec 160 ml d'eau.",
    "Porte a ebullition.",
    "Couvre et laisse cuire 10 a 12 minutes a feu doux.",
    "Laisse reposer 5 minutes.",
    "3. Cuire les brocolis",
    "Coupe les brocolis en petits bouquets.",
    "Fais-les cuire dans l'eau bouillante 4 a 5 minutes.",
    "Egoutte.",
    "4. Cuire le poulet",
    "Chauffe une poele avec un peu de beurre ou d'huile.",
    "Ajoute le poulet marine.",
    "Fais cuire 6 a 7 minutes jusqu'a ce qu'il soit dore.",
    "5. Faire la sauce",
    "Ajoute dans la poele :",
    "- tomates concassees",
    "- lait de coco",
    "- paprika",
    "- garam masala",
    "Melange et laisse mijoter 8 a 10 minutes.",
    "La sauce doit devenir epaisse et bien parfumee.",
    "6. Servir",
    "Mets le riz dans un bol.",
    "Ajoute le butter chicken.",
    "Ajoute les brocolis a cote.",
    "Ton butter chicken proteine est pret.",
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
  prepTime: "10 ÃƒÆ’Ã‚Â  12 min",
  servings: "1 pers",
  image: avocadoToastImg,
  ingredients: [
    "1 ou 2 tranches de pain (complet ou au choix)",
    "1 avocat mÃƒÆ’Ã‚Â»r",
    "1 Ãƒâ€¦Ã¢â‚¬Å“uf",
    "Sel et poivre",
    "Un filet dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Jus de citron (facultatif)",
    "Une pincÃƒÆ’Ã‚Â©e de flocons de piment ou de paprika",
  ],
  steps: [
    "1. Griller le pain",
    "Mets la tranche de pain au grille-pain ou dans une poele.",
    "Fais griller 2 a 3 minutes jusqu'a ce qu'elle soit bien croustillante.",
    "2. Preparer l'avocat",
    "Ecrase 1/2 avocat dans un bol.",
    "Ajoute :",
    "- jus de citron",
    "- une pincee de sel",
    "- un peu de poivre",
    "Melange jusqu'a obtenir une texture cremeuse.",
    "Le citron aide aussi a eviter que l'avocat noircisse.",
    "3. Faire l'oeuf poche",
    "Porte une casserole d'eau a fremissement (pas grosse ebullition).",
    "Ajoute 1 c. a cafe de vinaigre (optionnel mais aide le blanc a coaguler).",
    "Casse l'oeuf dans un petit bol.",
    "Fais un petit tourbillon dans l'eau avec une cuillere.",
    "Verse l'oeuf au centre.",
    "Laisse cuire 2 minutes 30 a 3 minutes.",
    "L'oeuf est pret quand le blanc est pris et le jaune reste coulant.",
    "4. Monter l'avocado toast",
    "Etale l'avocat ecrase sur le pain grille.",
    "Depose l'oeuf poche dessus.",
    "5. Ajouter les finitions",
    "Verse un filet d'huile d'olive.",
    "Ajoute poivre noir.",
    "Optionnel : flocons de piment, graines ou herbes.",
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
  prepTime: "25 ÃƒÆ’Ã‚Â  30 min",
  servings: "1 pers",
  image: curryPoischicheImg,
  ingredients: [
    "150 g de pois chiches cuits (ÃƒÆ’Ã‚Â©gouttÃƒÆ’Ã‚Â©s)",
    "100 ml de lait de coco",
    "1/2 oignon",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de concentrÃƒÆ’Ã‚Â© de tomate",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de curry en poudre",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de paprika",
    "Sel et poivre",
    "Persil frais",
    "Pour lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢accompagnement",
    "60 g de riz cru",
  ],
  steps: [
    "1. Faire revenir la base aromatique",
    "Chauffe 1 c. a soupe d'huile dans une grande poele.",
    "Ajoute l'oignon hache.",
    "Fais cuire 5 minutes jusqu'a ce qu'il soit tendre.",
    "Ajoute ail et gingembre et fais cuire 1 minute.",
    "2. Ajouter les epices",
    "Ajoute :",
    "- curry",
    "- cumin",
    "- paprika",
    "- curcuma",
    "Melange 30 secondes pour liberer les aromes.",
    "3. Faire la sauce",
    "Ajoute les tomates concassees.",
    "Laisse cuire 3 minutes.",
    "Verse le lait de coco et melange.",
    "4. Ajouter les pois chiches",
    "Ajoute les pois chiches egouttes.",
    "Laisse mijoter 10 a 12 minutes a feu doux.",
    "Si la sauce est trop epaisse, ajoute un peu d'eau.",
    "5. Finaliser",
    "Ajoute le garam masala.",
    "Presse un peu de citron ou citron vert.",
    "Ajuste sel et poivre.",
    "6. Servir",
    "Serre le curry avec :",
    "- riz basmati",
    "- naan",
    "- ou quinoa.",
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
    "Preparer les pois chiches",
    "Egoutte et rince les pois chiches.",
    "Si tu veux un houmous tres lisse, retire la peau des pois chiches (optionnel mais recommande).",
    "Mixer le houmous",
    "Dans un blender ou robot, ajoute les pois chiches, le tahini, le jus de citron, la gousse d'ail, l'huile d'olive, le sel et le poivre.",
    "Mix pendant 1 minute.",
    "Ajuster la texture",
    "Ajoute progressivement l'eau froide tout en mixant jusqu'a obtenir une texture tres cremeuse et lisse.",
    "Dressage",
    "Verse le houmous dans un bol.",
    "Fais un petit creux au centre et ajoute un filet d'huile d'olive, un peu de paprika et du persil.",
    "Deguster",
    "Sers avec du pain pita et des legumes crus (carottes, concombre).",
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
    "Preparer le concombre",
    "Rape le concombre.",
    "Presse-le dans un torchon ou avec les mains pour retirer l'exces d'eau.",
    "Preparer la sauce",
    "Dans un bol, ajoute : le yaourt grec, le concombre rape, l'ail finement hache, l'aneth ou la menthe.",
    "Assaisonner",
    "Ajoute l'huile d'olive, le citron, une pincee de sel et un peu de poivre.",
    "Melange bien.",
    "Repos",
    "Place au refrigerateur 30 minutes pour que les saveurs se developpent.",
    "Servir",
    "Verse dans un petit bol et ajoute un filet d'huile d'olive sur le dessus.",
    "Astuce : le secret d'un tres bon tzatziki est de bien presser le concombre pour eviter que la sauce soit trop liquide.",
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
    "Preparer les tomates",
    "Coupe les tomates en petits des.",
    "Preparer les herbes",
    "Hache finement le basilic, le persil et l'echalote.",
    "Melanger la sauce",
    "Dans un bol, ajoute : les des de tomates, l'echalote, les herbes, le jus de citron, l'huile d'olive.",
    "Melange bien.",
    "Assaisonner",
    "Ajoute une pincee de sel et un peu de poivre.",
    "Repos",
    "Laisse reposer 10 a 15 minutes pour que les saveurs se melangent.",
    "Servir",
    "Verse la sauce sur du poisson grille, du saumon, du poulet ou des legumes.",
    "Astuce : ajoute un peu de zeste de citron pour une sauce encore plus parfumee.",
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
    "Preparer l'echalote",
    "Epluche l'echalote et coupe-la tres finement.",
    "Melanger la base",
    "Dans un bol, ajoute : la moutarde, le miel, le vinaigre balsamique.",
    "Melange bien.",
    "Ajouter l'huile",
    "Verse l'huile d'olive progressivement en melangeant pour creer une vinaigrette bien liee.",
    "Ajouter l'echalote",
    "Ajoute l'echalote, une pincee de sel et un peu de poivre.",
    "Servir",
    "Melange une derniere fois et verse sur ta salade.",
    "Astuce : laisse reposer 10 minutes pour que l'echalote parfume la vinaigrette.",
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
    "Melanger la base",
    "Dans un bol, ajoute le tahini et l'eau.",
    "Melange jusqu'a obtenir une texture cremeuse et homogene.",
    "Ajouter les saveurs",
    "Ajoute : le miel, la sauce soja ou le tamari, le jus de citron, l'ail emince.",
    "Melanger la sauce",
    "Fouette bien jusqu'a ce que la sauce devienne lisse et onctueuse.",
    "Ajuster la texture",
    "Si la sauce est trop epaisse, ajoute un peu d'eau (1 cuillere a soupe a la fois) jusqu'a obtenir la consistance souhaitee.",
    "Servir",
    "Verse la sauce sur des salades, legumes rotis, bowls ou falafels.",
    "Astuce : ajoute une pincee de cumin ou de paprika pour donner encore plus de caractere a la sauce.",
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
    "Melanger la base",
    "Dans un bol, ajoute le beurre de cacahuete, la sauce soja et l'eau.",
    "Melange bien jusqu'a obtenir une texture cremeuse et homogene.",
    "Ajouter les saveurs",
    "Ajoute : le vinaigre de riz, le sirop d'erable ou d'agave, le jus de citron vert, l'ail emince.",
    "Melange bien.",
    "Ajouter le piquant (optionnel)",
    "Ajoute la sauce sriracha si tu souhaites une sauce legerement epicee.",
    "Ajuster la texture",
    "Si la sauce est trop epaisse, ajoute un peu d'eau jusqu'a obtenir la consistance desiree.",
    "Servir",
    "Cette sauce est ideale pour accompagner : des rouleaux de printemps, des nouilles asiatiques, des legumes sautes.",
    "Astuce : ajoute une pincee de graines de sesame ou un peu de gingembre rape pour encore plus de saveur asiatique.",
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
    "Preparer les herbes",
    "Hache finement le persil et la ciboulette.",
    "Emince ou ecrase l'ail.",
    "Melanger la sauce",
    "Dans un bol, ajoute : le yaourt grec, l'huile d'olive, les herbes, l'ail.",
    "Melange bien.",
    "Assaisonner",
    "Ajoute le jus de citron, une pincee de sel et un peu de poivre.",
    "Repos",
    "Place la sauce 15 a 20 minutes au refrigerateur pour que les saveurs se developpent.",
    "Servir",
    "Melange une derniere fois avant de servir.",
    "Astuce : ajoute un peu d'aneth pour une version encore plus fraiche, parfaite avec le poisson ou le saumon.",
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
    "Preparer les herbes",
    "Hache finement le persil.",
    "Emince ou ecrase l'ail.",
    "Melanger la sauce",
    "Dans un bol, ajoute : le persil, l'ail, l'huile d'olive, le vinaigre de vin rouge.",
    "Melange bien.",
    "Ajouter la touche sucree",
    "Ajoute le miel et le jus de citron.",
    "Assaisonner",
    "Ajoute une pincee de sel, de poivre et eventuellement les flocons de piment.",
    "Repos",
    "Laisse reposer 10 a 15 minutes pour que les saveurs se melangent.",
    "Servir",
    "Cette sauce est parfaite avec : steak grille, poulet, legumes grilles.",
    "Astuce : ajoute un peu de coriandre pour une version encore plus parfumee.",
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
    "Griller les legumes",
    "Prechauffe le four a 200 C.",
    "Coupe les aubergines en deux dans la longueur.",
    "Coupe les poivrons en deux et retire les graines.",
    "Depose-les sur une plaque et fais-les cuire 25 a 30 minutes jusqu'a ce qu'ils soient bien tendres et legerement grilles.",
    "Preparer les legumes",
    "Laisse refroidir legerement les legumes.",
    "Retire la peau des poivrons si necessaire.",
    "Recupere la chair des aubergines avec une cuillere.",
    "Mixer la sauce",
    "Dans un blender ou un mixeur, ajoute : la chair des aubergines, les poivrons grilles, l'ail, le paprika, le jus de citron, le yaourt grec.",
    "Mix jusqu'a obtenir une texture cremeuse et homogene.",
    "Assaisonner",
    "Ajoute du sel, du poivre et les herbes fraiches finement hachees.",
    "Servir",
    "Verse la sauce dans un bol et ajoute un filet d'huile d'olive et quelques herbes fraiches.",
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
    "Faire revenir l'echalote",
    "Dans une poele, fais fondre le beurre a feu moyen.",
    "Ajoute l'echalote finement hachee et fais-la revenir 2 minutes.",
    "Ajouter le poivre",
    "Ajoute le poivre concasse et melange pendant 30 secondes pour liberer les aromes.",
    "Deglacer au cognac",
    "Verse le cognac dans la poele pour deglacer les sucs de cuisson.",
    "Laisse reduire 1 a 2 minutes.",
    "Ajouter la creme",
    "Ajoute la creme fraiche et melange bien.",
    "Laisse mijoter 3 a 5 minutes jusqu'a ce que la sauce epaississe.",
    "Ajuster l'assaisonnement",
    "Ajoute une pincee de sel et, si tu veux une sauce plus intense, un peu de fond de veau.",
    "Servir",
    "Verse la sauce sur un steak grille ou une viande rouge bien chaude.",
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
    "Preparer les oignons",
    "Epluche l'oignon rouge et coupe-le en fines rondelles.",
    "Preparer la marinade",
    "Dans une petite casserole ou un bol, melange : le vinaigre, l'eau, le sucre, le sel.",
    "Remue jusqu'a ce que le sucre et le sel soient dissous.",
    "Mariner les oignons",
    "Place les rondelles d'oignon dans un bocal ou un bol.",
    "Verse la marinade dessus jusqu'a bien couvrir les oignons.",
    "Repos",
    "Laisse mariner au moins 30 minutes.",
    "Pour un gout plus intense, laisse reposer 2 a 3 heures au refrigerateur.",
    "Utilisation",
    "Les oignons marines sont delicieux dans : tacos, salades, sandwichs, bowls.",
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
    "Preparer le concombre",
    "Lave le concombre et coupe-le en fines rondelles ou en batonnets.",
    "Preparer la marinade",
    "Dans un bol ou une petite casserole, melange : le vinaigre, l'eau, le sucre, le sel.",
    "Remue jusqu'a ce que le sucre et le sel soient bien dissous.",
    "Mettre en bocal",
    "Place les concombres dans un bocal.",
    "Ajoute l'ail, l'aneth et le poivre si tu en utilises.",
    "Verser la marinade",
    "Verse la marinade sur les concombres jusqu'a bien les couvrir.",
    "Repos",
    "Laisse mariner au moins 1 heure au refrigerateur.",
    "Pour des pickles plus parfumes, laisse 3 a 4 heures.",
    "Servir",
    "Ces pickles sont parfaits dans : burgers, sandwichs, salades, bowls.",
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
    "Preparer les carottes",
    "Epluche les carottes.",
    "Coupe-les en batonnets fins ou en rondelles.",
    "Preparer la marinade",
    "Dans un bol ou une petite casserole, melange : le vinaigre, l'eau, le sucre, le sel.",
    "Remue jusqu'a ce que le sucre et le sel soient dissous.",
    "Mettre en bocal",
    "Place les carottes dans un bocal.",
    "Ajoute l'ail, le gingembre ou le piment si tu en utilises.",
    "Ajouter la marinade",
    "Verse la marinade sur les carottes jusqu'a les couvrir completement.",
    "Repos",
    "Place au refrigerateur pendant au moins 1 heure.",
    "Pour un gout plus intense, laisse mariner 3 a 4 heures.",
    "Servir",
    "Ces pickles sont delicieux dans : bowls, salades, tacos, sandwichs.",
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
    "Preparer le chou-fleur",
    "Lave le chou-fleur et coupe-le en petits bouquets.",
    "Preparer la marinade",
    "Dans un bol ou une petite casserole, melange : le vinaigre, l'eau, le sucre, le sel.",
    "Remue jusqu'a ce que le sucre et le sel soient bien dissous.",
    "Mettre en bocal",
    "Place les bouquets de chou-fleur dans un bocal.",
    "Ajoute l'ail, les graines de moutarde et les epices si tu en utilises.",
    "Verser la marinade",
    "Verse la marinade sur le chou-fleur jusqu'a bien le couvrir.",
    "Repos",
    "Place au refrigerateur au moins 2 heures.",
    "Pour un gout plus intense, laisse mariner une nuit.",
    "Servir",
    "Les pickles de chou-fleur sont delicieux : a l'aperitif, dans des salades, dans des bowls ou sandwiches.",
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
    "Preparer les ingredients",
    "Lave et seche bien les feuilles de basilic.",
    "Epluche l'ail.",
    "Mixer la sauce",
    "Dans un blender ou un mortier, ajoute : le basilic, les pignons de pin, l'ail, le parmesan.",
    "Mix jusqu'a obtenir une pate.",
    "Ajouter l'huile",
    "Verse l'huile d'olive progressivement tout en mixant pour obtenir une sauce bien lisse.",
    "Assaisonner",
    "Ajoute une pincee de sel et un peu de poivre.",
    "Servir",
    "Le pesto est parfait avec : pates, salades, sandwichs, legumes grilles.",
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
    "Preparer les avocats",
    "Coupe les avocats en deux, retire le noyau et recupere la chair dans un bol.",
    "Ecraser les avocats",
    "Ecrase les avocats a la fourchette jusqu'a obtenir une texture cremeuse mais legerement chunky.",
    "Ajouter les ingredients",
    "Ajoute : le jus de citron vert, la tomate coupee en petits des, l'oignon rouge finement hache, la coriandre.",
    "Assaisonner",
    "Ajoute une pincee de sel, de poivre et eventuellement un peu de piment.",
    "Melanger et servir",
    "Melange delicatement et sers immediatement.",
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
    "Preparer les ingredients",
    "Epluche la mangue et coupe-la en petits des.",
    "Hache finement l'oignon et l'ail.",
    "Cuire le chutney",
    "Dans une petite casserole, ajoute : la mangue, l'oignon, l'ail, le vinaigre, le sucre, les epices.",
    "Laisser mijoter",
    "Fais cuire a feu doux 15 a 20 minutes en remuant jusqu'a obtenir une texture epaisse.",
    "Assaisonner",
    "Ajoute une pincee de sel et de poivre.",
    "Laisser refroidir et servir",
    "Laisse refroidir avant de servir.",
    "Astuce : ce chutney est parfait avec fromage, poulet ou riz.",
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
    "Cuire les aubergines",
    "Prechauffe le four a 200 C.",
    "Coupe les aubergines en deux et enfourne 30 minutes.",
    "Recuperer la chair",
    "Laisse refroidir puis recupere la chair avec une cuillere.",
    "Mixer la preparation",
    "Dans un mixeur, ajoute : la chair d'aubergine, l'ail, l'huile d'olive, le citron.",
    "Assaisonner",
    "Ajoute sel et poivre.",
    "Servir",
    "Melange bien et sers froid.",
    "Astuce : ajoute un peu de paprika fume pour un gout encore plus intense.",
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
    "Preparer les ingredients",
    "Denoyaute les olives si necessaire.",
    "Mixer la tapenade",
    "Dans un mixeur, ajoute : les olives, les capres, l'ail, l'huile d'olive, le citron.",
    "Mixer",
    "Mix jusqu'a obtenir une texture legerement granuleuse.",
    "Assaisonner",
    "Ajoute un peu de poivre.",
    "Servir",
    "Sers avec du pain grille.",
    "Astuce : la tapenade est delicieuse sur focaccia ou dans des sandwichs.",
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
    "Melanger les ingredients",
    "Dans une casserole, ajoute : la sauce soja, le mirin, le sucre, le gingembre, l'ail.",
    "Chauffer la sauce",
    "Fais chauffer a feu moyen 5 minutes.",
    "Epaissir",
    "Ajoute la maizena diluee si tu veux une sauce plus epaisse.",
    "Laisser refroidir",
    "Laisse tiedir avant utilisation.",
    "Servir",
    "Utilise avec poulet, saumon ou legumes sautes.",
    "Astuce : ajoute des graines de sesame au moment de servir.",
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
    "Chauffer l'huile",
    "Fais chauffer l'huile dans une casserole sans la faire bouillir.",
    "Ajouter les aromates",
    "Ajoute le piment et l'ail dans un bocal.",
    "Verser l'huile",
    "Verse l'huile chaude sur les piments.",
    "Laisser infuser",
    "Laisse refroidir puis reposer au moins 24 heures.",
    "Utiliser",
    "Utilise sur nouilles, pizzas ou legumes.",
    "Astuce : plus l'huile repose, plus elle devient parfumee.",
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
    "Preparer les citrons",
    "Lave les citrons et coupe-les en croix sans aller jusqu'au bout.",
    "Saler",
    "Remplis l'interieur des citrons avec le sel.",
    "Mettre en bocal",
    "Place les citrons dans un bocal et ajoute le jus de citron.",
    "Fermenter",
    "Ferme et laisse reposer 2 a 3 semaines.",
    "Utiliser",
    "Rince legerement avant utilisation.",
    "Astuce : parfait dans tajines et salades.",
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
    "Preparer les oignons",
    "Epluche les oignons et coupe-les en fines lamelles.",
    "Cuire",
    "Dans une poele, fais chauffer l'huile et ajoute les oignons.",
    "Ajouter les saveurs",
    "Ajoute le sucre et le vinaigre balsamique.",
    "Laisser confire",
    "Laisse cuire 20 minutes a feu doux.",
    "Servir",
    "Sers avec burgers, viandes ou fromages.",
    "Astuce : la cuisson lente donne un gout tres caramelise.",
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
    "Preparer l'ail",
    "Epluche les gousses d'ail.",
    "Cuire doucement",
    "Place l'ail dans une petite casserole et couvre d'huile d'olive.",
    "Confire",
    "Fais cuire a feu tres doux 20 a 30 minutes.",
    "Refroidir",
    "Laisse refroidir dans l'huile.",
    "Utiliser",
    "L'ail devient fondant et doux.",
    "Astuce : l'huile restante est delicieuse pour cuire ou assaisonner.",
  ],
},
{
  id: "mass-riz-cajou",
  title: "Steak, pommes de terre & haricots verts",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã‚Â  35 min",
  servings: "1 pers",
  image: steackPommeDeTerreImg,
  ingredients: [
    "1 steak hachÃƒÆ’Ã‚Â© (150 ÃƒÆ’Ã‚Â  200 g, selon besoin calorique)",
    "300 g de pommes de terre",
    "150 g de haricots verts",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail (optionnel)",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes de Provence",
  ],
  steps: [
    "1. Preparer les pommes de terre",
    "Prechauffe le four a 200C.",
    "Coupe les pommes de terre en cubes ou quartiers.",
    "Mets-les dans un bol avec :",
    "- 1/2 c. a soupe d'huile d'olive",
    "- sel et poivre",
    "- herbes de Provence (optionnel).",
    "Melange bien.",
    "2. Cuire les pommes de terre",
    "Etale les pommes de terre sur une plaque de cuisson.",
    "Enfourne 20 a 25 minutes.",
    "Remue a mi-cuisson pour qu'elles deviennent bien dorees et croustillantes.",
    "Les pommes de terre doivent cuire jusqu'a etre tendres a l'interieur et croustillantes a l'exterieur.",
    "3. Cuire les haricots verts",
    "Mets les haricots verts dans une poele avec un petit filet d'huile d'olive.",
    "Ajoute l'ail hache.",
    "Ajoute 2 cuilleres a soupe d'eau et couvre.",
    "Laisse cuire 5 a 6 minutes jusqu'a ce qu'ils soient tendres.",
    "Les haricots verts peuvent etre sautes ou legerement cuits a la vapeur avec ail et beurre/huile pour garder leur texture.",
    "4. Cuire le steak",
    "Chauffe une poele a feu fort avec le reste d'huile d'olive.",
    "Assaisonne le steak avec sel et poivre.",
    "Fais cuire :",
    "- 2 a 3 minutes par cote -> saignant",
    "- 3 a 4 minutes par cote -> a point",
    "Une cuisson rapide dans une poele tres chaude permet de former une croute doree tout en gardant le steak juteux.",
    "5. Servir",
    "Mets les pommes de terre roties dans l'assiette.",
    "Ajoute les haricots verts a l'ail.",
    "Pose le steak chaud a cote.",
    "Ajoute un peu de persil frais si tu veux.",
    "Ton steak pommes de terre haricots verts est pret.",
  ],
},

 {
  id: "mass-overnight-prot",
  title: "Overnight oats protÃƒÆ’Ã‚Â©inÃƒÆ’Ã‚Â©s",
  flavor: "sucre",
  prepTime: "5 ÃƒÆ’Ã‚Â  7 min",
  servings: "1 pers",
  image: overnightOatsImg,
  ingredients: [
    "50 g de flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de graines de chia",
    "1 scoop de protÃƒÆ’Ã‚Â©ine whey",
    "120 g de yaourt (nature)",
    "120 ml de lait dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amande",
    "50 g de framboises",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de pÃƒÆ’Ã‚Â¢te ÃƒÆ’Ã‚Â  tartiner Biscoff (sur le dessus)",
  ],
  steps: [
    "1. Preparer la base d'avoine",
    "Dans un bocal ou bol melange :",
    "- flocons d'avoine",
    "- lait",
    "- yaourt",
    "- miel",
    "- vanille",
    "Melange jusqu'a obtenir une texture bien cremeuse.",
    "2. Ajouter les framboises",
    "Ecrase la moitie des framboises dans le melange.",
    "Melange legerement pour donner un gout fruite.",
    "3. Faire les couches",
    "Ajoute une couche de pate Biscoff.",
    "Ajoute le reste des framboises entieres.",
    "Ajoute le speculoos emiette.",
    "4. Repos",
    "Couvre le bocal.",
    "Mets au refrigerateur au moins 4 heures ou toute la nuit.",
    "Les flocons d'avoine vont absorber le liquide et devenir cremeux comme un pudding.",
    "5. Servir",
    "Melange legerement ou laisse les couches visibles.",
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
  title: "Brownie protÃƒÆ’Ã‚Â©inÃƒÆ’Ã‚Â©",
  flavor: "sucre",
  prepTime: "30 ÃƒÆ’Ã‚Â  35 min",
  servings: "1 pers",
  image: brownieProteineImg,
  ingredients: [
    "60 g de whey protÃƒÆ’Ã‚Â©ine isolate OVERSTIM.s",
    "200 g de compote de pomme bio",
    "2 blancs dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“ufs",
    "1 Ãƒâ€¦Ã¢â‚¬Å“uf entier",
    "100 g de farine de blÃƒÆ’Ã‚Â© T65 ou T80",
    "Sel",
    "4 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  soupe de sucre roux ou de sucre de fleur de coco",
    "4 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  soupe de chocolat en poudre ou de cacao en poudre ou 50 g de chocolat noir ÃƒÆ’Ã‚Â  pÃƒÆ’Ã‚Â¢tisser (70 ÃƒÆ’Ã‚Â  85% de cacao)",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de levure chimique",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffe le four a 180 C.",
    "Tapisse un moule carre (20 cm) de papier cuisson.",
    "2. Faire fondre le chocolat",
    "Mets le chocolat et le beurre dans un bol.",
    "Fais fondre :",
    "- au bain-marie, ou",
    "- au micro-ondes par intervalles de 30 secondes.",
    "Melange jusqu'a obtenir une texture lisse.",
    "3. Ajouter le sucre et les oeufs",
    "Ajoute le sucre dans le melange chocolat.",
    "Melange bien.",
    "Ajoute les oeufs un par un.",
    "Ajoute la vanille.",
    "4. Ajouter les ingredients secs",
    "Incorpore :",
    "- la farine",
    "- le sel",
    "Melange juste jusqu'a incorporation.",
    "5. Ajouter les noix",
    "Ajoute les noix grossierement concassees.",
    "Melange delicatement.",
    "6. Cuisson",
    "Verse la pate dans le moule.",
    "Enfourne 20 a 25 minutes.",
    "Le brownie est pret quand :",
    "- le centre est encore legerement fondant",
    "- les bords sont cuits.",
    "7. Refroidir",
    "Laisse refroidir 15 minutes.",
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
  title: "Bowl sucrÃƒÆ’Ã‚Â© fruits rouges & granola",
  flavor: "sucre",
  prepTime: "5 ÃƒÆ’Ã‚Â  7 min",
  servings: "1 pers",
  image: fruitsRougesGranolaImg,
  ingredients: [
    "150 ÃƒÆ’Ã‚Â  200 g de fromage blanc ou yaourt grec",
    "50 g de myrtilles",
    "3 ÃƒÆ’Ã‚Â  4 fraises",
    "30 g de granola",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de sirop dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©rable",
  ],
  steps: [
    "1. Preparer la base",
    "Mets 200 g de yaourt grec dans un bol.",
    "Ajoute le miel ou le sirop d'erable.",
    "Melange legerement.",
    "2. Ajouter les fruits",
    "Coupe les fraises en morceaux si necessaire.",
    "Dispose les fruits rouges sur le yaourt.",
    "3. Ajouter le granola",
    "Saupoudre le granola sur le dessus.",
    "Ajoute les graines.",
    "4. Ajouter les toppings",
    "Ajoute un filet de miel.",
    "Optionnel : ajoute beurre de cacahuete, noix ou chocolat.",
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
  prepTime: "35 ÃƒÆ’Ã‚Â  45 min",
  servings: "1 pers",
  image: granolaMaisonImg,
  ingredients: [
    "250 g de flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine",
    "60 g dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amandes",
    "60 g de noisettes",
    "60 g de noix",
    "3 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  soupe de miel",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de cannelle",
    "1 pincÃƒÆ’Ã‚Â©e de sel",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffe le four a 170 C.",
    "Recouvre une plaque de cuisson de papier cuisson.",
    "2. Melanger les ingredients secs",
    "Dans un grand bol melange :",
    "- flocons d'avoine",
    "- noix grossierement concassees",
    "- cannelle",
    "- sel",
    "3. Ajouter les ingredients liquides",
    "Ajoute :",
    "- miel ou sirop d'erable",
    "- huile",
    "- vanille",
    "Melange bien pour que tout soit legerement enrobe.",
    "4. Cuisson",
    "Etale le granola sur la plaque.",
    "Enfourne 20 a 25 minutes.",
    "Remue a mi-cuisson.",
    "Le granola doit devenir bien dore et croustillant.",
    "5. Refroidir",
    "Laisse refroidir completement.",
    "Le granola va durcir et former des morceaux croustillants.",
    "6. Ajouter les extras",
    "Une fois refroidi, ajoute :",
    "- pepites de chocolat",
    "- fruits secs.",
    "Ton granola maison est pret.",
    "Astuces pour un granola incroyable",
    "- ne melange pas trop pendant la cuisson pour garder des clusters",
    "- ajoute un blanc d'oeuf dans le melange pour encore plus de croustillant",
    "- laisse refroidir completement avant de casser les morceaux.",
  ],
},
{
  id: "healthy-soupe-verte",
  title: "Soupe verte dÃƒÆ’Ã‚Â©tox",
  flavor: "sale",
  prepTime: "20 ÃƒÆ’Ã‚Â  25 min",
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
    "Coupe le brocoli en petits morceaux.",
    "Coupe la courgette en rondelles.",
    "Lave les epinards.",
    "2. Faire revenir l'ail",
    "Chauffe 1 c. a cafe d'huile d'olive dans une casserole.",
    "Ajoute l'ail hache.",
    "Fais cuire 30 secondes pour liberer les aromes.",
    "3. Cuire la soupe",
    "Ajoute le brocoli et la courgette dans la casserole.",
    "Verse 300 ml de bouillon de legumes.",
    "Porte a ebullition.",
    "Laisse cuire 10 a 12 minutes jusqu'a ce que les legumes soient tendres.",
    "Les legumes doivent simplement mijoter jusqu'a devenir tendres, generalement environ 10-15 minutes.",
    "4. Ajouter les epinards",
    "Ajoute la poignee d'epinards.",
    "Laisse cuire 1 minute jusqu'a ce qu'ils \"tombent\".",
    "5. Mixer",
    "Mixe la soupe avec un mixeur plongeant ou dans un blender.",
    "Mixe jusqu'a obtenir une texture lisse et verte.",
    "6. Assaisonner",
    "Ajoute du poivre noir.",
    "Goute et ajuste l'assaisonnement si besoin.",
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
  prepTime: "55 ÃƒÆ’Ã‚Â  65 min",
  servings: "1 pers",
  image: bananaBreadImg,
  ingredients: [
    "3 bananes mÃƒÆ’Ã‚Â»res (dont 1 pour la dÃƒÆ’Ã‚Â©coration)",
    "2 Ãƒâ€¦Ã¢â‚¬Å“ufs ou 100 g de compote",
    "150 g de farine",
    "50 g de poudre dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amande",
    "80 g de sucre roux",
    "50 g dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tale (cacahuÃƒÆ’Ã‚Â¨te, coco ou tournesol)",
    "100 ml de lait dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amande ou de coco",
    "1/2 sachet de levure chimique",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de bicarbonate",
    "1 pincÃƒÆ’Ã‚Â©e de sel",
    "1 sachet de sucre vanillÃƒÆ’Ã‚Â©",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de cannelle",
  ],
  steps: [
    "  PrÃƒÆ’Ã‚Â©chauffer le four",
    "PrÃƒÆ’Ã‚Â©chauffe le four ÃƒÆ’Ã‚Â  180Ãƒâ€šÃ‚Â°C.",
    "PrÃƒÆ’Ã‚Â©parer les bananes",
    "ÃƒÆ’Ã¢â‚¬Â°pluche et mixe 2 bananes jusqu'ÃƒÆ’Ã‚Â  obtenir une purÃƒÆ’Ã‚Â©e lisse. RÃƒÆ’Ã‚Â©serve la 3ÃƒÂ¡Ã‚ÂµÃ¢â‚¬Â° banane pour la dÃƒÆ’Ã‚Â©coration.",
    "PrÃƒÆ’Ã‚Â©parer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢appareil",
    "Dans un grand saladier : Bats les Ãƒâ€¦Ã¢â‚¬Å“ufs avec le sucre roux et le sucre vanillÃƒÆ’Ã‚Â©. Ajoute la cannelle et mÃƒÆ’Ã‚Â©lange. Incorpore lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tale. Ajoute la purÃƒÆ’Ã‚Â©e de bananes. Verse le lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal. MÃƒÆ’Ã‚Â©lange jusqu'ÃƒÆ’Ã‚Â  obtenir une prÃƒÆ’Ã‚Â©paration homogÃƒÆ’Ã‚Â¨ne.",
    "Ajouter les ingrÃƒÆ’Ã‚Â©dients secs",
    "Ajoute : la farine, la levure chimique, le bicarbonate, le sel, la poudre dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amande. MÃƒÆ’Ã‚Â©lange dÃƒÆ’Ã‚Â©licatement jusqu'ÃƒÆ’Ã‚Â  obtenir une pÃƒÆ’Ã‚Â¢te lisse.",
    "Mise en moule",
    "Huile lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement un moule. Verse la prÃƒÆ’Ã‚Â©paration dans le moule. Coupe la banane rÃƒÆ’Ã‚Â©servÃƒÆ’Ã‚Â©e en deux dans la longueur et dÃƒÆ’Ã‚Â©pose-la sur le dessus.",
    "Cuisson",
    "Enfourne ÃƒÆ’Ã‚Â  180Ãƒâ€šÃ‚Â°C pendant 40 ÃƒÆ’Ã‚Â  45 minutes. VÃƒÆ’Ã‚Â©rifie la cuisson avec la pointe dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢un couteau : elle doit ressortir sÃƒÆ’Ã‚Â¨che.",
    "Refroidissement",
    "Laisse tiÃƒÆ’Ã‚Â©dir avant de dÃƒÆ’Ã‚Â©mouler et de dÃƒÆ’Ã‚Â©couper.",
  ],
},
{
  id: "healthy-overnight-oats",
  title: "Brochettes de poulet, salade fraÃƒÆ’Ã‚Â®che & boulghour ÃƒÆ’Ã‚Â  la tomate",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã‚Â  35 min",
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
    "Coupe le poulet en cubes.",
    "Mets-les dans un bol.",
    "Ajoute :",
    "- huile d'olive",
    "- jus de citron",
    "- poivre",
    "- paprika",
    "Melange et laisse mariner 5 minutes.",
    "2. Faire les brochettes",
    "Pique les morceaux de poulet sur un pic a brochette.",
    "Chauffe une poele ou un grill.",
    "Fais cuire les brochettes 10 a 12 minutes en les retournant jusqu'a ce que le poulet soit bien dore.",
    "3. Cuire le boulgour",
    "Mets 60 g de boulgour dans une casserole.",
    "Ajoute 120 ml d'eau.",
    "Ajoute la tomate coupee en petits des et le concentre de tomate.",
    "Porte a ebullition.",
    "Couvre et laisse cuire 10 a 12 minutes a feu doux.",
    "Ajoute 1 c. a cafe d'huile d'olive et melange.",
    "4. Preparer la salade",
    "Coupe la tomate en morceaux.",
    "Coupe le concombre en des.",
    "Melange avec la salade verte.",
    "Ajoute huile d'olive, citron et poivre.",
    "5. Servir",
    "Mets le boulgour a la tomate dans l'assiette.",
    "Ajoute les brochettes de poulet grillees.",
    "Ajoute la salade fraiche a cote.",
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
    "150 g de mangue (fraÃƒÆ’Ã‚Â®che ou surgelÃƒÆ’Ã‚Â©e)",
    "1 fruit de la passion",
    "200 ml de lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal (amande, coco lÃƒÆ’Ã‚Â©ger ou avoine)",
    "100 g de yaourt nature ou yaourt grec allÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de jus de citron (optionnel)",
    "Quelques glaÃƒÆ’Ã‚Â§ons (optionnel)",
  ],
  steps: [
    "Coupe la mangue en morceaux si elle est fraÃƒÆ’Ã‚Â®che.",
    "RÃƒÆ’Ã‚Â©cupÃƒÆ’Ã‚Â¨re la pulpe du fruit de la passion ÃƒÆ’Ã‚Â  lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢aide dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢une cuillÃƒÆ’Ã‚Â¨re.",
    "Verse le lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal dans le blender.",
    "Ajoute la mangue, la pulpe de passion et le yaourt.",
    "Ajoute le jus de citron et les glaÃƒÆ’Ã‚Â§ons si souhaitÃƒÆ’Ã‚Â©.",
    "Mixe pendant 30 ÃƒÆ’Ã‚Â  60 secondes, jusqu'ÃƒÆ’Ã‚Â  obtenir une texture lisse et onctueuse.",
    "Verse dans un verre et consomme immÃƒÆ’Ã‚Â©diatement.",
  ],
},
{
  id: "healthy-wrap-legumes",
  title: "Brownie salÃƒÆ’Ã‚Â© au brocoli, feta & lardons",
  flavor: "sale",
  prepTime: "60 ÃƒÆ’Ã‚Â  65 min",
  servings: "1 pers",
  image: brownieSaleImg,
  ingredients: [
    "1 brocoli",
    "2 Ãƒâ€¦Ã¢â‚¬Å“ufs",
    "160 g de farine",
    "1/2 feta",
    "Lardons",
    "250 ml de lait",
    "ComtÃƒÆ’Ã‚Â© rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©",
    "Huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Sel",
    "Poivre",
    "Ail en poudre",
  ],
  steps: [
    "1. Preparer le brocoli",
    "Coupe le brocoli en petits bouquets.",
    "Fais-le cuire dans l'eau bouillante 4 a 5 minutes jusqu'a ce qu'il soit tendre.",
    "Egoutte bien et coupe les morceaux plus petits si besoin.",
    "2. Cuire les lardons",
    "Mets les lardons dans une poele chaude.",
    "Fais-les cuire 3 a 4 minutes jusqu'a ce qu'ils soient dores.",
    "Egoutte legerement le gras si necessaire.",
    "3. Preparer la pate",
    "Dans un saladier, casse les 2 oeufs.",
    "Ajoute le lait et l'huile d'olive.",
    "Melange bien.",
    "Ajoute la farine et melange jusqu'a obtenir une pate lisse.",
    "4. Ajouter les garnitures",
    "Ajoute :",
    "- le comte rape",
    "- les lardons",
    "- la feta emiettee",
    "- le brocoli",
    "Ajoute ail en poudre, sel et poivre.",
    "Melange delicatement.",
    "5. Cuisson",
    "Prechauffe le four a 180C.",
    "Verse la pate dans un moule carre legerement huile.",
    "Enfourne 25 minutes.",
    "Le brownie est pret quand le dessus est legerement dore et la lame du couteau ressort propre.",
    "6. Servir",
    "Laisse refroidir 10 minutes.",
    "Coupe en carres comme un brownie.",
    "Ton brownie sale brocoli feta lardons est pret.",
  ],
},
{
  id: "healthy-tofu-bowl",
  title: "Biscuits croustillants avoine & chocolat",
  flavor: "sucre",
  prepTime: "25 ÃƒÆ’Ã‚Â  30 min",
  servings: "1 pers",
  image: biscuitsAvoineImg,
  ingredients: [
    "1 banane mÃƒÆ’Ã‚Â»re ÃƒÆ’Ã‚Â©crasÃƒÆ’Ã‚Â©e",
    "100 g de flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine",
    "50 g de chocolat noir (en morceaux ou pÃƒÆ’Ã‚Â©pites)",
    "8 ÃƒÆ’Ã‚Â  10 noisettes entiÃƒÆ’Ã‚Â¨res",
  ],
  steps: [
    "  PrÃƒÆ’Ã‚Â©chauffer le four",
    "PrÃƒÆ’Ã‚Â©chauffe le four ÃƒÆ’Ã‚Â  180Ãƒâ€šÃ‚Â°C.",
    "PrÃƒÆ’Ã‚Â©parer la pÃƒÆ’Ã‚Â¢te",
    "Dans un bol, ÃƒÆ’Ã‚Â©crase la banane ÃƒÆ’Ã‚Â  la fourchette jusqu'ÃƒÆ’Ã‚Â  obtenir une purÃƒÆ’Ã‚Â©e lisse. Ajoute les flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine et mÃƒÆ’Ã‚Â©lange jusqu'ÃƒÆ’Ã‚Â  obtenir une pÃƒÆ’Ã‚Â¢te homogÃƒÆ’Ã‚Â¨ne.",
    "Former les biscuits",
    "Recouvre une plaque de papier cuisson. DÃƒÆ’Ã‚Â©pose des petits tas de pÃƒÆ’Ã‚Â¢te et aplatis-les lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement pour former des biscuits.",
    "Ajouter le chocolat et la noisette",
    "DÃƒÆ’Ã‚Â©pose quelques morceaux de chocolat sur chaque biscuit. Ajoute une noisette entiÃƒÆ’Ã‚Â¨re au centre de chaque biscuit.",
    "Cuisson",
    "Enfourne pour 15 ÃƒÆ’Ã‚Â  18 minutes, jusqu'ÃƒÆ’Ã‚Â  ce que les biscuits soient bien dorÃƒÆ’Ã‚Â©s et croustillants sur les bords.",
    "Refroidissement",
    "Laisse refroidir sur une grille : ils deviendront plus croustillants en refroidissant.",
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
    "Mets 150 g de riz dans un bol.",
    "Rince-le a l'eau froide 3 a 4 fois jusqu'a ce que l'eau soit presque claire.",
    "2. Cuire le riz",
    "Mets le riz dans une casserole avec 165 ml d'eau et une pincee de sel.",
    "Porte a ebullition.",
    "Couvre et baisse le feu.",
    "Laisse cuire 15 minutes a feu doux.",
    "Coupe le feu et laisse reposer 10 minutes couvert.",
    "Aere le riz avec une fourchette.",
    "3. Preparer le saumon",
    "Prechauffe le four a 200C.",
    "Place les paves de saumon dans un plat allant au four.",
    "Coupe la moitie du citron en rondelles et pose-les sur le saumon.",
    "Presse l'autre moitie du citron dessus.",
    "4. Assaisonner",
    "Verse 2 cuilleres a soupe d'huile d'olive sur le saumon.",
    "Ajoute du poivre noir.",
    "Ajoute une pincee d'aneth.",
    "(Optionnel) ajoute l'ail finement hache.",
    "5. Cuire le saumon",
    "Mets le plat dans le four.",
    "Cuire 12 a 15 minutes a 200C.",
    "Le saumon est pret quand il devient tendre et se detache facilement a la fourchette.",
    "6. Servir",
    "Mets le riz dans les assiettes.",
    "Ajoute le saumon au citron dessus ou a cote.",
    "Verse un peu du jus de cuisson citron-huile d'olive sur le riz.",
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
  prepTime: "5 ÃƒÆ’Ã‚Â  7 min",
  servings: "1 pers",
  image: puddingChiaCocoFraisesImg,
  ingredients: [
    "250 ml de lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal",
    "3 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  soupe de graines de chia",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de miel",
    "100 g de yaourt ÃƒÆ’Ã‚Â  la noix de coco",
    "30 g de granola",
    "4 ÃƒÆ’Ã‚Â  5 fraises",
  ],
  steps: [
    "  Faire gonfler les graines de chia",
    "Dans un bol ou un bocal, verse le lait vÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â©tal. Ajoute les graines de chia et mÃƒÆ’Ã‚Â©lange bien. Laisse reposer 10 minutes, puis remue ÃƒÆ’Ã‚Â  nouveau pour ÃƒÆ’Ã‚Â©viter les grumeaux.",
    "Repos",
    "Couvre et place au rÃƒÆ’Ã‚Â©frigÃƒÆ’Ã‚Â©rateur pendant au moins 2 heures, idÃƒÆ’Ã‚Â©alement toute la nuit, jusqu'ÃƒÆ’Ã‚Â  ce que le pudding ÃƒÆ’Ã‚Â©paississe.",
    "Ajouter le miel",
    "Une fois le pudding bien pris, ajoute le miel et mÃƒÆ’Ã‚Â©lange.",
    "PrÃƒÆ’Ã‚Â©parer les fraises",
    "Lave les fraises et coupe-les en morceaux.",
    "Monter le pudding",
    "Ajoute le yaourt ÃƒÆ’Ã‚Â  la noix de coco sur le pudding de chia. Ajoute les fraises. Parseme de granola sur le dessus.",
    "Servir",
    "Consomme immÃƒÆ’Ã‚Â©diatement pour garder le granola croustillant.",
  ],
},
{
  id: "healthy-quinoa-menthe",
  title: "Salade CÃƒÆ’Ã‚Â©sar healthy",
  flavor: "sale",
  prepTime: "20 ÃƒÆ’Ã‚Â  25 min",
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
    "Coupe les filets de poulet en lanieres.",
    "Chauffe 1 c. a cafe d'huile d'olive dans une poele.",
    "Fais cuire le poulet 5 a 6 minutes a feu moyen jusqu'a ce qu'il soit dore.",
    "Ajoute du poivre noir.",
    "2. Preparer la salade",
    "Lave la laitue romaine.",
    "Coupe-la ou dechire-la en gros morceaux.",
    "Mets-la dans un grand saladier.",
    "3. Preparer la sauce Cesar healthy",
    "Dans un bol melange :",
    "- 3 c. a soupe de yaourt grec",
    "- 1 c. a soupe d'huile d'olive",
    "- 1 c. a soupe de jus de citron",
    "- 1 c. a cafe de moutarde",
    "- 1 gousse d'ail rapee",
    "- 1 c. a soupe de parmesan",
    "Melange jusqu'a obtenir une sauce cremeuse.",
    "4. Monter la salade",
    "Ajoute le poulet chaud dans la salade.",
    "Verse la sauce Cesar.",
    "Melange bien.",
    "5. Ajouter les toppings",
    "Ajoute les croutons.",
    "Rape le parmesan par-dessus.",
    "Ajoute du poivre noir.",
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
    "Preparer l'ananas",
    "Coupe l'ananas en petits cubes apres avoir retire la peau et le coeur.",
    "Ajouter les fruits",
    "Dans un grand bol, ajoute : les cubes d'ananas, les framboises, les griottes denoyautees.",
    "Melange delicatement pour ne pas ecraser les framboises.",
    "Ajouter la noix de coco",
    "Saupoudre les copeaux de noix de coco sur les fruits.",
    "Assaisonner (optionnel)",
    "Ajoute un filet de miel et un peu de jus de citron vert pour relever les saveurs.",
    "Servir",
    "Melange legerement et place 15 a 20 minutes au refrigerateur avant de servir pour une salade bien fraiche.",
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
  { value: "sale", label: "SalÃƒÆ’Ã‚Â©" },
  { value: "sucre", label: "SucrÃƒÆ’Ã‚Â©" },
]
const FLAVOR_PLACEHOLDER = "SÃƒÆ’Ã‚Â©lectionner un type"
const PLAN_DAY_PLACEHOLDER = "SÃƒÆ’Ã‚Â©lectionner un jour"
const PLAN_SLOT_PLACEHOLDER = "SÃƒÆ’Ã‚Â©lectionner un moment"
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
    if (flavor === "sucre") return "SucrÃƒÆ’Ã‚Â©"
    if (flavor === "sale") return "SalÃƒÆ’Ã‚Â©"
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
            SalÃƒÂ©
          </button>
          <button
            type="button"
            className={tab === "sweet" ? "is-active" : ""}
            onClick={() => setTab("sweet")}
          >
            SucrÃƒÂ©
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
                CrÃƒÆ’Ã‚Â©er une recette
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
          <div className="diet-recipe-modal" role="dialog" aria-label="CrÃƒÆ’Ã‚Â©er une recette">
            <div className="diet-recipe-modal__backdrop" onClick={() => setIsCreateOpen(false)} />
            <div className="diet-recipe-modal__panel">
              {draftImage ? (
                <div className="diet-recipe-modal__cover">
                  <img
                    src={draftImage}
                    alt="AperÃƒÆ’Ã‚Â§u recette"
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
                    <h3>CrÃƒÆ’Ã‚Â©er une recette</h3>
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
                        PrÃƒÆ’Ã‚Â©paration
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
                      IngrÃƒÆ’Ã‚Â©dients (1 par ligne)
                      <textarea value={draftIngredients} onChange={(event) => setDraftIngredients(event.target.value)} rows={5} />
                    </label>
                    <label>
                      ÃƒÆ’Ã¢â‚¬Â°tapes (1 par ligne)
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
                    alt="AperÃƒÆ’Ã‚Â§u recette"
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
                          <option value="sale">SalÃƒÆ’Ã‚Â©</option>
                          <option value="sucre">SucrÃƒÆ’Ã‚Â©</option>
                        </select>
                      </label>
                      <label>
                        PrÃƒÆ’Ã‚Â©paration
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
                      IngrÃƒÆ’Ã‚Â©dients (1 par ligne)
                      <textarea value={editIngredients} onChange={(event) => setEditIngredients(event.target.value)} rows={5} />
                    </label>
                    <label>
                      ÃƒÆ’Ã¢â‚¬Â°tapes (1 par ligne)
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
                        placeholder="ÃƒÆ’Ã¢â‚¬Â°cris ton plat"
                      />
                    </label>
                    <button type="button" className="diet-recipe-plan__add" onClick={() => void addRecipeToPlan()} disabled={!canEdit}>
                      Ajouter au planning
                    </button>
                  </section>
                  {selectedRecipe.ingredients.length > 0 ? (
                    <section>
                      <div className="diet-recipe-section__header">
                        <h4>IngrÃƒÆ’Ã‚Â©dients</h4>
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
                      <h4>ÃƒÆ’Ã¢â‚¬Â°tapes</h4>
                      <ul className="diet-steps-list">
                        {selectedRecipe.steps.map((step) => {
                          const isStepTitle = /^\d+\.\s/.test(step)
                          const isAdviceTitle =
                            /^Conseils? pour/.test(step) ||
                            /^Astuces? pour/.test(step) ||
                            /^Les 3 secrets/.test(step) ||
                            /^Les secrets/.test(step) ||
                            /^Secrets pour/.test(step) ||
                            /^Valeurs approximatives/.test(step)
                          const isSubItem = /^-\s/.test(step)
                          const isPlainNoBullet = /^Ces details/.test(step) || /^Ta .+ est prete\./.test(step) || /^Ton .+ est pret[e]?\./.test(step) || /^Tes .+ sont pret[e]s\./.test(step)
                          return (
                            <li
                              key={step}
                              className={
                                isStepTitle || isAdviceTitle
                                  ? "diet-step-item--title"
                                  : isSubItem
                                    ? "diet-step-item--sub"
                                    : isPlainNoBullet
                                      ? "diet-step-item--plain"
                                      : undefined
                              }
                            >
                              {isSubItem ? step.replace(/^-\s*/, "") : step}
                            </li>
                          )
                        })}
                      </ul>
                    </section>
                  ) : null}
                  {selectedRecipe.toppings && selectedRecipe.toppings.length > 0 ? (
                    <section>
                      <h4>{"IdÃƒÆ’Ã‚Â©es de toppings (optionnel)"}</h4>
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









