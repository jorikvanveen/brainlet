<script lang="ts">
    import Navbar from "@components/navbar.svelte";
</script>
<Navbar />
<div class="nav-spacing"></div>

<style>
    .nav-spacing {
        height: 5rem;
    }
</style>

<slot></slot>