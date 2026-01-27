import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import { useMemo } from "react"
import recipeImg1 from "../../assets/planner-01.jpg"
import recipeImg2 from "../../assets/planner-02.jpg"
import recipeImg3 from "../../assets/planner-03.jpg"
import recipeImg4 from "../../assets/planner-04.jpg"
import wrapPouletImg from "../../assets/wrap-poulet.jpg"
import recipeImg5 from "../../assets/planner-05.jpg"
import recipeImg6 from "../../assets/planner-06.jpg"
import pancakesProteineImg from "../../assets/Pancakes-proteine.jpeg"
import butterChickenImg from "../../assets/butter-chicken.jpeg"
import alfredoPastaImg from "../../assets/alfredo-pasta.jpeg"
import avocadoToastImg from "../../assets/avocado-toast.jpg"
import curryPoischicheImg from "../../assets/curry-poischiche.jpg"
import smoothieBananeImg from "../../assets/smoothie-banane.jpeg"
import brownieProteineImg from "../../assets/brownie-proteine.jpg"
import overnightOatsImg from "../../assets/overnight-oats.jpeg"
import fruitsRougesGranolaImg from "../../assets/fruitsrouges-granola.jpeg"
import bowlThonImg from "../../assets/bowl-thon.jpg"
import bowlMediteraneenImg from "../../assets/bowl-mediteraneen.jpg"
import soupeDetoxImg from "../../assets/soupe-detox.jpeg"
import bananaBreadImg from "../../assets/banana-bread.jpeg"
import brownieSaleImg from "../../assets/brownie-salé.jpeg"
import biscuitsAvoineImg from "../../assets/biscuits-avoine.jpg"
import saumonCitronImg from "../../assets/saumon-citron.jpg"
import puddingChiaImg from "../../assets/pudding-chia.jpg"
import saladeCesarImg from "../../assets/salade-cesar.jpg"
import granolaMaisonImg from "../../assets/granola-maison.jpg"
import brochettesImg from "../../assets/brochettes.jpg"
import smoothieMangueImg from "../../assets/smoothie-mangue.jpeg"
import saladeDeFruitImg from "../../assets/salade-de-fruit.jpeg"
import omeletteFetaImg from "../../assets/omelette-feta.jpeg"
import steackPommeDeTerreImg from "../../assets/steack-pommedeterre.jpeg"
import saumonBowlImg from "../../assets/saumon-bowl.jpg"
import bowlPouletImg from "../../assets/bowl-poulet.jpeg"
import dietHero from "../../assets/food.jpeg"
import PageHeading from "../../components/PageHeading"
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
  toppings?: string[]
  tips?: string[]
}

