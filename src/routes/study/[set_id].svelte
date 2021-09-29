<script context="module" lang="ts">
    import type { LoadInput } from "@sveltejs/kit";
    import type { Set } from "@utils/dbReturnTypes";

    export async function load(request: LoadInput) {
        const set = (await (await request.fetch(`/api/set/${request.page.params.set_id}`)).json()).set as Set

        return {
            props: {set}
        }
    }
</script>

<script lang="ts">
    import { WordCollection, Word } from "@utils/words";
    import Input from "@components/input.svelte";
    import Button from "@components/button.svelte"
    import { tick } from "svelte";
    import { browser } from "$app/env"; browser

    export let set: Set;

    const performanceNow = (): number => {
        if (browser) return performance.now()
        return 0
    }

    let words: WordCollection = new WordCollection(set);
    let currentWord: Word = words.selectWord();
    $: currentTerm = currentWord.term
    $: currentDef = currentWord.definition

    let learnedPercent = 0;
    $: learnedPercentRounded = Math.round(learnedPercent)
    let userInput = ""
    let intermediateScreen = false
    let intermediateSince = performanceNow() || 0
    let isCorrect = false

    let defInput: HTMLInputElement | null = null

    const onSubmit = () => {
        isCorrect = userInput.trim() === currentDef.trim()
        intermediateScreen = true
        intermediateSince = performanceNow()
    }

    const next = () => {
        intermediateScreen = false
        if (isCorrect) {
            currentWord.correct_spell()
        } else {
            currentWord.incorrect()
        }

        words.update()
        currentWord = words.selectWord()
        userInput = ""
        learnedPercent = words.getPercentage()

        if (learnedPercent === 100) {
            alert("Everything learned!")
        }

        // Wait for defInput to be defined and then focus it
        tick().then(() => defInput.focus())
    }

    const override = () => {
        isCorrect = true
        next()
    }


    const handleWindowKeydown = (e: KeyboardEvent) => {
        // If press space, continue with next word
        const timeIntermediate = performanceNow() - intermediateSince
        console.log(timeIntermediate)
        if ((e.key === " " || e.key === "Enter") && intermediateScreen && timeIntermediate > 10) next()
    }
</script>

<svelte:window on:keydown={handleWindowKeydown} />
<h1>Study</h1>
<p>You've studied: {learnedPercentRounded}%</p>
{#if !intermediateScreen}
    <h2>{currentTerm}</h2>
    <Input on:submit={onSubmit} type="text" label="Definition" bind:value={userInput} bind:element={defInput} />
{:else}
    {#if isCorrect}
        <p class="correct">Correct</p> 
    {:else}
        <p class="wrong">Wrong</p>
        The correct definition was: <span class="correction">{currentDef}</span>
        <br/>
        You said: {userInput}
        <br/>
        <Button label="Override: I was correct" on:click={override}/>
    {/if}
    <p>Press space to continue</p>
{/if}

<style>
    .correct {
        color: #2dbf2d;
    }

    .wrong {
        color: #ff2828;
    }
    
    .correction {
        color: #9163ff;
    }
</style>
