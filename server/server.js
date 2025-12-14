import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


const history = {
  sentences: {},
  articles: {},
  words: {},
  grammar: {},
  preteriteForms: [] 
};

const COOLDOWN_TIME = 14 * 60 * 60 * 1000;

const perfektVerbs = [
  { id: 1, infinitiv: "essen", partizip: "gegessen" },
  { id: 2, infinitiv: "gehen", partizip: "gegangen" },
  { id: 3, infinitiv: "kommen", partizip: "gekommen" },
  { id: 4, infinitiv: "trinken", partizip: "getrunken" },
  { id: 5, infinitiv: "sehen", partizip: "gesehen" },
  { id: 6, infinitiv: "schreiben", partizip: "geschrieben" },
  { id: 7, infinitiv: "lesen", partizip: "gelesen" },
  { id: 8, infinitiv: "schlafen", partizip: "geschlafen" },
  { id: 9, infinitiv: "sprechen", partizip: "gesprochen" },
  { id: 10, infinitiv: "finden", partizip: "gefunden" },
  { id: 11, infinitiv: "geben", partizip: "gegeben" },
  { id: 12, infinitiv: "nehmen", partizip: "genommen" },
  { id: 13, infinitiv: "helfen", partizip: "geholfen" },
  { id: 14, infinitiv: "bleiben", partizip: "geblieben" },
  { id: 15, infinitiv: "laufen", partizip: "gelaufen" },
  { id: 16, infinitiv: "kommen", partizip: "gekommen" },
  { id: 17, infinitiv: "fahren", partizip: "gefahren" },
  { id: 18, infinitiv: "denken", partizip: "gedacht" },
  { id: 19, infinitiv: "bringen", partizip: "gebracht" },
  { id: 20, infinitiv: "machen", partizip: "gemacht" },

];


const words = [
  { id: 1, sv: "pojke", de: "der Junge" },
  { id: 2, sv: "man", de: "der Mann" },
  { id: 3, sv: "pappa", de: "der Vater" },
  { id: 4, sv: "farfar/morfar", de: "der Großvater" },
  { id: 5, sv: "stol", de: "der Stuhl" },
  { id: 6, sv: "bord", de: "der Tisch" },
  { id: 7, sv: "penna", de: "der Stift" },
  { id: 8, sv: "sked", de: "der Löffel" },
  { id: 9, sv: "gaffel", de: "die Gabel" },
  { id: 10, sv: "mamma", de: "die Mutter" },
  { id: 11, sv: "flicka", de: "das Mädchen" },
  { id: 12, sv: "kvinna", de: "die Frau" },
  { id: 13, sv: "syster", de: "die Schwester" },
  { id: 14, sv: "mormor/farmor", de: "die Großmutter" },
  { id: 15, sv: "klocka", de: "die Uhr" },
  { id: 16, sv: "fönster", de: "das Fenster" },
  { id: 17, sv: "rum", de: "das Zimmer" },
  { id: 18, sv: "hus", de: "das Haus" },
  { id: 19, sv: "barn", de: "das Kind" },
  { id: 20, sv: "äpple", de: "der Apfel" },
  { id: 21, sv: "bok", de: "das Buch" },
  { id: 22, sv: "skola", de: "die Schule" },
  { id: 23, sv: "bil", de: "das Auto" },
  { id: 24, sv: "väg", de: "die Straße" },
  { id: 25, sv: "stad", de: "die Stadt" },
  { id: 26, sv: "dator", de: "der Computer" },
  { id: 27, sv: "mobil", de: "das Handy" },
  { id: 28, sv: "telefon", de: "das Telefon" },
  { id: 29, sv: "kylskåp", de: "der Kühlschrank" },
  { id: 30, sv: "dörr", de: "die Tür" },
/*  { id: 31, sv: "hund", de: "der Hund" },
  { id: 32, sv: "katt", de: "die Katze" },
  { id: 33, sv: "fågel", de: "der Vogel" },
  { id: 34, sv: "fisk", de: "der Fisch" },
  { id: 35, sv: "häst", de: "das Pferd" },
  { id: 36, sv: "mat", de: "das Essen" },
  { id: 37, sv: "bröd", de: "das Brot" },
  { id: 38, sv: "ost", de: "der Käse" },
  { id: 39, sv: "mjölk", de: "die Milch" },
  { id: 40, sv: "juice", de: "der Saft" },
  { id: 41, sv: "vatten", de: "das Wasser" },
  { id: 42, sv: "glass", de: "das Eis" },
  { id: 43, sv: "kaffe", de: "der Kaffee" },
  { id: 44, sv: "te", de: "der Tee" },
  { id: 45, sv: "socker", de: "der Zucker" },
  { id: 46, sv: "skjorta", de: "das Hemd" },
  { id: 47, sv: "jacka", de: "die Jacke" },
  { id: 48, sv: "sko", de: "der Schuh" },
  { id: 49, sv: "byxa", de: "die Hose" },
  { id: 50, sv: "tröja", de: "der Pullover" },
  { id: 51, sv: "skola", de: "die Schule" },
  { id: 52, sv: "universitet", de: "die Universität" },
  { id: 53, sv: "klassrum", de: "das Klassenzimmer" },
  { id: 54, sv: "läxa", de: "die Hausaufgabe" },
  { id: 55, sv: "bokhylla", de: "das Bücherregal" },
  { id: 56, sv: "tv", de: "der Fernseher" },
  { id: 57, sv: "soffa", de: "das Sofa" },
  { id: 58, sv: "lampa", de: "die Lampe" },
  { id: 59, sv: "matta", de: "der Teppich" },
  { id: 60, sv: "spegel", de: "der Spiegel" },
  { id: 61, sv: "vägg", de: "die Wand" },
  { id: 62, sv: "tak", de: "die Decke" },
  { id: 63, sv: "golv", de: "der Boden" },
  { id: 64, sv: "kök", de: "die Küche" },
  { id: 65, sv: "badrum", de: "das Badezimmer" },
  { id: 66, sv: "säng", de: "das Bett" },
  { id: 67, sv: "kudde", de: "das Kissen" },
  { id: 68, sv: "täcke", de: "die Decke" },
  { id: 69, sv: "gardin", de: "der Vorhang" },
  { id: 70, sv: "toalett", de: "die Toilette" },
  { id: 71, sv: "tvål", de: "die Seife" },
  { id: 72, sv: "schampo", de: "das Shampoo" },
  { id: 73, sv: "handduk", de: "das Handtuch" },
  { id: 74, sv: "dusch", de: "die Dusche" },
  { id: 75, sv: "spis", de: "der Herd" },
  { id: 76, sv: "ugn", de: "der Ofen" },
  { id: 77, sv: "diskmaskin", de: "die Spülmaschine" },
  { id: 78, sv: "kastrull", de: "der Topf" },
  { id: 79, sv: "stekpanna", de: "die Pfanne" },
  { id: 80, sv: "tallrik", de: "der Teller" },
  { id: 81, sv: "glas", de: "das Glas" },
  { id: 82, sv: "kopp", de: "die Tasse" },
  { id: 83, sv: "skål", de: "die Schüssel" },
  { id: 84, sv: "kniv", de: "das Messer" },
  { id: 85, sv: "flaska", de: "die Flasche" },
  { id: 86, sv: "pengar", de: "das Geld" },
  { id: 87, sv: "butik", de: "der Laden" },
  { id: 88, sv: "kund", de: "der Kunde" },
  { id: 89, sv: "prislapp", de: "das Preisschild" },
  { id: 90, sv: "kasse", de: "die Tüte" },
  { id: 91, sv: "hylla", de: "das Regal" },
  { id: 92, sv: "klocka (vägg)", de: "die Uhr" },
  { id: 93, sv: "lektion", de: "die Stunde" },
  { id: 94, sv: "fråga", de: "die Frage" },
  { id: 95, sv: "svar", de: "die Antwort" },
  { id: 96, sv: "vän", de: "der Freund" },
  { id: 97, sv: "väninna", de: "die Freundin" },
  { id: 98, sv: "chef", de: "der Chef" },
  { id: 99, sv: "kollega", de: "der Kollege" },*/

];

