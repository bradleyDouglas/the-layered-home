import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { metadata: ["lqip"] },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
    prepare: ({ title, media }) => ({
      title,
      media,
    }),
  },
});

