import { ListItemBuilder } from "sanity/structure";
import defineStructure from "../lib/defineStructure";
import { CogIcon } from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export default defineStructure<ListItemBuilder>((S, context) =>
  S.listItem()
    .title("Services")
    .icon(CogIcon)
    .schemaType("service")
    .child(
      S.list()
        .title("Services")
        .items([orderableDocumentListDeskItem({ type: "service", S, context })])
    )
);
