import { terser } from "rollup-plugin-terser";

export default {
	input: "lib/index.js",
	output: [
		{
			name: "ROT",
			format: "umd",
			file: "dist/rot.js"
		},
		{
			name: "ROT",
			format: "umd",
			file: "dist/rot.min.js",
			plugins: [terser()]
		}
	]
}
