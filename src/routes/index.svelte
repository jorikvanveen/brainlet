<script lang="ts" context="module">
    import type Kit from "@sveltejs/kit";

    export async function load(request: Kit.LoadInput) {
        const setsResponse = await request.fetch("/api/getsets")

        return {
            props: {
                sets: await setsResponse.json()
            }
        }
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    export let sets: Array<any>;

    console.log(sets)
</script>

{#each sets as set}
    <div>
        <a href={`/study/${set._id}`}>{set.name}</a>
    </div>
{/each}
