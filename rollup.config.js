import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
  input: "./src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "es",
    },
    {
      file: "dist/index.es.js",
      format: "es",
      exports: "named",
    },
  ],
  plugins: [
    postcss({
      plugins: [],
      minimize: true,
    }),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
    }),
    nodeResolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: "node_modules/**",
      exclude: ["node_modules/foo/**", "node_modules/bar/**"],
      extensions: [".js", ".coffee"],
      ignoreGlobal: false,
      sourceMap: false,
      namedExports: { react: ["createElement", "Component"] },
      ignore: ["conditional-runtime-dependency"],
    }),
    external(),
    resolve(),
    terser(),
  ],
};
