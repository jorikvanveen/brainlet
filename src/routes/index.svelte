<script lang="ts" context="module">
    import type Kit from "@sveltejs/kit";

    export async function load(request: Kit.LoadEvent) {
        const setsResponse = await request.fetch("/api/getsets")

        return {
            props: {
                sets: await setsResponse.json()
            }
        }
    }
</script>

<script lang="ts">
    import Navbar from "@components/navbar.svelte";

    export let sets: Array<any>;
</script>

<Navbar />
{#each sets as set}
    <div>
        <a href={`/study/${set._id}`}>{set.name}</a>
    </div>
{/each}


<style>
    a {
        color: var(--fg-alt);
    }
</style>