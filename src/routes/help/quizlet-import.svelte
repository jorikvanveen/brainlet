<script lang="ts">
    import translate from "@utils/translate"
</script>

<h1>{translate("How to import a set from Quizlet")}</h1>
<ol>
    <li>
        {translate("Open the quizlet set that you would like to import, and make sure you're logged in.")}
    </li>
    <li>
        {translate("Click the export button and copy the text")}<br/>
        <img src="/images/quizlet-import-more-options.png" alt={translate("Click the more options button")}><br/>
        <img src="/images/quizlet-export.png" alt={translate("Click the export button")}><br/>
        <img src="/images/quizlet-export-copy.png" alt={translate("Click the copy text button")}>
    </li>
    <li>
        {translate("Paste the text into the box at this page:")} <a href="/import/quizlet" target="_blank">{translate("Import Set")}</a><br/>
        <img src="/images/quizlet-paste.png" alt={translate("Paste the text into the box")}>
    </li>
</ol>
<style>
    ol > li {
        margin: 2rem 0;
    }

    img {
        box-shadow: 0px 0px 6px rgba(1, 1, 1, 0.5);
        margin: 1rem 0;
        width: 90%;
    }
</style>