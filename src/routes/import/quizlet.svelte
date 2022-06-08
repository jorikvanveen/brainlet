<script lang="ts">
import { goto } from "$app/navigation";

    import Button from "@components/button.svelte";
    import Input from "@components/input.svelte";
    import throwError from "@utils/throwError";
    let set_data_input = "";
    let set_name_input = "";

    const submit = () => {
        try {
            // Parse data
            const words_raw = set_data_input.split("\n");
            const words = words_raw.map(word => {
                const [term, definition] = word.split("\t")
                return {
                    term,
                    definition
                }
            })

            fetch("/api/create_set", {
                method: "POST",
                body: JSON.stringify({
                    name: set_name_input,
                    words
                })
            })
            .then(r => r.json())
            .then(response => {
                goto("/study/" + response.writeId)
            })
            .catch(err => {
                throwError("Failed to import")
                console.error(err)
            })
        } catch (e) {
            throwError("Failed to import")
            console.error(e)
        }
    }
</script>

<br/>
<div class="main">
    <h1>Import set from quizlet</h1>
    <p>Go to the set you want to import from quizlet, press the export button and then paste the output here.</p>
    <br/>
    <Input type="text" placeholder="My awesome set" bind:value={set_name_input} label="Name" />
    <br/>
    <Input type="textarea" placeholder="https://quizlet.com/nl/633297749/worthilfe-blz-64-flash-cards/" bind:value={set_data_input} label="Import Data" />
    <br/>
    <Button on:click={submit} label="Import" />
</div>

<style>
    .main {
        max-width: 50vw;
        margin: 0 auto;
    }

    @media only screen and (max-width: 1150px) {
        .main {
            max-width: 90vw;
        }
    }
</style>

