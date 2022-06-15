<script lang="ts">
    import Input from "@components/input.svelte"
    import Button from "@components/button.svelte"
    import throwError from "@utils/throwError"
    import { goto } from "$app/navigation"
    import translate from "@utils/translate"

    let name = ""

    interface Word {
        term: string,
        definition: string
    }

    class Word implements Word {
        constructor(term: string, definition: string) {
            this.term = term
            this.definition = definition
        }
    }

    let words: Word[] = [
        new Word("", ""),
        new Word("", ""),
        new Word("", ""),
    ]

    const addWord = () => {
        words.push(new Word("", ""))
        words = words
    }

    const handleBlur = (i: number) => {
        if (words.length-1 == i) {
            addWord()
        }
    }

    const submit = () => {
        fetch("/api/create_set", {
            method: "POST",
            body: JSON.stringify({
                name,
                words
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
    {#each words as word, i}
        <div class="word-container">
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
</style>