const massRecipes: Recipe[] = [
  {
  id: "mass-pancakes",
  title: "Pancake protÃ©inÃ©",
  flavor: "sucre",
  prepTime: "10 Ã  15 min",
  servings: "1 pers",
  image: pancakesProteineImg,
  ingredients: [
    "1 Å“uf",
    "25 ml de lait",
    "35 g de farine",
    "30 g de fromage blanc",
    "20 g de whey",
    "1 cuillÃ¨re Ã  soupe de levure chimique",
    "Quelques gouttes d'arÃ´me vanille",
  ],
  steps: [
    "Dans un bol, casse l'Å“uf et fouette-le lÃ©gÃ¨rement.",
    "Ajoute le lait et le fromage blanc, puis mÃ©lange jusqu'Ã  obtenir une texture lisse.",
    "Incorpore la farine, la whey et la levure chimique.",
    "MÃ©lange soigneusement pour Ã©viter les grumeaux.",
    "Ajoute les gouttes de vanille et mÃ©lange une derniÃ¨re fois. La pÃ¢te doit Ãªtre Ã©paisse mais fluide.",
    "Fais chauffer une poÃªle antiadhÃ©sive Ã  feu moyen (lÃ©gÃ¨rement graissÃ©e si nÃ©cessaire).",
    "Verse de petites portions de pÃ¢te pour former les pancakes.",
    "Laisse cuire 1 Ã  2 minutes, jusqu'Ã  ce que des bulles apparaissent, puis retourne.",
    "Poursuis la cuisson 1 minute de l'autre cÃ´tÃ©.",
  ],
  toppings: [
    "Fruits rouges",
    "Beurre de cacahuÃ¨te",
    "Skyr ou fromage blanc",
    "Chocolat noir fondu",
    "Sirop d'Ã©rable (lÃ©ger)",
  ],
  tips: [
    "Astuce : Si la pÃ¢te est trop Ã©paisse, ajoute quelques gouttes de lait. Si elle est trop liquide, ajoute un peu de farine.",
  ],
},
{
  id: "mass-bowl-saumon",
  title: "Saumon marinÃ© sriracha & riz",
  flavor: "sale",
  prepTime: "35 Ã  50 min",
  servings: "1 pers",
  image: saumonBowlImg,
  ingredients: [
    "Pour le saumon marinÃ©",
    "500 g de saumon sans peau",
    "1/4 de tasse de sauce soja",
    "1 cuillÃ¨re Ã  soupe de vinaigre de riz",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile de sÃ©same",
    "1 cuillÃ¨re Ã  cafÃ© de miel",
    "2 gousses dâ€™ail hachÃ©es",
    "1 cuillÃ¨re Ã  soupe de pÃ¢te de gingembre",
    "2 cuillÃ¨res Ã  soupe de sriracha",
    "Pour la sauce",
    "2 cuillÃ¨res Ã  soupe de yaourt grec",
    "2 cuillÃ¨res Ã  cafÃ© de sriracha",
    "2 cuillÃ¨res Ã  cafÃ© de vinaigre de riz",
    "Pour les accompagnements",
    "70 g de riz cru",
    "1 mini concombre",
    "Carottes rÃ¢pÃ©es (quantitÃ© selon prÃ©fÃ©rence)",
    "1/2 avocat",
  ],
  steps: [
    "PrÃ©parer la marinade",
    "Dans un bol, mÃ©lange la sauce soja, le vinaigre de riz, l'huile de sÃ©same, le miel, l'ail hachÃ©, la pÃ¢te de gingembre et la sriracha jusqu'Ã  obtenir une marinade homogÃ¨ne.",
    "Mariner le saumon",
    "Coupe le saumon en pavÃ©s ou en cubes. DÃ©pose-le dans un plat, verse la marinade, mÃ©lange dÃ©licatement pour bien enrober le poisson. Couvre et laisse mariner 15 Ã  30 minutes au rÃ©frigÃ©rateur.",
    "PrÃ©parer les accompagnements",
    "Lave le mini concombre et coupe-le en fines rondelles ou demi-lunes. RÃ¢pe les carottes. Coupe le demi-avocat en tranches ou en dÃ©s. RÃ©serve au frais.",
    "PrÃ©parer la sauce",
    "Dans un petit bol, mÃ©lange le yaourt grec, la sriracha et le vinaigre de riz jusqu'Ã  obtenir une sauce lisse. RÃ©serve au frais.",
    "Cuire le saumon",
    "Fais chauffer une poÃªle Ã  feu moyen. DÃ©pose le saumon avec un peu de marinade et fais-le cuire 2 Ã  3 minutes par face, jusqu'Ã  ce qu'il soit bien dorÃ© et cuit Ã  cÅ“ur.",
    "Dressage",
    "Dispose le saumon dans l'assiette ou le bol, ajoute les carottes rÃ¢pÃ©es, le concombre et l'avocat, puis nappe ou accompagne avec la sauce au yaourt Ã©picÃ©e.",
  ],
},

 {
  id: "mass-wrap-poulet",
  title: "Wrap poulet croquant",
  flavor: "sale",
  prepTime: "30 Ã  45 min",
  servings: "1 pers",
  image: wrapPouletImg,
  ingredients: [
    "Pour le poulet",
    "600 g de blanc de poulet coupÃ© en laniÃ¨res",
    "3 gousses dâ€™ail",
    "1 cuillÃ¨re Ã  soupe dâ€™origan",
    "1 cuillÃ¨re Ã  soupe de paprika",
    "1 cuillÃ¨re Ã  cafÃ© de poudre dâ€™oignon",
    "1 cuillÃ¨re Ã  cafÃ© de flocons de piment",
    "1 cuillÃ¨re Ã  cafÃ© de sel et poivre",
    "Jus de citron (selon goÃ»t)",
    "Pour la sauce",
    "100 g de yaourt Ã©crÃ©mÃ©",
    "20 g de sriracha",
    "1 gousse dâ€™ail Ã©mincÃ©e",
    "Persil (selon goÃ»t)",
    "Sel et poivre",
    "Pour le montage des wraps",
    "Tortillas faibles en calories",
    "Laitue",
    "Oignons rouges",
    "Tomates coupÃ©es en dÃ©s",
  ],
  steps: [
    "  PrÃ©parer la marinade du poulet",
    "Dans un grand bol, mÃ©lange : lâ€™ail hachÃ©, lâ€™origan, le paprika, la poudre dâ€™oignon, les flocons de piment, le sel et poivre. Ajoute le jus de citron, puis mÃ©lange. Incorpore les laniÃ¨res de poulet et mÃ©lange bien pour les enrober. Laisse mariner au minimum 15 minutes (idÃ©alement 30 minutes).",
    "PrÃ©parer la sauce",
    "Dans un bol, mÃ©lange : le yaourt Ã©crÃ©mÃ©, la sriracha, lâ€™ail Ã©mincÃ©, le persil, le sel et poivre. Ajoute un peu de jus de citron selon ton goÃ»t. MÃ©lange jusqu'Ã  obtenir une sauce homogÃ¨ne. RÃ©serve au frais.",
    "PrÃ©parer les garnitures",
    "Lave et coupe la laitue. Ã‰mince finement lâ€™oignon rouge. Coupe les tomates en petits dÃ©s. RÃ©serve lâ€™ensemble.",
    "Cuire le poulet",
    "Fais chauffer une poÃªle Ã  feu moyen. Ajoute le poulet marinÃ© (sans ajouter de matiÃ¨re grasse si la poÃªle est antiadhÃ©sive). Fais cuire 5 Ã  7 minutes, en remuant rÃ©guliÃ¨rement, jusqu'Ã  ce que le poulet soit bien dorÃ© et cuit Ã  cÅ“ur.",
    "Monter les wraps",
    "Fais lÃ©gÃ¨rement chauffer les tortillas. DÃ©pose : de la laitue, du poulet chaud, des tomates, de lâ€™oignon rouge. Ajoute la sauce selon ton goÃ»t. Roule les wraps bien serrÃ©s.",
  ],
},
{
  id: "mass-omelette-power",
  title: "Omelette power Ã  la feta",
  flavor: "sale",
  prepTime: "15 Ã  20 min",
  servings: "1 pers",
  image: omeletteFetaImg,
  ingredients: [
    "3 Å“ufs",
    "50 g de feta Ã©miettÃ©e",
    "100 g dâ€™Ã©pinards frais",
    "Huile dâ€™olive",
    "1 gousse dâ€™ail",
    "1 petit oignon",
    "Sel et poivre",
  ],
  steps: [
    "  PrÃ©parer les ingrÃ©dients",
    "Ã‰pluche et Ã©mince finement lâ€™oignon. Ã‰pluche et hache lâ€™ail. Lave les Ã©pinards et Ã©goutte-les.",
    "Cuire les lÃ©gumes",
    "Fais chauffer un filet dâ€™huile dâ€™olive dans une poÃªle Ã  feu moyen. Ajoute lâ€™oignon et fais-le revenir 2 Ã  3 minutes jusqu'Ã  ce quâ€™il soit translucide. Ajoute lâ€™ail et fais revenir encore 30 secondes. Incorpore les Ã©pinards et laisse-les tomber 1 Ã  2 minutes, jusqu'Ã  rÃ©duction.",
    "PrÃ©parer les Å“ufs",
    "Dans un bol, bats les Å“ufs avec le sel et le poivre.",
    "Cuire lâ€™omelette",
    "Verse les Å“ufs battus dans la poÃªle sur les lÃ©gumes. Laisse cuire Ã  feu doux quelques minutes, jusqu'Ã  ce que les bords commencent Ã  prendre.",
    "Ajouter la feta",
    "RÃ©partis la feta Ã©miettÃ©e sur lâ€™omelette. Poursuis la cuisson doucement jusqu'Ã  ce que lâ€™omelette soit cuite Ã  ton goÃ»t.",
    "Servir",
    "Plie lâ€™omelette en deux et sers immÃ©diatement.",
  ],
},
{
  id: "mass-smoothie-gain",
  title: "Smoothie banane beurre de cacahuÃ¨te",
  flavor: "sucre",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieBananeImg,
  ingredients: [
    "1 banane",
    "300 ml de lait vÃ©gÃ©tal",
    "80 g de flocons dâ€™avoine",
    "1 scoop de protÃ©ine whey",
    "1 cuillÃ¨re Ã  soupe de beurre de cacahuÃ¨te",
    "1 cuillÃ¨re Ã  soupe de sirop dâ€™Ã©rable",
    "Cannelle (facultatif)",
  ],
  steps: [
    "Ã‰pluche la banane et coupe-la en morceaux.",
    "Verse le lait vÃ©gÃ©tal dans un blender.",
    "Ajoute les flocons dâ€™avoine, la banane, la whey, le beurre de cacahuÃ¨te et le sirop dâ€™Ã©rable.",
    "Ajoute la cannelle si tu le souhaites.",
    "Mixe pendant 30 Ã  60 secondes, jusqu'Ã  obtenir une texture lisse et homogÃ¨ne.",
    "Ajuste la texture : Ajoute un peu de lait si le smoothie est trop Ã©pais. Mixe davantage si nÃ©cessaire.",
    "Verse dans un verre et consomme immÃ©diatement.",
  ],
},
{
  id: "mass-pates-cremeuses",
  title: "Alfredo pasta protÃ©inÃ©",
  flavor: "sale",
  prepTime: "25 Ã  30 min",
  servings: "1 pers",
  image: alfredoPastaImg,
  ingredients: [
    "150 g de blanc de poulet",
    "80 g de pÃ¢tes (crues, au choix)",
    "150 g de champignons (Paris ou autres)",
    "100 g de fromage blanc ou yaourt grec nature",
    "30 g de parmesan rÃ¢pÃ©",
    "1 gousse dâ€™ail",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes sÃ©chÃ©es",
  ],
  steps: [
    "  Cuire les pÃ¢tes",
    "Fais cuire les pÃ¢tes dans une grande casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte-les en conservant un peu dâ€™eau de cuisson.",
    "PrÃ©parer le poulet",
    "Coupe le poulet en morceaux ou en laniÃ¨res. Fais chauffer lâ€™huile dâ€™olive dans une poÃªle Ã  feu moyen. Ajoute le poulet, sale, poivre et fais cuire 5 Ã  7 minutes jusqu'Ã  ce quâ€™il soit bien dorÃ© et cuit Ã  cÅ“ur. RÃ©serve.",
    "Cuire les champignons",
    "Dans la mÃªme poÃªle, ajoute lâ€™ail hachÃ© et fais revenir 30 secondes. Ajoute les champignons Ã©mincÃ©s et fais-les cuire 5 minutes, jusqu'Ã  ce quâ€™ils rendent leur eau et dorent lÃ©gÃ¨rement.",
    "PrÃ©parer la sauce Alfredo protÃ©inÃ©e",
    "Baisse le feu. Ajoute le fromage blanc (ou yaourt grec) et mÃ©lange doucement. Incorpore le parmesan et mÃ©lange jusqu'Ã  obtenir une sauce crÃ©meuse. Ajoute un peu dâ€™eau de cuisson des pÃ¢tes si nÃ©cessaire pour dÃ©tendre la sauce.",
    "Assembler",
    "Ajoute les pÃ¢tes Ã©gouttÃ©es dans la poÃªle. Incorpore le poulet. MÃ©lange bien pour enrober les pÃ¢tes de sauce.",
    "Ajuster et servir",
    "Rectifie lâ€™assaisonnement (sel, poivre). Ajoute des herbes si souhaitÃ© et sers immÃ©diatement.",
  ],
},
{
  id: "mass-quinoa-bowl",
  title: "Butter chicken protÃ©inÃ©, riz et brocolis",
  flavor: "sale",
  prepTime: "30 Ã  35 min",
  servings: "1 pers",
  image: butterChickenImg,
  ingredients: [
    "Pour le poulet",
    "150 g de blanc de poulet",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Sel et poivre",
    "Pour la sauce butter chicken",
    "100 g de yaourt grec nature",
    "1 cuillÃ¨re Ã  soupe de concentrÃ© de tomate",
    "1 cuillÃ¨re Ã  cafÃ© de garam masala",
    "1/2 cuillÃ¨re Ã  cafÃ© de paprika",
    "1/2 cuillÃ¨re Ã  cafÃ© de curry",
    "1 gousse dâ€™ail",
    "1/2 cuillÃ¨re Ã  cafÃ© de gingembre (pÃ¢te ou moulu)",
    "Sel et poivre",
    "Pour lâ€™accompagnement",
    "60 g de riz cru",
    "150 g de brocolis",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte et rÃ©serve.",
    "Cuire les brocolis",
    "Fais cuire les brocolis Ã  la vapeur ou dans de lâ€™eau bouillante salÃ©e pendant 5 Ã  7 minutes, jusqu'Ã  ce quâ€™ils soient tendres mais encore verts. Ã‰goutte et rÃ©serve.",
    "PrÃ©parer le poulet",
    "Coupe le poulet en morceaux. Fais chauffer lâ€™huile dâ€™olive dans une poÃªle Ã  feu moyen. Ajoute le poulet, sale, poivre et fais cuire 5 Ã  6 minutes jusqu'Ã  ce quâ€™il soit bien dorÃ© et cuit Ã  cÅ“ur. RÃ©serve.",
    "PrÃ©parer la sauce",
    "Dans un bol, mÃ©lange : le yaourt grec, le concentrÃ© de tomate, lâ€™ail hachÃ©, le gingembre, le garam masala, le paprika, le curry, le sel et poivre.",
    "Assembler le butter chicken",
    "Baisse le feu. Remets le poulet dans la poÃªle. Ajoute la sauce et mÃ©lange dÃ©licatement. Laisse mijoter 3 Ã  5 minutes Ã  feu doux, sans faire bouillir, jusqu'Ã  obtenir une sauce crÃ©meuse.",
    "Servir",
    "Dispose le riz dans lâ€™assiette. Ajoute le butter chicken crÃ©meux. Accompagne de brocolis.",
  ],
},

 {
  id: "mass-patate-bowl",
  title: "Avocado toast",
  flavor: "sale",
  prepTime: "10 Ã  12 min",
  servings: "1 pers",
  image: avocadoToastImg,
  ingredients: [
    "1 ou 2 tranches de pain (complet ou au choix)",
    "1 avocat mÃ»r",
    "1 Å“uf",
    "Sel et poivre",
    "Un filet dâ€™huile dâ€™olive",
    "Jus de citron (facultatif)",
    "Une pincÃ©e de flocons de piment ou paprika",
  ],
  steps: [
    "  PrÃ©parer lâ€™avocat",
    "Coupe lâ€™avocat en deux, retire le noyau et rÃ©cupÃ¨re la chair. Ã‰crase-la Ã  la fourchette dans un bol. Assaisonne avec le sel, le poivre et un filet de jus de citron si souhaitÃ©.",
    "Griller le pain",
    "Fais griller les tranches de pain jusqu'Ã  ce quâ€™elles soient bien dorÃ©es et croustillantes.",
    "Cuire lâ€™Å“uf",
    "Fais chauffer une petite poÃªle avec un filet dâ€™huile dâ€™olive. Casse lâ€™Å“uf et fais-le cuire selon ta prÃ©fÃ©rence : Å“uf au plat (jaune coulant) ou Å“uf mollet / pochÃ©. Sale et poivre lÃ©gÃ¨rement.",
    "Monter lâ€™avocado toast",
    "Ã‰tale lâ€™avocat Ã©crasÃ© sur les tranches de pain chaud. DÃ©pose lâ€™Å“uf par-dessus.",
    "Finaliser",
    "Ajoute un peu de poivre, des flocons de piment ou du paprika si souhaitÃ©. Sers immÃ©diatement.",
  ],
},
{
  id: "mass-chili-boost",
  title: "Bowl prise de masse au steak hachÃ©",
  flavor: "sale",
  prepTime: "25 Ã  30 min",
  servings: "1 pers",
  image: wrapPouletImg,
  ingredients: [
    "200 g de steak hachÃ© (5 Ã  10 % MG selon objectif)",
    "80 g de riz cru",
    "1/2 avocat",
    "1 Å“uf",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "1 petit oignon",
    "Sel et poivre",
    "Optionnel :",
    "Ã‰pices (paprika, ail en poudre, cumin)",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte et rÃ©serve.",
    "Cuire le steak hachÃ©",
    "Fais chauffer lâ€™huile dâ€™olive dans une poÃªle Ã  feu moyen. Ajoute lâ€™oignon Ã©mincÃ© et fais-le revenir 2 minutes. Ajoute le steak hachÃ©, sale, poivre et Ã©miette-le Ã  la spatule. Fais cuire 4 Ã  6 minutes, jusqu'Ã  cuisson souhaitÃ©e.",
    "Cuire lâ€™Å“uf",
    "Dans une petite poÃªle, fais cuire lâ€™Å“uf au plat ou mollet selon prÃ©fÃ©rence.",
    "PrÃ©parer lâ€™avocat",
    "Coupe le demi-avocat en tranches ou en dÃ©s.",
    "Assembler le bowl",
    "Dans un bol ou une assiette : DÃ©pose le riz. Ajoute le steak hachÃ© chaud. Ajoute lâ€™Å“uf. Termine par lâ€™avocat.",
  ],
},
{
  id: "mass-curry-coco",
  title: "Curry coco pois chiches",
  flavor: "sale",
  prepTime: "25 Ã  30 min",
  servings: "1 pers",
  image: curryPoischicheImg,
  ingredients: [
    "150 g de pois chiches cuits (Ã©gouttÃ©s)",
    "100 ml de lait de coco",
    "1/2 oignon",
    "1 gousse dâ€™ail",
    "1 cuillÃ¨re Ã  soupe de concentrÃ© de tomate",
    "1 cuillÃ¨re Ã  cafÃ© de curry en poudre",
    "1/2 cuillÃ¨re Ã  cafÃ© de paprika",
    "Sel et poivre",
    "Persil frais",
    "Pour lâ€™accompagnement",
    "60 g de riz cru",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte et rÃ©serve.",
    "PrÃ©parer la base du curry",
    "Ã‰mince lâ€™oignon et hache lâ€™ail. Fais chauffer une poÃªle ou une casserole Ã  feu moyen. Ajoute lâ€™oignon et fais-le revenir 2 Ã  3 minutes jusqu'Ã  ce quâ€™il soit translucide. Ajoute lâ€™ail et fais revenir 30 secondes.",
    "Ajouter les Ã©pices et le concentrÃ© de tomate",
    "Ajoute le curry, le paprika et le concentrÃ© de tomate. MÃ©lange et laisse cuire 1 minute pour dÃ©velopper les arÃ´mes.",
    "Ajouter les pois chiches et le lait de coco",
    "Ajoute les pois chiches Ã©gouttÃ©s et mÃ©lange. Verse le lait de coco, sale et poivre. Laisse mijoter 10 minutes Ã  feu doux, en remuant de temps en temps.",
    "Finaliser",
    "GoÃ»te et rectifie lâ€™assaisonnement. Ajoute le persil ciselÃ© hors du feu.",
    "Servir",
    "Sers le curry coco bien chaud avec le riz.",
  ],
},
{
  id: "mass-riz-cajou",
  title: "Steak, pommes de terre & haricots verts",
  flavor: "sale",
  prepTime: "30 Ã  35 min",
  servings: "1 pers",
  image: steackPommeDeTerreImg,
  ingredients: [
    "1 steak hachÃ© (150 Ã  200 g, selon besoin calorique)",
    "300 g de pommes de terre",
    "150 g de haricots verts",
    "1 cuillÃ¨re Ã  soupe dâ€™huile dâ€™olive",
    "1 gousse dâ€™ail (optionnel)",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes de Provence",
  ],
  steps: [
    "  PrÃ©parer les pommes de terre",
    "Ã‰pluche les pommes de terre et coupe-les en morceaux. Fais-les cuire dans une casserole dâ€™eau bouillante salÃ©e pendant 15 Ã  20 minutes, jusqu'Ã  ce quâ€™elles soient tendres. Ã‰goutte et rÃ©serve.",
    "Cuire les haricots verts",
    "Fais cuire les haricots verts dans de lâ€™eau bouillante salÃ©e ou Ã  la vapeur pendant 8 Ã  10 minutes. Ã‰goutte et rÃ©serve.",
    "Cuire le steak hachÃ©",
    "Fais chauffer lâ€™huile dâ€™olive dans une poÃªle Ã  feu moyen. Ajoute lâ€™ail hachÃ© si utilisÃ©, puis le steak hachÃ©. Sale et poivre. Fais cuire 3 Ã  5 minutes par face selon la cuisson souhaitÃ©e.",
    "Assembler lâ€™assiette",
    "Dispose les pommes de terre dans lâ€™assiette. Ajoute le steak hachÃ© et les haricots verts. Parseme de persil ou dâ€™herbes si souhaitÃ©.",
  ],
},

 {
  id: "mass-overnight-prot",
  title: "Overnight oats protÃ©ines",
  flavor: "sucre",
  prepTime: "5 Ã  7 min",
  servings: "1 pers",
  image: overnightOatsImg,
  ingredients: [
    "50 g de flocons dâ€™avoine",
    "1 cuillÃ¨re Ã  soupe de graines de chia",
    "1 scoop de protÃ©ine whey",
    "120 g de yaourt (nature)",
    "120 ml de lait dâ€™amande",
    "50 g de framboises",
    "1 cuillÃ¨re Ã  soupe de pÃ¢te Ã  tartiner Biscoff (sur le dessus)",
  ],
  steps: [
    "  PrÃ©parer la whey",
    "Dans un bol ou un shaker, mÃ©lange la whey avec le lait dâ€™amande jusqu'Ã  obtenir une texture bien lisse, sans grumeaux.",
    "PrÃ©parer la base",
    "Dans un bocal ou un bol, ajoute : les flocons dâ€™avoine, les graines de chia, le yaourt. MÃ©lange lÃ©gÃ¨rement.",
    "Ajouter la whey",
    "Verse le mÃ©lange whey + lait dâ€™amande dans le bocal. MÃ©lange bien pour que tous les ingrÃ©dients soient homogÃ¨nes.",
    "Ajouter les fruits",
    "Ajoute les framboises et mÃ©lange dÃ©licatement ou laisse-les sur le dessus selon ta prÃ©fÃ©rence.",
    "Repos",
    "Couvre et place au rÃ©frigÃ©rateur pendant au minimum 4 heures, idÃ©alement toute la nuit.",
    "Finaliser",
    "Au moment de servir, ajoute la pÃ¢te Ã  tartiner Biscoff sur le dessus.",
  ],
},
{
  id: "mass-brownie-beans",
  title: "Brownie protÃ©inÃ©",
  flavor: "sucre",
  prepTime: "30 Ã  35 min",
  servings: "1 pers",
  image: brownieProteineImg,
  ingredients: [
    "60 g de whey protÃ©ine isolate OVERSTIM.s",
    "200 g de compote de pomme bio",
    "2 blancs dâ€™Å“ufs",
    "1 Å“uf entier",
    "100 g de farine de blÃ© T65 ou T80",
    "Sel",
    "4 cuillÃ¨res Ã  soupe de sucre roux ou de sucre de fleur de coco",
    "4 cuillÃ¨res Ã  soupe de chocolat en poudre ou cacao en poudre ou 50 g de chocolat noir Ã  pÃ¢tisser (70 Ã  85% de cacao)",
    "1 cuillÃ¨re Ã  soupe de levure chimique",
  ],
  steps: [
    "PrÃ©chauffer votre four Ã  180Â°C.",
    "Dans un saladier, monter les blancs de deux Å“ufs en neige.",
    "Dans un autre saladier, verser la farine, la protÃ©ine, le cacao en poudre (ou le chocolat prÃ©alablement fondu), le sucre, la compote et 1 Å“uf entier. MÃ©langer pour obtenir une pÃ¢te bien lisse et homogÃ¨ne. Ajouter 1 pincÃ©e de sel.",
    "Incorporer les blancs en neige avec une spatule sans les casser.",
    "Verser la prÃ©paration dans un moule rectangulaire Ã  brownie et faire cuire 20 minutes Ã  180Â°C.",
  ],
},
{
  id: "mass-salade-pates",
  title: "Bowl sucrÃ© fruits rouges & granola",
  flavor: "sucre",
  prepTime: "5 Ã  7 min",
  servings: "1 pers",
  image: fruitsRougesGranolaImg,
  ingredients: [
    "150 Ã  200 g de fromage blanc ou yaourt grec",
    "50 g de myrtilles",
    "3 Ã  4 fraises",
    "30 g de granola",
    "1 cuillÃ¨re Ã  soupe de sirop dâ€™Ã©rable",
  ],
  steps: [
    "  PrÃ©parer les fruits",
    "Lave les fraises et coupe-les en morceaux. Rince les myrtilles si nÃ©cessaire.",
    "PrÃ©parer la base",
    "Verse le fromage blanc ou le yaourt grec dans un bol. Lisse lÃ©gÃ¨rement Ã  la cuillÃ¨re.",
    "Ajouter les toppings",
    "Ajoute les myrtilles et les fraises sur le yaourt. Parseme le granola par-dessus.",
    "Finaliser",
    "Verse le sirop dâ€™Ã©rable sur lâ€™ensemble.",
  ],
},
]

