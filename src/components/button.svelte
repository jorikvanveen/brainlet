<script lang="ts">
    import { createEventDispatcher } from "svelte"
    export let label: string;

    const dispatch = createEventDispatcher()
</script>
<button on:click={dispatch.bind(this, "click")}>{label}</button>