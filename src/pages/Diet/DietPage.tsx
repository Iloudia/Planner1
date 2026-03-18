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
    "Dans un bol, casse l'Ãƒâ€¦Ã¢â‚¬Å“uf et fouette-le lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement.",
    "Ajoute le lait et le fromage blanc, puis mÃƒÆ’Ã‚Â©lange jusqu'ÃƒÆ’Ã‚Â  obtenir une texture lisse.",
    "Incorpore la farine, la whey et la levure chimique.",
    "MÃƒÆ’Ã‚Â©lange soigneusement pour ÃƒÆ’Ã‚Â©viter les grumeaux.",
    "Ajoute les gouttes de vanille et mÃƒÆ’Ã‚Â©lange une derniÃƒÆ’Ã‚Â¨re fois. La pÃƒÆ’Ã‚Â¢te doit ÃƒÆ’Ã‚Âªtre ÃƒÆ’Ã‚Â©paisse mais fluide.",
    "Fais chauffer une poÃƒÆ’Ã‚Âªle antiadhÃƒÆ’Ã‚Â©sive ÃƒÆ’Ã‚Â  feu moyen (lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement graissÃƒÆ’Ã‚Â©e si nÃƒÆ’Ã‚Â©cessaire).",
    "Verse de petites portions de pÃƒÆ’Ã‚Â¢te pour former les pancakes.",
    "Laisse cuire 1 ÃƒÆ’Ã‚Â  2 minutes, jusqu'ÃƒÆ’Ã‚Â  ce que des bulles apparaissent, puis retourne.",
    "Poursuis la cuisson 1 minute de l'autre cÃƒÆ’Ã‚Â´tÃƒÆ’Ã‚Â©.",
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
    "Preparer la pate",
    "Dans un grand bol, melange le beurre mou, le sucre blanc et le sucre roux jusqu'a obtenir une texture cremeuse.",
    "Ajoute l'oeuf et l'extrait de vanille.",
    "Melange jusqu'a obtenir une pate homogene.",
    "Ajouter les ingredients secs",
    "Ajoute dans la preparation la farine, le bicarbonate et la pincee de sel.",
    "Melange jusqu'a obtenir une pate a cookies.",
    "Ajouter le chocolat",
    "Incorpore les morceaux ou pepites de chocolat dans la pate.",
    "Former les cookies",
    "Prechauffe le four a 180 C.",
    "Forme des boules de pate et depose-les sur une plaque recouverte de papier cuisson en les espacant.",
    "Cuisson",
    "Fais cuire 10 a 12 minutes.",
    "Les cookies doivent etre dores sur les bords mais encore legerement mous au centre.",
    "Ajouter la fleur de sel",
    "A la sortie du four, saupoudre legerement chaque cookie avec un peu de fleur de sel.",
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
    "Preparer le melange framboises",
    "Dans un bol, ajoute les framboises et verse le yaourt nature.",
    "Melange delicatement pour enrober les framboises sans trop les ecraser.",
    "Former les bouchees",
    "Sur une plaque recouverte de papier cuisson, depose des petits tas du melange framboises-yaourt a l'aide d'une cuillere.",
    "Place ensuite la plaque au congelateur pendant environ 1 heure, jusqu'a ce que les bouchees soient bien fermes.",
    "Faire fondre le chocolat",
    "Fais fondre le chocolat au bain-marie ou au micro-ondes en melangeant regulierement.",
    "Ajoute l'huile de coco si tu en utilises.",
    "Enrober les bouchees",
    "Sors les bouchees du congelateur.",
    "A l'aide d'une cuillere ou d'une fourchette, trempe chaque bouchee dans le chocolat fondu pour bien les enrober.",
    "Refroidir",
    "Depose-les a nouveau sur le papier cuisson.",
    "Laisse le chocolat durcir 10 a 15 minutes au refrigerateur.",
    "Deguster",
    "Tes framboises chocolat-yaourt sont pretes : croquantes a l'exterieur et fraiches a l'interieur.",
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
    "Preparer les dattes",
    "Coupe les dattes dans la longueur.",
    "Retire le noyau si necessaire.",
    "Garnir les dattes",
    "A l'aide d'une petite cuillere, ajoute un peu de beurre de cacahuete au centre de chaque datte.",
    "Referme legerement la datte pour maintenir la garniture.",
    "Ajouter le chocolat (optionnel)",
    "Fais fondre le chocolat noir.",
    "Verse un petit filet de chocolat fondu sur les dattes.",
    "Finition",
    "Ajoute une pincee de fleur de sel sur le dessus pour relever les saveurs.",
    "Deguster",
    "Laisse le chocolat durcir quelques minutes puis deguste.",
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
    "Prechauffer le four",
    "Prechauffe le four a 180 C.",
    "Beurre ou chemise un moule a gateau.",
    "Preparer la pate",
    "Dans un grand bol, fouette les oeufs avec le sucre.",
    "Ajoute l'huile et melange.",
    "Incorpore les carottes rapees.",
    "Ajouter les ingredients secs",
    "Ajoute la farine, la levure, le bicarbonate, la cannelle et le sel.",
    "Melange jusqu'a obtenir une pate homogene.",
    "Ajoute les noix si tu en utilises.",
    "Cuisson",
    "Verse la pate dans le moule.",
    "Fais cuire 35 a 40 minutes jusqu'a ce que le gateau soit bien dore.",
    "Laisse refroidir completement.",
    "Preparer le glacage",
    "Dans un bol, melange le cream cheese, le beurre mou et le sucre glace.",
    "Ajoute la vanille.",
    "Fouette jusqu'a obtenir une creme lisse.",
    "Dressage",
    "Etale le glacage sur le carrot cake refroidi.",
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
    "Preparer la base biscuit",
    "Ecrase les biscuits jusqu'a obtenir une texture sableuse.",
    "Dans un bol, melange les biscuits ecrases avec le beurre fondu.",
    "Tasse bien ce melange dans un moule recouvert de papier cuisson pour former la base.",
    "Place 15 minutes au refrigerateur.",
    "Preparer la couche caramel cacahuete",
    "Dans un bol, melange le caramel avec le beurre de cacahuete jusqu'a obtenir une texture bien lisse.",
    "Etale cette preparation sur la base biscuit refroidie.",
    "Remets 30 minutes au frigo pour que la couche se raffermisse.",
    "Ajouter le chocolat",
    "Fais fondre le chocolat noir au bain-marie ou au micro-ondes.",
    "Verse le chocolat fondu sur la couche caramel et etale bien.",
    "Repos",
    "Place au refrigerateur 1 heure pour que le chocolat durcisse.",
    "Decoupe",
    "Sors la plaque et coupe en petits carres.",
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
    "Prechauffer le four",
    "Prechauffe le four a 180 C.",
    "Tapisse un petit moule carre de papier cuisson.",
    "Preparer la pate",
    "Dans un bol, ecrase les bananes a la fourchette.",
    "Ajoute les oeufs et le sirop d'erable.",
    "Melange bien jusqu'a obtenir une preparation lisse.",
    "Ajouter les ingredients secs",
    "Ajoute les flocons d'avoine, le bicarbonate et la cannelle.",
    "Melange bien.",
    "Ajouter le chocolat",
    "Incorpore les pepites de chocolat dans la pate.",
    "Cuisson",
    "Verse la preparation dans le moule et etale uniformement.",
    "Fais cuire 20 a 25 minutes jusqu'a ce que le dessus soit legerement dore.",
    "Refroidir et couper",
    "Laisse refroidir puis coupe en barres ou en carres.",
    "Astuce : ajoute une cuillere de beurre de cacahuete dans la pate pour des barres encore plus gourmandes.",
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
    "Pour le saumon marinÃƒÆ’Ã‚Â©",
    "500 g de saumon sans peau",
    "1/4 de tasse de sauce soja",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de vinaigre de riz",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile de sÃƒÆ’Ã‚Â©same",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de miel",
    "2 gousses dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail hachÃƒÆ’Ã‚Â©es",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de pÃƒÆ’Ã‚Â¢te de gingembre",
    "2 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  soupe de sriracha",
    "Pour la sauce",
    "2 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  soupe de yaourt grec",
    "2 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de sriracha",
    "2 cuillÃƒÆ’Ã‚Â¨res ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de vinaigre de riz",
    "Pour les accompagnements",
    "70 g de riz cru",
    "1 mini concombre",
    "Carottes rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©es (quantitÃƒÆ’Ã‚Â© selon prÃƒÆ’Ã‚Â©fÃƒÆ’Ã‚Â©rence)",
    "1/2 avocat",
  ],
  steps: [
    "PrÃƒÆ’Ã‚Â©parer la marinade",
    "Dans un bol, mÃƒÆ’Ã‚Â©lange la sauce soja, le vinaigre de riz, l'huile de sÃƒÆ’Ã‚Â©same, le miel, l'ail hachÃƒÆ’Ã‚Â©, la pÃƒÆ’Ã‚Â¢te de gingembre et la sriracha jusqu'ÃƒÆ’Ã‚Â  obtenir une marinade homogÃƒÆ’Ã‚Â¨ne.",
    "Mariner le saumon",
    "Coupe le saumon en pavÃƒÆ’Ã‚Â©s ou en cubes. DÃƒÆ’Ã‚Â©pose-le dans un plat, verse la marinade, mÃƒÆ’Ã‚Â©lange dÃƒÆ’Ã‚Â©licatement pour bien enrober le poisson. Couvre et laisse mariner 15 ÃƒÆ’Ã‚Â  30 minutes au rÃƒÆ’Ã‚Â©frigÃƒÆ’Ã‚Â©rateur.",
    "PrÃƒÆ’Ã‚Â©parer les accompagnements",
    "Lave le mini concombre et coupe-le en fines rondelles ou demi-lunes. RÃƒÆ’Ã‚Â¢pe les carottes. Coupe le demi-avocat en tranches ou en dÃƒÆ’Ã‚Â©s. RÃƒÆ’Ã‚Â©serve au frais.",
    "PrÃƒÆ’Ã‚Â©parer la sauce",
    "Dans un petit bol, mÃƒÆ’Ã‚Â©lange le yaourt grec, la sriracha et le vinaigre de riz jusqu'ÃƒÆ’Ã‚Â  obtenir une sauce lisse. RÃƒÆ’Ã‚Â©serve au frais.",
    "Cuire le saumon",
    "Fais chauffer une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. DÃƒÆ’Ã‚Â©pose le saumon avec un peu de marinade et fais-le cuire 2 ÃƒÆ’Ã‚Â  3 minutes par face, jusqu'ÃƒÆ’Ã‚Â  ce qu'il soit bien dorÃƒÆ’Ã‚Â© et cuit ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur.",
    "Dressage",
    "Dispose le saumon dans l'assiette ou le bol, ajoute les carottes rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©es, le concombre et l'avocat, puis nappe ou accompagne avec la sauce au yaourt ÃƒÆ’Ã‚Â©picÃƒÆ’Ã‚Â©e.",
  ],
},
{
  id: "mass-bagel-saumon",
  title: "Bagel saumon & cream cheese avocat",
  flavor: "sale",
  prepTime: "15 a 20 min",
  servings: "2 pers",
  image: bagelSaumonImg,
  ingredients: [
    "Pour les bagels",
    "2 bagels nature ou sesame",
    "Pour la cream cheese a l'avocat",
    "120 g de cream cheese",
    "1/2 avocat bien mur",
    "1 cuillere a soupe d'aneth frais cisele",
    "1 pincee de poivre noir",
    "Pour la garniture",
    "120 g de saumon fume",
    "1/4 d'oignon rouge",
    "1 cuillere a soupe d'aneth frais",
    "Poivre noir (selon gout)",
  ],
  steps: [
    "Preparer la cream cheese a l'avocat",
    "Dans un bol, ecrase l'avocat a la fourchette jusqu'a obtenir une texture lisse mais legerement cremeuse.",
    "Ajoute la cream cheese, l'aneth cisele et une pincee de poivre noir.",
    "Melange bien jusqu'a obtenir une preparation homogene.",
    "Preparer les ingredients",
    "Epluche l'oignon rouge et coupe-le en tres fines rondelles.",
    "Si le gout est trop fort, laisse-les tremper 5 minutes dans de l'eau froide puis egoutte-les.",
    "Preparer les bagels",
    "Coupe les bagels en deux.",
    "Fais-les legerement toaster au grille-pain ou a la poele pour qu'ils soient legerement croustillants.",
    "Monter le bagel",
    "Etale genereusement la cream cheese a l'avocat sur la base du bagel.",
    "Ajoute les tranches de saumon fume.",
    "Dispose ensuite les rondelles d'oignon rouge.",
    "Ajoute un peu d'aneth frais et un tour de poivre noir.",
    "Dressage",
    "Referme le bagel avec la partie superieure.",
    "Coupe-le en deux si tu le souhaites et sers immediatement.",
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
    "Cuire le riz",
    "Fais cuire le riz blanc dans une casserole d'eau salee selon le temps indique sur le paquet (environ 10 a 12 minutes).",
    "Egoutte et reserve.",
    "Preparer la salsa",
    "Coupe l'avocat en petits des.",
    "Coupe la tomate en petits morceaux.",
    "Dans un bol, melange l'avocat, la tomate, le jus de citron, la coriandre ou le persil, une pincee de sel et de poivre.",
    "Melange delicatement et reserve au frais.",
    "Cuire le saumon",
    "Fais chauffer l'huile d'olive dans une poele a feu moyen.",
    "Depose les paves de saumon cote peau. Sale et poivre.",
    "Fais cuire 3 a 4 minutes par cote jusqu'a ce qu'il soit bien dore et fondant a l'interieur.",
    "Dressage",
    "Dans une assiette, dispose le riz blanc.",
    "Ajoute le pave de saumon grille.",
    "Depose la salsa tomate-avocat sur le dessus ou a cote.",
    "Astuce : ajoute un peu de zeste de citron dans la salsa pour un gout encore plus frais.",
  ],
},
{
  id: "mass-salade-pasteque-feta",
  title: "Salade pasteque & feta",
  flavor: "sale",
  prepTime: "10 min",
  servings: "2 pers",
  image: saladePastequeFetaImg,
  ingredients: [
    "Pour la salade",
    "300 g de pasteque",
    "120 g de feta",
    "1 petite poignee de menthe fraiche",
    "Pour l'assaisonnement",
    "1 cuillere a soupe d'huile d'olive",
    "Poivre noir",
    "Optionnel",
    "1/2 citron vert (jus)",
  ],
  steps: [
    "Preparer la pasteque",
    "Coupe la pasteque en gros cubes et retire les graines si necessaire.",
    "Ajouter la feta",
    "Coupe la feta en cubes ou emiette-la directement sur la pasteque.",
    "Ajouter la menthe",
    "Cisele ou dechire legerement les feuilles de menthe et ajoute-les dans la salade.",
    "Assaisonner",
    "Verse l'huile d'olive sur la salade.",
    "Ajoute un peu de poivre noir et un filet de citron vert si tu le souhaites.",
    "Melanger et servir",
    "Melange delicatement et sers bien frais.",
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
    "Preparer les legumes",
    "Lave le concombre et coupe-le en rondelles ou en demi-rondelles.",
    "Coupe les tomates cerises en deux.",
    "Emince l'oignon rouge en fines lamelles.",
    "Assembler la salade",
    "Dans un grand bol ou une assiette, ajoute le concombre, les tomates cerises, les olives et l'oignon rouge.",
    "Ajouter la feta",
    "Coupe la feta en cubes ou emiette-la sur la salade.",
    "Assaisonner",
    "Verse l'huile d'olive sur la salade.",
    "Ajoute l'origan et un peu de poivre noir.",
    "Melanger et servir",
    "Melange delicatement et sers bien frais.",
    "Astuce grecque : ajoute un petit filet de citron pour encore plus de fraicheur.",
  ],
},
{
  id: "mass-wrap-poulet",
  title: "Wrap poulet croquant",
  flavor: "sale",
  prepTime: "30 ÃƒÆ’Ã‚Â  45 min",
  servings: "1 pers",
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
    "  PrÃƒÆ’Ã‚Â©parer la marinade du poulet",
    "Dans un grand bol, mÃƒÆ’Ã‚Â©lange : lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail hachÃƒÆ’Ã‚Â©, lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢origan, le paprika, la poudre dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon, les flocons de piment, le sel et le poivre. Ajoute le jus de citron, puis mÃƒÆ’Ã‚Â©lange. Incorpore les laniÃƒÆ’Ã‚Â¨res de poulet et mÃƒÆ’Ã‚Â©lange bien pour les enrober. Laisse mariner au minimum 15 minutes (idÃƒÆ’Ã‚Â©alement 30 minutes).",
    "PrÃƒÆ’Ã‚Â©parer la sauce",
    "Dans un bol, mÃƒÆ’Ã‚Â©lange : le yaourt ÃƒÆ’Ã‚Â©crÃƒÆ’Ã‚Â©mÃƒÆ’Ã‚Â©, la sriracha, lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail ÃƒÆ’Ã‚Â©mincÃƒÆ’Ã‚Â©, le persil, le sel et le poivre. Ajoute un peu de jus de citron selon ton goÃƒÆ’Ã‚Â»t. MÃƒÆ’Ã‚Â©lange jusqu'ÃƒÆ’Ã‚Â  obtenir une sauce homogÃƒÆ’Ã‚Â¨ne. RÃƒÆ’Ã‚Â©serve au frais.",
    "PrÃƒÆ’Ã‚Â©parer les garnitures",
    "Lave et coupe la laitue. ÃƒÆ’Ã¢â‚¬Â°mince finement lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge. Coupe les tomates en petits dÃƒÆ’Ã‚Â©s. RÃƒÆ’Ã‚Â©serve lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ensemble.",
    "Cuire le poulet",
    "Fais chauffer une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. Ajoute le poulet marinÃƒÆ’Ã‚Â© (sans ajouter de matiÃƒÆ’Ã‚Â¨re grasse si la poÃƒÆ’Ã‚Âªle est antiadhÃƒÆ’Ã‚Â©sive). Fais cuire 5 ÃƒÆ’Ã‚Â  7 minutes, en remuant rÃƒÆ’Ã‚Â©guliÃƒÆ’Ã‚Â¨rement, jusqu'ÃƒÆ’Ã‚Â  ce que le poulet soit bien dorÃƒÆ’Ã‚Â© et cuit ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur.",
    "Monter les wraps",
    "Fais lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement chauffer les tortillas. DÃƒÆ’Ã‚Â©pose : de la laitue, du poulet chaud, des tomates, de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge. Ajoute la sauce selon ton goÃƒÆ’Ã‚Â»t. Roule les wraps bien serrÃƒÆ’Ã‚Â©s.",
  ],
},
{
  id: "mass-omelette-power",
  title: "Omelette power ÃƒÆ’Ã‚Â  la feta",
  flavor: "sale",
  prepTime: "15 ÃƒÆ’Ã‚Â  20 min",
  servings: "1 pers",
  image: omeletteFetaImg,
  ingredients: [
    "3 Ãƒâ€¦Ã¢â‚¬Å“ufs",
    "50 g de feta ÃƒÆ’Ã‚Â©miettÃƒÆ’Ã‚Â©e",
    "100 g dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©pinards frais",
    "Huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1 petit oignon",
    "Sel et poivre",
  ],
  steps: [
    "  PrÃƒÆ’Ã‚Â©parer les ingrÃƒÆ’Ã‚Â©dients",
    "ÃƒÆ’Ã¢â‚¬Â°pluche et ÃƒÆ’Ã‚Â©mince finement lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon. ÃƒÆ’Ã¢â‚¬Â°pluche et hache lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail. Lave les ÃƒÆ’Ã‚Â©pinards et ÃƒÆ’Ã‚Â©goutte-les.",
    "Cuire les lÃƒÆ’Ã‚Â©gumes",
    "Fais chauffer un filet dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive dans une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon et fais-le revenir 2 ÃƒÆ’Ã‚Â  3 minutes jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit translucide. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail et fais revenir encore 30 secondes. Incorpore les ÃƒÆ’Ã‚Â©pinards et laisse-les tomber 1 ÃƒÆ’Ã‚Â  2 minutes, jusqu'ÃƒÆ’Ã‚Â  rÃƒÆ’Ã‚Â©duction.",
    "PrÃƒÆ’Ã‚Â©parer les Ãƒâ€¦Ã¢â‚¬Å“ufs",
    "Dans un bol, bats les Ãƒâ€¦Ã¢â‚¬Å“ufs avec le sel et le poivre.",
    "Cuire lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢omelette",
    "Verse les Ãƒâ€¦Ã¢â‚¬Å“ufs battus dans la poÃƒÆ’Ã‚Âªle sur les lÃƒÆ’Ã‚Â©gumes. Laisse cuire ÃƒÆ’Ã‚Â  feu doux quelques minutes, jusqu'ÃƒÆ’Ã‚Â  ce que les bords commencent ÃƒÆ’Ã‚Â  prendre.",
    "Ajouter la feta",
    "RÃƒÆ’Ã‚Â©partis la feta ÃƒÆ’Ã‚Â©miettÃƒÆ’Ã‚Â©e sur lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢omelette. Poursuis la cuisson doucement jusqu'ÃƒÆ’Ã‚Â  ce que lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢omelette soit cuite ÃƒÆ’Ã‚Â  ton goÃƒÆ’Ã‚Â»t.",
    "Servir",
    "Plie lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢omelette en deux et sers immÃƒÆ’Ã‚Â©diatement.",
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
    "  Cuire les pÃƒÆ’Ã‚Â¢tes",
    "Fais cuire les pÃƒÆ’Ã‚Â¢tes dans une grande casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte-les en conservant un peu dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau de cuisson.",
    "PrÃƒÆ’Ã‚Â©parer le poulet",
    "Coupe le poulet en morceaux ou en laniÃƒÆ’Ã‚Â¨res. Fais chauffer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive dans une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. Ajoute le poulet, sale, poivre et fais cuire 5 ÃƒÆ’Ã‚Â  7 minutes jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit bien dorÃƒÆ’Ã‚Â© et cuit ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur. RÃƒÆ’Ã‚Â©serve.",
    "Cuire les champignons",
    "Dans la mÃƒÆ’Ã‚Âªme poÃƒÆ’Ã‚Âªle, ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail hachÃƒÆ’Ã‚Â© et fais revenir 30 secondes. Ajoute les champignons ÃƒÆ’Ã‚Â©mincÃƒÆ’Ã‚Â©s et fais-les cuire 5 minutes, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ils rendent leur eau et dorent lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement.",
    "PrÃƒÆ’Ã‚Â©parer la sauce Alfredo protÃƒÆ’Ã‚Â©inÃƒÆ’Ã‚Â©e",
    "Baisse le feu. Ajoute le fromage blanc (ou yaourt grec) et mÃƒÆ’Ã‚Â©lange doucement. Incorpore le parmesan et mÃƒÆ’Ã‚Â©lange jusqu'ÃƒÆ’Ã‚Â  obtenir une sauce crÃƒÆ’Ã‚Â©meuse. Ajoute un peu dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau de cuisson des pÃƒÆ’Ã‚Â¢tes si nÃƒÆ’Ã‚Â©cessaire pour dÃƒÆ’Ã‚Â©tendre la sauce.",
    "Assembler",
    "Ajoute les pÃƒÆ’Ã‚Â¢tes ÃƒÆ’Ã‚Â©gouttÃƒÆ’Ã‚Â©es dans la poÃƒÆ’Ã‚Âªle. Incorpore le poulet. MÃƒÆ’Ã‚Â©lange bien pour enrober les pÃƒÆ’Ã‚Â¢tes de sauce.",
    "Ajuster et servir",
    "Rectifie lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assaisonnement (sel, poivre). Ajoute des herbes si souhaitÃƒÆ’Ã‚Â© et sers immÃƒÆ’Ã‚Â©diatement.",
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
    "Cuire les pates",
    "Fais bouillir une grande casserole d'eau salee.",
    "Ajoute les pates et cuis-les selon le temps indique sur le paquet (generalement 9 a 11 minutes).",
    "Avant d'egoutter, garde un petit verre d'eau de cuisson.",
    "Cuire le poulet",
    "Coupe les blancs de poulet en morceaux ou lamelles.",
    "Dans une poele, chauffe l'huile d'olive a feu moyen.",
    "Ajoute le poulet, sale et poivre.",
    "Fais cuire 5 a 7 minutes jusqu'a ce qu'il soit bien dore.",
    "Preparer les tomates",
    "Coupe les tomates cerises en deux.",
    "Ajoute-les dans la poele avec le poulet et laisse cuire 1 a 2 minutes pour les attendrir legerement.",
    "Preparer la sauce pesto",
    "Dans la poele a feu doux, ajoute le pesto.",
    "Verse 2 a 3 cuilleres d'eau de cuisson des pates.",
    "Ajoute le parmesan rape.",
    "Melange pour obtenir une sauce cremeuse et bien liee.",
    "Melanger les pates",
    "Ajoute les pates egouttees directement dans la poele.",
    "Melange bien pour que la sauce enrobe toutes les pates.",
    "Dressage",
    "Sers les pates dans une assiette.",
    "Ajoute des copeaux de parmesan, un peu de poivre noir et eventuellement quelques feuilles de basilic.",
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
    "Preparer les tomates",
    "Lave les tomates cerises.",
    "Coupe-les en deux et depose-les dans une assiette ou un plat.",
    "Ajouter la burrata",
    "Depose la burrata au centre de l'assiette sur les tomates.",
    "Ajouter le jambon",
    "Dispose les tranches de jambon sec autour ou legerement dechirees sur la salade.",
    "Ajouter le basilic",
    "Ajoute les feuilles de basilic frais sur la burrata et les tomates.",
    "Assaisonner",
    "Verse l'huile d'olive sur l'ensemble de la salade.",
    "Ajoute un peu de poivre noir et eventuellement une petite pincee de sel.",
    "Dressage",
    "Pour servir, ouvre legerement la burrata afin que le coeur cremeux se melange avec les tomates et l'huile d'olive.",
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
    "Preparer la focaccia",
    "Coupe la focaccia en deux dans l'epaisseur pour obtenir une base et un couvercle.",
    "Si tu veux plus de croustillant, fais-la rechauffer 3 a 4 minutes au four a 180 C.",
    "Ajouter la burrata",
    "Depose la burrata sur la base de la focaccia.",
    "Ouvre-la legerement pour que la partie cremeuse s'etale un peu sur le pain.",
    "Ajouter la mortadelle",
    "Dispose les tranches de mortadelle pliees legerement pour donner du volume au sandwich.",
    "Ajouter la roquette",
    "Ajoute une poignee de roquette sur le dessus.",
    "Verse un filet d'huile d'olive et ajoute un peu de poivre noir.",
    "Fermer et servir",
    "Referme la focaccia avec la partie superieure.",
    "Coupe le sandwich en deux ou en parts.",
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
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "Cuire les brocolis",
    "Fais cuire les brocolis ÃƒÆ’Ã‚Â  la vapeur ou dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e pendant 5 ÃƒÆ’Ã‚Â  7 minutes, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ils soient tendres mais encore verts. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "PrÃƒÆ’Ã‚Â©parer le poulet",
    "Coupe le poulet en morceaux. Fais chauffer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive dans une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. Ajoute le poulet, sale, poivre et fais cuire 5 ÃƒÆ’Ã‚Â  6 minutes jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit bien dorÃƒÆ’Ã‚Â© et cuit ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur. RÃƒÆ’Ã‚Â©serve.",
    "PrÃƒÆ’Ã‚Â©parer la sauce",
    "Dans un bol, mÃƒÆ’Ã‚Â©lange : le yaourt grec, le concentrÃƒÆ’Ã‚Â© de tomate, lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail hachÃƒÆ’Ã‚Â©, le gingembre, le garam masala, le paprika, le curry, le sel et le poivre.",
    "Assembler le butter chicken",
    "Baisse le feu. Remets le poulet dans la poÃƒÆ’Ã‚Âªle. Ajoute la sauce et mÃƒÆ’Ã‚Â©lange dÃƒÆ’Ã‚Â©licatement. Laisse mijoter 3 ÃƒÆ’Ã‚Â  5 minutes ÃƒÆ’Ã‚Â  feu doux, sans faire bouillir, jusqu'ÃƒÆ’Ã‚Â  obtenir une sauce crÃƒÆ’Ã‚Â©meuse.",
    "Servir",
    "Dispose le riz dans lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assiette. Ajoute le butter chicken crÃƒÆ’Ã‚Â©meux. Accompagne de brocolis.",
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
    "  PrÃƒÆ’Ã‚Â©parer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat",
    "Coupe lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat en deux, retire le noyau et rÃƒÆ’Ã‚Â©cupÃƒÆ’Ã‚Â¨re la chair. ÃƒÆ’Ã¢â‚¬Â°crase-la ÃƒÆ’Ã‚Â  la fourchette dans un bol. Assaisonne avec le sel, le poivre et un filet de jus de citron si souhaitÃƒÆ’Ã‚Â©.",
    "Griller le pain",
    "Fais griller les tranches de pain jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢elles soient bien dorÃƒÆ’Ã‚Â©es et croustillantes.",
    "Cuire lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf",
    "Fais chauffer une petite poÃƒÆ’Ã‚Âªle avec un filet dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive. Casse lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf et fais-le cuire selon ta prÃƒÆ’Ã‚Â©fÃƒÆ’Ã‚Â©rence : Ãƒâ€¦Ã¢â‚¬Å“uf au plat (jaune coulant) ou Ãƒâ€¦Ã¢â‚¬Å“uf mollet / pochÃƒÆ’Ã‚Â©. Sale et poivre lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement.",
    "Monter lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocado toast",
    "ÃƒÆ’Ã¢â‚¬Â°tale lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat ÃƒÆ’Ã‚Â©crasÃƒÆ’Ã‚Â© sur les tranches de pain chaud. DÃƒÆ’Ã‚Â©pose lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf par-dessus.",
    "Finaliser",
    "Ajoute un peu de poivre, des flocons de piment ou du paprika si souhaitÃƒÆ’Ã‚Â©. Sers immÃƒÆ’Ã‚Â©diatement.",
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
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "PrÃƒÆ’Ã‚Â©parer la base du curry",
    "ÃƒÆ’Ã¢â‚¬Â°mince lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon et hache lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail. Fais chauffer une poÃƒÆ’Ã‚Âªle ou une casserole ÃƒÆ’Ã‚Â  feu moyen. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon et fais-le revenir 2 ÃƒÆ’Ã‚Â  3 minutes jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit translucide. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail et fais revenir 30 secondes.",
    "Ajouter les ÃƒÆ’Ã‚Â©pices et le concentrÃƒÆ’Ã‚Â© de tomate",
    "Ajoute le curry, le paprika et le concentrÃƒÆ’Ã‚Â© de tomate. MÃƒÆ’Ã‚Â©lange et laisse cuire 1 minute pour dÃƒÆ’Ã‚Â©velopper les arÃƒÆ’Ã‚Â´mes.",
    "Ajouter les pois chiches et le lait de coco",
    "Ajoute les pois chiches ÃƒÆ’Ã‚Â©gouttÃƒÆ’Ã‚Â©s et mÃƒÆ’Ã‚Â©lange. Verse le lait de coco, sale et poivre. Laisse mijoter 10 minutes ÃƒÆ’Ã‚Â  feu doux, en remuant de temps en temps.",
    "Finaliser",
    "GoÃƒÆ’Ã‚Â»te et rectifie lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assaisonnement. Ajoute le persil ciselÃƒÆ’Ã‚Â© hors du feu.",
    "Servir",
    "Sers le curry coco bien chaud avec le riz.",
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
    "  PrÃƒÆ’Ã‚Â©parer les pommes de terre",
    "ÃƒÆ’Ã¢â‚¬Â°pluche les pommes de terre et coupe-les en morceaux. Fais-les cuire dans une casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e pendant 15 ÃƒÆ’Ã‚Â  20 minutes, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢elles soient tendres. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "Cuire les haricots verts",
    "Fais cuire les haricots verts dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e ou ÃƒÆ’Ã‚Â  la vapeur pendant 8 ÃƒÆ’Ã‚Â  10 minutes. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "Cuire le steak hachÃƒÆ’Ã‚Â©",
    "Fais chauffer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive dans une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail hachÃƒÆ’Ã‚Â© si utilisÃƒÆ’Ã‚Â©, puis le steak hachÃƒÆ’Ã‚Â©. Sale et poivre. Fais cuire 3 ÃƒÆ’Ã‚Â  5 minutes par face selon la cuisson souhaitÃƒÆ’Ã‚Â©e.",
    "Assembler lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assiette",
    "Dispose les pommes de terre dans lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assiette. Ajoute le steak hachÃƒÆ’Ã‚Â© et les haricots verts. Parseme de persil ou dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢herbes si souhaitÃƒÆ’Ã‚Â©.",
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
    "  PrÃƒÆ’Ã‚Â©parer la whey",
    "Dans un bol ou un shaker, mÃƒÆ’Ã‚Â©lange la whey avec le lait dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amande jusqu'ÃƒÆ’Ã‚Â  obtenir une texture bien lisse, sans grumeaux.",
    "PrÃƒÆ’Ã‚Â©parer la base",
    "Dans un bocal ou un bol, ajoute : les flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine, les graines de chia, le yaourt. MÃƒÆ’Ã‚Â©lange lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement.",
    "Ajouter la whey",
    "Verse le mÃƒÆ’Ã‚Â©lange whey + lait dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢amande dans le bocal. MÃƒÆ’Ã‚Â©lange bien pour que tous les ingrÃƒÆ’Ã‚Â©dients soient homogÃƒÆ’Ã‚Â¨nes.",
    "Ajouter les fruits",
    "Ajoute les framboises et mÃƒÆ’Ã‚Â©lange dÃƒÆ’Ã‚Â©licatement ou laisse-les sur le dessus selon ta prÃƒÆ’Ã‚Â©fÃƒÆ’Ã‚Â©rence.",
    "Repos",
    "Couvre et place au rÃƒÆ’Ã‚Â©frigÃƒÆ’Ã‚Â©rateur pendant au minimum 4 heures, idÃƒÆ’Ã‚Â©alement toute la nuit.",
    "Finaliser",
    "Au moment de servir, ajoute la pÃƒÆ’Ã‚Â¢te ÃƒÆ’Ã‚Â  tartiner Biscoff sur le dessus.",
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
    "PrÃƒÆ’Ã‚Â©chauffer votre four ÃƒÆ’Ã‚Â  180Ãƒâ€šÃ‚Â°C.",
    "Dans un saladier, monter les blancs de deux Ãƒâ€¦Ã¢â‚¬Å“ufs en neige.",
    "Dans un autre saladier, verser la farine, la protÃƒÆ’Ã‚Â©ine, le cacao en poudre (ou le chocolat prÃƒÆ’Ã‚Â©alablement fondu), le sucre, la compote et 1 Ãƒâ€¦Ã¢â‚¬Å“uf entier. MÃƒÆ’Ã‚Â©langer pour obtenir une pÃƒÆ’Ã‚Â¢te bien lisse et homogÃƒÆ’Ã‚Â¨ne. Ajouter 1 pincÃƒÆ’Ã‚Â©e de sel.",
    "Incorporer les blancs en neige avec une spatule sans les casser.",
    "Verser la prÃƒÆ’Ã‚Â©paration dans un moule rectangulaire ÃƒÆ’Ã‚Â  brownie et faire cuire 20 minutes ÃƒÆ’Ã‚Â  180Ãƒâ€šÃ‚Â°C.",
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
    "  PrÃƒÆ’Ã‚Â©parer les fruits",
    "Lave les fraises et coupe-les en morceaux. Rince les myrtilles si nÃƒÆ’Ã‚Â©cessaire.",
    "PrÃƒÆ’Ã‚Â©parer la base",
    "Verse le fromage blanc ou le yaourt grec dans un bol. Lisse lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement ÃƒÆ’Ã‚Â  la cuillÃƒÆ’Ã‚Â¨re.",
    "Ajouter les toppings",
    "Ajoute les myrtilles et les fraises sur le yaourt. Parseme le granola par-dessus.",
    "Finaliser",
    "Verse le sirop dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©rable sur lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ensemble.",
  ],
},
]

