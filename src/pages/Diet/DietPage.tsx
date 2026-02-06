import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"
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
import brownieSaleImg from "../../assets/brownie-sale.jpeg"
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

type RecipeSnapshot = {
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
  title: "Pancake protéiné",
  flavor: "sucre",
  prepTime: "10 à 15 min",
  servings: "1 pers",
  image: pancakesProteineImg,
  ingredients: [
    "1 œuf",
    "25 ml de lait",
    "35 g de farine",
    "30 g de fromage blanc",
    "20 g de whey",
    "1 cuillère à soupe de levure chimique",
    "Quelques gouttes d'arôme vanille",
  ],
  steps: [
    "Dans un bol, casse l'œuf et fouette-le légèrement.",
    "Ajoute le lait et le fromage blanc, puis mélange jusqu'à obtenir une texture lisse.",
    "Incorpore la farine, la whey et la levure chimique.",
    "Mélange soigneusement pour éviter les grumeaux.",
    "Ajoute les gouttes de vanille et mélange une dernière fois. La pâte doit être épaisse mais fluide.",
    "Fais chauffer une poêle antiadhésive à feu moyen (légèrement graissée si nécessaire).",
    "Verse de petites portions de pâte pour former les pancakes.",
    "Laisse cuire 1 à 2 minutes, jusqu'à ce que des bulles apparaissent, puis retourne.",
    "Poursuis la cuisson 1 minute de l'autre côté.",
  ],
  toppings: [
    "Fruits rouges",
    "Beurre de cacahuète",
    "Skyr ou fromage blanc",
    "Chocolat noir fondu",
    "Sirop d'érable (léger)",
  ],
  tips: [
    "Astuce : si la pâte est trop épaisse, ajoute quelques gouttes de lait. Si elle est trop liquide, ajoute un peu de farine.",
  ],
},
{
  id: "mass-bowl-saumon",
  title: "Saumon mariné sriracha & riz",
  flavor: "sale",
  prepTime: "35 à 50 min",
  servings: "1 pers",
  image: saumonBowlImg,
  ingredients: [
    "Pour le saumon mariné",
    "500 g de saumon sans peau",
    "1/4 de tasse de sauce soja",
    "1 cuillère à soupe de vinaigre de riz",
    "1 cuillère à café d’huile de sésame",
    "1 cuillère à café de miel",
    "2 gousses d’ail hachées",
    "1 cuillère à soupe de pâte de gingembre",
    "2 cuillères à soupe de sriracha",
    "Pour la sauce",
    "2 cuillères à soupe de yaourt grec",
    "2 cuillères à café de sriracha",
    "2 cuillères à café de vinaigre de riz",
    "Pour les accompagnements",
    "70 g de riz cru",
    "1 mini concombre",
    "Carottes râpées (quantité selon préférence)",
    "1/2 avocat",
  ],
  steps: [
    "Préparer la marinade",
    "Dans un bol, mélange la sauce soja, le vinaigre de riz, l'huile de sésame, le miel, l'ail haché, la pâte de gingembre et la sriracha jusqu'à obtenir une marinade homogène.",
    "Mariner le saumon",
    "Coupe le saumon en pavés ou en cubes. Dépose-le dans un plat, verse la marinade, mélange délicatement pour bien enrober le poisson. Couvre et laisse mariner 15 à 30 minutes au réfrigérateur.",
    "Préparer les accompagnements",
    "Lave le mini concombre et coupe-le en fines rondelles ou demi-lunes. Râpe les carottes. Coupe le demi-avocat en tranches ou en dés. Réserve au frais.",
    "Préparer la sauce",
    "Dans un petit bol, mélange le yaourt grec, la sriracha et le vinaigre de riz jusqu'à obtenir une sauce lisse. Réserve au frais.",
    "Cuire le saumon",
    "Fais chauffer une poêle à feu moyen. Dépose le saumon avec un peu de marinade et fais-le cuire 2 à 3 minutes par face, jusqu'à ce qu'il soit bien doré et cuit à cœur.",
    "Dressage",
    "Dispose le saumon dans l'assiette ou le bol, ajoute les carottes râpées, le concombre et l'avocat, puis nappe ou accompagne avec la sauce au yaourt épicée.",
  ],
},

 {
  id: "mass-wrap-poulet",
  title: "Wrap poulet croquant",
  flavor: "sale",
  prepTime: "30 à 45 min",
  servings: "1 pers",
  image: wrapPouletImg,
  ingredients: [
    "Pour le poulet",
    "600 g de blanc de poulet coupé en lanières",
    "3 gousses d’ail",
    "1 cuillère à soupe d’origan",
    "1 cuillère à soupe de paprika",
    "1 cuillère à café de poudre d’oignon",
    "1 cuillère à café de flocons de piment",
    "1 cuillère à café de sel et poivre",
    "Jus de citron (selon goût)",
    "Pour la sauce",
    "100 g de yaourt écrémé",
    "20 g de sriracha",
    "1 gousse d’ail émincée",
    "Persil (selon goût)",
    "Sel et poivre",
    "Pour le montage des wraps",
    "Tortillas faibles en calories",
    "Laitue",
    "Oignons rouges",
    "Tomates coupées en dés",
  ],
  steps: [
    "  Préparer la marinade du poulet",
    "Dans un grand bol, mélange : l’ail haché, l’origan, le paprika, la poudre d’oignon, les flocons de piment, le sel et le poivre. Ajoute le jus de citron, puis mélange. Incorpore les lanières de poulet et mélange bien pour les enrober. Laisse mariner au minimum 15 minutes (idéalement 30 minutes).",
    "Préparer la sauce",
    "Dans un bol, mélange : le yaourt écrémé, la sriracha, l’ail émincé, le persil, le sel et le poivre. Ajoute un peu de jus de citron selon ton goût. Mélange jusqu'à obtenir une sauce homogène. Réserve au frais.",
    "Préparer les garnitures",
    "Lave et coupe la laitue. Émince finement l’oignon rouge. Coupe les tomates en petits dés. Réserve l’ensemble.",
    "Cuire le poulet",
    "Fais chauffer une poêle à feu moyen. Ajoute le poulet mariné (sans ajouter de matière grasse si la poêle est antiadhésive). Fais cuire 5 à 7 minutes, en remuant régulièrement, jusqu'à ce que le poulet soit bien doré et cuit à cœur.",
    "Monter les wraps",
    "Fais légèrement chauffer les tortillas. Dépose : de la laitue, du poulet chaud, des tomates, de l’oignon rouge. Ajoute la sauce selon ton goût. Roule les wraps bien serrés.",
  ],
},
{
  id: "mass-omelette-power",
  title: "Omelette power à la feta",
  flavor: "sale",
  prepTime: "15 à 20 min",
  servings: "1 pers",
  image: omeletteFetaImg,
  ingredients: [
    "3 œufs",
    "50 g de feta émiettée",
    "100 g d’épinards frais",
    "Huile d’olive",
    "1 gousse d’ail",
    "1 petit oignon",
    "Sel et poivre",
  ],
  steps: [
    "  Préparer les ingrédients",
    "Épluche et émince finement l’oignon. Épluche et hache l’ail. Lave les épinards et égoutte-les.",
    "Cuire les légumes",
    "Fais chauffer un filet d’huile d’olive dans une poêle à feu moyen. Ajoute l’oignon et fais-le revenir 2 à 3 minutes jusqu'à ce qu’il soit translucide. Ajoute l’ail et fais revenir encore 30 secondes. Incorpore les épinards et laisse-les tomber 1 à 2 minutes, jusqu'à réduction.",
    "Préparer les œufs",
    "Dans un bol, bats les œufs avec le sel et le poivre.",
    "Cuire l’omelette",
    "Verse les œufs battus dans la poêle sur les légumes. Laisse cuire à feu doux quelques minutes, jusqu'à ce que les bords commencent à prendre.",
    "Ajouter la feta",
    "Répartis la feta émiettée sur l’omelette. Poursuis la cuisson doucement jusqu'à ce que l’omelette soit cuite à ton goût.",
    "Servir",
    "Plie l’omelette en deux et sers immédiatement.",
  ],
},
{
  id: "mass-smoothie-gain",
  title: "Smoothie banane beurre de cacahuète",
  flavor: "sucre",
  prepTime: "5 min",
  servings: "1 pers",
  image: smoothieBananeImg,
  ingredients: [
    "1 banane",
    "300 ml de lait végétal",
    "80 g de flocons d’avoine",
    "1 scoop de protéine whey",
    "1 cuillère à soupe de beurre de cacahuète",
    "1 cuillère à soupe de sirop d’érable",
    "Cannelle (facultatif)",
  ],
  steps: [
    "Épluche la banane et coupe-la en morceaux.",
    "Verse le lait végétal dans un blender.",
    "Ajoute les flocons d’avoine, la banane, la whey, le beurre de cacahuète et le sirop d’érable.",
    "Ajoute la cannelle si tu le souhaites.",
    "Mixe pendant 30 à 60 secondes, jusqu'à obtenir une texture lisse et homogène.",
    "Ajuste la texture : ajoute un peu de lait si le smoothie est trop épais. Mixe davantage si nécessaire.",
    "Verse dans un verre et consomme immédiatement.",
  ],
},
{
  id: "mass-pates-cremeuses",
  title: "Alfredo pasta protéiné",
  flavor: "sale",
  prepTime: "25 à 30 min",
  servings: "1 pers",
  image: alfredoPastaImg,
  ingredients: [
    "150 g de blanc de poulet",
    "80 g de pâtes (crues, au choix)",
    "150 g de champignons (de Paris ou autres)",
    "100 g de fromage blanc ou yaourt grec nature",
    "30 g de parmesan râpé",
    "1 gousse d’ail",
    "1 cuillère à café d’huile d’olive",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes séchées",
  ],
  steps: [
    "  Cuire les pâtes",
    "Fais cuire les pâtes dans une grande casserole d’eau bouillante salée selon le temps indiqué. Égoutte-les en conservant un peu d’eau de cuisson.",
    "Préparer le poulet",
    "Coupe le poulet en morceaux ou en lanières. Fais chauffer l’huile d’olive dans une poêle à feu moyen. Ajoute le poulet, sale, poivre et fais cuire 5 à 7 minutes jusqu'à ce qu’il soit bien doré et cuit à cœur. Réserve.",
    "Cuire les champignons",
    "Dans la même poêle, ajoute l’ail haché et fais revenir 30 secondes. Ajoute les champignons émincés et fais-les cuire 5 minutes, jusqu'à ce qu’ils rendent leur eau et dorent légèrement.",
    "Préparer la sauce Alfredo protéinée",
    "Baisse le feu. Ajoute le fromage blanc (ou yaourt grec) et mélange doucement. Incorpore le parmesan et mélange jusqu'à obtenir une sauce crémeuse. Ajoute un peu d’eau de cuisson des pâtes si nécessaire pour détendre la sauce.",
    "Assembler",
    "Ajoute les pâtes égouttées dans la poêle. Incorpore le poulet. Mélange bien pour enrober les pâtes de sauce.",
    "Ajuster et servir",
    "Rectifie l’assaisonnement (sel, poivre). Ajoute des herbes si souhaité et sers immédiatement.",
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
    "Pour le poulet",
    "150 g de blanc de poulet",
    "1 cuillère à café d’huile d’olive",
    "Sel et poivre",
    "Pour la sauce butter chicken",
    "100 g de yaourt grec nature",
    "1 cuillère à soupe de concentré de tomate",
    "1 cuillère à café de garam masala",
    "1/2 cuillère à café de paprika",
    "1/2 cuillère à café de curry",
    "1 gousse d’ail",
    "1/2 cuillère à café de gingembre (pâte ou moulu)",
    "Sel et poivre",
    "Pour l’accompagnement",
    "60 g de riz cru",
    "150 g de brocolis",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole d’eau bouillante salée selon le temps indiqué. Égoutte et réserve.",
    "Cuire les brocolis",
    "Fais cuire les brocolis à la vapeur ou dans de l’eau bouillante salée pendant 5 à 7 minutes, jusqu'à ce qu’ils soient tendres mais encore verts. Égoutte et réserve.",
    "Préparer le poulet",
    "Coupe le poulet en morceaux. Fais chauffer l’huile d’olive dans une poêle à feu moyen. Ajoute le poulet, sale, poivre et fais cuire 5 à 6 minutes jusqu'à ce qu’il soit bien doré et cuit à cœur. Réserve.",
    "Préparer la sauce",
    "Dans un bol, mélange : le yaourt grec, le concentré de tomate, l’ail haché, le gingembre, le garam masala, le paprika, le curry, le sel et le poivre.",
    "Assembler le butter chicken",
    "Baisse le feu. Remets le poulet dans la poêle. Ajoute la sauce et mélange délicatement. Laisse mijoter 3 à 5 minutes à feu doux, sans faire bouillir, jusqu'à obtenir une sauce crémeuse.",
    "Servir",
    "Dispose le riz dans l’assiette. Ajoute le butter chicken crémeux. Accompagne de brocolis.",
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
    "1 ou 2 tranches de pain (complet ou au choix)",
    "1 avocat mûr",
    "1 œuf",
    "Sel et poivre",
    "Un filet d’huile d’olive",
    "Jus de citron (facultatif)",
    "Une pincée de flocons de piment ou de paprika",
  ],
  steps: [
    "  Préparer l’avocat",
    "Coupe l’avocat en deux, retire le noyau et récupère la chair. Écrase-la à la fourchette dans un bol. Assaisonne avec le sel, le poivre et un filet de jus de citron si souhaité.",
    "Griller le pain",
    "Fais griller les tranches de pain jusqu'à ce qu’elles soient bien dorées et croustillantes.",
    "Cuire l’œuf",
    "Fais chauffer une petite poêle avec un filet d’huile d’olive. Casse l’œuf et fais-le cuire selon ta préférence : œuf au plat (jaune coulant) ou œuf mollet / poché. Sale et poivre légèrement.",
    "Monter l’avocado toast",
    "Étale l’avocat écrasé sur les tranches de pain chaud. Dépose l’œuf par-dessus.",
    "Finaliser",
    "Ajoute un peu de poivre, des flocons de piment ou du paprika si souhaité. Sers immédiatement.",
  ],
},
{
  id: "mass-chili-boost",
  title: "Bowl prise de masse au steak haché",
  flavor: "sale",
  prepTime: "25 à 30 min",
  servings: "1 pers",
  image: wrapPouletImg,
  ingredients: [
    "200 g de steak haché (5 à 10 % MG selon objectif)",
    "80 g de riz cru",
    "1/2 avocat",
    "1 œuf",
    "1 cuillère à café d’huile d’olive",
    "1 petit oignon",
    "Sel et poivre",
    "Optionnel :",
    "Épices (paprika, ail en poudre, cumin)",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole d’eau bouillante salée selon le temps indiqué. Égoutte et réserve.",
    "Cuire le steak haché",
    "Fais chauffer l’huile d’olive dans une poêle à feu moyen. Ajoute l’oignon émincé et fais-le revenir 2 minutes. Ajoute le steak haché, sale, poivre et émiette-le à la spatule. Fais cuire 4 à 6 minutes, jusqu'à cuisson souhaitée.",
    "Cuire l’œuf",
    "Dans une petite poêle, fais cuire l’œuf au plat ou mollet selon préférence.",
    "Préparer l’avocat",
    "Coupe le demi-avocat en tranches ou en dés.",
    "Assembler le bowl",
    "Dans un bol ou une assiette : dépose le riz. Ajoute le steak haché chaud. Ajoute l’œuf. Termine par l’avocat.",
  ],
},
{
  id: "mass-curry-coco",
  title: "Curry coco pois chiches",
  flavor: "sale",
  prepTime: "25 à 30 min",
  servings: "1 pers",
  image: curryPoischicheImg,
  ingredients: [
    "150 g de pois chiches cuits (égouttés)",
    "100 ml de lait de coco",
    "1/2 oignon",
    "1 gousse d’ail",
    "1 cuillère à soupe de concentré de tomate",
    "1 cuillère à café de curry en poudre",
    "1/2 cuillère à café de paprika",
    "Sel et poivre",
    "Persil frais",
    "Pour l’accompagnement",
    "60 g de riz cru",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole d’eau bouillante salée selon le temps indiqué. Égoutte et réserve.",
    "Préparer la base du curry",
    "Émince l’oignon et hache l’ail. Fais chauffer une poêle ou une casserole à feu moyen. Ajoute l’oignon et fais-le revenir 2 à 3 minutes jusqu'à ce qu’il soit translucide. Ajoute l’ail et fais revenir 30 secondes.",
    "Ajouter les épices et le concentré de tomate",
    "Ajoute le curry, le paprika et le concentré de tomate. Mélange et laisse cuire 1 minute pour développer les arômes.",
    "Ajouter les pois chiches et le lait de coco",
    "Ajoute les pois chiches égouttés et mélange. Verse le lait de coco, sale et poivre. Laisse mijoter 10 minutes à feu doux, en remuant de temps en temps.",
    "Finaliser",
    "Goûte et rectifie l’assaisonnement. Ajoute le persil ciselé hors du feu.",
    "Servir",
    "Sers le curry coco bien chaud avec le riz.",
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
    "1 steak haché (150 à 200 g, selon besoin calorique)",
    "300 g de pommes de terre",
    "150 g de haricots verts",
    "1 cuillère à soupe d’huile d’olive",
    "1 gousse d’ail (optionnel)",
    "Sel et poivre",
    "Optionnel :",
    "Persil ou herbes de Provence",
  ],
  steps: [
    "  Préparer les pommes de terre",
    "Épluche les pommes de terre et coupe-les en morceaux. Fais-les cuire dans une casserole d’eau bouillante salée pendant 15 à 20 minutes, jusqu'à ce qu’elles soient tendres. Égoutte et réserve.",
    "Cuire les haricots verts",
    "Fais cuire les haricots verts dans de l’eau bouillante salée ou à la vapeur pendant 8 à 10 minutes. Égoutte et réserve.",
    "Cuire le steak haché",
    "Fais chauffer l’huile d’olive dans une poêle à feu moyen. Ajoute l’ail haché si utilisé, puis le steak haché. Sale et poivre. Fais cuire 3 à 5 minutes par face selon la cuisson souhaitée.",
    "Assembler l’assiette",
    "Dispose les pommes de terre dans l’assiette. Ajoute le steak haché et les haricots verts. Parseme de persil ou d’herbes si souhaité.",
  ],
},

 {
  id: "mass-overnight-prot",
  title: "Overnight oats protéinés",
  flavor: "sucre",
  prepTime: "5 à 7 min",
  servings: "1 pers",
  image: overnightOatsImg,
  ingredients: [
    "50 g de flocons d’avoine",
    "1 cuillère à soupe de graines de chia",
    "1 scoop de protéine whey",
    "120 g de yaourt (nature)",
    "120 ml de lait d’amande",
    "50 g de framboises",
    "1 cuillère à soupe de pâte à tartiner Biscoff (sur le dessus)",
  ],
  steps: [
    "  Préparer la whey",
    "Dans un bol ou un shaker, mélange la whey avec le lait d’amande jusqu'à obtenir une texture bien lisse, sans grumeaux.",
    "Préparer la base",
    "Dans un bocal ou un bol, ajoute : les flocons d’avoine, les graines de chia, le yaourt. Mélange légèrement.",
    "Ajouter la whey",
    "Verse le mélange whey + lait d’amande dans le bocal. Mélange bien pour que tous les ingrédients soient homogènes.",
    "Ajouter les fruits",
    "Ajoute les framboises et mélange délicatement ou laisse-les sur le dessus selon ta préférence.",
    "Repos",
    "Couvre et place au réfrigérateur pendant au minimum 4 heures, idéalement toute la nuit.",
    "Finaliser",
    "Au moment de servir, ajoute la pâte à tartiner Biscoff sur le dessus.",
  ],
},
{
  id: "mass-brownie-beans",
  title: "Brownie protéiné",
  flavor: "sucre",
  prepTime: "30 à 35 min",
  servings: "1 pers",
  image: brownieProteineImg,
  ingredients: [
    "60 g de whey protéine isolate OVERSTIM.s",
    "200 g de compote de pomme bio",
    "2 blancs d’œufs",
    "1 œuf entier",
    "100 g de farine de blé T65 ou T80",
    "Sel",
    "4 cuillères à soupe de sucre roux ou de sucre de fleur de coco",
    "4 cuillères à soupe de chocolat en poudre ou de cacao en poudre ou 50 g de chocolat noir à pâtisser (70 à 85% de cacao)",
    "1 cuillère à soupe de levure chimique",
  ],
  steps: [
    "Préchauffer votre four à 180°C.",
    "Dans un saladier, monter les blancs de deux œufs en neige.",
    "Dans un autre saladier, verser la farine, la protéine, le cacao en poudre (ou le chocolat préalablement fondu), le sucre, la compote et 1 œuf entier. Mélanger pour obtenir une pâte bien lisse et homogène. Ajouter 1 pincée de sel.",
    "Incorporer les blancs en neige avec une spatule sans les casser.",
    "Verser la préparation dans un moule rectangulaire à brownie et faire cuire 20 minutes à 180°C.",
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
    "150 à 200 g de fromage blanc ou yaourt grec",
    "50 g de myrtilles",
    "3 à 4 fraises",
    "30 g de granola",
    "1 cuillère à soupe de sirop d’érable",
  ],
  steps: [
    "  Préparer les fruits",
    "Lave les fraises et coupe-les en morceaux. Rince les myrtilles si nécessaire.",
    "Préparer la base",
    "Verse le fromage blanc ou le yaourt grec dans un bol. Lisse légèrement à la cuillère.",
    "Ajouter les toppings",
    "Ajoute les myrtilles et les fraises sur le yaourt. Parseme le granola par-dessus.",
    "Finaliser",
    "Verse le sirop d’érable sur l’ensemble.",
  ],
},
]