const sentences = [



  { id: 1, level: "A1", topic: "hemmet", sv: "Jag äter frukost.", de: "Ich esse Frühstück." },
  { id: 2, level: "A1", topic: "hemmet", sv: "Jag dricker vatten.", de: "Ich trinke Wasser." },
  { id: 3, level: "A1", topic: "familj", sv: "Jag bor med min mamma.", de: "Ich wohne mit meiner Mutter." },
  { id: 4, level: "A1", topic: "familj", sv: "Jag älskar min syster.", de: "Ich liebe meine Schwester." },
  { id: 5, level: "A1", topic: "skola", sv: "Jag går till skolan.", de: "Ich gehe zur Schule." },
  { id: 6, level: "A1", topic: "skola", sv: "Jag läser en bok.", de: "Ich lese ein Buch." },
  { id: 7, level: "A1", topic: "vardag", sv: "Jag köper mjölk.", de: "Ich kaufe Milch." },
  { id: 8, level: "A1", topic: "vardag", sv: "Jag lagar mat.", de: "Ich koche Essen." },
  { id: 9, level: "A1", topic: "väder", sv: "Det regnar idag.", de: "Es regnet heute." },
  { id: 10, level: "A1", topic: "väder", sv: "Det är kallt ute.", de: "Es ist kalt draußen." },
  { id: 11, level: "A1", topic: "hemmet", sv: "Jag städar mitt rum.", de: "Ich putze mein Zimmer." },
  { id: 12, level: "A1", topic: "hobby", sv: "Jag spelar fotboll.", de: "Ich spiele Fußball." },
  { id: 13, level: "A1", topic: "hobby", sv: "Jag lyssnar på musik.", de: "Ich höre Musik." },
  { id: 14, level: "A1", topic: "mat", sv: "Jag äter en banan.", de: "Ich esse eine Banane." },
  { id: 15, level: "A1", topic: "mat", sv: "Jag dricker juice.", de: "Ich trinke Saft." },
  { id: 16, level: "A1", topic: "hemmet", sv: "Jag öppnar fönstret.", de: "Ich öffne das Fenster." },
  { id: 17, level: "A1", topic: "hemmet", sv: "Jag stänger dörren.", de: "Ich schließe die Tür." },
  { id: 18, level: "A1", topic: "vardag", sv: "Jag väntar på bussen.", de: "Ich warte auf den Bus." },
  { id: 19, level: "A1", topic: "vardag", sv: "Jag jobbar idag.", de: "Ich arbeite heute." },
  { id: 20, level: "A1", topic: "vardag", sv: "Jag handlar mat.", de: "Ich kaufe Essen ein." },
  { id: 21, level: "A1", topic: "hemmet", sv: "Jag bäddar sängen.", de: "Ich mache das Bett." },
  { id: 22, level: "A1", topic: "hemmet", sv: "Jag tänder lampan.", de: "Ich mache die Lampe an." },
  { id: 23, level: "A1", topic: "hemmet", sv: "Jag tvättar händerna.", de: "Ich wasche meine Hände." },
  { id: 24, level: "A1", topic: "hemmet", sv: "Jag skär bröd.", de: "Ich schneide Brot." },
  { id: 25, level: "A1", topic: "hemmet", sv: "Jag vattnar blommorna.", de: "Ich gieße die Blumen." },
  { id: 26, level: "A1", topic: "familj", sv: "Min pappa lagar mat.", de: "Mein Vater kocht Essen." },
  { id: 27, level: "A1", topic: "familj", sv: "Min bror spelar spel.", de: "Mein Bruder spelar Spiele." },
  { id: 28, level: "A1", topic: "familj", sv: "Min syster sover.", de: "Meine Schwester schläft." },
  { id: 29, level: "A1", topic: "familj", sv: "Min mamma jobbar.", de: "Meine Mutter arbeitet." },
  { id: 30, level: "A1", topic: "familj", sv: "Min kusin bor här.", de: "Mein Cousin wohnt hier." },
  { id: 31, level: "A1", topic: "skola", sv: "Jag skriver ett prov.", de: "Ich schreibe eine Prüfung." },
  { id: 32, level: "A1", topic: "skola", sv: "Jag använder datorn.", de: "Ich benutze den Computer." },
  { id: 33, level: "A1", topic: "skola", sv: "Jag pratar med läraren.", de: "Ich spreche mit der Lehrerin." },
  { id: 34, level: "A1", topic: "skola", sv: "Jag räcker upp handen.", de: "Ich hebe die Hand." },
  { id: 35, level: "A1", topic: "skola", sv: "Jag sitter i klassrummet.", de: "Ich sitze im Klassenzimmer." },
  { id: 36, level: "A1", topic: "vardag", sv: "Jag köper bröd.", de: "Ich kaufe Brot." },
  { id: 37, level: "A1", topic: "vardag", sv: "Jag väntar i kön.", de: "Ich warte in der Schlange." },
  { id: 38, level: "A1", topic: "vardag", sv: "Jag ringer min vän.", de: "Ich rufe meinen Freund an." },
  { id: 39, level: "A1", topic: "vardag", sv: "Jag tappar nycklarna.", de: "Ich verliere meine Schlüssel." },
  { id: 40, level: "A1", topic: "vardag", sv: "Jag hittar min jacka.", de: "Ich finde meine Jacke." },
  { id: 41, level: "A1", topic: "hobby", sv: "Jag dansar hemma.", de: "Ich tanze zu Hause." },
  { id: 42, level: "A1", topic: "hobby", sv: "Jag målar en bild.", de: "Ich male ein Bild." },
  { id: 43, level: "A1", topic: "hobby", sv: "Jag simmar ibland.", de: "Ich schwimme manchmal." },
  { id: 44, level: "A1", topic: "hobby", sv: "Jag cyklar ute.", de: "Ich fahre draußen Fahrrad." },
  { id: 45, level: "A1", topic: "hobby", sv: "Jag sjunger ofta.", de: "Ich singe oft." },
  { id: 46, level: "A1", topic: "mat", sv: "Jag äter ris.", de: "Ich esse Reis." },
  { id: 47, level: "A1", topic: "mat", sv: "Jag grillar korv.", de: "Ich grille Wurst." },
  { id: 48, level: "A1", topic: "mat", sv: "Jag bakar kakor.", de: "Ich backe Kekse." },
  { id: 49, level: "A1", topic: "mat", sv: "Jag skalar potatis.", de: "Ich schäle Kartoffeln." },
  { id: 50, level: "A1", topic: "mat", sv: "Jag äter godis.", de: "Ich esse Süßigkeiten." },
  { id: 51, level: "A1", topic: "väder", sv: "Det blåser mycket.", de: "Es windet stark." },
  { id: 52, level: "A1", topic: "väder", sv: "Det snöar nu.", de: "Es schneit jetzt." },
  { id: 53, level: "A1", topic: "väder", sv: "Det är varmt idag.", de: "Es ist warm idag." },
  { id: 54, level: "A1", topic: "väder", sv: "Det är soligt.", de: "Es ist sonnig." },
  { id: 55, level: "A1", topic: "väder", sv: "Det är mörkt ute.", de: "Es ist draußen dunkel." },
  { id: 56, level: "A1", topic: "resor", sv: "Jag åker tåg.", de: "Ich fahre mit dem Zug." },
  { id: 57, level: "A1", topic: "resor", sv: "Jag går till stationen.", de: "Ich gehe zum Bahnhof." },
  { id: 58, level: "A1", topic: "resor", sv: "Jag kör bil.", de: "Ich fahre Auto." },
  { id: 59, level: "A1", topic: "resor", sv: "Jag tar en taxi.", de: "Ich nehme ein Taxi." },
  { id: 60, level: "A1", topic: "resor", sv: "Jag flyger hem.", de: "Ich fliege nach Hause." },
  { id: 61, level: "A1", topic: "resor", sv: "Jag går av bussen.", de: "Ich steige aus dem Bus aus." },
  { id: 62, level: "A1", topic: "resor", sv: "Jag går på tåget.", de: "Ich steige in den Zug ein." },
  { id: 63, level: "A1", topic: "resor", sv: "Jag väntar på tåget.", de: "Ich warte auf den Zug." },
  { id: 64, level: "A1", topic: "resor", sv: "Jag reser imorgon.", de: "Ich reise morgen." },
  { id: 65, level: "A1", topic: "resor", sv: "Jag packar väskan.", de: "Ich packe die Tasche." },
  { id: 66, level: "A1", topic: "hemmet", sv: "Jag diskar tallrikar.", de: "Ich spüle Teller." },
  { id: 67, level: "A1", topic: "hemmet", sv: "Jag sopar golvet.", de: "Ich fege den Boden." },
  { id: 68, level: "A1", topic: "hemmet", sv: "Jag släcker lampan.", de: "Ich mache die Lampe aus." },
  { id: 69, level: "A1", topic: "hemmet", sv: "Jag byter sängkläder.", de: "Ich wechsle die Bettwäsche." },
  { id: 70, level: "A1", topic: "hemmet", sv: "Jag tvättar kläder.", de: "Ich wasche Kleidung." },
  { id: 71, level: "A1", topic: "vardag", sv: "Jag köper kaffe.", de: "Ich kaufe Kaffee." },
  { id: 72, level: "A1", topic: "vardag", sv: "Jag tappar mobilen.", de: "Ich verliere mein Handy." },
  { id: 73, level: "A1", topic: "vardag", sv: "Jag hittar plånboken.", de: "Ich finde meine Brieftasche." },
  { id: 74, level: "A1", topic: "vardag", sv: "Jag går hem.", de: "Ich gehe nach Hause." },
  { id: 75, level: "A1", topic: "vardag", sv: "Jag kollar tiden.", de: "Ich schaue auf die Uhr." },
  { id: 76, level: "A1", topic: "familj", sv: "Min mamma lagar soppa.", de: "Meine Mutter kocht Suppe." },
  { id: 77, level: "A1", topic: "familj", sv: "Min pappa kör bilen.", de: "Mein Vater fährt das Auto." },
  { id: 78, level: "A1", topic: "familj", sv: "Min bror sover länge.", de: "Mein Bruder schläft lange." },
  { id: 79, level: "A1", topic: "familj", sv: "Min syster pluggar.", de: "Meine Schwester lernt." },
  { id: 80, level: "A1", topic: "familj", sv: "Min farfar tittar på tv.", de: "Mein Opa sieht fern." },
  { id: 81, level: "A1", topic: "skola", sv: "Jag läser läxan.", de: "Ich mache die Hausaufgabe." },
  { id: 82, level: "A1", topic: "skola", sv: "Jag skriver i boken.", de: "Ich schreibe ins Buch." },
  { id: 83, level: "A1", topic: "skola", sv: "Jag tränar glosor.", de: "Ich übe Vokabeln." },
  { id: 84, level: "A1", topic: "skola", sv: "Jag sitter i matsalen.", de: "Ich sitze in der Mensa." },
  { id: 85, level: "A1", topic: "skola", sv: "Jag pratar med vänner.", de: "Ich spreche mit Freunden." },
  { id: 86, level: "A1", topic: "hobby", sv: "Jag ritar en katt.", de: "Ich zeichne eine Katze." },
  { id: 87, level: "A1", topic: "hobby", sv: "Jag sjunger en låt.", de: "Ich singe ein Lied." },
  { id: 88, level: "A1", topic: "hobby", sv: "Jag springer lite.", de: "Ich laufe ein bisschen." },
  { id: 89, level: "A1", topic: "hobby", sv: "Jag spelar piano.", de: "Ich spiele Klavier." },
  { id: 90, level: "A1", topic: "hobby", sv: "Jag målar med färg.", de: "Ich male med Farbe." },
  { id: 91, level: "A1", topic: "mat", sv: "Jag äter kyckling.", de: "Ich esse Hähnchen." },
  { id: 92, level: "A1", topic: "mat", sv: "Jag dricker te.", de: "Ich trinke Tee." },
  { id: 93, level: "A1", topic: "mat", sv: "Jag äter glass.", de: "Ich esse Eis." },
  { id: 94, level: "A1", topic: "mat", sv: "Jag skivar ost.", de: "Ich schneide Käse." },
  { id: 95, level: "A1", topic: "mat", sv: "Jag kokar ägg.", de: "Ich koche Eier." },
  { id: 96, level: "A1", topic: "väder", sv: "Det är molnigt.", de: "Es ist bewölkt." },
  { id: 97, level: "A1", topic: "väder", sv: "Det är varmt ute.", de: "Es ist draußen warm." },
  { id: 98, level: "A1", topic: "väder", sv: "Det fryser ute.", de: "Es friert draußen." },
  { id: 99, level: "A1", topic: "väder", sv: "Det regnar mycket.", de: "Es regnet viel." },
  { id: 100, level: "A1", topic: "väder", sv: "Det är ingen sol.", de: "Es gibt keine Sonne." },
  { id: 101, level: "A1", topic: "resor", sv: "Jag tar bussen hem.", de: "Ich nehme den Bus nach Hause." },
  { id: 102, level: "A1", topic: "resor", sv: "Jag åker tunnelbana.", de: "Ich fahre U-Bahn." },
  { id: 103, level: "A1", topic: "resor", sv: "Jag promenerar dit.", de: "Ich gehe dorthin." },
  { id: 104, level: "A1", topic: "resor", sv: "Jag går över gatan.", de: "Ich gehe über die Straße." },
  { id: 105, level: "A1", topic: "resor", sv: "Jag går uppför trappan.", de: "Ich gehe die Treppe hoch." },
  { id: 106, level: "A1", topic: "hemmet", sv: "Jag dammar hyllan.", de: "Ich staube das Regal ab." },
  { id: 107, level: "A1", topic: "hemmet", sv: "Jag viker kläder.", de: "Ich falte Kleidung." },
  { id: 108, level: "A1", topic: "hemmet", sv: "Jag rengör bordet.", de: "Ich reinige den Tisch." },
  { id: 109, level: "A1", topic: "hemmet", sv: "Jag tvättar golvet.", de: "Ich wische den Boden." },
  { id: 110, level: "A1", topic: "hemmet", sv: "Jag öppnar dörren.", de: "Ich öffne die Tür." },
  { id: 111, level: "A1", topic: "vardag", sv: "Jag köper frukt.", de: "Ich kaufe Obst." },
  { id: 112, level: "A1", topic: "vardag", sv: "Jag hittar min mössa.", de: "Ich finde meine Mütze." },
  { id: 113, level: "A1", topic: "vardag", sv: "Jag tappar pennan.", de: "Ich verliere den Stift." },
  { id: 114, level: "A1", topic: "vardag", sv: "Jag köar länge.", de: "Ich stehe lange an." },
  { id: 115, level: "A1", topic: "vardag", sv: "Jag bokar tid.", de: "Ich mache einen Termin." },
  { id: 116, level: "A1", topic: "familj", sv: "Min farfar sover.", de: "Mein Opa schläft." },
  { id: 117, level: "A1", topic: "familj", sv: "Min farmor bakar.", de: "Meine Oma backt." },
  { id: 118, level: "A1", topic: "familj", sv: "Min bror skrattar.", de: "Mein Bruder lacht." },
  { id: 119, level: "A1", topic: "familj", sv: "Min mamma läser.", de: "Meine Mutter liest." },
  { id: 120, level: "A1", topic: "familj", sv: "Min pappa skriker.", de: "Mein Vater schreit." },
  { id: 121, level: "A1", topic: "skola", sv: "Jag öppnar min bok.", de: "Ich öffne mein Buch." },
  { id: 122, level: "A1", topic: "skola", sv: "Jag stänger min bok.", de: "Ich schließe mein Buch." },
  { id: 123, level: "A1", topic: "skola", sv: "Jag suddar ett fel.", de: "Ich radiere einen Fehler aus." },
  { id: 124, level: "A1", topic: "skola", sv: "Jag skriver snabbt.", de: "Ich schreibe schnell." },
  { id: 125, level: "A1", topic: "skola", sv: "Jag sitter på stolen.", de: "Ich sitze auf dem Stuhl." },
  { id: 126, level: "A1", topic: "hobby", sv: "Jag tränar hemma.", de: "Ich trainiere zu Hause." },
  { id: 127, level: "A1", topic: "hobby", sv: "Jag hoppar rep.", de: "Ich springe Seil." },
  { id: 128, level: "A1", topic: "hobby", sv: "Jag tittar på film.", de: "Ich schaue einen Film." },
  { id: 129, level: "A1", topic: "hobby", sv: "Jag spelar kort.", de: "Ich spiele Karten." },
  { id: 130, level: "A1", topic: "hobby", sv: "Jag fotar med mobilen.", de: "Ich fotografiere mit dem Handy." },
  { id: 131, level: "A1", topic: "mat", sv: "Jag skär tomater.", de: "Ich schneide Tomaten." },
  { id: 132, level: "A1", topic: "mat", sv: "Jag äter soppa.", de: "Ich esse Suppe." },
  { id: 133, level: "A1", topic: "mat", sv: "Jag dricker mjölk.", de: "Ich trinke Milch." },
  { id: 134, level: "A1", topic: "mat", sv: "Jag äter fisk.", de: "Ich esse Fisch." },
  { id: 135, level: "A1", topic: "mat", sv: "Jag steker kött.", de: "Ich brate Fleisch." },
  { id: 136, level: "A1", topic: "väder", sv: "Det är storm idag.", de: "Es ist heute stürmisch." },
  { id: 137, level: "A1", topic: "väder", sv: "Det är dimma ute.", de: "Es ist neblig draußen." },
  { id: 138, level: "A1", topic: "väder", sv: "Det haglar lite.", de: "Es hagelt ein bisschen." },
  { id: 139, level: "A1", topic: "väder", sv: "Det regnar hela dagen.", de: "Es regnet den ganzen Tag." },
  { id: 140, level: "A1", topic: "väder", sv: "Det är kall vinter.", de: "Es ist ein kalter Winter." },
  { id: 141, level: "A1", topic: "resor", sv: "Jag kör till jobbet.", de: "Ich fahre zur Arbeit." },
  { id: 142, level: "A1", topic: "resor", sv: "Jag missar bussen.", de: "Ich verpasse den Bus." },
  { id: 143, level: "A1", topic: "resor", sv: "Jag tar tåget hem.", de: "Ich nehme den Zug nach Hause." },
  { id: 144, level: "A1", topic: "resor", sv: "Jag byter buss.", de: "Ich wechsle den Bus." },
  { id: 145, level: "A1", topic: "resor", sv: "Jag väntar på taxi.", de: "Ich warte auf ein Taxi." },
  { id: 146, level: "A1", topic: "hemmet", sv: "Jag viker täcket.", de: "Ich falte die Decke." },
  { id: 147, level: "A1", topic: "hemmet", sv: "Jag tömmer papperskorgen.", de: "Ich leere den Papierkorb." },
  { id: 148, level: "A1", topic: "hemmet", sv: "Jag rullar ut mattan.", de: "Ich rolle den Teppich aus." },
  { id: 149, level: "A1", topic: "hemmet", sv: "Jag sätter på tv:n.", de: "Ich schalte den Fernseher ein." },
  { id: 150, level: "A1", topic: "hemmet", sv: "Jag öppnar kylskåpet.", de: "Ich öffne den Kühlschrank." },
  { id: 151, level: "A1", topic: "familj", sv: "Min bror äter pizza.", de: "Mein Bruder isst Pizza." },
  { id: 152, level: "A1", topic: "familj", sv: "Min syster duschar.", de: "Meine Schwester duscht." },
  { id: 153, level: "A1", topic: "familj", sv: "Min mamma ringer mig.", de: "Meine Mutter ruft mich an." },
  { id: 154, level: "A1", topic: "familj", sv: "Min pappa tränar.", de: "Mein Vater trainiert." },
  { id: 155, level: "A1", topic: "familj", sv: "Min morfar skrattar.", de: "Mein Opa lacht." },
  { id: 156, level: "A1", topic: "vardag", sv: "Jag dammtorkar bordet.", de: "Ich wische den Tisch ab." },
  { id: 157, level: "A1", topic: "vardag", sv: "Jag kollar mejlen.", de: "Ich checke die E-Mails." },
  { id: 158, level: "A1", topic: "vardag", sv: "Jag låser dörren.", de: "Ich schließe die Tür ab." },
  { id: 159, level: "A1", topic: "vardag", sv: "Jag laddar mobilen.", de: "Ich lade das Handy." },
  { id: 160, level: "A1", topic: "vardag", sv: "Jag kollar nyheterna.", de: "Ich sehe die Nachrichten." },
  { id: 161, level: "A1", topic: "hobby", sv: "Jag tränar yoga.", de: "Ich mache Yoga." },
  { id: 162, level: "A1", topic: "hobby", sv: "Jag klipper bilder.", de: "Ich schneide Bilder aus." },
  { id: 163, level: "A1", topic: "hobby", sv: "Jag kör skateboard.", de: "Ich fahre Skateboard." },
  { id: 164, level: "A1", topic: "hobby", sv: "Jag skriver dikter.", de: "Ich schreibe Gedichte." },
  { id: 165, level: "A1", topic: "hobby", sv: "Jag bakar bullar.", de: "Ich backe Brötchen." },
  { id: 166, level: "A1", topic: "mat", sv: "Jag värmer soppa.", de: "Ich wärme Suppe auf." },
  { id: 167, level: "A1", topic: "mat", sv: "Jag dricker cola.", de: "Ich trinke Cola." },
  { id: 168, level: "A1", topic: "mat", sv: "Jag äter potatis.", de: "Ich esse Kartoffeln." },
  { id: 169, level: "A1", topic: "mat", sv: "Jag äter sallad.", de: "Ich esse Salat." },
  { id: 170, level: "A1", topic: "mat", sv: "Jag gör en macka.", de: "Ich mache ein Sandwich." },
  { id: 171, level: "A1", topic: "väder", sv: "Det är sol idag.", de: "Es ist heute sonnig." },
  { id: 172, level: "A1", topic: "väder", sv: "Det blåser kallt.", de: "Es weht kalt." },
  { id: 173, level: "A1", topic: "väder", sv: "Det är mörkt tidigt.", de: "Es wird früh dunkel." },
  { id: 174, level: "A1", topic: "väder", sv: "Det är varmt inne.", de: "Es ist warm drinnen." },
  { id: 175, level: "A1", topic: "väder", sv: "Det blir kallare.", de: "Es wird kälter." },
  { id: 176, level: "A1", topic: "resor", sv: "Jag går till hållplatsen.", de: "Ich gehe zur Haltestelle." },
  { id: 177, level: "A1", topic: "resor", sv: "Jag åker hem tidigt.", de: "Ich fahre früh nach Hause." },
  { id: 178, level: "A1", topic: "resor", sv: "Jag följer kartan.", de: "Ich folge der Karte." },
  { id: 179, level: "A1", topic: "resor", sv: "Jag anländer snart.", de: "Ich komme bald an." },
  { id: 180, level: "A1", topic: "resor", sv: "Jag går till vänster.", de: "Ich gehe nach links." },
  { id: 181, level: "A1", topic: "hemmet", sv: "Jag stänger fönstret.", de: "Ich schließe das Fenster." },
  { id: 182, level: "A1", topic: "hemmet", sv: "Jag dammar stolen.", de: "Ich staube den Stuhl ab." },
  { id: 183, level: "A1", topic: "hemmet", sv: "Jag sköljer glaset.", de: "Ich spüle das Glas." },
  { id: 184, level: "A1", topic: "hemmet", sv: "Jag hänger tvätt.", de: "Ich hänge Wäsche auf." },
  { id: 185, level: "A1", topic: "hemmet", sv: "Jag plockar undan.", de: "Ich räume auf." },
  { id: 186, level: "A1", topic: "vardag", sv: "Jag köper bananer.", de: "Ich kaufe Bananen." },
  { id: 187, level: "A1", topic: "vardag", sv: "Jag öppnar posten.", de: "Ich öffne die Post." },
  { id: 188, level: "A1", topic: "vardag", sv: "Jag tappar glaset.", de: "Ich lasse das Glas fallen." },
  { id: 189, level: "A1", topic: "vardag", sv: "Jag skickar ett sms.", de: "Ich schicke eine SMS." },
  { id: 190, level: "A1", topic: "vardag", sv: "Jag väntar utanför.", de: "Ich warte draußen." },
  { id: 191, level: "A1", topic: "familj", sv: "Min syster springer.", de: "Meine Schwester rennt." },
  { id: 192, level: "A1", topic: "familj", sv: "Min mamma sjunger.", de: "Meine Mutter singt." },
  { id: 193, level: "A1", topic: "familj", sv: "Min bror spelar gitarr.", de: "Mein Bruder spielt Gitarre." },
  { id: 194, level: "A1", topic: "familj", sv: "Min pappa sover länge.", de: "Mein Vater schläft lange." },
  { id: 195, level: "A1", topic: "familj", sv: "Min kusin tränar.", de: "Mein Cousin trainiert." },
  { id: 196, level: "A1", topic: "mat", sv: "Jag steker ägg.", de: "Ich brate Eier." },
  { id: 197, level: "A1", topic: "mat", sv: "Jag dricker vatten nu.", de: "Ich trinke jetzt Wasser." },
  { id: 198, level: "A1", topic: "mat", sv: "Jag äter korv.", de: "Ich esse Wurst." },
  { id: 199, level: "A1", topic: "mat", sv: "Jag skalar en apelsin.", de: "Ich schäle eine Orange." },
  { id: 200, level: "A1", topic: "mat", sv: "Jag lagar pasta.", de: "Ich koche Pasta." },

  // A2 – alla med unika id från 201 och uppåt
  { id: 201, level: "A2", topic: "fritid", sv: "Jag tränar på gymmet två gånger i veckan.", de: "Ich trainiere zweimal pro Woche im Fitnessstudio." },
  { id: 202, level: "A2", topic: "jobb", sv: "Jag börjar jobbet klockan åtta varje morgon.", de: "Ich beginne jeden Morgen um acht Uhr mit der Arbeit." },
  { id: 203, level: "A2", topic: "skola", sv: "Jag pluggar svenska varje dag för att bli bättre.", de: "Ich lerne jeden Tag Schwedisch, um besser zu werden." },
  { id: 204, level: "A2", topic: "resor", sv: "Jag åker buss till stan när jag ska handla.", de: "Ich fahre mit dem Bus in die Stadt, wenn ich einkaufe." },
  { id: 205, level: "A2", topic: "väder", sv: "Det snöade mycket igår kväll.", de: "Es hat gestern Abend viel geschneit." },
  { id: 206, level: "A2", topic: "hemmet", sv: "Jag måste städa köket efter middagen.", de: "Ich muss die Küche nach dem Abendessen putzen." },
  { id: 207, level: "A2", topic: "fritid", sv: "Jag tittar ofta på film på helgerna.", de: "Ich schaue am Wochenende oft Filme." },
  { id: 208, level: "A2", topic: "fritid", sv: "Jag går en promenad varje kväll.", de: "Ich mache jeden Abend einen Spaziergang." },
  { id: 209, level: "A2", topic: "mat", sv: "Jag gillar att laga pasta med kyckling.", de: "Ich koche gerne Pasta mit Hähnchen." },
  { id: 210, level: "A2", topic: "resor", sv: "Jag vill resa till Berlin nästa sommar.", de: "Ich möchte nächsten Sommer nach Berlin reisen." },

  { id: 211, level: "A2", topic: "vardag", sv: "Jag vaknade tidigt i morse.", de: "Ich wachte heute Morgen früh auf." },
  { id: 212, level: "A2", topic: "vardag", sv: "Han skrev ett långt meddelande.", de: "Er schrieb eine lange Nachricht." },
  { id: 213, level: "A2", topic: "arbete", sv: "Vi började jobbet klockan åtta.", de: "Wir begannen die Arbeit um acht Uhr." },
  { id: 214, level: "A2", topic: "skola", sv: "Läraren förklarade uppgiften igen.", de: "Der Lehrer erklärte die Aufgabe noch einmal." },
  { id: 215, level: "A2", topic: "vänskap", sv: "Jag ringde min bästa vän igår.", de: "Ich rief gestern meinen besten Freund an." },
  { id: 216, level: "A2", topic: "hemmet", sv: "Hon lagade mat till hela familjen.", de: "Sie kochte für die ganze Familie." },
  { id: 217, level: "A2", topic: "träning", sv: "Vi simmade i 30 minuter.", de: "Wir schwammen dreißig Minuten." },
  { id: 218, level: "A2", topic: "mat", sv: "Han drack en kopp kaffe på morgonen.", de: "Er trank morgens eine Tasse Kaffee." },
  { id: 219, level: "A2", topic: "resor", sv: "Tåget kom för sent.", de: "Der Zug kam zu spät." },
  { id: 220, level: "A2", topic: "arbete", sv: "De fixade problemet snabbt.", de: "Sie behoben das Problem schnell." },
  { id: 221, level: "A2", topic: "skola", sv: "Jag läste texten två gånger.", de: "Ich las den Text zweimal." },
  { id: 222, level: "A2", topic: "hemmet", sv: "Vi flyttade soffan till vardagsrummet.", de: "Wir stellten das Sofa ins Wohnzimmer." },
  { id: 223, level: "A2", topic: "resor", sv: "Hon flög till Spanien i somras.", de: "Sie flog letzten Sommer nach Spanien." },
  { id: 224, level: "A2", topic: "vänskap", sv: "Vi spelade kort hela kvällen.", de: "Wir spielten den ganzen Abend Karten." },
  { id: 225, level: "A2", topic: "träning", sv: "Han lyfte tunga vikter på gymmet.", de: "Er hob im Fitnessstudio schwere Gewichte." },
  { id: 226, level: "A2", topic: "dator", sv: "Jag uppdaterade datorn igår.", de: "Ich aktualisierte gestern den Computer." },
  { id: 227, level: "A2", topic: "shopping", sv: "De hittade en billig tröja.", de: "Sie fanden einen günstigen Pullover." },
  { id: 228, level: "A2", topic: "mat", sv: "Vi bakade bröd tillsammans.", de: "Wir backten zusammen Brot." },
  { id: 229, level: "A2", topic: "vardag", sv: "Hon väntade på bussen i tio minuter.", de: "Sie wartete zehn Minuten auf den Bus." },

  // B1 – också unika id, fortsätter från 230
  { id: 230, level: "B1", topic: "vardag", sv: "Jag vaknade tidigt i morse.", de: "Ich wachte heute Morgen früh auf." },
  { id: 231, level: "B1", topic: "vardag", sv: "Han skrev ett långt meddelande.", de: "Er schrieb eine lange Nachricht." },
  { id: 232, level: "B1", topic: "arbete", sv: "Vi började jobbet klockan åtta.", de: "Wir begannen die Arbeit um acht Uhr." },
  { id: 233, level: "B1", topic: "skola", sv: "Läraren förklarade uppgiften igen.", de: "Der Lehrer erklärte die Aufgabe noch einmal." },
  { id: 234, level: "B1", topic: "vänskap", sv: "Jag ringde min bästa vän igår.", de: "Ich rief gestern meinen besten Freund an." },
  { id: 235, level: "B1", topic: "hemmet", sv: "Hon lagade mat till hela familjen.", de: "Sie kochte för die ganze Familie." },
  { id: 236, level: "B1", topic: "träning", sv: "Vi simmade i 30 minuter.", de: "Wir schwammen dreißig Minuten." },
  { id: 237, level: "B1", topic: "mat", sv: "Han drack en kopp kaffe på morgonen.", de: "Er trank morgens eine Tasse Kaffee." },
  { id: 238, level: "B1", topic: "resor", sv: "Tåget kom för sent.", de: "Der Zug kam zu spät." },
  { id: 239, level: "B1", topic: "shopping", sv: "Jag beställde en ny telefon online.", de: "Ich bestellte ein neues Handy online." },

  { id: 240, level: "B1", topic: "vardag", sv: "Jag har vaknat tidigt idag.", de: "Ich bin heute früh aufgewacht." },
  { id: 241, level: "B1", topic: "vardag", sv: "Jag har glömt mina nycklar hemma.", de: "Ich habe meine Schlüssel zu Hause vergessen." },
  { id: 242, level: "B1", topic: "vardag", sv: "Han har öppnat fönstret.", de: "Er hat das Fenster geöffnet." },
  { id: 243, level: "B1", topic: "vardag", sv: "Hon har stängt dörren.", de: "Sie hat die Tür geschlossen." },
  { id: 244, level: "B1", topic: "vardag", sv: "Vi har pratat om problemet.", de: "Wir haben über das Problem gesprochen." },
  { id: 245, level: "B1", topic: "vardag", sv: "Jag har sett filmen tidigare.", de: "Ich habe den Film früher gesehen." },
  { id: 246, level: "B1", topic: "vardag", sv: "Hon har gått till affären.", de: "Sie ist zum Laden gegangen." },
  { id: 247, level: "B1", topic: "vardag", sv: "Jag har skrivit ett mejl.", de: "Ich habe eine E-Mail geschrieben." },
  { id: 248, level: "B1", topic: "vardag", sv: "Han har gjort sin läxa.", de: "Er hat seine Hausaufgaben gemacht." },
  { id: 249, level: "B1", topic: "vardag", sv: "Vi har väntat i tio minuter.", de: "Wir haben zehn Minuten gewartet." },

  { id: 250, level: "B1", topic: "skola", sv: "Jag har läst kapitlet.", de: "Ich habe das Kapitel gelesen." },
  { id: 251, level: "B1", topic: "skola", sv: "Läraren har förklarat allt.", de: "Der Lehrer hat alles erklärt." },
  { id: 252, level: "B1", topic: "skola", sv: "Vi har skrivit provet.", de: "Wir haben die Prüfung geschrieben." },
  { id: 253, level: "B1", topic: "skola", sv: "Eleverna har ställt frågor.", de: "Die Schüler haben Fragen gestellt." },
  { id: 254, level: "B1", topic: "skola", sv: "Hon har lärt sig nya ord.", de: "Sie hat neue Wörter gelernt." },

  { id: 255, level: "B1", topic: "arbete", sv: "Jag har skickat dokumentet.", de: "Ich habe das Dokument geschickt." },
  { id: 256, level: "B1", topic: "arbete", sv: "Han har fått ett nytt jobb.", de: "Er hat einen neuen Job bekommen." },
  { id: 257, level: "B1", topic: "arbete", sv: "Vi har avslutat projektet.", de: "Wir haben das Projekt beendet." },
  { id: 258, level: "B1", topic: "arbete", sv: "Chefen har ringt mig.", de: "Der Chef hat mich angerufen." },
  { id: 259, level: "B1", topic: "arbete", sv: "Jag har skrivit rapporten.", de: "Ich habe den Bericht geschrieben." },

  { id: 260, level: "B1", topic: "vänskap", sv: "Jag har träffat min vän idag.", de: "Ich habe heute meinen Freund getroffen." },
  { id: 261, level: "B1", topic: "vänskap", sv: "Vi har druckit kaffe tillsammans.", de: "Wir haben zusammen Kaffee getrunken." },
  { id: 262, level: "B1", topic: "vänskap", sv: "Hon har bjudit mig på middag.", de: "Sie hat mich zum Abendessen eingeladen." },
  { id: 263, level: "B1", topic: "vänskap", sv: "Han har hjälpt mig mycket.", de: "Er hat mir viel geholfen." },
  { id: 264, level: "B1", topic: "vänskap", sv: "Vi har haft roligt hela dagen.", de: "Wir haben den ganzen Tag Spaß gehabt." },

  { id: 265, level: "B1", topic: "hemmet", sv: "Jag har städat rummet.", de: "Ich habe das Zimmer geputzt." },
  { id: 266, level: "B1", topic: "hemmet", sv: "Hon har lagat maten.", de: "Sie hat das Essen gekocht." },
  { id: 267, level: "B1", topic: "hemmet", sv: "Vi har tvättat kläderna.", de: "Wir haben die Wäsche gewaschen." },
  { id: 268, level: "B1", topic: "hemmet", sv: "Han har reparerat lampan.", de: "Er hat die Lampe repariert." },
  { id: 269, level: "B1", topic: "hemmet", sv: "Jag har bytt gardinerna.", de: "Ich habe die Vorhänge gewechselt." },

  { id: 270, level: "B1", topic: "mat", sv: "Vi har ätit middag.", de: "Wir haben zu Abend gegessen." },
  { id: 271, level: "B1", topic: "mat", sv: "Han har bakat bröd.", de: "Er hat Brot gebacken." },
  { id: 272, level: "B1", topic: "mat", sv: "Jag har köpt frukt.", de: "Ich habe Obst gekauft." },
  { id: 273, level: "B1", topic: "mat", sv: "Hon har provat receptet.", de: "Sie hat das Rezept ausprobiert." },
  { id: 274, level: "B1", topic: "mat", sv: "Vi har lagat soppa.", de: "Wir haben Suppe gekocht." },

  { id: 275, level: "B1", topic: "träning", sv: "Jag har tränat på gymmet.", de: "Ich habe im Fitnessstudio trainiert." },
  { id: 276, level: "B1", topic: "träning", sv: "Han har sprungit fem kilometer.", de: "Er ist fünf Kilometer gelaufen." },
  { id: 277, level: "B1", topic: "träning", sv: "Vi har cyklat i en timme.", de: "Wir sind eine Stunde Rad gefahren." },
  { id: 278, level: "B1", topic: "träning", sv: "Hon har simmat i poolen.", de: "Sie ist im Pool geschwommen." },
  { id: 279, level: "B1", topic: "träning", sv: "Jag har lyft tunga vikter.", de: "Ich habe schwere Gewichte gehoben." },

  { id: 280, level: "B1", topic: "resor", sv: "Jag har rest till Spanien.", de: "Ich bin nach Spanien gereist." },
  { id: 281, level: "B1", topic: "resor", sv: "Vi har bokat biljetterna.", de: "Wir haben die Tickets gebucht." },
  { id: 282, level: "B1", topic: "resor", sv: "Han har packat väskan.", de: "Er hat den Koffer gepackt." },
  { id: 283, level: "B1", topic: "resor", sv: "Flyget har landat sent.", de: "Das Flugzeug ist spät gelandet." },
  { id: 284, level: "B1", topic: "resor", sv: "Hon har besökt sina släktingar.", de: "Sie hat ihre Verwandten besucht." },

  { id: 285, level: "B1", topic: "shopping", sv: "Jag har köpt en ny jacka.", de: "Ich habe eine neue Jacke gekauft." },
  { id: 286, level: "B1", topic: "shopping", sv: "Han har provat byxorna.", de: "Er hat die Hose anprobiert." },
  { id: 287, level: "B1", topic: "shopping", sv: "Vi har betalat i kassan.", de: "Wir haben an der Kasse bezahlt." },
  { id: 288, level: "B1", topic: "shopping", sv: "Hon har fått rabatt.", de: "Sie hat einen Rabatt bekommen." },
  { id: 289, level: "B1", topic: "shopping", sv: "Jag har returnerat varan.", de: "Ich habe den Artikel zurückgegeben." },

  { id: 290, level: "B1", topic: "dator", sv: "Jag har installerat programmet.", de: "Ich habe das Programm installiert." },
  { id: 291, level: "B1", topic: "dator", sv: "Han har fixat datorn.", de: "Er hat den Computer repariert." },
  { id: 292, level: "B1", topic: "dator", sv: "Vi har uppdaterat systemet.", de: "Wir haben das System aktualisiert." },
  { id: 293, level: "B1", topic: "dator", sv: "Hon har laddat ner filen.", de: "Sie hat die Datei heruntergeladen." },
  { id: 294, level: "B1", topic: "dator", sv: "Jag har sparat dokumentet.", de: "Ich habe das Dokument gespeichert." },

  { id: 295, level: "B1", topic: "hälsa", sv: "Jag har sovit dåligt i natt.", de: "Ich habe schlecht geschlafen." },
  { id: 296, level: "B1", topic: "hälsa", sv: "Han har tränat varje dag.", de: "Er hat jeden Tag trainiert." },
  { id: 297, level: "B1", topic: "hälsa", sv: "Vi har ätit hälsosamt.", de: "Wir haben gesund gegessen." },
  { id: 298, level: "B1", topic: "hälsa", sv: "Hon har druckit mycket vatten.", de: "Sie hat viel Wasser getrunken." },
  { id: 299, level: "B1", topic: "hälsa", sv: "Jag har gått en lång promenad.", de: "Ich bin einen langen Spaziergang gegangen." },

  { id: 300, level: "B1", topic: "familj", sv: "Vi har firat min födelsedag.", de: "Wir haben meinen Geburtstag gefeiert." },
  { id: 301, level: "B1", topic: "familj", sv: "Han har besökt sina föräldrar.", de: "Er hat seine Eltern besucht." },
  { id: 302, level: "B1", topic: "familj", sv: "Jag har ringt min syster.", de: "Ich habe meine Schwester angerufen." },
  { id: 303, level: "B1", topic: "familj", sv: "Hon har hjälpt sin bror.", de: "Sie hat ihrem Bruder geholfen." },
  { id: 304, level: "B1", topic: "familj", sv: "Vi har lagat mat tillsammans.", de: "Wir haben zusammen gekocht." },

  { id: 305, level: "B1", topic: "jobb", sv: "Jag har arbetat hela dagen.", de: "Ich habe den ganzen Tag gearbeitet." },
  { id: 306, level: "B1", topic: "jobb", sv: "Han har skickat rapporten.", de: "Er hat den Bericht geschickt." },
  { id: 307, level: "B1", topic: "jobb", sv: "Vi har träffat kunden.", de: "Wir haben den Kunden getroffen." },
  { id: 308, level: "B1", topic: "jobb", sv: "Hon har planerat mötet.", de: "Sie hat das Meeting geplant." },
  { id: 309, level: "B1", topic: "jobb", sv: "Jag har förberett presentationen.", de: "Ich habe die Präsentation vorbereitet." },

  { id: 310, level: "B1", topic: "väder", sv: "Det har regnat hela dagen.", de: "Es hat den ganzen Tag geregnet." },
  { id: 311, level: "B1", topic: "väder", sv: "Det har snöat i natt.", de: "Es hat in der Nacht geschneit." },
  { id: 312, level: "B1", topic: "väder", sv: "Vinden har ökat.", de: "Der Wind hat zugenommen." },
  { id: 313, level: "B1", topic: "väder", sv: "Solen har skinit hela morgonen.", de: "Die Sonne hat den ganzen Morgen geschienen." },
  { id: 314, level: "B1", topic: "väder", sv: "Temperaturen har sjunkit.", de: "Die Temperatur ist gesunken." },

  { id: 315, level: "B1", topic: "fritid", sv: "Jag har spelat fotboll.", de: "Ich habe Fußball gespielt." },
  { id: 316, level: "B1", topic: "fritid", sv: "Han har sett en bra film.", de: "Er hat einen guten Film gesehen." },
  { id: 317, level: "B1", topic: "fritid", sv: "Vi har dansat hela kvällen.", de: "Wir haben den ganzen Abend getanzt." },
  { id: 318, level: "B1", topic: "fritid", sv: "Hon har lyssnat på musik.", de: "Sie hat Musik gehört." },
  { id: 319, level: "B1", topic: "fritid", sv: "Jag har spelat datorspel.", de: "Ich habe Computerspiele gespielt." },

  { id: 320, level: "B1", topic: "trafik", sv: "Jag har kört bilen i två timmar.", de: "Ich habe das Auto zwei Stunden gefahren." },
  { id: 321, level: "B1", topic: "trafik", sv: "Han har missat bussen.", de: "Er hat den Bus verpasst." },
  { id: 322, level: "B1", topic: "trafik", sv: "Vi har väntat på tåget.", de: "Wir haben auf den Zug gewartet." },
  { id: 323, level: "B1", topic: "trafik", sv: "Hon har åkt hem.", de: "Sie ist nach Hause gefahren." },
  { id: 324, level: "B1", topic: "trafik", sv: "Jag har bytt däck på bilen.", de: "Ich habe die Reifen am Auto gewechselt." },

  { id: 325, level: "B1", topic: "kommunikation", sv: "Jag har skickat ett sms.", de: "Ich habe eine SMS geschickt." },
  { id: 326, level: "B1", topic: "kommunikation", sv: "Han har ringt sin mamma.", de: "Er hat seine Mutter angerufen." },
  { id: 327, level: "B1", topic: "kommunikation", sv: "Vi har skrivit många mejl.", de: "Wir haben viele E-Mails geschrieben." },
  { id: 328, level: "B1", topic: "kommunikation", sv: "Hon har berättat sanningen.", de: "Sie hat die Wahrheit erzählt." },
  { id: 329, level: "B1", topic: "kommunikation", sv: "Jag har förklarat allt.", de: "Ich habe alles erklärt." },

  { id: 330, level: "B1", topic: "affärer", sv: "Jag har sålt min gamla telefon.", de: "Ich habe mein altes Handy verkauft." },
  { id: 331, level: "B1", topic: "affärer", sv: "Han har köpt en ny dator.", de: "Er hat einen neuen Computer gekauft." },
  { id: 332, level: "B1", topic: "affärer", sv: "Vi har tjänat lite pengar.", de: "Wir haben etwas Geld verdient." },
  { id: 333, level: "B1", topic: "affärer", sv: "Hon har öppnat ett bankkonto.", de: "Sie hat ein Bankkonto eröffnet." },
  { id: 334, level: "B1", topic: "affärer", sv: "Jag har beställt en produkt online.", de: "Ich habe ein Produkt online bestellt." },

  { id: 335, level: "B1", topic: "kropp", sv: "Jag har brutit fingret.", de: "Ich habe mir den Finger gebrochen." },
  { id: 336, level: "B1", topic: "kropp", sv: "Han har skadat benet.", de: "Er hat sich das Bein verletzt." },
  { id: 337, level: "B1", topic: "kropp", sv: "Hon har klippt håret.", de: "Sie hat sich die Haare schneiden lassen." },
  { id: 338, level: "B1", topic: "kropp", sv: "Jag har tappat rösten.", de: "Ich habe meine Stimme verloren." },
  { id: 339, level: "B1", topic: "kropp", sv: "De har blivit sjuka.", de: "Sie sind krank geworden." },

];

