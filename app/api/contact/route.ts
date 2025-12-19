import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      services,
      spaceAndGoal,
      projectTimeline,
      workingWithBuilder,
      howDidYouHear,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format email content
    const emailContent = `
New Contact Form Submission

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
${phoneNumber ? `- Phone: ${phoneNumber}` : ""}

Project Details:
${services && services.length > 0 ? `- Services Interested In: ${services.join(", ")}` : "- Services Interested In: Not specified"}
${spaceAndGoal ? `- About Their Space and Goal:\n  ${spaceAndGoal}` : ""}
${projectTimeline ? `- Ideal Project Timeline: ${projectTimeline}` : ""}
${workingWithBuilder !== undefined ? `- Working with Builder/Contractor: ${workingWithBuilder ? "Yes" : "No"}` : ""}
${howDidYouHear ? `- How They Heard About Us: ${howDidYouHear}` : ""}

---
Submitted on: ${new Date().toLocaleString()}
    `.trim();

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Update this with your verified domain
      to: ["brad@bradleyjdouglas.com"],
      subject: `New Contact Form Submission - ${firstName} ${lastName}`,
      text: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Form submitted successfully", id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