const healthyRecipes: Recipe[] = [
{
  id: "healthy-parfait",
  title: "Burrito bowl healthy",
  flavor: "sale",
  prepTime: "35 à 40 min",
  servings: "1 pers",
  image: bowlPouletImg,
  ingredients: [
    "Base & protéines",
    "120 g de blanc de poulet",
    "200 g de patate douce",
    "Légumes",
    "1/4 d’oignon rouge",
    "80 g de tomates cerises",
    "1/4 de poivron rouge",
    "1/4 de poivron jaune",
    "1/2 avocat",
    "Sauce & assaisonnement",
    "30 g de crème fraîche légère",
    "1 cuillère à café d’huile d’olive",
    "Jus d’1/2 citron vert",
    "Persil frais (selon goût)",
    "1/2 cuillère à café de paprika",
    "1/2 cuillère à café de poudre d’ail",
    "1/2 cuillère à café d’épices cajun",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire la patate douce",
    "Préchauffe le four à 200°C. Épluche la patate douce et coupe-la en dés. Dépose-la sur une plaque, ajoute la moitié de l’huile d’olive, le paprika, la poudre d’ail, un peu de sel et de poivre. Mélange et enfourne pour 25 à 30 minutes, jusqu'à ce qu’elle soit tendre et dorée.",
    "Cuire le poulet",
    "Coupe le poulet en morceaux. Fais chauffer une poêle à feu moyen avec le reste de l’huile d’olive. Ajoute le poulet, les épices cajun, sale et poivre. Fais cuire 5 à 7 minutes jusqu'à ce qu’il soit bien doré et cuit à cœur.",
    "Préparer les légumes frais",
    "Émince finement l’oignon rouge. Coupe les tomates cerises en deux. Coupe les poivrons en fines lanières. Coupe l’avocat en tranches.",
    "Préparer la sauce",
    "Dans un petit bol, mélange la crème fraîche légère avec le jus de citron vert, du sel et du poivre.",
    "Assembler le burrito bowl",
    "Dans un bol : Dépose la patate douce rôtie. Ajoute le poulet. Dispose les poivrons, tomates cerises et l’oignon rouge. Ajoute l’avocat.",
    "Finaliser",
    "Ajoute la sauce. Parseme de persil frais ciselé. Ajoute un filet de jus de citron vert si souhaité.",
  ],
},
{
  id: "healthy-granola",
  title: "Granola croustillant maison",
  flavor: "sucre",
  prepTime: "35 à 45 min",
  servings: "1 pers",
  image: granolaMaisonImg,
  ingredients: [
    "250 g de flocons d’avoine",
    "60 g d’amandes",
    "60 g de noisettes",
    "60 g de noix",
    "3 cuillères à soupe de miel",
    "1 cuillère à café de cannelle",
    "1 pincée de sel",
  ],
  steps: [
    "  Préchauffer le four",
    "Préchauffe le four à 170°C.",
    "Préparer les fruits secs",
    "Concasse grossièrement les amandes, noisettes et noix.",
    "Mélanger les ingrédients secs",
    "Dans un grand saladier, mélange : les flocons d’avoine, les fruits secs concassés, la cannelle, la pincée de sel.",
    "Ajouter le miel",
    "Ajoute le miel et mélange bien pour enrober l’ensemble des ingrédients.",
    "Enfourner",
    "Étale le mélange en une couche uniforme sur une plaque recouverte de papier cuisson.",
    "Cuisson",
    "Enfourne pour 20 à 25 minutes. Remue le granola toutes les 8 à 10 minutes pour une cuisson homogène.",
    "Refroidissement",
    "Sors le granola du four et laisse-le refroidir complètement : il deviendra croustillant en refroidissant.",
    "Conservation",
    "Conserve le granola dans un bocal hermétique à température ambiante.",
  ],
},
{
  id: "healthy-tartine-avocat",
  title: "Bowl au thon",
  flavor: "sale",
  prepTime: "20 à 25 min",
  servings: "1 pers",
  image: bowlThonImg,
  ingredients: [
    "120 g de thon au naturel (égoutté)",
    "60 g de riz cru",
    "1/2 avocat",
    "1/2 concombre",
    "1 petite tomate",
    "1 œuf",
    "1 cuillère à café de graines de sésame",
    "Pour la vinaigrette",
    "1 cuillère à café d’huile d’olive",
    "1 cuillère à café de vinaigre (ou jus de citron)",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole d’eau bouillante salée selon le temps indiqué. Égoutte et laisse tiédir.",
    "Cuire l’œuf",
    "Plonge l’œuf dans de l’eau bouillante et fais-le cuire 9 à 10 minutes pour un œuf dur. Refroidis-le sous l’eau froide, écaille-le et coupe-le en quartiers.",
    "Préparer les légumes",
    "Coupe l’avocat en tranches ou en dés. Coupe le concombre en rondelles ou en dés. Coupe la tomate en morceaux.",
    "Préparer la vinaigrette",
    "Dans un petit bol, mélange l’huile d’olive, le vinaigre (ou le jus de citron), le sel et le poivre.",
    "Assembler le bowl",
    "Dans un bol : Dépose le riz. Ajoute le thon émietté. Dispose l’avocat, le concombre et la tomate. Ajoute l’œuf dur.",
    "Finaliser",
    "Verse la vinaigrette sur le bowl. Parseme de graines de sésame.",
  ],
},
{
  id: "healthy-bowl-mediterraneen",
  title: "Bowl méditerranéen",
  flavor: "sale",
  prepTime: "20 à 25 min",
  servings: "1 pers",
  image: bowlMediteraneenImg,
  ingredients: [
    "Base",
    "60 g de quinoa ou riz cru",
    "100 g de pois chiches cuits (égouttés)",
    "Légumes & garnitures",
    "1/2 concombre",
    "1 tomate",
    "1/4 d’oignon rouge",
    "50 g de feta émiettée",
    "Olives noires (quelques-unes)",
    "Persil ou basilic frais",
    "Assaisonnement",
    "1 cuillère à soupe d’huile d’olive",
    "1 cuillère à café de jus de citron",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire la base",
    "Fais cuire le quinoa ou le riz dans une casserole d’eau bouillante salée selon le temps indiqué. Égoutte et laisse tiédir.",
    "Préparer les légumes",
    "Coupe le concombre en dés. Coupe la tomate en morceaux. Émince finement l’oignon rouge.",
    "Préparer les pois chiches",
    "Rince et égoutte les pois chiches. Tu peux les utiliser tels quels ou les faire revenir rapidement à la poêle avec un peu de sel.",
    "Préparer l’assaisonnement",
    "Dans un petit bol, mélange l’huile d’olive, le jus de citron, le sel et le poivre.",
    "Assembler le bowl",
    "Dans un bol : Dépose la base (quinoa ou riz). Ajoute les pois chiches. Dispose les légumes. Ajoute la feta et les olives.",
    "Finaliser",
    "Verse l’assaisonnement. Ajoute les herbes fraîches.",
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
    "150 g de brocoli",
    "1 petite courgette",
    "50 g d’épinards frais",
    "500 ml de bouillon de légumes",
  ],
  steps: [
    "  Préparer les légumes",
    "Lave le brocoli et coupe-le en petits bouquets. Lave la courgette et coupe-la en rondelles. Rince les épinards.",
    "Cuisson",
    "Verse le bouillon de légumes dans une casserole. Ajoute le brocoli et la courgette. Porte à ébullition puis laisse cuire 10 à 12 minutes, jusqu'à ce que les légumes soient tendres.",
    "Ajouter les épinards",
    "Ajoute les épinards dans la casserole et laisse cuire 1 à 2 minutes, juste le temps qu’ils tombent.",
    "Mixer",
    "Mixe la soupe jusqu'à obtenir une texture lisse et homogène.",
    "Servir",
    "Goûte et ajuste l’assaisonnement si nécessaire.",
  ],
},

 {
  id: "healthy-salade-pates",
  title: "Banana bread",
  flavor: "sucre",
  prepTime: "55 à 65 min",
  servings: "1 pers",
  image: bananaBreadImg,
  ingredients: [
    "3 bananes mûres (dont 1 pour la décoration)",
    "2 œufs ou 100 g de compote",
    "150 g de farine",
    "50 g de poudre d’amande",
    "80 g de sucre roux",
    "50 g d’huile végétale (cacahuète, coco ou tournesol)",
    "100 ml de lait d’amande ou de coco",
    "1/2 sachet de levure chimique",
    "1 cuillère à café de bicarbonate",
    "1 pincée de sel",
    "1 sachet de sucre vanillé",
    "1 cuillère à café de cannelle",
  ],
  steps: [
    "  Préchauffer le four",
    "Préchauffe le four à 180°C.",
    "Préparer les bananes",
    "Épluche et mixe 2 bananes jusqu'à obtenir une purée lisse. Réserve la 3ᵉ banane pour la décoration.",
    "Préparer l’appareil",
    "Dans un grand saladier : Bats les œufs avec le sucre roux et le sucre vanillé. Ajoute la cannelle et mélange. Incorpore l’huile végétale. Ajoute la purée de bananes. Verse le lait végétal. Mélange jusqu'à obtenir une préparation homogène.",
    "Ajouter les ingrédients secs",
    "Ajoute : la farine, la levure chimique, le bicarbonate, le sel, la poudre d’amande. Mélange délicatement jusqu'à obtenir une pâte lisse.",
    "Mise en moule",
    "Huile légèrement un moule. Verse la préparation dans le moule. Coupe la banane réservée en deux dans la longueur et dépose-la sur le dessus.",
    "Cuisson",
    "Enfourne à 180°C pendant 40 à 45 minutes. Vérifie la cuisson avec la pointe d’un couteau : elle doit ressortir sèche.",
    "Refroidissement",
    "Laisse tiédir avant de démouler et de découper.",
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
    "Pour les brochettes",
    "150 g de blanc de poulet",
    "1/4 d’oignon rouge",
    "1 cuillère à café d’huile d’olive",
    "Sel et poivre",
    "Paprika ou herbes de Provence (optionnel)",
    "Pour la salade",
    "1/2 concombre",
    "1 tomate",
    "Herbes fraîches (persil, menthe ou coriandre)",
    "Sel et poivre",
    "Pour le boulghour à la tomate",
    "60 g de boulghour cru",
    "1 cuillère à soupe de concentré de tomate",
    "1 cuillère à café d’huile d’olive",
    "Sel et poivre",
    "Pour la sauce à la grecque",
    "100 g de yaourt grec",
    "1/4 de concombre râpé",
    "1 petite gousse d’ail",
    "1 cuillère à café de jus de citron",
    "Sel et poivre",
    "Herbes fraîches (aneth ou menthe, optionnel)",
  ],
  steps: [
    "  Préparer la sauce à la grecque",
    "Râpe le concombre et presse-le pour enlever l’excès d’eau. Dans un bol, mélange le yaourt grec, le concombre râpé, l’ail finement haché, le jus de citron, le sel, le poivre et les herbes si utilisées. Réserve au frais.",
    "Préparer le boulghour à la tomate",
    "Fais cuire le boulghour dans de l’eau bouillante salée selon le temps indiqué. Égoutte, ajoute le concentré de tomate, l’huile d’olive, le sel et le poivre. Mélange et réserve.",
    "Préparer les brochettes",
    "Coupe le poulet en cubes et l’oignon rouge en morceaux. Enfile-les sur les brochettes. Badigeonne d’huile d’olive, sale, poivre et ajoute les épices si souhaité.",
    "Cuire les brochettes",
    "Fais cuire les brochettes dans une poêle-grill ou sur un grill bien chaud pendant 8 à 10 minutes, en les retournant régulièrement, jusqu'à cuisson complète.",
    "Préparer la salade",
    "Coupe le concombre et la tomate en morceaux. Mélange avec les herbes, le sel et le poivre.",
    "Servir",
    "Dispose le boulghour à la tomate dans l’assiette. Ajoute les brochettes de poulet. Ajoute la salade fraîche. Accompagne avec la sauce à la grecque.",
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
    "150 g de mangue (fraîche ou surgelée)",
    "1 fruit de la passion",
    "200 ml de lait végétal (amande, coco léger ou avoine)",
    "100 g de yaourt nature ou yaourt grec allégé",
    "1 cuillère à café de jus de citron (optionnel)",
    "Quelques glaçons (optionnel)",
  ],
  steps: [
    "Coupe la mangue en morceaux si elle est fraîche.",
    "Récupère la pulpe du fruit de la passion à l’aide d’une cuillère.",
    "Verse le lait végétal dans le blender.",
    "Ajoute la mangue, la pulpe de passion et le yaourt.",
    "Ajoute le jus de citron et les glaçons si souhaité.",
    "Mixe pendant 30 à 60 secondes, jusqu'à obtenir une texture lisse et onctueuse.",
    "Verse dans un verre et consomme immédiatement.",
  ],
},
{
  id: "healthy-wrap-legumes",
  title: "Brownie salé au brocoli, feta & lardons",
  flavor: "sale",
  prepTime: "60 à 65 min",
  servings: "1 pers",
  image: brownieSaleImg,
  ingredients: [
    "1 brocoli",
    "2 œufs",
    "160 g de farine",
    "1/2 feta",
    "Lardons",
    "250 ml de lait",
    "Comté râpé",
    "Huile d’olive",
    "Sel",
    "Poivre",
    "Ail en poudre",
  ],
  steps: [
    "  Préparer le brocoli",
    "Détaille le brocoli en petits bouquets. Fais-le cuire dans de l’eau bouillante salée pendant 5 à 7 minutes, jusqu'à ce qu’il soit tendre. Égoutte bien et coupe-le grossièrement. Réserve.",
    "Cuire les lardons",
    "Fais revenir les lardons dans une poêle chaude sans ajout de matière grasse jusqu'à ce qu’ils soient dorés. Égoutte-les sur du papier absorbant et réserve.",
    "Préchauffer le four",
    "Préchauffe le four à 180°C.",
    "Préparer l’appareil",
    "Dans un grand saladier : Bats les œufs. Ajoute le lait et mélange. Incorpore la farine progressivement en fouettant pour éviter les grumeaux. Assaisonne avec le sel, le poivre et l’ail en poudre.",
    "Ajouter les garnitures",
    "Ajoute à la préparation : le brocoli, la feta émiettée, les lardons, une poignée de comté râpé. Mélange délicatement pour bien répartir les ingrédients.",
    "Enfourner",
    "Huile légèrement un moule avec de l’huile d’olive. Verse la préparation et lisse la surface. Ajoute un peu de comté râpé sur le dessus. Enfourne pour 35 à 40 minutes, jusqu'à ce que le brownie soit bien doré et pris à cœur.",
    "Repos et découpe",
    "Laisse tiédir quelques minutes avant de découper en parts.",
  ],
},
{
  id: "healthy-tofu-bowl",
  title: "Biscuits croustillants avoine & chocolat",
  flavor: "sucre",
  prepTime: "25 à 30 min",
  servings: "1 pers",
  image: biscuitsAvoineImg,
  ingredients: [
    "1 banane mûre écrasée",
    "100 g de flocons d’avoine",
    "50 g de chocolat noir (en morceaux ou pépites)",
    "8 à 10 noisettes entières",
  ],
  steps: [
    "  Préchauffer le four",
    "Préchauffe le four à 180°C.",
    "Préparer la pâte",
    "Dans un bol, écrase la banane à la fourchette jusqu'à obtenir une purée lisse. Ajoute les flocons d’avoine et mélange jusqu'à obtenir une pâte homogène.",
    "Former les biscuits",
    "Recouvre une plaque de papier cuisson. Dépose des petits tas de pâte et aplatis-les légèrement pour former des biscuits.",
    "Ajouter le chocolat et la noisette",
    "Dépose quelques morceaux de chocolat sur chaque biscuit. Ajoute une noisette entière au centre de chaque biscuit.",
    "Cuisson",
    "Enfourne pour 15 à 18 minutes, jusqu'à ce que les biscuits soient bien dorés et croustillants sur les bords.",
    "Refroidissement",
    "Laisse refroidir sur une grille : ils deviendront plus croustillants en refroidissant.",
  ],
},
{
  id: "healthy-saumon-tray",
  title: "Saumon au four citron",
  flavor: "sale",
  prepTime: "25 à 30 min",
  servings: "1 pers",
  image: saumonCitronImg,
  ingredients: [
    "120 g de saumon frais",
    "60 g de riz cru",
    "150 g d’asperges vertes",
    "1 gousse d’ail",
    "5 g de beurre",
    "1 cuillère à café d’huile d’olive",
    "Persil frais (selon goût)",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire le riz",
    "Fais cuire le riz dans une casserole d’eau bouillante salée selon le temps indiqué. Égoutte et réserve.",
    "Préparer les asperges",
    "Lave les asperges et coupe les extrémités dures. Fais-les cuire à la vapeur ou dans de l’eau bouillante salée pendant 5 à 7 minutes, jusqu'à ce qu’elles soient tendres mais encore légèrement croquantes. Égoutte et réserve.",
    "Cuire le saumon",
    "Sale et poivre le saumon. Fais chauffer l’huile d’olive dans une poêle à feu moyen. Dépose le saumon côté peau (ou côté présentation) et fais cuire 3 à 4 minutes. Retourne le saumon et poursuis la cuisson 2 à 3 minutes.",
    "Préparer la sauce citron-ail",
    "Baisse le feu. Ajoute le beurre et l’ail haché dans la poêle. Laisse fondre doucement en arrosant le saumon pendant 30 à 60 secondes, sans faire brûler l’ail.",
    "Finaliser",
    "Retire la poêle du feu. Ajoute le persil ciselé et un peu de jus de citron si souhaité. Rectifie l’assaisonnement.",
    "Servir",
    "Dispose le riz dans l’assiette. Ajoute le saumon au citron et les asperges.",
  ],
},

 {
  id: "healthy-potage-lentilles",
  title: "Pudding de chia coco & fraises",
  flavor: "sucre",
  prepTime: "5 à 7 min",
  servings: "1 pers",
  image: puddingChiaImg,
  ingredients: [
    "250 ml de lait végétal",
    "3 cuillères à soupe de graines de chia",
    "1 cuillère à soupe de miel",
    "100 g de yaourt à la noix de coco",
    "30 g de granola",
    "4 à 5 fraises",
  ],
  steps: [
    "  Faire gonfler les graines de chia",
    "Dans un bol ou un bocal, verse le lait végétal. Ajoute les graines de chia et mélange bien. Laisse reposer 10 minutes, puis remue à nouveau pour éviter les grumeaux.",
    "Repos",
    "Couvre et place au réfrigérateur pendant au moins 2 heures, idéalement toute la nuit, jusqu'à ce que le pudding épaississe.",
    "Ajouter le miel",
    "Une fois le pudding bien pris, ajoute le miel et mélange.",
    "Préparer les fraises",
    "Lave les fraises et coupe-les en morceaux.",
    "Monter le pudding",
    "Ajoute le yaourt à la noix de coco sur le pudding de chia. Ajoute les fraises. Parseme de granola sur le dessus.",
    "Servir",
    "Consomme immédiatement pour garder le granola croustillant.",
  ],
},
{
  id: "healthy-quinoa-menthe",
  title: "Salade César healthy",
  flavor: "sale",
  prepTime: "20 à 25 min",
  servings: "1 pers",
  image: saladeCesarImg,
  ingredients: [
    "Pour la salade",
    "100 g de blanc de poulet",
    "1 œuf",
    "80 g de salade (romaine ou autre)",
    "1 petite tomate",
    "20 g de parmesan en copeaux",
    "20 g de croûtons de pain",
    "Pour la sauce César maison (healthy)",
    "40 g de yaourt grec nature",
    "1 cuillère à café de moutarde",
    "1 cuillère à café de jus de citron",
    "1 cuillère à café d’huile d’olive",
    "Sel et poivre",
  ],
  steps: [
    "  Cuire l’œuf",
    "Plonge l’œuf dans de l’eau bouillante et fais-le cuire 9 minutes pour un œuf dur. Refroidis-le, écaille-le et coupe-le en quartiers.",
    "Cuire le poulet",
    "Fais chauffer une poêle à feu moyen. Fais cuire le poulet 5 à 7 minutes, en le retournant, jusqu'à ce qu’il soit bien doré et cuit à cœur. Sale, poivre et coupe-le en tranches.",
    "Préparer la sauce César",
    "Dans un bol, mélange le yaourt grec, la moutarde, le jus de citron, l’huile d’olive, le sel et le poivre jusqu'à obtenir une sauce lisse.",
    "Préparer les légumes",
    "Lave et essore la salade. Coupe la tomate en quartiers.",
    "Assembler la salade",
    "Dans un grand bol ou une assiette : Dépose la salade. Ajoute le poulet. Ajoute l’œuf dur. Ajoute la tomate. Ajoute les croûtons.",
    "Finaliser",
    "Verse la sauce César maison sur la salade. Ajoute les copeaux de parmesan et mélange légèrement.",
  ],
},
{
  id: "healthy-snack-energetique",
  title: "Salade de fruits fraîche à la menthe & citron",
  flavor: "sucre",
  prepTime: "8 à 10 min",
  servings: "1 pers",
  image: saladeDeFruitImg,
  ingredients: [
    "80 g de myrtilles",
    "4 à 5 fraises",
    "1 kiwi",
    "100 g de mangue",
    "Quelques feuilles de menthe fraîche",
    "Jus d’1/2 citron",
  ],
  steps: [
    "  Préparer les fruits",
    "Rince les myrtilles. Lave, équeute et coupe les fraises en morceaux. Épluche le kiwi et coupe-le en dés. Épluche la mangue et coupe-la en morceaux.",
    "Ciseler la menthe",
    "Lave et cisele finement les feuilles de menthe.",
    "Assembler la salade",
    "Dépose tous les fruits dans un saladier ou un bol. Ajoute la menthe ciselée.",
    "Assaisonner",
    "Verse le jus de citron sur les fruits. Mélange délicatement pour ne pas écraser les fruits.",
    "Servir",
    "Place au frais quelques minutes avant de servir si souhaité.",
  ],
},
]

