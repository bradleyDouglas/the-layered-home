"use client";
import { useState, useMemo } from "react";
import { Link } from "next-transition-router";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { calculateReadTime } from "@/utils/calculateReadTime";
import { BlogPost, Tag } from "./page";
import cn from "@/utils/cn";
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

type JournalWrapperProps = {
  posts: BlogPost[];
  tags: Tag[];
};

const POSTS_PER_PAGE = 9;

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JournalWrapper({ posts, tags }: JournalWrapperProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Get most recent post for hero (always the first one since posts are sorted by publishedAt desc)
  const featuredPost = posts.length > 0 ? posts[0] : null;

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter by tag
    if (selectedTag) {
      result = result.filter((post) =>
        post.tags?.some((tag) => tag.slug.current === selectedTag)
      );
    }

    // Sort
    if (sortBy === "oldest") {
      result.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateA - dateB;
      });
    } else {
      // newest (default)
      result.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    // Exclude featured post from grid
    if (featuredPost) {
      result = result.filter((post) => post._id !== featuredPost._id);
    }

    return result;
  }, [posts, selectedTag, sortBy, featuredPost]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filter or sort changes
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedTag, sortBy]);

  useGSAP(() => {
    gsap.from(".journal-hero", {
      y: 48,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "theEase",
    });

    gsap.from(".journal-post-card", {
      y: 48,
      opacity: 0,
      duration: 0.6,
      ease: "theEase",
      stagger: 0.05,
      scrollTrigger: {
        trigger: ".journal-grid",
        start: "top 80%",
      },
    });
  });

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Most Recent Post */}
      {featuredPost && (
        <section className="journal-hero">
          <div className="section-container pt-4 relative lg:pt-12">
            <Link
              href={`/journal/${featuredPost.slug.current}`}
              className="col-span-full block group"
            >
              <div className="aspect-video relative overflow-hidden w-full h-full max-h-[80vh]">
                {featuredPost.featuredImage?.asset && (
                  <>
                    <Image
                      src={urlFor(featuredPost.featuredImage.asset).url()}
                      alt={featuredPost.title}
                      fill
                      className="w-full h-auto object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      priority={true}
                      placeholder={
                        featuredPost.featuredImage.metadata?.lqip
                          ? "blur"
                          : "empty"
                      }
                      blurDataURL={featuredPost.featuredImage.metadata?.lqip}
                      sizes="100vw"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-graphite/40 group-hover:bg-graphite/30 transition-colors duration-300"></div>
                  </>
                )}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16">
                  <div className="max-w-3xl">
                    {featuredPost.tags && featuredPost.tags.length > 0 && (
                      <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider bg-graphite/80 text-parchment rounded-full">
                        {featuredPost.tags[0].title}
                      </span>
                    )}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl text-parchment mb-4 line-fix">
                      {featuredPost.title}
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-parchment/90 mb-6 line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-parchment">
                      {featuredPost.author.image?.asset && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={urlFor(featuredPost.author.image.asset).url()}
                            alt={featuredPost.author.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {featuredPost.author.name}
                        </span>
                        <span className="text-xs opacity-80">
                          {formatDate(featuredPost.publishedAt)} •{" "}
                          {calculateReadTime(featuredPost.content)} mins read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* JOURNAL HEADER */}
      <section className="journal-header">
        <div className="section-container">
          <div className="col-span-full md:col-span-8 lg:col-span-6">
            <h2 className="text-4xl md:text-5xl xl:text-7xl mb-4">Journal</h2>
            <p className="text-lg md:text-xl lg:text-2xl">
              Here, we share interior design tips, home styling inspiration, and
              stories about creating thoughtful, layered spaces.
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS AND SORT */}
      <section className="journal-filters">
        <div className="section-container">
          <div className="col-span-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Tag Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                  selectedTag === null
                    ? "bg-graphite text-parchment"
                    : "bg-parchment/50 text-graphite hover:bg-parchment"
                )}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => setSelectedTag(tag.slug.current)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                    selectedTag === tag.slug.current
                      ? "bg-graphite text-parchment"
                      : "bg-parchment/50 text-graphite hover:bg-parchment"
                  )}
                >
                  {tag.title}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-sm font-medium">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="px-4 py-2 rounded-full bg-parchment/50 text-graphite border border-graphite/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-faded-copper focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG POST GRID */}
      <section className="journal-grid">
        <div className="section-container">
          {paginatedPosts.length > 0 ? (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {paginatedPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/journal/${post.slug.current}`}
                  className="journal-post-card group block"
                >
                  <div className="bg-parchment rounded-lg overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {post.featuredImage?.asset ? (
                        <>
                          <Image
                            src={urlFor(post.featuredImage.asset).url()}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            placeholder={
                              post.featuredImage.metadata?.lqip
                                ? "blur"
                                : "empty"
                            }
                            blurDataURL={post.featuredImage.metadata?.lqip}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {post.tags && post.tags.length > 0 && (
                            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium uppercase tracking-wider bg-graphite/80 text-parchment rounded-full">
                              {post.tags[0].title}
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-soft-linen flex items-center justify-center">
                          <span className="text-graphite/40">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs text-graphite/70 mb-2">
                        {formatDate(post.publishedAt)} •{" "}
                        {calculateReadTime(post.content)} mins read
                      </div>
                      <h3 className="text-2xl md:text-3xl mb-3 line-fix group-hover:text-faded-copper transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-sm md:text-base text-graphite/80 line-clamp-2 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3">
                        {post.author.image?.asset && (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={urlFor(post.author.image.asset).url()}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        )}
                        <span className="text-sm text-graphite/70">
                          {post.author.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-graphite/70">
                No posts found with the selected filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <section className="journal-pagination">
          <div className="section-container border-none">
            <div className="col-span-full flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-parchment/50 text-graphite hover:bg-parchment"
                )}
                aria-label="Previous page"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 min-w-[40px]",
                      currentPage === page
                        ? "bg-graphite text-parchment"
                        : "bg-parchment/50 text-graphite hover:bg-parchment"
                    )}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-parchment/50 text-graphite hover:bg-parchment"
                )}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
