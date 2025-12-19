import { Metadata } from "next";
import ServicesWrapper from "./ServicesWrapper";
import { sanityFetch } from "@/sanity/lib/live";
import { PortableTextBlock } from "next-sanity";

export const metadata: Metadata = {
  title: "Services | The Layered Home",
  description:
    "The Layered Home offers a range of styling and interior design services rooted in warmth, balance, and thoughtful detail.",
};

export type Service = {
  _id: string;
  title: string;
  description: PortableTextBlock[];
};

export default async function ServicesPage() {
  const data = await sanityFetch({
    query: `*[_type == "service"] | order(orderRank) {
      _id,
      title,
      description,
      orderRank,
    }`,
  });

  const services = data.data as Service[];

  return <ServicesWrapper data={services} />;
}
