import { Metadata } from "next";
import ContactWrapper from "./ContactWrapper";

export const metadata: Metadata = {
  title: "Contact | The Layered Home",
  description:
    "Get in touch with The Layered Home to discuss your interior design or styling needs.",
};

export default async function ContactPage() {
  return <ContactWrapper />;
}