const DIET_HEADINGS = {
  sweet: {
    eyebrow: "Sucré",
    title: "Ma Diet",
    description: "Toutes les idées sucrées du moment.",
  },
  savory: {
    eyebrow: "Salé",
    title: "Ma Diet",
    description: "Toutes les idées salées du moment.",
  },
} as const

const RECIPE_FAVORITES_KEY = "planner.diet.recipeFavorites"
const CUSTOM_RECIPES_KEY = "planner.diet.customRecipes"
const DIET_WEEKLY_PLAN_KEY = "planner.diet.weeklyPlan"
const DIET_WEEKLY_PLAN_RECIPES_KEY = "planner.diet.weeklyPlanRecipes"

const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const
type MealSlotId = "morning" | "midday" | "evening"
const mealSlots: { id: MealSlotId; label: string }[] = [
  { id: "morning", label: "Matin" },
  { id: "midday", label: "Midi" },
  { id: "evening", label: "Soir" },
]
type WeeklyPlan = Record<typeof weekDays[number], Record<MealSlotId, string>>

const buildDefaultWeeklyPlan = (): WeeklyPlan => {
  const plan = {} as WeeklyPlan
  weekDays.forEach((day) => {
    plan[day] = { morning: "", midday: "", evening: "" }
  })
  return plan
}
const DietClassicPage = () => {
  const { userEmail } = useAuth()
  const favoritesKey = useMemo(() => buildUserScopedKey(userEmail, RECIPE_FAVORITES_KEY), [userEmail])
  const weeklyPlanKey = useMemo(() => buildUserScopedKey(userEmail, DIET_WEEKLY_PLAN_KEY), [userEmail])
  const weeklyPlanRecipesKey = useMemo(() => buildUserScopedKey(userEmail, DIET_WEEKLY_PLAN_RECIPES_KEY), [userEmail])
  const customRecipesKey = useMemo(() => buildUserScopedKey(userEmail, CUSTOM_RECIPES_KEY), [userEmail])
  const [tab, setTab] = useState<"sweet" | "savory" | "favorites" | "custom">("sweet")
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
  const [planDay, setPlanDay] = useState<typeof weekDays[number]>(weekDays[0])
  const [planSlot, setPlanSlot] = useState<MealSlotId>("midday")
  const [planMealName, setPlanMealName] = useState("")
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = window.localStorage.getItem(customRecipesKey)
      return stored ? (JSON.parse(stored) as Recipe[]) : []
    } catch {
      return []
    }
  })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftFlavor, setDraftFlavor] = useState<"sucre" | "sale">("sale")
  const [draftPrepTime, setDraftPrepTime] = useState("")
  const [draftServings, setDraftServings] = useState("")
  const [draftImage, setDraftImage] = useState<string | null>(null)
  const [draftIngredients, setDraftIngredients] = useState("")
  const [draftSteps, setDraftSteps] = useState("")
  const [draftToppings, setDraftToppings] = useState("")
  const [draftTips, setDraftTips] = useState("")
  const draftImageInputRef = useRef<HTMLInputElement | null>(null)
  const allRecipes = useMemo(() => [...massRecipes, ...healthyRecipes], [])
  const currentHeading = tab === "favorites" || tab === "custom" ? null : DIET_HEADINGS[tab]
  const favoriteRecipes = useMemo(() => allRecipes.filter((recipe) => favoriteIds.has(recipe.id)), [allRecipes, favoriteIds])
  const filteredRecipes = useMemo(() => {
    if (tab === "favorites") return favoriteRecipes
    const flavor = tab === "sweet" ? "sucre" : "sale"
    return allRecipes.filter((recipe) => recipe.flavor === flavor)
  }, [allRecipes, favoriteRecipes, tab])

  useEffect(() => {
    if (!selectedRecipe) return
    setPlanMealName(selectedRecipe.title)
  }, [selectedRecipe])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(favoritesKey, JSON.stringify(Array.from(favoriteIds)))
    } catch {
      // ignore
    }
  }, [favoriteIds, favoritesKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(customRecipesKey, JSON.stringify(customRecipes))
    } catch {
      // ignore
    }
  }, [customRecipes, customRecipesKey])

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
  const addRecipeToPlan = () => {
    if (!selectedRecipe) return
    const mealName = planMealName.trim() || selectedRecipe.title
    if (!mealName) return
    try {
      const raw = window.localStorage.getItem(weeklyPlanKey)
      let plan = buildDefaultWeeklyPlan()
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === "object") {
          plan = { ...plan, ...parsed }
        }
      }
      const dayPlan = plan[planDay] ?? { morning: "", midday: "", evening: "" }
      const nextPlan = {
        ...plan,
        [planDay]: { ...dayPlan, [planSlot]: mealName },
      }
      window.localStorage.setItem(weeklyPlanKey, JSON.stringify(nextPlan))
      const recipeRaw = window.localStorage.getItem(weeklyPlanRecipesKey)
      let recipeMap: Record<string, Record<MealSlotId, RecipeSnapshot>> = {}
      if (recipeRaw) {
        try {
          const parsed = JSON.parse(recipeRaw)
          if (parsed && typeof parsed === "object") {
            recipeMap = parsed as Record<string, Record<MealSlotId, RecipeSnapshot>>
          }
        } catch {
          recipeMap = {}
        }
      }
      const dayRecipes = recipeMap[planDay] ?? {}
      const recipeSnapshot: RecipeSnapshot = {
        id: selectedRecipe.id,
        title: selectedRecipe.title,
        flavor: selectedRecipe.flavor,
        prepTime: selectedRecipe.prepTime,
        servings: selectedRecipe.servings,
        image: selectedRecipe.image,
        ingredients: selectedRecipe.ingredients,
        steps: selectedRecipe.steps,
        toppings: selectedRecipe.toppings,
        tips: selectedRecipe.tips,
      }
      recipeMap = {
        ...recipeMap,
        [planDay]: { ...dayRecipes, [planSlot]: recipeSnapshot },
      }
      window.localStorage.setItem(weeklyPlanRecipesKey, JSON.stringify(recipeMap))
      setSelectedRecipe(null)
    } catch {
      // ignore
    }
  }
  const handleDraftImageChange = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return
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
    setDraftIngredients("")
    setDraftSteps("")
    setDraftToppings("")
    setDraftTips("")
  }

  const handleCreateRecipe = () => {
    const title = draftTitle.trim()
    if (!title) return
    const ingredients = parseLines(draftIngredients)
    const steps = parseLines(draftSteps)
    if (ingredients.length === 0 || steps.length === 0) return
    const recipe: Recipe = {
      id: `custom-${Date.now()}`,
      title,
      flavor: draftFlavor,
      prepTime: draftPrepTime.trim() || "-",
      servings: draftServings.trim() || "-",
      ingredients,
      steps,
      toppings: parseLines(draftToppings),
      tips: parseLines(draftTips),
    }
    setCustomRecipes((prev) => [recipe, ...prev])
    setSelectedRecipe(recipe)
    setPlanMealName(recipe.title)
    setIsCreateOpen(false)
    resetDraft()
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

  return (
  <>
    

    <main className="diet-gymgirl-page">
      <article className="diet-blog">
        {currentHeading ? (
          <>
            <PageHeading
              eyebrow={currentHeading.eyebrow}
              title="Ma diet"
              className="diet-page-heading"
            />
            <p className="diet-heading__description">{currentHeading.description}</p>
          </>
        ) : (
          <>
            <PageHeading
              eyebrow="Favoris"
              title="Ma diet"
              className="diet-page-heading"
            />
            <p className="diet-heading__description">
              Retrouve ici toutes les recettes que tu as aimées.
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
            Sucré
          </button>
          <button
            type="button"
            className={tab === "savory" ? "is-active" : ""}
            onClick={() => setTab("savory")}
          >
            Salé
          </button>
          <button
            type="button"
            className={tab === "favorites" ? "is-active" : ""}
            onClick={() => setTab("favorites")}
          >
            Favoris
          </button>
          <button
            type="button"
            className={tab === "custom" ? "is-active" : ""}
            onClick={() => setTab("custom")}
          >
            Mes recettes
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
                        aria-label="Ajouter aux favoris"
                      >
                        {renderHeartIcon(favoriteIds.has(recipe.id))}
                      </button>
                    </div>
                    <div className="diet-recipe-card__body">
                      <h3>{recipe.title}</h3>
                      <div className="diet-recipe-meta">
                        <span className="diet-info-pill">
                          {recipe.flavor === "sucre" ? "Sucré" : "Salé"}
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
        ) : tab === "custom" ? (
          <>
            <div className="diet-custom-header">
              <div>
                <h3>Mes recettes</h3>
                <p className="diet-heading__description">
                  Crée tes propres recettes et programme-les directement.
                </p>
              </div>
              <button type="button" className="pill pill--diet" onClick={() => setIsCreateOpen(true)}>
                Créer une recette
              </button>
            </div>
            {customRecipes.length > 0 ? (
              <div className="diet-recipe-grid">
                {customRecipes.map((recipe) => (
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
                          aria-label="Ajouter aux favoris"
                        >
                          {renderHeartIcon(favoriteIds.has(recipe.id))}
                        </button>
                      </div>
                      <div className="diet-recipe-card__body">
                        <h3>{recipe.title}</h3>
                        <div className="diet-recipe-meta">
                          <span className="diet-info-pill">
                            {recipe.flavor === "sucre" ? "Sucré" : "Salé"}
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
                Aucune recette pour le moment. Crée la première !
              </p>
            )}
          </>
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
                      aria-label="Ajouter aux favoris"
                    >
                      {renderHeartIcon(favoriteIds.has(recipe.id))}
                    </button>
                  </div>
                  <div className="diet-recipe-card__body">
                    <h3>{recipe.title}</h3>
                    <div className="diet-recipe-meta">
                      <span className="diet-info-pill">
                        {recipe.flavor === "sucre" ? "Sucré" : "Salé"}
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
              <div className="diet-recipe-modal__cover">
                <img
                  alt="Aperçu recette"
                  className="diet-recipe-modal__image"
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
                        <select value={draftFlavor} onChange={(event) => setDraftFlavor(event.target.value as "sucre" | "sale")}>
                          <option value="sale">Salé</option>
                          <option value="sucre">Sucré</option>
                        </select>
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
                <button type="button" onClick={handleCreateRecipe}>
                  Enregistrer
                </button>
              </footer>
            </div>
          </div>
        ) : null}

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
                  <section className="diet-recipe-plan">
                    <h4>Ajouter au planning</h4>
                    <div className="diet-recipe-plan__row">
                      <label>
                        Jour
                        <select value={planDay} onChange={(event) => setPlanDay(event.target.value as typeof weekDays[number])}>
                          {weekDays.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Moment
                        <select value={planSlot} onChange={(event) => setPlanSlot(event.target.value as MealSlotId)}>
                          {mealSlots.map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
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
                    <button type="button" className="diet-recipe-plan__add" onClick={addRecipeToPlan}>
                      Ajouter au planning
                    </button>
                  </section>
                  <section>
                    <h4>Ingrédients</h4>
                    <ul>
                      {selectedRecipe.ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4>Étapes</h4>
                    <ol>
                      {selectedRecipe.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </section>
                  {selectedRecipe.toppings ? (
                    <section>
                      <h4>{"Idées de toppings (optionnel)"}</h4>
                      <ul>
                        {selectedRecipe.toppings.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {selectedRecipe.tips ? (
                    <section>
                      <h4>{"💡 Astuce"}</h4>
                      <ul>
                        {selectedRecipe.tips.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </div>
              </div>
              <footer className="diet-recipe-modal__actions">
                <button type="button" onClick={() => setSelectedRecipe(null)}>
                  Fermer
                </button>
              </footer>
            </div>
          </div>
        ) : null}
          </main>
<div className="page-footer-bar" aria-hidden="true" />
</>
)
}

export default DietClassicPage


