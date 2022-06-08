<script lang="ts">
    import { goto } from "$app/navigation";
</script>
<div class="nav-container">
    <div class="subsection">
        <h2 on:click={goto.bind(this, "/")}>Brainlet</h2>
    </div>
    <div class="subsection links">
        <a href="/">Home</a>
        <a href="/create-set">Create Set</a>
        <a href="/import/quizlet">Import Set</a>
    </div>
    <div class="subsection"></div>
</div>

<style>
    .nav-container {
        width: 100vw;
        height: 5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-alt);
        position: fixed;
        top: 0;
        left: 0;
    }

    .subsection {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        width: 33.3333vw;
    }

    .links {
        display: flex;
        justify-content: center;
    }

    a {
        text-decoration: none;
        margin: 0 1rem;
        color: var(--text);
    }


</style>