import preprocess from 'svelte-preprocess';
import adapter from "@sveltejs/adapter-node"
import * as path from "path"

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
				host: "host",
				port: "port"
			}
		}),
		target: '#svelte',
		vite: {
			build: {
				minify: true
			},
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
