"use client";
import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpoScaleEase } from "gsap/EasePack";
import SplitText from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ExpoScaleEase);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(CustomEase);

CustomEase.create("theEase", "M0,0 C0.08,0.82 0.17,1 1,1");

// Hardcoded services list
const servicesList = [
  "Vignette Styling",
  "Vignette Refresh",
  "Room Refresh",
  "Designer for a day",
  "Virtual Styling",
];

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  services: z.array(z.string()).optional(),
  spaceAndGoal: z.string().optional(),
  projectTimeline: z.string().optional(),
  workingWithBuilder: z.boolean().optional(),
  howDidYouHear: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactWrapper() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      services: [],
      workingWithBuilder: undefined,
    },
  });

  const watchedServices = watch("services") || [];
  const watchedBuilder = watch("workingWithBuilder");

  const handleServiceChange = (service: string, checked: boolean) => {
    const currentServices = watchedServices;
    if (checked) {
      setValue("services", [...currentServices, service]);
    } else {
      setValue(
        "services",
        currentServices.filter((s) => s !== service)
      );
    }
  };

  const handleBuilderChange = (value: boolean) => {
    setValue("workingWithBuilder", value);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    SplitText.create(".about-hero-headline", {
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
    gsap.from(".contact-form", {
      y: 48,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "theEase",
    });
  });

  return (
    <div className="min-h-screen">
      <section className="contact-hero">
        <div className="section-container relative lg:pt-12 md:items-center lg:items-stretch">
          <div className="col-span-full">
            <h1 className="text-4xl md:text-5xl about-hero-headline xl:text-7xl 3xl:text-8xl">
              <span className="spacer inline-flex md:w-1/5"></span>
              We believe the best projects begin with a thoughtful conversation.
              Use the form below to share details about your home, style, and
              goals. Once we review your submission, we&apos;ll follow up with
              next steps and availability.
            </h1>
          </div>
        </div>
      </section>
      <section className="contact-form">
        <div className="section-container border-none">
          <div className="col-span-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-4xl mx-auto"
            >
              {/* Name Fields - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
                <div className="form-field">
                  <label
                    htmlFor="firstName"
                    className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName")}
                    className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors"
                    placeholder=""
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label
                    htmlFor="lastName"
                    className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register("lastName")}
                    className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors"
                    placeholder=""
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Phone - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
                <div className="form-field">
                  <label
                    htmlFor="email"
                    className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors"
                    placeholder=""
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Services Checkboxes */}
              <div className="mb-8">
                <label className="block text-sm text-graphite/70 mb-4 font-light uppercase">
                  What service are you interested in?
                </label>
                <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {servicesList.map((service) => (
                    <label
                      key={service}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={watchedServices.includes(service)}
                        onChange={(e) =>
                          handleServiceChange(service, e.target.checked)
                        }
                        className="w-4 h-4 border border-graphite/30 rounded-sm bg-transparent text-graphite focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-graphite checked:border-graphite relative after:content-[''] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:bg-parchment after:opacity-0 checked:after:opacity-100"
                      />
                      <span className="ml-3 text-sm text-graphite/70 font-light">
                        {service}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-8">
                <label
                  htmlFor="spaceAndGoal"
                  className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                >
                  Tell us about your space and goal
                </label>
                <textarea
                  id="spaceAndGoal"
                  {...register("spaceAndGoal")}
                  rows={4}
                  className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors resize-none"
                  placeholder=""
                />
              </div>

              {/* Project Timeline */}
              <div className="mb-8">
                <label
                  htmlFor="projectTimeline"
                  className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                >
                  Ideal project timeline
                </label>
                <input
                  type="text"
                  id="projectTimeline"
                  {...register("projectTimeline")}
                  className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors"
                  placeholder=""
                />
              </div>

              {/* Working with Builder/Contractor */}
              <div className="mb-8">
                <label className="block text-sm text-graphite/70 mb-4 font-light uppercase">
                  Are you working with a builder or contractor?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      checked={watchedBuilder === true}
                      onChange={() => handleBuilderChange(true)}
                      className="w-4 h-4 border border-graphite/30 rounded-full bg-transparent text-graphite focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-graphite checked:border-graphite relative after:content-[''] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:bg-parchment after:opacity-0 checked:after:opacity-100 after:rounded-full"
                    />
                    <span className="ml-3 text-sm text-graphite/70 font-light">
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      checked={watchedBuilder === false}
                      onChange={() => handleBuilderChange(false)}
                      className="w-4 h-4 border border-graphite/30 rounded-full bg-transparent text-graphite focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-graphite checked:border-graphite relative after:content-[''] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:bg-parchment after:opacity-0 checked:after:opacity-100 after:rounded-full"
                    />
                    <span className="ml-3 text-sm text-graphite/70 font-light">
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* How did you hear about us */}
              <div className="mb-8">
                <label
                  htmlFor="howDidYouHear"
                  className="block text-sm text-graphite/70 mb-2 font-light uppercase"
                >
                  How did you hear about us?
                </label>
                <input
                  type="text"
                  id="howDidYouHear"
                  {...register("howDidYouHear")}
                  className="w-full bg-transparent border-0 border-b border-graphite/30 focus:outline-none focus:border-graphite/60 pb-2 text-graphite placeholder:text-graphite/40 transition-colors"
                  placeholder=""
                />
              </div>

              {/* Submit Button */}
              <div className="mt-12">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-graphite text-parchment font-light text-sm uppercase tracking-wide hover:bg-graphite/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus.type && (
                <div
                  className={`mt-6 p-4 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
