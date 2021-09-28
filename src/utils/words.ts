import type { Set } from "@utils/dbReturnTypes"

class Word {
    term: string
    definition: string
    has_done_mpc: boolean
    private _score: number

    constructor(term: string, definition: string) {
        this.term = term
        this.definition = definition
        this.has_done_mpc = false
        this._score = 0
    }

    get score(): number {
        return this._score
    }

    set score(newScore: number) {
        this._score = Math.max(-6, newScore)
    }

    get learned(): boolean {
        return this.score >= 1
    }

    public correct_spell(): void {
        this.score += 1.1
    }

    public correct_mpc(): void {
        this.score += 0.5
    }

    public incorrect(): void {
        this.score -= 0.6
    }
}

class WordCollection {
    words: Word[]
    words_learning: Word[]
    words_history: Word[]

    constructor(set: Set) {
        this.words = []
        this.words_learning = []

        for (const wordData of set.words) {
            this.words.push(new Word(wordData.term, wordData.definition))
        }

        // Shuffle the array
        this.words = this.words.sort(() => Math.random() - 0.5)

        // Pick 10 first words as words_learning
        for (let i = 0; i < 10; i++) {
            const selectedWord = this.words[i];
            if (selectedWord) this.words_learning.push(this.words[i]);
        }
    }

    private getUnlearned(): Word[] {
        return this.words.filter(word => !word.learned)
    }

    private getLearned(): Word[] {
        return this.words.filter(word => word.learned)
    }

    public selectWord(): Word {
        // Select random word from this.words_learning
        const words_learning = this.words_learning
        const random_idx = Math.floor(Math.random() * words_learning.length)
        return words_learning[random_idx]
    }

    public update(): void {
        // Remove learned words
        this.words_learning = this.words_learning.filter(word => !word.learned)

        // Add new words to learn
        const unlearnedWords = this.getUnlearned()
        const words_learning_target_length = Math.min(10, unlearnedWords.length)
        const num_of_words_to_add = words_learning_target_length - this.words_learning.length

        for (let i = 0; i < num_of_words_to_add; i++) {
            this.words_learning.push(unlearnedWords[i])
        }
    }

    public getPercentage(): number {
        return this.getLearned().length / this.words.length * 100
    }
}

export { WordCollection, Word }