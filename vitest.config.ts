import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const playgroundSource = fileURLToPath(new URL("./playground/src", import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": playgroundSource,
    },
    dedupe: ["react", "react-dom", "formik"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
