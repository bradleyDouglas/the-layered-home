import { Metadata } from "next";
import PortfolioWrapper, { PortfolioRow } from "./PortfolioWrapper";
import { sanityFetch } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "Portfolio | The Layered Home",
  description: "Explore our portfolio of interior design and styling projects.",
};

export default async function AboutPage() {
  const { data } = await sanityFetch({
    query: `*[_type == "portfolio"][0] {
      _id,
      rows[] {
        _key,
        _type,
        _type == "portfolioRowOne" => {
          image {
            _key,
            "meta": asset -> metadata,
            "altText": asset -> altText,
            "title": asset -> title,
            "url": asset -> url,
            asset
          }
        },
        _type != "portfolioRowOne" => {
          images[] {
            _key,
            "meta": asset -> metadata,
            "altText": asset -> altText,
            "title": asset -> title,
            "url": asset -> url,
            asset
          }
        }
      }
    }`,
  });

  return <PortfolioWrapper rows={data.rows} />;
}
