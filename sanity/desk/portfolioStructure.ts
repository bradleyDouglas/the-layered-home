import { ListItemBuilder } from "sanity/structure";
import defineStructure from "../lib/defineStructure";
import { ImageIcon } from "@sanity/icons";

export default defineStructure<ListItemBuilder>((S, context) =>
  S.listItem()
    .title("Portfolio")
    .icon(ImageIcon)
    .schemaType("portfolio")
    .child((id) => S.editor().schemaType("portfolio").documentId(id))
);
