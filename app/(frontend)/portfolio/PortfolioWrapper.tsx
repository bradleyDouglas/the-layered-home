"use client";
import { urlFor } from "@/sanity/lib/image";
import cn from "@/utils/cn";
import Image from "next/image";
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

export interface PortfolioRow {
  _key: string;
  _type: "portfolioRowOne" | "portfolioRowTwo" | "portfolioRowThree";
  image?: {
    _key: string;
    _type: "image";
    meta: {
      lqip: string;
      dimensions: {
        width: number;
        height: number;
      };
    };
    altText: string;
    title: string;
    url: string;
    asset: {
      _ref: string;
    };
  };
  images?: {
    _key: string;
    _type: "image";
    meta: {
      lqip: string;
      dimensions: {
        width: number;
        height: number;
      };
    };
    altText: string;
    title: string;
    url: string;
    asset: {
      _ref: string;
    };
  }[];
}

function PortfolioRowOne({ row }: { row: PortfolioRow }) {
  return (
    <div className="portfolio-row-one col-span-full">
      <Image
        className={cn("aspect-video w-full h-full object-cover object-center")}
        placeholder="blur"
        blurDataURL={row.image?.meta?.lqip}
        src={row.image ? urlFor(row.image.asset).url() : ""}
        alt={row.image?.altText || "Interior Design Project"}
        width={row.image?.meta?.dimensions.width}
        height={row.image?.meta?.dimensions.height}
        sizes="100vw"
      />
    </div>
  );
}

function PortfolioRowTwo({ row }: { row: PortfolioRow }) {
  return (
    <div className="portfolio-row-two col-span-full grid grid-cols-2 gap-3 md:gap-4">
      {row.images?.map((image) => (
        <Image
          key={image._key}
          className={cn(
            "aspect-square w-full h-full object-cover object-center md:col-span-1"
          )}
          placeholder="blur"
          blurDataURL={image?.meta?.lqip}
          src={image ? urlFor(image.asset).url() : ""}
          alt={image?.altText || "Interior Design Project"}
          width={image?.meta?.dimensions.width}
          height={image?.meta?.dimensions.height}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}
    </div>
  );
}
function PortfolioRowThree({ row }: { row: PortfolioRow }) {
  return (
    <div className="portfolio-row-three col-span-full grid grid-cols-3 gap-3 md:gap-4">
      {row.images?.map((image) => (
        <Image
          key={image._key}
          className={cn(
            "aspect-square w-full h-full object-cover object-center col-span-1"
          )}
          placeholder="blur"
          blurDataURL={image?.meta?.lqip}
          src={image ? urlFor(image.asset).url() : ""}
          alt={image?.altText || "Interior Design Project"}
          width={image?.meta?.dimensions.width}
          height={image?.meta?.dimensions.height}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}

export default function PortfolioWrapper({ rows }: { rows: PortfolioRow[] }) {
  useGSAP(() => {
    gsap.from(".portfolio", {
      y: 48,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "theEase",
    });
  });
  return (
    <section className="portfolio">
      <div className="section-container gap-3 md:gap-4">
        {rows.map((row) => {
          switch (row._type) {
            case "portfolioRowOne":
              return <PortfolioRowOne key={row._key} row={row} />;
            case "portfolioRowTwo":
              return <PortfolioRowTwo key={row._key} row={row} />;
            case "portfolioRowThree":
              return <PortfolioRowThree key={row._key} row={row} />;
            default:
              return null;
          }
        })}
      </div>
    </section>
  );
}
