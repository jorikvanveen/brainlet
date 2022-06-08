<script lang="ts">
    import { createEventDispatcher } from "svelte"
    export let label: string;

    const dispatch = createEventDispatcher()
</script>

<button on:click={dispatch.bind(this, "click")}>{label}</button>

<style>
    button {
        background-color: var(--fg);
        height: 3rem;
        font-size: 1rem;
        font-weight: bold;
        color: var(--text);
        font-family: "Roboto", sans-serif;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        box-shadow: 1px 1px 6px rgba(1, 1, 1, 0.5);
        padding: 0 1rem;
    }

    button:active {
        box-shadow: none;
    }
</style>