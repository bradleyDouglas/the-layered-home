import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioRowTwo",
  title: "Two Image Row",
  type: "object",
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { metadata: ["lqip"] } }],
      validation: (Rule) => Rule.required().min(2).max(2),
    }),
  ],
  // Customize the preview so parents are visualized in the studio
  preview: {
    select: {
      media: "images",
    },
    prepare: ({ media }) => ({ title: "Two Image Row", media: media[0] }),
  },
});
