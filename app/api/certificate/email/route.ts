import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, date, questsCompleted, attestationUid, attestationUrl } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const apiKey = process.env.LOOPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // Send via Loops transactional email (or fallback to contact create + event)
    const certificateTemplateId = process.env.LOOPS_CERTIFICATE_TEMPLATE_ID;

    if (certificateTemplateId) {
      // Use dedicated certificate template
      const res = await fetch("https://app.loops.so/api/v1/transactional", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionalId: certificateTemplateId,
          email,
          dataVariables: {
            name,
            date,
            questsCompleted: String(questsCompleted),
            attestationUid: attestationUid || "",
            attestationUrl: attestationUrl || "",
            certificateUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://carefree-cooperation-production-787e.up.railway.app"}/certificate`,
          },
        }),
      });

      if (!res.ok) {
        console.error("Loops certificate email failed:", await res.text());
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    } else {
      // Fallback: send a simple HTML email via Loops events API
      // First ensure contact exists
      await fetch("https://app.loops.so/api/v1/contacts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: name,
          source: "certificate-email",
        }),
      });

      // Trigger event
      const res = await fetch("https://app.loops.so/api/v1/events/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          eventName: "certificate_requested",
          eventProperties: {
            name,
            date,
            questsCompleted: String(questsCompleted),
            attestationUid: attestationUid || "",
            attestationUrl: attestationUrl || "",
          },
        }),
      });

      if (!res.ok) {
        console.error("Loops event email failed:", await res.text());
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Certificate email error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
