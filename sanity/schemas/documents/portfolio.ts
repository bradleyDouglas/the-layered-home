import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  fields: [
    defineField({
      name: "rows",
      type: "array",
      of: [
        { type: "portfolioRowOne" },
        { type: "portfolioRowTwo" },
        { type: "portfolioRowThree" },
      ],
      validation: (Rule) => Rule.required().min(1),
      options: {
        layout: "list",
      },
    }),
  ],
  // Customize the preview so parents are visualized in the studio
  preview: {
    select: {
      title: "name",
      media: "avatar",
    },
    prepare: () => ({
      title: "Portfolio",
    }),
  },
});
