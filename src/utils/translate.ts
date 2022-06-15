import { session } from "$app/stores"
import { get } from "svelte/store"

const translations = {
    "NL": {
        // Navbar
        "Home": "Home",
        "Create Set": "Nieuwe Set",
        "Import Set": "Importeren",

        // /help/quizlet-import
        "How to import a set from Quizlet": "Een set van Quizlet importeren",
        "Open the quizlet set that you would like to import, and make sure you're logged in.": "Open de Quizlet set die je wilt importeren, en zorg ervoor dat je ingelogd bednt.",
        "Click the export button and copy the text": "Klik op de export knop en kopiëer de tekst",
        "Click the more options button": "Klik op de knop met drie stippen",
        "Click the export button": "Klik op de export knop",
        "Click the copy text button": "Klik op de copy text knop",
        "Paste the text into the box at this page:": "Plak de tekst in het veld op deze pagina:",
        "Paste the text into the box": "Plak de tekst in het tekstveld",

        // /import/quizlet
        "Import a set from Quizlet": "Een set van Quizlet importeren",
        "Go to the set you want to import from quizlet, press the export button and then paste the output here.": "Ga naar de set die je wilt importeren van Quizlet, klik op de exporteer knop en plak hier de tekst die je krijgt.",
        "Learn more": "Meer informatie",
        "Learn More": "Meer Informatie",
        "My awesome set": "Mijn epische set",
        "Name": "Naam",
        "Title": "Titel",
        "Import Data": "Import Data",
        "Import": "Importeren",

        // /study
        "Everything learned!": "Alles geleerd!",
        "Study": "Leren",
        "Your progress": "Voortgang",
        "Correct": "Juist",
        "The correct definition was": "De juiste definitie was:",
        "Override: I was correct": "Goed rekenen: ik heb hem wel goed",
        "Press space to continue": "Druk op spatie om door te gaan",
        "Definition": "Definitie",
        "Wrong": "Onjuist",

        // /create-set
        "Failed to upload set": "Kon de set niet uploaden",
        "Set title": "Set titel",
        "Term": "Term",
        "Add word": "Woord toevoegen",
        "Upload set": "Set uploaden",
        "Please remove the duplicates (marked in yellow)": "Deze zet heeft dubbele termen, haal ze weg voor dat je de set opslaat. Ze staan in het geel gemarkeerd."

    }
}

export default function translate( eng_string: string): string {
    // Get current language
    let target_lang = get(session).lang
    if (!target_lang) {
        target_lang = "EN"
    }

    // Get translation from english to target language
    const dictionary = translations[target_lang];
    if (!dictionary) return eng_string;

    const translated = dictionary[eng_string];

    // Fall back to english if translation doesn't exist
    if (!translated) {
        console.warn("No translation for: " + eng_string)
        return eng_string
    }
    return translated
}