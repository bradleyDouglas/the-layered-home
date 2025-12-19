import { Metadata } from "next";
import AboutWrapper from "./AboutWrapper";

export const metadata: Metadata = {
  title: "About | The Layered Home",
  description:
    "With a love for natural textures, collected details, and quiet moments within a space, we create interiors that feel warm, intentional, and beautifully lived in.",
};

export default async function AboutPage() {
  return <AboutWrapper />;
}
