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
    import { WordCollection, Word } from "@utils/words";
    import Input from "@components/input.svelte";
    import Button from "@components/button.svelte";
    import { tick } from "svelte";
    import { browser } from "$app/env";
    import MpcWidget from "@components/mpc.svelte";
    import translate from "@utils/translate"

    export let set: Set;

    const performanceNow = (): number => {
        if (browser) return performance.now()
        // We don't need any time tracking on the server side (in this component, that is)
        return 0
    }

    let words: WordCollection = new WordCollection(set);
    let currentWord: Word = words.selectWord();
    $: currentTerm = currentWord.term
    $: currentDef = currentWord.definition

    let learnedPercent = 0;
    $: learnedPercentRounded = Math.round(learnedPercent)
    let userInput = ""
    let feedbackScreen = false
    let feedbackSince = performanceNow() || 0
    let isCorrect = false
    let mpcOptions: Word[] | null = words.getMpcWords(currentWord);

    let defInput: HTMLInputElement | null = null

    const onSubmit = () => {
        isCorrect = userInput.trim() === currentDef.trim()
        showFeedback()
    }

    const showFeedback = () => {
        feedbackScreen = true
        feedbackSince = performanceNow()
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
        currentWord = words.selectWord()

        if (!currentWord) return

        mpcOptions = null
        if (!currentWord.has_done_mpc) {
            mpcOptions = words.getMpcWords(currentWord)
        }

        userInput = ""
        learnedPercent = words.getPercentage()


        if (learnedPercent === 100) {
            alert(translate("Everything learned!"))
        }

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
        const timeIntermediate = performanceNow() - feedbackSince
        if ((e.key === " " || e.key === "Enter") && feedbackScreen && timeIntermediate > 10) next()
    }
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<h1>{translate("Study")}</h1>
<p>{translate("Your progress:")} {learnedPercentRounded}%</p>
<h2>{currentTerm}</h2>
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
        <p class="correct">{translate("Correct")}</p> 
    {:else}
        <p class="wrong">{translate("Wrong")}</p>
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
