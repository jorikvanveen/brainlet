<script lang="ts">
    import Input from "@components/input.svelte"
    import Button from "@components/button.svelte"
    import throwError from "@utils/throwError"
    import { goto } from "$app/navigation"
    import translate from "@utils/translate"
    import { Word, WordCollection } from "@utils/words"
    
    class WipWord extends Word {
        duplicate: boolean
        constructor(term: string, definition: string) {
            super(term, definition)
            this.duplicate = false
        }
    }

    class WipWordCollection extends WordCollection {
        constructor(words: WipWord[]) {
            super(words, false)
        }

        getWordsFromTerm(term: string): Word[] {
            return this.words.filter(word => word.term === term)
        }

        findDuplicateTerms() {
            const terms = this.words.map(word => word.term)
            const duplicates = terms.filter((term, i) => terms.indexOf(term) != i)

            // Clear old duplicates
            this.words.forEach(word => (word as WipWord).duplicate = false)

            // Mark duplicates as duplicate
            duplicates.forEach(term => this.getWordsFromTerm(term).forEach(word => {
                (word as WipWord).duplicate = true
            }))
            
            return duplicates
        }
    }

    let name = ""

    let words_array: WipWord[] = [
        new WipWord("", ""),
        new WipWord("", ""),
        new WipWord("", ""),
    ]

    $: words_collection = new WipWordCollection(words_array)
    $: duplicates = words_collection.findDuplicateTerms()

    const addWord = () => {
        words_array.push(new WipWord("",""))
        words_array = words_array
    }

    const handleBlur = (i: number) => {
        if (words_array.length-1 == i) {
            addWord()
        }
    }

    const submit = () => {
        // Validate
        if (duplicates) {
            alert(translate("Please remove the duplicates (marked in yellow)"))
            return
        }

        fetch("/api/create_set", {
            method: "POST",
            body: JSON.stringify({
                name,
                words_array
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.writeId && typeof response.writeId == "string") {
                goto("/study/" + response.writeId)
            } else {
                throw new Error(translate("Failed to upload set"))
            }
        })
        .catch(err => {
            console.error(err)
            throwError(err.toString())            
        })
    }
</script>

<h1>{translate("Create Set")}</h1>
<br />
<Input type="text" bind:value={name} label={translate("Set title")} />
<br/>
<div class="words-container">
    {#each words_array as word, i}
        <div class={word.duplicate && word.term != "" ? "word-container yellow-border" : "word-container"}>
            <div class="input-container">
                <Input 
                    type="text"
                    label={translate("Term")}
                    bind:value={word.term}
                />
            </div>
            <div class="space-between-inputs"></div>
            <div class="input-container">
                <Input 
                    type="text"
                    label={translate("Definition")}
                    bind:value={word.definition}
                    on:tabforward={handleBlur.bind(this, i)}
                />
            </div>
        </div>
        <br/>
    {/each}
    <br/>
    <Button label={translate("Add word")} on:click={addWord} />
    <br/><br/><br/>
    <Button label={translate("Upload set")} on:click={submit} />
</div>
<br/><br/>

<style lang="scss">
    .space-between-inputs {
        width: 5%;
    }

    .words-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .word-container {
        display: flex;
        flex-direction: row;
        width: 100%;

        .input-container {
            width: 47.5%;
        }
    }

    .yellow-border {
        border: solid 2px yellow;
        border-radius: 5px;
    }
</style>