import { Metadata } from "next";
import JournalWrapper from "@/app/(frontend)/journal/JournalWrapper";
import { sanityFetch } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "Journal | The Layered Home",
  description:
    "Explore our journal featuring interior design tips, home styling inspiration, and stories about creating thoughtful, layered spaces.",
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  publishedAt: string;
  featuredImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
      };
      [key: string]: unknown;
    };
  };
  author: {
    name: string;
    image?: {
      asset: {
        _ref: string;
        _type: "reference";
      };
      metadata?: {
        lqip?: string;
        dimensions?: {
          width: number;
          height: number;
        };
        [key: string]: unknown;
      };
    };
  };
  tags?: Array<{
    title: string;
    slug: {
      current: string;
    };
  }>;
  content: unknown[];
};

export type Tag = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
};

export default async function JournalPage() {
  const { data: postsData } = await sanityFetch({
    query: `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset,
        "metadata": asset -> metadata
      },
      author -> {
        name,
        image {
          asset,
          "metadata": asset -> metadata
        }
      },
      tags[] -> {
        title,
        slug
      },
      content,
    }`,
  });

  const { data: tagsData } = await sanityFetch({
    query: `*[_type == "tag"] | order(title asc) {
      _id,
      title,
      slug
    }`,
  });

  const posts = (postsData || []) as BlogPost[];
  const tags = (tagsData || []) as Tag[];

  return <JournalWrapper posts={posts} tags={tags} />;
}
