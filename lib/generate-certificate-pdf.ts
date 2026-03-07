import { jsPDF } from "jspdf";

interface CertificateData {
  name: string;
  date: string;
  questsCompleted: number;
  attestationUid?: string;
  attestationUrl?: string;
}

export function generateCertificatePdf(data: CertificateData): string {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, w, h, "F");

  // Border
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(2);
  doc.rect(8, 8, w - 16, h - 16);

  // Inner border
  doc.setDrawColor(217, 119, 6, 0.3);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, w - 28, h - 28);

  // Corner decorations
  const cornerSize = 20;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.5);
  // Top-left
  doc.line(8, 8, 8 + cornerSize, 8);
  doc.line(8, 8, 8, 8 + cornerSize);
  // Top-right
  doc.line(w - 8 - cornerSize, 8, w - 8, 8);
  doc.line(w - 8, 8, w - 8, 8 + cornerSize);
  // Bottom-left
  doc.line(8, h - 8, 8 + cornerSize, h - 8);
  doc.line(8, h - 8 - cornerSize, 8, h - 8);
  // Bottom-right
  doc.line(w - 8 - cornerSize, h - 8, w - 8, h - 8);
  doc.line(w - 8, h - 8 - cornerSize, w - 8, h - 8);

  let y = 35;

  // "Learn OpenClaw" header
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(217, 119, 6);
  doc.text("L E A R N   O P E N C L A W", w / 2, y, { align: "center" });

  // Divider
  y += 5;
  doc.setDrawColor(217, 119, 6, 0.3);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 30, y, w / 2 + 30, y);

  // "Certificate of Completion"
  y += 12;
  doc.setFontSize(11);
  doc.setTextColor(217, 119, 6);
  doc.text("C E R T I F I C A T E   O F   C O M P L E T I O N", w / 2, y, { align: "center" });

  // "This is to certify that"
  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(160, 160, 180);
  doc.setFont("helvetica", "italic");
  doc.text("This is to certify that", w / 2, y, { align: "center" });

  // Name
  y += 14;
  doc.setFont("times", "bold");
  doc.setFontSize(36);
  doc.setTextColor(255, 220, 130);
  doc.text(data.name, w / 2, y, { align: "center" });

  // Divider under name
  y += 5;
  doc.setDrawColor(217, 119, 6, 0.3);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 50, y, w / 2 + 50, y);

  // Description
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 200);
  const desc = "has successfully completed the OpenClaw Quests Program and demonstrated";
  const desc2 = "proficiency in AI agent deployment, automation, and operations.";
  const desc3 = "This individual has earned the title of:";
  doc.text(desc, w / 2, y, { align: "center" });
  doc.text(desc2, w / 2, y + 5, { align: "center" });
  doc.text(desc3, w / 2, y + 10, { align: "center" });

  // Title badge
  y += 22;
  const badgeW = 80;
  const badgeH = 14;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.setFillColor(40, 30, 20);
  doc.roundedRect(w / 2 - badgeW / 2, y - 8, badgeW, badgeH, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(252, 211, 77);
  doc.text("OpenClaw Operator", w / 2, y, { align: "center" });

  // Skills grid
  y += 16;
  const skills = [
    "Terminal & SSH", "VPS Management", "AI Model Config", "OpenClaw Deployment",
    "Chat Integration", "Agent Memory", "Task Automation", "Web Search & Skills",
    "Social Media APIs", "Server Security", "Dashboard Ops", "Full Deployment",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 180);
  const cols = 4;
  const cellW = 50;
  const cellH = 6;
  const gridStartX = w / 2 - (cols * cellW) / 2;
  skills.forEach((skill, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = gridStartX + col * cellW + cellW / 2;
    const sy = y + row * cellH;
    doc.text(`- ${skill}`, x, sy, { align: "center" });
  });

  // Footer info
  y += 26;
  const footerY = y;
  doc.setFontSize(8);

  // Date
  doc.setTextColor(140, 140, 160);
  doc.text("DATE ISSUED", w / 2 - 60, footerY, { align: "center" });
  doc.setTextColor(200, 200, 220);
  doc.text(data.date, w / 2 - 60, footerY + 5, { align: "center" });

  // Quests
  doc.setTextColor(140, 140, 160);
  doc.text("QUESTS COMPLETED", w / 2, footerY, { align: "center" });
  doc.setTextColor(200, 200, 220);
  doc.text(`${data.questsCompleted} / 12`, w / 2, footerY + 5, { align: "center" });

  // Credential
  doc.setTextColor(140, 140, 160);
  doc.text("CREDENTIAL", w / 2 + 60, footerY, { align: "center" });
  doc.setTextColor(22, 163, 74);
  doc.text("Verified On-Chain", w / 2 + 60, footerY + 5, { align: "center" });

  // Attestation UID + link
  if (data.attestationUid) {
    y = footerY + 14;
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 160);
    doc.text("ON-CHAIN CREDENTIAL", w / 2, y, { align: "center" });
    doc.setTextColor(8, 145, 178);
    const shortUid = `${data.attestationUid.slice(0, 10)}...${data.attestationUid.slice(-8)}`;
    doc.text(`ID: ${shortUid}`, w / 2, y + 4, { align: "center" });

    if (data.attestationUrl) {
      const linkText = "View attestation on Base";
      doc.setTextColor(8, 145, 178);
      doc.text(linkText, w / 2, y + 9, { align: "center" });
      const linkWidth = doc.getTextWidth(linkText);
      doc.link(w / 2 - linkWidth / 2, y + 6, linkWidth, 5, { url: data.attestationUrl });
      // Underline
      doc.setDrawColor(8, 145, 178);
      doc.setLineWidth(0.2);
      doc.line(w / 2 - linkWidth / 2, y + 9.5, w / 2 + linkWidth / 2, y + 9.5);
    }
  }

  // Bottom tagline
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 120);
  doc.setFont("helvetica", "italic");
  doc.text('"From egg to operator — one quest at a time."', w / 2, h - 20, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  doc.text("learnopenclaw.ai • Verified on Base via Ethereum Attestation Service", w / 2, h - 15, { align: "center" });

  return doc.output("datauristring").split(",")[1]; // base64
}
