<script lang="ts">
    import Input from "@components/input.svelte"
    import Button from "@components/button.svelte"
    import throwError from "@utils/throwError"
    import { goto } from "$app/navigation"

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
                throw new Error("Failed to upload set")
            }
        })
        .catch(err => {
            console.error(err)
            throwError(err.toString())            
        })


    }
</script>
<div class="main-form">
    <h1>Create Set</h1>
    <br />
    <Input type="text" bind:value={name} label="Set name" />
    <br/>
    <div class="words-container">
        {#each words as word, i}
            <div class="word-container">
                <Input 
                    type="text"
                    label="Term"
                    bind:value={word.term}
                />
                <div class="space-between-inputs"></div>
                <Input 
                    type="text"
                    label="Definition"
                    bind:value={word.definition}
                    on:tabforward={handleBlur.bind(this, i)}
                />
            </div>
            <br/>
        {/each}
        <br/>
        <Button label="Add Word" on:click={addWord} />
    </div>
    <br/><br/>
    <Button label="Upload Set" on:click={submit} />
</div>

<style>
    .space-between-inputs {
        width: 10rem;
    }
    .main-form {
        display: flex;
        flex-direction: column;    
        width: 50vw;
        margin: 0 auto;
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
    }

    @media only screen and (max-width: 1150px) {
        .main-form {
            width: 90vw;
        }
    }
</style>