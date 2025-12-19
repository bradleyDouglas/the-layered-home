"use client";
import Cta from "@/components/atoms/Cta";
import LogoMark from "@/components/atoms/LogoMark";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ExpoScaleEase } from "gsap/EasePack";
import { CustomEase } from "gsap/CustomEase";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ExpoScaleEase);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

CustomEase.create("theEase", "M0,0 C0.08,0.82 0.17,1 1,1");

export default function Home() {
  const heroTl = useRef<GSAPTimeline>(null);
  const aboutTl = useRef<GSAPTimeline>(null);
  const servicesTl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    heroTl.current = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: ".home-hero",
        start: "top bottom",
      },
    });

    // Set the initial positions of the hero text
    gsap.set(".hero-text", {
      yPercent: 100,
      // skewY: 10,
    });

    // The timeline
    heroTl.current
      .to(".hero-image-mask", {
        yPercent: -100,
        duration: 0.8,
        ease: "expoScale(0.5,7,power2.in)",
      })
      .to(
        ".hero-text",
        {
          yPercent: 0,
          // skewY: 0,
          duration: 1,
          // ease: "expoScale(10,2.5,power2.out)",
          ease: "theEase",
          stagger: 0.1,
        },
        0.7
      );

    SplitText.create(".hero-copy", {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          // a returned animation gets cleaned up and time-synced on each onSplit() call
          yPercent: 100,
          // opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          // ease: "expoScale(10,2.5,power2.out)",
          ease: "theEase",
          scrollTrigger: {
            trigger: ".hero-copy",
            start: "top 80%",
          },
        });
      },
    });

    // HOME ABOUT
    const aboutHeadline = SplitText.create(".home-about-headline", {
      type: "lines",
      mask: "lines",
    });
    const aboutCopy = SplitText.create(".home-about-copy", {
      type: "lines",
      mask: "lines",
    });

    aboutTl.current = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: ".home-about",
        start: "top 80%",
      },
    });
    aboutTl.current.from(
      [aboutHeadline.lines, aboutCopy.lines, ".home-about-cta"],
      {
        yPercent: 115,
        duration: 0.6,
        // ease: "expoScale(10,2.5,power2.out)",
        ease: "theEase",
        stagger: 0.1,
      }
    );
    // .to(
    //   ".about-image-mask",
    //   {
    //     yPercent: -100,
    //     duration: 1.3,
    //     ease: "expoScale(10,2.5,power2.out)",
    //     stagger: 0.08,
    //   },
    //   0
    // );

    // HOME SERVICES
    const servicesHeadline = SplitText.create(".home-services-headline", {
      type: "lines",
      mask: "lines",
    });
    const servicesCopy = SplitText.create(".home-services-copy", {
      type: "lines",
      mask: "lines",
    });

    servicesTl.current = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: ".home-services",
        start: "top 55%",
      },
    });
    servicesTl.current.from(
      [servicesHeadline.lines, servicesCopy.lines, ".home-services-cta"],
      {
        yPercent: 115,
        duration: 0.6,
        // ease: "expoScale(10,2.5,power2.out)",
        ease: "theEase",
        stagger: 0.1,
      }
    );
    // .to(
    //   ".services-image-mask",
    //   {
    //     yPercent: -100,
    //     duration: 1.3,
    //     ease: "expoScale(10,2.5,power2.out)",
    //     stagger: 0.08,
    //   },
    //   0
    // );
  });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="home-hero">
        <div className="section-container pt-4 relative lg:pt-12">
          <div className="col-span-full aspect-video relative overflow-hidden w-full h-full max-h-[80vh]">
            <Image
              src="/images/kitchen-angle.png"
              alt="Hero Image"
              fill
              className="w-full h-auto object-cover object-top"
              priority={true}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-graphite/60"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-soft-linen z-10 hero-image-mask" />
            <div className="absolute top-0 left-0 w-full h-full grid place-items-center">
              <h1 className="text-parchment text-center flex flex-col items-center justify-center">
                <span className="block overflow-hidden pb-4">
                  <span className="block hero-text">Thoughtful spaces,</span>
                </span>
                <span className="block overflow-hidden pb-4 -mt-4">
                  <span className="block hero-text">beautifully layered</span>
                </span>
              </h1>
            </div>
          </div>
          <div className="col-span-full md:col-span-8 mt-8 lg:col-span-6 relative">
            <p className="xl:text-2xl 2xl:text-3xl hero-copy [&>div]:overflow-hidden">
              At The Layered Home, we believe a home is built in layers. Each
              object, texture, and color tells a story. From signature styled
              vignettes to complete room transformations, we create spaces that
              feel warm, collected, and deeply personal—homes that are lived in,
              not decorated.{" "}
            </p>
            <Cta href="/about" label="Learn More" className="mt-8" />
          </div>
          <LogoMark className="hidden xl:block absolute bottom-6 right-0 md:block" />
        </div>
      </section>
      {/* ABOUT */}
      <section className="home-about">
        <div className="section-container">
          <div className="col-span-full md:col-span-5 grid xl:col-span-5">
            <div className="">
              <h2 className="home-about-headline [&>div]:pb-4 [&>div]:-mb-4">
                Bring home to your house
              </h2>
              <p className="mt-4 home-about-copy">
                From quiet moments to fully realized spaces, our work highlights
                warmth, texture, and the lived-in beauty of layered design.
                Explore recent projects and signature styled scenes.
              </p>
              <div className="overflow-hidden">
                <Cta
                  href="/portfolio"
                  label="View our work"
                  className="mt-8 home-about-cta"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-8 xl:mt-auto">
              <div className="col-span-1 h-auto relative overflow-hidden">
                <Image
                  src="/images/home-about-shelf.png"
                  alt="Shelf Image"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover object-top"
                />
                {/* <div className="absolute top-0 left-0 w-full h-full bg-soft-linen about-image-mask"></div> */}
              </div>
              <div className="col-span-1 h-auto relative overflow-hidden">
                <Image
                  src="/images/home-about-entry.png"
                  alt="Entry Image"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover object-top"
                />
                {/* <div className="absolute top-0 left-0 w-full h-full bg-soft-linen about-image-mask"></div> */}
              </div>
            </div>
          </div>
          <div className="hidden md:block col-span-7 lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8 relative overflow-hidden">
            {/* <div className="relative"> */}
            <Image
              src="/images/home-about-kitchen.jpg"
              alt="Kitchen Image"
              width={3000}
              height={3000}
              className="w-full h-full object-cover object-top"
            />
            {/* <div className="absolute top-0 left-0 w-full h-full bg-soft-linen about-image-mask"></div> */}
            {/* </div> */}
          </div>
        </div>
      </section>
      {/* Services */}
      <section className="home-services">
        <div className="section-container border-none">
          <div className="col-span-full md:col-span-6 lg:col-span-5 xl:col-span-6 overflow-hidden relative">
            <Image
              src="/images/home-services.jpg"
              alt="Kitchen Image"
              width={3000}
              height={3000}
              className="w-full h-full object-cover object-top"
            />
            {/* <div className="absolute top-0 left-0 w-full h-full bg-soft-linen services-image-mask"></div> */}
          </div>
          <div className="mt-8 md:mt-12 lg:mt-20 xl:mt-40 col-span-full md:col-span-5 md:col-start-8 xl:col-span-3 xl:col-start-9">
            <div className="">
              <h2 className="home-services-headline">Our services</h2>
              <p className="mt-4 home-services-copy">
                We specialize in curated styling and refined interiors—merging
                thoughtful layers, natural textures, and timeless design to
                elevate your everyday spaces.
              </p>
              <div className="overflow-hidden">
                <Cta
                  href="/services"
                  label="View our services"
                  className="mt-8 home-services-cta"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
