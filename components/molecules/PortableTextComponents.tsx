import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    blockQuote: ({ value }) => {
      if (!value || !value.quote) return null;

      return (
        <blockquote className="my-8 md:my-12 py-6 md:py-8">
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-graphite leading-tight mb-4">
            "{value.quote}"
          </p>
          {(value.author || value.citation) && (
            <footer className="text-sm md:text-base text-graphite/70 italic">
              {value.author && <span>— {value.author}</span>}
              {value.author && value.citation && <span>, </span>}
              {value.citation && <span>{value.citation}</span>}
            </footer>
          )}
        </blockquote>
      );
    },
    fullWidthImage: ({ value }) => {
      if (!value || !value.image?.asset) return null;

      return (
        <figure className="my-8 md:my-12">
          <div className="relative w-full aspect-video overflow-hidden rounded-lg">
            <Image
              src={urlFor(value.image.asset).url()}
              alt={value.alt || "Blog post image"}
              fill
              className="object-cover"
              placeholder={value.image.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={value.image.metadata?.lqip}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 768px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-sm text-graphite/70 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    twoImages: ({ value }) => {
      if (!value || !value.imageOne?.asset || !value.imageTwo?.asset)
        return null;

      return (
        <figure className="my-8 md:my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={urlFor(value.imageOne.asset).url()}
                alt={value.altOne || "Blog post image"}
                fill
                className="object-cover"
                placeholder={value.imageOne.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={value.imageOne.metadata?.lqip}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={urlFor(value.imageTwo.asset).url()}
                alt={value.altTwo || "Blog post image"}
                fill
                className="object-cover"
                placeholder={value.imageTwo.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={value.imageTwo.metadata?.lqip}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-sm text-graphite/70 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl lg:text-6xl mt-8 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl lg:text-5xl mt-8 mb-4 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl lg:text-4xl mt-6 mb-3 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl lg:text-3xl mt-6 mb-3 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg md:text-xl lg:text-2xl mt-4 mb-2 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base md:text-lg lg:text-xl mt-4 mb-2 first:mt-0">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-base lg:text-lg leading-relaxed text-graphite">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-faded-copper pl-6 my-6 italic text-graphite/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base lg:text-lg leading-relaxed text-graphite">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-base lg:text-lg leading-relaxed text-graphite">
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const target = value?.href?.startsWith("http") ? "_blank" : undefined;
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="underline text-graphite hover:text-faded-copper transition-colors duration-300"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-graphite">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-graphite">{children}</em>,
  },
};
