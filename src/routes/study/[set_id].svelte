<script context="module" lang="ts">
    import type { LoadEvent } from "@sveltejs/kit";
    import type { Set } from "@utils/dbReturnTypes";

    export async function load(event: LoadEvent) {
        const set = (await (await event.fetch(`/api/set/${event.params.set_id}`)).json()).set as Set

        return {
            props: {set}
        }
    }
</script>

<script lang="ts">
    import { WordCollection, Word, wordMatchFunction } from "@utils/words";
    import Input from "@components/input.svelte";
    import Button from "@components/button.svelte";
    import { tick } from "svelte";
    import MpcWidget from "@components/mpc.svelte";
    import translate from "@utils/translate"

    export let set: Set;



    let words: WordCollection = new WordCollection(set.words.map(w => new Word(w.term, w.definition)), false);
    let currentWord: Word = words.selectWord();
    $: currentTerm = currentWord.term
    $: currentDef = currentWord.definition

    let learnedPercent = 0;
    $: learnedPercentRounded = Math.round(learnedPercent)
    let userInput = ""
    let feedbackScreen = false
    let isCorrect = false
    let mpcOptions: Word[] | null = words.getMpcWords(currentWord);

    let defInput: HTMLInputElement | null = null

    const onSubmit = () => {
        isCorrect = wordMatchFunction(currentWord, userInput)
        // isCorrect = userInput.trim() === currentDef.trim()
        showFeedback()
    }

    const showFeedback = () => {
        feedbackScreen = true
    }

    const next = () => {
        feedbackScreen = false
        if (isCorrect) {
            if (!currentWord.has_done_mpc) {
                currentWord.correct_mpc()
            } else {
                currentWord.correct_spell()
            }
        } else {
            currentWord.incorrect()
        }

        words.update()
        learnedPercent = words.getPercentage()
        if (learnedPercent === 100) {
            alert("Everything learned!")
            return
        }

        currentWord = words.selectWord()

        if (!currentWord) return

        mpcOptions = null
        if (!currentWord.has_done_mpc) {
            mpcOptions = words.getMpcWords(currentWord)
        }

        userInput = ""

        // Wait for defInput to be defined and then focus it
        if (mpcOptions === null) {
            tick().then(() => defInput.focus())
        }
    }

    const override = () => {
        isCorrect = true
        next()
    }

    const optionSelected = (e: CustomEvent) => {
        const option_idx = e.detail as number;
        const selected_option = mpcOptions[option_idx]

        if (selected_option == currentWord) {
            // Correct
            isCorrect = true
        } else {
            // Incorrect
            isCorrect = false
        }

        userInput = selected_option.definition

        showFeedback()
    }


    const handleWindowKeydown = (e: KeyboardEvent) => {
        // If press space, continue with next word
        // if ((e.key === " " || e.key === "Enter") && feedbackScreen && timeIntermediate > 10) next()
        if ((e.key === " " || e.key === "Enter") && feedbackScreen) next()
    }
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<p id="progress-indicator">{translate("Your progress")}: <b>{learnedPercentRounded}</b>%</p>
<h1 id="prompt">{currentTerm}</h1>
{#if !feedbackScreen}
    {#if currentWord.has_done_mpc}
        <Input on:submit={onSubmit} type="text" label={translate("Definition")} bind:value={userInput} bind:element={defInput} />
    {:else}
        <MpcWidget options={mpcOptions.map(word => word.definition)} on:option_select={optionSelected} />
    {/if}
{:else}
    <p class="input-feedback">
        {userInput}
    </p>
    {#if isCorrect}
        <p class="feedback-text correct">{translate("Correct")}</p> 
    {:else}
        <p class="feedback-text wrong">{translate("Wrong")}</p>
        {translate("The correct definition was")}: <span class="correction">{currentDef}</span>
        <br/>
        <Button label={translate("Override: I was correct")} on:click={override}/>
    {/if}
    <br/>
    <br/>
    <p class="press-space-tip">{translate("Press space to continue")}</p>
{/if}

<style>
    .correct {
        color: #2dbf2d;
    }

    .press-space-tip {
        color: var(--text-alt);
        font-size: small;
        font-style: italic;
    }
    .wrong {
        color: #ff2828;
    }
    
    .correction {
        color: #9163ff;
    }

    .input-feedback {
        background-color: var(--bg-alt);
        padding: 5px;
    }
</style>