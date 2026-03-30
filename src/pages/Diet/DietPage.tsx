import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import MediaImage from "../../components/MediaImage"
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
import vinaigreCidreIngredientImg from "../../assets/Aliments/Vinaigre de cidre.png"
import vinaigreRizIngredientImg from "../../assets/Aliments/Vinaigre de riz.png"
import selIngredientImg from "../../assets/Aliments/Sel.png"
import poivreIngredientImg from "../../assets/Aliments/Poivre.png"
import pommeIngredientImg from "../../assets/Aliments/Pomme.png"
import moutardeIngredientImg from "../../assets/Aliments/Moutarde.png"
import mielIngredientImg from "../../assets/Aliments/Miel.png"
import oeufIngredientImg from "../../assets/Aliments/Oeuf.png"
import tomatesCerisesIngredientImg from "../../assets/Aliments/Tomates cerises.png"
import olivesNoiresIngredientImg from "../../assets/Aliments/Olives noires.png"
import olivesVertesIngredientImg from "../../assets/Aliments/Olives vertes.png"
import capresIngredientImg from "../../assets/Aliments/Capres.png"
import anchoisIngredientImg from "../../assets/Aliments/Anchois.png"
import burrataIngredientImg from "../../assets/Aliments/Burrata.png"
import fetaIngredientImg from "../../assets/Aliments/Feta.png"
import basilicIngredientImg from "../../assets/Aliments/Basilic.png"
import cibouletteIngredientImg from "../../assets/Aliments/Ciboulette.png"
import origanIngredientImg from "../../assets/Aliments/Origan.png"
import feuilleLaurierIngredientImg from "../../assets/Aliments/Feuille de laurier.png"
import pignonsPinIngredientImg from "../../assets/Aliments/Pignons de pin.png"
import painIngredientImg from "../../assets/Aliments/Pain.png"
import oignonRougeIngredientImg from "../../assets/Aliments/Oignon rouge.png"
import oignonJauneIngredientImg from "../../assets/Aliments/Oignon jaune.png"
import echalotteIngredientImg from "../../assets/Aliments/Echalotte.png"
import orangeIngredientImg from "../../assets/Aliments/Orange.png"
import pamplemousseIngredientImg from "../../assets/Aliments/Pamplemousse.png"
import matchaIngredientImg from "../../assets/Aliments/Matcha.png"
import jambonSecIngredientImg from "../../assets/Aliments/Jambon sec.png"
import saumonFumeIngredientImg from "../../assets/Aliments/Saumon fume.png"
import anethIngredientImg from "../../assets/Aliments/Aneth.png"
import bagelIngredientImg from "../../assets/Aliments/Bagel.png"
import creamCheeseIngredientImg from "../../assets/Aliments/Cream cheese.png"
import pastequeIngredientImg from "../../assets/Aliments/Pasteque.png"
import mentheIngredientImg from "../../assets/Aliments/Menthe.png"
import brancheRomarinIngredientImg from "../../assets/Aliments/Branche de Romarin.png"
import ailIngredientImg from "../../assets/Aliments/Ail.png"
import epinardIngredientImg from "../../assets/Aliments/Epinard.png"
import saumonIngredientImg from "../../assets/Aliments/Saumon.png"
import citronIngredientImg from "../../assets/Aliments/Citron.png"
import citronVertIngredientImg from "../../assets/Aliments/Citron vert.png"
import beurreIngredientImg from "../../assets/Aliments/Beurre.png"
import aspergesIngredientImg from "../../assets/Aliments/Asperges.png"
import eauIngredientImg from "../../assets/Aliments/Eau.png"
import eauCocoIngredientImg from "../../assets/Aliments/Eau de coco.png"
import cognacIngredientImg from "../../assets/Aliments/Cognac.png"
import tahiniIngredientImg from "../../assets/Aliments/Tahini.png"
import expressoIngredientImg from "../../assets/Aliments/Expresso.png"
import glaconsIngredientImg from "../../assets/Aliments/Glaçons.png"
import laitueIngredientImg from "../../assets/Aliments/Laitue.png"
import melangeSaladeIngredientImg from "../../assets/Aliments/Melange de salade.png"
import pouletIngredientImg from "../../assets/Aliments/Poulet.png"
import parmesanIngredientImg from "../../assets/Aliments/Parmesan.png"
import yaourtGrecIngredientImg from "../../assets/Aliments/Yaourt grecque.png"
import croutonsIngredientImg from "../../assets/Aliments/Croutons.png"
import cubeBouillonIngredientImg from "../../assets/Aliments/Cube bouillon de legume.png"
import brocolisIngredientImg from "../../assets/Aliments/Brocolis.png"
import aubergineIngredientImg from "../../assets/Aliments/Aubergine.png"
import chouFleurIngredientImg from "../../assets/Aliments/Chou-fleur.png"
import paprikaIngredientImg from "../../assets/Aliments/Paprika.png"
import poivronRougeIngredientImg from "../../assets/Aliments/Poivron rouge.png"
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
import floconsAvoineIngredientImg from "../../assets/Aliments/Flocons d'avoine.png"
import laitIngredientImg from "../../assets/Aliments/Lait.png"
import laitVegetalIngredientImg from "../../assets/Aliments/Lait vegetal.png"
import aromeVanilleIngredientImg from "../../assets/Aliments/Arome vanille.png"
import levureChimiqueIngredientImg from "../../assets/Aliments/Levure chimique.png"
import bicarbonateSoudeIngredientImg from "../../assets/Aliments/Bicarbonate de soude.png"
import wheyIngredientImg from "../../assets/Aliments/Whey.png"
import sucreBlancIngredientImg from "../../assets/Aliments/Sucre blanc.png"
import sucreRouxIngredientImg from "../../assets/Aliments/Sucre roux.png"
import sucreGlaceIngredientImg from "../../assets/Aliments/Sucre glace.png"
import chocolatNoirIngredientImg from "../../assets/Aliments/Chocolat noir.png"
import chocolatPoudreIngredientImg from "../../assets/Aliments/Chocolat en poudre.png"
import framboisesIngredientImg from "../../assets/Aliments/Framboises.png"
import fruitsRougesIngredientImg from "../../assets/Aliments/Fruits rouges.png"
import huileCocoIngredientImg from "../../assets/Aliments/Huile de coco.png"
import dattesIngredientImg from "../../assets/Aliments/Dattes.png"
import raisinsSecsIngredientImg from "../../assets/Aliments/Raisins secs.png"
import beurreCacahueteIngredientImg from "../../assets/Aliments/Beurre de cacahuete.png"
import noixIngredientImg from "../../assets/Aliments/Noix.png"
import amandesIngredientImg from "../../assets/Aliments/Amandes.png"
import noixPecanIngredientImg from "../../assets/Aliments/Noix de pecan.png"
import ananasIngredientImg from "../../assets/Aliments/Ananas.png"
import biscuitsSpeculosIngredientImg from "../../assets/Aliments/Biscuits speculos.png"
import pateTartinerBiscoffIngredientImg from "../../assets/Aliments/Pate a tartiner biscoff.png"
import siropChocolatIngredientImg from "../../assets/Aliments/Sirop de chocolat.png"
import bananeIngredientImg from "../../assets/Aliments/Banane.png"
import fraisesIngredientImg from "../../assets/Aliments/Fraises.png"
import myrtillesIngredientImg from "../../assets/Aliments/Myrtilles.png"
import granolaIngredientImg from "../../assets/Aliments/Granola.png"
import grainesChiaIngredientImg from "../../assets/Aliments/Graines de chia.png"
import copeauxNoixCocoIngredientImg from "../../assets/Aliments/Copeaux de noix de coco.png"
import carottesIngredientImg from "../../assets/Aliments/Carottes.png"
import betteraveIngredientImg from "../../assets/Aliments/Betterave.png"
import cannelleIngredientImg from "../../assets/Aliments/Cannelle.png"
import noixMuscadeIngredientImg from "../../assets/Aliments/Noix de muscade.png"
import lardonsIngredientImg from "../../assets/Aliments/Lardons.png"
import mortadelleIngredientImg from "../../assets/Aliments/Mortadelle.png"
import roquetteIngredientImg from "../../assets/Aliments/Roquette.png"
import pistachesIngredientImg from "../../assets/Aliments/Pistaches.png"
import ailPoudreIngredientImg from "../../assets/Aliments/Ail en poudre.png"
import comteRapeIngredientImg from "../../assets/Aliments/Comté râpé.png"
import celeriIngredientImg from "../../assets/Aliments/Céléri.png"
import haricotsVertsIngredientImg from "../../assets/Aliments/Haricots verts.png"
import herbesProvenceIngredientImg from "../../assets/Aliments/Herbes de provence.png"
import thymIngredientImg from "../../assets/Aliments/Thym.png"
import mangueIngredientImg from "../../assets/Aliments/Mangue.png"
import fruitPassionIngredientImg from "../../assets/Aliments/Fruit de la passion.png"
import steakIngredientImg from "../../assets/Aliments/Steak.png"
import quinoaIngredientImg from "../../assets/Aliments/Quinoa.png"
import poisChicheIngredientImg from "../../assets/Aliments/pois chiche.png"
import mayonnaiseIngredientImg from "../../assets/Aliments/Mayonnaise.png"
import srirachaIngredientImg from "../../assets/Aliments/Sriracha.png"
import feuilleNoriIngredientImg from "../../assets/Aliments/Feuille de nori.png"
import sauceSojaIngredientImg from "../../assets/Aliments/Sauce soja.png"
import mirinIngredientImg from "../../assets/Aliments/Mirin.png"
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

