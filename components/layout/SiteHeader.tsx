"use client";
import { Link } from "next-transition-router";
import Logo from "../atoms/Logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import cn from "@/utils/cn";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ExpoScaleEase } from "gsap/EasePack";

gsap.registerPlugin(ExpoScaleEase);
gsap.registerPlugin(useGSAP);

const navigation = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Journal", href: "/journal" },
  { name: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only run on client side
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
    };

    checkMobile();
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = () => checkMobile();

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(false);
  const tlPlay = useRef<GSAPTimeline>(null);
  const tlMask = useRef<GSAPTimeline>(null);
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const navMaskRef = useRef(null);

  const handleBurgerclick = (isOpen: boolean) => {
    if (!isOpen) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      setTimeout(() => {
        setShouldRotate(!shouldRotate);
      }, 200);
    } else {
      setShouldRotate(!shouldRotate);
      setTimeout(() => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
      }, 200);
    }
  };

  const handleItemClick = () => {
    setShouldRotate(!shouldRotate);
    setTimeout(() => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }, 200);
  };

  useGSAP(
    () => {
      // DESKTOP HEADER TIMELINE
      if (!isMobile && headerRef.current) {
        const headerItems = gsap.utils.toArray(".logo, .nav-link");

        gsap.fromTo(
          headerItems,
          {
            yPercent: -100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.5,
          }
        );

        gsap.fromTo(
          ".header-border",
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }

      if (isMobile) {
        const headerItems = gsap.utils.toArray(".logo, .burger");
        gsap.fromTo(
          headerItems,
          {
            yPercent: -100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.5,
          }
        );
        gsap.fromTo(
          ".header-border",
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.5,
          }
        );
        gsap.set(navRef.current, {
          yPercent: -100,
        });
        gsap.set(".main-nav-link-text", {
          yPercent: 100,
        });
        gsap.set(navMaskRef.current, {
          yPercent: 100,
        });

        if (!tlPlay.current) {
          tlPlay.current = gsap.timeline({
            paused: true,
            reversed: true,
            defaults: {
              duration: 0.9,
              ease: "expo.out",
            },
            onReverseComplete: () => {
              tlMask.current?.reversed(true);
              tlMask.current?.progress(0);
            },
          });

          tlPlay.current
            .to(navRef.current, {
              yPercent: 0,
            })
            .to(
              navMaskRef.current,
              {
                yPercent: 0,
              },
              0
            );
        }

        // MAKS TIMELINE
        tlMask.current = gsap.timeline({
          paused: true,
          defaults: {
            duration: 0.9,
            ease: "expo.out",
          },
        });
        tlMask.current.to(
          ".main-nav-link-text",
          {
            yPercent: 0,
            stagger: 0.1,
            duration: 1,
          },
          0.1
        );
      }
    },
    { scope: headerRef, dependencies: [isMobile] }
  );

  useEffect(() => {
    // PLAY OR REVERSE THE TIMELINE
    if (tlPlay.current && isMobileMenuOpen) {
      tlPlay.current.timeScale(1).play();
      tlMask.current?.play();
    } else if (tlPlay.current && !isMobileMenuOpen) {
      tlPlay.current.timeScale(1.5).reverse();
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className="site-header bg-soft-linen sticky top-0 z-50 py-4 m-auto"
      ref={headerRef}
    >
      <div className="flex justify-between items-center max-w-screen-3xl px-4 xl:px-8 3xl:px-0 m-auto">
        <Link href="/" className="group logo">
          <Logo className="h-8 w-auto md:h-12 text-graphite group-hover:text-faded-copper transition-colors duration-300" />
        </Link>
        {/* BURGER */}
        <div
          className="burger flex flex-col gap-1 z-50 lg:hidden"
          onClick={() =>
            isMobileMenuOpen
              ? handleBurgerclick(true)
              : handleBurgerclick(false)
          }
        >
          <span
            className={cn(
              "block h-0.5 w-6 bg-graphite rounded transition duration-200",
              {
                "translate-y-1.5": isMobileMenuOpen,
                "rotate-45": shouldRotate,
              }
            )}
          ></span>
          <span
            className={cn(
              "block h-0.5 w-6 bg-graphite rounded transition duration-200",
              {
                "opacity-0": isMobileMenuOpen,
              }
            )}
          ></span>
          <span
            className={cn(
              "block h-0.5 w-6 bg-graphite rounded transition duration-200",
              {
                "-translate-y-1.5": isMobileMenuOpen,
                "-rotate-45": shouldRotate,
              }
            )}
          ></span>
        </div>
        <nav
          ref={navRef}
          className={cn(
            "fixed top-0 left-0 w-screen h-screen main-nav-menu mobile-bg bg-faded-copper overflow-hidden lg:static lg:w-auto lg:h-auto lg:bg-transparent lg:overflow-visible"
          )}
        >
          <div
            ref={navMaskRef}
            className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center space-y-4 lg:static lg:flex-row lg:justify-start lg:items-center lg:space-y-0 lg:space-x-4"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="lg:hover:text-faded-copper transition-colors duration-300 main-nav-link overflow-hidden text-2xl font-bold lg:text-base lg:font-normal nav-link"
                onClick={handleItemClick}
              >
                <span className="block main-nav-link-text pointer-events-none">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="header-border absolute bottom-0 left-0 w-full h-px bg-graphite/60"></div>
    </header>
  );
}
