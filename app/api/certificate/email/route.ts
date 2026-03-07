import { NextRequest, NextResponse } from "next/server";
import { generateCertificatePdf } from "@/lib/generate-certificate-pdf";

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

    // Generate PDF certificate
    const pdfBase64 = generateCertificatePdf({
      name,
      date,
      questsCompleted: Number(questsCompleted) || 12,
      attestationUid: attestationUid || undefined,
      attestationUrl: attestationUrl || undefined,
    });

    const certificateTemplateId = process.env.LOOPS_CERTIFICATE_TEMPLATE_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hatch.learnopenclaw.ai";

    if (certificateTemplateId) {
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
            certificateUrl: `${siteUrl}/certificate`,
          },
          attachments: [
            {
              filename: `OpenClaw-Certificate-${name.replace(/\s+/g, "-")}.pdf`,
              contentType: "application/pdf",
              data: pdfBase64,
            },
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Loops certificate email failed:", errorText);

        // If attachments aren't enabled, retry without attachment
        if (errorText.includes("attachment")) {
          console.log("Retrying without attachment...");
          const retryRes = await fetch("https://app.loops.so/api/v1/transactional", {
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
                certificateUrl: `${siteUrl}/certificate`,
              },
            }),
          });
          if (!retryRes.ok) {
            console.error("Loops retry failed:", await retryRes.text());
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }
      }
    } else {
      // Fallback: events API (no attachment support)
      await fetch("https://app.loops.so/api/v1/contacts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName: name, source: "certificate-email" }),
      });

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
