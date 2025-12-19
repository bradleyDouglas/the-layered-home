import { Link } from "next-transition-router";
import LogoMark from "../atoms/LogoMark";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Journal", href: "/journal" },
  { name: "Contact", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-parchment border-t border-graphite/60 border-solid relative">
      <div className="section-container border-0">
        <div className="col-span-full flex flex-col items-center justify-center">
          <LogoMark className="w-20 h-auto text-faded-copper" />
          <a
            href="instagram.com/thelayeredhome"
            className="text-graphite text-sm uppercase mt-4"
          >
            @thelayeredhome
          </a>
          <div className="flex gap-4 mt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="lg:hover:text-faded-copper transition-colors duration-300 main-nav-link overflow-hidden lg:text-base lg:font-normal"
              >
                <span className="block main-nav-link-text pointer-events-none">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-0 w-full">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} The Layered Home. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
