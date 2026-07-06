import { defineConfig } from "vitepress"

const repoUrl = "https://github.com/medram/flowui"
const repoBase = "/flowui/"

export default defineConfig({
  title: "@flowui/ui",
  description: "Reusable shadcn/ui component library for React and Next.js applications.",
  base: process.env.GITHUB_ACTIONS ? repoBase : "/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/" },
      { text: "Reference", link: "/reference/exports" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting started", link: "/guide/getting-started" },
            { text: "Styling", link: "/guide/styling" },
          ],
        },
      ],
      "/components/": [
        {
          text: "Components",
          items: [
            { text: "Overview", link: "/components/" },
            { text: "Form fields", link: "/components/form-fields" },
            { text: "Primitives", link: "/components/primitives" },
            { text: "Root components", link: "/components/root-components" },
            { text: "Charts", link: "/components/charts" },
            { text: "Workflows and providers", link: "/components/workflows" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Exports", link: "/reference/exports" },
            { text: "Cloud storage", link: "/reference/cloud-storage" },
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
