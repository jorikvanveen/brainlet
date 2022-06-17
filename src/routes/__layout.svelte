<script lang="ts">
    import Navbar from "@components/navbar.svelte";
    import { onMount } from "svelte";
    import { SimpleSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base"
    import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
    import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
    import { ZoneContextManager } from '@opentelemetry/context-zone';
    import { registerInstrumentations } from '@opentelemetry/instrumentation';
    import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
    import { get } from "svelte/store";
    import { session } from "$app/stores";

    onMount(async () => {
        const provider = new WebTracerProvider()
        const exporter = new OTLPTraceExporter({
            url: "https://brainlet.jorik-dev.com/v1/traces",
            headers: {
                "Content-Type": "application/json"
            }
        })
        provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
        provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))

        provider.register({
            contextManager: new ZoneContextManager
        })

        registerInstrumentations({
            instrumentations: [
                // @ts-ignore
                new DocumentLoadInstrumentation()
            ]
        })

        localStorage.setItem("lang", get(session).lang)
    })
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