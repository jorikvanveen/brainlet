<script lang="ts">
    import { createEventDispatcher } from "svelte"

    export let type: "text" | "number" | "password";
    export let label = "";
    export let value: string | number;
    export let element: HTMLInputElement | null = null;

    const randomId = Math.floor(Math.random() * 1000000000).toString()
    const dispatch = createEventDispatcher()

    const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement; }) => {
        value = e.currentTarget.value
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key == "Tab" && !e.getModifierState("Shift")) {
            dispatch("tabout")
        }

        if (e.key == "Enter") {
            dispatch("submit")
        }
    }
</script>

<div class="standard-input">
    <label for={randomId}>{label}</label>
    <input id={randomId} {type} {value} on:input={handleInput} on:keydown={handleKeyDown} bind:this={element}>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    input {
        padding: 5px;
    }
</style>