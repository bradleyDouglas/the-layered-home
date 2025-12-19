import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioRowThree",
  title: "Three Image Row",
  type: "object",
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { metadata: ["lqip"] } }],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
  ],
  // Customize the preview so parents are visualized in the studio
  preview: {
    select: {
      media: "images",
    },
    prepare: ({ media }) => ({ title: "Three Image Row", media: media[0] }),
  },
});
