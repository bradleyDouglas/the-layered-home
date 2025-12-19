"use client";
import Cta from "@/components/atoms/Cta";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpoScaleEase } from "gsap/EasePack";
import SplitText from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ExpoScaleEase);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

CustomEase.create("theEase", "M0,0 C0.08,0.82 0.17,1 1,1");

export default function AboutWrapper() {
  const aboutHeroTl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    const aboutHeroHeadline = SplitText.create(".about-hero-headline", {
      type: "lines",
      mask: "lines",
      linesClass: "overflow-hidden line-fix ",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          // a returned animation gets cleaned up and time-synced on each onSplit() call
          yPercent: 100,
          // opacity: 0,
          stagger: 0.1,
          duration: 1,
          // ease: "expoScale(10,2.5,power2.out)",
          ease: "theEase",
          scrollTrigger: {
            trigger: ".about-hero",
            start: "top 80%",
          },
        });
      },
    });
    gsap.from([".our-approach", ".hero-copy", ".hero-cta"], {
      y: 48,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.2,
      ease: "theEase",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-image-container",
        scrub: true,
        pin: false,
      },
    });

    tl.fromTo(
      ".about-image",
      {
        yPercent: -20,
        ease: "none",
      },
      {
        yPercent: 20,
        ease: "none",
      }
    );
  });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="about-hero">
        <div className="section-container relative lg:pt-12 md:items-center lg:items-stretch">
          <div className="col-span-full ">
            <h1 className="text-4xl md:text-5xl about-hero-headline xl:text-7xl 3xl:text-8xl">
              <span className="spacer inline-flex md:w-1/5"></span>
              The Layered Home was founded on a simple idea: thoughtful design
              doesn’t have to be overwhelming. With a love for natural textures,
              collected details, and quiet moments within a space, we create
              interiors that feel warm, intentional, and beautifully lived in.
            </h1>
            <div className="mt-20 xl:mt-40 md:grid md:grid-cols-12 gap-x-4 lg:gap-x-6">
              <p className="uppercase font-medium tracking-wide md:col-span-3 text-sm our-approach">
                Our Approach
              </p>
              <div className="md:col-span-9 lg:col-span-6 lg:col-end-12">
                <p className="mt-4 md:mt-0 hero-copy">
                  Our approach blends refined styling with functional design,
                  bringing cohesion and charm to every corner without
                  unnecessary complication. Whether we’re refreshing a single
                  vignette or shaping an entire home, the goal is always the
                  same—help you fall in love with where you live.
                </p>
                <p className="mt-4 hero-copy">
                  We believe great spaces are layered over time—not rushed,
                  over-styled, or designed to mimic someone else’s home. Our
                  work is rooted in warm minimalism that feels elevated without
                  ever feeling stark, and in purposeful layers that bring
                  character, depth, and comfort into everyday living. Each
                  vignette, texture, and collected detail is thoughtfully chosen
                  to reflect who you are and how you live.
                </p>
                <p className="mt-4 hero-copy">
                  Every project begins with understanding your lifestyle, your
                  home, and your vision. From there, we build intentional
                  layers—color, texture, furniture, and styling—until the space
                  feels balanced and complete. Our process is warm,
                  communicative, and transparent from start to finish, grounded
                  in timeless design choices that outlast trends. The result is
                  a home that feels welcoming, grounded, and effortlessly pulled
                  together.
                </p>
                <div className="overflow-hidden">
                  <Cta
                    href="/contact"
                    label="Work with us"
                    className="mt-8 hero-cta"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* IMAGE */}
      <section className="about-image-container px-0! md:px-0! xl:px-0!">
        <div className="overflow-hidden">
          <Image
            src="/images/dining-room.jpg"
            alt="Dining Room Image"
            width={4500}
            height={4500}
            className="w-full h-full object-cover object-center max-h-[90vh] about-image"
          />
        </div>
      </section>
      {/* SERVICES */}
      <section className="about-services">
        <div className="section-container border-none">
          <div className="col-span-full">
            <div className="mt-20 md:grid md:grid-cols-12 gap-x-4 lg:gap-x-6">
              <p className="uppercase font-medium tracking-wide md:col-span-3 text-sm our-approach">
                How we work
              </p>
              <div className="md:col-span-9 lg:col-span-6 lg:col-end-12">
                <p className="mt-4 md:mt-0 about-services-copy">
                  Design isn’t just about furniture or finishes—it’s about
                  creating moments. From a styled entry console to the way
                  morning light lands on your kitchen shelves, we focus on the
                  details that make your home feel uniquely yours.
                </p>
                <p className="mt-4 about-services-copy">
                  Every project begins with understanding your lifestyle, your
                  home, and your vision. From there, we build thoughtful
                  layers—color, texture, furniture, and styling—until the space
                  feels balanced and complete.
                </p>
                <p className="mt-4 about-services-copy">
                  Our process is warm, communicative, and transparent from start
                  to finish.
                </p>
                <div className="overflow-hidden">
                  <Cta
                    href="/services"
                    label="View our services"
                    className="mt-8 about-services-cta"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
