import { preserveDirectivesPlugin } from "esbuild-plugin-preserve-directives"
import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    "cloud-storage/index": "src/cloud-storage/index.ts",
    types: "src/types.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react/jsx-runtime"],
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ["use client", "use server"],
      include: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
})