export const healthyRecipes: Recipe[] = [
{
  id: "healthy-parfait",
  title: "Burrito bowl healthy",
  flavor: "sale",
  prepTime: "35 ÃƒÆ’Ã‚Â  40 min",
  servings: "1 pers",
  image: bowlPouletImg,
  ingredients: [
    "Base & protÃƒÆ’Ã‚Â©ines",
    "120 g de blanc de poulet",
    "200 g de patate douce",
    "LÃƒÆ’Ã‚Â©gumes",
    "1/4 dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge",
    "80 g de tomates cerises",
    "1/4 de poivron rouge",
    "1/4 de poivron jaune",
    "1/2 avocat",
    "Sauce & assaisonnement",
    "30 g de crÃƒÆ’Ã‚Â¨me fraÃƒÆ’Ã‚Â®che lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨re",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Jus dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢1/2 citron vert",
    "Persil frais (selon goÃƒÆ’Ã‚Â»t)",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de paprika",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de poudre dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1/2 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©pices cajun",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire la patate douce",
    "PrÃƒÆ’Ã‚Â©chauffe le four ÃƒÆ’Ã‚Â  200Ãƒâ€šÃ‚Â°C. ÃƒÆ’Ã¢â‚¬Â°pluche la patate douce et coupe-la en dÃƒÆ’Ã‚Â©s. DÃƒÆ’Ã‚Â©pose-la sur une plaque, ajoute la moitiÃƒÆ’Ã‚Â© de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive, le paprika, la poudre dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail, un peu de sel et de poivre. MÃƒÆ’Ã‚Â©lange et enfourne pour 25 ÃƒÆ’Ã‚Â  30 minutes, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢elle soit tendre et dorÃƒÆ’Ã‚Â©e.",
    "Cuire le poulet",
    "Coupe le poulet en morceaux. Fais chauffer une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen avec le reste de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive. Ajoute le poulet, les ÃƒÆ’Ã‚Â©pices cajun, sale et poivre. Fais cuire 5 ÃƒÆ’Ã‚Â  7 minutes jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit bien dorÃƒÆ’Ã‚Â© et cuit ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur.",
    "PrÃƒÆ’Ã‚Â©parer les lÃƒÆ’Ã‚Â©gumes frais",
    "ÃƒÆ’Ã¢â‚¬Â°mince finement lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge. Coupe les tomates cerises en deux. Coupe les poivrons en fines laniÃƒÆ’Ã‚Â¨res. Coupe lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat en tranches.",
    "PrÃƒÆ’Ã‚Â©parer la sauce",
    "Dans un petit bol, mÃƒÆ’Ã‚Â©lange la crÃƒÆ’Ã‚Â¨me fraÃƒÆ’Ã‚Â®che lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨re avec le jus de citron vert, du sel et du poivre.",
    "Assembler le burrito bowl",
    "Dans un bol : DÃƒÆ’Ã‚Â©pose la patate douce rÃƒÆ’Ã‚Â´tie. Ajoute le poulet. Dispose les poivrons, tomates cerises et lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat.",
    "Finaliser",
    "Ajoute la sauce. Parseme de persil frais ciselÃƒÆ’Ã‚Â©. Ajoute un filet de jus de citron vert si souhaitÃƒÆ’Ã‚Â©.",
  ],
},
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
    "  PrÃƒÆ’Ã‚Â©chauffer le four",
    "PrÃƒÆ’Ã‚Â©chauffe le four ÃƒÆ’Ã‚Â  170Ãƒâ€šÃ‚Â°C.",
    "PrÃƒÆ’Ã‚Â©parer les fruits secs",
    "Concasse grossiÃƒÆ’Ã‚Â¨rement les amandes, noisettes et noix.",
    "MÃƒÆ’Ã‚Â©langer les ingrÃƒÆ’Ã‚Â©dients secs",
    "Dans un grand saladier, mÃƒÆ’Ã‚Â©lange : les flocons dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avoine, les fruits secs concassÃƒÆ’Ã‚Â©s, la cannelle, la pincÃƒÆ’Ã‚Â©e de sel.",
    "Ajouter le miel",
    "Ajoute le miel et mÃƒÆ’Ã‚Â©lange bien pour enrober lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ensemble des ingrÃƒÆ’Ã‚Â©dients.",
    "Enfourner",
    "ÃƒÆ’Ã¢â‚¬Â°tale le mÃƒÆ’Ã‚Â©lange en une couche uniforme sur une plaque recouverte de papier cuisson.",
    "Cuisson",
    "Enfourne pour 20 ÃƒÆ’Ã‚Â  25 minutes. Remue le granola toutes les 8 ÃƒÆ’Ã‚Â  10 minutes pour une cuisson homogÃƒÆ’Ã‚Â¨ne.",
    "Refroidissement",
    "Sors le granola du four et laisse-le refroidir complÃƒÆ’Ã‚Â¨tement : il deviendra croustillant en refroidissant.",
    "Conservation",
    "Conserve le granola dans un bocal hermÃƒÆ’Ã‚Â©tique ÃƒÆ’Ã‚Â  tempÃƒÆ’Ã‚Â©rature ambiante.",
  ],
},
{
  id: "healthy-tartine-avocat",
  title: "Bowl au thon",
  flavor: "sale",
  prepTime: "20 ÃƒÆ’Ã‚Â  25 min",
  servings: "1 pers",
  image: bowlThonImg,
  ingredients: [
    "120 g de thon au naturel (ÃƒÆ’Ã‚Â©gouttÃƒÆ’Ã‚Â©)",
    "60 g de riz cru",
    "1/2 avocat",
    "1/2 concombre",
    "1 petite tomate",
    "1 Ãƒâ€¦Ã¢â‚¬Å“uf",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de graines de sÃƒÆ’Ã‚Â©same",
    "Pour la vinaigrette",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de vinaigre (ou jus de citron)",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte et laisse tiÃƒÆ’Ã‚Â©dir.",
    "Cuire lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf",
    "Plonge lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante et fais-le cuire 9 ÃƒÆ’Ã‚Â  10 minutes pour un Ãƒâ€¦Ã¢â‚¬Å“uf dur. Refroidis-le sous lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau froide, ÃƒÆ’Ã‚Â©caille-le et coupe-le en quartiers.",
    "PrÃƒÆ’Ã‚Â©parer les lÃƒÆ’Ã‚Â©gumes",
    "Coupe lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat en tranches ou en dÃƒÆ’Ã‚Â©s. Coupe le concombre en rondelles ou en dÃƒÆ’Ã‚Â©s. Coupe la tomate en morceaux.",
    "PrÃƒÆ’Ã‚Â©parer la vinaigrette",
    "Dans un petit bol, mÃƒÆ’Ã‚Â©lange lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive, le vinaigre (ou le jus de citron), le sel et le poivre.",
    "Assembler le bowl",
    "Dans un bol : DÃƒÆ’Ã‚Â©pose le riz. Ajoute le thon ÃƒÆ’Ã‚Â©miettÃƒÆ’Ã‚Â©. Dispose lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢avocat, le concombre et la tomate. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf dur.",
    "Finaliser",
    "Verse la vinaigrette sur le bowl. Parseme de graines de sÃƒÆ’Ã‚Â©same.",
  ],
},
{
  id: "healthy-bowl-mediterraneen",
  title: "Bowl mÃƒÆ’Ã‚Â©diterranÃƒÆ’Ã‚Â©en",
  flavor: "sale",
  prepTime: "20 ÃƒÆ’Ã‚Â  25 min",
  servings: "1 pers",
  image: bowlMediteraneenImg,
  ingredients: [
    "Base",
    "60 g de quinoa ou riz cru",
    "100 g de pois chiches cuits (ÃƒÆ’Ã‚Â©gouttÃƒÆ’Ã‚Â©s)",
    "LÃƒÆ’Ã‚Â©gumes & garnitures",
    "1/2 concombre",
    "1 tomate",
    "1/4 dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge",
    "50 g de feta ÃƒÆ’Ã‚Â©miettÃƒÆ’Ã‚Â©e",
    "Olives noires (quelques-unes)",
    "Persil ou basilic frais",
    "Assaisonnement",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de jus de citron",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire la base",
    "Fais cuire le quinoa ou le riz dans une casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte et laisse tiÃƒÆ’Ã‚Â©dir.",
    "PrÃƒÆ’Ã‚Â©parer les lÃƒÆ’Ã‚Â©gumes",
    "Coupe le concombre en dÃƒÆ’Ã‚Â©s. Coupe la tomate en morceaux. ÃƒÆ’Ã¢â‚¬Â°mince finement lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge.",
    "PrÃƒÆ’Ã‚Â©parer les pois chiches",
    "Rince et ÃƒÆ’Ã‚Â©goutte les pois chiches. Tu peux les utiliser tels quels ou les faire revenir rapidement ÃƒÆ’Ã‚Â  la poÃƒÆ’Ã‚Âªle avec un peu de sel.",
    "PrÃƒÆ’Ã‚Â©parer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assaisonnement",
    "Dans un petit bol, mÃƒÆ’Ã‚Â©lange lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive, le jus de citron, le sel et le poivre.",
    "Assembler le bowl",
    "Dans un bol : DÃƒÆ’Ã‚Â©pose la base (quinoa ou riz). Ajoute les pois chiches. Dispose les lÃƒÆ’Ã‚Â©gumes. Ajoute la feta et les olives.",
    "Finaliser",
    "Verse lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assaisonnement. Ajoute les herbes fraÃƒÆ’Ã‚Â®ches.",
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
    "150 g de brocoli",
    "1 petite courgette",
    "50 g dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã‚Â©pinards frais",
    "500 ml de bouillon de lÃƒÆ’Ã‚Â©gumes",
  ],
  steps: [
    "  PrÃƒÆ’Ã‚Â©parer les lÃƒÆ’Ã‚Â©gumes",
    "Lave le brocoli et coupe-le en petits bouquets. Lave la courgette et coupe-la en rondelles. Rince les ÃƒÆ’Ã‚Â©pinards.",
    "Cuisson",
    "Verse le bouillon de lÃƒÆ’Ã‚Â©gumes dans une casserole. Ajoute le brocoli et la courgette. Porte ÃƒÆ’Ã‚Â  ÃƒÆ’Ã‚Â©bullition puis laisse cuire 10 ÃƒÆ’Ã‚Â  12 minutes, jusqu'ÃƒÆ’Ã‚Â  ce que les lÃƒÆ’Ã‚Â©gumes soient tendres.",
    "Ajouter les ÃƒÆ’Ã‚Â©pinards",
    "Ajoute les ÃƒÆ’Ã‚Â©pinards dans la casserole et laisse cuire 1 ÃƒÆ’Ã‚Â  2 minutes, juste le temps quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ils tombent.",
    "Mixer",
    "Mixe la soupe jusqu'ÃƒÆ’Ã‚Â  obtenir une texture lisse et homogÃƒÆ’Ã‚Â¨ne.",
    "Servir",
    "GoÃƒÆ’Ã‚Â»te et ajuste lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assaisonnement si nÃƒÆ’Ã‚Â©cessaire.",
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
    "Pour les brochettes",
    "150 g de blanc de poulet",
    "1/4 dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Sel et poivre",
    "Paprika ou herbes de Provence (optionnel)",
    "Pour la salade",
    "1/2 concombre",
    "1 tomate",
    "Herbes fraÃƒÆ’Ã‚Â®ches (persil, menthe ou coriandre)",
    "Sel et poivre",
    "Pour le boulghour ÃƒÆ’Ã‚Â  la tomate",
    "60 g de boulghour cru",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  soupe de concentrÃƒÆ’Ã‚Â© de tomate",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Sel et poivre",
    "Pour la sauce ÃƒÆ’Ã‚Â  la grecque",
    "100 g de yaourt grec",
    "1/4 de concombre rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©",
    "1 petite gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de jus de citron",
    "Sel et poivre",
    "Herbes fraÃƒÆ’Ã‚Â®ches (aneth ou menthe, optionnel)",
  ],
  steps: [
    "  PrÃƒÆ’Ã‚Â©parer la sauce ÃƒÆ’Ã‚Â  la grecque",
    "RÃƒÆ’Ã‚Â¢pe le concombre et presse-le pour enlever lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢excÃƒÆ’Ã‚Â¨s dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau. Dans un bol, mÃƒÆ’Ã‚Â©lange le yaourt grec, le concombre rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©, lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail finement hachÃƒÆ’Ã‚Â©, le jus de citron, le sel, le poivre et les herbes si utilisÃƒÆ’Ã‚Â©es. RÃƒÆ’Ã‚Â©serve au frais.",
    "PrÃƒÆ’Ã‚Â©parer le boulghour ÃƒÆ’Ã‚Â  la tomate",
    "Fais cuire le boulghour dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte, ajoute le concentrÃƒÆ’Ã‚Â© de tomate, lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive, le sel et le poivre. MÃƒÆ’Ã‚Â©lange et rÃƒÆ’Ã‚Â©serve.",
    "PrÃƒÆ’Ã‚Â©parer les brochettes",
    "Coupe le poulet en cubes et lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢oignon rouge en morceaux. Enfile-les sur les brochettes. Badigeonne dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive, sale, poivre et ajoute les ÃƒÆ’Ã‚Â©pices si souhaitÃƒÆ’Ã‚Â©.",
    "Cuire les brochettes",
    "Fais cuire les brochettes dans une poÃƒÆ’Ã‚Âªle-grill ou sur un grill bien chaud pendant 8 ÃƒÆ’Ã‚Â  10 minutes, en les retournant rÃƒÆ’Ã‚Â©guliÃƒÆ’Ã‚Â¨rement, jusqu'ÃƒÆ’Ã‚Â  cuisson complÃƒÆ’Ã‚Â¨te.",
    "PrÃƒÆ’Ã‚Â©parer la salade",
    "Coupe le concombre et la tomate en morceaux. MÃƒÆ’Ã‚Â©lange avec les herbes, le sel et le poivre.",
    "Servir",
    "Dispose le boulghour ÃƒÆ’Ã‚Â  la tomate dans lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assiette. Ajoute les brochettes de poulet. Ajoute la salade fraÃƒÆ’Ã‚Â®che. Accompagne avec la sauce ÃƒÆ’Ã‚Â  la grecque.",
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
    "  PrÃƒÆ’Ã‚Â©parer le brocoli",
    "DÃƒÆ’Ã‚Â©taille le brocoli en petits bouquets. Fais-le cuire dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e pendant 5 ÃƒÆ’Ã‚Â  7 minutes, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit tendre. ÃƒÆ’Ã¢â‚¬Â°goutte bien et coupe-le grossiÃƒÆ’Ã‚Â¨rement. RÃƒÆ’Ã‚Â©serve.",
    "Cuire les lardons",
    "Fais revenir les lardons dans une poÃƒÆ’Ã‚Âªle chaude sans ajout de matiÃƒÆ’Ã‚Â¨re grasse jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ils soient dorÃƒÆ’Ã‚Â©s. ÃƒÆ’Ã¢â‚¬Â°goutte-les sur du papier absorbant et rÃƒÆ’Ã‚Â©serve.",
    "PrÃƒÆ’Ã‚Â©chauffer le four",
    "PrÃƒÆ’Ã‚Â©chauffe le four ÃƒÆ’Ã‚Â  180Ãƒâ€šÃ‚Â°C.",
    "PrÃƒÆ’Ã‚Â©parer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢appareil",
    "Dans un grand saladier : Bats les Ãƒâ€¦Ã¢â‚¬Å“ufs. Ajoute le lait et mÃƒÆ’Ã‚Â©lange. Incorpore la farine progressivement en fouettant pour ÃƒÆ’Ã‚Â©viter les grumeaux. Assaisonne avec le sel, le poivre et lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail en poudre.",
    "Ajouter les garnitures",
    "Ajoute ÃƒÆ’Ã‚Â  la prÃƒÆ’Ã‚Â©paration : le brocoli, la feta ÃƒÆ’Ã‚Â©miettÃƒÆ’Ã‚Â©e, les lardons, une poignÃƒÆ’Ã‚Â©e de comtÃƒÆ’Ã‚Â© rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â©. MÃƒÆ’Ã‚Â©lange dÃƒÆ’Ã‚Â©licatement pour bien rÃƒÆ’Ã‚Â©partir les ingrÃƒÆ’Ã‚Â©dients.",
    "Enfourner",
    "Huile lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement un moule avec de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive. Verse la prÃƒÆ’Ã‚Â©paration et lisse la surface. Ajoute un peu de comtÃƒÆ’Ã‚Â© rÃƒÆ’Ã‚Â¢pÃƒÆ’Ã‚Â© sur le dessus. Enfourne pour 35 ÃƒÆ’Ã‚Â  40 minutes, jusqu'ÃƒÆ’Ã‚Â  ce que le brownie soit bien dorÃƒÆ’Ã‚Â© et pris ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur.",
    "Repos et dÃƒÆ’Ã‚Â©coupe",
    "Laisse tiÃƒÆ’Ã‚Â©dir quelques minutes avant de dÃƒÆ’Ã‚Â©couper en parts.",
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
  prepTime: "25 ÃƒÆ’Ã‚Â  30 min",
  servings: "1 pers",
  image: saumonCitronImg,
  ingredients: [
    "120 g de saumon frais",
    "60 g de riz cru",
    "150 g dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢asperges vertes",
    "1 gousse dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail",
    "5 g de beurre",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Persil frais (selon goÃƒÆ’Ã‚Â»t)",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e selon le temps indiquÃƒÆ’Ã‚Â©. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "PrÃƒÆ’Ã‚Â©parer les asperges",
    "Lave les asperges et coupe les extrÃƒÆ’Ã‚Â©mitÃƒÆ’Ã‚Â©s dures. Fais-les cuire ÃƒÆ’Ã‚Â  la vapeur ou dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante salÃƒÆ’Ã‚Â©e pendant 5 ÃƒÆ’Ã‚Â  7 minutes, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢elles soient tendres mais encore lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement croquantes. ÃƒÆ’Ã¢â‚¬Â°goutte et rÃƒÆ’Ã‚Â©serve.",
    "Cuire le saumon",
    "Sale et poivre le saumon. Fais chauffer lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive dans une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. DÃƒÆ’Ã‚Â©pose le saumon cÃƒÆ’Ã‚Â´tÃƒÆ’Ã‚Â© peau (ou cÃƒÆ’Ã‚Â´tÃƒÆ’Ã‚Â© prÃƒÆ’Ã‚Â©sentation) et fais cuire 3 ÃƒÆ’Ã‚Â  4 minutes. Retourne le saumon et poursuis la cuisson 2 ÃƒÆ’Ã‚Â  3 minutes.",
    "PrÃƒÆ’Ã‚Â©parer la sauce citron-ail",
    "Baisse le feu. Ajoute le beurre et lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail hachÃƒÆ’Ã‚Â© dans la poÃƒÆ’Ã‚Âªle. Laisse fondre doucement en arrosant le saumon pendant 30 ÃƒÆ’Ã‚Â  60 secondes, sans faire brÃƒÆ’Ã‚Â»ler lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ail.",
    "Finaliser",
    "Retire la poÃƒÆ’Ã‚Âªle du feu. Ajoute le persil ciselÃƒÆ’Ã‚Â© et un peu de jus de citron si souhaitÃƒÆ’Ã‚Â©. Rectifie lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assaisonnement.",
    "Servir",
    "Dispose le riz dans lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢assiette. Ajoute le saumon au citron et les asperges.",
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
  servings: "1 pers",
  image: saladeCesarImg,
  ingredients: [
    "Pour la salade",
    "100 g de blanc de poulet",
    "1 Ãƒâ€¦Ã¢â‚¬Å“uf",
    "80 g de salade (romaine ou autre)",
    "1 petite tomate",
    "20 g de parmesan en copeaux",
    "20 g de croÃƒÆ’Ã‚Â»tons de pain",
    "Pour la sauce CÃƒÆ’Ã‚Â©sar maison (healthy)",
    "40 g de yaourt grec nature",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de moutarde",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© de jus de citron",
    "1 cuillÃƒÆ’Ã‚Â¨re ÃƒÆ’Ã‚Â  cafÃƒÆ’Ã‚Â© dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf",
    "Plonge lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf dans de lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢eau bouillante et fais-le cuire 9 minutes pour un Ãƒâ€¦Ã¢â‚¬Å“uf dur. Refroidis-le, ÃƒÆ’Ã‚Â©caille-le et coupe-le en quartiers.",
    "Cuire le poulet",
    "Fais chauffer une poÃƒÆ’Ã‚Âªle ÃƒÆ’Ã‚Â  feu moyen. Fais cuire le poulet 5 ÃƒÆ’Ã‚Â  7 minutes, en le retournant, jusqu'ÃƒÆ’Ã‚Â  ce quÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢il soit bien dorÃƒÆ’Ã‚Â© et cuit ÃƒÆ’Ã‚Â  cÃƒâ€¦Ã¢â‚¬Å“ur. Sale, poivre et coupe-le en tranches.",
    "PrÃƒÆ’Ã‚Â©parer la sauce CÃƒÆ’Ã‚Â©sar",
    "Dans un bol, mÃƒÆ’Ã‚Â©lange le yaourt grec, la moutarde, le jus de citron, lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢huile dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢olive, le sel et le poivre jusqu'ÃƒÆ’Ã‚Â  obtenir une sauce lisse.",
    "PrÃƒÆ’Ã‚Â©parer les lÃƒÆ’Ã‚Â©gumes",
    "Lave et essore la salade. Coupe la tomate en quartiers.",
    "Assembler la salade",
    "Dans un grand bol ou une assiette : DÃƒÆ’Ã‚Â©pose la salade. Ajoute le poulet. Ajoute lÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã¢â‚¬Å“uf dur. Ajoute la tomate. Ajoute les croÃƒÆ’Ã‚Â»tons.",
    "Finaliser",
    "Verse la sauce CÃƒÆ’Ã‚Â©sar maison sur la salade. Ajoute les copeaux de parmesan et mÃƒÆ’Ã‚Â©lange lÃƒÆ’Ã‚Â©gÃƒÆ’Ã‚Â¨rement.",
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
                      <h4>IngrÃƒÆ’Ã‚Â©dients</h4>
                      <ul>
                        {selectedRecipe.ingredients.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {selectedRecipe.steps.length > 0 ? (
                    <section>
                      <h4>ÃƒÆ’Ã¢â‚¬Â°tapes</h4>
                      <ol>
                        {selectedRecipe.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
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









