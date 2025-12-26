import React, { useState, useEffect, useCallback } from 'react';
import { Wine, CheckCircle, XCircle, Trophy, Award, Medal, RotateCcw, Play, Sparkles, Users, BookOpen, ChevronLeft, X } from 'lucide-react';

const CATEGORIES = {
  all: { name: 'All Topics', ids: null },
  grapes: { name: 'Grape Varieties', ids: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] },
  regions: { name: 'Wine Regions', ids: [31,32,33,34,35,36,37,38,39,40,86,88,90,93] },
  sparkling: { name: 'Sparkling & Fortified', ids: [41,42,43,44,45,46,47,48,49,50,51,52,53,54,94,97,98] },
  production: { name: 'Winemaking', ids: [55,56,57,58,59,60,61,62,99,100] },
  viticultic: { name: 'Viticulture & Climate', ids: [63,64,65,66,67,68,91,92,95,96] },
  service: { name: 'Storage, Service & Pairing', ids: [69,70,71,72,73,74,75,76,77,78] },
  labeling: { name: 'Labels & Classification', ids: [79,80,81,82,83,84,85,87,89] }
};

const QUESTIONS = [
  { id: 1, question: "Which grape variety is used to make Meursault?", options: ["Sauvignon Blanc", "Riesling", "Chardonnay", "Pinot Gris"], correct: 2, explanation: "Meursault is a prestigious village in Burgundy's Côte de Beaune, where 100% Chardonnay is used for white wines. These wines are typically full-bodied with stone fruit flavors and often show oak influence." },
  { id: 2, question: "Youthful Sauvignon Blanc wines typically have flavors of:", options: ["Vanilla, toast, and butter", "Honey, petrol, and dried apricot", "Grass, blossom, and passion fruit", "Smoke, cloves, and coconut"], correct: 2, explanation: "Sauvignon Blanc is an aromatic variety with characteristic herbaceous notes (grass, green bell pepper), citrus, and tropical fruit (passion fruit, gooseberry). Vanilla/toast comes from oak; honey/petrol describes aged Riesling." },
  { id: 3, question: "Which grape variety can make premium wines in cool, moderate, AND warm climates?", options: ["Chardonnay", "Gewürztraminer", "Riesling", "Pinot Grigio"], correct: 0, explanation: "Chardonnay is exceptionally versatile, producing quality wines across all climate types—from lean, mineral Chablis (cool) to rich, tropical Australian examples (warm). Its neutral character allows winemaking to shape the final style." },
  { id: 4, question: "Which describes Pinot Grigio delle Venezie DOC?", options: ["Full-bodied, oaked, with tropical fruit", "Dry, light-bodied, with green apple and lemon", "Sweet, floral, with rose and lychee", "Medium-bodied, with butter and toast"], correct: 1, explanation: "Italian Pinot Grigio is typically made in a dry, light-bodied, simple style with crisp acidity and subtle green apple and citrus notes. This contrasts with the richer Pinot Gris style from Alsace." },
  { id: 5, question: "Which grape variety is known for pronounced aromas of rose, lychee, and Turkish delight?", options: ["Riesling", "Viognier", "Gewürztraminer", "Muscat"], correct: 2, explanation: "Gewürztraminer is highly aromatic with distinctive floral (rose), exotic fruit (lychee), and spice notes. It typically has low acidity and full body, distinguishing it from other aromatic varieties." },
  { id: 6, question: "Which grape variety is used to make Sancerre?", options: ["Chardonnay", "Chenin Blanc", "Sauvignon Blanc", "Melon de Bourgogne"], correct: 2, explanation: "Sancerre is a prestigious Loire Valley appellation producing 100% Sauvignon Blanc. These wines are crisp, dry, and herbaceous with minerality. Don't confuse with Pouilly-Fuissé, which is Burgundy Chardonnay." },
  { id: 7, question: "Riesling wines from the Mosel region of Germany are typically:", options: ["Full-bodied with pronounced oak flavors", "Light-bodied with high acidity and floral aromas", "Medium-bodied with low acidity and stone fruit", "Full-bodied with butter and cream notes"], correct: 1, explanation: "Mosel Rieslings are made in the lightest, most delicate style of German Riesling. The cool climate and steep slate slopes produce wines with high acidity, floral aromatics, and citrus character. Riesling is never oaked." },
  { id: 8, question: "Which statement about Alsace wines is TRUE?", options: ["Chardonnay is the most planted grape variety", "Wines are typically blended from multiple varieties", "Riesling and Gewürztraminer are commonly grown", "Wines are usually aged in new oak barrels"], correct: 2, explanation: "Alsace specializes in aromatic varieties including Riesling, Gewürztraminer, and Pinot Gris. Unlike most French regions, wines are varietally labeled. Chardonnay is not permitted, and oak aging is rarely used." },
  { id: 9, question: "Which white grape variety retains high acidity even in warm climates?", options: ["Gewürztraminer", "Viognier", "Chenin Blanc", "Pinot Grigio"], correct: 2, explanation: "Chenin Blanc is remarkable for maintaining high natural acidity across all climates, from cool Loire Valley to warm South Africa. This acidity enables production of wines from bone-dry to intensely sweet." },
  { id: 10, question: "Hunter Valley Semillon is typically characterized by:", options: ["High alcohol and full body", "Low alcohol and high acidity", "Medium sweetness and tropical fruit", "Heavy oak influence and butter notes"], correct: 1, explanation: "Hunter Valley Semillon is picked early to retain acidity, resulting in wines with low alcohol (10-11%) and high acid. These wines age exceptionally well, developing toast and honey notes over time." },
  { id: 11, question: "Which statement is TRUE for Pinot Noir?", options: ["It produces deeply colored wines with high tannins", "It thrives in warm to hot climates", "It is at its best in cool or moderate climates", "It is typically blended with Cabernet Sauvignon"], correct: 2, explanation: "Pinot Noir is thin-skinned, producing pale to medium-colored wines with low tannins and high acidity. It requires cool to moderate climates and won't ripen properly in hot conditions. Premium examples come from Burgundy, Oregon, and New Zealand." },
  { id: 12, question: "Which region is renowned for Syrah-based wines?", options: ["Hermitage", "Chianti", "Rioja", "Pomerol"], correct: 0, explanation: "Hermitage is the most prestigious appellation in the Northern Rhône, producing powerful 100% Syrah red wines. The steep granite slopes and continental climate create wines with black pepper, dark fruit, and exceptional aging potential." },
  { id: 13, question: "Which grape has characteristic aromas of blackcurrant, cedar, and green bell pepper?", options: ["Merlot", "Pinot Noir", "Cabernet Sauvignon", "Grenache"], correct: 2, explanation: "Cabernet Sauvignon is identified by blackcurrant (cassis), herbaceous notes (green bell pepper when less ripe), and cedar from oak aging. Its thick skin produces deeply colored wines with high tannins." },
  { id: 14, question: "Compared to Cabernet Sauvignon, Merlot typically has:", options: ["Higher tannins and more acidity", "Softer tannins and earlier drinkability", "Deeper color and more aging potential", "More herbaceous flavors and firmer structure"], correct: 1, explanation: "Merlot produces softer, rounder wines with medium tannins that are approachable younger than Cabernet Sauvignon. Typical flavors include red plum and cooked blackberry. Merlot is often blended with Cabernet to soften its structure." },
  { id: 15, question: "Which pair of regions are famous for premium Syrah/Shiraz?", options: ["Burgundy and Marlborough", "Hermitage and Barossa Valley", "Rioja and Chianti", "Bordeaux and Napa Valley"], correct: 1, explanation: "Hermitage (Northern Rhône) and Barossa Valley (Australia) are the world's most renowned Syrah/Shiraz regions. Hermitage produces elegant, peppery wines while Barossa creates powerful, rich styles with vanilla and chocolate from oak." },
  { id: 16, question: "What level of tannin do Pinot Noir wines typically have?", options: ["High", "Medium to High", "Low to Medium", "No tannins"], correct: 2, explanation: "Pinot Noir's thin skin produces wines with low to medium tannins, pale color, and red fruit flavors (strawberry, raspberry, cherry). This contrasts sharply with thick-skinned varieties like Cabernet Sauvignon and Nebbiolo." },
  { id: 17, question: "A full-bodied Australian Shiraz from Barossa Valley would typically show:", options: ["Green bell pepper, mint, and eucalyptus", "Strawberry, earth, and mushroom", "Cooked black fruit, vanilla, and chocolate", "Dried herbs, tar, and rose petals"], correct: 2, explanation: "Warm-climate Barossa Shiraz is full-bodied with soft tannins, showing ripe/cooked black fruit (blackberry, plum), and pronounced oak influence (vanilla, chocolate, coffee). The warm climate produces opulent, concentrated wines." },
  { id: 18, question: "Which grape variety is dominant on Bordeaux's Left Bank?", options: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon", "Petit Verdot"], correct: 2, explanation: "Bordeaux's Left Bank (Médoc, Graves) is dominated by Cabernet Sauvignon, which thrives on the well-drained gravel soils. The Right Bank (St-Émilion, Pomerol) favors Merlot on its clay and limestone soils." },
  { id: 19, question: "Which grape variety is used to make Beaujolais?", options: ["Pinot Noir", "Gamay", "Grenache", "Merlot"], correct: 1, explanation: "Gamay is the exclusive red grape of Beaujolais, producing light-bodied, low-tannin wines with vibrant red fruit (cherry, raspberry). Carbonic maceration creates distinctive banana and candy aromas in Beaujolais Nouveau." },
  { id: 20, question: "What is the main grape variety used in Chianti?", options: ["Nebbiolo", "Montepulciano", "Sangiovese", "Barbera"], correct: 2, explanation: "Sangiovese is the principal grape of Tuscany, used in Chianti, Chianti Classico, and Brunello di Montalcino. It produces medium-bodied wines with high acidity, high tannins, and sour cherry/dried herb flavors." },
  { id: 21, question: "Barolo DOCG is made from which grape variety?", options: ["Sangiovese", "Nebbiolo", "Barbera", "Corvina"], correct: 1, explanation: "Nebbiolo produces Piedmont's finest wines: Barolo and Barbaresco. Despite pale color, these wines have extremely high tannins and acidity, requiring extended aging. Characteristic aromas include tar, roses, and dried herbs." },
  { id: 22, question: "Which grape variety would struggle to ripen in a cool climate?", options: ["Riesling", "Pinot Noir", "Grenache", "Chardonnay"], correct: 2, explanation: "Grenache is thin-skinned and requires warm to hot climates to fully ripen. It thrives in Southern Rhône, Spain (as Garnacha), and Australia's Barossa Valley. Cool climates produce unripe, herbaceous flavors." },
  { id: 23, question: "Which is the most important grape variety in Argentina?", options: ["Carmenère", "Cabernet Sauvignon", "Malbec", "Tannat"], correct: 2, explanation: "Malbec is Argentina's signature grape, particularly from high-altitude Mendoza. It produces deeply colored, full-bodied wines with plush tannins and black fruit flavors. Argentina grows more Malbec than any other country." },
  { id: 24, question: "Carmenère is most commonly associated with which country?", options: ["Argentina", "Chile", "South Africa", "Australia"], correct: 1, explanation: "Carmenère is Chile's signature grape variety, rediscovered in the 1990s after being confused with Merlot. It produces full-bodied wines with herbaceous notes (green bell pepper), black fruit, and spice." },
  { id: 25, question: "Which grape variety is used to make Vino Nobile di Montepulciano?", options: ["Montepulciano", "Sangiovese", "Nebbiolo", "Corvina"], correct: 1, explanation: "Vino Nobile di Montepulciano is made from Sangiovese in the town of Montepulciano in Tuscany. The grape called Montepulciano is grown in Abruzzo and makes Montepulciano d'Abruzzo—a completely different wine." },
  { id: 26, question: "Which grape is used to make Prosecco?", options: ["Pinot Grigio", "Moscato", "Glera", "Garganega"], correct: 2, explanation: "Glera is the principal grape of Prosecco, Italy's popular sparkling wine from Veneto. Prosecco is made using the tank method (Charmat), preserving Glera's fresh, fruity, floral character." },
  { id: 27, question: "Tempranillo is the dominant grape variety in which Spanish region?", options: ["Rías Baixas", "Priorat", "Rioja", "Jerez"], correct: 2, explanation: "Tempranillo is Spain's most important red grape, dominating Rioja and Ribera del Duero. It produces medium to full-bodied wines with red fruit, leather, and tobacco notes, often aged in American oak." },
  { id: 28, question: "Which grape variety is most widely planted in South Africa for white wine?", options: ["Sauvignon Blanc", "Chardonnay", "Chenin Blanc", "Riesling"], correct: 2, explanation: "Chenin Blanc (locally called Steen) is South Africa's most planted white variety. Its high acidity and versatility allow production of everything from refreshing dry wines to rich, oak-aged styles to sweet wines." },
  { id: 29, question: "Albariño is the signature white grape of which Spanish region?", options: ["Rioja", "Rías Baixas", "Ribera del Duero", "Jerez"], correct: 1, explanation: "Albariño is grown in Rías Baixas in Galicia (northwest Spain). The cool, Atlantic-influenced climate produces crisp, aromatic whites with citrus, stone fruit, and saline minerality—ideal with seafood." },
  { id: 30, question: "Pinotage is a grape variety unique to which country?", options: ["Australia", "New Zealand", "South Africa", "Chile"], correct: 2, explanation: "Pinotage was created in South Africa by crossing Pinot Noir and Cinsaut. It produces distinctive wines with red fruit, smoky, and sometimes coffee/chocolate notes. It remains almost exclusively South African." },
  { id: 31, question: "Which statement correctly describes Bordeaux?", options: ["Left Bank is Merlot-dominant; Right Bank is Cabernet-dominant", "Left Bank is Cabernet-dominant; Right Bank is Merlot-dominant", "Both banks primarily use Pinot Noir", "White wines dominate production"], correct: 1, explanation: "Left Bank (Médoc, Graves) has gravel soils suited to Cabernet Sauvignon. Right Bank (St-Émilion, Pomerol) has clay/limestone soils better suited to Merlot. About 90% of Bordeaux production is red." },
  { id: 32, question: "In Burgundy's classification system, which represents the highest quality?", options: ["Bourgogne AOC", "Village wines", "Premier Cru", "Grand Cru"], correct: 3, explanation: "Burgundy's hierarchy from highest to lowest: Grand Cru (top vineyards, ~1% of production) → Premier Cru → Village wines (e.g., Gevrey-Chambertin) → Regional Bourgogne AOC." },
  { id: 33, question: "Which French region is known for unoaked Chardonnay with mineral and citrus notes?", options: ["Meursault", "Chablis", "Napa Valley", "Côte de Beaune"], correct: 1, explanation: "Chablis produces distinctively lean, mineral Chardonnay. The cool northerly climate and Kimmeridgian limestone soils create wines with high acidity, citrus/green apple flavors, and wet stone minerality. Oak is rarely used." },
  { id: 34, question: "The Northern Rhône Valley is characterized by:", options: ["Mediterranean climate with Grenache-based blends", "Continental climate with steep slopes and 100% Syrah reds", "Cool climate with Pinot Noir as the main variety", "Warm climate with Cabernet Sauvignon"], correct: 1, explanation: "The Northern Rhône has a continental climate with dramatically steep granite slopes. Red wines are 100% Syrah, producing powerful wines with black pepper and dark fruit. Key appellations include Hermitage and Côte-Rôtie." },
  { id: 35, question: "Which region produces the most intensely aromatic Sauvignon Blanc?", options: ["Sancerre, France", "Marlborough, New Zealand", "Napa Valley, USA", "Bordeaux, France"], correct: 1, explanation: "Marlborough Sauvignon Blanc is renowned for its intensely aromatic, pungent style with pronounced passion fruit, gooseberry, and cut grass. Cool climate, high sunshine, and distinct diurnal temperature variation create this character." },
  { id: 36, question: "Which Australian region is most famous for premium Riesling?", options: ["Barossa Valley", "Hunter Valley", "Clare Valley", "Margaret River"], correct: 2, explanation: "Clare Valley and Eden Valley produce Australia's finest Rieslings. Despite warm days, cool nights preserve acidity. These wines are typically dry with lime, floral notes, and develop distinctive petrol character with age." },
  { id: 37, question: "Which American wine region is known for elegant Pinot Noir similar to Burgundy?", options: ["Napa Valley", "Sonoma County", "Oregon (Willamette Valley)", "Washington State"], correct: 2, explanation: "Oregon's Willamette Valley has a cool, Burgundy-like climate that produces elegant, lower-alcohol Pinot Noir with bright acidity and red fruit character. Napa and most California regions are too warm for this style." },
  { id: 38, question: "What is distinctive about wine production in Mendoza, Argentina?", options: ["Coastal vineyards at sea level", "High-altitude vineyards that moderate extreme heat", "Cool, rainy climate similar to Burgundy", "Predominantly white wine production"], correct: 1, explanation: "Mendoza's vineyards are planted at high altitude (up to 1,500m), which moderates the warm climate through cooler nighttime temperatures. This allows Malbec to develop intense color and flavor while retaining freshness." },
  { id: 39, question: "Central Otago in New Zealand is known for which grape variety?", options: ["Sauvignon Blanc", "Chardonnay", "Pinot Noir", "Syrah"], correct: 2, explanation: "Central Otago is the world's southernmost wine region, producing expressive, fruit-forward Pinot Noir. Its continental climate with significant day-night temperature variation creates wines with more ripeness than Marlborough." },
  { id: 40, question: "Margaret River in Australia is best known for which grape varieties?", options: ["Shiraz and Grenache", "Riesling and Gewürztraminer", "Cabernet Sauvignon and Chardonnay", "Pinot Noir and Pinot Gris"], correct: 2, explanation: "Margaret River's maritime climate produces elegant, premium Cabernet Sauvignon and Chardonnay. The moderate temperatures create wines with more restraint and finesse than warmer Australian regions." },
  { id: 41, question: "What is the correct order for traditional method sparkling wine production?", options: ["Base wine, dosage, riddling, second fermentation", "Second fermentation, yeast autolysis, disgorgement, dosage", "Disgorgement, second fermentation, dosage, riddling", "Dosage, second fermentation, autolysis, riddling"], correct: 1, explanation: "Traditional method sequence: base wine → second fermentation in bottle → yeast autolysis (lees breakdown) → riddling (moves sediment) → disgorgement (removes sediment) → dosage (sweetness adjustment)." },
  { id: 42, question: "Which sparkling wine is NOT made using the traditional method?", options: ["Champagne", "Cava", "Prosecco", "Crémant d'Alsace"], correct: 2, explanation: "Prosecco must be made using the tank method (Charmat), where second fermentation occurs in pressurized tanks. This preserves the fresh, fruity, floral character of Glera. Traditional method creates more complex, bready notes." },
  { id: 43, question: "What is added to base wine to start second fermentation in sparkling wine?", options: ["Grape spirit and sugar", "Sugar and yeast", "Carbon dioxide and yeast", "Sulfites and sugar"], correct: 1, explanation: "The liqueur de tirage (mixture of sugar and yeast) is added to still base wine to trigger second fermentation. Yeast consumes the sugar, producing alcohol and carbon dioxide (the bubbles) trapped in the bottle." },
  { id: 44, question: "The term 'brut' on a Champagne label indicates:", options: ["Sweet", "Medium-dry", "Dry", "Extra-sweet"], correct: 2, explanation: "Brut is the most common Champagne style, indicating a dry wine with low residual sugar (less than 12g/L). Sweeter styles include Demi-Sec and Doux; drier styles include Extra Brut and Brut Nature." },
  { id: 45, question: "Extended aging on lees in Champagne creates which flavors?", options: ["Fresh fruit and floral aromas", "Bread, biscuit, and brioche notes", "Green apple and citrus", "Tropical fruit and vanilla"], correct: 1, explanation: "Autolysis (yeast cell breakdown during lees contact) creates distinctive bread, biscuit, toast, and brioche aromas. Champagne must age minimum 15 months on lees (NV) or 3 years (vintage)." },
  { id: 46, question: "Which grape varieties are used to make Champagne?", options: ["Glera, Pinot Grigio, Moscato", "Chardonnay, Pinot Noir, Pinot Meunier", "Sauvignon Blanc, Sémillon, Muscadelle", "Macabeo, Xarel·lo, Parellada"], correct: 1, explanation: "Champagne uses three main grapes: Chardonnay (white), Pinot Noir (black), and Pinot Meunier (black). 'Blanc de Blancs' uses only Chardonnay; 'Blanc de Noirs' uses only the black grapes. Option D lists Cava grapes." },
  { id: 47, question: "The tank method of sparkling wine production:", options: ["Creates finer, more persistent bubbles", "Produces complex, toasty, autolytic flavors", "Preserves fresh, fruity, floral aromas", "Is more expensive than traditional method"], correct: 2, explanation: "The tank method (Charmat) produces second fermentation quickly in pressurized tanks, then filters and bottles the wine. This preserves primary fruit aromas and is more economical, ideal for fresh styles like Prosecco." },
  { id: 48, question: "How does Port become a sweet wine?", options: ["Sugar is added after fermentation", "Fermentation is halted by adding grape spirit", "Late-harvested grapes are used", "The wine is left to oxidize"], correct: 1, explanation: "Port is fortified during fermentation, when grape spirit is added to kill the yeast before all sugar is converted to alcohol. This leaves significant residual sugar. Sherry, by contrast, is fortified after fermentation." },
  { id: 49, question: "Which Port style has oxidative characters of walnut and caramel?", options: ["Ruby", "LBV", "Vintage", "Tawny"], correct: 3, explanation: "Tawny Port is aged in small barrels, exposing it to oxygen and creating oxidative flavors: toffee, caramel, walnuts, dried fruit. The wine develops a tawny-brown color. Ruby styles preserve fresh fruit character." },
  { id: 50, question: "The Solera system is used in the production of:", options: ["Port", "Champagne", "Sherry", "Madeira"], correct: 2, explanation: "The Solera system is a fractional blending method unique to Sherry production. Wine is drawn from the oldest barrels (bottom of the solera) and replenished from younger barrels above, ensuring consistent house style." },
  { id: 51, question: "Which Sherry style is protected from oxidation by a layer of flor?", options: ["Oloroso", "Cream", "Fino", "Pedro Ximénez"], correct: 2, explanation: "Fino Sherry develops under a protective layer of flor (film of yeast) that prevents oxidation. This creates pale, dry wines with almond, bread dough, and yeasty characteristics. Fino is fortified to only 15-15.5% to allow flor survival." },
  { id: 52, question: "Which grape is primarily used to make dry Sherry?", options: ["Muscat", "Palomino", "Touriga Nacional", "Pedro Ximénez"], correct: 1, explanation: "Palomino is the main grape for dry Sherry styles (Fino, Manzanilla, Amontillado, Oloroso). It produces neutral base wines ideal for the aging process. Pedro Ximénez (PX) is sun-dried to make intensely sweet Sherry." },
  { id: 53, question: "The main difference between Port and Sherry production is:", options: ["Port uses red grapes; Sherry uses white only", "Port is fortified during fermentation; Sherry after", "Port is always dry; Sherry is always sweet", "Port comes from Spain; Sherry from Portugal"], correct: 1, explanation: "The critical difference: Port is fortified during fermentation (making it naturally sweet), while Sherry is fortified after fermentation is complete (making it initially dry). This is one of the most commonly tested facts." },
  { id: 54, question: "Which Port style is the most basic, youngest red Port?", options: ["Tawny", "LBV", "Ruby", "Vintage"], correct: 2, explanation: "Ruby Port is the simplest, most affordable style. It's aged briefly in large tanks to preserve fresh, fruity character. Styles increase in complexity: Ruby → Reserve Ruby → LBV → Vintage (and separately, Tawny → Aged Tawny)." },
  { id: 55, question: "What is the correct sequence for most red winemaking?", options: ["Pressing, alcoholic fermentation", "Pressing, crushing, alcoholic fermentation", "Crushing, pressing, alcoholic fermentation", "Crushing, alcoholic fermentation, pressing"], correct: 3, explanation: "Red winemaking: crush grapes → ferment with skins (for color and tannin extraction) → press to separate wine from skins. White winemaking presses before fermentation. This sequence difference is fundamental." },
  { id: 56, question: "What is the effect of cool fermentation temperatures on white wine?", options: ["Extracts more color and tannin", "Preserves fresh, fruity, and floral aromas", "Creates butter and cream flavors", "Adds vanilla and spice notes"], correct: 1, explanation: "Cool fermentation (12-22°C) for white and rosé wines preserves volatile aromatic compounds, resulting in fresh fruit and floral aromas. Warm fermentation is used for reds to extract color and tannins from skins." },
  { id: 57, question: "Malolactic fermentation adds which characteristic to wine?", options: ["Fruity, floral aromas", "Butter and cream flavors", "Green apple and citrus notes", "Petrol and honey aromas"], correct: 1, explanation: "MLF converts sharp malic acid to softer lactic acid, reducing acidity and adding butter, cream, and cheese flavors (from diacetyl). It's standard for red wines and optional for whites where creamier texture is desired." },
  { id: 58, question: "Which aromas come from oak aging?", options: ["Green apple and citrus", "Strawberry and raspberry", "Vanilla, toast, and coconut", "Petrol and honey"], correct: 2, explanation: "Oak aging imparts vanilla, toast, coconut, cedar, smoke, and spice aromas. New oak provides stronger flavors than old oak. American oak gives more coconut and vanilla; French oak is more subtle with spice notes." },
  { id: 59, question: "Which wines would typically NOT undergo malolactic fermentation?", options: ["Red Burgundy", "Oaked California Chardonnay", "Marlborough Sauvignon Blanc", "Barolo"], correct: 2, explanation: "MLF is avoided in wines where crisp, fresh acidity is essential to style, such as Sauvignon Blanc, Riesling, and most rosés. All red wines and many premium Chardonnays undergo MLF for softer texture." },
  { id: 60, question: "Lees contact and bâtonnage add which characteristics to wine?", options: ["Crisp acidity and green fruit", "Deep color and high tannins", "Body, creaminess, and biscuit notes", "Fresh berry fruit and floral aromas"], correct: 2, explanation: "Aging on lees (dead yeast cells) and bâtonnage (lees stirring) add body, creamy texture, and complexity. In sparkling wine, extended lees contact (autolysis) develops bread, biscuit, and brioche character." },
  { id: 61, question: "What does the pulp of a grape contain?", options: ["Color, tannins, and aroma compounds", "Water and sugar", "Acids and tannins", "Yeast and minerals"], correct: 1, explanation: "Grape pulp contains primarily water and sugar (which ferment into alcohol). Skins provide color, tannins, and many aroma compounds. Seeds contribute harsh tannins. Understanding grape anatomy is fundamental to winemaking." },
  { id: 62, question: "Which environmental factor generates energy in the vine to produce sugars?", options: ["Water", "Nutrients", "Sunlight", "Carbon dioxide"], correct: 2, explanation: "Sunlight drives photosynthesis, enabling vines to convert CO₂ and water into sugar (stored in grapes). Adequate sunlight is essential for ripening. Excess sugar produces higher-alcohol wines; insufficient sunlight yields unripe, acidic grapes." },
  { id: 63, question: "A wine region with an average growing season temperature of 17°C is considered:", options: ["Cool climate", "Moderate climate", "Warm climate", "Hot climate"], correct: 1, explanation: "17°C average defines a moderate climate. Cool climates average 14-17°C, moderate 17-18.5°C, and warm 18.5-21°C. This classification affects grape variety suitability, wine body, and flavor profile." },
  { id: 64, question: "Which latitudes mark the zones where most vineyards are found?", options: ["10-30 degrees north and south", "30-50 degrees north and south", "50-70 degrees north and south", "0-20 degrees north and south"], correct: 1, explanation: "Most quality wine production occurs between 30° and 50° latitude in both hemispheres. These zones provide the temperature range needed for grape cultivation—warm enough to ripen grapes, cool enough to retain acidity." },
  { id: 65, question: "Which of the following does NOT affect vineyard temperature?", options: ["Altitude", "Ocean currents", "Grape variety", "Slope aspect"], correct: 2, explanation: "Grape variety doesn't affect temperature—temperature affects grape variety suitability. Altitude, ocean currents, slope aspect, latitude, and proximity to water bodies all influence vineyard temperature." },
  { id: 66, question: "During which stage of grape development does véraison occur?", options: ["Bud break", "Flowering", "Ripening (color change)", "Harvest"], correct: 2, explanation: "Véraison marks the onset of ripening when grapes change color (green to yellow for white; green to purple for red), begin accumulating sugar, and decrease in acidity. It occurs approximately 6-8 weeks before harvest." },
  { id: 67, question: "High altitude vineyards benefit wine quality because:", options: ["Grapes receive less sunlight", "Cooler temperatures preserve acidity and extend growing season", "More rainfall improves grape hydration", "Lower temperatures prevent grape ripening"], correct: 1, explanation: "High altitude provides cooler temperatures (approximately 0.6°C drop per 100m elevation), which preserves natural acidity, extends the growing season, and allows flavor development. This is crucial in warm regions like Mendoza." },
  { id: 68, question: "What is the primary effect of a cool climate on wine style?", options: ["Full body, high alcohol, ripe tropical fruit", "Light to medium body, high acidity, citrus and green fruit", "Soft tannins, low acidity, dried fruit", "High tannins, low acidity, cooked fruit"], correct: 1, explanation: "Cool climates produce wines with higher acidity, lower alcohol, lighter body, and flavors of citrus, green apple, and underripe fruit. Warm climates produce riper, fuller-bodied wines with tropical fruit and lower acidity." },
  { id: 69, question: "What is the ideal storage temperature for wine?", options: ["0-5°C", "10-15°C", "20-25°C", "25-30°C"], correct: 1, explanation: "10-15°C (50-59°F) is ideal for wine storage. This constant, cool temperature slows aging appropriately. Higher temperatures accelerate aging prematurely; temperature fluctuations are particularly damaging." },
  { id: 70, question: "Why should bottles with cork closures be stored horizontally?", options: ["To maximize storage space", "To keep the cork moist and prevent air ingress", "To allow sediment to settle", "To improve the wine's flavor"], correct: 1, explanation: "Horizontal storage keeps wine in contact with the cork, maintaining cork moisture. A dry cork shrinks, becomes porous, and allows air to enter, oxidizing the wine. Screwcap bottles can be stored vertically." },
  { id: 71, question: "Cork taint (TCA) in wine is characterized by:", options: ["Excessive sweetness and cloying texture", "Wet cardboard, musty basement, and muted fruit", "Vinegar and nail polish aromas", "Egg and sulfur odors"], correct: 1, explanation: "Cork taint (TCA contamination) produces musty, wet cardboard, damp basement aromas and mutes fruit expression. The wine tastes flat and lifeless. Note: cork debris floating in wine is NOT cork taint." },
  { id: 72, question: "Which is the correct serving temperature for full-bodied red wines?", options: ["6-10°C (43-50°F)", "10-13°C (50-55°F)", "15-18°C (59-64°F)", "20-25°C (68-77°F)"], correct: 2, explanation: "Full-bodied reds should be served at 15-18°C—cooler than modern room temperature. This allows aromas to develop while preventing alcohol from becoming too prominent. Too warm makes wine taste muddled; too cold makes it harsh." },
  { id: 73, question: "At what temperature should sparkling wines and sweet wines be served?", options: ["Room temperature (20°C)", "Well chilled (6-10°C)", "Lightly chilled (13-15°C)", "Cellar temperature (15-18°C)"], correct: 1, explanation: "Sparkling and sweet wines are served well chilled (6-10°C). Cold temperature keeps sparkling wines fresh with fine bubbles; it balances sweetness in dessert wines. Over-chilling suppresses aromas." },
  { id: 74, question: "What effect does umami in food have on wine?", options: ["Makes wine taste smoother and fruitier", "Makes wine taste more bitter and astringent", "Makes wine taste sweeter and softer", "Has no effect on wine"], correct: 1, explanation: "Umami (savory taste in aged cheese, mushrooms, soy sauce) makes wine taste more bitter, astringent, and acidic. This is why high-tannin wines clash with umami-rich foods. Fruity, low-tannin wines pair better." },
  { id: 75, question: "When pairing wine with sweet desserts, the wine should be:", options: ["Drier than the dessert", "Sweeter than the dessert", "Equal sweetness to the dessert", "Any sweetness level works"], correct: 1, explanation: "Wine must be sweeter than the food, or it will taste thin, bitter, and overly acidic. A dry wine with sweet food is one of the most jarring mismatches. This is why Sauternes pairs with desserts—it's intensely sweet." },
  { id: 76, question: "Salty foods affect wine by:", options: ["Making wine taste more bitter and astringent", "Making wine taste less bitter and more fruity", "Making wine taste thinner and more acidic", "Having no effect on perception"], correct: 1, explanation: "Salt softens wine, making it taste less bitter, less astringent, and more fruity. This is why salty aged cheeses pair beautifully with tannic red wines—the salt tames the tannins." },
  { id: 77, question: "Which is the best wine pairing for a tomato-based pasta dish?", options: ["Oaked Chardonnay", "Mosel Riesling", "Chianti (Sangiovese)", "Tannic Barolo"], correct: 2, explanation: "High-acid wines match high-acid foods. Tomatoes are acidic, and Sangiovese (Chianti) has naturally high acidity to complement them. Oaked Chardonnay and tannic Barolo would clash; Riesling lacks the body." },
  { id: 78, question: "Which structural component is the main factor contributing to body in wine?", options: ["Tannin", "Acidity", "Sugar", "Alcohol"], correct: 3, explanation: "Alcohol is the primary contributor to wine body and mouthfeel. Higher alcohol = fuller body. Tannins add structure and grip; sugar adds sweetness and viscosity; acidity provides freshness—but alcohol determines overall weight." },
  { id: 79, question: "What does PDO (Protected Designation of Origin) indicate on a wine label?", options: ["Minimum 85% grapes from the stated region", "100% grapes from a specified area with strict rules", "Wine made using organic methods", "Wine suitable for aging"], correct: 1, explanation: "PDO indicates 100% of grapes from the specified area, with strict regulations governing grape varieties, yields, and winemaking methods. PDO represents the highest tier of EU geographic classification." },
  { id: 80, question: "In Italy, which classification represents the highest quality level?", options: ["IGT", "DOC", "DOCG", "Vino d'Italia"], correct: 2, explanation: "Italy's quality hierarchy from highest to lowest: DOCG (guaranteed and controlled) → DOC (controlled) → IGT (typical geographic indication) → Vino d'Italia (table wine). DOCG wines undergo additional quality testing." },
  { id: 81, question: "A Spanish wine labeled 'Reserva' from Rioja must have:", options: ["No oak aging", "Minimum 6 months in oak", "Minimum 12 months in oak with 36 months total aging", "Minimum 24 months in oak with 60 months total aging"], correct: 2, explanation: "Rioja Reserva requires at least 12 months in oak and 36 months total aging before release. Gran Reserva requires 24 months in oak and 60 months total. These are legally defined terms in Spain." },
  { id: 82, question: "In German wine classification, 'Spätlese' indicates:", options: ["Wine made from frozen grapes", "Wine from late-harvested, riper grapes", "Wine from botrytis-affected grapes", "Dry wine only"], correct: 1, explanation: "Spätlese means 'late harvest'—grapes picked after normal harvest with higher sugar levels. The wine may be dry (Trocken), off-dry, or sweet depending on winemaking. It's the second level in the Prädikat hierarchy." },
  { id: 83, question: "Which German term indicates a dry wine style?", options: ["Spätlese", "Auslese", "Trocken", "Prädikat"], correct: 2, explanation: "Trocken means 'dry' in German. It can appear on any Prädikat level wine (Kabinett Trocken, Spätlese Trocken) to indicate the wine has been fermented to dryness. Halbtrocken means 'off-dry.'" },
  { id: 84, question: "The term 'Classico' on an Italian wine label indicates:", options: ["The wine has been aged in oak", "Grapes from the original, historic production zone", "Premium quality certification", "The wine is from a single vineyard"], correct: 1, explanation: "Classico denotes the historic, original heartland of a wine region (e.g., Chianti Classico, Soave Classico). These central zones often produce higher-quality wines than the expanded surrounding areas." },
  { id: 85, question: "What is the minimum vintage requirement for EU wines?", options: ["75% from stated vintage", "85% from stated vintage", "95% from stated vintage", "100% from stated vintage"], correct: 1, explanation: "EU regulations require minimum 85% of wine from the stated vintage year. US wines require 95%. Non-vintage wines (common for Champagne) blend multiple years for consistency." },
  { id: 86, question: "Which pair is CORRECTLY matched?", options: ["Pouilly-Fumé - Chardonnay", "Pouilly-Fuissé - Sauvignon Blanc", "Sancerre - Sauvignon Blanc", "Chablis - Pinot Grigio"], correct: 2, explanation: "Sancerre = Sauvignon Blanc (Loire Valley). Common confusion: Pouilly-Fumé (Loire, Sauvignon Blanc) vs. Pouilly-Fuissé (Burgundy, Chardonnay). Chablis is 100% Chardonnay." },
  { id: 87, question: "Which grape is NOT permitted in Champagne?", options: ["Chardonnay", "Pinot Meunier", "Cabernet Sauvignon", "Pinot Noir"], correct: 2, explanation: "Champagne permits seven grape varieties: Chardonnay, Pinot Noir, Pinot Meunier (the main three), plus Arbane, Petit Meslier, Pinot Blanc, and Pinot Gris. Cabernet Sauvignon is a Bordeaux variety and is not permitted in Champagne." },
  { id: 88, question: "Montepulciano d'Abruzzo is made from which grape?", options: ["Sangiovese", "Montepulciano", "Nebbiolo", "Primitivo"], correct: 1, explanation: "Montepulciano d'Abruzzo uses the Montepulciano grape from Abruzzo. Don't confuse with Vino Nobile di Montepulciano, which uses Sangiovese from the Tuscan town of Montepulciano—completely different wine." },
  { id: 89, question: "Which sweet wine is NOT affected by botrytis (noble rot)?", options: ["Sauternes", "Tokaji Aszú", "Eiswein", "Trockenbeerenauslese"], correct: 2, explanation: "Eiswein (Icewine) is made from healthy grapes frozen on the vine—no botrytis involvement. The frozen water concentrates sugars. Sauternes, Tokaji, and TBA all rely on botrytis-affected grapes." },
  { id: 90, question: "Pomerol is located in which wine region?", options: ["Burgundy", "Bordeaux", "Rhône Valley", "Loire Valley"], correct: 1, explanation: "Pomerol is on Bordeaux's Right Bank, famous for Merlot-dominant wines (including Château Pétrus). Don't confuse Right Bank Bordeaux villages (Pomerol, St-Émilion) with Burgundy appellations." },
  { id: 91, question: "Noble rot requires which weather conditions to develop beneficially?", options: ["Constant rain and cold temperatures", "Hot, dry conditions throughout harvest", "Misty mornings followed by warm, dry afternoons", "Frost followed by rapid thawing"], correct: 2, explanation: "Botrytis cinerea requires humid mornings (allowing fungal growth) and warm, dry afternoons (preventing destructive gray rot). This occurs in Sauternes, Tokaji, and German vineyard sites near rivers." },
  { id: 92, question: "Which statement about rosé production is TRUE?", options: ["Blending red and white wine is common for still rosé in France", "Rosé is typically aged in new oak barrels", "The saignée method uses juice bled from red wine fermentation", "Rosé must undergo malolactic fermentation"], correct: 2, explanation: "Saignée ('bleeding') draws off pink juice early in red wine fermentation. Blending red and white is prohibited for still rosé in the EU (exception: Champagne rosé). Most rosé avoids oak and MLF to preserve freshness." },
  { id: 93, question: "Coonawarra in Australia is known for Cabernet Sauvignon with which characteristic?", options: ["Intense tropical fruit and high alcohol", "Mint and eucalyptus notes", "Cooked fruit and chocolate", "Green bell pepper and low tannins"], correct: 1, explanation: "Coonawarra's cool climate and terra rossa soils produce Cabernet Sauvignon with distinctive mint and eucalyptus character, along with blackcurrant and firm structure. This distinguishes it from warmer Australian regions." },
  { id: 94, question: "What distinguishes Amontillado Sherry from Fino?", options: ["Amontillado is sweeter", "Amontillado has undergone oxidative aging after biological aging", "Amontillado is made from Pedro Ximénez", "Amontillado is aged for less time"], correct: 1, explanation: "Amontillado begins life as Fino under flor protection, but the flor eventually dies, exposing the wine to oxidation. This creates a wine with both biological AND oxidative character—amber color, nutty flavors, drier than Oloroso." },
  { id: 95, question: "A wine with 'tertiary aromas' would show:", options: ["Fresh fruit and floral notes from the grape", "Butter and vanilla from winemaking", "Mushroom, leather, and forest floor from aging", "Herbaceous and grassy notes"], correct: 2, explanation: "Tertiary aromas develop from bottle aging: mushroom, forest floor, leather, tobacco, earth, dried fruit. Primary aromas come from grapes (fruit, floral); secondary aromas come from winemaking (oak, MLF)." },
  { id: 96, question: "Why is Gewürztraminer particularly distinctive among white grapes?", options: ["It produces wines with very high acidity", "It has low aromatics and neutral character", "It produces full-bodied wines with low acidity and pronounced aromatics", "It is only grown in cool climates"], correct: 2, explanation: "Gewürztraminer is unique for combining pronounced aromatics (rose, lychee, Turkish delight) with full body and low acidity. Most aromatic varieties have high acidity; Gewürztraminer's low acid and rich texture are distinctive." },
  { id: 97, question: "Which factor indicates traditional method vs tank method sparkling wine?", options: ["Fresh, simple fruit flavors", "Large, vigorous bubbles", "Bread, toast, and biscuit aromas", "Intense floral aromatics"], correct: 2, explanation: "Traditional method aging on lees (autolysis) creates distinctive bread, toast, biscuit, and brioche aromas from yeast breakdown. Tank method produces fresh fruit character without these complex notes, and typically larger bubbles." },
  { id: 98, question: "A wine labeled 'Blanc de Blancs' Champagne is made from:", options: ["A blend of red and white grapes", "White Chardonnay grapes only", "Pinot Noir and Pinot Meunier only", "Any white grape variety"], correct: 1, explanation: "'Blanc de Blancs' means 'white from whites'—Champagne made exclusively from Chardonnay (the only permitted white grape). 'Blanc de Noirs' uses only the black grapes Pinot Noir and/or Pinot Meunier." },
  { id: 99, question: "Which techniques are commonly used to add complexity to premium dry Chardonnay?", options: ["Flor aging and botrytis", "Botrytis and lees stirring", "Lees stirring and barrel fermentation", "Flor aging and barrel fermentation"], correct: 2, explanation: "Premium Chardonnay often uses lees stirring (bâtonnage) and barrel fermentation to add complexity, creaminess, and oak integration. Flor aging is for Sherry; botrytis is for sweet wines—neither applies to dry Chardonnay." },
  { id: 100, question: "Outstanding-quality red wines that age well typically have:", options: ["Low tannins, low acidity, and light fruit", "Medium tannins, medium acidity, medium fruit", "High tannins, concentrated fruit, and high acidity", "Soft tannins, low acidity, and high sweetness"], correct: 2, explanation: "High tannins, concentrated fruit, and high acidity provide structural components for long aging. Tannins act as preservatives, acidity maintains freshness, and concentrated fruit ensures flavors remain vibrant as wine evolves." }
];

const STORAGE_KEY = 'wset-quiz-history';
const LEADERBOARD_KEY = 'wset-quiz-leaderboard';

const Confetti = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    setParticles(Array.from({ length: 150 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 3, duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)], size: 8 + Math.random() * 8
    })));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div key={p.id} className="absolute" style={{ left: `${p.x}%`, top: '-20px', width: p.size, height: p.size, backgroundColor: p.color, borderRadius: Math.random() > 0.5 ? '50%' : '2px', animation: `fall ${p.duration}s ease-in ${p.delay}s forwards` }} />
      ))}
      <style>{`@keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [questionCount, setQuestionCount] = useState(20);
  const [category, setCategory] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState({ seen: {}, incorrect: {} });
  const [leaderboard, setLeaderboard] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
      const lb = localStorage.getItem(LEADERBOARD_KEY);
      if (lb) setLeaderboard(JSON.parse(lb));
    } catch (e) { console.log('No history'); }
  }, []);

  const saveHistory = h => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); } catch (e) {} };
  const saveLeaderboard = lb => { try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb)); } catch (e) {} };

  const getAvailableQuestions = useCallback(() => {
    const catDef = CATEGORIES[category];
    return catDef.ids ? QUESTIONS.filter(q => catDef.ids.includes(q.id)) : QUESTIONS;
  }, [category]);

  const selectQuestions = useCallback((count) => {
    const available = getAvailableQuestions();
    const never = available.filter(q => !history.seen[q.id]);
    const incorrect = available.filter(q => history.incorrect[q.id] && !never.includes(q));
    const correct = available.filter(q => history.seen[q.id] && !history.incorrect[q.id]);
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    let selected = [...shuffle(never).slice(0, count)];
    if (selected.length < count) selected.push(...shuffle(incorrect).slice(0, count - selected.length));
    if (selected.length < count) selected.push(...shuffle(correct).slice(0, count - selected.length));
    return shuffle(selected);
  }, [history, getAvailableQuestions]);

  const startQuiz = () => {
    const available = getAvailableQuestions();
    const actualCount = Math.min(questionCount, available.length);
    setQuestions(selectQuestions(actualCount));
    setCurrentIndex(0); setResults([]); setSelectedAnswer(null); setShowExplanation(false); setScreen('quiz');
  };

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index); setShowExplanation(true);
    const q = questions[currentIndex], isCorrect = index === q.correct;
    setResults(prev => [...prev, { questionId: q.id, correct: isCorrect, selected: index }]);
    const newHistory = { ...history, seen: { ...history.seen, [q.id]: true }, incorrect: { ...history.incorrect } };
    if (!isCorrect) newHistory.incorrect[q.id] = true; else delete newHistory.incorrect[q.id];
    setHistory(newHistory); saveHistory(newHistory);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1); setSelectedAnswer(null); setShowExplanation(false);
    } else {
      const pct = (results.filter(r => r.correct).length / questions.length) * 100;
      if (pct >= 85) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 6000); }
      setShowNameInput(true);
      setScreen('results');
    }
  };

  const addToLeaderboard = () => {
    if (!playerName.trim()) return;
    const score = results.filter(r => r.correct).length;
    const pct = (score / questions.length) * 100;
    const entry = { name: playerName.trim(), score, total: questions.length, percentage: pct, category: CATEGORIES[category].name, date: new Date().toLocaleDateString() };
    const newLb = [...leaderboard, entry].sort((a, b) => b.percentage - a.percentage).slice(0, 20);
    setLeaderboard(newLb); saveLeaderboard(newLb);
    setShowNameInput(false);
  };

  const resetHistory = () => { const h = { seen: {}, incorrect: {} }; setHistory(h); saveHistory(h); };
  const clearLeaderboard = () => { setLeaderboard([]); saveLeaderboard([]); };

  const missedQuestions = results.filter(r => !r.correct).map(r => ({ ...QUESTIONS.find(q => q.id === r.questionId), selected: r.selected }));

  if (screen === 'setup') {
    const seenCount = Object.keys(history.seen).length, incorrectCount = Object.keys(history.incorrect).length;
    const availableCount = getAvailableQuestions().length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white shadow-2xl">
          <div className="flex items-center justify-center mb-6"><Wine className="w-12 h-12 text-purple-300" /></div>
          <h1 className="text-3xl font-bold text-center mb-2">WSET Level 2</h1>
          <p className="text-purple-200 text-center mb-6">Practice Quiz</p>
          
          <div className="flex gap-2 mb-6">
            <button onClick={() => setScreen('leaderboard')} className="flex-1 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm">
              <Users className="w-4 h-4" /> Leaderboard
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-sm text-purple-200 mb-2">Your Progress</p>
            <div className="flex justify-between text-sm"><span>{seenCount}/100 attempted</span><span>{incorrectCount} to review</span></div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2"><div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: `${seenCount}%` }} /></div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-purple-200 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white">
              {Object.entries(CATEGORIES).map(([key, val]) => (
                <option key={key} value={key} className="bg-purple-900">{val.name} {val.ids ? `(${val.ids.length})` : '(100)'}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-purple-200 mb-2">Questions ({availableCount} available)</label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 30, 40, 50].map(num => (
                <button key={num} onClick={() => setQuestionCount(num)} disabled={num > availableCount}
                  className={`py-3 rounded-xl font-semibold transition-all ${questionCount === num ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-105' : num > availableCount ? 'bg-white/5 opacity-30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}>
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6 text-sm">
            <p className="text-purple-200 mb-2">Grading Scale</p>
            <div className="space-y-1 text-purple-100">
              <p>• Pass: 55%+ ({Math.ceil(Math.min(questionCount, availableCount) * 0.55)}+)</p>
              <p>• Merit: 70%+ ({Math.ceil(Math.min(questionCount, availableCount) * 0.70)}+)</p>
              <p>• Distinction: 85%+ ({Math.ceil(Math.min(questionCount, availableCount) * 0.85)}+)</p>
            </div>
          </div>

          <button onClick={startQuiz} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg">
            <Play className="w-5 h-5" /> Start Quiz
          </button>
          {seenCount > 0 && <button onClick={resetHistory} className="w-full mt-3 py-2 text-purple-300 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"><RotateCcw className="w-4 h-4" /> Reset Progress</button>}
        </div>
      </div>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 max-w-md w-full text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setScreen('setup')} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Leaderboard</h2>
            <div className="w-9" />
          </div>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-purple-200">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No scores yet!</p>
              <p className="text-sm mt-2">Complete a quiz to be the first.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {leaderboard.map((entry, i) => (
                <div key={i} className={`p-3 rounded-xl ${i === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' : i === 1 ? 'bg-gray-400/20' : i === 2 ? 'bg-orange-500/20' : 'bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-500' : 'bg-white/20'}`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{entry.name}</p>
                      <p className="text-xs text-purple-200">{entry.category} • {entry.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{entry.percentage.toFixed(0)}%</p>
                      <p className="text-xs text-purple-200">{entry.score}/{entry.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {leaderboard.length > 0 && (
            <button onClick={clearLeaderboard} className="w-full mt-4 py-2 text-purple-300 hover:text-white text-sm">Clear Leaderboard</button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = questions[currentIndex], progress = ((currentIndex + 1) / questions.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 max-w-2xl w-full text-white shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-purple-200 text-sm">Q{currentIndex + 1}/{questions.length}</span>
            <span className="text-xs text-purple-300 bg-white/10 px-2 py-1 rounded">{CATEGORIES[category].name}</span>
            <span className="text-purple-200 text-sm">{results.filter(r => r.correct).length} ✓</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-6"><div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          <h2 className="text-xl font-semibold mb-6 leading-relaxed">{q.question}</h2>
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              let cls = 'w-full p-4 rounded-xl text-left transition-all ';
              if (showExplanation) {
                if (i === q.correct) cls += 'bg-green-500/30 border-2 border-green-400';
                else if (i === selectedAnswer) cls += 'bg-red-500/30 border-2 border-red-400';
                else cls += 'bg-white/5 opacity-50';
              } else cls += 'bg-white/10 hover:bg-white/20 cursor-pointer';
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={showExplanation} className={cls}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{opt}</span>
                    {showExplanation && i === q.correct && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {showExplanation && i === selectedAnswer && i !== q.correct && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>
          {showExplanation && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-start gap-2"><Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" /><p className="text-purple-100 text-sm leading-relaxed">{q.explanation}</p></div>
            </div>
          )}
          {showExplanation && <button onClick={nextQuestion} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all">{currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}</button>}
        </div>
      </div>
    );
  }

  if (screen === 'review') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-white shadow-2xl mb-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setScreen('results')} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Review ({missedQuestions.length})</h2>
              <div className="w-9" />
            </div>
          </div>
          <div className="space-y-4">
            {missedQuestions.map((q, i) => (
              <div key={q.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 text-white">
                <p className="font-medium mb-4">{i + 1}. {q.question}</p>
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, j) => (
                    <div key={j} className={`p-3 rounded-lg text-sm ${j === q.correct ? 'bg-green-500/20 border border-green-500/50' : j === q.selected ? 'bg-red-500/20 border border-red-500/50' : 'bg-white/5'}`}>
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + j)}.</span>{opt}
                      {j === q.correct && <span className="ml-2 text-green-400">✓ Correct</span>}
                      {j === q.selected && j !== q.correct && <span className="ml-2 text-red-400">✗ Your answer</span>}
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-sm text-purple-100">
                  <Sparkles className="w-4 h-4 text-yellow-400 inline mr-2" />{q.explanation}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setScreen('setup')} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white">Back to Home</button>
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    const score = results.filter(r => r.correct).length, pct = (score / questions.length) * 100;
    let grade, gradeColor, GradeIcon;
    if (pct >= 85) { grade = 'Distinction'; gradeColor = 'from-yellow-400 to-amber-500'; GradeIcon = Trophy; }
    else if (pct >= 70) { grade = 'Merit'; gradeColor = 'from-gray-300 to-gray-400'; GradeIcon = Award; }
    else if (pct >= 55) { grade = 'Pass'; gradeColor = 'from-orange-400 to-orange-500'; GradeIcon = Medal; }
    else { grade = 'Not Yet Passed'; gradeColor = 'from-purple-400 to-purple-500'; GradeIcon = Wine; }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        {showConfetti && <Confetti />}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white shadow-2xl text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${gradeColor} flex items-center justify-center shadow-lg ${pct >= 85 ? 'animate-pulse' : ''}`}><GradeIcon className="w-12 h-12 text-white" /></div>
          <h1 className="text-3xl font-bold mb-2">{grade}</h1>
          <p className="text-purple-200 mb-2">{pct >= 55 ? 'Congratulations!' : 'Keep practicing!'}</p>
          <p className="text-xs text-purple-300 mb-6">{CATEGORIES[category].name}</p>

          {showNameInput && (
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-sm text-purple-200 mb-2">Add to leaderboard:</p>
              <div className="flex gap-2">
                <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Your name" maxLength={20} className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 text-sm" />
                <button onClick={addToLeaderboard} className="px-4 py-2 bg-purple-500 rounded-lg font-semibold text-sm hover:bg-purple-600">Add</button>
                <button onClick={() => setShowNameInput(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{score}/{questions.length}</div>
            <p className="text-purple-200">{pct.toFixed(1)}% correct</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className={`p-3 rounded-xl ${pct >= 55 ? 'bg-green-500/20' : 'bg-white/5'}`}><p className="text-purple-200">Pass</p><p className="font-semibold">55%</p></div>
            <div className={`p-3 rounded-xl ${pct >= 70 ? 'bg-green-500/20' : 'bg-white/5'}`}><p className="text-purple-200">Merit</p><p className="font-semibold">70%</p></div>
            <div className={`p-3 rounded-xl ${pct >= 85 ? 'bg-green-500/20' : 'bg-white/5'}`}><p className="text-purple-200">Distinction</p><p className="font-semibold">85%</p></div>
          </div>

          {missedQuestions.length > 0 && (
            <button onClick={() => setScreen('review')} className="w-full py-3 mb-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" /> Review {missedQuestions.length} Missed
            </button>
          )}

          <button onClick={() => setScreen('setup')} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"><RotateCcw className="w-5 h-5" /> Try Again</button>
        </div>
      </div>
    );
  }
  return null;
}