export const ingredientVisualsByRecipeId: Record<string, IngredientVisual[]> = {
  "mass-pancakes": [
    { id: "whey", label: "Whey", detail: "1 scoop de whey (30 g)", image: wheyIngredientImg },
    { id: "oeuf", label: "Oeuf", detail: "1 oeuf", image: oeufIngredientImg },
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "40 g de flocons d'avoine", image: floconsAvoineIngredientImg },
    { id: "lait", label: "Lait", detail: "60 ml de lait (ou lait vegetal)", image: laitIngredientImg },
    { id: "levure-chimique", label: "Levure chimique", detail: "1/2 c. a cafe de levure chimique", image: levureChimiqueIngredientImg },
    { id: "arome-vanille", label: "Arome vanille", detail: "1/2 c. a cafe d'extrait de vanille (optionnel)", image: aromeVanilleIngredientImg },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg },
    { id: "huile-beurre", label: "Huile ou beurre", detail: "1 c. a cafe d'huile ou beurre pour la cuisson", image: beurreIngredientImg },
  ],
  "mass-cookies-chocolat-fleur-sel": [
    { id: "beurre", label: "Beurre", detail: "120 g de beurre mou", image: beurreIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "sucre-roux", label: "Sucre roux", detail: "100 g de sucre roux", image: sucreRouxIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "sucre-blanc", label: "Sucre blanc", detail: "50 g de sucre blanc", image: sucreBlancIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "oeuf", label: "Oeuf", detail: "1 oeuf", image: oeufIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "vanille", label: "Extrait de vanille", detail: "1 cuillere a cafe d'extrait de vanille", image: aromeVanilleIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "farine", label: "Farine", detail: "180 g de farine", image: farineIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "bicarbonate", label: "Bicarbonate de soude", detail: "1/2 cuillere a cafe de bicarbonate de soude", image: bicarbonateSoudeIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "chocolat-noir", label: "Chocolat noir", detail: "150 g de chocolat noir en morceaux", image: chocolatNoirIngredientImg, sectionTitle: "Pour les cookies" },
    { id: "fleur-sel", label: "Fleur de sel", detail: "fleur de sel", image: selIngredientImg, sectionTitle: "Pour la finition" },
  ],
  "mass-framboises-chocolat-yaourt": [
    { id: "framboises", label: "Framboises", detail: "150 g de framboises", image: framboisesIngredientImg, sectionTitle: "Pour les bouchees" },
    { id: "yaourt-nature", label: "Yaourt nature", detail: "120 g de yaourt nature", image: yaourtGrecIngredientImg, sectionTitle: "Pour les bouchees" },
    { id: "chocolat-noir", label: "Chocolat noir", detail: "150 g de chocolat noir", image: chocolatNoirIngredientImg, sectionTitle: "Pour les bouchees" },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel (optionnel)", image: mielIngredientImg, sectionTitle: "Optionnel" },
    { id: "huile-coco", label: "Huile de coco", detail: "1 c. a cafe d'huile de coco (optionnel)", image: huileCocoIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-dattes-beurre-cacahuete": [
    { id: "dattes", label: "Dattes Medjool", detail: "6 grosses dattes Medjool", image: dattesIngredientImg },
    { id: "beurre-cacahuete", label: "Beurre de cacahuete", detail: "2 a 3 c. a soupe de beurre de cacahuete", image: beurreCacahueteIngredientImg },
    { id: "fleur-sel", label: "Fleur de sel", detail: "1 pincee de fleur de sel", image: selIngredientImg },
    { id: "chocolat-noir", label: "Chocolat noir", detail: "30 g de chocolat noir", image: chocolatNoirIngredientImg, sectionTitle: "Optionnel mais incroyable" },
    { id: "cacahuetes-concassees", label: "Cacahuetes concassees", detail: "quelques cacahuetes concassees", image: noixIngredientImg, sectionTitle: "Optionnel mais incroyable" },
  ],
  "mass-carrot-cake-cream-cheese": [
    { id: "carottes", label: "Carottes rapees", detail: "250 g de carottes rapees", image: carottesIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "farine", label: "Farine", detail: "200 g de farine", image: farineIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "sucre-roux", label: "Sucre roux", detail: "150 g de sucre roux", image: sucreRouxIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "sucre-blanc", label: "Sucre blanc", detail: "50 g de sucre blanc", image: sucreBlancIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "oeufs", label: "Oeufs", detail: "3 oeufs", image: oeufIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "huile-vegetale", label: "Huile vegetale", detail: "120 ml d'huile vegetale", image: huileOliveIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "vanille-gateau", label: "Extrait de vanille", detail: "1 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "cannelle", label: "Cannelle", detail: "1 c. a cafe de cannelle", image: cannelleIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "muscade", label: "Muscade", detail: "1/2 c. a cafe de muscade", image: noixMuscadeIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "levure", label: "Levure chimique", detail: "1 c. a cafe de levure chimique", image: levureChimiqueIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "bicarbonate", label: "Bicarbonate", detail: "1/2 c. a cafe de bicarbonate", image: bicarbonateSoudeIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "noix-pecan", label: "Noix / Noix de pecan", detail: "80 g de noix ou noix de pecan (optionnel)", image: noixPecanIngredientImg, sectionTitle: "Pour le gateau" },
    { id: "cream-cheese", label: "Cream cheese", detail: "200 g de cream cheese", image: creamCheeseIngredientImg, sectionTitle: "Pour le glacage" },
    { id: "beurre", label: "Beurre mou", detail: "60 g de beurre mou", image: beurreIngredientImg, sectionTitle: "Pour le glacage" },
    { id: "sucre-glace", label: "Sucre glace", detail: "120 g de sucre glace", image: sucreGlaceIngredientImg, sectionTitle: "Pour le glacage" },
    { id: "vanille-glacage", label: "Extrait de vanille", detail: "1 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg, sectionTitle: "Pour le glacage" },
  ],
  "mass-barres-snickers-caramel-chocolat": [
    { id: "biscuits", label: "Biscuits", detail: "200 g de biscuits (petit beurre ou digestive)", image: biscuitsSpeculosIngredientImg, sectionTitle: "Base biscuit" },
    { id: "beurre", label: "Beurre fondu", detail: "100 g de beurre fondu", image: beurreIngredientImg, sectionTitle: "Base biscuit" },
    { id: "caramel", label: "Caramel", detail: "150 g de caramel (caramel beurre sale ou caramel mou fondu)", image: pateTartinerBiscoffIngredientImg, sectionTitle: "Couche caramel cacahuete" },
    { id: "beurre-cacahuete", label: "Beurre de cacahuete", detail: "120 g de beurre de cacahuete", image: beurreCacahueteIngredientImg, sectionTitle: "Couche caramel cacahuete" },
    { id: "chocolat-noir", label: "Chocolat noir", detail: "200 g de chocolat noir", image: chocolatNoirIngredientImg, sectionTitle: "Couverture chocolat" },
    { id: "fleur-sel", label: "Fleur de sel", detail: "1 pincee de fleur de sel", image: selIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "cacahuetes-concassees", label: "Cacahuetes concassees", detail: "cacahuetes concassees", image: pistachesIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-banana-oat-bars": [
    { id: "bananes", label: "Bananes", detail: "2 bananes bien mures", image: bananeIngredientImg },
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "150 g de flocons d'avoine", image: floconsAvoineIngredientImg },
    { id: "oeuf", label: "Oeuf", detail: "1 oeuf", image: oeufIngredientImg },
    { id: "lait", label: "Lait", detail: "60 ml de lait", image: laitIngredientImg },
    { id: "vanille", label: "Extrait de vanille", detail: "1 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg },
    { id: "levure", label: "Levure chimique", detail: "1/2 c. a cafe de levure chimique", image: levureChimiqueIngredientImg },
    { id: "pepites-chocolat", label: "Pepites de chocolat", detail: "40 g de pepites de chocolat", image: chocolatNoirIngredientImg },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg },
  ],
  "mass-overnight-oats": [
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "50 g de flocons d'avoine", image: floconsAvoineIngredientImg },
    { id: "lait", label: "Lait", detail: "120 ml de lait (ou lait vegetal)", image: laitIngredientImg },
    { id: "yaourt", label: "Yaourt nature ou yaourt grec", detail: "80 g de yaourt nature ou yaourt grec", image: yaourtGrecIngredientImg },
    { id: "framboises", label: "Framboises", detail: "80 g de framboises", image: framboisesIngredientImg },
    { id: "pate-biscoff", label: "Pate Biscoff", detail: "1 c. a soupe de pate Biscoff (speculoos)", image: pateTartinerBiscoffIngredientImg },
    { id: "biscuit-speculoos", label: "Biscuit speculoos", detail: "1 biscuit speculoos emiette", image: biscuitsSpeculosIngredientImg },
    { id: "miel", label: "Miel ou sirop d'erable", detail: "1 c. a cafe de miel ou sirop d'erable (optionnel)", image: mielIngredientImg },
    { id: "vanille", label: "Vanille", detail: "1/2 c. a cafe de vanille (optionnel)", image: aromeVanilleIngredientImg },
  ],
  "mass-brownie-beans": [
    { id: "chocolat-noir", label: "Chocolat noir", detail: "200 g de chocolat noir (60-70 %)", image: chocolatNoirIngredientImg },
    { id: "beurre", label: "Beurre", detail: "120 g de beurre", image: beurreIngredientImg },
    { id: "sucre", label: "Sucre", detail: "150 g de sucre", image: sucreBlancIngredientImg },
    { id: "oeufs", label: "Oeufs", detail: "2 oeufs", image: oeufIngredientImg },
    { id: "vanille", label: "Extrait de vanille", detail: "1 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg },
    { id: "farine", label: "Farine", detail: "80 g de farine", image: farineIngredientImg },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg },
    { id: "noix", label: "Noix", detail: "100 g de noix (noix ou noix de pecan)", image: noixIngredientImg },
  ],
  "mass-salade-pates": [
    { id: "yaourt-grec", label: "Yaourt grec", detail: "200 g de yaourt grec", image: yaourtGrecIngredientImg },
    { id: "fruits-rouges", label: "Fruits rouges", detail: "120 g de fruits rouges (framboises, fraises, myrtilles)", image: fraisesIngredientImg },
    { id: "granola", label: "Granola", detail: "40 g de granola", image: granolaIngredientImg },
    { id: "miel-sirop", label: "Miel ou sirop d'erable", detail: "1 c. a cafe de miel ou sirop d'erable", image: mielIngredientImg },
    { id: "graines", label: "Graines", detail: "1 c. a cafe de graines (chia, lin ou sesame)", image: grainesChiaIngredientImg },
  ],
  "healthy-granola": [
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "250 g de flocons d'avoine", image: floconsAvoineIngredientImg },
    { id: "noix-mix", label: "Noix melangees", detail: "100 g de noix (noix, amandes, noisettes ou noix de pecan)", image: noixIngredientImg },
    { id: "miel-sirop", label: "Miel ou sirop d'erable", detail: "60 g de miel ou sirop d'erable", image: mielIngredientImg },
    { id: "huile-coco", label: "Huile de coco ou huile neutre", detail: "40 ml d'huile de coco ou d'huile neutre", image: huileCocoIngredientImg },
    { id: "vanille", label: "Extrait de vanille", detail: "1 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg },
    { id: "cannelle", label: "Cannelle", detail: "1/2 c. a cafe de cannelle", image: cannelleIngredientImg },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg },
    { id: "pepites-chocolat", label: "Pepites de chocolat", detail: "40 g de pepites de chocolat", image: chocolatNoirIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "fruits-secs", label: "Fruits secs", detail: "40 g de fruits secs (cranberries, raisins)", image: dattesIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "healthy-salade-pates": [
    { id: "bananes", label: "Bananes", detail: "3 bananes tres mures", image: bananeIngredientImg },
    { id: "oeufs", label: "Oeufs", detail: "2 oeufs", image: oeufIngredientImg },
    { id: "sucre-roux", label: "Sucre roux", detail: "100 g de sucre roux", image: sucreRouxIngredientImg },
    { id: "sucre-blanc", label: "Sucre blanc", detail: "50 g de sucre blanc", image: sucreBlancIngredientImg },
    { id: "huile-beurre", label: "Huile vegetale ou beurre fondu", detail: "80 ml d'huile vegetale ou beurre fondu", image: beurreIngredientImg },
    { id: "vanille", label: "Extrait de vanille", detail: "1 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg },
    { id: "farine", label: "Farine", detail: "200 g de farine", image: farineIngredientImg },
    { id: "bicarbonate", label: "Bicarbonate de soude", detail: "1 c. a cafe de bicarbonate de soude", image: bicarbonateSoudeIngredientImg },
    { id: "sel", label: "Sel", detail: "1/2 c. a cafe de sel", image: selIngredientImg },
    { id: "noix", label: "Noix / Noix de pecan", detail: "80 g de noix ou noix de pecan", image: noixPecanIngredientImg, sectionTitle: "Optionnel mais incroyable" },
    { id: "pepites-chocolat", label: "Pepites de chocolat", detail: "80 g de pepites de chocolat", image: chocolatNoirIngredientImg, sectionTitle: "Optionnel mais incroyable" },
    { id: "cannelle", label: "Cannelle", detail: "1/2 c. a cafe de cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel mais incroyable" },
  ],
  "healthy-tofu-bowl": [
    { id: "banane", label: "Banane", detail: "1 banane mure ecrasee", image: bananeIngredientImg },
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "100 g de flocons d'avoine", image: floconsAvoineIngredientImg },
    { id: "chocolat-noir", label: "Chocolat noir", detail: "50 g de chocolat noir", image: chocolatNoirIngredientImg },
    { id: "noisettes", label: "Noisettes entieres", detail: "8 a 10 noisettes entieres", image: noixIngredientImg },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "cannelle", label: "Cannelle", detail: "1/2 c. a cafe de cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "healthy-potage-lentilles": [
    { id: "graines-chia", label: "Graines de chia", detail: "2 c. a soupe de graines de chia", image: grainesChiaIngredientImg },
    { id: "lait-coco", label: "Lait de coco", detail: "180 ml de lait de coco (ou lait de coco leger)", image: laitCocoIngredientImg },
    { id: "miel-sirop", label: "Miel ou sirop d'erable", detail: "1 c. a cafe de miel ou sirop d'erable", image: mielIngredientImg },
    { id: "framboises", label: "Framboises", detail: "80 g de framboises", image: framboisesIngredientImg },
    { id: "vanille", label: "Extrait de vanille", detail: "1/2 c. a cafe d'extrait de vanille", image: aromeVanilleIngredientImg },
    { id: "noix-coco-rapee", label: "Noix de coco rapee", detail: "1 c. a soupe de noix de coco rapee", image: copeauxNoixCocoIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "granola", label: "Granola", detail: "1 c. a soupe de granola", image: granolaIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "amandes-pistaches", label: "Amandes ou pistaches", detail: "quelques amandes ou pistaches", image: pistachesIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "healthy-snack-energetique": [
    { id: "ananas", label: "Ananas frais", detail: "250 g d'ananas frais", image: ananasIngredientImg, sectionTitle: "Pour la salade de fruits" },
    { id: "framboises", label: "Framboises", detail: "100 g de framboises", image: framboisesIngredientImg, sectionTitle: "Pour la salade de fruits" },
    { id: "griottes", label: "Griottes", detail: "100 g de griottes (fraiches ou decongelees)", image: framboisesIngredientImg, sectionTitle: "Pour la salade de fruits" },
    { id: "noix-coco", label: "Copeaux de noix de coco", detail: "20 g de copeaux de noix de coco", image: copeauxNoixCocoIngredientImg, sectionTitle: "Pour la salade de fruits" },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Assaisonnement (secret pour une salade incroyable)" },
    { id: "citron-vert", label: "Jus de citron vert", detail: "1 c. a cafe de jus de citron vert", image: citronVertIngredientImg, sectionTitle: "Assaisonnement (secret pour une salade incroyable)" },
    { id: "menthe", label: "Menthe", detail: "quelques feuilles de menthe (optionnel)", image: mentheIngredientImg, sectionTitle: "Assaisonnement (secret pour une salade incroyable)" },
  ],
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
  "mass-houmous-maison": [
    { id: "pois-chiche", label: "Pois chiches cuits", detail: "400 g de pois chiches cuits (1 boite egouttee)", image: poisChicheIngredientImg },
    { id: "tahini", label: "Tahini (puree de sesame)", detail: "60 g de tahini (puree de sesame)", image: tahiniIngredientImg },
    { id: "citron", label: "Jus de citron", detail: "2 c. a soupe de jus de citron", image: citronIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "2 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "eau", label: "Eau froide", detail: "3 a 5 c. a soupe d'eau froide", image: eauIngredientImg },
    { id: "sel", label: "Sel", detail: "1/2 c. a cafe de sel", image: selIngredientImg },
    { id: "huile-olive-service", label: "Huile d'olive", detail: "huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Pour servir" },
    { id: "paprika-service", label: "Paprika", detail: "paprika", image: paprikaIngredientImg, sectionTitle: "Pour servir" },
    { id: "persil-service", label: "Persil", detail: "persil", image: persilIngredientImg, sectionTitle: "Pour servir" },
  ],
  "mass-tzatziki": [
    { id: "yaourt-grec", label: "Yaourt grec", detail: "250 g de yaourt grec", image: yaourtGrecIngredientImg },
    { id: "concombre", label: "Concombre", detail: "1/2 concombre", image: concombreIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "citron", label: "Jus de citron", detail: "1 c. a soupe de jus de citron", image: citronIngredientImg },
    { id: "aneth-menthe", label: "Aneth frais (ou menthe)", detail: "1 c. a soupe d'aneth frais (ou menthe)", image: anethIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
  ],
  "mass-sauce-vierge": [
    { id: "tomates", label: "Tomates bien mures", detail: "2 tomates bien mures", image: tomateIngredientImg },
    { id: "huile-olive", label: "Huile d'olive extra vierge", detail: "4 c. a soupe d'huile d'olive extra vierge", image: huileOliveIngredientImg },
    { id: "jus-citron", label: "Jus de citron", detail: "1 c. a soupe de jus de citron", image: citronIngredientImg },
    { id: "echalote", label: "Echalote", detail: "1 petite echalote", image: echalotteIngredientImg },
    { id: "basilic", label: "Basilic frais", detail: "1 c. a soupe de basilic frais", image: basilicIngredientImg },
    { id: "persil", label: "Persil frais", detail: "1 c. a soupe de persil frais", image: persilIngredientImg },
    { id: "capres", label: "Capres", detail: "1 c. a cafe de capres (optionnel mais tres bon)", image: capresIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
  ],
  "mass-vinaigrette-miel-moutarde-balsamique": [
    { id: "moutarde", label: "Moutarde", detail: "1 c. a soupe de moutarde", image: moutardeIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a soupe de miel", image: mielIngredientImg },
    { id: "vinaigre-balsamique", label: "Vinaigre balsamique", detail: "2 c. a soupe de vinaigre balsamique", image: vinaigreBalsamiqueIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "4 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "echalote", label: "Echalote", detail: "1 petite echalote", image: echalotteIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
  ],
  "mass-sauce-tahini-cremeuse": [
    { id: "sesame", label: "Graines de sesame", detail: "120 g de graines de sesame", image: grainesSesameIngredientImg, sectionTitle: "Pour la puree de sesame (tahini maison)" },
    { id: "huile-tahini", label: "Huile d'olive ou huile neutre", detail: "1 c. a soupe d'huile d'olive ou huile neutre", image: huileOliveIngredientImg, sectionTitle: "Pour la puree de sesame (tahini maison)" },
    { id: "sel-tahini", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg, sectionTitle: "Pour la puree de sesame (tahini maison)" },
    { id: "tahini-maison", label: "Tahini maison", detail: "3 c. a soupe de tahini maison", image: grainesSesameIngredientImg, sectionTitle: "Pour la sauce tahini" },
    { id: "citron", label: "Jus de citron", detail: "2 c. a soupe de jus de citron", image: citronIngredientImg, sectionTitle: "Pour la sauce tahini" },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg, sectionTitle: "Pour la sauce tahini" },
    { id: "eau", label: "Eau froide", detail: "3 a 5 c. a soupe d'eau froide", image: eauIngredientImg, sectionTitle: "Pour la sauce tahini" },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg, sectionTitle: "Pour la sauce tahini" },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg, sectionTitle: "Pour la sauce tahini" },
    { id: "persil", label: "Persil", detail: "persil", image: persilIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "cumin", label: "Cumin", detail: "cumin", image: cuminIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "paprika", label: "Paprika", detail: "paprika", image: paprikaIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-sauce-asiatique-cacahuetes": [
    { id: "beurre-cacahuete", label: "Beurre de cacahuete", detail: "3 c. a soupe de beurre de cacahuete", image: beurreCacahueteIngredientImg },
    { id: "sauce-soja", label: "Sauce soja", detail: "2 c. a soupe de sauce soja", image: sauceSojaIngredientImg },
    { id: "citron-vert", label: "Jus de citron vert", detail: "1 c. a soupe de jus de citron vert", image: citronVertIngredientImg },
    { id: "miel-sirop", label: "Miel ou sirop d'erable", detail: "1 c. a soupe de miel ou sirop d'erable", image: mielIngredientImg },
    { id: "huile-sesame", label: "Huile de sesame", detail: "1 c. a cafe d'huile de sesame", image: huileSesameIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "eau-chaude", label: "Eau chaude", detail: "3 a 5 c. a soupe d'eau chaude", image: eauIngredientImg },
    { id: "cacahuetes-concassees", label: "Cacahuetes concassees", detail: "cacahuetes concassees", image: pistachesIngredientImg, sectionTitle: "Optionnel mais incroyable" },
  ],
  "mass-sauce-blanche-herbes": [
    { id: "yaourt-grec", label: "Yaourt grec", detail: "200 g de yaourt grec", image: yaourtGrecIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "1 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "persil", label: "Persil frais", detail: "1 c. a soupe de persil frais", image: persilIngredientImg },
    { id: "ciboulette", label: "Ciboulette", detail: "1 c. a soupe de ciboulette", image: cibouletteIngredientImg },
    { id: "citron", label: "Jus de citron", detail: "1 c. a soupe de jus de citron", image: citronIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
    { id: "moutarde-option", label: "Moutarde", detail: "1 c. a cafe de moutarde", image: moutardeIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "zeste-citron-option", label: "Zeste de citron", detail: "zeste de citron", image: citronIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "aneth-option", label: "Aneth frais", detail: "aneth frais", image: anethIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-chimichurri-legerement-sucre": [
    { id: "persil", label: "Persil frais", detail: "1 gros bouquet de persil frais", image: persilIngredientImg },
    { id: "ail", label: "Ail", detail: "2 gousses d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "4 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "vinaigre-vin-rouge", label: "Vinaigre de vin rouge", detail: "2 c. a soupe de vinaigre de vin rouge", image: vinaigreBalsamiqueIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg },
    { id: "flocons-piment", label: "Flocons de piment", detail: "1/2 c. a cafe de flocons de piment", image: floconsPimentIngredientImg },
    { id: "origan", label: "Origan seche", detail: "1/2 c. a cafe d'origan seche", image: origanIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
  ],
  "mass-sauce-aubergines-poivrons-grilles": [
    { id: "aubergine", label: "Aubergine", detail: "1 grosse aubergine", image: aubergineIngredientImg },
    { id: "poivron-rouge", label: "Poivron rouge", detail: "1 poivron rouge", image: poivronRougeIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "2 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "citron", label: "Jus de citron", detail: "1 c. a soupe de jus de citron", image: citronIngredientImg },
    { id: "paprika", label: "Paprika", detail: "1 c. a cafe de paprika", image: paprikaIngredientImg },
    { id: "persil", label: "Persil frais", detail: "1 c. a soupe de persil frais", image: persilIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
    { id: "cumin", label: "Cumin", detail: "une pincee de cumin", image: cuminIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "piment", label: "Piment", detail: "un peu de piment", image: floconsPimentIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-sauce-poivre": [
    { id: "beurre", label: "Beurre", detail: "1 c. a soupe de beurre", image: beurreIngredientImg },
    { id: "echalote", label: "Echalote", detail: "1 petite echalote", image: echalotteIngredientImg },
    { id: "poivre-noir", label: "Poivre noir concasse", detail: "1 c. a soupe de poivre noir concasse", image: poivreIngredientImg },
    { id: "cognac", label: "Cognac", detail: "4 cl de cognac", image: cognacIngredientImg },
    { id: "creme-fraiche", label: "Creme fraiche", detail: "150 ml de creme fraiche", image: creamCheeseIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "fond-veau", label: "Fond de veau", detail: "50 ml de fond de veau", image: cubeBouillonIngredientImg, sectionTitle: "Optionnel mais recommande" },
  ],
  "mass-pickles-oignons": [
    { id: "oignon-rouge", label: "Oignon rouge", detail: "1 gros oignon rouge", image: oignonRougeIngredientImg },
    { id: "vinaigre", label: "Vinaigre de cidre (ou blanc)", detail: "120 ml de vinaigre de cidre (ou vinaigre blanc)", image: vinaigreBalsamiqueIngredientImg },
    { id: "eau", label: "Eau", detail: "120 ml d'eau", image: eauIngredientImg },
    { id: "sucre", label: "Sucre", detail: "1 c. a soupe de sucre", image: sucreBlancIngredientImg },
    { id: "sel", label: "Sel", detail: "1 c. a cafe de sel", image: selIngredientImg },
    { id: "laurier", label: "Feuille de laurier", detail: "1 feuille de laurier", image: feuilleLaurierIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "graines-coriandre", label: "Graines de coriandre", detail: "1/2 c. a cafe de graines de coriandre", image: coriandreIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "grains-poivre", label: "Grains de poivre", detail: "quelques grains de poivre", image: poivreIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "petit-piment", label: "Petit piment", detail: "1 petit piment", image: floconsPimentIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-pickles-concombre": [
    { id: "concombre", label: "Concombre", detail: "1 gros concombre", image: concombreIngredientImg },
    { id: "vinaigre", label: "Vinaigre de cidre (ou blanc)", detail: "120 ml de vinaigre de cidre (ou vinaigre blanc)", image: vinaigreBalsamiqueIngredientImg },
    { id: "eau", label: "Eau", detail: "120 ml d'eau", image: eauIngredientImg },
    { id: "sucre", label: "Sucre", detail: "1 c. a soupe de sucre", image: sucreBlancIngredientImg },
    { id: "sel", label: "Sel", detail: "1 c. a cafe de sel", image: selIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg, sectionTitle: "Aromates" },
    { id: "graines-moutarde", label: "Graines de moutarde", detail: "1 c. a cafe de graines de moutarde", image: moutardeIngredientImg, sectionTitle: "Aromates" },
    { id: "aneth", label: "Aneth", detail: "1 c. a cafe d'aneth (frais ou seche)", image: anethIngredientImg, sectionTitle: "Aromates" },
    { id: "grains-poivre", label: "Grains de poivre", detail: "1/2 c. a cafe de grains de poivre", image: poivreIngredientImg, sectionTitle: "Aromates" },
    { id: "petit-piment", label: "Petit piment", detail: "1 petit piment", image: floconsPimentIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "laurier", label: "Feuille de laurier", detail: "1 feuille de laurier", image: feuilleLaurierIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-pickles-carottes": [
    { id: "carottes", label: "Carottes", detail: "2 grosses carottes", image: carottesIngredientImg },
    { id: "vinaigre", label: "Vinaigre de riz (ou cidre)", detail: "120 ml de vinaigre de riz ou vinaigre de cidre", image: vinaigreRizIngredientImg },
    { id: "eau", label: "Eau", detail: "120 ml d'eau", image: eauIngredientImg },
    { id: "sucre", label: "Sucre", detail: "1 c. a soupe de sucre", image: sucreBlancIngredientImg },
    { id: "sel", label: "Sel", detail: "1 c. a cafe de sel", image: selIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg, sectionTitle: "Aromates" },
    { id: "graines-coriandre", label: "Graines de coriandre", detail: "1/2 c. a cafe de graines de coriandre", image: coriandreIngredientImg, sectionTitle: "Aromates" },
    { id: "grains-poivre", label: "Grains de poivre", detail: "1/2 c. a cafe de grains de poivre", image: poivreIngredientImg, sectionTitle: "Aromates" },
    { id: "gingembre", label: "Gingembre", detail: "1 petit morceau de gingembre (1 cm)", image: gingembreIngredientImg, sectionTitle: "Aromates" },
    { id: "petit-piment", label: "Petit piment", detail: "1 petit piment", image: floconsPimentIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "laurier", label: "Feuille de laurier", detail: "1 feuille de laurier", image: feuilleLaurierIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-pickles-chou-fleur": [
    { id: "chou-fleur", label: "Chou-fleur", detail: "1/2 chou-fleur", image: chouFleurIngredientImg },
    { id: "vinaigre", label: "Vinaigre de cidre (ou blanc)", detail: "120 ml de vinaigre de cidre (ou vinaigre blanc)", image: vinaigreCidreIngredientImg },
    { id: "eau", label: "Eau", detail: "120 ml d'eau", image: eauIngredientImg },
    { id: "sucre", label: "Sucre", detail: "1 c. a soupe de sucre", image: sucreBlancIngredientImg },
    { id: "sel", label: "Sel", detail: "1 c. a cafe de sel", image: selIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg, sectionTitle: "Aromates" },
    { id: "graines-moutarde", label: "Graines de moutarde", detail: "1 c. a cafe de graines de moutarde", image: moutardeIngredientImg, sectionTitle: "Aromates" },
    { id: "grains-poivre", label: "Grains de poivre", detail: "1/2 c. a cafe de grains de poivre", image: poivreIngredientImg, sectionTitle: "Aromates" },
    { id: "curcuma", label: "Curcuma", detail: "1/2 c. a cafe de curcuma", image: curcumaIngredientImg, sectionTitle: "Aromates" },
    { id: "laurier", label: "Feuille de laurier", detail: "1 petite feuille de laurier", image: origanIngredientImg, sectionTitle: "Aromates" },
    { id: "petit-piment", label: "Petit piment", detail: "1 petit piment", image: floconsPimentIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "gingembre", label: "Gingembre", detail: "1 petit morceau de gingembre", image: gingembreIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-sauce-pesto-maison": [
    { id: "basilic", label: "Basilic frais", detail: "50 g de basilic frais", image: basilicIngredientImg },
    { id: "pignons", label: "Pignons de pin", detail: "30 g de pignons de pin", image: pignonsPinIngredientImg },
    { id: "parmesan", label: "Parmesan rape", detail: "40 g de parmesan rape", image: parmesanIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive extra vierge", detail: "80 ml d'huile d'olive extra vierge", image: huileOliveIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "pecorino", label: "Pecorino", detail: "20 g de pecorino", image: parmesanIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "citron", label: "Jus de citron", detail: "quelques gouttes de jus de citron", image: citronIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-guacamole-maison": [
    { id: "avocats", label: "Avocats", detail: "2 avocats bien murs", image: avocatIngredientImg },
    { id: "oignon-rouge", label: "Oignon rouge", detail: "1/2 petit oignon rouge", image: oignonRougeIngredientImg },
    { id: "tomate", label: "Tomate", detail: "1 petite tomate", image: tomateIngredientImg },
    { id: "citron-vert", label: "Citron vert (jus)", detail: "1/2 citron vert (jus)", image: citronVertIngredientImg },
    { id: "coriandre-fraiche", label: "Coriandre fraiche", detail: "1 c. a soupe de coriandre fraiche", image: coriandreFraicheIngredientImg },
    { id: "piment", label: "Piment", detail: "1 petit piment ou 1/2 c. a cafe de piment (optionnel)", image: floconsPimentIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "zeste-citron-vert", label: "Zeste de citron vert", detail: "un peu de zeste de citron vert", image: citronVertIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-chutney-mangue": [
    { id: "mangues", label: "Mangues", detail: "2 grosses mangues mures mais fermes", image: mangueIngredientImg },
    { id: "vinaigre-cidre", label: "Vinaigre de cidre", detail: "120 ml de vinaigre de cidre", image: vinaigreCidreIngredientImg },
    { id: "sucre-roux", label: "Sucre roux", detail: "120 g de sucre roux", image: sucreRouxIngredientImg },
    { id: "oignon", label: "Oignon", detail: "1/2 oignon finement coupe", image: oignonJauneIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg },
    { id: "gingembre", label: "Gingembre frais rape", detail: "1 c. a cafe de gingembre frais rape", image: gingembreIngredientImg },
    { id: "sel", label: "Sel", detail: "1/2 c. a cafe de sel", image: selIngredientImg },
    { id: "graines-moutarde", label: "Graines de moutarde", detail: "1/2 c. a cafe de graines de moutarde", image: moutardeIngredientImg, sectionTitle: "Epices (cle du gout)" },
    { id: "cumin", label: "Cumin", detail: "1/2 c. a cafe de cumin", image: cuminIngredientImg, sectionTitle: "Epices (cle du gout)" },
    { id: "coriandre-moulue", label: "Coriandre moulue", detail: "1/2 c. a cafe de coriandre moulue", image: coriandreIngredientImg, sectionTitle: "Epices (cle du gout)" },
    { id: "piment", label: "Piment", detail: "1 petite pincee de piment", image: floconsPimentIngredientImg, sectionTitle: "Epices (cle du gout)" },
    { id: "cannelle", label: "Cannelle", detail: "1 petite pincee de cannelle", image: cannelleIngredientImg, sectionTitle: "Epices (cle du gout)" },
    { id: "raisins-secs", label: "Raisins secs", detail: "30 g de raisins secs", image: raisinsSecsIngredientImg, sectionTitle: "Optionnel mais tres utilise" },
  ],
  "mass-caviar-aubergine": [
    { id: "aubergines", label: "Aubergines", detail: "2 grosses aubergines", image: aubergineIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive extra vierge", detail: "3 c. a soupe d'huile d'olive extra vierge", image: huileOliveIngredientImg },
    { id: "citron", label: "Citron (jus)", detail: "1/2 citron (jus)", image: citronIngredientImg },
    { id: "cumin", label: "Cumin", detail: "1 c. a cafe de cumin", image: cuminIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
  ],
  "mass-tapenade": [
    { id: "olives-noires", label: "Olives noires denoyautees", detail: "200 g d'olives noires denoyautees", image: olivesNoiresIngredientImg },
    { id: "capres", label: "Capres", detail: "2 c. a soupe de capres", image: capresIngredientImg },
    { id: "anchois", label: "Filets d'anchois", detail: "2 filets d'anchois", image: anchoisIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "4 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "citron", label: "Jus de citron", detail: "1 c. a cafe de jus de citron", image: citronIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
    { id: "thym-herbes", label: "Thym ou herbes de Provence", detail: "1 c. a cafe de thym ou herbes de Provence", image: herbesProvenceIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-sauce-teriyaki": [
    { id: "sauce-soja", label: "Sauce soja", detail: "60 ml de sauce soja", image: sauceSojaIngredientImg },
    { id: "mirin", label: "Mirin (vin de riz sucre)", detail: "60 ml de mirin (vin de riz japonais sucre)", image: mirinIngredientImg },
    { id: "sucre", label: "Sucre", detail: "2 c. a soupe de sucre", image: sucreBlancIngredientImg },
    { id: "gingembre", label: "Gingembre frais rape", detail: "1 c. a cafe de gingembre frais rape", image: gingembreIngredientImg },
    { id: "ail", label: "Ail", detail: "1 petite gousse d'ail", image: ailIngredientImg },
    { id: "eau", label: "Eau", detail: "60 ml d'eau", image: eauIngredientImg },
    { id: "fecule-mais", label: "Fecule de mais", detail: "1 c. a cafe de fecule de mais", image: farineIngredientImg, sectionTitle: "Optionnel pour epaissir" },
    { id: "eau-epaissir", label: "Eau", detail: "1 c. a soupe d'eau", image: eauIngredientImg, sectionTitle: "Optionnel pour epaissir" },
    { id: "huile-sesame", label: "Huile de sesame", detail: "1 c. a cafe d'huile de sesame", image: huileSesameIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "graines-sesame", label: "Graines de sesame", detail: "graines de sesame", image: grainesSesameIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-huile-pimentee": [
    { id: "huile", label: "Huile neutre (ou olive)", detail: "250 ml d'huile neutre (tournesol, arachide) ou huile d'olive", image: huileOliveIngredientImg },
    { id: "flocons-piment", label: "Flocons de piment", detail: "2 c. a soupe de flocons de piment", image: floconsPimentIngredientImg },
    { id: "ail", label: "Ail", detail: "1 gousse d'ail", image: ailIngredientImg },
    { id: "graines-sesame", label: "Graines de sesame", detail: "1 c. a cafe de graines de sesame", image: grainesSesameIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "sel", label: "Sel", detail: "1 petite pincee de sel", image: selIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-citrons-confits": [
    { id: "citrons", label: "Citrons bio", detail: "4 a 6 citrons bio", image: citronIngredientImg },
    { id: "gros-sel", label: "Gros sel", detail: "4 c. a soupe de gros sel", image: selIngredientImg },
    { id: "jus-citron", label: "Jus de citron", detail: "le jus de 2 citrons supplementaires", image: citronIngredientImg },
    { id: "laurier", label: "Feuille de laurier", detail: "1 feuille de laurier", image: feuilleLaurierIngredientImg, sectionTitle: "Optionnel mais tres utilise" },
    { id: "baton-cannelle", label: "Baton de cannelle", detail: "1 baton de cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel mais tres utilise" },
    { id: "graines-coriandre", label: "Graines de coriandre", detail: "1 c. a cafe de graines de coriandre", image: coriandreIngredientImg, sectionTitle: "Optionnel mais tres utilise" },
    { id: "grains-poivre", label: "Grains de poivre", detail: "quelques grains de poivre", image: poivreIngredientImg, sectionTitle: "Optionnel mais tres utilise" },
  ],
  "mass-oignons-confits": [
    { id: "oignons", label: "Oignons", detail: "4 gros oignons", image: oignonJauneIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "2 c. a soupe d'huile d'olive", image: huileOliveIngredientImg },
    { id: "beurre", label: "Beurre", detail: "1 c. a soupe de beurre", image: beurreIngredientImg },
    { id: "sucre-roux", label: "Sucre roux", detail: "1 c. a soupe de sucre roux", image: sucreRouxIngredientImg },
    { id: "vinaigre-balsamique", label: "Vinaigre balsamique", detail: "2 c. a soupe de vinaigre balsamique", image: vinaigreBalsamiqueIngredientImg },
    { id: "sel", label: "Sel", detail: "sel", image: selIngredientImg },
    { id: "poivre", label: "Poivre", detail: "poivre", image: poivreIngredientImg },
    { id: "thym", label: "Thym", detail: "1 branche de thym", image: thymIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "miel", label: "Miel", detail: "1 c. a soupe de miel", image: mielIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-ail-confit": [
    { id: "ail", label: "Ail", detail: "2 tetes d'ail", image: ailIngredientImg },
    { id: "huile-olive", label: "Huile d'olive", detail: "200 a 250 ml d'huile d'olive", image: huileOliveIngredientImg },
    { id: "sel", label: "Sel", detail: "1 pincee de sel", image: selIngredientImg },
    { id: "thym", label: "Thym", detail: "1 branche de thym", image: thymIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "laurier", label: "Feuille de laurier", detail: "1 feuille de laurier", image: feuilleLaurierIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "grains-poivre", label: "Grains de poivre", detail: "quelques grains de poivre", image: poivreIngredientImg, sectionTitle: "Optionnel mais excellent" },
    { id: "zeste-citron", label: "Zeste de citron", detail: "zeste de citron", image: citronIngredientImg, sectionTitle: "Optionnel mais excellent" },
  ],
  "mass-smoothie-gain": [
    { id: "banane", label: "Banane mure", detail: "1 banane mure", image: bananeIngredientImg },
    { id: "whey", label: "Whey", detail: "1 scoop de whey (30 g)", image: wheyIngredientImg },
    { id: "beurre-cacahuete", label: "Beurre de cacahuete", detail: "1 c. a soupe de beurre de cacahuete", image: beurreCacahueteIngredientImg },
    { id: "lait", label: "Lait (ou vegetal)", detail: "250 ml de lait classique ou vegetal", image: laitIngredientImg },
    { id: "glacons", label: "Glacons", detail: "4 a 5 glacons", image: eauIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "cannelle", label: "Cannelle", detail: "1/2 c. a cafe de cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "1 c. a soupe de flocons d'avoine", image: floconsAvoineIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-smoothie-fraise-banane-coco-whey": [
    { id: "fraises", label: "Fraises", detail: "120 g de fraises", image: fraisesIngredientImg },
    { id: "banane", label: "Banane", detail: "1 banane", image: bananeIngredientImg },
    { id: "whey-vanille", label: "Whey vanille", detail: "1 scoop de whey vanille (30 g)", image: wheyIngredientImg },
    { id: "eau-coco", label: "Eau de coco", detail: "250 ml d'eau de coco", image: eauCocoIngredientImg },
    { id: "glacons", label: "Glacons", detail: "4 a 5 glacons", image: glaconsIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "graines-chia", label: "Graines de chia", detail: "1 c. a soupe de graines de chia", image: grainesChiaIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "yaourt-grec", label: "Yaourt grec", detail: "1 c. a soupe de yaourt grec", image: yaourtGrecIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-boisson-detox-pomme-celeri-citron": [
    { id: "pomme", label: "Pomme", detail: "1 pomme", image: pommeIngredientImg },
    { id: "celeri", label: "Celeri", detail: "2 branches de celeri", image: celeriIngredientImg },
    { id: "citron", label: "Citron", detail: "1/2 citron", image: citronIngredientImg },
    { id: "gingembre", label: "Gingembre frais", detail: "1 petit morceau de gingembre frais (1 cm)", image: gingembreIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "300 ml d'eau froide", image: eauIngredientImg },
    { id: "glacons", label: "Glacons", detail: "4 a 5 glacons (optionnel)", image: glaconsIngredientImg },
  ],
  "mass-boisson-detox-orange-carotte-gingembre": [
    { id: "oranges", label: "Oranges", detail: "2 oranges", image: orangeIngredientImg },
    { id: "carottes", label: "Carottes", detail: "2 carottes", image: carottesIngredientImg },
    { id: "gingembre", label: "Gingembre frais", detail: "1 petit morceau de gingembre frais (1 cm)", image: gingembreIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "200 ml d'eau froide", image: eauIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel" },
    { id: "glacons", label: "Glacons", detail: "quelques glacons", image: glaconsIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-eau-detox-concombre-citron-menthe-gingembre": [
    { id: "concombre", label: "Concombre", detail: "1/2 concombre", image: concombreIngredientImg },
    { id: "citron-jaune", label: "Citron jaune", detail: "1 citron jaune", image: citronIngredientImg },
    { id: "citron-vert", label: "Citron vert", detail: "1 citron vert", image: citronVertIngredientImg },
    { id: "gingembre", label: "Gingembre frais", detail: "1 petit morceau de gingembre frais (1 a 2 cm)", image: gingembreIngredientImg },
    { id: "menthe", label: "Menthe", detail: "6 a 8 feuilles de menthe", image: mentheIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "1 litre d'eau froide", image: eauIngredientImg },
    { id: "glacons", label: "Glacons", detail: "quelques glacons", image: glaconsIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-cafe-latte-vanille": [
    { id: "espresso", label: "Espresso (ou cafe fort)", detail: "1 espresso (ou 60 ml de cafe tres fort)", image: expressoIngredientImg },
    { id: "lait-vegetal", label: "Lait vegetal", detail: "180 ml de lait vegetal", image: laitVegetalIngredientImg },
    { id: "sirop-erable-sucre", label: "Sirop d'erable ou sucre", detail: "1 c. a cafe de sirop d'erable ou sucre (optionnel)", image: sucreBlancIngredientImg },
    { id: "cannelle", label: "Cannelle", detail: "cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel" },
    { id: "cacao", label: "Cacao en poudre", detail: "cacao en poudre", image: chocolatNoirIngredientImg, sectionTitle: "Optionnel" },
    { id: "vanille", label: "Vanille", detail: "vanille", image: aromeVanilleIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-matcha-latte-cremeux": [
    { id: "matcha", label: "Poudre de matcha", detail: "1 c. a cafe de poudre de matcha", image: matchaIngredientImg },
    { id: "eau-chaude", label: "Eau chaude", detail: "60 ml d'eau chaude (80C)", image: eauIngredientImg },
    { id: "lait-vegetal", label: "Lait vegetal", detail: "180 ml de lait vegetal", image: laitVegetalIngredientImg },
    { id: "miel-sirop-erable", label: "Miel ou sirop d'erable", detail: "1 c. a cafe de miel ou sirop d'erable (optionnel)", image: mielIngredientImg },
    { id: "vanille", label: "Vanille", detail: "vanille", image: aromeVanilleIngredientImg, sectionTitle: "Optionnel" },
    { id: "cannelle", label: "Cannelle", detail: "cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel" },
    { id: "sucre-coco", label: "Sucre de coco", detail: "sucre de coco", image: sucreRouxIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-moka-chocolat-cafe": [
    { id: "espresso", label: "Espresso (ou cafe fort)", detail: "1 espresso (ou 60 ml de cafe tres fort)", image: expressoIngredientImg, sectionTitle: "Pour le moka" },
    { id: "lait", label: "Lait (classique ou vegetal)", detail: "200 ml de lait (classique ou vegetal)", image: laitIngredientImg, sectionTitle: "Pour le moka" },
    { id: "chocolat-noir-cacao", label: "Chocolat noir ou cacao", detail: "20 g de chocolat noir ou 1 c. a soupe de cacao", image: chocolatNoirIngredientImg, sectionTitle: "Pour le moka" },
    { id: "sucre-sirop-erable", label: "Sucre ou sirop d'erable", detail: "1 c. a cafe de sucre ou sirop d'erable (optionnel)", image: sucreBlancIngredientImg, sectionTitle: "Pour le moka" },
    { id: "creme-liquide", label: "Creme liquide entiere", detail: "60 ml de creme liquide entiere", image: creamCheeseIngredientImg, sectionTitle: "Pour la chantilly" },
    { id: "sucre-glace", label: "Sucre glace", detail: "1 c. a cafe de sucre glace", image: sucreGlaceIngredientImg, sectionTitle: "Pour la chantilly" },
    { id: "copeaux-chocolat", label: "Copeaux de chocolat", detail: "copeaux de chocolat", image: chocolatNoirIngredientImg, sectionTitle: "Optionnel" },
    { id: "cacao-poudre", label: "Cacao en poudre", detail: "cacao en poudre", image: chocolatPoudreIngredientImg, sectionTitle: "Optionnel" },
    { id: "sirop-chocolat", label: "Sirop de chocolat", detail: "sirop de chocolat", image: siropChocolatIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-jus-betterave-celeri-pomme": [
    { id: "betterave", label: "Betterave crue", detail: "1 petite betterave crue", image: betteraveIngredientImg },
    { id: "pomme", label: "Pomme", detail: "1 pomme", image: pommeIngredientImg },
    { id: "celeri", label: "Celeri", detail: "1 branche de celeri", image: celeriIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "200 ml d'eau froide", image: eauIngredientImg },
    { id: "jus-citron", label: "Jus de citron", detail: "jus de 1/2 citron", image: citronIngredientImg, sectionTitle: "Optionnel" },
    { id: "gingembre", label: "Gingembre", detail: "1 petit morceau de gingembre", image: gingembreIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-smoothie-avocat-banane-amandes": [
    { id: "avocat", label: "Avocat", detail: "1/2 avocat", image: avocatIngredientImg },
    { id: "banane", label: "Banane", detail: "1 banane", image: bananeIngredientImg },
    { id: "lait", label: "Lait (classique ou vegetal)", detail: "250 ml de lait (classique ou vegetal)", image: laitIngredientImg },
    { id: "amandes", label: "Amandes", detail: "20 g d'amandes", image: amandesIngredientImg },
    { id: "glacons", label: "Glacons", detail: "3 a 4 glacons", image: glaconsIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-boisson-epinard-pomme-concombre": [
    { id: "epinards", label: "Epinards frais", detail: "1 poignee d'epinards frais", image: epinardIngredientImg },
    { id: "pomme", label: "Pomme", detail: "1 pomme", image: pommeIngredientImg },
    { id: "concombre", label: "Concombre", detail: "1/2 concombre", image: concombreIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "200 ml d'eau froide", image: eauIngredientImg },
    { id: "citron", label: "Citron (jus)", detail: "1/2 citron (jus)", image: citronIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "gingembre", label: "Gingembre", detail: "1 petit morceau de gingembre", image: gingembreIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "glacons", label: "Glacons", detail: "3 a 4 glacons", image: glaconsIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "mass-eau-infusee-pamplemousse-romarin": [
    { id: "pamplemousse", label: "Pamplemousse", detail: "1/2 pamplemousse", image: pamplemousseIngredientImg },
    { id: "romarin", label: "Romarin", detail: "1 petite branche de romarin", image: brancheRomarinIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "1 litre d'eau froide", image: eauIngredientImg },
    { id: "glacons", label: "Glacons", detail: "quelques glacons", image: glaconsIngredientImg, sectionTitle: "Optionnel" },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel" },
    { id: "rondelles-citron", label: "Rondelles de citron", detail: "quelques rondelles de citron", image: citronIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-eau-infusee-myrtilles-orange-menthe": [
    { id: "myrtilles", label: "Myrtilles", detail: "80 g de myrtilles", image: myrtillesIngredientImg },
    { id: "orange", label: "Orange", detail: "1/2 orange", image: orangeIngredientImg },
    { id: "menthe", label: "Menthe", detail: "6 a 8 feuilles de menthe", image: mentheIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "1 litre d'eau froide", image: eauIngredientImg },
    { id: "glacons", label: "Glacons", detail: "quelques glacons", image: glaconsIngredientImg, sectionTitle: "Optionnel" },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-eau-infusee-fraise-citron-menthe": [
    { id: "fraises", label: "Fraises", detail: "120 g de fraises", image: fraisesIngredientImg },
    { id: "citron-jaune", label: "Citron jaune", detail: "1/2 citron jaune", image: citronIngredientImg },
    { id: "menthe", label: "Menthe", detail: "6 a 8 feuilles de menthe", image: mentheIngredientImg },
    { id: "eau-froide", label: "Eau froide", detail: "1 litre d'eau froide", image: eauIngredientImg },
    { id: "glacons", label: "Glacons", detail: "quelques glacons", image: glaconsIngredientImg, sectionTitle: "Optionnel" },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel" },
  ],
  "mass-boisson-avoine-cacahuete-amande": [
    { id: "flocons-avoine", label: "Flocons d'avoine", detail: "30 g de flocons d'avoine", image: floconsAvoineIngredientImg },
    { id: "beurre-cacahuete", label: "Beurre de cacahuete", detail: "1 c. a soupe de beurre de cacahuete", image: beurreCacahueteIngredientImg },
    { id: "lait-amande", label: "Lait d'amande", detail: "250 ml de lait d'amande", image: laitVegetalIngredientImg },
    { id: "miel-sirop-erable", label: "Miel ou sirop d'erable", detail: "1 c. a cafe de miel ou sirop d'erable", image: mielIngredientImg },
    { id: "glacons", label: "Glacons", detail: "4 a 5 glacons", image: glaconsIngredientImg },
    { id: "cannelle", label: "Cannelle", detail: "1/2 c. a cafe de cannelle", image: cannelleIngredientImg, sectionTitle: "Optionnel mais tres bon" },
    { id: "cacao-poudre", label: "Cacao en poudre", detail: "1 c. a cafe de cacao en poudre", image: chocolatPoudreIngredientImg, sectionTitle: "Optionnel mais tres bon" },
  ],
  "healthy-smoothie-glow": [
    { id: "mangue", label: "Mangue", detail: "150 g de mangue (fraiche ou congelee)", image: mangueIngredientImg },
    { id: "fruit-passion", label: "Fruit de la passion", detail: "1 fruit de la passion", image: fruitPassionIngredientImg },
    { id: "eau-coco", label: "Eau de coco", detail: "200 ml d'eau de coco", image: eauCocoIngredientImg },
    { id: "citron-vert-jus", label: "Citron vert (jus)", detail: "1/2 citron vert (jus)", image: citronVertIngredientImg },
    { id: "glacons", label: "Glacons", detail: "4 a 5 glacons", image: glaconsIngredientImg },
    { id: "miel", label: "Miel", detail: "1 c. a cafe de miel", image: mielIngredientImg, sectionTitle: "Optionnel mais incroyable" },
    { id: "yaourt-grec-coco", label: "Yaourt grec ou coco", detail: "1 c. a soupe de yaourt grec ou coco", image: yaourtGrecIngredientImg, sectionTitle: "Optionnel mais incroyable" },
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
  title: "Pancake protéiné",
  flavor: "sucre",
  prepTime: "10 à 15 min",
  servings: "3 à 4 pancakes",
  image: pancakesProteineImg,
  ingredients: [
    "1 scoop de whey (30 g)",
    "1 oeuf",
    "40 g de flocons d'avoine",
    "60 ml de lait (ou lait vegetal)",
    "1/2 c. a cafe de levure chimique",
    "1/2 c. a cafe d'extrait de vanille (optionnel)",
    "1 pincee de sel",
    "1 c. a cafe d'huile ou beurre pour la cuisson",
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
    "Astuce : si la pâte est trop épaisse, ajoute quelques gouttes de lait. Si elle est trop liquide, ajoute un peu de farine.",
  ],
},
{
  id: "mass-cookies-chocolat-fleur-sel",
  title: "Cookies chocolat & fleur de sel",
  flavor: "sucre",
  prepTime: "20 a 25 min",
  servings: "10 à 12 cookies",
  image: cookiesChocolatFleurSelImg,
  ingredients: [
    "Pour les cookies",
    "120 g de beurre mou",
    "100 g de sucre roux",
    "50 g de sucre blanc",
    "1 oeuf",
    "1 cuillere a cafe d'extrait de vanille",
    "180 g de farine",
    "1/2 cuillere a cafe de bicarbonate de soude",
    "1 pincee de sel",
    "150 g de chocolat noir en morceaux",
    "Pour la finition",
    "fleur de sel",
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
  prepTime: "1 h 20 min",
  servings: "10 à 12 bouchées",
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
  servings: "1 à 2 pers",
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
  prepTime: "1 h 10",
  servings: "8 à 10 parts",
  image: carrotCakeBreadImg,
  ingredients: [
    "Pour le gateau",
    "250 g de carottes rapees",
    "200 g de farine",
    "150 g de sucre roux",
    "50 g de sucre blanc",
    "3 oeufs",
    "120 ml d'huile vegetale",
    "1 c. a cafe d'extrait de vanille",
    "1 cuillere a cafe de cannelle",
    "1/2 c. a cafe de muscade",
    "1 cuillere a cafe de levure chimique",
    "1/2 c. a cafe de bicarbonate",
    "1 pincee de sel",
    "80 g de noix ou noix de pecan (optionnel)",
    "Pour le glacage",
    "200 g de cream cheese",
    "60 g de beurre mou",
    "120 g de sucre glace",
    "1 c. a cafe d'extrait de vanille",
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
  prepTime: "1 h 20 min",
  servings: "10 à 12 barres",
  image: barresSnickersCaramelImg,
  ingredients: [
    "Base biscuit",
    "200 g de biscuits (petit beurre ou digestive)",
    "100 g de beurre fondu",
    "Couche caramel cacahuete",
    "150 g de caramel (caramel beurre sale ou caramel mou fondu)",
    "120 g de beurre de cacahuete",
    "Couverture chocolat",
    "200 g de chocolat noir",
    "Optionnel mais tres bon :",
    "1 pincee de fleur de sel",
    "cacahuetes concassees",
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
    "150 g de flocons d'avoine",
    "1 oeuf",
    "60 ml de lait",
    "1 c. a cafe d'extrait de vanille",
    "1/2 c. a cafe de levure chimique",
    "40 g de pepites de chocolat",
    "1 pincee de sel",
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
  title: "Saumon mariné sriracha & riz",
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
    "Ton bowl de saumon marine est pret. Il ne te reste plus qu'à deguster ! ",
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
  prepTime: "10 à 15 min",
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
  title: "Omelette power à la feta",
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
  title: "Smoothie banane beurre de cacahuète",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: smoothieBananeBeurreCacahueteImg,
  ingredients: [
    "1 banane mure",
    "1 scoop de whey (30 g)",
    "1 c. a soupe de beurre de cacahuete",
    "250 ml de lait classique ou vegetal",
    "4 a 5 glacons",
    "Optionnel mais tres bon :",
    "1 c. a cafe de miel",
    "1/2 c. a cafe de cannelle",
    "1 c. a soupe de flocons d'avoine",
  ],
  steps: [
    "1. Preparer la base",
    "Preparer la base",
    "Epluche la banane puis coupe-la en rondelles pour faciliter le mixage.",
    "Si tu veux un smoothie plus frais et epais, utilise une banane prealablement congelee.",
    "2. Ajouter les ingredients",
    "Ajouter les ingredients",
    "Dans le blender, ajoute la banane, le lait vegetal, les flocons d'avoine, la whey et le beurre de cacahuete.",
    "Ajoute ensuite le sirop d'erable.",
    "Tu peux aussi ajouter une pincee de cannelle pour renforcer le gout.",
    "3. Mixer",
    "Mixer",
    "Mixe pendant 30 a 45 secondes jusqu'a obtenir une texture lisse et homogene.",
    "Arrete le blender, racle les parois si besoin, puis remixe quelques secondes.",
    "Le smoothie doit etre cremeux, sans morceaux d'avoine visibles.",
    "4. Ajuster la texture",
    "Ajuster la texture",
    "Si le smoothie est trop epais, ajoute un petit filet de lait puis remixe.",
    "Si tu le veux plus epais, ajoute quelques glacons ou un peu plus de banane.",
    "5. Servir",
    "Servir",
    "Verse le smoothie dans un grand verre ou dans un shaker.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-smoothie-fraise-banane-coco-whey",
  title: "Smoothie fraise, banane, eau de coco & whey vanille",
  flavor: "boisson",
  prepTime: "10 min",
  servings: "1 pers",
  image: smoothieFraiseBananeWheyImg,
  ingredients: [
    "120 g de fraises",
    "1 banane",
    "1 scoop de whey vanille (30 g)",
    "250 ml d'eau de coco",
    "4 a 5 glacons",
    "Optionnel mais tres bon :",
    "1 c. a cafe de miel",
    "1 c. a soupe de graines de chia",
    "1 c. a soupe de yaourt grec (texture encore plus cremeuse)",
  ],
  steps: [
    "1. Preparer les fruits",
    "Preparer la base",
    "Lave les fraises, retire les queues puis coupe-les en morceaux.",
    "Epluche la banane et coupe-la en rondelles.",
    "Des fruits bien froids donnent un smoothie plus frais et plus epais.",
    "2. Ajouter les ingredients",
    "Ajouter les ingredients",
    "Dans le blender, ajoute les fraises, la banane, l'eau de coco et la whey vanille.",
    "Ajoute les glacons si tu veux une texture encore plus rafraichissante.",
    "La whey vanille apporte du gout et augmente l'apport en proteines.",
    "3. Mixer",
    "Mixer",
    "Mixe pendant 30 a 45 secondes jusqu'a obtenir une texture homogene.",
    "Arrete le blender, racle les parois si besoin, puis remixe quelques secondes.",
    "Le smoothie doit etre lisse et legerement mousseux.",
    "4. Ajuster la texture",
    "Ajuster la texture",
    "Si le smoothie est trop epais, ajoute un petit filet d'eau de coco puis remixe.",
    "Si tu veux une texture plus milkshake, ajoute une demi-banane congelee.",
    "5. Servir",
    "Servir",
    "Verse dans un grand verre ou dans un shaker.",
    "Il ne reste plus qu'a savourer !",
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
    "1 pomme",
    "2 branches de celeri",
    "1/2 citron",
    "1 petit morceau de gingembre frais (1 cm)",
    "300 ml d'eau froide",
    "4 a 5 glacons (optionnel)",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer les ingredients",
    "Lave soigneusement la pomme et les branches de celeri.",
    "Coupe la pomme en morceaux en retirant les pepins.",
    "Coupe le celeri en petits troncons pour faciliter le mixage.",
    "Presse le demi-citron et epluche legerement le gingembre.",
    "Des morceaux reguliers facilitent le mixage et donnent une texture plus homogene.",
    "2. Mixer la boisson",
    "Mixer",
    "Dans le blender, ajoute la pomme, le celeri, le gingembre, le jus de citron et l'eau froide.",
    "Ajoute les glacons si tu veux une boisson plus fraiche.",
    "Mixe pendant 30 a 45 secondes jusqu'a obtenir une boisson lisse.",
    "Le citron apporte de la fraicheur et equilibre le gout vegetal du celeri.",
    "3. Ajuster la texture",
    "Ajuster la texture",
    "Si tu veux une texture tres lisse, filtre avec une passoire fine.",
    "Si tu preferes plus de fibres, garde la pulpe.",
    "4. Servir",
    "Servir",
    "Verse dans un grand verre.",
    "Melange legerement, puis bois bien frais.",
    "Il ne reste plus qu'a savourer !",
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
    "2 oranges",
    "2 carottes",
    "1 petit morceau de gingembre frais (1 cm)",
    "200 ml d'eau froide",
    "Optionnel",
    "1 c. a cafe de miel",
    "quelques glacons",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer les ingredients",
    "Epluche les oranges et coupe-les en morceaux.",
    "Epluche les carottes, puis coupe-les en rondelles fines.",
    "Epluche legerement le gingembre.",
    "Des morceaux fins facilitent le mixage et donnent une boisson plus lisse.",
    "2. Mixer la boisson",
    "Mixer",
    "Dans le blender, ajoute les oranges, les carottes, le gingembre et l'eau froide.",
    "Mixe pendant 35 a 45 secondes jusqu'a obtenir une texture homogene.",
    "Le gingembre releve la boisson et apporte une note fraiche et epicee.",
    "3. Ajuster la texture",
    "Ajuster la texture",
    "Si tu veux une texture tres lisse, passe la boisson dans une passoire fine.",
    "Si tu preferes plus de fibres, garde la pulpe.",
    "4. Ajuster le gout",
    "Finaliser",
    "Ajoute le miel si tu veux une boisson plus douce, puis melange.",
    "5. Servir",
    "Servir",
    "Ajoute des glacons si tu veux, puis sers bien frais.",
    "Il ne reste plus qu'a savourer !",
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
    "1/2 concombre",
    "1 citron jaune",
    "1 citron vert",
    "1 petit morceau de gingembre frais (1 a 2 cm)",
    "6 a 8 feuilles de menthe",
    "1 litre d'eau froide",
    "Optionnel",
    "quelques glacons",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer les ingredients",
    "Lave soigneusement le concombre, le citron et le citron vert.",
    "Coupe le concombre en fines rondelles.",
    "Coupe les agrumes en rondelles fines.",
    "Coupe le gingembre en fines tranches.",
    "Des tranches fines permettent une infusion plus rapide des saveurs.",
    "2. Preparer la menthe",
    "Preparer la menthe",
    "Froisse legerement les feuilles de menthe entre les mains.",
    "Cela libere les aromes sans ecraser la menthe.",
    "3. Assembler l'eau detox",
    "Assembler",
    "Dans une carafe, ajoute le concombre, le citron, le citron vert, le gingembre et la menthe.",
    "Verse ensuite 1 litre d'eau froide.",
    "4. Laisser infuser",
    "Laisser reposer",
    "Place la carafe au refrigerateur pendant au moins 1 heure.",
    "Idealement, laisse infuser 2 a 4 heures pour un gout plus intense.",
    "5. Servir",
    "Servir",
    "Ajoute des glacons si tu veux, puis sers bien frais.",
    "Il ne reste plus qu'a savourer !",
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
    "1 espresso (ou 60 ml de cafe tres fort)",
    "180 ml de lait vegetal",
    "(lait d'avoine recommande pour une mousse plus cremeuse)",
    "1 c. a cafe de sirop d'erable ou sucre (optionnel)",
    "Optionnel :",
    "cannelle",
    "cacao en poudre",
    "vanille",
  ],
  steps: [
    "1. Preparer le cafe",
    "Preparer",
    "Prepare un espresso (ou 60 ml de cafe fort) avec ta machine ou ta cafetiere.",
    "Verse-le dans une grande tasse.",
    "2. Chauffer le lait",
    "Chauffer",
    "Verse le lait dans une casserole et chauffe doucement a feu moyen-doux.",
    "Ajoute l'extrait de vanille pendant que le lait chauffe.",
    "Le lait doit etre chaud, mais jamais bouillant.",
    "3. Faire la mousse",
    "Fouetter",
    "Utilise un mousseur a lait ou un petit fouet pour mousser le lait pendant 10 a 20 secondes.",
    "La mousse doit etre fine et cremeuse pour un rendu type coffee shop.",
    "4. Assembler le latte",
    "Assembler",
    "Verse d'abord le lait chaud sur l'espresso, puis ajoute la mousse sur le dessus.",
    "Verse lentement pour garder une texture bien homogene en tasse.",
    "5. Ajuster et servir",
    "Servir",
    "Ajoute un peu de sucre ou de sirop de vanille si tu veux une version plus douce.",
    "Tu peux aussi ajouter une pincee de cannelle ou un peu de cacao en finition.",
    "Il ne reste plus qu'a savourer !",
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
    "1 c. a cafe de poudre de matcha",
    "60 ml d'eau chaude (80C, pas bouillante)",
    "180 ml de lait vegetal",
    "(lait d'avoine recommande pour un latte plus cremeux)",
    "1 c. a cafe de miel ou sirop d'erable (optionnel)",
    "Optionnel :",
    "vanille",
    "cannelle",
    "sucre de coco",
  ],
  steps: [
    "1. Preparer le matcha",
    "Preparer",
    "Mets le matcha dans un bol ou une tasse large.",
    "Passe-le dans une petite passoire pour eviter les grumeaux.",
    "Un matcha bien tamise donne une texture plus lisse.",
    "2. Diluer le matcha",
    "Fouetter",
    "Verse l'eau chaude (environ 80C) sur le matcha.",
    "Fouette energiquement en mouvement en W pendant 15 a 20 secondes.",
    "L'eau ne doit pas etre bouillante pour eviter l'amertume.",
    "3. Chauffer le lait",
    "Chauffer",
    "Fais chauffer le lait a feu doux jusqu'a ce qu'il soit bien chaud.",
    "Retire du feu avant ebullition.",
    "4. Mousser le lait",
    "Fouetter",
    "Mousse le lait avec un mousseur ou un petit fouet pendant quelques secondes.",
    "La mousse doit etre fine et cremeuse.",
    "5. Assembler le latte",
    "Assembler",
    "Verse le lait chaud sur le matcha fouette, puis ajoute la mousse sur le dessus.",
    "Verse lentement pour garder une texture bien homogene.",
    "6. Finaliser",
    "Finaliser",
    "Ajoute un peu de miel ou de sirop d'erable si tu veux une version plus douce.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-moka-chocolat-cafe",
  title: "Moka chocolat & cafe",
  flavor: "boisson",
  prepTime: "5 à 7 min",
  servings: "1 pers",
  image: mokaChocolatCafeImg,
  ingredients: [
    "Pour le moka",
    "1 espresso (ou 60 ml de cafe tres fort)",
    "200 ml de lait (classique ou vegetal)",
    "20 g de chocolat noir ou 1 c. a soupe de cacao",
    "1 c. a cafe de sucre ou sirop d'erable (optionnel)",
    "Pour la chantilly",
    "60 ml de creme liquide entiere",
    "1 c. a cafe de sucre glace",
    "Optionnel :",
    "copeaux de chocolat",
    "cacao en poudre",
    "sirop de chocolat",
  ],
  steps: [
    "1. Preparer le cafe",
    "Preparer",
    "Prepare un espresso (ou 60 ml de cafe fort) puis verse-le dans une grande tasse.",
    "Un cafe bien concentre permet d'equilibrer la douceur du chocolat.",
    "2. Preparer la base chocolat",
    "Faire fondre",
    "Dans une petite casserole, ajoute le cacao (ou le chocolat fondu) avec un petit peu de lait.",
    "Melange doucement a feu doux jusqu'a obtenir une base chocolat lisse.",
    "3. Chauffer le lait",
    "Chauffer",
    "Ajoute le reste du lait dans la casserole et chauffe doucement sans faire bouillir.",
    "Le lait doit etre bien chaud pour un moka onctueux.",
    "4. Assembler le moka",
    "Assembler",
    "Verse la base chocolat chaude dans la tasse avec l'espresso, puis melange.",
    "5. Preparer la chantilly",
    "Fouetter",
    "Fouette la creme liquide avec un peu de sucre glace jusqu'a obtenir une chantilly legere.",
    "La chantilly doit rester souple et aerienne.",
    "6. Finaliser",
    "Finaliser",
    "Depose la chantilly sur le moka.",
    "Ajoute un peu de cacao ou quelques copeaux de chocolat en finition.",
    "Il ne reste plus qu'a savourer !",
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
    "1 petite betterave crue",
    "1 pomme",
    "1 branche de celeri",
    "200 ml d'eau froide",
    "Optionnel :",
    "jus de 1/2 citron",
    "1 petit morceau de gingembre",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Epluche la betterave puis coupe-la en petits morceaux.",
    "Coupe la pomme en morceaux en retirant les pepins.",
    "Coupe la branche de celeri en troncons.",
    "Des morceaux reguliers facilitent le mixage.",
    "2. Mixer le jus",
    "Mixer",
    "Dans le blender, ajoute la betterave, la pomme, le celeri et l'eau froide.",
    "Mixe pendant 40 a 60 secondes jusqu'a obtenir une texture homogene.",
    "3. Ajuster le gout",
    "Finaliser",
    "Ajoute le jus de citron pour apporter de la fraicheur.",
    "Ajoute un petit morceau de gingembre si tu veux une version plus tonique.",
    "Le citron equilibre le gout terreux de la betterave.",
    "4. Ajuster la texture",
    "Ajuster la texture",
    "Si tu veux un jus tres lisse, passe-le dans une passoire fine.",
    "Si tu preferes plus de fibres, garde la pulpe.",
    "5. Servir",
    "Servir",
    "Verse dans un verre et ajoute quelques glacons si tu veux.",
    "Il ne reste plus qu'a savourer !",
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
    "1/2 avocat",
    "1 banane",
    "250 ml de lait (classique ou vegetal)",
    "20 g d'amandes",
    "3 a 4 glacons",
    "Optionnel :",
    "1 c. a cafe de miel",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Coupe l'avocat en deux, retire le noyau et recupere la chair.",
    "Coupe la banane en rondelles pour faciliter le mixage.",
    "Des fruits bien murs donnent une texture plus onctueuse.",
    "2. Ajouter les ingredients",
    "Ajouter les ingredients",
    "Dans le blender, ajoute l'avocat, la banane, les amandes et le lait.",
    "Ajoute les glacons et le miel si tu veux une version plus fraiche et plus douce.",
    "3. Mixer",
    "Mixer",
    "Mixe pendant 35 a 45 secondes jusqu'a obtenir une texture lisse et homogene.",
    "Le smoothie doit etre cremeux, sans morceaux d'amandes visibles.",
    "4. Ajuster la texture",
    "Ajuster la texture",
    "Si le smoothie est trop epais, ajoute un petit filet de lait puis remixe.",
    "Si tu veux une texture plus epaisse, ajoute quelques glacons supplementaires.",
    "5. Servir",
    "Servir",
    "Verse dans un grand verre et consomme rapidement pour garder toute la fraicheur.",
    "Il ne reste plus qu'a savourer !",
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
    "1 poignee d'epinards frais",
    "1 pomme",
    "1/2 concombre",
    "200 ml d'eau froide",
    "Optionnel mais tres bon :",
    "1/2 citron (jus)",
    "1 petit morceau de gingembre",
    "3 a 4 glacons",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Lave soigneusement les epinards.",
    "Coupe la pomme en morceaux en retirant les pepins.",
    "Coupe le concombre en rondelles.",
    "Des ingredients bien frais donnent une boisson plus agreable.",
    "2. Mixer la boisson",
    "Mixer",
    "Dans le blender, ajoute les epinards, la pomme, le concombre et l'eau froide.",
    "Mixe pendant 35 a 45 secondes jusqu'a obtenir une texture homogene.",
    "3. Ajuster le gout",
    "Finaliser",
    "Ajoute le jus de citron et le gingembre si tu veux une version plus tonique.",
    "Mixe encore quelques secondes.",
    "Le citron apporte de la fraicheur et releve le gout vegetal.",
    "4. Servir",
    "Servir",
    "Ajoute des glacons si tu veux, puis sers bien frais.",
    "Il ne reste plus qu'a savourer !",
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
    "1/2 pamplemousse",
    "1 petite branche de romarin",
    "1 litre d'eau froide",
    "Optionnel :",
    "quelques glacons",
    "1 c. a cafe de miel",
    "quelques rondelles de citron",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Lave soigneusement le pamplemousse, puis coupe-le en fines rondelles.",
    "Rince la branche de romarin.",
    "Des tranches fines permettent une infusion plus rapide des saveurs.",
    "2. Liberer les aromes",
    "Preparer",
    "Froisse legerement le romarin entre les doigts pour liberer ses huiles aromatiques.",
    "Tu peux aussi presser tres legerement une rondelle de pamplemousse pour intensifier le gout.",
    "3. Assembler l'eau infusee",
    "Assembler",
    "Dans une carafe, ajoute les rondelles de pamplemousse et la branche de romarin.",
    "Verse ensuite 1 litre d'eau froide.",
    "4. Laisser infuser",
    "Refrigerer",
    "Place la carafe au refrigerateur pendant 1 a 2 heures.",
    "Idealement, laisse infuser 2 a 4 heures pour un gout plus intense.",
    "5. Servir",
    "Servir",
    "Ajoute quelques glacons au moment de servir.",
    "Tu peux ajouter une cuillere a cafe de miel si tu preferes une note plus douce.",
    "Il ne reste plus qu'a savourer !",
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
    "80 g de myrtilles",
    "1/2 orange",
    "6 a 8 feuilles de menthe",
    "1 litre d'eau froide",
    "Optionnel :",
    "quelques glacons",
    "1 c. a cafe de miel",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Lave les myrtilles et les feuilles de menthe.",
    "Coupe l'orange en fines rondelles.",
    "Des tranches fines permettent une infusion plus rapide des saveurs.",
    "2. Liberer les aromes",
    "Preparer",
    "Froisse legerement les feuilles de menthe entre les doigts.",
    "Tu peux aussi ecraser tres legerement quelques myrtilles pour liberer leur jus.",
    "Cela libere les aromes sans ecraser la menthe.",
    "3. Assembler l'eau infusee",
    "Assembler",
    "Dans une carafe, ajoute les myrtilles, les rondelles d'orange et la menthe.",
    "Verse ensuite 1 litre d'eau froide.",
    "4. Laisser infuser",
    "Refrigerer",
    "Place la carafe au refrigerateur pendant 1 a 2 heures.",
    "Idealement, laisse infuser 2 a 4 heures pour un gout plus intense.",
    "5. Servir",
    "Servir",
    "Ajoute quelques glacons au moment de servir.",
    "Tu peux ajouter un filet de citron vert si tu veux une note plus vive.",
    "Il ne reste plus qu'a savourer !",
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
    "120 g de fraises",
    "1/2 citron jaune",
    "6 a 8 feuilles de menthe",
    "1 litre d'eau froide",
    "Optionnel :",
    "quelques glacons",
    "1 c. a cafe de miel",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Lave les fraises et les feuilles de menthe.",
    "Coupe les fraises en deux ou en rondelles.",
    "Coupe le citron jaune en fines rondelles.",
    "Des tranches fines permettent une infusion plus rapide des saveurs.",
    "2. Liberer les aromes",
    "Preparer",
    "Froisse legerement les feuilles de menthe entre les doigts.",
    "Tu peux aussi ecraser tres legerement une ou deux fraises pour intensifier le gout.",
    "Cela libere les aromes sans ecraser la menthe.",
    "3. Assembler l'eau infusee",
    "Assembler",
    "Dans une carafe, ajoute les fraises, le citron et la menthe.",
    "Verse ensuite 1 litre d'eau froide.",
    "4. Laisser infuser",
    "Refrigerer",
    "Place la carafe au refrigerateur pendant 1 a 2 heures.",
    "Idealement, laisse infuser 2 a 4 heures pour un gout plus intense.",
    "5. Servir",
    "Servir",
    "Ajoute quelques glacons au moment de servir.",
    "Tu peux ajouter un filet de citron vert si tu veux une note plus vive.",
    "Il ne reste plus qu'a savourer !",
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
    "30 g de flocons d'avoine",
    "1 c. a soupe de beurre de cacahuete",
    "250 ml de lait d'amande",
    "1 c. a cafe de miel ou sirop d'erable",
    "4 a 5 glacons",
    "Optionnel mais tres bon :",
    "1/2 c. a cafe de cannelle",
    "1 c. a cafe de cacao en poudre",
  ],
  steps: [
    "1. Preparer la base",
    "Preparer la base",
    "Dans un bol, mets les flocons d'avoine avec un petit peu de lait d'amande.",
    "Laisse reposer environ 2 minutes pour ramollir l'avoine.",
    "2. Mixer la boisson",
    "Mixer",
    "Dans un blender, ajoute l'avoine ramollie, le beurre de cacahuete, le reste de lait d'amande, le miel et les glacons.",
    "Mixe pendant 30 a 40 secondes jusqu'a obtenir une texture homogene.",
    "Le smoothie doit etre cremeux, sans morceaux d'avoine visibles.",
    "3. Ajuster la texture",
    "Ajuster la texture",
    "Si la boisson est trop epaisse, ajoute un peu de lait d'amande puis remixe quelques secondes.",
    "Si tu le veux plus epais, ajoute quelques glacons ou un peu plus de banane.",
    "4. Servir",
    "Servir",
    "Verse dans un grand verre et melange legerement avant de deguster.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-pates-cremeuses",
  title: "Alfredo pasta protéiné",
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
  title: "Butter chicken protéiné, riz et brocolis",
  flavor: "sale",
  prepTime: "30 à 35 min",
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
  prepTime: "10 à 12 min",
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
  prepTime: "25 à 30 min",
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
  servings: "4 portions",
  image: houmousMaisonUltraCremeuxImg,
  ingredients: [
    "400 g de pois chiches cuits (1 boite egouttee)",
    "60 g de tahini (puree de sesame)",
    "2 c. a soupe de jus de citron",
    "1 petite gousse d'ail",
    "2 c. a soupe d'huile d'olive",
    "3 a 5 c. a soupe d'eau froide",
    "1/2 c. a cafe de sel",
    "Pour servir :",
    "huile d'olive",
    "paprika",
    "persil",
  ],
  steps: [
    "1. Preparer les pois chiches",
    "Preparer",
    "Egoutte et rince les pois chiches sous l'eau froide.",
    "Si tu veux un houmous tres lisse, retire la peau des pois chiches (optionnel).",
    "2. Mixer la base",
    "Mixer",
    "Dans un blender ou un robot, ajoute les pois chiches, le tahini, le jus de citron, l'ail, le sel et le poivre.",
    "Mixe une premiere fois pendant 30 secondes.",
    "3. Ajuster la texture",
    "Ajuster la texture",
    "Ajoute l'eau froide petit a petit, puis remixe pendant 1 a 2 minutes.",
    "Continue de mixer jusqu'a obtenir une texture tres lisse et cremeuse.",
    "L'eau froide aide a rendre le houmous plus leger et mousseux.",
    "4. Ajuster le gout",
    "Finaliser",
    "Goute et ajuste selon tes preferences avec un peu plus de citron, de sel ou d'huile d'olive.",
    "Un mixage long donne une texture vraiment ultra cremeuse.",
    "5. Servir",
    "Servir",
    "Etale le houmous dans un bol.",
    "Ajoute un filet d'huile d'olive, une pincee de paprika et quelques feuilles de persil.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-tzatziki",
  title: "Tzatziki",
  flavor: "sale",
  prepTime: "10 minutes + repos",
  servings: "4 portions",
  image: tzatzikiImg,
  ingredients: [
    "250 g de yaourt grec",
    "1/2 concombre",
    "1 petite gousse d'ail",
    "1 c. a soupe d'huile d'olive",
    "1 c. a soupe de jus de citron",
    "1 c. a soupe d'aneth frais (ou menthe)",
    "sel et poivre",
  ],
  steps: [
    "1. Preparer le concombre",
    "Preparer",
    "Rape le concombre, puis presse-le dans un torchon propre ou entre les mains pour retirer un maximum d'eau.",
    "C'est essentiel pour eviter un tzatziki trop liquide.",
    "2. Preparer la base",
    "Melanger",
    "Dans un bol, ajoute le yaourt grec, l'ail finement hache, le jus de citron et l'huile d'olive.",
    "Melange jusqu'a obtenir une base homogene.",
    "3. Ajouter le concombre",
    "Assembler",
    "Incorpore le concombre bien egoutte puis ajoute l'aneth.",
    "Melange delicatement pour bien repartir les ingredients.",
    "4. Assaisonner",
    "Finaliser",
    "Ajoute le sel et le poivre selon ton gout, puis remue une derniere fois.",
    "5. Laisser reposer",
    "Refrigerer",
    "Place le tzatziki au refrigerateur pendant environ 30 minutes.",
    "Cela permet aux saveurs de bien se developper.",
    "6. Servir",
    "Servir",
    "Verse dans un bol, puis ajoute un filet d'huile d'olive et un peu d'aneth en finition.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-vierge",
  title: "Sauce vierge",
  flavor: "sale",
  prepTime: "10 min",
  servings: "3 à 4 portions",
  image: sauceViergeImg,
  ingredients: [
    "2 tomates bien mures",
    "4 c. a soupe d'huile d'olive extra vierge",
    "1 c. a soupe de jus de citron",
    "1 petite echalote",
    "1 c. a soupe de basilic frais",
    "1 c. a soupe de persil frais",
    "1 c. a cafe de capres (optionnel mais tres bon)",
    "sel et poivre",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Coupe les tomates en petits des reguliers.",
    "Si tu veux une sauce plus fine, retire les graines.",
    "Emince tres finement l'echalote.",
    "Hache le basilic et le persil.",
    "Des morceaux reguliers permettent une sauce plus homogene.",
    "2. Assembler la base",
    "Assembler",
    "Dans un bol, ajoute les tomates, l'echalote, les herbes et les capres (optionnel).",
    "Melange delicatement.",
    "3. Assaisonner",
    "Finaliser",
    "Ajoute l'huile d'olive et le jus de citron.",
    "Assaisonne avec le sel et le poivre, puis melange de nouveau.",
    "4. Laisser reposer",
    "Laisser reposer",
    "Laisse reposer 10 minutes a temperature ambiante pour que les saveurs se melangent.",
    "Laisse reposer quelques minutes pour que les aromes se melangent.",
    "5. Servir",
    "Servir",
    "Verse la sauce vierge dans un petit bol ou directement sur ton plat.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-vinaigrette-miel-moutarde-balsamique",
  title: "Vinaigrette miel, moutarde & balsamique",
  flavor: "sale",
  prepTime: "5 min",
  servings: "3 à 4 portions",
  image: vinaigretteMielMoutardeBalsamiqueImg,
  ingredients: [
    "1 c. a soupe de moutarde",
    "1 c. a soupe de miel",
    "2 c. a soupe de vinaigre balsamique",
    "4 c. a soupe d'huile d'olive",
    "1 petite echalote",
    "sel",
    "poivre",
  ],
  steps: [
    "1. Preparer l'echalote",
    "Preparer",
    "Epluche l'echalote puis emince-la tres finement.",
    "2. Melanger la base",
    "Melanger",
    "Dans un bol, ajoute la moutarde, le miel et le vinaigre balsamique.",
    "Fouette jusqu'a obtenir un melange homogene.",
    "3. Monter la vinaigrette",
    "Fouetter",
    "Verse l'huile d'olive progressivement en fouettant en continu.",
    "Cela permet de creer une vinaigrette bien emulsionnee et legerement cremeuse.",
    "4. Finaliser",
    "Finaliser",
    "Ajoute l'echalote emincee, puis assaisonne avec le sel et le poivre.",
    "Melange une derniere fois.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Laisse reposer 5 minutes pour que l'echalote parfume la vinaigrette.",
    "6. Servir",
    "Servir",
    "Verse sur la salade ou conserve-la au frais quelques heures.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-tahini-cremeuse",
  title: "Sauce tahini cremeuse",
  flavor: "sale",
  prepTime: "15 min",
  servings: "4 portions",
  image: sauceTahiniCremeuseImg,
  ingredients: [
    "Pour la puree de sesame (tahini maison)",
    "120 g de graines de sesame",
    "1 c. a soupe d'huile d'olive ou huile neutre",
    "1 pincee de sel",
    "Pour la sauce tahini",
    "3 c. a soupe de tahini maison",
    "2 c. a soupe de jus de citron",
    "1 petite gousse d'ail",
    "3 a 5 c. a soupe d'eau froide",
    "1 c. a soupe d'huile d'olive",
    "sel",
    "Optionnel mais tres bon :",
    "persil",
    "cumin",
    "paprika",
  ],
  steps: [
    "1. Preparer la base",
    "Preparer la base",
    "Dans un bol, ajoute le tahini, le jus de citron, la sauce soja (ou tamari), le miel et l'ail emince.",
    "Melange une premiere fois pour bien combiner les saveurs.",
    "2. Ajouter l'eau",
    "Ajuster la texture",
    "Ajoute l'eau froide petit a petit en fouettant.",
    "La sauce va devenir plus claire et tres cremeuse.",
    "3. Equilibrer le gout",
    "Finaliser",
    "Goute puis ajuste selon tes preferences avec un peu plus de citron, de miel ou de sauce soja.",
    "Ajoute un filet d'huile d'olive si tu veux une texture encore plus ronde.",
    "4. Ajuster la consistance",
    "Ajuster la texture",
    "Si la sauce est trop epaisse, ajoute un peu d'eau et fouette de nouveau.",
    "Si elle est trop liquide, ajoute un peu de tahini.",
    "5. Servir",
    "Servir",
    "Verse la sauce dans un bol ou directement sur ton plat.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-asiatique-cacahuetes",
  title: "Sauce asiatique aux cacahuetes",
  flavor: "sale",
  prepTime: "10 min",
  servings: "4 portions",
  image: sauceAsiatiqueCacahuetesImg,
  ingredients: [
    "3 c. a soupe de beurre de cacahuete",
    "2 c. a soupe de sauce soja",
    "1 c. a soupe de jus de citron vert",
    "1 c. a soupe de miel ou sirop d'erable",
    "1 c. a cafe d'huile de sesame",
    "1 petite gousse d'ail",
    "3 a 5 c. a soupe d'eau chaude",
    "Optionnel mais incroyable :",
    "cacahuetes concassees",
  ],
  steps: [
    "1. Preparer la base",
    "Preparer la base",
    "Dans un bol, ajoute le beurre de cacahuete, la sauce soja, le vinaigre de riz, le sirop d'erable (ou d'agave) et le jus de citron vert.",
    "Melange une premiere fois pour bien combiner les saveurs.",
    "2. Ajouter les aromates",
    "Ajouter les ingredients",
    "Ajoute l'ail emince.",
    "Si tu veux une sauce plus relevee, ajoute aussi la sriracha.",
    "Melange de nouveau jusqu'a obtenir une base homogene.",
    "3. Ajuster la texture",
    "Ajuster la texture",
    "Ajoute l'eau petit a petit en fouettant.",
    "La sauce va devenir plus claire et tres cremeuse.",
    "4. Equilibrer le gout",
    "Finaliser",
    "Goute puis ajuste selon tes preferences : un peu plus de citron vert pour la fraicheur, un peu plus de sauce soja pour le sale, ou un peu plus de sirop pour adoucir.",
    "Si la sauce est trop epaisse, ajoute un filet d'eau et fouette de nouveau.",
    "5. Servir",
    "Servir",
    "Verse la sauce dans un petit bol ou directement sur ton plat.",
    "Ajoute quelques cacahuetes concassees sur le dessus si tu le souhaites.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-blanche-herbes",
  title: "Sauce blanche aux herbes",
  flavor: "sale",
  prepTime: "10 min",
  servings: "3 à 4 portions",
  image: sauceBlancheHerbesImg,
  ingredients: [
    "200 g de yaourt grec",
    "1 c. a soupe d'huile d'olive",
    "1 petite gousse d'ail",
    "1 c. a soupe de persil frais",
    "1 c. a soupe de ciboulette",
    "1 c. a soupe de jus de citron",
    "sel",
    "poivre",
  ],
  steps: [
    "1. Preparer les herbes",
    "Couper",
    "Hache finement le persil et la ciboulette.",
    "Des herbes bien coupees se repartissent mieux dans la sauce.",
    "2. Preparer la base",
    "Preparer la base",
    "Dans un bol, ajoute le yaourt grec, l'huile d'olive et le jus de citron.",
    "Melange jusqu'a obtenir une base homogene.",
    "3. Ajouter les aromates",
    "Ajouter les ingredients",
    "Ajoute l'ail rape ou finement emince, puis incorpore les herbes hachees.",
    "Melange de nouveau pour bien repartir tous les aromates.",
    "4. Assaisonner",
    "Assaisonner",
    "Ajoute le sel et le poivre selon ton gout.",
    "Melange jusqu'a obtenir une sauce lisse et parfumee.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Place la sauce au refrigerateur pendant 10 a 15 minutes.",
    "Cela permet aux saveurs de bien se developper.",
    "6. Servir",
    "Servir",
    "Verse la sauce dans un bol ou directement sur ton plat.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-chimichurri-legerement-sucre",
  title: "Chimichurri legerement sucre",
  flavor: "sale",
  prepTime: "10 min",
  servings: "4 portions",
  image: chimichurriLegerementSucreImg,
  ingredients: [
    "1 gros bouquet de persil frais",
    "2 gousses d'ail",
    "4 c. a soupe d'huile d'olive",
    "2 c. a soupe de vinaigre de vin rouge",
    "1 c. a cafe de miel",
    "1/2 c. a cafe de flocons de piment",
    "1/2 c. a cafe d'origan seche",
    "sel",
    "poivre",
  ],
  steps: [
    "1. Preparer les herbes",
    "Couper",
    "Lave le persil puis hache-le tres finement au couteau.",
    "Des herbes finement coupees donnent une texture plus harmonieuse.",
    "2. Preparer l'ail",
    "Preparer",
    "Epluche l'ail puis hache-le tres finement ou rape-le.",
    "3. Melanger la base",
    "Melanger",
    "Dans un bol, ajoute le persil, l'ail, le vinaigre, le miel (ou le sucre), le jus de citron et les flocons de piment si tu en utilises.",
    "Melange une premiere fois pour bien combiner les saveurs.",
    "4. Ajouter l'huile",
    "Ajouter les ingredients",
    "Verse l'huile d'olive petit a petit en melangeant.",
    "La sauce doit devenir brillante et bien liee.",
    "5. Assaisonner",
    "Assaisonner",
    "Ajoute le sel et le poivre selon ton gout.",
    "Melange de nouveau.",
    "6. Laisser reposer",
    "Laisser reposer",
    "Laisse reposer 10 a 15 minutes avant de servir.",
    "Cela permet aux saveurs de bien se developper.",
    "7. Servir",
    "Servir",
    "Verse le chimichurri dans un bol ou directement sur ton plat.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-aubergines-poivrons-grilles",
  title: "Sauce aux aubergines & poivrons grilles",
  flavor: "sale",
  prepTime: "35 min",
  servings: "4 portions",
  image: sauceAuberginesPoivronsGrillesImg,
  ingredients: [
    "1 grosse aubergine",
    "1 poivron rouge",
    "1 petite gousse d'ail",
    "2 c. a soupe d'huile d'olive",
    "1 c. a soupe de jus de citron",
    "1 c. a cafe de paprika",
    "1 c. a soupe de persil frais",
    "sel",
    "poivre",
    "Optionnel mais excellent :",
    "une pincee de cumin",
    "un peu de piment",
  ],
  steps: [
    "1. Preparer le four",
    "Prechauffer le four",
    "Prechauffe le four a 200C.",
    "2. Preparer les legumes",
    "Couper",
    "Coupe les aubergines en deux dans la longueur.",
    "Coupe les poivrons en deux puis retire les graines.",
    "3. Cuire au four",
    "Enfourner",
    "Dispose les legumes sur une plaque recouverte de papier cuisson.",
    "Arrose avec un filet d'huile d'olive puis enfourne environ 25 minutes.",
    "Les legumes doivent etre bien tendres et legerement grilles.",
    "4. Mixer la base",
    "Mixer",
    "Laisse tiedir quelques minutes puis place dans un blender la chair d'aubergine, le poivron, l'ail, le jus de citron, l'huile d'olive restante et le paprika.",
    "Mixe jusqu'a obtenir une texture lisse et cremeuse.",
    "5. Assaisonner",
    "Assaisonner",
    "Ajoute le sel, le poivre et les herbes fraiches de ton choix.",
    "Melange de nouveau pour bien repartir les saveurs.",
    "6. Servir",
    "Servir",
    "Verse la sauce dans un bol ou directement sur ton plat.",
    "Ajoute un filet d'huile d'olive et une pincee de paprika si tu le souhaites.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-poivre",
  title: "Sauce au poivre",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 portions",
  image: saucePoivreImg,
  ingredients: [
    "1 c. a soupe de beurre",
    "1 petite echalote",
    "1 c. a soupe de poivre noir concasse",
    "4 cl de cognac",
    "150 ml de creme fraiche",
    "sel",
    "Optionnel mais recommande :",
    "50 ml de fond de veau",
  ],
  steps: [
    "1. Preparer l'echalote",
    "Preparer",
    "Epluche puis hache tres finement l'echalote.",
    "2. Faire revenir",
    "Faire revenir",
    "Fais fondre le beurre dans une petite casserole a feu moyen.",
    "Ajoute l'echalote et fais-la revenir 2 minutes jusqu'a ce qu'elle devienne translucide.",
    "3. Ajouter le poivre",
    "Ajouter les ingredients",
    "Ajoute le poivre noir concasse puis melange.",
    "Laisse cuire environ 30 secondes pour liberer les aromes.",
    "4. Deglacer",
    "Ajouter les ingredients",
    "Verse le cognac et laisse reduire environ 1 minute.",
    "Si tu utilises du fond de veau, ajoute-le ensuite puis laisse reduire 2 minutes.",
    "5. Ajouter la creme",
    "Laisser mijoter",
    "Ajoute la creme fraiche puis melange.",
    "Laisse mijoter 3 a 4 minutes jusqu'a ce que la sauce epaississe.",
    "6. Ajuster",
    "Finaliser",
    "Goute puis ajuste avec un peu de sel si necessaire.",
    "Tu peux ajouter une noisette de beurre froid hors du feu pour une sauce plus brillante.",
    "7. Servir",
    "Servir",
    "Verse la sauce au poivre sur un steak ou une viande grillee.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-pickles-oignons",
  title: "Pickles d'oignons",
  flavor: "sale",
  prepTime: "10 min + repos",
  servings: "1 bocal",
  image: picklesOignonsImg,
  ingredients: [
    "1 gros oignon rouge",
    "120 ml de vinaigre de cidre (ou vinaigre blanc)",
    "120 ml d'eau",
    "1 c. a soupe de sucre",
    "1 c. a cafe de sel",
    "Optionnel mais excellent :",
    "1 feuille de laurier",
    "1/2 c. a cafe de graines de coriandre",
    "quelques grains de poivre",
    "1 petit piment",
  ],
  steps: [
    "1. Couper les oignons",
    "Couper",
    "Epluche l'oignon rouge puis coupe-le en fines rondelles.",
    "Les rondelles fines absorbent plus vite la marinade.",
    "2. Preparer la marinade",
    "Melanger",
    "Dans une petite casserole, ajoute le vinaigre, l'eau, le sucre et le sel.",
    "Fais chauffer environ 2 minutes en melangeant, jusqu'a dissolution complete du sucre et du sel.",
    "3. Mettre en bocal",
    "Preparer",
    "Place les rondelles d'oignon dans un bocal propre.",
    "Ajoute les epices optionnelles si tu le souhaites.",
    "4. Verser la marinade",
    "Ajouter les ingredients",
    "Verse la marinade chaude sur les oignons jusqu'a ce qu'ils soient bien recouverts.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Laisse refroidir a temperature ambiante puis place au refrigerateur au moins 30 minutes.",
    "Ils sont encore meilleurs apres 2 a 3 heures.",
    "6. Servir",
    "Servir",
    "Utilise les pickles d'oignons dans des bowls, sandwiches ou salades.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-pickles-concombre",
  title: "Pickles de concombre",
  flavor: "sale",
  prepTime: "10 min + repos",
  servings: "1 bocal",
  image: picklesConcombreImg,
  ingredients: [
    "1 gros concombre",
    "120 ml de vinaigre de cidre (ou vinaigre blanc)",
    "120 ml d'eau",
    "1 c. a soupe de sucre",
    "1 c. a cafe de sel",
    "Aromates",
    "1 gousse d'ail",
    "1 c. a cafe de graines de moutarde",
    "1 c. a cafe d'aneth (frais ou seche)",
    "1/2 c. a cafe de grains de poivre",
    "Optionnel mais excellent :",
    "1 petit piment",
    "1 feuille de laurier",
  ],
  steps: [
    "1. Preparer le concombre",
    "Couper",
    "Lave le concombre puis coupe-le en rondelles fines ou en batonnets.",
    "Des morceaux fins permettent une marinade plus rapide.",
    "2. Preparer la marinade",
    "Melanger",
    "Dans une casserole, ajoute le vinaigre, l'eau, le sucre et le sel.",
    "Fais chauffer environ 2 minutes en melangeant, jusqu'a dissolution complete du sucre et du sel.",
    "3. Preparer le bocal",
    "Preparer",
    "Place les morceaux de concombre dans un bocal propre.",
    "Ajoute l'ail, l'aneth et le poivre (ou les epices de ton choix).",
    "4. Ajouter la marinade",
    "Ajouter les ingredients",
    "Verse la marinade chaude dans le bocal jusqu'a recouvrir completement les concombres.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Laisse refroidir a temperature ambiante, puis place au refrigerateur au moins 2 heures.",
    "Ils sont encore meilleurs le lendemain.",
    "6. Servir",
    "Servir",
    "Utilise les pickles de concombre dans des salades, sandwiches ou bowls.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-pickles-carottes",
  title: "Pickles de carottes",
  flavor: "sale",
  prepTime: "15 min + repos",
  servings: "1 bocal",
  image: picklesCarottesImg,
  ingredients: [
    "2 grosses carottes",
    "120 ml de vinaigre de riz ou vinaigre de cidre",
    "120 ml d'eau",
    "1 c. a soupe de sucre",
    "1 c. a cafe de sel",
    "Aromates",
    "1 gousse d'ail",
    "1/2 c. a cafe de graines de coriandre",
    "1/2 c. a cafe de grains de poivre",
    "1 petit morceau de gingembre (1 cm)",
    "Optionnel mais tres bon :",
    "1 petit piment",
    "1 feuille de laurier",
  ],
  steps: [
    "1. Preparer les carottes",
    "Couper",
    "Epluche les carottes puis coupe-les en batonnets fins ou en rondelles.",
    "Les batonnets restent souvent plus croquants.",
    "2. Preparer la saumure",
    "Melanger",
    "Dans une petite casserole, ajoute le vinaigre, l'eau, le sucre et le sel.",
    "Fais chauffer environ 2 minutes en melangeant, jusqu'a dissolution complete du sucre et du sel.",
    "3. Preparer le bocal",
    "Preparer",
    "Place les carottes dans un bocal propre.",
    "Ajoute l'ail, le gingembre et le piment si tu le souhaites.",
    "4. Ajouter la marinade",
    "Ajouter les ingredients",
    "Verse la saumure chaude sur les carottes jusqu'a ce qu'elles soient bien recouvertes.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Laisse refroidir a temperature ambiante puis place au refrigerateur au moins 2 heures.",
    "Elles sont encore meilleures apres 12 a 24 heures.",
    "6. Servir",
    "Servir",
    "Utilise les pickles de carottes dans des bowls, salades ou sandwiches.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-pickles-chou-fleur",
  title: "Pickles de chou-fleur",
  flavor: "sale",
  prepTime: "20 min + repos",
  servings: "1 bocal",
  image: picklesChouFleurImg,
  ingredients: [
    "1/2 chou-fleur",
    "120 ml de vinaigre de cidre (ou vinaigre blanc)",
    "120 ml d'eau",
    "1 c. a soupe de sucre",
    "1 c. a cafe de sel",
    "Aromates",
    "1 gousse d'ail",
    "1 c. a cafe de graines de moutarde",
    "1/2 c. a cafe de grains de poivre",
    "1/2 c. a cafe de curcuma",
    "1 petite feuille de laurier",
    "Optionnel mais tres bon :",
    "1 petit piment",
    "1 petit morceau de gingembre",
  ],
  steps: [
    "1. Preparer le chou-fleur",
    "Couper",
    "Lave le chou-fleur puis coupe-le en petites fleurettes.",
    "Des fleurettes petites et regulieres marinent plus vite.",
    "2. Preparer la saumure",
    "Melanger",
    "Dans une casserole, ajoute le vinaigre, l'eau, le sucre et le sel.",
    "Fais chauffer 2 a 3 minutes en melangeant, jusqu'a dissolution complete du sucre et du sel.",
    "3. Preparer le bocal",
    "Preparer",
    "Place les fleurettes de chou-fleur dans un bocal propre.",
    "Ajoute l'ail et les epices de ton choix.",
    "4. Ajouter la marinade",
    "Ajouter les ingredients",
    "Verse la saumure chaude sur le chou-fleur jusqu'a recouvrir completement les legumes.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Laisse refroidir a temperature ambiante, puis place au refrigerateur au moins 4 heures.",
    "Ils sont encore meilleurs apres 24 heures.",
    "6. Servir",
    "Servir",
    "Utilise les pickles de chou-fleur en accompagnement, dans des bowls ou des salades.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-pesto-maison",
  title: "Sauce pesto maison",
  flavor: "sale",
  prepTime: "10 min",
  servings: "4 portions",
  image: saucePestoMaisonImg,
  ingredients: [
    "50 g de basilic frais",
    "30 g de pignons de pin",
    "40 g de parmesan rape",
    "1 petite gousse d'ail",
    "80 ml d'huile d'olive extra vierge",
    "Sel",
    "Optionnel mais tres bon :",
    "20 g de pecorino",
    "quelques gouttes de jus de citron",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer les ingredients",
    "Lave puis seche soigneusement les feuilles de basilic.",
    "Epluche la gousse d'ail.",
    "2. Torrefier les pignons",
    "Cuire legerement",
    "Mets les pignons dans une poele seche et fais-les griller 2 a 3 minutes jusqu'a ce qu'ils soient legerement dores.",
    "Cela donne plus de gout au pesto.",
    "3. Mixer la base",
    "Mixer",
    "Dans un blender ou un robot, ajoute les pignons, l'ail et le basilic.",
    "Mixe quelques secondes.",
    "4. Ajouter le parmesan",
    "Ajouter les ingredients",
    "Ajoute le parmesan rape puis mixe legerement.",
    "5. Ajouter l'huile",
    "Ajuster la texture",
    "Verse l'huile d'olive progressivement en mixant.",
    "Continue jusqu'a obtenir une texture lisse mais legerement granuleuse.",
    "6. Assaisonner",
    "Assaisonner",
    "Ajoute une pincee de sel et un peu de poivre, puis melange et goute.",
    "7. Servir",
    "Servir",
    "Verse le pesto dans un bol ou utilise-le directement avec des pates, sandwichs ou bowls.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-guacamole-maison",
  title: "Guacamole maison",
  flavor: "sale",
  prepTime: "10 min",
  servings: "3 à 4 portions",
  image: guacamoleMaisonImg,
  ingredients: [
    "2 avocats bien murs",
    "1/2 petit oignon rouge",
    "1 petite tomate",
    "1/2 citron vert (jus)",
    "1 c. a soupe de coriandre fraiche",
    "1 petit piment ou 1/2 c. a cafe de piment (optionnel)",
    "Sel",
    "Optionnel mais tres bon :",
    "1 petite gousse d'ail",
    "un peu de zeste de citron vert",
  ],
  steps: [
    "1. Preparer les avocats",
    "Preparer",
    "Coupe les avocats en deux, retire le noyau puis recupere la chair a l'aide d'une cuillere.",
    "2. Ecraser",
    "Ecraser l'avocat",
    "Mets la chair dans un bol puis ecrase-la a la fourchette.",
    "Le guacamole doit rester legerement chunky (pas totalement lisse).",
    "3. Preparer les garnitures",
    "Couper",
    "Coupe l'oignon rouge tres finement, coupe la tomate en petits des et hache la coriandre.",
    "4. Melanger",
    "Melanger",
    "Ajoute dans le bol l'oignon, la tomate, la coriandre et le jus de citron vert.",
    "Melange doucement pour garder de la texture.",
    "5. Assaisonner",
    "Assaisonner",
    "Ajoute le sel et, si tu le souhaites, une pincee de piment.",
    "Goute puis ajuste le citron selon ton gout.",
    "6. Servir",
    "Servir",
    "Mets le guacamole dans un bol et ajoute un peu de coriandre ou un filet d'huile d'olive sur le dessus.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-chutney-mangue",
  title: "Chutney de mangue",
  flavor: "sale",
  prepTime: "45 min",
  servings: "1 bocal",
  image: chutneyMangueImg,
  ingredients: [
    "2 grosses mangues mures mais fermes",
    "120 ml de vinaigre de cidre",
    "120 g de sucre roux",
    "1/2 oignon finement coupe",
    "1 gousse d'ail",
    "1 c. a cafe de gingembre frais rape",
    "1/2 c. a cafe de sel",
    "Epices (cle du gout)",
    "1/2 c. a cafe de graines de moutarde",
    "1/2 c. a cafe de cumin",
    "1/2 c. a cafe de coriandre moulue",
    "1 petite pincee de piment",
    "1 petite pincee de cannelle",
    "Optionnel mais tres utilise :",
    "30 g de raisins secs",
  ],
  steps: [
    "1. Preparer les mangues",
    "Couper",
    "Epluche la mangue puis coupe la chair en petits des reguliers.",
    "Des morceaux reguliers permettent une cuisson plus homogene.",
    "2. Faire revenir les aromates",
    "Faire revenir",
    "Dans une casserole, fais chauffer un filet d'huile puis ajoute l'oignon, l'ail et le gingembre.",
    "Fais revenir environ 2 minutes a feu moyen.",
    "3. Ajouter les epices",
    "Ajouter les ingredients",
    "Ajoute les epices (curry ou curcuma, et piment si tu en utilises).",
    "Laisse cuire 30 secondes pour liberer les aromes.",
    "4. Ajouter la mangue",
    "Ajouter les ingredients",
    "Ajoute la mangue, le sucre (ou le miel), le vinaigre, le sel et les raisins secs si tu en utilises.",
    "Melange bien.",
    "5. Cuisson lente",
    "Laisser mijoter",
    "Laisse mijoter a feu doux 25 a 30 minutes en remuant regulierement.",
    "Le chutney doit devenir epais, brillant et legerement caramelise.",
    "6. Refroidir",
    "Laisser refroidir",
    "Laisse refroidir completement puis transfere dans un bocal propre.",
    "Le gout devient encore meilleur apres 24 heures.",
    "7. Servir",
    "Servir",
    "Utilise le chutney de mangue avec du poulet, des bowls ou une assiette fromage.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-caviar-aubergine",
  title: "Caviar d'aubergine",
  flavor: "sale",
  prepTime: "45 min",
  servings: "4 portions",
  image: caviarAubergineImg,
  ingredients: [
    "2 grosses aubergines",
    "1 gousse d'ail",
    "3 c. a soupe d'huile d'olive extra vierge",
    "1/2 citron (jus)",
    "1 c. a cafe de cumin",
    "Sel",
    "Poivre",
  ],
  steps: [
    "1. Cuire les aubergines",
    "Preparer",
    "Prechauffe le four a 200C.",
    "Coupe les aubergines en deux dans la longueur, puis quadrille legerement la chair avec un couteau.",
    "Ajoute un filet d'huile d'olive sur chaque moitie.",
    "Cuire",
    "Place les aubergines sur une plaque et enfourne 30 a 35 minutes.",
    "La chair doit etre tres tendre pour un caviar bien fondant.",
    "2. Recuperer la chair",
    "Laisser tiedir",
    "Laisse refroidir 5 minutes pour pouvoir les manipuler facilement.",
    "Recuperer",
    "Recupere la chair avec une cuillere et jette la peau.",
    "3. Mixer le caviar",
    "Assembler",
    "Dans un blender ou un bol, ajoute la chair d'aubergine, l'ail, le jus de citron et le reste d'huile d'olive.",
    "Mixer",
    "Mixe 20 a 30 secondes selon la texture souhaitee.",
    "La texture doit etre cremeuse mais legerement rustique.",
    "4. Assaisonner",
    "Assaisonner",
    "Ajoute du sel et du poivre, puis goute.",
    "Ajuste le citron ou un filet d'huile d'olive si besoin.",
    "5. Laisser reposer",
    "Laisser reposer",
    "Place le caviar au refrigerateur pendant 30 minutes avant de servir.",
    "Laisse reposer 30 minutes au refrigerateur pour developper les saveurs.",
    "6. Servir",
    "Servir",
    "Mets le caviar d'aubergine dans un bol.",
    "Ajoute un filet d'huile d'olive et un peu de persil ou de coriandre si tu le souhaites.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-tapenade",
  title: "Tapenade",
  flavor: "sale",
  prepTime: "10 min",
  servings: "4 portions",
  image: tapenadeImg,
  ingredients: [
    "200 g d'olives noires denoyautees",
    "2 c. a soupe de capres",
    "2 filets d'anchois",
    "1 petite gousse d'ail",
    "4 c. a soupe d'huile d'olive",
    "1 c. a cafe de jus de citron",
    "Poivre",
    "Optionnel mais tres bon :",
    "1 c. a cafe de thym ou herbes de Provence",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Egoutte les olives et les capres.",
    "Epluche la gousse d'ail.",
    "2. Mixer la base",
    "Assembler",
    "Dans un robot ou un blender, ajoute les olives, les capres, l'ail et les anchois si tu en utilises.",
    "Mixer",
    "Mixe quelques secondes pour obtenir une base homogene.",
    "3. Ajouter l'huile",
    "Incorporer",
    "Verse l'huile d'olive progressivement tout en mixant par petites impulsions.",
    "Ne mixe pas trop pour garder une texture rustique.",
    "4. Ajouter le citron",
    "Assaisonner",
    "Ajoute le jus de citron puis melange legerement.",
    "5. Ajuster",
    "Ajuster",
    "Ajoute du poivre selon ton gout.",
    "Goute avant d'ajouter du sel, les olives et les capres sont deja salees.",
    "6. Laisser reposer",
    "Laisser reposer",
    "Place la tapenade au refrigerateur pendant 30 minutes avant de servir.",
    "Laisse reposer 30 minutes avant de servir pour developper les saveurs.",
    "7. Servir",
    "Servir",
    "Mets la tapenade dans un bol et ajoute un filet d'huile d'olive avec quelques herbes.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-sauce-teriyaki",
  title: "Sauce teriyaki",
  flavor: "sale",
  prepTime: "10 min",
  servings: "4 portions",
  image: sauceTeriyakiImg,
  ingredients: [
    "60 ml de sauce soja",
    "60 ml de mirin (vin de riz japonais sucre)",
    "2 c. a soupe de sucre",
    "1 c. a cafe de gingembre frais rape",
    "1 petite gousse d'ail",
    "60 ml d'eau",
    "Optionnel pour epaissir :",
    "1 c. a cafe de fecule de mais",
    "1 c. a soupe d'eau",
    "Optionnel mais tres bon :",
    "1 c. a cafe d'huile de sesame",
    "graines de sesame",
  ],
  steps: [
    "1. Melanger la base",
    "Assembler",
    "Dans une petite casserole, ajoute la sauce soja, le mirin (ou vinaigre de riz), le sucre ou le miel, le gingembre rape et l'ail hache.",
    "Melange bien pour dissoudre le sucre.",
    "2. Chauffer",
    "Cuire",
    "Porte a petite ebullition a feu moyen, puis baisse legerement le feu.",
    "Laisse mijoter 4 a 5 minutes en remuant de temps en temps.",
    "La sauce doit reduire legerement.",
    "3. Epaissir (optionnel)",
    "Epaissir",
    "Dans un petit bol, melange la maizena avec une cuillere a soupe d'eau froide.",
    "Verse ce melange dans la casserole et remue.",
    "Laisse cuire environ 1 minute jusqu'a ce que la sauce epaississe.",
    "4. Finaliser",
    "Finaliser",
    "Ajoute l'huile de sesame si tu en utilises, puis melange.",
    "5. Servir",
    "Servir",
    "La sauce doit etre brillante et legerement sirupeuse.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-huile-pimentee",
  title: "Huile pimentee",
  flavor: "sale",
  prepTime: "10 min + repos",
  servings: "1 petit bocal",
  image: huilePimenteeImg,
  ingredients: [
    "250 ml d'huile neutre (tournesol, arachide) ou huile d'olive",
    "2 c. a soupe de flocons de piment",
    "1 gousse d'ail",
    "Optionnel mais excellent :",
    "1 c. a cafe de graines de sesame",
    "1 petite pincee de sel",
  ],
  steps: [
    "1. Preparer les aromates",
    "Preparer",
    "Epluche la gousse d'ail puis coupe-la en fines tranches.",
    "2. Assembler la base",
    "Assembler",
    "Dans un bol resistant a la chaleur, ajoute les flocons de piment, l'ail, et les graines de sesame ou la badiane si tu en utilises.",
    "3. Chauffer l'huile",
    "Chauffer",
    "Verse l'huile dans une casserole et fais-la chauffer jusqu'a environ 170C.",
    "L'huile doit etre chaude mais pas fumante.",
    "4. Verser l'huile chaude",
    "Infuser",
    "Verse lentement l'huile chaude sur le melange de piment.",
    "Les piments vont crepiter legerement et liberer leurs aromes.",
    "5. Refroidir",
    "Refroidir",
    "Laisse refroidir completement, puis transfere dans un bocal hermetique.",
    "6. Laisser reposer",
    "Laisser reposer",
    "Laisse reposer au moins 12 heures avant utilisation.",
    "L'huile est encore meilleure apres 12 a 24 heures.",
    "7. Servir",
    "Servir",
    "Utilise l'huile pimentee sur des bols, des nouilles ou des legumes grilles.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-citrons-confits",
  title: "Citrons confits",
  flavor: "sale",
  prepTime: "15 min + repos",
  servings: "4 à 6 citrons",
  image: citronsConfitsImg,
  ingredients: [
    "4 a 6 citrons bio",
    "4 c. a soupe de gros sel",
    "le jus de 2 citrons supplementaires",
    "Optionnel mais tres utilise :",
    "1 feuille de laurier",
    "1 baton de cannelle",
    "1 c. a cafe de graines de coriandre",
    "quelques grains de poivre",
  ],
  steps: [
    "1. Preparer les citrons",
    "Preparer",
    "Lave soigneusement les citrons.",
    "Coupe chaque citron en croix sans aller jusqu'au bout pour qu'il reste entier.",
    "2. Saler",
    "Ajouter le sel",
    "Mets une cuillere a soupe de sel a l'interieur de chaque citron.",
    "Referme-les legerement.",
    "3. Mettre en bocal",
    "Assembler",
    "Place les citrons bien serres dans un bocal propre.",
    "Ajoute la feuille de laurier si tu en utilises.",
    "4. Ajouter le jus",
    "Ajouter le jus de citron",
    "Verse le jus de citron frais pour recouvrir les citrons.",
    "Les citrons doivent etre completement immerges.",
    "5. Demarrer la maceration",
    "Fermer",
    "Ferme le bocal hermetiquement et laisse 24 heures a temperature ambiante.",
    "6. Maturation",
    "Laisser maturer",
    "Place ensuite le bocal au refrigerateur ou dans un endroit frais.",
    "Laisse maturer 3 a 4 semaines.",
    "Les citrons deviennent tres tendres et parfumes.",
    "7. Finaliser",
    "Finaliser",
    "Secoue doucement le bocal tous les 2 a 3 jours la premiere semaine.",
    "Attends au moins 3 semaines pour un gout parfait.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-oignons-confits",
  title: "Oignons confits",
  flavor: "sale",
  prepTime: "35 min",
  servings: "4 portions",
  image: oignonsConfitsImg,
  ingredients: [
    "4 gros oignons",
    "2 c. a soupe d'huile d'olive",
    "1 c. a soupe de beurre",
    "1 c. a soupe de sucre roux",
    "2 c. a soupe de vinaigre balsamique",
    "Sel",
    "Poivre",
    "Optionnel mais excellent :",
    "1 branche de thym",
    "1 c. a soupe de miel",
  ],
  steps: [
    "1. Couper les oignons",
    "Preparer",
    "Epluche les oignons puis coupe-les en fines lamelles.",
    "2. Faire revenir",
    "Cuire",
    "Dans une grande poele, fais chauffer l'huile d'olive et ajoute les oignons.",
    "Fais cuire environ 10 minutes a feu moyen en remuant regulierement.",
    "3. Ajouter le sucre",
    "Ajouter",
    "Ajoute le sucre et melange bien.",
    "Cela aide a carameliser les oignons.",
    "4. Cuisson lente",
    "Laisser confire",
    "Baisse le feu et laisse cuire 15 a 20 minutes en remuant de temps en temps.",
    "Les oignons doivent devenir tres fondants et dores.",
    "5. Ajouter le vinaigre",
    "Deglacer",
    "Verse le vinaigre balsamique puis laisse cuire 2 a 3 minutes.",
    "6. Assaisonner",
    "Assaisonner",
    "Ajoute le sel et le poivre, puis melange.",
    "7. Finaliser",
    "Finaliser",
    "Si tu le souhaites, ajoute un peu de miel pour une note plus douce.",
    "Utiliser des oignons jaunes permet une meilleure caramelisation.",
    "8. Servir",
    "Servir",
    "Les oignons doivent etre tres fondants et legerement caramelises.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-ail-confit",
  title: "Ail confit",
  flavor: "sale",
  prepTime: "45 min",
  servings: "1 petit bocal",
  image: ailConfitImg,
  ingredients: [
    "2 tetes d'ail",
    "200 a 250 ml d'huile d'olive",
    "1 pincee de sel",
    "Optionnel mais excellent :",
    "1 branche de thym",
    "1 feuille de laurier",
    "quelques grains de poivre",
    "zeste de citron",
  ],
  steps: [
    "1. Preparer l'ail",
    "Preparer",
    "Separe les gousses d'ail et epluche-les.",
    "2. Mettre en casserole",
    "Assembler",
    "Place les gousses d'ail dans une petite casserole.",
    "Ajoute le thym si tu en utilises.",
    "3. Ajouter l'huile",
    "Ajouter l'huile",
    "Verse l'huile d'olive pour recouvrir completement les gousses.",
    "4. Cuisson lente",
    "Confire",
    "Fais chauffer a feu tres doux pendant 30 a 40 minutes.",
    "L'huile doit etre chaude mais ne pas fremir fortement.",
    "Les gousses doivent devenir tres tendres et legerement dorees.",
    "5. Refroidir",
    "Refroidir",
    "Laisse refroidir completement, puis transfere l'ail et l'huile dans un bocal hermetique.",
    "6. Conservation",
    "Conserver",
    "Conserve au refrigerateur jusqu'a 2 semaines.",
    "Utilise aussi l'huile restante pour cuire des legumes, des pates ou de la viande.",
    "7. Servir",
    "Servir",
    "Tu peux ecraser une gousse pour faire une puree d'ail confit a tartiner.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "mass-riz-cajou",
  title: "Steak, pommes de terre & haricots verts",
  flavor: "sale",
  prepTime: "30 à 35 min",
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
  title: "Overnight oats protéinés",
  flavor: "sucre",
  prepTime: "5 mi + 4 h (ou une nuit) au frigo",
  servings: "1 pers",
  image: overnightOatsImg,
  ingredients: [
    "50 g de flocons d'avoine",
    "120 ml de lait (ou lait vegetal)",
    "80 g de yaourt nature ou yaourt grec",
    "80 g de framboises",
    "1 c. a soupe de pate Biscoff (speculoos)",
    "1 biscuit speculoos emiette",
    "1 c. a cafe de miel ou sirop d'erable (optionnel)",
    "1/2 c. a cafe de vanille (optionnel)",
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
  title: "Brownie protéiné",
  flavor: "sucre",
  prepTime: "30 à 35 min",
  servings: "9 à 12 parts",
  image: brownieProteineImg,
  ingredients: [
    "200 g de chocolat noir (60-70 %)",
    "120 g de beurre",
    "150 g de sucre",
    "2 oeufs",
    "1 c. a cafe d'extrait de vanille",
    "80 g de farine",
    "1 pincee de sel",
    "100 g de noix (noix ou noix de pecan)",
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
  title: "Bowl sucré fruits rouges & granola",
  flavor: "sucre",
  prepTime: "5 à 7 min",
  servings: "1 pers",
  image: fruitsRougesGranolaImg,
  ingredients: [
    "200 g de yaourt grec",
    "120 g de fruits rouges (framboises, fraises, myrtilles)",
    "40 g de granola",
    "1 c. a cafe de miel ou sirop d'erable",
    "1 c. a cafe de graines (chia, lin ou sesame)",
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
  prepTime: "35 à 45 min",
  servings: "6 à 8 portions",
  image: granolaMaisonImg,
  ingredients: [
    "250 g de flocons d'avoine",
    "100 g de noix (noix, amandes, noisettes ou noix de pecan)",
    "60 g de miel ou sirop d'erable",
    "40 ml d'huile de coco ou d'huile neutre",
    "1 c. a cafe d'extrait de vanille",
    "1/2 c. a cafe de cannelle",
    "1 pincee de sel",
    "Optionnel mais tres bon :",
    "40 g de pepites de chocolat",
    "40 g de fruits secs (cranberries, raisins)",
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
  title: "Soupe verte détox",
  flavor: "sale",
  prepTime: "20 à 25 min",
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
  prepTime: "1 heure",
  servings: "8 à 10 tranches",
  image: bananaBreadImg,
  ingredients: [
    "3 bananes tres mures",
    "2 oeufs",
    "100 g de sucre roux",
    "50 g de sucre blanc",
    "80 ml d'huile vegetale ou beurre fondu",
    "1 c. a cafe d'extrait de vanille",
    "200 g de farine",
    "1 c. a cafe de bicarbonate de soude",
    "1/2 c. a cafe de sel",
    "Optionnel mais incroyable :",
    "80 g de noix ou noix de pecan",
    "80 g de pepites de chocolat",
    "1/2 c. a cafe de cannelle",
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
  title: "Brochettes de poulet, salade fraîche & boulghour à la tomate",
  flavor: "sale",
  prepTime: "30 à 35 min",
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
  prepTime: "10 min",
  servings: "1 pers",
  image: smoothieMangueImg,
  ingredients: [
    "150 g de mangue (fraiche ou congelee)",
    "1 fruit de la passion",
    "200 ml d'eau de coco",
    "1/2 citron vert (jus)",
    "4 a 5 glacons",
    "Optionnel mais incroyable :",
    "1 c. a cafe de miel",
    "1 c. a soupe de yaourt grec ou coco (texture plus cremeuse)",
  ],
  steps: [
    "1. Preparer les ingredients",
    "Preparer",
    "Coupe la mangue en morceaux.",
    "Coupe le fruit de la passion en deux puis recupere la pulpe.",
    "Des fruits bien froids donnent un smoothie plus frais et plus epais.",
    "2. Mettre dans le blender",
    "Preparer la base",
    "Ajoute dans le blender la mangue, la pulpe de passion, le lait vegetal et le yaourt.",
    "Ajoute le jus de citron et quelques glacons si tu veux une version plus fraiche.",
    "3. Mixer",
    "Mixer",
    "Mixe pendant 30 a 40 secondes jusqu'a obtenir une texture homogene.",
    "Le smoothie doit etre lisse et legerement mousseux.",
    "4. Ajuster la texture",
    "Ajuster la texture",
    "Si le smoothie est trop epais, ajoute un petit filet de lait vegetal puis remixe quelques secondes.",
    "Si tu veux une texture plus milkshake, ajoute une demi-banane congelee.",
    "5. Servir",
    "Servir",
    "Verse dans un verre et ajoute, si tu veux, quelques morceaux de mangue ou des graines de chia sur le dessus.",
    "Il ne reste plus qu'a savourer !",
  ],
},
{
  id: "healthy-wrap-legumes",
  title: "Brownie salé au brocoli, feta & lardons",
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
  prepTime: "25 à 30 min",
  servings: "6 biscuits",
  image: biscuitsAvoineImg,
  ingredients: [
    "1 banane mure ecrasee",
    "100 g de flocons d'avoine",
    "50 g de chocolat noir",
    "8 a 10 noisettes entieres",
    "1 pincee de sel",
    "Optionnel mais tres bon :",
    "1 c. a cafe de miel",
    "1/2 c. a cafe de cannelle",
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
  prepTime: "5 min + 4 h au frigo",
  servings: "1 pers",
  image: puddingChiaCocoFraisesImg,
  ingredients: [
    "2 c. a soupe de graines de chia",
    "180 ml de lait de coco (ou lait de coco leger)",
    "1 c. a cafe de miel ou sirop d'erable",
    "80 g de framboises",
    "1/2 c. a cafe d'extrait de vanille",
    "Optionnel mais tres bon :",
    "1 c. a soupe de noix de coco rapee",
    "1 c. a soupe de granola",
    "quelques amandes ou pistaches",
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
  title: "Salade César healthy",
  flavor: "sale",
  prepTime: "20 à 25 min",
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
  prepTime: "10 min",
  servings: "2 pers",
  image: saladeDeFruitsAnanasImg,
  ingredients: [
    "250 g d'ananas frais",
    "100 g de framboises",
    "100 g de griottes (fraiches ou decongelees)",
    "20 g de copeaux de noix de coco",
    "Assaisonnement (secret pour une salade incroyable)",
    "1 c. a cafe de miel",
    "1 c. a cafe de jus de citron vert",
    "quelques feuilles de menthe (optionnel)",
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
  { value: "sale", label: "Salé" },
  { value: "sucre", label: "Sucré" },
]
const FLAVOR_PLACEHOLDER = "Sélectionner un type"
const PLAN_DAY_PLACEHOLDER = "Sélectionner un jour"
const PLAN_SLOT_PLACEHOLDER = "Sélectionner un moment"
type WeeklyPlan = Record<typeof dietWeekDays[number], Record<MealSlotId, string>>
type DietTab = "sweet" | "savory" | "drinks" | "condiments" | "favorites" | "custom"
const DIET_TAB_STORAGE_KEY = "dietPageActiveTab"
const DIET_TABS: DietTab[] = ["sweet", "savory", "drinks", "condiments", "favorites", "custom"]
type DietNavigationState = {
  openRecipeId?: string
  openRecipeSource?: RenderRecipe["source"]
  planDay?: typeof dietWeekDays[number]
  planSlot?: MealSlotId
}

const buildDefaultWeeklyPlan = (): WeeklyPlan => {
  const plan = {} as WeeklyPlan
  dietWeekDays.forEach((day) => {
    plan[day] = { morning: "", midday: "", evening: "" }
  })
  return plan
}

const DietClassicPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
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
  const [tab, setTab] = useState<DietTab>("savory")
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
  useEffect(() => {
    const state = location.state as DietNavigationState | null
    if (!state?.openRecipeId) return
    const recipe = allRecipes.find(
      (item) => item.id === state.openRecipeId && (!state.openRecipeSource || item.source === state.openRecipeSource),
    )
    if (!recipe) return
    setSelectedRecipe(recipe)
    if (state.planDay) {
      setPlanDay(state.planDay)
    }
    if (state.planSlot) {
      setPlanSlot(state.planSlot)
    }
    navigate(location.pathname, { replace: true, state: null })
  }, [allRecipes, location.pathname, location.state, navigate])
  const currentHeading = tab === "favorites" || tab === "custom" ? null : DIET_HEADINGS[tab]
  const getFlavorLabel = (flavor: Recipe["flavor"]) => {
    if (flavor === "sucre") return "Sucré"
    if (flavor === "sale") return "Salé"
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
            Salé
          </button>
          <button
            type="button"
            className={tab === "sweet" ? "is-active" : ""}
            onClick={() => setTab("sweet")}
          >
            Sucré
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
                    <MediaImage
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
                <p className="diet-custom-header__hint">Clique sur "Créer une recette" pour ajouter tes propres recettes en quelques secondes.</p>
              </div>
              <button type="button" className="pill pill--diet" onClick={() => setIsCreateOpen(true)} disabled={!canEdit}>
                Créer une recette
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
                        <MediaImage
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
                  <MediaImage
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
          <div className="diet-recipe-modal" role="dialog" aria-label="Créer une recette">
            <div className="diet-recipe-modal__backdrop" onClick={() => setIsCreateOpen(false)} />
            <div className="diet-recipe-modal__panel">
              {draftImage ? (
                <div className="diet-recipe-modal__cover">
                  <MediaImage
                    src={draftImage}
                    alt="Aperçu recette"
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
                    <h3>Créer une recette</h3>
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
                        Préparation
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
                      Ingrédients (1 par ligne)
                      <textarea value={draftIngredients} onChange={(event) => setDraftIngredients(event.target.value)} rows={5} />
                    </label>
                    <label>
                      Étapes (1 par ligne)
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
                  <MediaImage
                    src={editImage}
                    alt="Aperçu recette"
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
                          <option value="sale">Salé</option>
                          <option value="sucre">Sucré</option>
                        </select>
                      </label>
                      <label>
                        Préparation
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
                      Ingrédients (1 par ligne)
                      <textarea value={editIngredients} onChange={(event) => setEditIngredients(event.target.value)} rows={5} />
                    </label>
                    <label>
                      Étapes (1 par ligne)
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
                <MediaImage src={selectedRecipe.image} alt={selectedRecipe.title} className="diet-recipe-modal__image" loading="lazy" decoding="async" />
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
                        placeholder="Écris ton plat"
                      />
                    </label>
                    <button type="button" className="diet-recipe-plan__add" onClick={() => void addRecipeToPlan()} disabled={!canEdit}>
                      Ajouter au planning
                    </button>
                  </section>
                  {selectedRecipe.ingredients.length > 0 ? (
                    <section>
                      <div className="diet-recipe-section__header">
                        <h4>Ingrédients</h4>
                        <button
                          type="button"
                          className={`diet-recipe-section__toggle${isIngredientsOpen ? " is-open" : ""}`}
                          onClick={() => setIsIngredientsOpen((prev) => !prev)}
                          aria-label={isIngredientsOpen ? "Masquer les ingrédients" : "Afficher les ingrédients"}
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
                      <h4>Étapes</h4>
                      <ul className="diet-steps-list">
                        {selectedRecipe.steps.map((step, index, allSteps) => {
                          const normalizeStep = (value: string) => value.replace(/\u00A0/g, " ").trim()
                          const normalizedStep = normalizeStep(step)
                          const isLegacyCompletionLine =
                            /^Ta .+ est prete\./.test(normalizedStep) ||
                            /^Ton .+ est pret[e]?\./.test(normalizedStep) ||
                            /^Tes .+ sont pret[e]s\./.test(normalizedStep) ||
                            /^Il ne reste plus qu'a savourer\s*!$/i.test(normalizedStep) ||
                            /^Il ne reste plus qu['’]a savourer,\s*bon appetit\s*!$/i.test(normalizedStep)
                          if (isLegacyCompletionLine) return null
                          const isTipBoxTitle = /^Astuces?\s+pour/i.test(normalizedStep)
                          const isTipLineAtIndex = (targetIndex: number) => {
                            const candidate = normalizeStep(allSteps[targetIndex])
                            if (/^Astuces?\s+pour/i.test(candidate)) return true
                            if (!/^\-\s/.test(candidate)) return false
                            let previousNonSub = ""
                            for (let cursor = targetIndex - 1; cursor >= 0; cursor -= 1) {
                              const previousCandidate = normalizeStep(allSteps[cursor])
                              if (!/^\-\s/.test(previousCandidate)) {
                                previousNonSub = previousCandidate
                                break
                              }
                            }
                            return /^Astuces?\s+pour/i.test(previousNonSub)
                          }
                          const lastRenderableStepIndex = (() => {
                            for (let cursor = allSteps.length - 1; cursor >= 0; cursor -= 1) {
                              const candidate = normalizeStep(allSteps[cursor])
                              const isCompletionCandidate =
                                /^Ta .+ est prete\./.test(candidate) ||
                                /^Ton .+ est pret[e]?\./.test(candidate) ||
                                /^Tes .+ sont pret[e]s\./.test(candidate) ||
                                /^Il ne reste plus qu'a savourer\s*!$/i.test(candidate) ||
                                /^Il ne reste plus qu['’]a savourer,\s*bon appetit\s*!$/i.test(candidate)
                              if (!isCompletionCandidate && !isTipLineAtIndex(cursor)) return cursor
                            }
                            return -1
                          })()
                          const completionInsertIndex = lastRenderableStepIndex
                          const shouldInsertCompletion = index === completionInsertIndex
                          const isStepTitle = /^\d+\.\s/.test(normalizedStep)
                          const isAdviceTitle =
                            /^Conseils? pour/.test(normalizedStep) ||
                            /^Astuces? pour/.test(normalizedStep) ||
                            /^Les 3 secrets/.test(normalizedStep) ||
                            /^Les secrets/.test(normalizedStep) ||
                            /^Secrets pour/.test(normalizedStep) ||
                            /^Valeurs approximatives/.test(normalizedStep)
                          const isStepSubTitle =
                            /^(Preparer les ingredients|Preparer l'avocat|Assembler les ingredients solides|Assaisonner|Melanger delicatement|Preparer le saumon|Preparer l'ananas|Chauffer la poele|Cuire cote peau|Retourner le saumon|Verifier la cuisson|Rincer le riz|Mettre en cuisson|Porter a ebullition|Cuire a feu doux|Laisser reposer|Aerer le riz|Preparer le poulet|Preparer la marinade|Enrober le poulet|Preparer les brocolis|Cuire a l'eau|Egoutter|Ajouter les ingredients|Ajouter les ingredients liquides|Melanger et chauffer|Laisser mijoter|Ajuster la texture|Disposer le riz|Ajouter le butter chicken|Ajouter les brocolis|Porter l'eau a ebullition|Cuire les pates|Reserver un peu d'eau de cuisson|Reserver l'eau de cuisson|Cuire le poulet|Ajouter les tomates|Cuire legerement|Ajouter les pates|Incorporer la sauce|Melanger|Incorporer le fromage|Servir|Finaliser|Couper les legumes|Preparer les autres ingredients|Ecraser l'avocat|Ecraser les bananes|Preparer la base|Preparer la pate|Disposer la base|Ajouter les garnitures|Ajouter le guacamole|Preparer les pommes de terre|Cuire au four|Cuire les haricots verts|Assaisonner et cuire|Disposer dans l'assiette|Ajouter le steak|Aerer|Couper|Rincer|Couper le brocoli|Cuire|Egoutter et ajuster|Faire revenir|Melanger les liquides|Melanger les ingredients liquides|Melanger les ingredients secs|Ajouter la farine|Assaisonner et melanger|Preparer le four|Prechauffer le four|Enfourner|Laisser refroidir|Decouper|Preparer les tomates|Ajouter les fruits|Ajouter le croquant|Ajouter la noix de coco|Former les biscuits|Assembler|Ajouter la vinaigrette|Disposer la salade|Ajouter la burrata|Ajouter le jambon|Ajouter les herbes|Preparer et cuire|Parfumer|Creer la base|Rendre la sauce cremeuse|Incorporer les pates|Garnir|Rouler|Cuire le riz|Couper et assaisonner|Melanger et mariner|Preparer|Laisser mariner|Monter les brochettes|Disposer|Ajouter le poulet|Completer|Couper et laver|Chauffer|Ajouter l'ail|Ajouter les legumes|Incorporer|Cuire brievement|Mettre en place|Fouetter|Ajouter les framboises|Ajouter les toppings|Ajouter les noisettes|Ajouter le citron|Verifier|Ajouter le saumon|Refroidir et couper|Mixer|Mixer les ingredients|Empiler|Prechauffer et melanger|Faconner|Former les bouchees|Faire fondre|Tremper|Deposer|Refroidir|Preparer les dattes|Ecraser les biscuits|Former la base|Refrigerer|Etaler|Ajouter le chocolat|Laisser durcir|Laisser epaissir|Glacer)$/.test(
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
                          if (isTipBoxTitle || isTipBoxItem) return null
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
                            || /^Le smoothie doit etre cremeux, sans morceaux d'avoine visibles\.$/i.test(normalizedStep)
                            || /^Si tu le veux plus epais, ajoute quelques glacons ou un peu plus de banane\.$/i.test(normalizedStep)
                            || /^Tu peux aussi ajouter une pincee de cannelle pour renforcer le gout\.$/i.test(normalizedStep)
                            || /^Si tu veux un smoothie plus frais et epais, utilise une banane prealablement congelee\.$/i.test(normalizedStep)
                            || /^Des fruits bien froids donnent un smoothie plus frais et plus epais\.$/i.test(normalizedStep)
                            || /^La whey vanille apporte du gout et augmente l'apport en proteines\.$/i.test(normalizedStep)
                            || /^Le smoothie doit etre lisse et legerement mousseux\.$/i.test(normalizedStep)
                            || /^Si tu veux une texture plus milkshake, ajoute une demi-banane congelee\.$/i.test(normalizedStep)
                            || /^Des morceaux reguliers facilitent le mixage et donnent une texture plus homogene\.$/i.test(normalizedStep)
                            || /^Le citron apporte de la fraicheur et equilibre le gout vegetal du celeri\.$/i.test(normalizedStep)
                            || /^Si tu preferes plus de fibres, garde la pulpe\.$/i.test(normalizedStep)
                            || /^Des morceaux fins facilitent le mixage et donnent une boisson plus lisse\.$/i.test(normalizedStep)
                            || /^Le gingembre releve la boisson et apporte une note fraiche et epicee\.$/i.test(normalizedStep)
                            || /^Des tranches fines permettent une infusion plus rapide des saveurs\.$/i.test(normalizedStep)
                            || /^Cela libere les aromes sans ecraser la menthe\.$/i.test(normalizedStep)
                            || /^Idealement, laisse infuser 2 a 4 heures pour un gout plus intense\.$/i.test(normalizedStep)
                            || /^Le lait doit etre chaud, mais jamais bouillant\.$/i.test(normalizedStep)
                            || /^La mousse doit etre fine et cremeuse pour un rendu type coffee shop\.$/i.test(normalizedStep)
                            || /^Verse lentement pour garder une texture bien homogene en tasse\.$/i.test(normalizedStep)
                            || /^Tu peux aussi ajouter une pincee de cannelle ou un peu de cacao en finition\.$/i.test(normalizedStep)
                            || /^Un matcha bien tamise donne une texture plus lisse\.$/i.test(normalizedStep)
                            || /^L'eau ne doit pas etre bouillante pour eviter l'amertume\.$/i.test(normalizedStep)
                            || /^La mousse doit etre fine et cremeuse\.$/i.test(normalizedStep)
                            || /^Verse lentement pour garder une texture bien homogene\.$/i.test(normalizedStep)
                            || /^Un cafe bien concentre permet d'equilibrer la douceur du chocolat\.$/i.test(normalizedStep)
                            || /^Le lait doit etre bien chaud pour un moka onctueux\.$/i.test(normalizedStep)
                            || /^La chantilly doit rester souple et aerienne\.$/i.test(normalizedStep)
                            || /^Des morceaux reguliers facilitent le mixage\.$/i.test(normalizedStep)
                            || /^Le citron equilibre le gout terreux de la betterave\.$/i.test(normalizedStep)
                            || /^Des fruits bien murs donnent une texture plus onctueuse\.$/i.test(normalizedStep)
                            || /^Le smoothie doit etre cremeux, sans morceaux d'amandes visibles\.$/i.test(normalizedStep)
                            || /^Si tu veux une texture plus epaisse, ajoute quelques glacons supplementaires\.$/i.test(normalizedStep)
                            || /^Des ingredients bien frais donnent une boisson plus agreable\.$/i.test(normalizedStep)
                            || /^Le citron apporte de la fraicheur et releve le gout vegetal\.$/i.test(normalizedStep)
                            || /^L'eau froide aide a rendre le houmous plus leger et mousseux\.$/i.test(normalizedStep)
                            || /^Un mixage long donne une texture vraiment ultra cremeuse\.$/i.test(normalizedStep)
                            || /^C'est essentiel pour eviter un tzatziki trop liquide\.$/i.test(normalizedStep)
                            || /^Cela permet aux saveurs de bien se developper\.$/i.test(normalizedStep)
                            || /^Des morceaux reguliers permettent une sauce plus homogene\.$/i.test(normalizedStep)
                            || /^Laisse reposer quelques minutes pour que les aromes se melangent\.$/i.test(normalizedStep)
                            || /^La sauce va devenir plus claire et tres cremeuse\.$/i.test(normalizedStep)
                            || /^Si tu veux une sauce plus relevee, ajoute aussi la sriracha\.$/i.test(normalizedStep)
                            || /^Si la sauce est trop epaisse, ajoute un filet d'eau et fouette de nouveau\.$/i.test(normalizedStep)
                            || /^Des herbes bien coupees se repartissent mieux dans la sauce\.$/i.test(normalizedStep)
                            || /^Des herbes finement coupees donnent une texture plus harmonieuse\.$/i.test(normalizedStep)
                            || /^La sauce doit devenir brillante et bien liee\.$/i.test(normalizedStep)
                            || /^Les legumes doivent etre bien tendres et legerement grilles\.$/i.test(normalizedStep)
                            || /^Mixe jusqu'a obtenir une texture lisse et cremeuse\.$/i.test(normalizedStep)
                            || /^Laisse cuire environ 30 secondes pour liberer les aromes\.$/i.test(normalizedStep)
                            || /^Tu peux ajouter une noisette de beurre froid hors du feu pour une sauce plus brillante\.$/i.test(normalizedStep)
                            || /^Les rondelles fines absorbent plus vite la marinade\.$/i.test(normalizedStep)
                            || /^Ils sont encore meilleurs apres 2 a 3 heures\.$/i.test(normalizedStep)
                            || /^Des morceaux fins permettent une marinade plus rapide\.$/i.test(normalizedStep)
                            || /^Ils sont encore meilleurs le lendemain\.$/i.test(normalizedStep)
                            || /^Les batonnets restent souvent plus croquants\.$/i.test(normalizedStep)
                            || /^Elles sont encore meilleures apres 12 a 24 heures\.$/i.test(normalizedStep)
                            || /^Des fleurettes petites et regulieres marinent plus vite\.$/i.test(normalizedStep)
                            || /^Ils sont encore meilleurs apres 24 heures\.$/i.test(normalizedStep)
                            || /^Cela donne plus de gout au pesto\.$/i.test(normalizedStep)
                            || /^Continue jusqu'a obtenir une texture lisse mais legerement granuleuse\.$/i.test(normalizedStep)
                            || /^Le guacamole doit rester legerement chunky \(pas totalement lisse\)\.$/i.test(normalizedStep)
                            || /^Des morceaux reguliers permettent une cuisson plus homogene\.$/i.test(normalizedStep)
                            || /^Le chutney doit devenir epais, brillant et legerement caramelise\.$/i.test(normalizedStep)
                            || /^Le gout devient encore meilleur apres 24 heures\.$/i.test(normalizedStep)
                            || /^La chair doit etre tres tendre pour un caviar bien fondant\.$/i.test(normalizedStep)
                            || /^La texture doit etre cremeuse mais legerement rustique\.$/i.test(normalizedStep)
                            || /^Laisse reposer 30 minutes au refrigerateur pour developper les saveurs\.$/i.test(normalizedStep)
                            || /^Ne mixe pas trop pour garder une texture rustique\.$/i.test(normalizedStep)
                            || /^Goute avant d'ajouter du sel, les olives et les capres sont deja salees\.$/i.test(normalizedStep)
                            || /^Laisse reposer 30 minutes avant de servir pour developper les saveurs\.$/i.test(normalizedStep)
                            || /^La sauce doit reduire legerement\.$/i.test(normalizedStep)
                            || /^La sauce doit etre brillante et legerement sirupeuse\.$/i.test(normalizedStep)
                            || /^L'huile doit etre chaude mais pas fumante\.$/i.test(normalizedStep)
                            || /^Les piments vont crepiter legerement et liberer leurs aromes\.$/i.test(normalizedStep)
                            || /^L'huile est encore meilleure apres 12 a 24 heures\.$/i.test(normalizedStep)
                            || /^Les citrons doivent etre completement immerges\.$/i.test(normalizedStep)
                            || /^Les citrons deviennent tres tendres et parfumes\.$/i.test(normalizedStep)
                            || /^Attends au moins 3 semaines pour un gout parfait\.$/i.test(normalizedStep)
                            || /^Cela aide a carameliser les oignons\.$/i.test(normalizedStep)
                            || /^Les oignons doivent devenir tres fondants et dores\.$/i.test(normalizedStep)
                            || /^Utiliser des oignons jaunes permet une meilleure caramelisation\.$/i.test(normalizedStep)
                            || /^L'huile doit etre chaude mais ne pas fremir fortement\.$/i.test(normalizedStep)
                            || /^Les gousses doivent devenir tres tendres et legerement dorees\.$/i.test(normalizedStep)
                            || /^Utilise aussi l'huile restante pour cuire des legumes, des pates ou de la viande\.$/i.test(normalizedStep)
                          const currentStepNode = (
                            <li
                              key={`${selectedRecipe.id}-${step}`}
                              className={
                                isStepTitle || isAdviceTitle
                                  ? "diet-step-item--title"
                                  : isStepSubTitle
                                    ? "diet-step-item--subtitle"
                                    : isItalicNote
                                      ? "diet-step-item--note"
                                  : isSubItem
                                    ? "diet-step-item--sub"
                                    : isSubNoBullet
                                      ? "diet-step-item--subplain"
                                      : undefined
                              }
                            >
                              {isSubItem ? normalizedStep.replace(/^-?\s*/, "") : normalizedStep}
                            </li>
                          )
                          const completionNode = (
                            <li key={`${selectedRecipe.id}-completion`} className="diet-step-item--plain">
                              Ton {selectedRecipe.title} est pret. Il ne te reste plus qu'a deguster !
                            </li>
                          )
                          if (selectedRecipe.id === "mass-pancakes") return currentStepNode
                          if (!shouldInsertCompletion) return currentStepNode
                          return (
                            <>
                              {currentStepNode}
                              {completionNode}
                            </>
                          )
                        })}
                      </ul>
                    </section>
                  ) : null}
                  {selectedRecipe.toppings && selectedRecipe.toppings.length > 0 ? (
                    <section>
                      <h4>{"Idées de toppings (optionnel)"}</h4>
                      <ul>
                        {selectedRecipe.toppings.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                        {selectedRecipe.id === "mass-pancakes" ? (
                          <li className="diet-step-item--plain">
                            Ton {selectedRecipe.title} est pret. Il ne te reste plus qu'a deguster !
                          </li>
                        ) : null}
                      </ul>
                    </section>
                  ) : null}
                  {(() => {
                    const normalizeStep = (value: string) => value.replace(/\u00A0/g, " ").trim()
                    const tipsFromSteps = selectedRecipe.steps.reduce<string[]>((acc, step, index, allSteps) => {
                      const normalizedStep = normalizeStep(step)
                      if (!/^\-\s/.test(normalizedStep)) return acc
                      let previousNonSubStep = ""
                      for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
                        const candidate = normalizeStep(allSteps[cursor])
                        if (!/^\-\s/.test(candidate)) {
                          previousNonSubStep = candidate
                          break
                        }
                      }
                      if (!/^Astuces?\s+pour/i.test(previousNonSubStep)) return acc
                      acc.push(normalizedStep.replace(/^-+\s*/, ""))
                      return acc
                    }, [])
                    const tipsFromRecipe = (selectedRecipe.tips ?? []).map((item) => item.trim()).filter(Boolean)
                    const allTips = Array.from(new Set([...tipsFromSteps, ...tipsFromRecipe]))
                    if (!allTips.length) return null
                    return (
                      <section className="diet-recipe-tips-box">
                        <h4>Astuces pour que la recette soit meilleure</h4>
                        <ul>
                          {allTips.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    )
                  })()}
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












