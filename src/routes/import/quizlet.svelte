<script lang="ts">
    import { goto } from "$app/navigation";
    import translate from "@utils/translate"

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

<h1>{translate("Import a set from Quizlet")}</h1>
<p>{translate("Go to the set you want to import from quizlet, press the export button and then paste the output here.")} <a href="/help/quizlet-import/" target="_blank">{translate("Learn more")}</a></p>
<br/>
<Input type="text" placeholder={translate("My awesome set")} bind:value={set_name_input} label={translate("Title")} />
<br/>
<Input type="textarea" placeholder="https://quizlet.com/nl/633297749/worthilfe-blz-64-flash-cards/" bind:value={set_data_input} label={translate("Import Data")} />
<br/>
<Button on:click={submit} label={translate("Import")} />
