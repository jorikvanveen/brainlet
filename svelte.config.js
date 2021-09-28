import preprocess from 'svelte-preprocess';
import wasmPack from 'vite-plugin-wasm-pack'
import adapter from "@sveltejs/adapter-node"
import * as path from "path"

const plugins = wasmPack.default(["./words-backend"])

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter({
			out: "build",
			precompress: false,
			env: {
				host: "localhost",
				port: "5000"
			}
		}),
		target: '#svelte',
		vite: {
			build: {
				minify: true
			},
			plugins: [plugins],
			resolve: {
				alias: {
					"@components": path.resolve("./src/components"),
					"@utils": path.resolve("./src/utils")
				}
			}
		}
	}
};

export default config;
