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
        this.score = 1.1
    }

    public correct_mpc(): void {
        this.score += 0.5
        this.has_done_mpc = true
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
        this.words_history = []

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

    private spaceToWord(word_input: Word): number {
        for (let i = this.words_history.length-1; i >= 0; i--) {
            if (word_input.term == this.words_history[i].term) {
                return this.words_history.length-1 - i
            }

        }
        return 10000
    }

    public selectWord(): Word {
        // Select random word from this.words_learning
        const words_learning = this.words_learning

        const min_space_between_words = Math.min(3, words_learning.length-1) 
        const filtered_words = words_learning.filter(word => {
            return this.spaceToWord(word) >= min_space_between_words
        })
        const random_idx = Math.floor(Math.random() * filtered_words.length)

        const selected_word = filtered_words[random_idx]

        this.words_history.push(selected_word)

        console.log("Selected word",filtered_words)

        return selected_word

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

    public getMpcWords(correct_word: Word): Word[] {
        // Return 4 random words that haven't been learned
        let wordpool = [...this.getUnlearned()];

        if (wordpool.length < 4) {
            wordpool = [...this.words];
        }

        // Remove correct word from the pool
        let correct_word_idx = wordpool.findIndex(word => word == correct_word)
        if (correct_word_idx != -1) {
            wordpool.splice(correct_word_idx, 1)
        }

        let options: Word[] = []
        let option_count = wordpool.length < 4 ? wordpool.length : 4
        for (let i = 0; i < (option_count-1); i++) {
            // Choose random word and remove it from the pool
            let random_idx = Math.floor(Math.random() * (option_count-i));
            let chosen_word = wordpool[random_idx]
            wordpool.splice(random_idx, 1);
            options.push(chosen_word)
        }

        options.push(correct_word)
        // Shuffle the options
        options.sort(() => Math.random()-0.5)

        return options
    }

    public getPercentage(): number {
        const fully_learned = this.getLearned().length / this.words.length * 100;
        const mpc_done = this.words.filter(word => word.has_done_mpc).length / this.words.length * 100;
        return (fully_learned + mpc_done) / 2
    }
}

export { WordCollection, Word }