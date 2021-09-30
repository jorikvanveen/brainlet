<script lang="ts">
    import Input from "@components/input.svelte"
    import Button from "@components/button.svelte"
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
        fetch("/api/submit", {
            method: "POST",
            body: JSON.stringify({
                name,
                words
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
</script>

<div class="main-form">
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
                <Input 
                    type="text"
                    label="Definition"
                    bind:value={word.definition}
                    on:tabout={handleBlur.bind(this, i)}
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
</style>