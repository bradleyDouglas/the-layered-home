import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostWrapper from "@/app/(frontend)/journal/[...slug]/BlogPostWrapper";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { BlogPost } from "../page";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const posts = await client.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "blogPost"] {
      slug
    }`
  );

  if (!posts || !Array.isArray(posts)) {
    return [];
  }

  return posts.map((post) => ({
    slug: [post.slug.current],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join("/");

  const { data: post } = await sanityFetch({
    query: `*[_type == "blogPost" && slug.current == $slug][0] {
      title,
      excerpt,
      featuredImage {
        asset
      },
      author -> {
        name
      }
    }`,
    params: { slug: slugString },
  });

  if (!post) {
    return {
      title: "Post Not Found | The Layered Home",
    };
  }

  const imageUrl = post.featuredImage?.asset
    ? urlFor(post.featuredImage.asset).width(1200).height(630).url()
    : undefined;

  return {
    title: `${post.title} | The Layered Home`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const slugString = slug.join("/");

  const { data: post } = await sanityFetch({
    query: `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset,
        "metadata": asset -> metadata,
        alt
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
      content
    }`,
    params: { slug: slugString },
  });

  if (!post) {
    notFound();
  }

  return <BlogPostWrapper post={post as BlogPost} />;
}
