<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import MpcButton from "./mpc_button.svelte";
    export let options: string[]

    const dispatch = createEventDispatcher()

    if (options.length > 8) {
        throw new Error("Too many options")
    }
    const keyboardListener = (e: KeyboardEvent) => {
        const key_as_num = parseInt(e.key);
        if (key_as_num <= options.length && key_as_num > 0) {
            dispatch("option_select", key_as_num-1) 
        }
        console.log(e.key)
    }
</script>

<svelte:window on:keydown={keyboardListener} />

<div class="mpc-container">
    {#each options as option, i}
        <div class="option">
            <MpcButton on:click={dispatch.bind(this, "option_select", i)} optionText={option} optionNumber={i+1} />
        </div>
    {/each}
</div>

<style>
    .mpc-container {
        /* width: 70vw; */
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .option {
        flex-grow: 1;
        flex-wrap: wrap;
    }
</style>