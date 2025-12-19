import { ListItemBuilder } from "sanity/structure";
import defineStructure from "../lib/defineStructure";
import { BookIcon } from "@sanity/icons";

export default defineStructure<ListItemBuilder>((S, context) =>
  S.listItem()
    .title("Blog")
    .icon(BookIcon)
    .schemaType("blogPost")
    .child(
      S.documentList()
        .schemaType("blogPost")
        .title("Posts")
        .defaultOrdering([{ field: "title", direction: "asc" }])
        .menuItems(S.documentTypeList("blogPost").getMenuItems())
        .filter(`_type == "blogPost"`)
        .canHandleIntent(S.documentTypeList("blogPost").getCanHandleIntent())
        .child((id) => S.editor().schemaType("blogPost").documentId(id))
    )
);
