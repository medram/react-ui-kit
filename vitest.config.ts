import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
