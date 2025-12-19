import { defineField, defineType } from "sanity";

export default defineType({
  name: "twoImages",
  title: "Two Images",
  type: "object",
  fields: [
    defineField({
      name: "imageOne",
      title: "Image One",
      type: "image",
      options: { metadata: ["lqip"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "altOne",
      title: "Alt Text (Image One)",
      type: "string",
      description: "Alternative text for accessibility",
    }),
    defineField({
      name: "imageTwo",
      title: "Image Two",
      type: "image",
      options: { metadata: ["lqip"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "altTwo",
      title: "Alt Text (Image Two)",
      type: "string",
      description: "Alternative text for accessibility",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: {
      media: "imageOne",
      caption: "caption",
    },
    prepare: ({ media, caption }) => ({
      title: "Two Images",
      subtitle: caption || "No caption",
      media,
    }),
  },
});
