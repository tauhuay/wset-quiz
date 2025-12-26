import React, { useState, useEffect, useCallback } from 'react';
import { Wine, CheckCircle, XCircle, Trophy, Award, Medal, RotateCcw, Play, Sparkles, Users, BookOpen, ChevronLeft, X, Skull } from 'lucide-react';

// REIGN OF TERROIR Logo Component
const Logo = () => (
  <div className="flex items-center justify-center gap-3 mb-6">
    <span className="text-2xl md:text-3xl font-black tracking-wider text-white" style={{fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>REIGN OF</span>
    <Skull className="w-10 h-10 md:w-12 md:h-12 text-white" />
    <span className="text-2xl md:text-3xl font-black tracking-wider text-white" style={{fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>TERROIR</span>
  </div>
);

// Category definitions with question IDs
const CATEGORIES = {
  all: { name: 'All Topics', ids: null },
  grapes: { name: 'Grape Varieties', ids: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130] },
  regions: { name: 'Wine Regions', ids: [31,32,33,34,35,36,37,38,39,40,86,88,90,93,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150] },
  sparkling: { name: 'Sparkling Wines', ids: [41,42,43,44,45,46,47,151,152,153,154,155,156,157,158,159,160] },
  fortified: { name: 'Fortified Wines', ids: [48,49,50,51,52,53,54,94,97,98,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175] },
  production: { name: 'Winemaking', ids: [55,56,57,58,59,60,61,62,99,100,176,177,178,179,180,181,182,183,184,185] },
  viticulture: { name: 'Viticulture & Climate', ids: [63,64,65,66,67,68,91,92,95,96] },
  service: { name: 'Storage, Service & Pairing', ids: [69,70,71,72,73,74,75,76,77,78,191,192,193,194,195,196,197] },
  labeling: { name: 'Labels & Classification', ids: [79,80,81,82,83,84,85,87,89,186,187,188,189,190,198,199,200] }
};

// All 200 Questions
const QUESTIONS = [
  // ORIGINAL 100 QUESTIONS (IDs 1-100)
  { id: 1, question: "Which grape variety is used to make Meursault?", options: ["Sauvignon Blanc", "Riesling", "Chardonnay", "Pinot Gris"], correct: 2, explanation: "Meursault is a prestigious village in Burgundy's Côte de Beaune, where 100% Chardonnay is used for white wines. These wines are typically full-bodied with stone fruit flavors and often show oak influence." },
  { id: 2, question: "Youthful Sauvignon Blanc wines typically have flavors of:", options: ["Vanilla, toast, and butter", "Honey, petrol, and dried apricot", "Grass, blossom, and passion fruit", "Smoke, cloves, and coconut"], correct: 2, explanation: "Sauvignon Blanc is an aromatic variety with characteristic herbaceous notes (grass, green bell pepper), citrus, and tropical fruit (passion fruit, gooseberry). Vanilla/toast comes from oak; honey/petrol describes aged Riesling." },
  { id: 3, question: "What is the key stylistic difference between Chablis and Côte d'Or white Burgundy?", options: ["Chablis uses Pinot Blanc while Côte d'Or uses Chardonnay", "Chablis typically uses stainless steel or neutral oak while Côte d'Or often uses new oak", "Chablis undergoes MLF while Côte d'Or does not", "Chablis is always sparkling while Côte d'Or is still"], correct: 1, explanation: "Both regions use 100% Chardonnay, but Chablis producers typically ferment and age in stainless steel or neutral oak to preserve the wine's crisp, mineral character, while Côte d'Or (Meursault, Puligny-Montrachet) often uses new oak barrels for a richer, more opulent style." },
  { id: 4, question: "Which grape variety is known for aromas of lychee and rose?", options: ["Riesling", "Gewürztraminer", "Viognier", "Muscat"], correct: 1, explanation: "Gewürztraminer is highly aromatic with distinctive lychee and rose petal aromas, plus Turkish delight and ginger spice. It typically has low acidity and high alcohol, with deep golden color." },
  { id: 5, question: "Pinot Grigio from northern Italy is typically:", options: ["Full-bodied with rich tropical flavors", "Light, dry, and neutral with subtle pear notes", "Sweet with high residual sugar", "Deep pink in color"], correct: 1, explanation: "Northern Italian Pinot Grigio (especially from Veneto and Friuli) is made in a light, crisp, neutral style with subtle pear and apple notes. This contrasts with richer Alsace Pinot Gris." },
  { id: 6, question: "Which of the following is NOT a typical characteristic of Riesling?", options: ["High acidity", "Floral aromas", "Low alcohol potential", "Always dry"], correct: 3, explanation: "Riesling is NOT always dry—it ranges from bone dry to lusciously sweet. It does have high acidity, floral/citrus aromas, and often lower alcohol (especially German styles at 8-12% ABV)." },
  { id: 7, question: "Sémillon is often blended with Sauvignon Blanc in which region?", options: ["Loire Valley", "Bordeaux", "Marlborough", "Mosel"], correct: 1, explanation: "Bordeaux traditionally blends Sémillon with Sauvignon Blanc for both dry whites (like Pessac-Léognan) and sweet wines (Sauternes). Sémillon adds body, waxy texture, and age-worthiness." },
  { id: 8, question: "Which statement about Chenin Blanc is TRUE?", options: ["It can only make dry wines", "It is primarily grown in Bordeaux", "It can make dry, off-dry, sweet, and sparkling wines", "It always has low acidity"], correct: 2, explanation: "Chenin Blanc is incredibly versatile, producing dry wines (Savennières), off-dry (Vouvray demi-sec), sweet (Coteaux du Layon), and sparkling (Crémant de Loire). It has naturally high acidity." },
  { id: 9, question: "At which Prädikat level is botrytis (noble rot) ALWAYS required for production?", options: ["Auslese", "Beerenauslese", "Trockenbeerenauslese", "Eiswein"], correct: 2, explanation: "Trockenbeerenauslese (TBA) is the only Prädikat level where botrytis is absolutely mandatory. TBA wines are made exclusively from individually selected berries severely shriveled by noble rot. While Beerenauslese often features botrytis, it can legally be made from overripe grapes without noble rot. Eiswein requires healthy, frozen grapes—botrytis is actually undesirable as it compromises skin integrity needed for freezing." },
  { id: 10, question: "Which grape is the most widely planted red variety in the world?", options: ["Merlot", "Pinot Noir", "Cabernet Sauvignon", "Syrah"], correct: 2, explanation: "Cabernet Sauvignon is the world's most planted red grape variety, grown extensively in Bordeaux, California, Chile, Australia, and beyond. It's prized for its structure, aging potential, and consistency." },
  { id: 11, question: "What are the primary fruit flavors in young Cabernet Sauvignon?", options: ["Strawberry and cherry", "Blackcurrant and black cherry", "Peach and apricot", "Lemon and grapefruit"], correct: 1, explanation: "Cabernet Sauvignon is characterized by blackcurrant (cassis) and black cherry flavors, often with cedar, mint, and bell pepper notes. Red fruit flavors are more typical of Pinot Noir." },
  { id: 12, question: "Merlot from Pomerol is typically:", options: ["Light-bodied and acidic", "Medium to full-bodied with plum and chocolate notes", "Highly tannic and austere when young", "Always blended with Cabernet Sauvignon"], correct: 1, explanation: "Pomerol Merlot is renowned for its plush, velvety texture with plum, chocolate, and truffle notes. The clay soils produce richer, more concentrated wines than the Left Bank." },
  { id: 13, question: "Which region is most famous for Pinot Noir?", options: ["Rioja", "Burgundy", "Barossa Valley", "Douro"], correct: 1, explanation: "Burgundy is the spiritual home of Pinot Noir, where it produces some of the world's most sought-after red wines. The region's terroir-focused approach showcases the grape's ability to express site-specific characteristics." },
  { id: 14, question: "Typical tasting notes for cooler climate Syrah/Shiraz include:", options: ["Jammy fruit and chocolate", "Black pepper, violet, and dark fruit", "Eucalyptus and mint", "Tropical fruit and vanilla"], correct: 1, explanation: "Cool-climate Syrah (Northern Rhône style) shows black pepper, violet, olive, and dark fruit with more structure and elegance. Warm-climate Shiraz (Australian style) tends toward jammy fruit and chocolate." },
  { id: 15, question: "Grenache is a key grape in wines from:", options: ["Burgundy", "Mosel", "Southern Rhône and Spain", "Champagne"], correct: 2, explanation: "Grenache thrives in warm Mediterranean climates, featuring prominently in Châteauneuf-du-Pape and other Southern Rhône wines, as well as Spanish Garnacha from regions like Priorat and Campo de Borja." },
  { id: 16, question: "What is distinctive about Tempranillo's flavor profile?", options: ["High acidity with citrus notes", "Leather, tobacco, and cherry with earthy undertones", "Intense floral aromatics", "Always tastes of new oak"], correct: 1, explanation: "Tempranillo is known for savory characteristics including leather, tobacco, dried herbs, and cherry fruit. It's Spain's noble grape, starring in Rioja and Ribera del Duero." },
  { id: 17, question: "Sangiovese is the primary grape in:", options: ["Barolo", "Chianti", "Amarone", "Valpolicella"], correct: 1, explanation: "Sangiovese is the backbone of Chianti, Brunello di Montalcino, and Vino Nobile di Montepulciano. It shows cherry, herb, and earthy characteristics with firm tannins and high acidity." },
  { id: 18, question: "Which grape variety is used for Barolo and Barbaresco?", options: ["Sangiovese", "Nebbiolo", "Barbera", "Dolcetto"], correct: 1, explanation: "Nebbiolo produces Italy's most prestigious wines in Piedmont. Despite pale color, it has powerful tannins and develops complex tar, rose, and truffle notes with age." },
  { id: 19, question: "Gamay is the grape variety used in:", options: ["Côtes du Rhône", "Beaujolais", "Burgundy reds", "Chinon"], correct: 1, explanation: "Gamay is synonymous with Beaujolais, producing fruity, low-tannin wines. Beaujolais Nouveau is released weeks after harvest, while Cru Beaujolais can age for years." },
  { id: 20, question: "Which statement about Zinfandel is TRUE?", options: ["It is only grown in France", "It can make both powerful reds and sweet pink wines", "It always has low alcohol", "It is the same grape as Merlot"], correct: 1, explanation: "Zinfandel is California's signature grape, making everything from powerful, high-alcohol reds to sweet 'White Zinfandel' rosé. It's genetically identical to Italian Primitivo and Croatian Crljenak." },
  { id: 21, question: "Malbec has become the signature grape of:", options: ["Chile", "Argentina", "South Africa", "New Zealand"], correct: 1, explanation: "While originally from Cahors, France, Malbec found its true home in Argentina, especially Mendoza. Argentine Malbec is typically riper and more fruit-forward than French versions." },
  { id: 22, question: "Carménère was originally from which region before becoming associated with Chile?", options: ["Burgundy", "Bordeaux", "Rhône Valley", "Loire Valley"], correct: 1, explanation: "Carménère was a traditional Bordeaux variety nearly wiped out by phylloxera. It was rediscovered in Chile in 1994, where it had been misidentified as Merlot, and is now Chile's signature grape." },
  { id: 23, question: "Pinotage is a cross between Pinot Noir and:", options: ["Shiraz", "Cinsaut", "Grenache", "Mourvèdre"], correct: 1, explanation: "Pinotage was created in South Africa in 1925 by crossing Pinot Noir with Cinsaut (then called Hermitage). It's now South Africa's signature red grape." },
  { id: 24, question: "Which grape variety is most associated with New Zealand?", options: ["Chardonnay", "Riesling", "Sauvignon Blanc", "Pinot Gris"], correct: 2, explanation: "Sauvignon Blanc, especially from Marlborough, put New Zealand on the world wine map. The style is intensely aromatic with passion fruit, gooseberry, and herbaceous notes." },
  { id: 25, question: "Albariño is the signature white grape of:", options: ["Rioja, Spain", "Rías Baixas, Spain", "Douro, Portugal", "Ribera del Duero, Spain"], correct: 1, explanation: "Albariño thrives in the cool, wet climate of Rías Baixas in northwest Spain. It produces aromatic, crisp whites with stone fruit and citrus notes, perfect with seafood." },
  { id: 26, question: "Grüner Veltliner is the most planted grape variety in:", options: ["Germany", "Austria", "Switzerland", "Hungary"], correct: 1, explanation: "Grüner Veltliner is Austria's signature white grape, producing wines ranging from light and peppery to rich and age-worthy. It's known for white pepper and citrus notes." },
  { id: 27, question: "Which grape variety is known for developing 'petrol' aromas with age?", options: ["Chardonnay", "Sauvignon Blanc", "Riesling", "Gewürztraminer"], correct: 2, explanation: "Aged Riesling develops a distinctive petrol or kerosene aroma (TDN compound), considered desirable by enthusiasts. This develops most in warmer vintages and with bottle age." },
  { id: 28, question: "Torrontés is the aromatic white grape of:", options: ["Chile", "Argentina", "Uruguay", "Brazil"], correct: 1, explanation: "Torrontés is Argentina's signature white grape, producing intensely aromatic wines with floral and Muscat-like characteristics. It thrives at high altitude in Salta." },
  { id: 29, question: "What style of wine is Viognier best known for?", options: ["Light, acidic, and mineral", "Full-bodied with stone fruit and floral aromas", "Sweet dessert wines only", "Sparkling wines"], correct: 1, explanation: "Viognier produces full-bodied, aromatic whites with apricot, peach, and floral notes. It typically has low acidity and is the sole grape in Condrieu in the Northern Rhône." },
  { id: 30, question: "Mourvèdre is known by what name in Spain?", options: ["Garnacha", "Monastrell", "Tempranillo", "Mencía"], correct: 1, explanation: "Mourvèdre is called Monastrell in Spain, where it's grown extensively in Jumilla and other southeastern regions. It's also a key blending grape in Bandol and Châteauneuf-du-Pape." },
  { id: 31, question: "Which wine region is located on the Left Bank of Bordeaux?", options: ["Pomerol", "Saint-Émilion", "Médoc", "Fronsac"], correct: 2, explanation: "The Médoc (including Margaux, Pauillac, Saint-Julien, Saint-Estèphe) is on the Left Bank, dominated by Cabernet Sauvignon. The Right Bank (Pomerol, Saint-Émilion) features more Merlot." },
  { id: 32, question: "The Côte d'Or in Burgundy is divided into:", options: ["Côte de Nuits and Côte de Beaune", "Chablis and Mâconnais", "Côte Chalonnaise and Beaujolais", "Pouilly and Sancerre"], correct: 0, explanation: "The Côte d'Or ('Golden Slope') comprises the Côte de Nuits (primarily red wines) in the north and Côte de Beaune (both red and famous whites) in the south." },
  { id: 33, question: "Which region is known as the birthplace of Syrah?", options: ["Barossa Valley", "Northern Rhône", "Languedoc", "South Africa"], correct: 1, explanation: "The Northern Rhône, particularly Hermitage and Côte-Rôtie, is considered Syrah's birthplace. These steep granite hillsides produce some of the world's most celebrated Syrah." },
  { id: 34, question: "Marlborough is famous for which style of wine?", options: ["Full-bodied Chardonnay", "Intense, aromatic Sauvignon Blanc", "Sweet Riesling", "Sparkling wine"], correct: 1, explanation: "Marlborough, New Zealand's largest wine region, revolutionized Sauvignon Blanc with its intensely aromatic, herbaceous style featuring passion fruit and grapefruit." },
  { id: 35, question: "What type of climate does the Mosel region have?", options: ["Warm and dry", "Cool and continental", "Mediterranean", "Tropical"], correct: 1, explanation: "The Mosel has a cool continental climate, one of Germany's northernmost wine regions. Steep slate slopes and river reflection help ripen Riesling." },
  { id: 36, question: "Napa Valley is primarily known for which grape variety?", options: ["Pinot Noir", "Merlot", "Cabernet Sauvignon", "Zinfandel"], correct: 2, explanation: "Napa Valley is California's premier Cabernet Sauvignon region, producing powerful, age-worthy wines. The region's warm climate and diverse soils create distinctive styles." },
  { id: 37, question: "Which of the following is a DOCG wine from Tuscany?", options: ["Barolo", "Amarone", "Brunello di Montalcino", "Soave"], correct: 2, explanation: "Brunello di Montalcino is a prestigious Tuscan DOCG made from 100% Sangiovese (locally called Brunello). Barolo and Amarone are from Piedmont and Veneto respectively." },
  { id: 38, question: "The Douro Valley is famous for producing:", options: ["Sherry", "Madeira", "Port", "Cava"], correct: 2, explanation: "The Douro Valley in northern Portugal is the home of Port wine. The steep, terraced vineyards along the Douro River also produce excellent unfortified reds." },
  { id: 39, question: "Rioja wines are typically aged in which type of oak?", options: ["French oak only", "American oak traditionally, increasingly French", "Hungarian oak only", "No oak is used"], correct: 1, explanation: "Rioja traditionally used American oak, giving distinctive coconut and dill notes. Modern producers increasingly use French oak for more subtle influence, or a combination." },
  { id: 40, question: "Which Australian region is most famous for Shiraz?", options: ["Margaret River", "Yarra Valley", "Barossa Valley", "Tasmania"], correct: 2, explanation: "The Barossa Valley produces Australia's most iconic Shiraz—rich, full-bodied wines with ripe fruit and often eucalyptus notes. Old vines dating to the 1840s contribute to its reputation." },
  { id: 41, question: "The traditional method for making Champagne involves:", options: ["Fermentation in stainless steel tanks", "Second fermentation in the bottle", "Adding CO2 artificially", "Fermentation in oak barrels only"], correct: 1, explanation: "The traditional method (méthode traditionnelle) involves a second fermentation in bottle, creating bubbles naturally. This is followed by riddling and disgorgement to remove yeast sediment." },
  { id: 42, question: "What is the term for the process of removing yeast sediment from Champagne?", options: ["Riddling", "Dosage", "Disgorgement", "Lees stirring"], correct: 2, explanation: "Disgorgement (dégorgement) removes the frozen plug of yeast sediment collected in the neck during riddling. The bottle is then topped up with dosage liqueur." },
  { id: 43, question: "Which of the following is NOT a permitted grape in Champagne?", options: ["Chardonnay", "Pinot Noir", "Pinot Meunier", "Chenin Blanc"], correct: 3, explanation: "Champagne permits three main grapes: Chardonnay, Pinot Noir, and Pinot Meunier. Chenin Blanc is used for sparkling wines in the Loire (Crémant de Loire, Vouvray)." },
  { id: 44, question: "A Champagne labeled 'Blanc de Blancs' is made from:", options: ["Red grapes only", "White grapes only", "A blend of red and white grapes", "Muscat grapes"], correct: 1, explanation: "Blanc de Blancs means 'white from whites'—made exclusively from white grapes (Chardonnay in Champagne). These wines tend to be lighter and more elegant." },
  { id: 45, question: "What does 'Brut' indicate on a Champagne label?", options: ["Sweet", "Very dry to dry", "Medium sweet", "No sugar added"], correct: 1, explanation: "Brut indicates a dry style with less than 12g/L residual sugar. It's the most common Champagne style. Extra Brut is drier; Demi-Sec is sweeter." },
  { id: 46, question: "Prosecco is produced using which method?", options: ["Traditional method", "Tank method (Charmat)", "Ancestral method", "Transfer method"], correct: 1, explanation: "Prosecco uses the tank/Charmat method, where secondary fermentation occurs in large pressurized tanks. This preserves fresh, fruity Glera grape character and is more economical." },
  { id: 47, question: "Cava is a sparkling wine from which country?", options: ["France", "Italy", "Spain", "Portugal"], correct: 2, explanation: "Cava is Spain's traditional method sparkling wine, primarily from Penedès in Catalonia. It uses local grapes Macabeo, Parellada, and Xarel-lo." },
  { id: 48, question: "Sherry comes from which region of Spain?", options: ["Rioja", "Jerez", "Ribera del Duero", "Priorat"], correct: 1, explanation: "Sherry comes from the 'Sherry Triangle' around Jerez de la Frontera in Andalucía, southern Spain. The unique solera system and flor yeast create distinctive styles." },
  { id: 49, question: "What is 'flor' in Sherry production?", options: ["A type of grape", "A layer of yeast that protects wine from oxidation", "A specific vineyard", "A type of oak barrel"], correct: 1, explanation: "Flor is a layer of native yeast that forms on the surface of certain Sherries (Fino, Manzanilla), protecting them from oxygen and creating distinctive tangy, yeasty flavors." },
  { id: 50, question: "Which Sherry style is the driest?", options: ["Cream Sherry", "Pedro Ximénez", "Fino", "Oloroso"], correct: 2, explanation: "Fino is the driest Sherry style, aged under flor, with tangy, saline, almond notes. Oloroso is dry but richer; Cream and PX are sweet styles." },
  { id: 51, question: "Port wine is fortified with:", options: ["Brandy during fermentation", "Neutral spirit after fermentation", "Sherry", "Sugar syrup"], correct: 0, explanation: "Port is fortified with grape spirit (aguardente) during fermentation, killing the yeast while residual sugar remains. This creates a sweet, high-alcohol wine (19-22% ABV)." },
  { id: 52, question: "Which style of Port is aged primarily in bottle?", options: ["Ruby Port", "Tawny Port", "Vintage Port", "White Port"], correct: 2, explanation: "Vintage Port (Vintage/Late Bottled Vintage/Vintage) is aged primarily in bottle after minimal cask time, developing complex flavors over decades. Tawny ages in cask." },
  { id: 53, question: "Tawny Port gets its color from:", options: ["Red grape skins", "Extended barrel aging causing oxidation", "Addition of caramel", "Blending with white Port"], correct: 1, explanation: "Tawny Port's amber color develops from extended oxidative aging in small barrels. This also creates nutty, caramel, and dried fruit flavors." },
  { id: 54, question: "Madeira is known for what unique production process?", options: ["Freezing the grapes", "Heating the wine (estufagem)", "Underwater aging", "Adding herbs and spices"], correct: 1, explanation: "Madeira undergoes estufagem (heating) which gives it remarkable longevity and distinctive caramelized, nutty flavors. This process was discovered accidentally during long sea voyages." },
  { id: 55, question: "Malolactic fermentation converts:", options: ["Sugar to alcohol", "Malic acid to lactic acid", "Alcohol to vinegar", "Lactic acid to malic acid"], correct: 1, explanation: "MLF converts sharp malic acid (green apple) to softer lactic acid (dairy), reducing perceived acidity and adding buttery, creamy notes. Common in red wines and oaked Chardonnay." },
  { id: 56, question: "What is the purpose of 'lees stirring' (bâtonnage)?", options: ["To clarify the wine", "To add texture and complexity", "To increase alcohol", "To reduce acidity"], correct: 1, explanation: "Bâtonnage involves stirring dead yeast cells (lees) back into wine, adding creamy texture, complexity, and protecting against oxidation. Common in Burgundy Chardonnay." },
  { id: 57, question: "Oak aging can impart which flavors to wine?", options: ["Citrus and green apple", "Vanilla, toast, and spice", "Petrol and floral notes", "Grass and gooseberry"], correct: 1, explanation: "Oak contributes vanilla, toast, smoke, coconut, clove, and sweet spice flavors. It also adds tannin, allows micro-oxygenation, and impacts texture." },
  { id: 58, question: "What is carbonic maceration?", options: ["Aging wine underwater", "Whole-bunch fermentation in CO2 atmosphere", "Adding carbon dioxide to still wine", "Fermenting in stainless steel"], correct: 1, explanation: "Carbonic maceration involves fermenting whole, uncrushed grapes in a CO2-filled tank. It produces fruity, low-tannin wines with distinctive bubblegum/banana notes. Classic for Beaujolais Nouveau." },
  { id: 59, question: "The purpose of fining in winemaking is:", options: ["To add flavor", "To increase alcohol content", "To clarify and stabilize the wine", "To add color"], correct: 2, explanation: "Fining removes unwanted particles, proteins, or phenolics that could cause haziness or off-flavors. Common agents include bentonite (clay), egg whites, and isinglass." },
  { id: 60, question: "What does 'sur lie' aging mean?", options: ["Aging on the skins", "Aging on the lees (dead yeast cells)", "Aging in new oak", "Aging in bottle"], correct: 1, explanation: "Sur lie means aging wine on its lees (dead yeast cells), adding texture, complexity, and sometimes a slight spritz. Classic for Muscadet Sèvre et Maine." },
  { id: 61, question: "Cold stabilization is used to:", options: ["Increase alcohol", "Prevent tartrate crystal formation", "Add flavor", "Darken the wine's color"], correct: 1, explanation: "Cold stabilization precipitates tartrate crystals before bottling by chilling wine near freezing. These harmless crystals can form otherwise in refrigerated bottles." },
  { id: 62, question: "Which statement about stainless steel fermentation is TRUE?", options: ["It always adds oak flavor", "It preserves fresh fruit character", "It is only used for red wines", "It increases tannin"], correct: 1, explanation: "Stainless steel is inert, preserving fresh, primary fruit flavors without adding oak influence. Temperature control is precise, making it ideal for aromatic whites." },
  { id: 63, question: "What is the effect of a warm climate on grape ripeness?", options: ["Lower sugar, higher acid", "Higher sugar, lower acid", "No effect on sugar or acid", "Lower sugar, lower acid"], correct: 1, explanation: "Warm climates produce riper grapes with higher sugars (thus higher potential alcohol) and lower acidity. Cool climates retain more acidity with lower sugar levels." },
  { id: 64, question: "Phylloxera is:", options: ["A type of grape", "A vine pest that attacks roots", "A winemaking technique", "A wine region"], correct: 1, explanation: "Phylloxera is a root louse that devastated European vineyards in the late 1800s. The solution was grafting European vines onto resistant American rootstocks." },
  { id: 65, question: "What is terroir?", options: ["A type of barrel", "The complete natural environment where wine is produced", "A winemaking technique", "A grape variety"], correct: 1, explanation: "Terroir encompasses all environmental factors affecting grape growing: soil, climate, topography, and human tradition. It's why the same grape tastes different in different places." },
  { id: 66, question: "Continental climate is characterized by:", options: ["Mild winters and cool summers", "Hot, dry conditions year-round", "Warm summers and cold winters", "Constant rainfall"], correct: 2, explanation: "Continental climate has significant temperature variation between seasons—warm to hot summers and cold winters. Examples include Burgundy, Alsace, and parts of Germany." },
  { id: 67, question: "Which soil type is associated with the best Chablis vineyards?", options: ["Chalk and limestone (Kimmeridgian)", "Granite", "Volcanic", "Sand"], correct: 0, explanation: "Chablis' finest vineyards sit on Kimmeridgian limestone/marl, ancient seabed rich in fossilized oyster shells. This contributes to the wines' distinctive mineral, flinty character." },
  { id: 68, question: "Why might a winemaker choose to harvest at night?", options: ["It's traditional", "To preserve freshness and acidity in warm climates", "Grapes are sweeter at night", "To avoid insects"], correct: 1, explanation: "Night harvesting in warm climates keeps grapes cool, preventing premature fermentation and preserving fresh flavors and acidity. It also reduces oxidation." },
  { id: 69, question: "What is the ideal serving temperature for full-bodied red wines?", options: ["4-8°C", "8-12°C", "15-18°C", "Room temperature (20°C+)"], correct: 2, explanation: "Full-bodied reds are best at 15-18°C (60-65°F). Too warm emphasizes alcohol; too cold mutes aromas and accentuates tannins. 'Room temperature' is an outdated term." },
  { id: 70, question: "Champagne should be served at:", options: ["Room temperature", "6-10°C", "15-18°C", "0-4°C"], correct: 1, explanation: "Champagne is best at 6-10°C (43-50°F). Colder temperatures preserve bubbles and freshness. Vintage Champagnes can be served slightly warmer to show complexity." },
  { id: 71, question: "Which type of wine glass is best for aromatic white wines?", options: ["A narrow flute", "A wide, shallow bowl", "A medium bowl that tapers at the rim", "Any glass will do"], correct: 2, explanation: "Aromatic whites benefit from glasses with medium bowls that taper at the rim, concentrating aromas while allowing swirling. Too wide disperses aromatics; too narrow restricts them." },
  { id: 72, question: "Decanting is most beneficial for:", options: ["Young, light white wines", "Old red wines with sediment or young, tannic reds", "All sparkling wines", "Sweet dessert wines"], correct: 1, explanation: "Decanting separates sediment from aged reds and aerates young, tannic wines to soften them. Old wines need gentle decanting; young wines benefit from vigorous aeration." },
  { id: 73, question: "What causes cork taint in wine?", options: ["Old corks", "TCA (trichloroanisole) contamination", "Improper storage", "Natural cork variation"], correct: 1, explanation: "Cork taint is caused by TCA, a compound formed when fungi in cork interact with chlorine-based compounds. It creates musty, wet cardboard aromas, affecting 1-3% of corked wines." },
  { id: 74, question: "Wine should ideally be stored:", options: ["Upright in a warm room", "On its side in a cool, dark place", "In the refrigerator long-term", "Near a window for light exposure"], correct: 1, explanation: "Wine stores best on its side (keeping cork moist) in cool (10-15°C), dark, humid conditions with minimal vibration. Light, heat, and dryness damage wine." },
  { id: 75, question: "High tannin wines pair best with:", options: ["Delicate fish dishes", "Rich, fatty meats", "Spicy Asian cuisine", "Light salads"], correct: 1, explanation: "Tannins bind with proteins and fats, so tannic reds pair excellently with fatty meats (steak, lamb). The fat softens the tannins, creating balance." },
  { id: 76, question: "Which wine would best complement a creamy pasta dish?", options: ["Tannic Barolo", "Oaked Chardonnay", "Dry Fino Sherry", "Sweet Riesling"], correct: 1, explanation: "Oaked Chardonnay's creamy, buttery texture and moderate acidity complement cream-based dishes. Its weight matches the richness without overwhelming the food." },
  { id: 77, question: "Sweet wines pair well with:", options: ["Only desserts", "Salty cheeses and foie gras", "Red meat", "Green vegetables"], correct: 1, explanation: "Sweet wines create brilliant contrasts with salty foods (Sauternes with Roquefort, Port with Stilton) and complement rich foie gras. They're not limited to desserts." },
  { id: 78, question: "Why does Sauvignon Blanc pair well with goat cheese?", options: ["They are from the same region", "The wine's acidity cuts through the cheese's richness", "They have the same color", "No particular reason"], correct: 1, explanation: "Classic pairing: Sauvignon Blanc's high acidity and herbaceous notes complement tangy goat cheese (Sancerre region produces both). Acidity cleanses the palate between bites." },
  { id: 79, question: "What does 'Grand Cru' mean in Burgundy?", options: ["A large producer", "The highest vineyard classification", "A style of winemaking", "A type of grape"], correct: 1, explanation: "Grand Cru ('great growth') is Burgundy's highest vineyard classification, representing the best terroirs. Only about 1% of Burgundy vineyards hold this status." },
  { id: 80, question: "In Germany, what does 'Trocken' on a label indicate?", options: ["Sweet wine", "Dry wine", "Sparkling wine", "Late harvest wine"], correct: 1, explanation: "Trocken means 'dry' in German, indicating wines with minimal residual sugar (less than 9g/L). Halbtrocken means 'half-dry' or off-dry." },
  { id: 81, question: "What is the difference between DOC and DOCG in Italy?", options: ["There is no difference", "DOCG is a higher quality classification than DOC", "DOC is higher than DOCG", "They apply to different regions"], correct: 1, explanation: "DOCG (Denominazione di Origine Controllata e Garantita) is Italy's highest classification, with stricter production rules and tasting approval. DOC is one level below." },
  { id: 82, question: "AOC/AOP in France guarantees:", options: ["Wine quality", "Geographic origin and production methods", "Grape variety used", "Vintage year"], correct: 1, explanation: "AOC (Appellation d'Origine Contrôlée) / AOP guarantees geographic origin and adherence to regional production rules (grape varieties, yields, methods). It doesn't guarantee quality per se." },
  { id: 83, question: "What does 'Reserva' mean on a Spanish wine label?", options: ["The winery's best vineyard", "Extended aging before release", "Higher alcohol content", "Organic production"], correct: 1, explanation: "Reserva indicates extended aging: for reds, minimum 3 years with at least 1 year in oak. Gran Reserva requires 5 years minimum with 18 months in oak." },
  { id: 84, question: "A wine labeled 'Old Vine' or 'Vieilles Vignes' suggests:", options: ["The wine is old", "Grapes from mature, low-yielding vines", "Traditional winemaking", "The winery is historic"], correct: 1, explanation: "Old vines (often 35+ years) produce smaller yields of more concentrated fruit. There's no legal definition, but these wines often show more complexity and depth." },
  { id: 85, question: "What does 'Estate Bottled' mean?", options: ["Bottled in a castle", "Grapes grown and wine bottled on the same property", "Premium quality designation", "Hand-harvested grapes"], correct: 1, explanation: "Estate Bottled indicates the winery grew the grapes and bottled the wine at their property. It implies control over the entire production process." },
  { id: 86, question: "Which region is known for producing wine from grapes dried on straw mats?", options: ["Champagne", "Veneto (for Amarone and Recioto)", "Burgundy", "Bordeaux"], correct: 1, explanation: "In Veneto, grapes for Amarone and Recioto undergo appassimento—drying on mats or racks for months to concentrate sugars before fermentation, creating rich, intense wines." },
  { id: 87, question: "The '1855 Classification' applies to which region?", options: ["Burgundy", "Champagne", "Bordeaux (Médoc and Sauternes)", "Rhône Valley"], correct: 2, explanation: "The 1855 Classification ranked Bordeaux estates for the Paris Exhibition, creating the famous First through Fifth Growth hierarchy for Médoc reds and Sauternes sweet wines." },
  { id: 88, question: "Clare Valley and Eden Valley in Australia are best known for:", options: ["Shiraz", "Chardonnay", "Riesling", "Cabernet Sauvignon"], correct: 2, explanation: "Clare Valley and Eden Valley produce Australia's finest Rieslings—dry, lime-scented wines with excellent aging potential. The high altitude provides cool nights ideal for this variety." },
  { id: 89, question: "What does 'Einzellage' mean on a German wine label?", options: ["A region", "A single vineyard site", "A grape variety", "A quality level"], correct: 1, explanation: "Einzellage refers to a single vineyard site in Germany. Premium wines often display the village name followed by the vineyard name (e.g., Wehlener Sonnenuhr)." },
  { id: 90, question: "The Bekaa Valley is the main wine region of:", options: ["Israel", "Turkey", "Lebanon", "Greece"], correct: 2, explanation: "Lebanon's Bekaa Valley, at 900-1000m altitude between mountain ranges, produces most of the country's wine. Château Musar is the most famous producer." },
  { id: 91, question: "What is the main effect of altitude on grape growing?", options: ["Higher humidity", "Warmer temperatures at night", "Greater temperature variation and UV exposure", "Less sunlight"], correct: 2, explanation: "High altitude means cooler temperatures (especially at night, preserving acidity), greater diurnal range, more intense UV light (thicker skins), and often reduced disease pressure." },
  { id: 92, question: "A maritime climate is characterized by:", options: ["Hot summers and cold winters", "Moderate temperatures year-round due to ocean influence", "Very dry conditions", "Extreme temperature swings"], correct: 1, explanation: "Maritime climates have ocean-moderated temperatures—mild winters, cool summers, less extreme variation. Examples include Bordeaux, parts of Chile, and Western Australia." },
  { id: 93, question: "Santorini is known for which grape variety?", options: ["Agiorgitiko", "Assyrtiko", "Moschofilero", "Xinomavro"], correct: 1, explanation: "Santorini's volcanic soils and unique basket-trained vines (kouloura) produce distinctive Assyrtiko—mineral-driven, high-acid white wines that age remarkably well." },
  { id: 94, question: "What is Rutherglen famous for?", options: ["Sparkling Shiraz", "Fortified Muscat and Tokay (Muscadelle)", "Pinot Noir", "Dry Riesling"], correct: 1, explanation: "Rutherglen in Victoria, Australia produces lusciously sweet, fortified Muscat and Topaque (formerly Tokay, made from Muscadelle) aged for decades in the solera-style." },
  { id: 95, question: "What is a diurnal temperature range?", options: ["Temperature difference between seasons", "Temperature difference between day and night", "The average yearly temperature", "Temperature of the soil"], correct: 1, explanation: "Diurnal range is the difference between day and night temperatures. Large diurnal range helps grapes develop flavor while maintaining acidity—common at high altitude and in continental climates." },
  { id: 96, question: "The 'rain shadow effect' benefits which wine region?", options: ["Champagne", "Mendoza, Argentina", "Mosel, Germany", "Burgundy"], correct: 1, explanation: "Mendoza sits in the rain shadow of the Andes—mountains block Pacific moisture, creating a dry climate ideal for viticulture. Irrigation from Andean snowmelt is essential." },
  { id: 97, question: "PX (Pedro Ximénez) Sherry is:", options: ["Bone dry", "Made under flor", "Intensely sweet from sun-dried grapes", "Always blended"], correct: 2, explanation: "Pedro Ximénez Sherry is extremely sweet, made from sun-dried PX grapes. It's dark, syrupy, with raisin, fig, and molasses flavors—often used to sweeten other Sherries." },
  { id: 98, question: "What is LBV Port?", options: ["Light-bodied vintage Port", "Late Bottled Vintage Port, aged 4-6 years in cask", "Limited bottle vintage Port", "Low-budget value Port"], correct: 1, explanation: "Late Bottled Vintage (LBV) Port is aged 4-6 years in cask before bottling—longer than Ruby, shorter than Vintage Port. It's ready to drink with less sediment than Vintage." },
  { id: 99, question: "Which winemaking technique is used to increase color extraction in red wines?", options: ["Cold fermentation", "Extended maceration", "Malolactic fermentation", "Early bottling"], correct: 1, explanation: "Extended maceration (leaving juice in contact with skins after fermentation) extracts more color, tannin, and flavor compounds. Common for age-worthy reds." },
  { id: 100, question: "What is whole-bunch fermentation?", options: ["Using only the best grape bunches", "Fermenting grapes with stems included", "Fermenting in large batches", "Using whole berries only"], correct: 1, explanation: "Whole-bunch fermentation includes grape stems during fermentation, adding structure, freshness, and sometimes herbal/spice notes. Popular in Burgundy and increasingly in Rhône and beyond." },

  // NEW 100 QUESTIONS (IDs 101-200)
  { id: 101, question: "Which characteristic is typical of Pinot Noir from Burgundy?", options: ["Deep, inky color", "High tannin and full body", "Light to medium body with red fruit and earthy notes", "Jammy, overripe fruit flavors"], correct: 2, explanation: "Burgundy Pinot Noir is typically light to medium-bodied with delicate red fruit (cherry, raspberry), floral notes, and earthy/mushroom undertones. It rarely achieves deep color or heavy tannins." },
  { id: 102, question: "What flavors are characteristic of Cabernet Franc?", options: ["Tropical fruit and honey", "Bell pepper, raspberry, and violet", "Citrus and mineral", "Butter and vanilla"], correct: 1, explanation: "Cabernet Franc is known for its herbaceous character (bell pepper, leafy notes), red fruit (raspberry, strawberry), violet florals, and pencil lead. It's typically lighter than Cabernet Sauvignon." },
  { id: 103, question: "Vermentino is a white grape variety associated with which regions?", options: ["Burgundy and Champagne", "Sardinia and Provence", "Rioja and Ribera del Duero", "Mosel and Alsace"], correct: 1, explanation: "Vermentino thrives in Mediterranean climates, particularly Sardinia (where it's the signature white) and Provence/Corsica (where it's called Rolle). It produces fresh, citrusy wines with herbal notes." },
  { id: 104, question: "Which grape variety is Amarone della Valpolicella primarily made from?", options: ["Sangiovese", "Nebbiolo", "Corvina", "Montepulciano"], correct: 2, explanation: "Corvina is the principal grape in Amarone (minimum 45-95%), often blended with Rondinella and Corvinone. These grapes are dried (appassimento) before fermentation." },
  { id: 105, question: "Verdejo is a white grape variety most associated with:", options: ["Portugal", "Spain's Rueda region", "South Africa", "Argentina"], correct: 1, explanation: "Verdejo is the signature grape of Rueda in northwest Spain. It produces aromatic whites with fennel, citrus, and stone fruit notes, often with slight bitterness on the finish." },
  { id: 106, question: "What style of wine is Muscadet?", options: ["Sweet and aromatic", "Full-bodied and oaky", "Light, dry, and neutral with mineral notes", "Sparkling"], correct: 2, explanation: "Muscadet (from Melon de Bourgogne) is a light, dry, neutral white from the Loire Valley. Sur lie aging adds texture and slight yeastiness. Perfect with oysters and seafood." },
  { id: 107, question: "Touriga Nacional is the most prized grape for:", options: ["Rioja wines", "Port and Douro reds", "Chianti", "Champagne"], correct: 1, explanation: "Touriga Nacional is Portugal's finest red grape, essential for premium Port and increasingly important for top Douro table wines. It offers intense color, floral aromatics, and structured tannins." },
  { id: 108, question: "Which of these grapes is aromatic?", options: ["Chardonnay", "Trebbiano", "Muscat", "Melon de Bourgogne"], correct: 2, explanation: "Muscat is highly aromatic with distinctive grapey, floral, and sweet spice notes. Chardonnay, Trebbiano, and Melon de Bourgogne are considered neutral varieties." },
  { id: 109, question: "Cinsaut (Cinsault) is commonly used in:", options: ["Burgundy reds", "Southern Rhône blends and South African rosé", "German Riesling blends", "Champagne"], correct: 1, explanation: "Cinsaut is a key blending grape in Southern Rhône and Provence wines, valued for its perfume and softness. In South Africa, it's used for rosé and was crossed with Pinot Noir to create Pinotage." },
  { id: 110, question: "What distinguishes Pinot Gris from Pinot Grigio?", options: ["They are completely different grapes", "Pinot Gris (Alsace style) is richer and fuller than Pinot Grigio (Italian style)", "Pinot Grigio is always sweeter", "There is no difference"], correct: 1, explanation: "Same grape, different styles: Alsace Pinot Gris is typically richer, fuller-bodied, sometimes with residual sugar and honeyed notes. Italian Pinot Grigio is usually light, crisp, and neutral." },
  { id: 111, question: "Which statement about Marsanne and Roussanne is correct?", options: ["They are red grape varieties", "They are often blended together in Northern Rhône whites", "They are only grown in Italy", "They require cold climates"], correct: 1, explanation: "Marsanne and Roussanne are white Rhône varieties often blended together. Marsanne adds weight and nuttiness; Roussanne contributes acidity, herbal notes, and elegance." },
  { id: 112, question: "Nero d'Avola is the most important red grape of:", options: ["Tuscany", "Piedmont", "Sicily", "Lombardy"], correct: 2, explanation: "Nero d'Avola is Sicily's signature red grape, producing wines ranging from easy-drinking to serious, age-worthy reds with dark fruit, spice, and chocolate notes." },
  { id: 113, question: "What is the key characteristic of Tannat wines?", options: ["Light body and low tannin", "Very high tannin and deep color", "Aromatic and floral", "High residual sugar"], correct: 1, explanation: "Tannat is named for its extremely high tannin content. Native to southwest France (Madiran), it found success in Uruguay. Modern winemaking can tame its astringency." },
  { id: 114, question: "Aglianico is a red grape grown primarily in:", options: ["Northern Italy", "Southern Italy (Campania and Basilicata)", "Sicily", "Sardinia"], correct: 1, explanation: "Aglianico produces powerful, age-worthy reds in Campania (Taurasi) and Basilicata (Aglianico del Vulture). Often called 'the Barolo of the South' for its structure and complexity." },
  { id: 115, question: "Which grape variety is associated with orange/amber wines from Georgia?", options: ["Saperavi", "Rkatsiteli", "Both Saperavi and Rkatsiteli", "Mtsvane only"], correct: 1, explanation: "Rkatsiteli is Georgia's most planted white grape, often used for traditional amber wines fermented with extended skin contact in qvevri (clay vessels). Saperavi is the main red grape." },
  { id: 116, question: "Furmint is the primary grape for:", options: ["Austrian Grüner Veltliner", "Hungarian Tokaji", "German Riesling", "Italian Prosecco"], correct: 1, explanation: "Furmint is the principal grape for Hungary's famous Tokaji Aszú sweet wines. It's susceptible to noble rot and maintains high acidity even at high sugar levels." },
  { id: 117, question: "Which variety is Côte-Rôtie famous for blending with Syrah?", options: ["Marsanne", "Grenache", "Viognier", "Roussanne"], correct: 2, explanation: "Côte-Rôtie uniquely permits adding up to 20% white Viognier to red Syrah, co-fermented for aromatic lift, perfume, and color stabilization. Few other regions allow this practice." },
  { id: 118, question: "What is Bobal?", options: ["A Spanish white grape", "A Spanish red grape from Valencia/Utiel-Requena", "A Portuguese grape", "A French grape"], correct: 1, explanation: "Bobal is Spain's third most-planted red grape, concentrated in Valencia's Utiel-Requena region. It produces dark, fruity wines and is increasingly valued for quality production." },
  { id: 119, question: "Schiava (Vernatsch) is associated with which wine region?", options: ["Tuscany", "Alto Adige/Südtirol", "Veneto", "Piedmont"], correct: 1, explanation: "Schiava is the traditional red grape of Alto Adige in northern Italy. It produces light, fruity, low-tannin wines often compared to Beaujolais in style." },
  { id: 120, question: "What characterizes Godello wines?", options: ["High tannin and deep color", "Rich, textured whites with stone fruit and mineral notes", "Light, fizzy, and simple", "Always sweet"], correct: 1, explanation: "Godello from Valdeorras and Bierzo in northwest Spain produces rich, textured white wines with stone fruit, citrus, and distinctive mineral character. It's experiencing a quality renaissance." },
  { id: 121, question: "Petit Verdot is used primarily as:", options: ["A single-variety wine grape", "A blending grape adding color and spice to Bordeaux blends", "A white wine grape", "A sparkling wine grape"], correct: 1, explanation: "Petit Verdot ripens late and is used in small percentages in Bordeaux blends, contributing deep color, violet aromas, and spicy notes. Rarely bottled alone except in warmer regions." },
  { id: 122, question: "Which grape makes Vinho Verde?", options: ["A single specific grape", "Various grapes including Loureiro and Alvarinho", "Albariño only", "Tempranillo"], correct: 1, explanation: "Vinho Verde is a region, not a grape. It uses various local white grapes including Loureiro (floral), Alvarinho (aromatic, structured), Trajadura, and Arinto." },
  { id: 123, question: "Blaufränkisch is known in Austria for producing:", options: ["Light, sweet whites", "Medium to full-bodied reds with cherry and spice", "Aromatic sparkling wines", "Dessert wines only"], correct: 1, explanation: "Blaufränkisch (called Lemberger in Germany, Kékfrankos in Hungary) produces serious red wines in Austria's Burgenland with dark cherry, pepper, and minerality." },
  { id: 124, question: "What is the principal grape in Gavi (Gavi di Gavi)?", options: ["Arneis", "Cortese", "Favorita", "Erbaluce"], correct: 1, explanation: "Cortese is the grape behind Gavi, a crisp, dry white from Piedmont. At its best, it shows citrus, almond, and mineral notes with refreshing acidity." },
  { id: 125, question: "Mencía is a red grape from:", options: ["Portugal's Douro Valley", "Spain's Bierzo region", "France's Languedoc", "Italy's Piedmont"], correct: 1, explanation: "Mencía is the signature red of Bierzo in northwest Spain (and Ribeira Sacra). It produces fragrant, medium-bodied reds with red fruit, floral, and mineral notes." },
  { id: 126, question: "Which statement about Carignan (Carignane/Cariñena) is TRUE?", options: ["It's always light and delicate", "Old vine Carignan can produce concentrated, characterful wines", "It's only used for white wines", "It originated in Burgundy"], correct: 1, explanation: "While bulk Carignan can be rustic, old-vine Carignan (especially from Languedoc, Priorat) produces concentrated, complex wines. It was historically the world's most planted variety." },
  { id: 127, question: "Friulano (formerly Tocai Friulano) is associated with:", options: ["Tuscany", "Friuli-Venezia Giulia", "Sicily", "Lombardy"], correct: 1, explanation: "Friulano is the signature white grape of Friuli in northeast Italy. It produces wines with almond, floral, and herbal notes with a characteristically bitter finish." },
  { id: 128, question: "What grape is Txakoli (Txakolina) made from?", options: ["Tempranillo", "Hondarrabi Zuri", "Albariño", "Verdejo"], correct: 1, explanation: "Txakoli is a light, slightly spritzy, high-acid white from Spain's Basque Country, primarily from Hondarrabi Zuri grapes. It's traditionally poured from height to aerate." },
  { id: 129, question: "Assyrtiko is best known for retaining which characteristic?", options: ["Deep color", "High acidity even in hot climates", "High tannin", "Residual sugar"], correct: 1, explanation: "Assyrtiko remarkably maintains high acidity despite Santorini's hot climate and volcanic soils. This makes it age-worthy and food-friendly despite the Mediterranean heat." },
  { id: 130, question: "What is Pecorino in the wine world?", options: ["A cheese used in wine production", "A white grape from central Italy", "A style of wine from Spain", "A type of oak barrel"], correct: 1, explanation: "Pecorino is a white grape from Marche and Abruzzo in Italy, producing crisp wines with citrus, floral, and mineral notes. The name is unrelated to the cheese (both derive from 'pecora' meaning sheep)." },
  { id: 131, question: "The Willamette Valley is best known for which grape?", options: ["Cabernet Sauvignon", "Pinot Noir", "Syrah", "Zinfandel"], correct: 1, explanation: "Oregon's Willamette Valley has emerged as one of the world's premier Pinot Noir regions, producing elegant wines with red fruit, earth, and spice. Cool climate and varied soils suit the variety." },
  { id: 132, question: "What makes Priorat wines distinctive?", options: ["Slate (llicorella) soils and old-vine Garnacha/Cariñena", "Maritime influence and Tempranillo", "Limestone soils and Pinot Noir", "Volcanic soils and Syrah"], correct: 0, explanation: "Priorat's steep llicorella (slate and quartz) soils with old-vine Garnacha and Cariñena produce intense, mineral-driven wines. It's one of only two DOCa regions in Spain." },
  { id: 133, question: "Which sub-region of Burgundy produces only white wines?", options: ["Côte de Nuits", "Côte de Beaune", "Chablis", "Côte Chalonnaise"], correct: 2, explanation: "Chablis produces exclusively white wines from Chardonnay. The Côte de Nuits is predominantly red; Côte de Beaune and Côte Chalonnaise produce both." },
  { id: 134, question: "The Casablanca Valley in Chile is known for:", options: ["Warm-climate Cabernet Sauvignon", "Cool-climate whites and Pinot Noir", "Fortified wines", "Traditional method sparkling"], correct: 1, explanation: "Casablanca Valley's coastal fog influence creates cool conditions ideal for Sauvignon Blanc, Chardonnay, and Pinot Noir. It's Chile's pioneering cool-climate region." },
  { id: 135, question: "What is unique about Jerez's 'albariza' soils?", options: ["They are volcanic", "They are white, chalky, and retain moisture well", "They are rich in iron", "They are primarily sand"], correct: 1, explanation: "Albariza is the prized white, chalky soil of Jerez, containing up to 80% calcium carbonate. It reflects heat, retains moisture, and produces Sherry's finest wines." },
  { id: 136, question: "Hawke's Bay, New Zealand is best known for:", options: ["Sauvignon Blanc", "Bordeaux-style reds and Chardonnay", "Pinot Noir", "Riesling"], correct: 1, explanation: "Hawke's Bay on New Zealand's North Island has a warmer climate suited to Bordeaux varieties (Cabernet, Merlot, Syrah) and fuller-bodied Chardonnay." },
  { id: 137, question: "What distinguishes Saint-Émilion from the Médoc?", options: ["It uses only white grapes", "It features Merlot-dominant blends on limestone and clay", "It has a maritime climate", "It is classified by vine age"], correct: 1, explanation: "Saint-Émilion on Bordeaux's Right Bank has limestone plateau and clay slopes favoring Merlot over Cabernet. Wines are typically softer and earlier-maturing than Left Bank styles." },
  { id: 138, question: "Which Austrian region is famous for sweet wines from Neusiedlersee?", options: ["Wachau", "Burgenland", "Kremstal", "Kamptal"], correct: 1, explanation: "Burgenland's Neusiedlersee provides humid conditions ideal for botrytis development, producing exceptional sweet wines from Welschriesling, Chardonnay, and other varieties." },
  { id: 139, question: "The Swartland is an emerging quality region in:", options: ["Australia", "Chile", "South Africa", "Argentina"], correct: 2, explanation: "South Africa's Swartland has become the country's most exciting wine region, known for old-vine Chenin Blanc, Rhône varieties, and natural winemaking. Hot, dry climate with granitic soils." },
  { id: 140, question: "Hermitage is exclusively planted with:", options: ["Grenache", "Syrah (with small amounts of white grapes permitted)", "Mourvèdre", "Cinsaut"], correct: 1, explanation: "Hermitage in the Northern Rhône is 100% Syrah for reds, though up to 15% white grapes (Marsanne, Roussanne) may be co-fermented. These are France's most powerful Syrahs." },
  { id: 141, question: "What is the Uco Valley known for in Argentina?", options: ["Coastal white wines", "High-altitude Malbec", "Sparkling wine production", "Port-style wines"], correct: 1, explanation: "The Uco Valley at 900-1,500m elevation produces Argentina's most refined Malbecs, with greater freshness and elegance than lower Mendoza sites. Also excellent for Chardonnay and Pinot Noir." },
  { id: 142, question: "Stellenbosch in South Africa is primarily known for:", options: ["Pinotage and Chenin Blanc only", "Bordeaux-style reds and quality across varieties", "Sparkling wine exclusively", "Sweet Muscats"], correct: 1, explanation: "Stellenbosch is South Africa's most famous wine region, excelling with Cabernet Sauvignon, Bordeaux blends, and increasingly Syrah. Varied terroirs allow diverse quality production." },
  { id: 143, question: "What characterizes wines from Finger Lakes, New York?", options: ["Full-bodied reds from warm climate", "Cool-climate Riesling and aromatic whites", "Exclusively sparkling wines", "Fortified wine production"], correct: 1, explanation: "New York's Finger Lakes is a cool-climate region producing excellent Riesling (dry to sweet), Gewürztraminer, and sparkling wines. Deep lakes moderate temperatures." },
  { id: 144, question: "Ribera del Duero wines are made primarily from:", options: ["Garnacha", "Tempranillo (locally called Tinto Fino)", "Mencía", "Monastrell"], correct: 1, explanation: "Ribera del Duero is known for powerful Tempranillo (called Tinto Fino or Tinta del País locally), producing structured, age-worthy reds. Extreme continental climate creates intensity." },
  { id: 145, question: "The Margaret River is Australia's premier region for:", options: ["Shiraz", "Riesling", "Cabernet Sauvignon and Chardonnay", "Fortified wines"], correct: 2, explanation: "Margaret River's Mediterranean climate produces elegant Cabernet Sauvignon (often Bordeaux-style blends) and refined Chardonnay. It's one of Australia's most prestigious regions." },
  { id: 146, question: "What is special about Wachau's classification system?", options: ["It mirrors Burgundy exactly", "Steinfeder, Federspiel, and Smaragd indicate body/ripeness levels", "It classifies by color only", "There is no classification"], correct: 1, explanation: "Wachau uses three categories: Steinfeder (light, max 11.5%), Federspiel (medium, 11.5-12.5%), and Smaragd (full, 12.5%+). Named after lizards found in vineyards." },
  { id: 147, question: "Colchagua Valley in Chile is famous for:", options: ["Cool-climate Sauvignon Blanc", "Carménère and Cabernet Sauvignon", "Pinot Noir", "Sparkling wines"], correct: 1, explanation: "Colchagua is one of Chile's warmest valleys, producing bold Carménère, ripe Cabernet Sauvignon, and Syrah. Part of the larger Rapel Valley region." },
  { id: 148, question: "Central Otago, New Zealand is the world's most:", options: ["Northerly wine region", "Southerly wine region", "Largest wine region", "Oldest wine region"], correct: 1, explanation: "Central Otago at 45°S latitude is the world's southernmost major wine region. Its continental climate produces distinctive Pinot Noir with intense color and fruit." },
  { id: 149, question: "Which Portuguese region is known for age-worthy red wines from Baga grape?", options: ["Douro", "Bairrada", "Alentejo", "Vinho Verde"], correct: 1, explanation: "Bairrada produces tannic, age-worthy reds from Baga grape, traditionally paired with local suckling pig. Modern producers are taming the tannins while preserving structure." },
  { id: 150, question: "The Côtes du Rhône appellation covers:", options: ["Only the Northern Rhône", "Only the Southern Rhône", "Both Northern and Southern Rhône", "The Loire Valley"], correct: 2, explanation: "Côtes du Rhône is a broad appellation covering both Northern and Southern Rhône, though most production comes from the south. It's predominantly Grenache-based blends." },
  { id: 151, question: "What is the difference between NV and Vintage Champagne?", options: ["There is no difference", "NV blends multiple years; Vintage is from a single declared year", "Vintage uses different grapes", "NV is always sweeter"], correct: 1, explanation: "Non-Vintage (NV) Champagne blends wines from multiple years for house consistency. Vintage Champagne comes from a single declared year (only made in exceptional vintages) and ages longer." },
  { id: 152, question: "Crémant wines are:", options: ["Sweet dessert wines", "Traditional method sparkling wines from regions outside Champagne", "Still rosé wines", "Fortified wines"], correct: 1, explanation: "Crémant designates traditional method sparkling wines from French regions outside Champagne (Crémant d'Alsace, de Loire, de Bourgogne, etc.). Made with local grape varieties." },
  { id: 153, question: "What does 'Brut Nature' mean on a Champagne label?", options: ["Made from organically grown grapes", "Zero dosage added", "Extra-aged Champagne", "Made only from Pinot Noir"], correct: 1, explanation: "Brut Nature (also called Zero Dosage or Non-Dosé) means no sugar was added after disgorgement. These are the driest Champagnes, showing pure, unadorned character." },
  { id: 154, question: "Franciacorta sparkling wines are made in:", options: ["France", "Italy (Lombardy)", "Spain", "Germany"], correct: 1, explanation: "Franciacorta in Lombardy is Italy's premier traditional method sparkling wine region. Using Chardonnay, Pinot Noir, and Pinot Bianco, it rivals Champagne in quality." },
  { id: 155, question: "What style of sparkling wine is Moscato d'Asti?", options: ["Bone dry and high pressure", "Lightly sweet, lightly sparkling (frizzante), and low alcohol", "Fully sparkling and very sweet", "Dry and high alcohol"], correct: 1, explanation: "Moscato d'Asti is gently sparkling (frizzante), lightly sweet, and low in alcohol (5-6%). Made from Muscat, it's aromatic with peach and floral notes. Perfect as a dessert wine or aperitif." },
  { id: 156, question: "What is the term for the sediment removed from Champagne?", options: ["Dosage", "Lees", "Must", "Flor"], correct: 1, explanation: "Lees are the dead yeast cells that settle after second fermentation. Extended lees aging adds complexity (brioche, toast notes). Riddling collects lees in the neck for removal (disgorgement)." },
  { id: 157, question: "Sekt is a sparkling wine from:", options: ["Italy", "Spain", "Germany and Austria", "Portugal"], correct: 2, explanation: "Sekt is German and Austrian sparkling wine, ranging from tank-method to traditional-method production. Quality Sekt (Winzersekt) from estate-grown Riesling or Pinot can be excellent." },
  { id: 158, question: "What distinguishes 'Grower Champagne' from 'Négociant Champagne'?", options: ["Different grapes are used", "Grower Champagne is made by the grape grower themselves", "Négociant is always better quality", "Grower Champagne can't age"], correct: 1, explanation: "Grower Champagne (RM on label) is made by the grape grower. Négociant (NM) houses buy grapes to blend. Growers often showcase individual vineyard character; négociants blend for house style." },
  { id: 159, question: "English sparkling wine is typically made from:", options: ["Riesling and Gewürztraminer", "Chardonnay, Pinot Noir, and Pinot Meunier", "Albariño and Verdejo", "Muscadet"], correct: 1, explanation: "English sparkling wine uses the same grapes as Champagne (Chardonnay, Pinot Noir, Pinot Meunier) and the traditional method. Climate change and chalk soils similar to Champagne have driven quality." },
  { id: 160, question: "What does 'Blanc de Noirs' mean?", options: ["White wine from white grapes", "White wine from black (red) grapes", "Red wine from black grapes", "Rosé wine"], correct: 1, explanation: "Blanc de Noirs means 'white from blacks'—white wine made from red grapes (Pinot Noir and/or Pinot Meunier in Champagne). Gentle pressing prevents color extraction." },
  { id: 161, question: "What distinguishes Manzanilla from Fino Sherry?", options: ["Different grape variety", "Manzanilla is aged in Sanlúcar de Barrameda, giving a saltier character", "Manzanilla is always sweeter", "There is no real difference"], correct: 1, explanation: "Manzanilla is Fino aged in Sanlúcar de Barrameda, where coastal humidity creates thicker flor and gives a distinctive salty, chamomile character. Legally its own DO." },
  { id: 162, question: "Amontillado Sherry begins as:", options: ["Oloroso", "Fino, then continues aging oxidatively", "Pedro Ximénez", "Cream Sherry"], correct: 1, explanation: "Amontillado starts as Fino under flor, then the flor dies (naturally or deliberately) and it ages oxidatively. This creates a unique profile combining both styles—nutty, complex." },
  { id: 163, question: "What grape is used for most Sherry production?", options: ["Pedro Ximénez", "Tempranillo", "Palomino", "Moscatel"], correct: 2, explanation: "Palomino is used for all dry Sherries (Fino, Manzanilla, Amontillado, Oloroso, Palo Cortado). PX and Moscatel are used for sweet styles." },
  { id: 164, question: "A 20-Year-Old Tawny Port indicates:", options: ["The wine is exactly 20 years old", "An average age of components in the blend is around 20 years", "It was bottled 20 years ago", "The solera is 20 years old"], correct: 1, explanation: "Age-dated Tawnies (10, 20, 30, 40 years) indicate the average age of wines in the blend, approved by tasting panels. They're blends of various vintages for consistent style." },
  { id: 165, question: "What is Colheita Port?", options: ["Ruby Port aged briefly", "Tawny from a single vintage, aged minimum 7 years in cask", "White Port", "Pink Port"], correct: 1, explanation: "Colheita is single-vintage Tawny Port, aged minimum 7 years in cask (often much longer). The label shows harvest year and bottling date. Unlike Vintage Port, it's ready to drink." },
  { id: 166, question: "Bual (Boal) Madeira is:", options: ["The driest style", "Medium-sweet", "Very sweet", "Sparkling"], correct: 1, explanation: "Bual is medium-sweet Madeira, richer than Verdelho but less sweet than Malmsey. It shows caramel, dried fruit, and coffee notes with Madeira's signature acidity." },
  { id: 167, question: "Which Madeira style is the driest?", options: ["Malmsey", "Bual", "Verdelho", "Sercial"], correct: 3, explanation: "Sercial is the driest Madeira style, with high acidity and almond, citrus, and mineral notes. It works as an aperitif. Malmsey is the sweetest." },
  { id: 168, question: "What gives Madeira its remarkable longevity?", options: ["High residual sugar only", "The heating process (estufagem) and high acidity", "No oak aging", "Cold stabilization"], correct: 1, explanation: "Madeira's longevity comes from the estufagem (heating) process, which stabilizes the wine, combined with naturally high acidity. Opened bottles last months; aged examples can last centuries." },
  { id: 169, question: "Rutherglen Muscat is:", options: ["A dry white wine", "A sweet, fortified wine aged in a solera-like system", "A sparkling wine", "An unfortified dessert wine"], correct: 1, explanation: "Rutherglen Muscat is a sweet, fortified wine from Victoria, Australia. Made from Muscat à Petits Grains Rouges, it's aged oxidatively in a solera-like system, developing intense raisined, toffee character." },
  { id: 170, question: "Vin Doux Naturel (VDN) is:", options: ["A naturally sweet wine with no fortification", "A fortified wine where spirit is added during fermentation", "A dry wine", "A sparkling wine"], correct: 1, explanation: "Vin Doux Naturel ('naturally sweet wine') is actually fortified—grape spirit is added during fermentation to stop it early, retaining natural grape sugar. Examples include Muscat de Beaumes-de-Venise and Banyuls." },
  { id: 171, question: "Palo Cortado Sherry is:", options: ["Always sweet", "A rare style combining Amontillado's aromatics with Oloroso's body", "Made under flor throughout aging", "Pink in color"], correct: 1, explanation: "Palo Cortado is a rare, mysterious Sherry that develops Amontillado's delicate, nutty nose but Oloroso's full body. It occurs unpredictably when flor dies unexpectedly on certain wines." },
  { id: 172, question: "What is a Solera system?", options: ["A type of vine training", "A fractional blending system for consistent aged wine", "A fermentation vessel", "A grape variety"], correct: 1, explanation: "The Solera is a fractional blending system where young wine is added to older barrels in stages, so bottled wine contains elements from the system's inception. Used for Sherry, some Ports, and more." },
  { id: 173, question: "Marsala comes from:", options: ["Spain", "Portugal", "Sicily, Italy", "France"], correct: 2, explanation: "Marsala is a fortified wine from western Sicily, made in dry to sweet styles. It's classified by color (oro, ambra, rubino), sweetness (secco to dolce), and age (Fine to Vergine)." },
  { id: 174, question: "Crusted Port is:", options: ["A blend of vintages bottled unfiltered, throwing sediment", "Single vintage Port", "Aged only in cask", "White Port"], correct: 0, explanation: "Crusted Port is a blend of several vintages bottled young without filtration. It throws a 'crust' (sediment) in bottle and develops like Vintage Port but at lower cost. Must age 3+ years in bottle." },
  { id: 175, question: "What does 'Vendange Tardive' mean in Alsace?", options: ["Early harvest", "Late harvest, resulting in richer, often sweeter wines", "Old vines", "Organic production"], correct: 1, explanation: "Vendange Tardive ('late harvest') in Alsace produces richer wines from grapes picked late with higher sugar. May be dry to sweet. Higher level Sélection de Grains Nobles requires noble rot." },
  { id: 176, question: "What is 'battonage' commonly used for?", options: ["Adding sweetness to wine", "Stirring lees to add texture to white wines", "Fining red wines", "Carbonating sparkling wines"], correct: 1, explanation: "Bâtonnage (lees stirring) involves stirring settled dead yeast cells back into white wine, adding creamy texture, complexity, and protection from oxidation. Classic for white Burgundy." },
  { id: 177, question: "What is the difference between fining and filtration?", options: ["There is no difference", "Fining uses agents that bind to particles; filtration physically strains wine", "Filtration is only for red wines", "Fining increases alcohol"], correct: 1, explanation: "Fining uses agents (bentonite, egg whites, etc.) that attract and bind to unwanted particles, which then settle out. Filtration physically strains wine through membranes to remove particles." },
  { id: 178, question: "Micro-oxygenation is used to:", options: ["Add carbonation", "Soften tannins and develop wine similarly to barrel aging", "Increase acidity", "Remove alcohol"], correct: 1, explanation: "Micro-oxygenation (micro-ox) introduces tiny amounts of oxygen to wine in tank, softening tannins and developing complexity similar to barrel aging but faster. Used for wines not aged in barrel." },
  { id: 179, question: "What is the purpose of 'pigeage'?", options: ["Adding sugar to must", "Punching down the cap of grape skins during red wine fermentation", "Filtering wine", "Adding oak chips"], correct: 1, explanation: "Pigeage (punch-down) breaks up the cap of grape skins that floats on fermenting red wine, increasing extraction of color, tannin, and flavor. Alternative to remontage (pump-over)." },
  { id: 180, question: "Cold soaking (macération à froid) is used to:", options: ["Stop fermentation", "Extract color and fruit flavors before fermentation", "Reduce alcohol", "Increase tannin only"], correct: 1, explanation: "Cold soaking holds crushed red grapes at cold temperature before fermentation begins, extracting color and fresh fruit flavors without excessive tannin. Popular for Pinot Noir." },
  { id: 181, question: "What does 'saignée' mean in rosé production?", options: ["Adding red wine to white", "Bleeding off juice early from a red wine fermentation", "Blending finished wines", "Short maceration only"], correct: 1, explanation: "Saignée ('bleeding') draws off pink juice early from a red wine fermentation. This concentrates the remaining red wine while producing rosé as a byproduct. An alternative to direct pressing." },
  { id: 182, question: "Skin contact (maceration) for white wines:", options: ["Is never done", "Can add texture, color, and phenolic complexity (as in orange wines)", "Always creates defects", "Reduces aromatics"], correct: 1, explanation: "Extended skin contact for whites creates 'orange wines' with amber color, tannic grip, and complex flavors. Traditional in Georgia (qvevri wines) and increasingly popular globally." },
  { id: 183, question: "What is the purpose of chaptalisation?", options: ["Adding acid", "Adding sugar to increase potential alcohol", "Adding tannin", "Reducing alcohol"], correct: 1, explanation: "Chaptalization adds sugar to must before/during fermentation to increase alcohol in cool vintages. Banned in warm regions (unnecessary) and some quality designations. Named after Jean-Antoine Chaptal." },
  { id: 184, question: "Inert gas is used in winemaking to:", options: ["Add bubbles", "Protect wine from oxygen exposure", "Increase fermentation speed", "Add flavor"], correct: 1, explanation: "Inert gases (nitrogen, argon, CO2) blanket wine to prevent oxidation during transfers, storage, and bottling. Essential for preserving fresh, reductive winemaking styles." },
  { id: 185, question: "What is 'assemblage' in winemaking?", options: ["Grape crushing", "Blending different wines to create the final cuvée", "Fermentation", "Bottling"], correct: 1, explanation: "Assemblage is the art of blending—combining different lots (varieties, vineyards, barrels, vintages) to create a finished wine. Critical in Champagne, Bordeaux, and non-vintage wines." },
  { id: 186, question: "What does VDP in Germany signify?", options: ["A government quality level", "A private association of top estates with strict standards", "A grape variety", "A region"], correct: 1, explanation: "VDP (Verband Deutscher Prädikatsweingüter) is an association of top German estates with their own classification system (Gutswein to Grosses Gewächs), often stricter than legal requirements." },
  { id: 187, question: "What does 'Classico' mean on an Italian wine label?", options: ["Classic winemaking techniques", "Wine from the original/historic heart of the region", "Aged in wood", "Entry-level wine"], correct: 1, explanation: "Classico indicates wine from the historic core zone of a region—usually the best terroir. Examples: Chianti Classico, Soave Classico, Valpolicella Classico." },
  { id: 188, question: "What is a 'Cru Bourgeois'?", options: ["A Burgundy classification", "A Médoc classification below the 1855 Grands Crus", "A Champagne vineyard", "An Italian designation"], correct: 1, explanation: "Cru Bourgeois is a Médoc classification for quality estates not included in the 1855 Classification. Updated regularly, with levels Cru Bourgeois, Supérieur, and Exceptionnel." },
  { id: 189, question: "What does 'Superiore' mean on Italian wine labels?", options: ["Organic wine", "Higher alcohol and/or longer aging than basic version", "Sparkling wine", "From a specific vineyard"], correct: 1, explanation: "Superiore typically indicates wine with slightly higher minimum alcohol and/or longer aging requirements than the basic DOC/DOCG. Examples: Valpolicella Superiore, Barbera d'Asti Superiore." },
  { id: 190, question: "AVA (American Viticultural Area) guarantees:", options: ["Wine quality", "Specific winemaking practices", "Geographic origin only", "Grape varieties used"], correct: 2, explanation: "AVAs define grape-growing regions based on geography, climate, and soil—not grape variety or winemaking. They only guarantee origin, unlike European appellations which regulate more." },
  { id: 191, question: "What temperature should light-bodied white wines be served?", options: ["18-20°C", "14-16°C", "7-10°C", "0-4°C"], correct: 2, explanation: "Light, aromatic whites are best at 7-10°C. Warmer temperatures make them seem flabby; too cold mutes aromatics. Fuller whites can be served slightly warmer (10-13°C)." },
  { id: 192, question: "Why should very old wines be stood upright before serving?", options: ["To warm them up", "To allow sediment to settle to the bottom for easier decanting", "To increase oxidation", "There is no reason"], correct: 1, explanation: "Standing old bottles upright for 24-48 hours lets sediment settle to the bottom, making decanting easier and cleaner. The wine can then be poured off the sediment carefully." },
  { id: 193, question: "Which wines generally benefit LEAST from decanting?", options: ["Young, tannic reds", "Old wines with sediment", "Light, delicate aged white wines", "Full-bodied, oaky reds"], correct: 2, explanation: "Delicate aged whites can deteriorate quickly with oxygen exposure. They're best served directly from bottle. Young, tannic reds and old reds (for sediment) benefit most from decanting." },
  { id: 194, question: "Umami-rich foods pair best with wines that have:", options: ["High tannin", "Low tannin and/or fruity sweetness", "High acidity only", "No oak influence"], correct: 1, explanation: "Umami (found in aged cheese, mushrooms, soy sauce) can make tannic wines taste bitter. Better matches are fruity, low-tannin wines, or those with slight sweetness." },
  { id: 195, question: "What is 'bridging' in food and wine pairing?", options: ["Using a sauce to connect wine and protein", "Using an ingredient that links flavors in both food and wine", "Serving wine in a bridge glass", "A specific pouring technique"], correct: 1, explanation: "Bridging uses shared flavor elements (herbs, mushrooms, fruit reductions) to connect wine and food. Example: mushroom sauce bridges Pinot Noir's earthy notes with beef." },
  { id: 196, question: "Spicy foods typically pair best with:", options: ["High-alcohol, tannic reds", "Off-dry whites or fruity, low-alcohol wines", "Bone-dry, high-acid whites", "Heavily oaked wines"], correct: 1, explanation: "Spicy heat is amplified by alcohol and tannin. Off-dry wines (Riesling, Gewürztraminer) or fruity, lower-alcohol options contrast and cool the palate." },
  { id: 197, question: "When pairing wine with dessert, the wine should generally be:", options: ["Drier than the dessert", "Sweeter than or as sweet as the dessert", "Any style works equally well", "Red wines only"], correct: 1, explanation: "Dessert wines should match or exceed the dessert's sweetness—otherwise the wine tastes thin and sour. Sauternes with fruit tart, Pedro Ximénez with chocolate." },
  { id: 198, question: "What does 'GG' (Grosses Gewächs) mean in German wine?", options: ["Grand Cru-equivalent dry wine from top VDP sites", "Sweet wine designation", "Sparkling wine classification", "Entry-level wine"], correct: 0, explanation: "Grosses Gewächs (GG) is VDP's top dry wine classification from Grosse Lage (grand cru) vineyards. These are Germany's finest dry wines, mainly Riesling and Pinot Noir." },
  { id: 199, question: "What is a 'Lieu-dit' in French wine?", options: ["A type of vine training", "A named vineyard plot, often with historical significance", "A winemaking technique", "A quality designation"], correct: 1, explanation: "Lieu-dit is a named plot of land with local, often historical, significance—smaller than appellation but not necessarily classified. Many represent distinct terroirs." },
  { id: 200, question: "What does 'Vigneron' mean?", options: ["A grape variety", "A wine merchant", "A grape grower/winemaker", "A sommelier"], correct: 2, explanation: "Vigneron refers to someone who grows grapes and makes wine—combining viticulture and vinification. In France, it implies artisan, estate-based production rather than industrial scale." }
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Main App Component
export default function App() {
  // Game state
  const [screen, setScreen] = useState('home');
  const [gameMode, setGameMode] = useState(null);
  const [category, setCategory] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  
  // Multiplayer state
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState({});
  const [playerName, setPlayerName] = useState('');
  
  // Progress tracking
  const [questionHistory, setQuestionHistory] = useState({});
  
  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wset-quiz-history');
      if (saved) {
        setQuestionHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Could not load progress');
    }
  }, []);
  
  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wset-quiz-history', JSON.stringify(questionHistory));
    } catch (e) {
      console.log('Could not save progress');
    }
  }, [questionHistory]);
  
  // Smart question selection
  const selectQuestions = useCallback((cat, count = 20) => {
    let availableIds = CATEGORIES[cat].ids || QUESTIONS.map(q => q.id);
    let pool = QUESTIONS.filter(q => availableIds.includes(q.id));
    
    // Prioritize: never seen > answered wrong > answered correct
    const neverSeen = pool.filter(q => !questionHistory[q.id]);
    const answeredWrong = pool.filter(q => questionHistory[q.id] === 'wrong');
    const answeredCorrect = pool.filter(q => questionHistory[q.id] === 'correct');
    
    let selected = [];
    
    // First, add never-seen questions
    const shuffledNeverSeen = shuffleArray(neverSeen);
    selected.push(...shuffledNeverSeen.slice(0, count));
    
    // If need more, add previously wrong answers
    if (selected.length < count) {
      const shuffledWrong = shuffleArray(answeredWrong);
      selected.push(...shuffledWrong.slice(0, count - selected.length));
    }
    
    // If still need more, add previously correct
    if (selected.length < count) {
      const shuffledCorrect = shuffleArray(answeredCorrect);
      selected.push(...shuffledCorrect.slice(0, count - selected.length));
    }
    
    return shuffleArray(selected);
  }, [questionHistory]);
  
  // Start solo game
  const startSoloGame = (cat) => {
    setCategory(cat);
    setGameMode('solo');
    const selected = selectQuestions(cat);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    setScreen('quiz');
  };
  
  // Start multiplayer game
  const startMultiplayerGame = (cat) => {
    if (players.length < 2) return;
    setCategory(cat);
    setGameMode('multiplayer');
    const selected = selectQuestions(cat, 10 * players.length);
    setQuestions(selected);
    setCurrentIndex(0);
    setCurrentPlayerIndex(0);
    const initialScores = {};
    players.forEach(p => initialScores[p] = 0);
    setPlayerScores(initialScores);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    setScreen('quiz');
  };
  
  // Add player
  const addPlayer = () => {
    if (playerName.trim() && players.length < 6 && !players.includes(playerName.trim())) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName('');
    }
  };
  
  // Remove player
  const removePlayer = (name) => {
    setPlayers(players.filter(p => p !== name));
  };
  
  // Handle answer selection
  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const currentQuestion = questions[currentIndex];
    const isCorrect = index === currentQuestion.correct;
    
    // Update history
    setQuestionHistory(prev => ({
      ...prev,
      [currentQuestion.id]: isCorrect ? 'correct' : 'wrong'
    }));
    
    // Update score
    if (gameMode === 'solo') {
      if (isCorrect) setScore(s => s + 1);
    } else {
      if (isCorrect) {
        setPlayerScores(prev => ({
          ...prev,
          [players[currentPlayerIndex]]: prev[players[currentPlayerIndex]] + 1
        }));
      }
    }
    
    setAnsweredQuestions([...answeredQuestions, { ...currentQuestion, userAnswer: index, correct: isCorrect }]);
    setShowExplanation(true);
  };
  
  // Next question
  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setScreen('results');
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      if (gameMode === 'multiplayer') {
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      }
    }
  };
  
  // Calculate stats
  const getStats = () => {
    const total = QUESTIONS.length;
    const seen = Object.keys(questionHistory).length;
    const correct = Object.values(questionHistory).filter(v => v === 'correct').length;
    return { total, seen, correct, percentage: seen > 0 ? Math.round((correct / seen) * 100) : 0 };
  };
  
  // Home Screen
  const HomeScreen = () => {
    const stats = getStats();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto">
          <Logo />
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wine className="w-12 h-12 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">WSET Level 2</h1>
            </div>
            <p className="text-purple-200">Master the Wine & Spirits Education Trust Curriculum</p>
          </div>
          
          {/* Progress Stats */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{stats.seen}</div>
                <div className="text-sm text-purple-300">Questions Seen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.correct}</div>
                <div className="text-sm text-purple-300">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{stats.percentage}%</div>
                <div className="text-sm text-purple-300">Accuracy</div>
              </div>
            </div>
          </div>
          
          {/* Game Mode Selection */}
          <div className="space-y-4">
            <button
              onClick={() => setScreen('solo-category')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all shadow-lg"
            >
              <Play className="w-6 h-6" />
              Solo Practice
            </button>
            
            <button
              onClick={() => setScreen('multiplayer-setup')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all shadow-lg"
            >
              <Users className="w-6 h-6" />
              Multiplayer Challenge
            </button>
            
            <button
              onClick={() => setScreen('study')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all shadow-lg"
            >
              <BookOpen className="w-6 h-6" />
              Study Mode
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Category Selection Screen
  const CategoryScreen = ({ onSelect, mode }) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Logo />
        
        <button
          onClick={() => setScreen(mode === 'multiplayer' ? 'multiplayer-setup' : 'home')}
          className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Select a Topic</h2>
        
        <div className="grid gap-3">
          {Object.entries(CATEGORIES).map(([key, { name, ids }]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white p-4 rounded-xl text-left transition-all flex justify-between items-center"
            >
              <span className="font-medium">{name}</span>
              <span className="text-purple-300 text-sm">
                {ids ? ids.length : QUESTIONS.length} questions
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Multiplayer Setup Screen
  const MultiplayerSetupScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Logo />
        
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Multiplayer Setup</h2>
        
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Enter player name"
              className="flex-1 bg-white/20 text-white placeholder-purple-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              maxLength={15}
            />
            <button
              onClick={addPlayer}
              disabled={!playerName.trim() || players.length >= 6}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {players.map((name, i) => (
              <div key={name} className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2">
                <span className="text-white">{i + 1}. {name}</span>
                <button
                  onClick={() => removePlayer(name)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {players.length === 0 && (
              <p className="text-purple-300 text-center py-4">Add at least 2 players to start</p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setScreen('multiplayer-category')}
          disabled={players.length < 2}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 text-white p-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
        >
          {players.length < 2 ? `Need ${2 - players.length} more player(s)` : 'Choose Category'}
        </button>
      </div>
    </div>
  );
  
  // Quiz Screen
  const QuizScreen = () => {
    const current = questions[currentIndex];
    if (!current) return null;
    
    const progress = ((currentIndex + 1) / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto">
          <Logo />
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setScreen('home')}
              className="text-purple-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-white font-medium">
              {currentIndex + 1} / {questions.length}
            </div>
            {gameMode === 'solo' ? (
              <div className="text-green-400 font-bold">{score} pts</div>
            ) : (
              <div className="text-yellow-400 font-bold">{players[currentPlayerIndex]}'s turn</div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Multiplayer scores */}
          {gameMode === 'multiplayer' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {players.map((p, i) => (
                <div
                  key={p}
                  className={`px-3 py-1 rounded-full text-sm ${
                    i === currentPlayerIndex
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {p}: {playerScores[p]}
                </div>
              ))}
            </div>
          )}
          
          {/* Question */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
            <h2 className="text-xl text-white font-medium leading-relaxed">{current.question}</h2>
          </div>
          
          {/* Options */}
          <div className="space-y-3 mb-6">
            {current.options.map((option, i) => {
              let bgClass = 'bg-white/10 hover:bg-white/20';
              let borderClass = 'border-2 border-transparent';
              
              if (selectedAnswer !== null) {
                if (i === current.correct) {
                  bgClass = 'bg-green-500/30';
                  borderClass = 'border-2 border-green-400';
                } else if (i === selectedAnswer && i !== current.correct) {
                  bgClass = 'bg-red-500/30';
                  borderClass = 'border-2 border-red-400';
                }
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full ${bgClass} ${borderClass} backdrop-blur text-white p-4 rounded-xl text-left transition-all flex items-center gap-3`}
                >
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                  {selectedAnswer !== null && i === current.correct && (
                    <CheckCircle className="w-6 h-6 text-green-400 ml-auto" />
                  )}
                  {selectedAnswer === i && i !== current.correct && (
                    <XCircle className="w-6 h-6 text-red-400 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Explanation */}
          {showExplanation && (
            <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-4 mb-6">
              <p className="text-blue-100">{current.explanation}</p>
            </div>
          )}
          
          {/* Next button */}
          {selectedAnswer !== null && (
            <button
              onClick={nextQuestion}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
            >
              {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Results Screen
  const ResultsScreen = () => {
    const percentage = Math.round((score / questions.length) * 100);
    
    const getGrade = () => {
      if (percentage >= 90) return { icon: Trophy, color: 'text-yellow-400', text: 'Outstanding!' };
      if (percentage >= 75) return { icon: Award, color: 'text-purple-400', text: 'Excellent!' };
      if (percentage >= 60) return { icon: Medal, color: 'text-blue-400', text: 'Good Job!' };
      return { icon: Wine, color: 'text-pink-400', text: 'Keep Practicing!' };
    };
    
    const grade = getGrade();
    const GradeIcon = grade.icon;
    
    // Multiplayer winner
    const getWinner = () => {
      if (gameMode !== 'multiplayer') return null;
      const maxScore = Math.max(...Object.values(playerScores));
      const winners = Object.entries(playerScores).filter(([_, s]) => s === maxScore);
      return winners;
    };
    
    const winners = getWinner();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto text-center">
          <Logo />
          
          <div className="mb-8">
            <GradeIcon className={`w-24 h-24 mx-auto mb-4 ${grade.color}`} />
            <h1 className="text-3xl font-bold text-white mb-2">{grade.text}</h1>
            
            {gameMode === 'solo' ? (
              <p className="text-xl text-purple-200">
                You scored {score} out of {questions.length} ({percentage}%)
              </p>
            ) : (
              <div>
                <p className="text-xl text-purple-200 mb-4">
                  {winners.length === 1 
                    ? `${winners[0][0]} wins with ${winners[0][1]} points!`
                    : `It's a tie between ${winners.map(w => w[0]).join(' and ')}!`
                  }
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {Object.entries(playerScores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, pts], i) => (
                      <div key={name} className="bg-white/10 rounded-lg px-4 py-2">
                        <span className={i === 0 ? 'text-yellow-400' : 'text-white'}>
                          {i + 1}. {name}: {pts}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
          
          {/* Review Section */}
          {gameMode === 'solo' && answeredQuestions.some(q => !q.correct) && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-4">Questions to Review:</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {answeredQuestions.filter(q => !q.correct).map((q, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-3">
                    <p className="text-white text-sm mb-2">{q.question}</p>
                    <p className="text-green-400 text-sm">✓ {q.options[q.correct]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => {
                if (gameMode === 'solo') {
                  startSoloGame(category);
                } else {
                  startMultiplayerGame(category);
                }
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-all shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
            
            <button
              onClick={() => setScreen('home')}
              className="w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl font-semibold transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Study Mode Screen
  const StudyScreen = () => {
    const [studyCategory, setStudyCategory] = useState('all');
    const [studyIndex, setStudyIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    
    const studyQuestions = CATEGORIES[studyCategory].ids 
      ? QUESTIONS.filter(q => CATEGORIES[studyCategory].ids.includes(q.id))
      : QUESTIONS;
    
    const current = studyQuestions[studyIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto">
          <Logo />
          
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Study Mode</h2>
            <select
              value={studyCategory}
              onChange={(e) => {
                setStudyCategory(e.target.value);
                setStudyIndex(0);
                setShowAnswer(false);
              }}
              className="bg-white/20 text-white rounded-lg px-3 py-2 outline-none"
            >
              {Object.entries(CATEGORIES).map(([key, { name }]) => (
                <option key={key} value={key} className="bg-purple-900">{name}</option>
              ))}
            </select>
          </div>
          
          <div className="text-purple-300 mb-4">
            Question {studyIndex + 1} of {studyQuestions.length}
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
            <h3 className="text-lg text-white font-medium mb-6">{current.question}</h3>
            
            <div className="space-y-3">
              {current.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg ${
                    showAnswer && i === current.correct
                      ? 'bg-green-500/30 border-2 border-green-400'
                      : 'bg-white/10'
                  } text-white flex items-center gap-3`}
                >
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </div>
              ))}
            </div>
            
            {showAnswer && (
              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                <p className="text-blue-100">{current.explanation}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStudyIndex((studyIndex - 1 + studyQuestions.length) % studyQuestions.length);
                setShowAnswer(false);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl font-medium transition-all"
            >
              Previous
            </button>
            
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-3 rounded-xl font-medium transition-all"
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            
            <button
              onClick={() => {
                setStudyIndex((studyIndex + 1) % studyQuestions.length);
                setShowAnswer(false);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl font-medium transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render appropriate screen
  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'solo-category':
      return <CategoryScreen onSelect={startSoloGame} mode="solo" />;
    case 'multiplayer-setup':
      return <MultiplayerSetupScreen />;
    case 'multiplayer-category':
      return <CategoryScreen onSelect={startMultiplayerGame} mode="multiplayer" />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'study':
      return <StudyScreen />;
    default:
      return <HomeScreen />;
  }
}