const healthyRecipes: Recipe[] = [
{
  id: "healthy-parfait",
  title: "Burrito bowl healthy",
  flavor: "sale",
  prepTime: "35 Ã  40 min",
  servings: "1 pers",
  image: bowlPouletImg,
  ingredients: [
    "Base & protÃ©ines",
    "120 g de blanc de poulet",
    "200 g de patate douce",
    "LÃ©gumes",
    "1/4 dâ€™oignon rouge",
    "80 g de tomates cerises",
    "1/4 de poivron rouge",
    "1/4 de poivron jaune",
    "1/2 avocat",
    "Sauce & assaisonnement",
    "30 g de crÃ¨me fraÃ®che lÃ©gÃ¨re",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Jus dâ€™1/2 citron vert",
    "Persil frais (selon goÃ»t)",
    "1/2 cuillÃ¨re Ã  cafÃ© de paprika",
    "1/2 cuillÃ¨re Ã  cafÃ© de poudre dâ€™ail",
    "1/2 cuillÃ¨re Ã  cafÃ© dâ€™Ã©pices cajun",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire la patate douce",
    "PrÃ©chauffe le four Ã  200Â°C. Ã‰pluche la patate douce et coupe-la en dÃ©s. DÃ©pose-la sur une plaque, ajoute la moitiÃ© de lâ€™huile dâ€™olive, le paprika, la poudre dâ€™ail, un peu de sel et poivre. MÃ©lange et enfourne pour 25 Ã  30 minutes, jusqu'Ã  ce quâ€™elle soit tendre et dorÃ©e.",
    "Cuire le poulet",
    "Coupe le poulet en morceaux. Fais chauffer une poÃªle Ã  feu moyen avec le reste de lâ€™huile dâ€™olive. Ajoute le poulet, les Ã©pices cajun, sale et poivre. Fais cuire 5 Ã  7 minutes jusqu'Ã  ce quâ€™il soit bien dorÃ© et cuit Ã  cÅ“ur.",
    "PrÃ©parer les lÃ©gumes frais",
    "Ã‰mince finement lâ€™oignon rouge. Coupe les tomates cerises en deux. Coupe les poivrons en fines laniÃ¨res. Coupe lâ€™avocat en tranches.",
    "PrÃ©parer la sauce",
    "Dans un petit bol, mÃ©lange la crÃ¨me fraÃ®che lÃ©gÃ¨re avec le jus de citron vert, du sel et du poivre.",
    "Assembler le burrito bowl",
    "Dans un bol : DÃ©pose la patate douce rÃ´tie. Ajoute le poulet. Dispose les poivrons, tomates cerises et lâ€™oignon rouge. Ajoute lâ€™avocat.",
    "Finaliser",
    "Ajoute la sauce. Parseme de persil frais ciselÃ©. Ajoute un filet de jus de citron vert si souhaitÃ©.",
  ],
},
{
  id: "healthy-granola",
  title: "Granola croustillant maison",
  flavor: "sucre",
  prepTime: "35 Ã  45 min",
  servings: "1 pers",
  image: granolaMaisonImg,
  ingredients: [
    "250 g de flocons dâ€™avoine",
    "60 g dâ€™amandes",
    "60 g de noisettes",
    "60 g de noix",
    "3 cuillÃ¨res Ã  soupe de miel",
    "1 cuillÃ¨re Ã  cafÃ© de cannelle",
    "1 pincÃ©e de sel",
  ],
  steps: [
    "  PrÃ©chauffer le four",
    "PrÃ©chauffe le four Ã  170Â°C.",
    "PrÃ©parer les fruits secs",
    "Concasse grossiÃ¨rement les amandes, noisettes et noix.",
    "MÃ©langer les ingrÃ©dients secs",
    "Dans un grand saladier, mÃ©lange : les flocons dâ€™avoine, les fruits secs concassÃ©s, la cannelle, la pincÃ©e de sel.",
    "Ajouter le miel",
    "Ajoute le miel et mÃ©lange bien pour enrober lâ€™ensemble des ingrÃ©dients.",
    "Enfourner",
    "Ã‰tale le mÃ©lange en une couche uniforme sur une plaque recouverte de papier cuisson.",
    "Cuisson",
    "Enfourne pour 20 Ã  25 minutes. Remue le granola toutes les 8 Ã  10 minutes pour une cuisson homogÃ¨ne.",
    "Refroidissement",
    "Sors le granola du four et laisse-le refroidir complÃ¨tement : il deviendra croustillant en refroidissant.",
    "Conservation",
    "Conserve le granola dans un bocal hermÃ©tique Ã  tempÃ©rature ambiante.",
  ],
},
{
  id: "healthy-tartine-avocat",
  title: "Bowl au thon",
  flavor: "sale",
  prepTime: "20 Ã  25 min",
  servings: "1 pers",
  image: bowlThonImg,
  ingredients: [
    "120 g de thon au naturel (Ã©gouttÃ©)",
    "60 g de riz cru",
    "1/2 avocat",
    "1/2 concombre",
    "1 petite tomate",
    "1 Å“uf",
    "1 cuillÃ¨re Ã  cafÃ© de graines de sÃ©same",
    "Pour la vinaigrette",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "1 cuillÃ¨re Ã  cafÃ© de vinaigre (ou jus de citron)",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte et laisse tiÃ©dir.",
    "Cuire lâ€™Å“uf",
    "Plonge lâ€™Å“uf dans de lâ€™eau bouillante et fais-le cuire 9 Ã  10 minutes pour un Å“uf dur. Refroidis-le sous lâ€™eau froide, Ã©caille-le et coupe-le en quartiers.",
    "PrÃ©parer les lÃ©gumes",
    "Coupe lâ€™avocat en tranches ou en dÃ©s. Coupe le concombre en rondelles ou en dÃ©s. Coupe la tomate en morceaux.",
    "PrÃ©parer la vinaigrette",
    "Dans un petit bol, mÃ©lange lâ€™huile dâ€™olive, le vinaigre (ou jus de citron), le sel et le poivre.",
    "Assembler le bowl",
    "Dans un bol : DÃ©pose le riz. Ajoute le thon Ã©miettÃ©. Dispose lâ€™avocat, le concombre et la tomate. Ajoute lâ€™Å“uf dur.",
    "Finaliser",
    "Verse la vinaigrette sur le bowl. Parseme de graines de sÃ©same.",
  ],
},
{
  id: "healthy-bowl-mediterraneen",
  title: "Bowl mÃ©diterranÃ©en",
  flavor: "sale",
  prepTime: "20 Ã  25 min",
  servings: "1 pers",
  image: bowlMediteraneenImg,
  ingredients: [
    "Base",
    "60 g de quinoa ou riz cru",
    "100 g de pois chiches cuits (Ã©gouttÃ©s)",
    "LÃ©gumes & garnitures",
    "1/2 concombre",
    "1 tomate",
    "1/4 dâ€™oignon rouge",
    "50 g de feta Ã©miettÃ©e",
    "Olives noires (quelques-unes)",
    "Persil ou basilic frais",
    "Assaisonnement",
    "1 cuillÃ¨re Ã  soupe dâ€™huile dâ€™olive",
    "1 cuillÃ¨re Ã  cafÃ© de jus de citron",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire la base",
    "Fais cuire le quinoa ou le riz dans une casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte et laisse tiÃ©dir.",
    "PrÃ©parer les lÃ©gumes",
    "Coupe le concombre en dÃ©s. Coupe la tomate en morceaux. Ã‰mince finement lâ€™oignon rouge.",
    "PrÃ©parer les pois chiches",
    "Rince et Ã©goutte les pois chiches. Tu peux les utiliser tels quels ou les faire revenir rapidement Ã  la poÃªle avec un peu de sel.",
    "PrÃ©parer lâ€™assaisonnement",
    "Dans un petit bol, mÃ©lange lâ€™huile dâ€™olive, le jus de citron, le sel et le poivre.",
    "Assembler le bowl",
    "Dans un bol : DÃ©pose la base (quinoa ou riz). Ajoute les pois chiches. Dispose les lÃ©gumes. Ajoute la feta et les olives.",
    "Finaliser",
    "Verse lâ€™assaisonnement. Ajoute les herbes fraÃ®ches.",
  ],
},
{
  id: "healthy-soupe-verte",
  title: "Soupe verte detox",
  flavor: "sale",
  prepTime: "20 Ã  25 min",
  servings: "1 pers",
  image: soupeDetoxImg,
  ingredients: [
    "150 g de brocoli",
    "1 petite courgette",
    "50 g dâ€™Ã©pinards frais",
    "500 ml de bouillon de lÃ©gumes",
  ],
  steps: [
    "  PrÃ©parer les lÃ©gumes",
    "Lave le brocoli et coupe-le en petits bouquets. Lave la courgette et coupe-la en rondelles. Rince les Ã©pinards.",
    "Cuisson",
    "Verse le bouillon de lÃ©gumes dans une casserole. Ajoute le brocoli et la courgette. Porte Ã  Ã©bullition puis laisse cuire 10 Ã  12 minutes, jusqu'Ã  ce que les lÃ©gumes soient tendres.",
    "Ajouter les Ã©pinards",
    "Ajoute les Ã©pinards dans la casserole et laisse cuire 1 Ã  2 minutes, juste le temps quâ€™ils tombent.",
    "Mixer",
    "Mixe la soupe jusqu'Ã  obtenir une texture lisse et homogÃ¨ne.",
    "Servir",
    "GoÃ»te et ajuste lâ€™assaisonnement si nÃ©cessaire.",
  ],
},

 {
  id: "healthy-salade-pates",
  title: "Banana bread",
  flavor: "sucre",
  prepTime: "55 Ã  65 min",
  servings: "1 pers",
  image: bananaBreadImg,
  ingredients: [
    "3 bananes mÃ»res (dont 1 pour la dÃ©coration)",
    "2 Å“ufs ou 100 g de compote",
    "150 g de farine",
    "50 g de poudre dâ€™amande",
    "80 g de sucre roux",
    "50 g dâ€™huile vÃ©gÃ©tale (cacahuÃ¨te, coco ou tournesol)",
    "100 ml de lait dâ€™amande ou de coco",
    "1/2 sachet de levure chimique",
    "1 cuillÃ¨re Ã  cafÃ© de bicarbonate",
    "1 pincÃ©e de sel",
    "1 sachet de sucre vanillÃ©",
    "1 cuillÃ¨re Ã  cafÃ© de cannelle",
  ],
  steps: [
    "  PrÃ©chauffer le four",
    "PrÃ©chauffe le four Ã  180Â°C.",
    "PrÃ©parer les bananes",
    "Ã‰pluche et mixe 2 bananes jusqu'Ã  obtenir une purÃ©e lisse. RÃ©serve la 3áµ‰ banane pour la dÃ©coration.",
    "PrÃ©parer lâ€™appareil",
    "Dans un grand saladier : Bats les Å“ufs avec le sucre roux et le sucre vanillÃ©. Ajoute la cannelle et mÃ©lange. Incorpore lâ€™huile vÃ©gÃ©tale. Ajoute la purÃ©e de bananes. Verse le lait vÃ©gÃ©tal. MÃ©lange jusqu'Ã  obtenir une prÃ©paration homogÃ¨ne.",
    "Ajouter les ingrÃ©dients secs",
    "Ajoute : la farine, la levure chimique, le bicarbonate, le sel, la poudre dâ€™amande. MÃ©lange dÃ©licatement jusqu'Ã  obtenir une pÃ¢te lisse.",
    "Mise en moule",
    "Huile lÃ©gÃ¨rement un moule. Verse la prÃ©paration dans le moule. Coupe la banane rÃ©servÃ©e en deux dans la longueur et dÃ©pose-la sur le dessus.",
    "Cuisson",
    "Enfourne Ã  180Â°C pendant 40 Ã  45 minutes. VÃ©rifie la cuisson avec la pointe dâ€™un couteau : elle doit ressortir sÃ¨che.",
    "Refroidissement",
    "Laisse tiÃ©dir avant de dÃ©mouler et de dÃ©couper.",
  ],
},
{
  id: "healthy-overnight-oats",
  title: "Brochettes de poulet, salade fraÃ®che & boulghour Ã  la tomate",
  flavor: "sale",
  prepTime: "30 Ã  35 min",
  servings: "1 pers",
  image: brochettesImg,
  ingredients: [
    "Pour les brochettes",
    "150 g de blanc de poulet",
    "1/4 dâ€™oignon rouge",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Sel et poivre",
    "Paprika ou herbes de Provence (optionnel)",
    "Pour la salade",
    "1/2 concombre",
    "1 tomate",
    "Herbes fraÃ®ches (persil, menthe ou coriandre)",
    "Sel et poivre",
    "Pour le boulghour Ã  la tomate",
    "60 g de boulghour cru",
    "1 cuillÃ¨re Ã  soupe de concentrÃ© de tomate",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Sel et poivre",
    "Pour la sauce Ã  la grecque",
    "100 g de yaourt grec",
    "1/4 de concombre rÃ¢pÃ©",
    "1 petite gousse dâ€™ail",
    "1 cuillÃ¨re Ã  cafÃ© de jus de citron",
    "Sel et poivre",
    "Herbes fraÃ®ches (aneth ou menthe, optionnel)",
  ],
  steps: [
    "  PrÃ©parer la sauce Ã  la grecque",
    "RÃ¢pe le concombre et presse-le pour enlever lâ€™excÃ¨s dâ€™eau. Dans un bol, mÃ©lange le yaourt grec, le concombre rÃ¢pÃ©, lâ€™ail finement hachÃ©, le jus de citron, le sel, le poivre et les herbes si utilisÃ©es. RÃ©serve au frais.",
    "PrÃ©parer le boulghour Ã  la tomate",
    "Fais cuire le boulghour dans de lâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte, ajoute le concentrÃ© de tomate, lâ€™huile dâ€™olive, le sel et le poivre. MÃ©lange et rÃ©serve.",
    "PrÃ©parer les brochettes",
    "Coupe le poulet en cubes et lâ€™oignon rouge en morceaux. Enfile-les sur les brochettes. Badigeonne dâ€™huile dâ€™olive, sale, poivre et ajoute les Ã©pices si souhaitÃ©.",
    "Cuire les brochettes",
    "Fais cuire les brochettes dans une poÃªle-grill ou sur un grill bien chaud pendant 8 Ã  10 minutes, en les retournant rÃ©guliÃ¨rement, jusqu'Ã  cuisson complÃ¨te.",
    "PrÃ©parer la salade",
    "Coupe le concombre et la tomate en morceaux. MÃ©lange avec les herbes, le sel et le poivre.",
    "Servir",
    "Dispose le boulghour Ã  la tomate dans lâ€™assiette. Ajoute les brochettes de poulet. Ajoute la salade fraÃ®che. Accompagne avec la sauce Ã  la grecque.",
  ],
},
{
  id: "healthy-smoothie-glow",
  title: "Smoothie glow mangue passion",
  flavor: "sucre",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieMangueImg,
  ingredients: [
    "150 g de mangue (fraÃ®che ou surgelÃ©e)",
    "1 fruit de la passion",
    "200 ml de lait vÃ©gÃ©tal (amande, coco lÃ©ger ou avoine)",
    "100 g de yaourt nature ou yaourt grec allÃ©gÃ©",
    "1 cuillÃ¨re Ã  cafÃ© de jus de citron (optionnel)",
    "Quelques glaÃ§ons (optionnel)",
  ],
  steps: [
    "Coupe la mangue en morceaux si elle est fraÃ®che.",
    "RÃ©cupÃ¨re la pulpe du fruit de la passion Ã  lâ€™aide dâ€™une cuillÃ¨re.",
    "Verse le lait vÃ©gÃ©tal dans le blender.",
    "Ajoute la mangue, la pulpe de passion et le yaourt.",
    "Ajoute le jus de citron et les glaÃ§ons si souhaitÃ©.",
    "Mixe pendant 30 Ã  60 secondes, jusqu'Ã  obtenir une texture lisse et onctueuse.",
    "Verse dans un verre et consomme immÃ©diatement.",
  ],
},
{
  id: "healthy-wrap-legumes",
  title: "Brownie salÃ© au brocoli, feta & lardons",
  flavor: "sale",
  prepTime: "60 Ã  65 min",
  servings: "1 pers",
  image: brownieSaleImg,
  ingredients: [
    "1 brocoli",
    "2 Å“ufs",
    "160 g de farine",
    "1/2 feta",
    "Lardons",
    "250 ml de lait",
    "ComtÃ© rÃ¢pÃ©",
    "Huile dâ€™olive",
    "Sel",
    "Poivre",
    "Ail en poudre",
  ],
  steps: [
    "  PrÃ©parer le brocoli",
    "DÃ©taille le brocoli en petits bouquets. Fais-le cuire dans de lâ€™eau bouillante salÃ©e pendant 5 Ã  7 minutes, jusqu'Ã  ce quâ€™il soit tendre. Ã‰goutte bien et coupe-le grossiÃ¨rement. RÃ©serve.",
    "Cuire les lardons",
    "Fais revenir les lardons dans une poÃªle chaude sans ajout de matiÃ¨re grasse jusqu'Ã  ce quâ€™ils soient dorÃ©s. Ã‰goutte-les sur du papier absorbant et rÃ©serve.",
    "PrÃ©chauffer le four",
    "PrÃ©chauffe le four Ã  180Â°C.",
    "PrÃ©parer lâ€™appareil",
    "Dans un grand saladier : Bats les Å“ufs. Ajoute le lait et mÃ©lange. Incorpore la farine progressivement en fouettant pour Ã©viter les grumeaux. Assaisonne avec le sel, le poivre et lâ€™ail en poudre.",
    "Ajouter les garnitures",
    "Ajoute Ã  la prÃ©paration : le brocoli, la feta Ã©miettÃ©e, les lardons, une poignÃ©e de comtÃ© rÃ¢pÃ©. MÃ©lange dÃ©licatement pour bien rÃ©partir les ingrÃ©dients.",
    "Enfourner",
    "Huile lÃ©gÃ¨rement un moule avec de lâ€™huile dâ€™olive. Verse la prÃ©paration et lisse la surface. Ajoute un peu de comtÃ© rÃ¢pÃ© sur le dessus. Enfourne pour 35 Ã  40 minutes, jusqu'Ã  ce que le brownie soit bien dorÃ© et pris Ã  cÅ“ur.",
    "Repos et dÃ©coupe",
    "Laisse tiÃ©dir quelques minutes avant de dÃ©couper en parts.",
  ],
},
{
  id: "healthy-tofu-bowl",
  title: "Biscuits croustillants avoine & chocolat",
  flavor: "sucre",
  prepTime: "25 Ã  30 min",
  servings: "1 pers",
  image: biscuitsAvoineImg,
  ingredients: [
    "1 banane mÃ»re Ã©crasÃ©e",
    "100 g de flocons dâ€™avoine",
    "50 g de chocolat noir (en morceaux ou pÃ©pites)",
    "8 Ã  10 noisettes entiÃ¨res",
  ],
  steps: [
    "  PrÃ©chauffer le four",
    "PrÃ©chauffe le four Ã  180Â°C.",
    "PrÃ©parer la pÃ¢te",
    "Dans un bol, Ã©crase la banane Ã  la fourchette jusqu'Ã  obtenir une purÃ©e lisse. Ajoute les flocons dâ€™avoine et mÃ©lange jusqu'Ã  obtenir une pÃ¢te homogÃ¨ne.",
    "Former les biscuits",
    "Recouvre une plaque de papier cuisson. DÃ©pose des petits tas de pÃ¢te et aplatis-les lÃ©gÃ¨rement pour former des biscuits.",
    "Ajouter le chocolat et la noisette",
    "DÃ©pose quelques morceaux de chocolat sur chaque biscuit. Ajoute une noisette entiÃ¨re au centre de chaque biscuit.",
    "Cuisson",
    "Enfourne pour 15 Ã  18 minutes, jusqu'Ã  ce que les biscuits soient bien dorÃ©s et croustillants sur les bords.",
    "Refroidissement",
    "Laisse refroidir sur une grille : ils deviendront plus croustillants en refroidissant.",
  ],
},
{
  id: "healthy-saumon-tray",
  title: "Saumon au four citron",
  flavor: "sale",
  prepTime: "25 Ã  30 min",
  servings: "1 pers",
  image: saumonCitronImg,
  ingredients: [
    "120 g de saumon frais",
    "60 g de riz cru",
    "150 g dâ€™asperges vertes",
    "1 gousse dâ€™ail",
    "5 g de beurre",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Persil frais (selon goÃ»t)",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole dâ€™eau bouillante salÃ©e selon le temps indiquÃ©. Ã‰goutte et rÃ©serve.",
    "PrÃ©parer les asperges",
    "Lave les asperges et coupe les extrÃ©mitÃ©s dures. Fais-les cuire Ã  la vapeur ou dans de lâ€™eau bouillante salÃ©e pendant 5 Ã  7 minutes, jusqu'Ã  ce quâ€™elles soient tendres mais encore lÃ©gÃ¨rement croquantes. Ã‰goutte et rÃ©serve.",
    "Cuire le saumon",
    "Sale et poivre le saumon. Fais chauffer lâ€™huile dâ€™olive dans une poÃªle Ã  feu moyen. DÃ©pose le saumon cÃ´tÃ© peau (ou cÃ´tÃ© prÃ©sentation) et fais cuire 3 Ã  4 minutes. Retourne le saumon et poursuis la cuisson 2 Ã  3 minutes.",
    "PrÃ©parer la sauce citron-ail",
    "Baisse le feu. Ajoute le beurre et lâ€™ail hachÃ© dans la poÃªle. Laisse fondre doucement en arrosant le saumon pendant 30 Ã  60 secondes, sans faire brÃ»ler lâ€™ail.",
    "Finaliser",
    "Retire la poÃªle du feu. Ajoute le persil ciselÃ© et un peu de jus de citron si souhaitÃ©. Rectifie lâ€™assaisonnement.",
    "Servir",
    "Dispose le riz dans lâ€™assiette. Ajoute le saumon au citron et les asperges.",
  ],
},

 {
  id: "healthy-potage-lentilles",
  title: "Pudding de chia coco & fraises",
  flavor: "sucre",
  prepTime: "5 Ã  7 min",
  servings: "1 pers",
  image: puddingChiaImg,
  ingredients: [
    "250 ml de lait vÃ©gÃ©tal",
    "3 cuillÃ¨res Ã  soupe de graines de chia",
    "1 cuillÃ¨re Ã  soupe de miel",
    "100 g de yaourt Ã  la noix de coco",
    "30 g de granola",
    "4 Ã  5 fraises",
  ],
  steps: [
    "  Faire gonfler les graines de chia",
    "Dans un bol ou un bocal, verse le lait vÃ©gÃ©tal. Ajoute les graines de chia et mÃ©lange bien. Laisse reposer 10 minutes, puis remue Ã  nouveau pour Ã©viter les grumeaux.",
    "Repos",
    "Couvre et place au rÃ©frigÃ©rateur pendant au moins 2 heures, idÃ©alement toute la nuit, jusqu'Ã  ce que le pudding Ã©paississe.",
    "Ajouter le miel",
    "Une fois le pudding bien pris, ajoute le miel et mÃ©lange.",
    "PrÃ©parer les fraises",
    "Lave les fraises et coupe-les en morceaux.",
    "Monter le pudding",
    "Ajoute le yaourt Ã  la noix de coco sur le pudding de chia. Ajoute les fraises. Parseme de granola sur le dessus.",
    "Servir",
    "Consomme immÃ©diatement pour garder le granola croustillant.",
  ],
},
{
  id: "healthy-quinoa-menthe",
  title: "Salade CÃ©sar healthy",
  flavor: "sale",
  prepTime: "20 Ã  25 min",
  servings: "1 pers",
  image: saladeCesarImg,
  ingredients: [
    "Pour la salade",
    "100 g de blanc de poulet",
    "1 Å“uf",
    "80 g de salade (romaine ou autre)",
    "1 petite tomate",
    "20 g de parmesan en copeaux",
    "20 g de croÃ»tons de pain",
    "Pour la sauce CÃ©sar maison (healthy)",
    "40 g de yaourt grec nature",
    "1 cuillÃ¨re Ã  cafÃ© de moutarde",
    "1 cuillÃ¨re Ã  cafÃ© de jus de citron",
    "1 cuillÃ¨re Ã  cafÃ© dâ€™huile dâ€™olive",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire lâ€™Å“uf",
    "Plonge lâ€™Å“uf dans de lâ€™eau bouillante et fais-le cuire 9 minutes pour un Å“uf dur. Refroidis-le, Ã©caille-le et coupe-le en quartiers.",
    "Cuire le poulet",
    "Fais chauffer une poÃªle Ã  feu moyen. Fais cuire le poulet 5 Ã  7 minutes, en le retournant, jusqu'Ã  ce quâ€™il soit bien dorÃ© et cuit Ã  cÅ“ur. Sale, poivre et coupe-le en tranches.",
    "PrÃ©parer la sauce CÃ©sar",
    "Dans un bol, mÃ©lange le yaourt grec, la moutarde, le jus de citron, lâ€™huile dâ€™olive, le sel et le poivre jusqu'Ã  obtenir une sauce lisse.",
    "PrÃ©parer les lÃ©gumes",
    "Lave et essore la salade. Coupe la tomate en quartiers.",
    "Assembler la salade",
    "Dans un grand bol ou une assiette : DÃ©pose la salade. Ajoute le poulet. Ajoute lâ€™Å“uf dur. Ajoute la tomate. Ajoute les croÃ»tons.",
    "Finaliser",
    "Verse la sauce CÃ©sar maison sur la salade. Ajoute les copeaux de parmesan et mÃ©lange lÃ©gÃ¨rement.",
  ],
},
{
  id: "healthy-snack-energetique",
  title: "Salade de fruits fraÃ®che Ã  la menthe & citron",
  flavor: "sucre",
  prepTime: "8 Ã  10 min",
  servings: "1 pers",
  image: saladeDeFruitImg,
  ingredients: [
    "80 g de myrtilles",
    "4 Ã  5 fraises",
    "1 kiwi",
    "100 g de mangue",
    "Quelques feuilles de menthe fraÃ®che",
    "Jus dâ€™1/2 citron",
  ],
  steps: [
    "  PrÃ©parer les fruits",
    "Rince les myrtilles. Lave, Ã©queute et coupe les fraises en morceaux. Ã‰pluche le kiwi et coupe-le en dÃ©s. Ã‰pluche la mangue et coupe-la en morceaux.",
    "Ciseler la menthe",
    "Lave et cisele finement les feuilles de menthe.",
    "Assembler la salade",
    "DÃ©pose tous les fruits dans un saladier ou un bol. Ajoute la menthe ciselÃ©e.",
    "Assaisonner",
    "Verse le jus de citron sur les fruits. MÃ©lange dÃ©licatement pour ne pas Ã©craser les fruits.",
    "Servir",
    "Place au frais quelques minutes avant de servir si souhaitÃ©.",
  ],
},
]

