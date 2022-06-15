<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let optionText: string;
    export let optionNumber: number;
    let dispatch = createEventDispatcher();
</script>

<span class="option-number">
    <div>{optionNumber.toString()}</div>
</span>
<button on:click={dispatch.bind(this, "click")}>
    <div>
        {optionText}
    </div>
</button>

<style lang="scss">
    button {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 5rem;
        background-color: var(--bg-alt);
        /* border: solid 3px var(--fg); */
        border: none;
        box-shadow: 2px 2px 6px rgba(1, 1, 1, 0.5);
        user-select: none;
        color: var(--text);
        border-radius: .2rem;
        font-weight: bold;
        font-size: 1.1rem;
        flex-grow: 1;
        width: 100%;
        text-align: center;
        cursor: pointer;

        div {
            width: 90%;
        }
    }

    .option-number {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 1rem;
        position: absolute;
        border: solid 3px rgba(1, 1, 1, 0);
        font-size: 0.8rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        user-select: none;
    }
</style>