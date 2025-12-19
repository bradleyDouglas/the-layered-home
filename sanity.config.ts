import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./sanity/schemas";
import { structure } from "./sanity/desk";

export default defineConfig({
  name: "default",
  title: "The Layered Home",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemas,
  },
});