const DIET_HEADINGS = {
  sweet: {
    eyebrow: "SucrÃ©",
    title: "Ma Diet",
    description: "Toutes les idÃ©es sucrÃ©es du moment.",
  },
  savory: {
    eyebrow: "SalÃ©",
    title: "Ma Diet",
    description: "Toutes les idÃ©es salÃ©es du moment.",
  },
} as const

const RECIPE_FAVORITES_KEY = "planner.diet.recipeFavorites"

const DietClassicPage = () => {
  const { userEmail } = useAuth()
  const favoritesKey = useMemo(() => buildUserScopedKey(userEmail, RECIPE_FAVORITES_KEY), [userEmail])
  const [tab, setTab] = useState<"sweet" | "savory" | "favorites">("sweet")
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = window.localStorage.getItem(favoritesKey)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const allRecipes = useMemo(() => [...massRecipes, ...healthyRecipes], [])
  const currentHeading = tab === "favorites" ? null : DIET_HEADINGS[tab]
  const favoriteRecipes = useMemo(() => allRecipes.filter((recipe) => favoriteIds.has(recipe.id)), [allRecipes, favoriteIds])
  const filteredRecipes = useMemo(() => {
    if (tab === "favorites") return favoriteRecipes
    const flavor = tab === "sweet" ? "sucre" : "sale"
    return allRecipes.filter((recipe) => recipe.flavor === flavor)
  }, [allRecipes, favoriteRecipes, tab])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(favoritesKey, JSON.stringify(Array.from(favoriteIds)))
    } catch {
      // ignore
    }
  }, [favoriteIds, favoritesKey])

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
    )

 return (
  <>
    <div className="diet-hero-image" aria-hidden="true">
      <img src={dietHero} alt="Ambiance diet" />
    </div>
    <div className="page-accent-bar" aria-hidden="true" />
    <main className="diet-gymgirl-page">
      <article className="diet-blog">
        {currentHeading ? (
          <>
            <PageHeading
              eyebrow={currentHeading.eyebrow}
              title="Ma Diet"
              className="diet-page-heading"
            />
            <p className="diet-heading__description">{currentHeading.description}</p>
          </>
        ) : (
          <>
            <PageHeading
              eyebrow="Favoris"
              title="Ma Diet"
              className="diet-page-heading"
            />
            <p className="diet-heading__description">
              Retrouve ici toutes les recettes que tu as aimÃ©es.
            </p>
          </>
        )}
        <div className="diet-crosslink">
          <div>
            <p className="diet-crosslink__label">Planifier ta semaine</p>
            <p className="diet-crosslink__text">
              Passe sur la page Alimentation pour organiser tes repas et ta liste de courses.
            </p>
          </div>
          <Link to="/alimentation" className="pill">
            Planifier les repas
          </Link>
        </div>
        <div className="diet-toggle diet-toggle--heading">
          <button
            type="button"
            className={tab === "sweet" ? "is-active" : ""}
            onClick={() => setTab("sweet")}
          >
            SucrÃ©
          </button>
          <button
            type="button"
            className={tab === "savory" ? "is-active" : ""}
            onClick={() => setTab("savory")}
          >
            SalÃ©
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
                  style={{ backgroundImage: `url(${recipe.image})` }}
                  onClick={() => setSelectedRecipe(recipe)}
                >
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
                          toggleFavorite(recipe.id)
                        }}
                        aria-label="Ajouter en favoris"
                      >
                        {renderHeartIcon(favoriteIds.has(recipe.id))}
                      </button>
                    </div>
                    <div className="diet-recipe-card__body">
                      <h3>{recipe.title}</h3>
                      <div className="diet-recipe-meta">
                        <span className="diet-info-pill">
                          {recipe.flavor === "sucre" ? "SucrÃ©" : "SalÃ©"}
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
            <p className="diet-heading__description">
              Ajoute des recettes en favoris pour les retrouver ici.
            </p>
          )
        ) : (
          <div className="diet-recipe-grid">
            {filteredRecipes.map((recipe) => (
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
                      {renderHeartIcon(favoriteIds.has(recipe.id))}
                    </button>
                  </div>
                  <div className="diet-recipe-card__body">
                    <h3>{recipe.title}</h3>
                    <div className="diet-recipe-meta">
                      <span className="diet-info-pill">
                        {recipe.flavor === "sucre" ? "SucrÃ©" : "SalÃ©"}
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

        {selectedRecipe ? (
  <div className="diet-recipe-modal" role="dialog" aria-label={`Recette ${selectedRecipe.title}`}>
    <div className="diet-recipe-modal__backdrop" onClick={() => setSelectedRecipe(null)} />
  <div className="diet-recipe-modal__panel">
    <div className="diet-recipe-modal__cover">
      <img src={selectedRecipe.image} alt={selectedRecipe.title} className="diet-recipe-modal__image" />
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
        </div>
      </header>
      <div className="diet-recipe-modal__body">
          <section>
            <h4>IngrÃ©dients</h4>
            <ul>
              {selectedRecipe.ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Ã‰tapes</h4>
            <ol>
              {selectedRecipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          {selectedRecipe.toppings ? (
            <section>
              <h4>{"IdÃ©es de toppings (optionnel)"}</h4>
              <ul>
                {selectedRecipe.toppings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {selectedRecipe.tips ? (
            <section>
              <h4>{"ðŸ’¡ Astuce"}</h4>
              <ul>
                {selectedRecipe.tips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
    <footer className="diet-recipe-modal__actions">
      <button type="button" onClick={() => setSelectedRecipe(null)}>
        Fermer
      </button>
    </footer>
  </div>
) : null}
</main>
<div className="page-footer-bar" aria-hidden="true" />
</>
)
}

export default DietClassicPage