const grammarQuestions = [

  { id: 1, q: "___ Mann ist alt.", options: ["Der", "Den", "Dem"], answer: "Der", type: "Nominativ (M)" },
  { id: 2, q: "___ Frau singt.", options: ["Die", "Der", "Dem"], answer: "Die", type: "Nominativ (F)" },
  { id: 3, q: "___ Kind spielt.", options: ["Das", "Den", "Dem"], answer: "Das", type: "Nominativ (N)" },
  { id: 4, q: "___ Hund bellt.", options: ["Der", "Den", "Dem"], answer: "Der", type: "Nominativ (M)" },
  { id: 5, q: "___ Katze schläft.", options: ["Die", "Der", "Das"], answer: "Die", type: "Nominativ (F)" },
  { id: 6, q: "___ Auto ist schnell.", options: ["Das", "Dem", "Den"], answer: "Das", type: "Nominativ (N)" },
  { id: 7, q: "___ Tisch ist teuer.", options: ["Der", "Den", "Das"], answer: "Der", type: "Nominativ (M)" },
  { id: 8, q: "___ Sonne scheint.", options: ["Die", "Der", "Das"], answer: "Die", type: "Nominativ (F)" },
  { id: 9, q: "___ Lehrer kommt.", options: ["Der", "Den", "Dem"], answer: "Der", type: "Nominativ (M)" },
  { id: 10, q: "___ Wasser ist kalt.", options: ["Das", "Der", "Den"], answer: "Das", type: "Nominativ (N)" },

  { id: 11, q: "Ich habe ___ Hund.", options: ["einen", "einem", "einer"], answer: "einen", type: "Akkusativ (M)" },
  { id: 12, q: "Er kauft ___ Tisch.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (M)" },
  { id: 13, q: "Sie sieht ___ Frau.", options: ["die", "der", "den"], answer: "die", type: "Akkusativ (F)" },
  { id: 14, q: "Wir essen ___ Apfel.", options: ["den", "dem", "das"], answer: "den", type: "Akkusativ (M)" },
  { id: 15, q: "Er liest ___ Buch.", options: ["das", "dem", "den"], answer: "das", type: "Akkusativ (N)" },
  { id: 16, q: "Ich suche ___ Schlüssel.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (M)" },
  { id: 17, q: "Hast du ___ Stift?", options: ["einen", "einem", "einer"], answer: "einen", type: "Akkusativ (M)" },
  { id: 18, q: "Sie trinkt ___ Kaffee.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (M)" },
  { id: 19, q: "Ich mag ___ Film.", options: ["den", "dem", "das"], answer: "den", type: "Akkusativ (M)" },
  { id: 20, q: "Wir besuchen ___ Oma.", options: ["die", "der", "dem"], answer: "die", type: "Akkusativ (F)" },
  { id: 21, q: "Er liebt ___ Mädchen.", options: ["das", "die", "dem"], answer: "das", type: "Akkusativ (N)" },
  { id: 22, q: "Ich brauche ___ Computer.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (M)" },
  { id: 23, q: "Siehst du ___ Zug?", options: ["den", "dem", "das"], answer: "den", type: "Akkusativ (M)" },
  { id: 24, q: "Er nimmt ___ Bus.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (M)" },
  { id: 25, q: "Ich trage ___ Jacke.", options: ["eine", "einer", "einem"], answer: "eine", type: "Akkusativ (F)" },

  { id: 26, q: "Ich helfe ___ Mann.", options: ["dem", "den", "der"], answer: "dem", type: "Dativ (M)" },
  { id: 27, q: "Das Auto gehört ___ Frau.", options: ["der", "die", "den"], answer: "der", type: "Dativ (F)" },
  { id: 28, q: "Wir danken ___ Lehrer.", options: ["dem", "den", "des"], answer: "dem", type: "Dativ (M)" },
  { id: 29, q: "Die Pizza schmeckt ___ Kind.", options: ["dem", "den", "das"], answer: "dem", type: "Dativ (N)" },
  { id: 30, q: "Ich antworte ___ Vater.", options: ["dem", "den", "der"], answer: "dem", type: "Dativ (M)" },
  { id: 31, q: "Wie geht es ___ Mutter?", options: ["der", "die", "dem"], answer: "der", type: "Dativ (F)" },
  { id: 32, q: "Er gratuliert ___ Freund.", options: ["dem", "den", "des"], answer: "dem", type: "Dativ (M)" },
  { id: 33, q: "Das Buch gefällt ___ Schüler.", options: ["dem", "den", "der"], answer: "dem", type: "Dativ (M)" },
  { id: 34, q: "Sie glaubt ___ Arzt.", options: ["dem", "den", "das"], answer: "dem", type: "Dativ (M)" },
  { id: 35, q: "Ich vertraue ___ Schwester.", options: ["der", "die", "dem"], answer: "der", type: "Dativ (F)" },

  { id: 36, q: "Ich fahre mit ___ Bus.", options: ["dem", "den", "der"], answer: "dem", type: "Präposition (Dativ)" },
  { id: 37, q: "Er kommt aus ___ Schule.", options: ["der", "die", "dem"], answer: "der", type: "Präposition (Dativ)" },
  { id: 38, q: "Wir gehen zu ___ Bahnhof.", options: ["dem", "den", "der"], answer: "dem", type: "Präposition (Dativ)" },
  { id: 39, q: "Sie wohnt bei ___ Oma.", options: ["der", "die", "dem"], answer: "der", type: "Präposition (Dativ)" },
  { id: 40, q: "Nach ___ Essen schlafe ich.", options: ["dem", "den", "das"], answer: "dem", type: "Präposition (Dativ)" },
  { id: 41, q: "Ich spreche mit ___ Frau.", options: ["der", "die", "dem"], answer: "der", type: "Präposition (Dativ)" },
  { id: 42, q: "Wir fahren mit ___ Zug.", options: ["dem", "den", "der"], answer: "dem", type: "Präposition (Dativ)" },
  { id: 43, q: "Er geht zu ___ Arzt.", options: ["dem", "den", "das"], answer: "dem", type: "Präposition (Dativ)" },
  { id: 44, q: "Sie kommt aus ___ Türkei.", options: ["der", "die", "dem"], answer: "der", type: "Präposition (Dativ)" },
  { id: 45, q: "Er arbeitet bei ___ Polizei.", options: ["der", "die", "dem"], answer: "der", type: "Präposition (Dativ)" },

  { id: 46, q: "Das Geschenk ist für ___ Vater.", options: ["den", "dem", "der"], answer: "den", type: "Präposition (Akk)" },
  { id: 47, q: "Ich gehe ohne ___ Hund.", options: ["den", "dem", "der"], answer: "den", type: "Präposition (Akk)" },
  { id: 48, q: "Wir fahren durch ___ Tunnel.", options: ["den", "dem", "der"], answer: "den", type: "Präposition (Akk)" },
  { id: 49, q: "Er spielt gegen ___ Freund.", options: ["den", "dem", "des"], answer: "den", type: "Präposition (Akk)" },
  { id: 50, q: "Für ___ Geld arbeite ich.", options: ["das", "dem", "den"], answer: "das", type: "Präposition (Akk)" },

  { id: 51, q: "Ich bin in ___ Küche.", options: ["der", "die", "den"], answer: "der", type: "Wo? (Dativ)" },
  { id: 52, q: "Das Buch liegt auf ___ Tisch.", options: ["dem", "den", "des"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 53, q: "Wir sind in ___ Kino.", options: ["dem", "das", "den"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 54, q: "Er steht an ___ Bushaltestelle.", options: ["der", "die", "dem"], answer: "der", type: "Wo? (Dativ)" },
  { id: 55, q: "Die Lampe hängt an ___ Decke.", options: ["der", "die", "das"], answer: "der", type: "Wo? (Dativ)" },
  { id: 56, q: "Ich sitze auf ___ Stuhl.", options: ["dem", "den", "der"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 57, q: "Wir wohnen in ___ Stadt.", options: ["der", "die", "den"], answer: "der", type: "Wo? (Dativ)" },
  { id: 58, q: "Das Bild hängt an ___ Wand.", options: ["der", "die", "dem"], answer: "der", type: "Wo? (Dativ)" },
  { id: 59, q: "Er ist in ___ Schule.", options: ["der", "die", "den"], answer: "der", type: "Wo? (Dativ)" },
  { id: 60, q: "Das Auto steht vor ___ Haus.", options: ["dem", "das", "den"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 61, q: "Die Katze schläft unter ___ Bett.", options: ["dem", "das", "den"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 62, q: "Ich warte vor ___ Tür.", options: ["der", "die", "dem"], answer: "der", type: "Wo? (Dativ)" },
  { id: 63, q: "Er sitzt in ___ Sessel.", options: ["dem", "den", "der"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 64, q: "Wir spielen in ___ Park.", options: ["dem", "den", "der"], answer: "dem", type: "Wo? (Dativ)" },
  { id: 65, q: "Das Essen ist in ___ Kühlschrank.", options: ["dem", "den", "der"], answer: "dem", type: "Wo? (Dativ)" },

  { id: 66, q: "Ich gehe in ___ Küche.", options: ["die", "der", "den"], answer: "die", type: "Wohin? (Akk)" },
  { id: 67, q: "Er legt das Buch auf ___ Tisch.", options: ["den", "dem", "der"], answer: "den", type: "Wohin? (Akk)" },
  { id: 68, q: "Wir gehen in ___ Kino.", options: ["das", "dem", "den"], answer: "das", type: "Wohin? (Akk)" },
  { id: 69, q: "Sie fährt in ___ Stadt.", options: ["die", "der", "den"], answer: "die", type: "Wohin? (Akk)" },
  { id: 70, q: "Ich hänge das Bild an ___ Wand.", options: ["die", "der", "den"], answer: "die", type: "Wohin? (Akk)" },
  { id: 71, q: "Er setzt sich auf ___ Stuhl.", options: ["den", "dem", "das"], answer: "den", type: "Wohin? (Akk)" },
  { id: 72, q: "Wir gehen in ___ Park.", options: ["den", "dem", "der"], answer: "den", type: "Wohin? (Akk)" },
  { id: 73, q: "Die Katze läuft unter ___ Bett.", options: ["das", "dem", "den"], answer: "das", type: "Wohin? (Akk)" },
  { id: 74, q: "Ich stelle die Tasse auf ___ Tisch.", options: ["den", "dem", "der"], answer: "den", type: "Wohin? (Akk)" },
  { id: 75, q: "Er geht hinter ___ Haus.", options: ["das", "dem", "den"], answer: "das", type: "Wohin? (Akk)" },
  { id: 76, q: "Wir fahren an ___ Meer.", options: ["das", "dem", "den"], answer: "das", type: "Wohin? (Akk)" },
  { id: 77, q: "Sie geht in ___ Schule.", options: ["die", "der", "den"], answer: "die", type: "Wohin? (Akk)" },
  { id: 78, q: "Ich gehe auf ___ Straße.", options: ["die", "der", "den"], answer: "die", type: "Wohin? (Akk)" },
  { id: 79, q: "Er steigt in ___ Bus.", options: ["den", "dem", "der"], answer: "den", type: "Wohin? (Akk)" },
  { id: 80, q: "Wir laufen in ___ Wald.", options: ["den", "dem", "der"], answer: "den", type: "Wohin? (Akk)" },

  
  { id: 81, q: "Das ist das Auto ___ Vaters.", options: ["des", "dem", "den"], answer: "des", type: "Genitiv" },
  { id: 82, q: "Die Farbe ___ Blume ist rot.", options: ["der", "die", "dem"], answer: "der", type: "Genitiv" },
  { id: 83, q: "Wir helfen ___ Kindern (Plural).", options: ["den", "dem", "die"], answer: "den", type: "Dativ Plural" },
  { id: 84, q: "Ich sehe ___ Häuser (Plural).", options: ["die", "den", "der"], answer: "die", type: "Akkusativ Plural" },
  { id: 85, q: "Das sind ___ Freunde.", options: ["meine", "meinen", "meinem"], answer: "meine", type: "Pronomen" },
  { id: 86, q: "Ich gebe ___ (du) das Buch.", options: ["dir", "dich", "du"], answer: "dir", type: "Pronomen (Dativ)" },
  { id: 87, q: "Er liebt ___ (sie).", options: ["sie", "ihr", "ihnen"], answer: "sie", type: "Pronomen (Akk)" },
  { id: 88, q: "Das Geschenk ist für ___ (er).", options: ["ihn", "ihm", "er"], answer: "ihn", type: "Pronomen (Akk)" },
  { id: 89, q: "Ich gehe mit ___ (ihr).", options: ["ihr", "sie", "ihnen"], answer: "ihr", type: "Pronomen (Dativ)" },
  { id: 90, q: "Wir danken ___ (ihr, Plural).", options: ["euch", "ihr", "uns"], answer: "euch", type: "Pronomen (Dativ)" },

  { id: 91, q: "___ Mann arbeitet hier.", options: ["Dieser", "Diesen", "Diesem"], answer: "Dieser", type: "Nominativ" },
  { id: 92, q: "Ich kenne ___ Mann.", options: ["diesen", "diesem", "dieser"], answer: "diesen", type: "Akkusativ" },
  { id: 93, q: "Ich spreche mit ___ Mann.", options: ["diesem", "diesen", "dieser"], answer: "diesem", type: "Dativ" },
  { id: 94, q: "Welch___ Kleid kaufst du?", options: ["-es", "-en", "-em"], answer: "-es", type: "Adjektiv/Endung" },
  { id: 95, q: "Ich möchte ein___ Kaffee.", options: ["-en", "-em", "-es"], answer: "-en", type: "Akkusativ" },
  { id: 96, q: "Er trinkt kein___ Wasser.", options: ["-", "-en", "-em"], answer: "-", type: "Akkusativ (Neutral)" },
  { id: 97, q: "Wir haben kein___ Zeit.", options: ["-e", "-en", "-em"], answer: "-e", type: "Akkusativ (Feminin)" },
  { id: 98, q: "Ich fahre zu ___ Eltern.", options: ["meinen", "meine", "meiner"], answer: "meinen", type: "Dativ Plural" },
  { id: 99, q: "Das ist der Hund ___ Frau.", options: ["der", "die", "dem"], answer: "der", type: "Genitiv" },
  { id: 100, q: "Er sitzt zwischen ___ Stühlen.", options: ["den", "dem", "die"], answer: "den", type: "Dativ Plural" },
  { id: 101, q: "Ich warte auf ___ Bus.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (Warten auf)" },
  { id: 102, q: "Wir denken an ___ Urlaub.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (Denken an)" },
  { id: 103, q: "Er hat Angst vor ___ Hund.", options: ["dem", "den", "der"], answer: "dem", type: "Dativ (Angst vor)" },
  { id: 104, q: "Sie interessiert sich für ___ Sport.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ" },
  { id: 105, q: "Ich träume von ___ Reise.", options: ["einer", "eine", "einem"], answer: "einer", type: "Dativ (Von)" },
  { id: 106, q: "Das Heft liegt unter ___ Zeitung.", options: ["der", "die", "dem"], answer: "der", type: "Wo? (Dativ)" },
  { id: 107, q: "Er legt das Heft unter ___ Zeitung.", options: ["die", "der", "den"], answer: "die", type: "Wohin? (Akk)" },
  { id: 108, q: "Wir gehen über ___ Straße.", options: ["die", "der", "den"], answer: "die", type: "Akkusativ (Über)" },
  { id: 109, q: "Die Lampe hängt über ___ Tisch.", options: ["dem", "den", "die"], answer: "dem", type: "Dativ (Über)" },
  { id: 110, q: "Er schreibt mit ___ Kuli.", options: ["einem", "einen", "einer"], answer: "einem", type: "Dativ (Mit)" },
  { id: 111, q: "Ohne ___ Hilfe schaffe ich es nicht.", options: ["deine", "deiner", "deinen"], answer: "deine", type: "Akkusativ (Ohne)" },
  { id: 112, q: "Gegen ___ Baum gefahren.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ (Gegen)" },
  { id: 113, q: "Seit ___ Jahr wohne ich hier.", options: ["einem", "einen", "eines"], answer: "einem", type: "Dativ (Seit)" },
  { id: 114, q: "Außer ___ mir war niemand da.", options: ["mir", "mich", "ich"], answer: "mir", type: "Dativ (Außer)" },
  { id: 115, q: "___ (Wer) hast du gesehen?", options: ["Wen", "Wem", "Wer"], answer: "Wen", type: "Frage (Akk)" },
  { id: 116, q: "Mit ___ (Wer) sprichst du?", options: ["wem", "wen", "wer"], answer: "wem", type: "Frage (Dat)" },
  { id: 117, q: "___ gehört das Buch?", options: ["Wem", "Wen", "Wer"], answer: "Wem", type: "Frage (Dat)" },
  { id: 118, q: "___ Auto ist kaputt.", options: ["Mein", "Meinen", "Meinem"], answer: "Mein", type: "Nominativ" },
  { id: 119, q: "Ich repariere ___ Auto.", options: ["mein", "meinen", "meinem"], answer: "mein", type: "Akkusativ" },
  { id: 120, q: "Ich fahre mit ___ Auto.", options: ["meinem", "meinen", "mein"], answer: "meinem", type: "Dativ" },

  { id: 121, q: "Ich schenke ___ (die) Frau Blumen.", options: ["der", "die", "den"], answer: "der", type: "Dativ" },
  { id: 122, q: "Ich liebe ___ (die) Frau.", options: ["die", "der", "den"], answer: "die", type: "Akkusativ" },
  { id: 123, q: "Die Tasche gehört ___ (der) Lehrer.", options: ["dem", "den", "der"], answer: "dem", type: "Dativ" },
  { id: 124, q: "Ich frage ___ (der) Lehrer.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ" },
  { id: 125, q: "Das Kind spielt mit ___ Ball.", options: ["dem", "den", "der"], answer: "dem", type: "Dativ" },
  { id: 126, q: "Das Kind wirft ___ Ball.", options: ["den", "dem", "der"], answer: "den", type: "Akkusativ" },
  { id: 127, q: "Er ist ein guter Freund von ___.", options: ["mir", "mich", "ich"], answer: "mir", type: "Dativ" },
  { id: 128, q: "Für ___ ist das kein Problem.", options: ["mich", "mir", "ich"], answer: "mich", type: "Akkusativ" },
  { id: 129, q: "Wir treffen uns um 8 ___.", options: ["Uhr", "Stunde", "Zeit"], answer: "Uhr", type: "Vokabel" },
  { id: 130, q: "Ich warte seit einer ___.", options: ["Stunde", "Uhr", "Zeit"], answer: "Stunde", type: "Vokabel" },
  { id: 131, q: "Guten ___!", options: ["Tag", "Tage", "Tagen"], answer: "Tag", type: "Akkusativ" },
  { id: 132, q: "Gute ___!", options: ["Nacht", "Nachts", "Nächte"], answer: "Nacht", type: "Akkusativ" },
  { id: 133, q: "Ich esse gern ___.", options: ["Brot", "Brotes", "Brots"], answer: "Brot", type: "Akkusativ" },
  { id: 134, q: "Mit viel ___ Liebe.", options: ["-er", "-en", "-em"], answer: "-er", type: "Adjektiv (Dativ)" },
  { id: 135, q: "Ich trinke schwarz___ Tee.", options: ["-en", "-em", "-er"], answer: "-en", type: "Adjektiv (Akk)" },
  { id: 136, q: "In d___ Nacht.", options: ["-er", "-ie", "-en"], answer: "-er", type: "Dativ (Feminin)" },
  { id: 137, q: "Jeden Tag geh___ ich.", options: ["-e", "-st", "-t"], answer: "-e", type: "Verb (Ich)" },
  { id: 138, q: "Was mach___ du?", options: ["-st", "-t", "-e"], answer: "-st", type: "Verb (Du)" },
  { id: 139, q: "Er komm___ aus Spanien.", options: ["-t", "-st", "-en"], answer: "-t", type: "Verb (Er)" },
  { id: 140, q: "Wir lern___ Deutsch.", options: ["-en", "-t", "-st"], answer: "-en", type: "Verb (Wir)" },
  { id: 141, q: "Ihr seid sehr ___.", options: ["nett", "netten", "nettes"], answer: "nett", type: "Adjektiv" },
  { id: 142, q: "Das sind nett___ Leute.", options: ["-e", "-en", "-er"], answer: "-e", type: "Adjektiv (Plural)" },
  { id: 143, q: "Mit freundlich___ Grüßen.", options: ["-en", "-er", "-em"], answer: "-en", type: "Adjektiv (Dativ Plural)" },
  { id: 144, q: "Der Tisch ist aus ___ Holz.", options: ["-", "dem", "einem"], answer: "-", type: "Material" },
  { id: 145, q: "Ich trinke ein Glas ___ Wasser.", options: ["-", "von", "aus"], answer: "-", type: "Menge" },
  { id: 146, q: "Ein Kilo ___ Äpfel.", options: ["-", "von", "die"], answer: "-", type: "Menge" },
  { id: 147, q: "Ich habe keine Lust auf ___.", options: ["Kino", "dem Kino", "ins Kino"], answer: "Kino", type: "Ausdruck" },
  { id: 148, q: "Er hat Angst ___ Spinnen.", options: ["vor", "für", "gegen"], answer: "vor", type: "Präposition" },
  { id: 149, q: "Ich warte ___ den Bus.", options: ["auf", "für", "an"], answer: "auf", type: "Präposition" },
  { id: 150, q: "Wir sprechen ___ das Wetter.", options: ["über", "von", "um"], answer: "über", type: "Präposition" },


  { id: 151, q: "___ (Woher) kommt er?", options: ["Woher", "Wohin", "Wo"], answer: "Woher", type: "Frage" },
  { id: 152, q: "___ (Vart) fliegst du?", options: ["Wohin", "Wo", "Woher"], answer: "Wohin", type: "Frage" },
  { id: 153, q: "___ (Var) wohnen sie?", options: ["Wo", "Wohin", "Wer"], answer: "Wo", type: "Frage" },
  { id: 154, q: "Das ist ___ (min) Bruder.", options: ["mein", "meine", "meinen"], answer: "mein", type: "Nom (M)" },
  { id: 155, q: "Ich sehe ___ (min) Bruder.", options: ["meinen", "mein", "meinem"], answer: "meinen", type: "Akk (M)" },
  { id: 156, q: "Das ist ___ (min) Schwester.", options: ["meine", "mein", "meiner"], answer: "meine", type: "Nom (F)" },
  { id: 157, q: "Ich helfe ___ (min) Schwester.", options: ["meiner", "meine", "meinen"], answer: "meiner", type: "Dat (F)" },
  { id: 158, q: "Das ist ___ (mitt) Haus.", options: ["mein", "meine", "meinen"], answer: "mein", type: "Nom (N)" },
  { id: 159, q: "Wir gehen in ___ (mitt) Haus.", options: ["mein", "meinem", "meinen"], answer: "mein", type: "Akk (N)" },
  { id: 160, q: "Er spielt mit ___ (sitt) Kind.", options: ["seinem", "seinen", "sein"], answer: "seinem", type: "Dat (N)" },
  { id: 161, q: "Sie sucht ___ (sin) Tasche.", options: ["ihre", "ihr", "ihren"], answer: "ihre", type: "Akk (F)" },
  { id: 162, q: "Wir besuchen ___ (våra) Eltern.", options: ["unsere", "unser", "unseren"], answer: "unsere", type: "Akk (Plural)" },
  { id: 163, q: "Habt ihr ___ (er) Haus verkauft?", options: ["euer", "eure", "euren"], answer: "euer", type: "Akk (N)" },
  { id: 164, q: "Ich finde ___  Schlüssel nicht.", options: ["den", "der", "dem"], answer: "den", type: "Akk (M)" },
  { id: 165, q: "Er gibt ___ Frauen Hand.", options: ["den", "die", "der"], answer: "den", type: "Dat (Plural)" },
  { id: 166, q: "Der Apfel fällt von ___ Baum.", options: ["dem", "den", "der"], answer: "dem", type: "Dat (M)" },
  { id: 167, q: "Die Katze sitzt auf ___ Dach.", options: ["dem", "den", "der"], answer: "dem", type: "Dat (N)" },
  { id: 168, q: "Er klettert auf ___ Dach.", options: ["das", "dem", "den"], answer: "das", type: "Akk (N)" },
  { id: 169, q: "Ich schwimme in ___ See (m).", options: ["dem", "den", "der"], answer: "dem", type: "Dat (M)" },
  { id: 170, q: "Ich springe in ___ See (m).", options: ["den", "dem", "der"], answer: "den", type: "Akk (M)" },
  { id: 171, q: "Das Bild hängt an ___ Wand.", options: ["der", "die", "den"], answer: "der", type: "Dat (F)" },
  { id: 172, q: "Ich hänge das Bild an ___ Wand.", options: ["die", "der", "den"], answer: "die", type: "Akk (F)" },
  { id: 173, q: "Der Stift liegt neben ___ Buch.", options: ["dem", "das", "den"], answer: "dem", type: "Dat (N)" },
  { id: 174, q: "Ich lege den Stift neben ___ Buch.", options: ["das", "dem", "den"], answer: "das", type: "Akk (N)" },
  { id: 175, q: "Er steht zwischen ___ Stühlen.", options: ["den", "dem", "die"], answer: "den", type: "Dat Plural" },
  { id: 176, q: "Er stellt sich zwischen ___ Stühle.", options: ["die", "den", "der"], answer: "die", type: "Akk Plural" },
  { id: 177, q: "Der Vogel fliegt über ___ Haus.", options: ["das", "dem", "den"], answer: "das", type: "Akk (N)" },
  { id: 178, q: "Die Wolke ist über ___ Haus.", options: ["dem", "das", "den"], answer: "dem", type: "Dat (N)" },
  { id: 179, q: "Ich gehe heute ___ Hause.", options: ["nach", "zu", "in"], answer: "nach", type: "Ausdruck" },
  { id: 180, q: "Ich bin heute ___ Hause.", options: ["zu", "nach", "in"], answer: "zu", type: "Ausdruck" },
  { id: 181, q: "Am Montag ___ ich frei.", options: ["habe", "bin", "sein"], answer: "habe", type: "Verb" },
  { id: 182, q: "Im Sommer ___ es warm.", options: ["ist", "hat", "wird"], answer: "ist", type: "Verb" },
  { id: 183, q: "Es ___ (regna).", options: ["regnet", "regnen", "regnest"], answer: "regnet", type: "Verb" },
  { id: 184, q: "Es ___ (snöa).", options: ["schneit", "schneien", "schneist"], answer: "schneit", type: "Verb" },
  { id: 185, q: "Ich ___ (måste) gehen.", options: ["muss", "müsse", "müsst"], answer: "muss", type: "Modalverb" },
  { id: 186, q: "Du ___ (kan) das schaffen.", options: ["kannst", "können", "könnt"], answer: "kannst", type: "Modalverb" },
  { id: 187, q: "Wir ___ (vill) essen.", options: ["wollen", "willen", "willst"], answer: "wollen", type: "Modalverb" },
  { id: 188, q: "Er ___ (ska/bör) schlafen.", options: ["soll", "sollt", "sollen"], answer: "soll", type: "Modalverb" },
  { id: 189, q: "Ihr ___ (får) hier nicht rauchen.", options: ["dürft", "darft", "dürfen"], answer: "dürft", type: "Modalverb" },
  { id: 190, q: "Ich ___ (gillar) Pizza.", options: ["mag", "möge", "magen"], answer: "mag", type: "Verb" },
  { id: 191, q: "Ich ___ (skulle vilja) einen Kaffee.", options: ["möchte", "mag", "will"], answer: "möchte", type: "Verb" },
  { id: 192, q: "Er ___ (känner) mich nicht.", options: ["kennt", "weißt", "kann"], answer: "kennt", type: "Verb" },
  { id: 193, q: "Ich ___ (vet) das nicht.", options: ["weiß", "kenne", "wisse"], answer: "weiß", type: "Verb" },
  { id: 194, q: "Der Mann, ___ (som) dort steht.", options: ["der", "den", "dem"], answer: "der", type: "Relativ" },
  { id: 195, q: "Die Frau, ___ (som) ich sehe.", options: ["die", "der", "den"], answer: "die", type: "Relativ" },
  { id: 196, q: "Das Kind, ___ (som) spielt.", options: ["das", "die", "der"], answer: "das", type: "Relativ" },
  { id: 197, q: "Die Kinder, ___ (som) spielen.", options: ["die", "den", "der"], answer: "die", type: "Relativ" },
  { id: 198, q: "Ich freue mich ___ dich.", options: ["auf", "an", "bei"], answer: "auf", type: "Präp (Freuen)" },
  { id: 199, q: "Ich danke dir ___ das Geschenk.", options: ["für", "um", "über"], answer: "für", type: "Präp (Danken)" },
  { id: 200, q: "Herzlichen Glückwunsch ___ Geburtstag!", options: ["zum", "am", "im"], answer: "zum", type: "Ausdruck" }
];

app.get("/random-preterite", (req, res) => {
  if (perfektVerbs.length === 0) {
    return res.json({ id: 0, q: "Inga verb uppladdade." });
  }
  
  const random = perfektVerbs[Math.floor(Math.random() * perfektVerbs.length)];
  
  // q är det som visas i appen
  res.json({
    id: random.id,
    q: random.infinitiv  // t.ex. "essen"
  });
});
app.post("/check-preterite", (req, res) => {
  const { id, userForm } = req.body;
  const entry = perfektVerbs.find(v => v.id === id);

  if (!entry) {
    return res.status(400).json({ correct: false, correctForm: "Error: fel id" });
  }

  const u = norm(userForm);
  const c = norm(entry.partizip);   // t.ex. "gegessen"

  const distance = getEditDistance(u, c);

  let correct = false;
  let status = "wrong";
  if (distance === 0) {
    correct = true;
    status = "correct";
  } else if (distance <= 2) {
    status = "close";
  }

  res.json({
    correct,
    status,
    correctForm: entry.partizip
  });
});

function getEditDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const norm = (str) => str.toLowerCase().trim().replace(/[.!?]/g, "");


function getAvailableItems(allItems, category) {

  const available = allItems.filter(item => {
    const lastTime = history[category][item.id || item.sv]; 
    if (!lastTime) return true;
    return (Date.now() - lastTime) > COOLDOWN_TIME; 
  });

 
  if (available.length === 0) return allItems;
  
  return available;
}


app.get("/random-sentence", (req, res) => {
  const level = req.query.level || "A2";
  const list = sentences.filter((s) => s.level === level);
  

  const pool = getAvailableItems(list, 'sentences');

  if (pool.length === 0) return res.json({ id: 0, sv: "Inga meningar hittades" });

  const random = pool[Math.floor(Math.random() * pool.length)];
  res.json({ id: random.id, sv: random.sv });
});

app.post("/check-translation", (req, res) => {
  const { id, userDe } = req.body;
  const s = sentences.find((x) => x.id === id);
  
  if (!s) return res.status(400).json({ error: "Fel ID" });

  const u = norm(userDe);
  const c = norm(s.de);
  const distance = getEditDistance(u, c);

  let status = "wrong";
  let correct = false;

  if (distance === 0) {
    status = "correct";
    correct = true;
  } else if (distance <= 3) { 
    status = "close";
    correct = false; 
  }

 
  if (correct) {
    history.sentences[id] = Date.now();
  }

  res.json({ status, correct, correctDe: s.de });
});


app.get("/random-article", (req, res) => {
  const nouns = words.filter(w => 
    w.de.toLowerCase().startsWith("der ") || 
    w.de.toLowerCase().startsWith("die ") || 
    w.de.toLowerCase().startsWith("das ")
  );

  const pool = getAvailableItems(nouns, 'articles');

  if (pool.length === 0) return res.status(404).json({ id: "error", noun: "Inga ord laddade", sv: "Serverfel" });

  const random = pool[Math.floor(Math.random() * pool.length)];
  const parts = random.de.split(" "); 
  const article = parts[0]; 
  const noun = parts.slice(1).join(" "); 

  res.json({
    id: random.sv, 
    article: article,
    noun: noun,
    sv: random.sv
  });
});

app.post("/check-article", (req, res) => {
  const { id, userArticle } = req.body; 
  const match = words.find(w => w.sv === id);

  if (!match) return res.json({ correct: false, full: "Error: Ord saknas" });

  const correctArticle = match.de.split(" ")[0].toLowerCase(); 
  const correct = userArticle.toLowerCase() === correctArticle;


  if (correct) {
    history.articles[id] = Date.now();
  }

  res.json({
    correct,
    correctArticle, 
    full: match.de 
  });
});

app.get("/random-word", (req, res) => {

   const pool = getAvailableItems(words, 'words');
   
   if (pool.length === 0) return res.json({ sv: "Inga ord", id: "error" });
   
   const random = pool[Math.floor(Math.random() * pool.length)];
   res.json({ sv: random.sv, id: random.sv });
});

app.post("/check-word", (req, res) => {
  const { userDe, svWord } = req.body;
  const match = words.find(w => w.sv === svWord);
  
  if (!match) return res.json({ status: "wrong", correctDe: "Error" });

  const u = norm(userDe);
  const c = norm(match.de);
  const distance = getEditDistance(u, c);

  let status = "wrong";
  let correct = false;

  if (distance === 0) {
    status = "correct";
    correct = true;
  } else if (distance <= 2) {
    status = "close";
    correct = false;
  }

  if (correct) {
    history.words[svWord] = Date.now();
  }

  res.json({ status, correct, correctDe: match.de });
});



let availableGrammarIds = []; 
app.get("/random-grammar", (req, res) => {
  if (grammarQuestions.length === 0) return res.json({ q: "Inga frågor", options: [], answer: "" });

  if (availableGrammarIds.length === 0) {
    availableGrammarIds = grammarQuestions.map(q => q.id);
    console.log("Blandar om grammatik-kortleken!");
  }

  const randomIndex = Math.floor(Math.random() * availableGrammarIds.length);
  const selectedId = availableGrammarIds[randomIndex];

  
  availableGrammarIds.splice(randomIndex, 1);

 
  const question = grammarQuestions.find(q => q.id === selectedId);

  res.json(question);
});



app.listen(3000, () => console.log("Server running on http://localhost:3000"));