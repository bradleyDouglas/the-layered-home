/**
 * Desk structure overrides
 */
import { ListItemBuilder, StructureResolver } from "sanity/structure";
import servicesStructure from "./servicesStructure";
import portfolioStructure from "./portfolioStructure";
import blogStructure from "./blogStructure";

/**
 * Desk structure overrides
 *
 * Sanity Studio automatically lists document types out of the box.
 * With this custom desk structure we achieve things like showing the `home`
 * and `settings` document types as singletons, and grouping product details
 * and variants for easy editorial access.
 *
 * You can customize this even further as your schemas progress.
 * To learn more about structure builder, visit our docs:
 * https://www.sanity.io/docs/overview-structure-builder
 */

// If you add document types to desk structure manually, you can add them to this function to prevent duplicates in the root pane
const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId();

  if (!id) {
    return false;
  }

  return ![
    "media.tag",
    "taxonomies",
    "settings",
    "service",
    "portfolio",
    "author",
    "tag",
    "blogPost",
  ].includes(id);
};

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("The Layered Home")
    .items([
      servicesStructure(S, context),
      S.divider(),
      portfolioStructure(S, context),
      S.divider(),
      blogStructure(S, context),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      // S.divider(),
    ]);
