import { defineField, defineType } from "sanity";

export default defineType({
  name: "fullWidthImage",
  title: "Full Width Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { metadata: ["lqip"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
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
      media: "image",
      caption: "caption",
    },
    prepare: ({ media, caption }) => ({
      title: "Full Width Image",
      subtitle: caption || "No caption",
      media,
    }),
  },
});

