"use client";
import Cta from "@/components/atoms/Cta";
// import { Metadata } from "next";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpoScaleEase } from "gsap/EasePack";
import SplitText from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { PortableText } from "@portabletext/react";
import { Service } from "./page";
// import { portableTextComponents } from "@/app/components/molecules/PortableTextComponents";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ExpoScaleEase);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

CustomEase.create("theEase", "M0,0 C0.08,0.82 0.17,1 1,1");

const processSteps = [
  {
    title: "01 Connect",
    description:
      "We begin with a consultation to understand your home, lifestyle, and goals.",
  },
  {
    title: "02 design & curate",
    description:
      "We develop a thoughtful design direction and curated plan tailored to you.",
  },
  {
    title: "03 Style & Reveal",
    description:
      "We bring the design to life through sourcing, styling, and final installation.",
  },
];

type PageProps = {
  data: Service[];
};

export default function ServicesWrapper({ data }: PageProps) {
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
    gsap.from(".hero-copy", {
      y: 48,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "theEase",
    });

    gsap.from(".service", {
      y: 48,
      opacity: 0,
      duration: 1.1,
      ease: "theEase",
      stagger: 0.1,
      delay: 0.2,
      scrollTrigger: {
        trigger: ".service",
        start: "top 80%",
      },
    });

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: ".about-image-container",
    //     scrub: true,
    //     pin: false,
    //   },
    // });

    // tl.fromTo(
    //   ".about-image",
    //   {
    //     yPercent: -20,
    //     ease: "none",
    //   },
    //   {
    //     yPercent: 20,
    //     ease: "none",
    //   }
    // );
  });

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="about-hero">
        <div className="section-container relative lg:pt-12 md:items-center lg:items-stretch">
          <div className="col-span-full ">
            <h1 className="text-4xl md:text-5xl about-hero-headline xl:text-7xl 3xl:text-8xl">
              <span className="spacer inline-flex md:w-2/5"></span>
              The Layered Home offers a range of styling and interior design
              services rooted in warmth, balance, and thoughtful detail.
            </h1>
            <div className="mt-20 md:grid md:grid-cols-12 gap-x-4 lg:gap-x-6">
              <div className="md:col-span-10 md:col-end-13 lg:col-span-9 lg:col-end-13">
                <p className="mt-4 md:mt-0 hero-copy text-lg md:text-2xl lg:text-3xl 2xl:text-4xl">
                  Whether you’re seeking a beautifully styled vignette, a
                  refreshed room, or full-service design support, our approach
                  remains the same — intentional layers, timeless materials, and
                  spaces that feel truly lived in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SERVICES */}
      <section className="services">
        <div className="section-container lg:items-start">
          <div className="service col-span-full mb-10 md:flex md:justify-between md:items-center lg:col-span-3 lg:flex-col lg:items-start lg:justify-start lg:sticky lg:top-32">
            <h2 className="services-headline font-karla text-base font-semibold uppercase">
              Our services
            </h2>
            <Cta
              href="/contact"
              label="Work with us"
              className="mt-4 services-cta hidden md:flex"
            />
          </div>
          <div className="col-span-full lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 lg:gap-y-20">
              {data.map((service: Service) => (
                <div className="service" key={service._id}>
                  <h3 className="text-4xl mb-4 lg:text-5xl">{service.title}</h3>
                  <div className="services-description">
                    <PortableText value={service.description} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* PROCESS */}
      <section className="process">
        <div className="section-container border-none">
          <h2 className="col-span-full md:col-span-4 font-karla text-base font-semibold uppercase mb-10 lg:col-span-3">
            Process Overview
          </h2>
          <div className="col-span-full md:col-span-8 lg:col-span-9">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-y-20 ">
              {processSteps.map((step) => (
                <div className="process-step" key={step.title}>
                  <h3 className="font-karla text-xs font-semibold uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
