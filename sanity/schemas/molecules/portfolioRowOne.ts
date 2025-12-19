import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioRowOne",
  title: "One Image Row",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { metadata: ["lqip"] },
    }),
  ],
  // Customize the preview so parents are visualized in the studio
  preview: {
    select: {
      media: "image",
    },
    prepare: ({ media }) => ({ title: "One Image Row", media }),
  },
});
