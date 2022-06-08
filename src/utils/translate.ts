const translations = {
    "NL": {

    }
}

export default function translate(eng_string: string): string {
    // Get current language
    let target_lang = localStorage.getItem("lang")
    if (!target_lang) {
        target_lang = "EN"
    }

    // Get translation from english to target language

    // Fall back to english if translation doesn't exist
    return eng_string
}