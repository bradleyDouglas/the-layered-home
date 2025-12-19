import { orderRankOrdering } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Services",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "orderRank",
      type: "string",
      // hidden: true,
    }),
  ],
  // Customize the preview so parents are visualized in the studio
  // preview: {
  //   select: {
  //     title: "name",
  //     media: "avatar",
  //   },
  //   prepare: ({ title, media }) => ({
  //     title,
  //     media,
  //   }),
  // },
});
