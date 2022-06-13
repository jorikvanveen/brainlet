<script lang="ts">
    import Navbar from "@components/navbar.svelte";
</script>
<Navbar />
<div class="nav-spacing"></div>


<main>
<slot></slot>
</main>

<style lang="scss">
    .nav-spacing {
        height: 7rem;
    }

    main {
        width: 60vw;
        margin: 0 auto;
    }

    @media (max-width: 945px) {
        main {
            width: 95vw;
        }
    }
</style>