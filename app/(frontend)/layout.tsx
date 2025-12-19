import "@/app/globals.css";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { TransitionProvider } from "@/components/TransitionProvider";
import { SanityLive } from "@/sanity/lib/live";
import { LenisProvider } from "@/components/LenisProvider";

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LenisProvider>
        <TransitionProvider>
          <SiteHeader />
          <main>
            {children}
            <SanityLive />
          </main>
          <SiteFooter />
        </TransitionProvider>
      </LenisProvider>
    </>
  );
}
