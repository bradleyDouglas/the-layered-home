"use client";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { calculateReadTime } from "@/utils/calculateReadTime";
import { BlogPost } from "../page";
import { portableTextComponents } from "@/components/molecules/PortableTextComponents";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpoScaleEase } from "gsap/EasePack";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ExpoScaleEase);
gsap.registerPlugin(CustomEase);

CustomEase.create("theEase", "M0,0 C0.08,0.82 0.17,1 1,1");

type BlogPostWrapperProps = {
  post: BlogPost;
};

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPostWrapper({ post }: BlogPostWrapperProps) {
  useGSAP(() => {
    gsap.from(".blog-hero", {
      y: 48,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "theEase",
    });

    gsap.from(".blog-content-block", {
      y: 32,
      opacity: 0,
      duration: 0.6,
      ease: "theEase",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".blog-content",
        start: "top 80%",
      },
    });
  });

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="blog-hero">
        <div className="section-container pt-4 relative lg:pt-12">
          <div className="col-span-full">
            {/* Featured Image */}
            {post.featuredImage?.asset && (
              <div className="aspect-video relative overflow-hidden w-full mb-8 md:mb-12">
                <Image
                  src={urlFor(post.featuredImage.asset).url()}
                  alt={post.title}
                  fill
                  className="w-full h-auto object-cover object-center"
                  priority={true}
                  placeholder={
                    post.featuredImage.metadata?.lqip ? "blur" : "empty"
                  }
                  blurDataURL={post.featuredImage.metadata?.lqip}
                  sizes="100vw"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="max-w-4xl mx-auto">
              {post.tags && post.tags.length > 0 && (
                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider bg-graphite/10 text-graphite rounded-full border border-graphite/20">
                  {post.tags[0].title}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 line-fix">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg md:text-xl lg:text-2xl text-graphite/80 mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Author Info */}
              <div className="flex items-center gap-4 pb-8 border-b border-graphite/20">
                {post.author.image?.asset && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={urlFor(post.author.image.asset).url()}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-graphite">
                    {post.author.name}
                  </span>
                  <span className="text-xs text-graphite/70">
                    {formatDate(post.publishedAt)} •{" "}
                    {calculateReadTime(post.content)} mins read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="blog-content">
        <div className="section-container">
          <div className="col-span-full max-w-3xl mx-auto">
            <div className="blog-content-block">
              <PortableText
                value={post.content as PortableTextBlock[]}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TAGS SECTION */}
      {post.tags && post.tags.length > 0 && (
        <section className="blog-tags">
          <div className="section-container border-none">
            <div className="col-span-full max-w-3xl mx-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-graphite/70 mr-2">
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug.current}
                    className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-graphite/10 text-graphite rounded-full border border-graphite/20"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
