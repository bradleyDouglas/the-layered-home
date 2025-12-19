import { defineField, defineType } from "sanity";

export default defineType({
  name: "blockQuote",
  title: "Block Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Name of the person who said the quote",
    }),
    defineField({
      name: "citation",
      title: "Citation",
      type: "string",
      description: "Source or context for the quote",
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      author: "author",
    },
    prepare: ({ quote, author }) => ({
      title: quote
        ? quote.substring(0, 50) + (quote.length > 50 ? "..." : "")
        : "Block Quote",
      subtitle: author || "No author",
    }),
  },
});
