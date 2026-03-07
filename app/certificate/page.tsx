"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const STORAGE_KEY = "openclaw-quests-completed";
const NAME_KEY = "openclaw-quests-name";

function CertificateContent() {
  const searchParams = useSearchParams();
  const [completedCount, setCompletedCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "crypto" | null>(null);
  const [isAttesting, setIsAttesting] = useState(false);
  const [attestation, setAttestation] = useState<{ uid: string; url: string } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [cryptoVerifying, setCryptoVerifying] = useState(false);
  const [showMintCelebration, setShowMintCelebration] = useState(false);
  const [error, setError] = useState("");

  const fireConfetti = useCallback(async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#d97706", "#fbbf24", "#67e8f9", "#4ade80"] });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
      }, 400);
      setTimeout(() => {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ["#d97706", "#fbbf24", "#67e8f9"] });
      }, 900);
    } catch { /* */ }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompletedCount((JSON.parse(saved) as number[]).length);
      const name = localStorage.getItem(NAME_KEY);
      if (name) setUserName(name); else setIsEditing(true);

      const payment = searchParams.get("payment");
      const sessionId = searchParams.get("session_id");
      if (payment === "success" && sessionId) {
        setIsPaid(true);
        localStorage.setItem("openclaw-quests-paid", "true");
        localStorage.setItem("openclaw-quests-session-id", sessionId);
      }
      if (localStorage.getItem("openclaw-quests-paid")) setIsPaid(true);

      const savedAtt = localStorage.getItem("openclaw-quests-attestation");
      if (savedAtt) setAttestation(JSON.parse(savedAtt));
    } catch { /* */ }
  }, [searchParams]);

  function saveName() {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem(NAME_KEY, nameInput.trim());
      setIsEditing(false);
    }
  }

  async function handleStripePayment() {
    setPaymentLoading(true);
    setError("");
    try {
      const email = localStorage.getItem("openclaw-quests-email") || "";
      const res = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: userName }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Failed to start checkout");
    } catch { setError("Network error."); }
    finally { setPaymentLoading(false); }
  }

  async function handleCryptoVerify() {
    if (!txHash.trim()) return;
    setCryptoVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/payment/verify-crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: txHash.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsPaid(true);
        setShowCryptoModal(false);
        localStorage.setItem("openclaw-quests-paid", "true");
        localStorage.setItem("openclaw-quests-payment-method", "crypto");
      } else {
        setError(data.error || "Could not verify payment.");
      }
    } catch { setError("Network error."); }
    finally { setCryptoVerifying(false); }
  }

  async function handleAttest() {
    setIsAttesting(true);
    setError("");
    try {
      const sessionId = localStorage.getItem("openclaw-quests-session-id") || searchParams.get("session_id") || "crypto-payment";
      const res = await fetch("/api/attest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, name: userName, questsCompleted: completedCount }),
      });
      const data = await res.json();
      if (data.uid) {
        const att = { uid: data.uid, url: data.url };
        setAttestation(att);
        localStorage.setItem("openclaw-quests-attestation", JSON.stringify(att));
        setShowMintCelebration(true);
        fireConfetti();
      } else {
        setError(data.error || "Failed to create attestation");
      }
    } catch { setError("Network error."); }
    finally { setIsAttesting(false); }
  }

  const hatchDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const isHatched = completedCount >= 12;
  const ogImageUrl = `/api/og?name=${encodeURIComponent(userName)}&date=${encodeURIComponent(hatchDate)}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (!isHatched) {
    return (
      <main className="min-h-screen bg-slate-950 grid place-items-center p-8 text-slate-100">
        <div className="text-center">
          <p className="text-6xl mb-4">🥚</p>
          <h1 className="text-2xl font-bold">Not yet!</h1>
          <p className="mt-2 text-slate-400">Complete at least 10 of 12 quests to earn your certificate.</p>
          <a href="/dashboard" className="mt-4 inline-block text-cyan-400 underline">← Back to quests</a>
        </div>
      </main>
    );
  }

  if (isEditing || !userName) {
    return (
      <main className="min-h-screen bg-slate-950 grid place-items-center p-8 text-slate-100">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">🏆</p>
          <h1 className="text-2xl font-bold">Enter Your Name</h1>
          <p className="mt-2 text-slate-400">This will appear on your official certificate.</p>
          <div className="mt-6 flex gap-2">
            <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} placeholder="Your full name" className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-center text-lg focus:border-cyan-500 focus:outline-none" autoFocus />
            <button onClick={saveName} disabled={!nameInput.trim()} className="rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-900 disabled:bg-slate-700">Continue</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-cyan-400 underline">← Back to quests</a>
          <button onClick={() => setIsEditing(true)} className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-300">Edit name</button>
        </div>

        {/* ===== PAYMENT / MINT CTA — TOP ===== */}
        {!isPaid && (
          <div className="mb-8 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900 p-8 text-center">
            <p className="text-5xl mb-3">🏆</p>
            <h2 className="text-2xl font-black text-slate-100">Get Your Verified Credential</h2>
            <p className="mt-2 text-slate-400 max-w-lg mx-auto">
              Mint your certificate as a permanent on-chain attestation on Base. Share it on LinkedIn and X as verified proof of your skills.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleStripePayment} disabled={paymentLoading} className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-bold text-slate-900 text-lg transition-transform hover:scale-105 disabled:opacity-50">
                {paymentLoading ? "Loading..." : "💳 Pay $20 with Card"}
              </button>
              <button onClick={() => setShowCryptoModal(true)} className="rounded-lg border-2 border-blue-500/50 bg-blue-950/20 px-8 py-4 font-bold text-blue-300 text-lg transition-transform hover:scale-105 hover:border-blue-400">
                🔵 Pay 20 USDC on Base
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Includes: On-chain EAS attestation on Base • Official certificate • Shareable social proof • Permanent verifiable credential
            </p>
            {error && !showCryptoModal && <p className="mt-3 text-sm text-rose-400">{error}</p>}
          </div>
        )}

        {isPaid && !attestation && (
          <div className="mb-8 rounded-2xl border-2 border-green-500/30 bg-green-950/20 p-8 text-center">
            <p className="text-5xl mb-3">✅</p>
            <h2 className="text-2xl font-bold text-green-300">Payment Confirmed!</h2>
            <p className="mt-2 text-slate-400">Click below to mint your credential. This creates a permanent, verifiable attestation on-chain and issues your official certificate.</p>
            <button onClick={handleAttest} disabled={isAttesting} className="mt-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 font-bold text-white text-lg transition-transform hover:scale-105 disabled:opacity-50">
              {isAttesting ? "⏳ Minting on Base..." : "🔗 Mint On-Chain Credential"}
            </button>
            {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
          </div>
        )}

        {attestation && (
          <div className="mb-8 rounded-2xl border-2 border-green-500/30 bg-green-950/20 p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-green-400 mb-2">✅ Verified On-Chain (Base)</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={attestation.url} target="_blank" rel="noreferrer" className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500">
                🔗 Proof of Certification
              </a>
              <button onClick={() => {
                const text = `🦞 I just earned my OpenClaw Operator credential — verified on-chain on Base!\n\nVerify: ${attestation.url}\n\n@LearnOpenClaw #AIAgents #Web3`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(ogImageUrl)}`, "_blank");
              }} className="rounded-lg bg-slate-800 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-700">
                Share on 𝕏
              </button>
              <button onClick={() => {
                const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedInUrl, "_blank");
              }} className="rounded-lg bg-[#0A66C2] px-6 py-3 font-semibold text-white hover:bg-[#004182]">
                Share on LinkedIn
              </button>
            </div>
          </div>
        )}

        {/* ACTIONS: Print & Email */}
        {isPaid && attestation && (
          <div className="mb-6 text-center no-print">
            <h1 className="text-2xl font-bold text-slate-100 mb-4">🎓 View Your Certificate</h1>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={async () => {
                const { jsPDF: JsPDF } = await import("jspdf");
                const doc = new JsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
                const w = doc.internal.pageSize.getWidth();
                const h = doc.internal.pageSize.getHeight();
                doc.setFillColor(26, 26, 46); doc.rect(0, 0, w, h, "F");
                doc.setDrawColor(217, 119, 6); doc.setLineWidth(2); doc.rect(8, 8, w - 16, h - 16);
                doc.setLineWidth(0.5); doc.rect(14, 14, w - 28, h - 28);
                let y = 35;
                doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(217, 119, 6);
                doc.text("L E A R N   O P E N C L A W", w / 2, y, { align: "center" });
                y += 5; doc.setLineWidth(0.3); doc.line(w / 2 - 30, y, w / 2 + 30, y);
                y += 12; doc.setFontSize(11);
                doc.text("C E R T I F I C A T E   O F   C O M P L E T I O N", w / 2, y, { align: "center" });
                y += 14; doc.setFontSize(10); doc.setTextColor(160, 160, 180); doc.setFont("helvetica", "italic");
                doc.text("This is to certify that", w / 2, y, { align: "center" });
                y += 14; doc.setFont("times", "bold"); doc.setFontSize(36); doc.setTextColor(255, 220, 130);
                doc.text(userName, w / 2, y, { align: "center" });
                y += 5; doc.setDrawColor(217, 119, 6); doc.setLineWidth(0.3); doc.line(w / 2 - 50, y, w / 2 + 50, y);
                y += 10; doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(180, 180, 200);
                doc.text("has successfully completed the OpenClaw Quests Program and demonstrated", w / 2, y, { align: "center" });
                doc.text("proficiency in AI agent deployment, automation, and operations.", w / 2, y + 5, { align: "center" });
                doc.text("This individual has earned the title of:", w / 2, y + 10, { align: "center" });
                y += 22; doc.setDrawColor(217, 119, 6); doc.setLineWidth(0.8); doc.setFillColor(40, 30, 20);
                doc.roundedRect(w / 2 - 40, y - 8, 80, 14, 3, 3, "FD");
                doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(252, 211, 77);
                doc.text("OpenClaw Operator", w / 2, y, { align: "center" });
                y += 16; const skills = ["Terminal & SSH", "VPS Management", "AI Model Config", "OpenClaw Deployment", "Chat Integration", "Agent Memory", "Task Automation", "Web Search & Skills", "Social Media APIs", "Server Security", "Dashboard Ops", "Full Deployment"];
                doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(160, 160, 180);
                skills.forEach((skill, i) => { const col = i % 4; const row = Math.floor(i / 4); doc.text(`✦ ${skill}`, w / 2 - 75 + col * 50, y + row * 6, { align: "center" }); });
                y += 26; doc.setFontSize(8); doc.setTextColor(140, 140, 160);
                doc.text("DATE ISSUED", w / 2 - 60, y, { align: "center" }); doc.setTextColor(200, 200, 220); doc.text(hatchDate, w / 2 - 60, y + 5, { align: "center" });
                doc.setTextColor(140, 140, 160); doc.text("QUESTS COMPLETED", w / 2, y, { align: "center" }); doc.setTextColor(200, 200, 220); doc.text(`${completedCount} / 12`, w / 2, y + 5, { align: "center" });
                doc.setTextColor(140, 140, 160); doc.text("CREDENTIAL", w / 2 + 60, y, { align: "center" }); doc.setTextColor(22, 163, 74); doc.text("Verified On-Chain", w / 2 + 60, y + 5, { align: "center" });
                if (attestation) { doc.setFontSize(7); doc.setTextColor(8, 145, 178); doc.text(`ID: ${attestation.uid.slice(0, 10)}...${attestation.uid.slice(-8)}`, w / 2, y + 14, { align: "center" }); }
                doc.setFontSize(7); doc.setTextColor(100, 100, 120); doc.setFont("helvetica", "italic");
                doc.text('"From egg to operator — one quest at a time."', w / 2, h - 20, { align: "center" });
                doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 100);
                doc.text("learnopenclaw.ai • Verified on Base via Ethereum Attestation Service", w / 2, h - 15, { align: "center" });
                doc.save(`OpenClaw-Certificate-${userName.replace(/\s+/g, "-")}.pdf`);
              }}
              className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
            >
              📄 Download PDF
            </button>
            <button
              onClick={async () => {
                const email = localStorage.getItem("openclaw-quests-email");
                if (!email) { setError("No email found. Please log in again."); return; }
                try {
                  const res = await fetch("/api/certificate/email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, name: userName, date: hatchDate, questsCompleted: completedCount, attestationUid: attestation?.uid, attestationUrl: attestation?.url }),
                  });
                  const data = await res.json();
                  if (data.ok) { setError(""); alert("Certificate sent to " + email + "!"); }
                  else { setError(data.error || "Failed to send email"); }
                } catch { setError("Network error sending email."); }
              }}
              className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-300 transition-colors hover:border-cyan-500 hover:text-cyan-300"
            >
              📧 Email Yourself
            </button>
            </div>
          </div>
        )}

        {/* ===== CONTENT DEPENDS ON PAID STATUS ===== */}
        {!isPaid || !attestation ? (
          /* QUEST SUMMARY (unpaid/pre-mint) */
          <div className={`relative overflow-hidden rounded-2xl border-2 ${!isPaid ? "border-slate-700" : "border-amber-500/30"} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12`}>
            {!isPaid && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <p className="text-7xl font-black text-slate-700/20 -rotate-45 select-none">PREVIEW</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-4xl mb-2">🥚→🦞</p>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quest Summary</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-200">{userName}&apos;s Journey</h2>
              <p className="mt-2 text-slate-400">Completed {completedCount} of 12 quests</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 max-w-lg mx-auto text-sm">
                {["Terminal & SSH", "VPS Management", "AI Model Config", "OpenClaw Setup", "Chat Integration", "Agent Memory", "Task Automation", "Web Search & Skills", "Social Media APIs", "Server Security", "Dashboard Ops", "Full Deployment"].map((skill) => (
                  <div key={skill} className="rounded-lg border border-slate-700 bg-slate-800/50 px-2 py-1.5 text-slate-400">✦ {skill}</div>
                ))}
              </div>
              <p className="mt-6 text-xs text-slate-600">Completed on {hatchDate}</p>
            </div>
          </div>
        ) : (
          /* OFFICIAL CERTIFICATE (paid + minted) */
          <div className="print-certificate relative overflow-hidden rounded-2xl border-4 border-amber-500/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-14 shadow-2xl shadow-amber-500/10">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-amber-500/40 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-amber-500/40 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-amber-500/40 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-amber-500/40 rounded-br-2xl" />

            {/* Decorative line pattern */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border border-amber-500/10 rounded-xl pointer-events-none" />

            <div className="relative border-2 border-amber-500/20 rounded-xl p-8 md:p-12">
              <div className="text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <svg viewBox="0 0 240 180" width="100" height="75">
                    <ellipse cx="120" cy="95" rx="40" ry="45" fill="#ff6b6b" />
                    <ellipse cx="120" cy="105" rx="34" ry="28" fill="#ff4444" />
                    <circle cx="108" cy="82" r="10" fill="white" />
                    <circle cx="132" cy="82" r="10" fill="white" />
                    <circle cx="110" cy="80" r="5" fill="#1a1a2e" />
                    <circle cx="134" cy="80" r="5" fill="#1a1a2e" />
                    <circle cx="111" cy="78" r="2" fill="white" />
                    <circle cx="135" cy="78" r="2" fill="white" />
                    <path d="M 110,100 Q 120,112 130,100" fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
                    <ellipse cx="72" cy="90" rx="14" ry="9" fill="#ff6b6b" transform="rotate(-40,72,90)" />
                    <ellipse cx="168" cy="90" rx="14" ry="9" fill="#ff6b6b" transform="rotate(40,168,90)" />
                  </svg>
                </div>

                <p className="text-xs uppercase tracking-[0.4em] text-amber-400/60">Learn OpenClaw</p>
                <div className="mt-1 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                <h1 className="mt-6 text-sm uppercase tracking-[0.3em] text-amber-400/80">Certificate of Completion</h1>

                <div className="mt-8">
                  <p className="text-sm text-slate-500 italic">This is to certify that</p>
                  <h2 className="mt-3 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200" style={{ fontFamily: "Georgia, serif" }}>
                    {userName}
                  </h2>
                  <div className="mt-2 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                </div>

                <p className="mt-6 text-slate-400 max-w-lg mx-auto leading-relaxed">
                  has successfully completed the <span className="text-amber-300 font-semibold">OpenClaw Quests Program</span> and demonstrated proficiency in AI agent deployment, automation, and operations. This individual has earned the title of:
                </p>

                <div className="mt-6 inline-block rounded-xl border-2 border-amber-500/30 bg-amber-950/20 px-8 py-4">
                  <p className="text-2xl font-black text-amber-300 tracking-wide">🦞 OpenClaw Operator</p>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto text-xs">
                  {["Terminal & SSH", "VPS Management", "AI Model Configuration", "OpenClaw Deployment", "Chat Integration", "Agent Memory Systems", "Task Automation", "Web Search & Skills", "Social Media APIs", "Server Security", "Dashboard Operations", "Full Stack Deployment"].map((skill) => (
                    <div key={skill} className="rounded border border-slate-700/50 bg-slate-800/30 px-2 py-1 text-slate-400">✦ {skill}</div>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-center gap-10 text-sm">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-600 mb-1">Date Issued</p>
                    <p className="text-slate-300 font-medium">{hatchDate}</p>
                    <div className="mt-1 h-px w-24 bg-slate-700" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-600 mb-1">Quests Completed</p>
                    <p className="text-slate-300 font-medium">{completedCount} / 12</p>
                    <div className="mt-1 h-px w-24 bg-slate-700" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-600 mb-1">Credential</p>
                    <p className="text-green-400 font-medium">Verified On-Chain ✓</p>
                    <div className="mt-1 h-px w-24 bg-slate-700" />
                  </div>
                </div>

                {attestation && (
                  <div className="mt-6 rounded-lg border border-slate-700/50 bg-slate-800/20 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-600 mb-1">On-Chain Credential</p>
                    <p className="text-sm text-cyan-400 font-mono break-all">
                      ID: {attestation.uid.slice(0, 10)}...{attestation.uid.slice(-8)}
                    </p>
                    <a href={attestation.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-500 underline hover:text-cyan-400">
                      View on Base →
                    </a>
                  </div>
                )}

                <div className="mt-8">
                  <p className="text-xs text-slate-600 italic">&quot;From egg to operator — one quest at a time.&quot;</p>
                  <p className="mt-3 text-xs text-slate-700">openclaw.ai • Verified on Base via Ethereum Attestation Service</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRYPTO PAYMENT MODAL */}
        {showCryptoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100">Pay with USDC on Base</h3>
                <button onClick={() => { setShowCryptoModal(false); setError(""); }} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-4">
                  <p className="text-sm text-blue-300 font-medium mb-2">Send exactly 20 USDC to:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-slate-950 px-3 py-2 text-sm text-cyan-300 break-all">0xd7aca290774a6def1Fc7C50C185B4e4107988aBc</code>
                    <button onClick={() => navigator.clipboard.writeText("0xd7aca290774a6def1Fc7C50C185B4e4107988aBc")} className="shrink-0 rounded bg-slate-800 px-2 py-2 text-xs text-slate-400 hover:text-slate-200">Copy</button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-400">
                  <p>⚠️ <strong className="text-slate-300">Important:</strong></p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Network: <span className="text-cyan-300">Base</span> (not Ethereum mainnet)</li>
                    <li>• Token: <span className="text-cyan-300">USDC</span> (not USDT or ETH)</li>
                    <li>• Amount: <span className="text-cyan-300">20 USDC</span> exactly</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1">Paste your transaction hash:</label>
                  <input value={txHash} onChange={(e) => { setTxHash(e.target.value); setError(""); }} placeholder="0x..." className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none" />
                </div>

                <button onClick={handleCryptoVerify} disabled={cryptoVerifying || !txHash.trim()} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:bg-slate-700 disabled:text-slate-500">
                  {cryptoVerifying ? "Verifying on Base..." : "Verify Payment"}
                </button>

                {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 grid place-items-center text-slate-400">Loading...</div>}>
      <CertificateContent />
    </Suspense>
  );
}
