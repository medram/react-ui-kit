import { defineConfig } from "vitepress"

const repoUrl = "https://github.com/medram/react-ui-kit"
const repoBase = "/react-ui-kit/"

export default defineConfig({
  title: "@medram/react-ui-kit",
  description: "Medram shadcn source registry and headless React contracts.",
  base: process.env.GITHUB_ACTIONS ? repoBase : "/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Registry", link: "/reference/catalog" },
      { text: "Cloud storage", link: "/reference/cloud-storage" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [{ text: "Getting started", link: "/guide/getting-started" }],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Registry catalogue", link: "/reference/catalog" },
            { text: "Table", link: "/reference/table" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: repoUrl }],
    editLink: {
      pattern: `${repoUrl}/edit/main/docs/:path`,
    },
    footer: {
      message: "Internal package. Usage requires package owner approval.",
      copyright: "Copyright © Medram",
    },
  },
})
