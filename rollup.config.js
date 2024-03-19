import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

export default {
    input: "./src/freezeTable.js",
    output: [
        {
            file: "index.js",
            format: "es",
        },
    ],
    plugins: [
        postcss({
            plugins: [],
        }),
        terser(),
    ],
};
