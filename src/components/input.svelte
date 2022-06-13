<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let type: "text" | "number" | "password" | "textarea";
    export let label = "";
    export let value: string | number;
    export let element: HTMLInputElement | HTMLTextAreaElement | null = null;
    export let placeholder: string | null = null;

    const randomId = Math.floor(Math.random() * 1000000000).toString()
    const dispatch = createEventDispatcher()

    // Sorry for this type signature....
    const handleInput = (e: Event & { currentTarget: EventTarget & (HTMLInputElement | HTMLTextAreaElement); }) => {
        value = e.currentTarget.value
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Tab") {
            dispatch(e.getModifierState("shift") ? "tabback" : "tabforward")
        }

        if (e.key == "Enter") {
            dispatch("submit")
        }
    }
</script>

<div class="standard-input">
    <label for={randomId}>{label}</label>
    {#if (type !== "textarea")}
        <input class="input" id={randomId} {type} {value} {placeholder} on:input={handleInput} on:keydown={handleKeyDown} bind:this={element}>
    {:else}
        <textarea class="input" id={randomId} {value} bind:this={element} on:input={handleInput} on:keydown={handleKeyDown}></textarea>
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .standard-input {
        width: 100%;
    }
    .input {
        padding: 5px;
        outline: none;
        background-color: var(--bg-alt);
        border: solid 2px var(--bg-alt);
        border-radius: 3px;
        font-size: large;
        color: var(--text);
        max-width: 100%;
    }

    textarea {
        height: 6rem;
    }

    textarea:focus {
        border: solid 2px var(--fg);
    }

    .input:focus {
        border: solid 2px var(--fg);
    }

    label {
        color: var(--text-alt);
        font-size: 1rem;
    }
</style>