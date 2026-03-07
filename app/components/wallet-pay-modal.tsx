"use client";

import { useState } from "react";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, type Address } from "viem";
import { base } from "wagmi/chains";

// USDC on Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address;
const RECIPIENT = "0xd7aca290774a6def1Fc7C50C185B4e4107988aBc" as Address;
const AMOUNT = parseUnits("20", 6); // 20 USDC (6 decimals)

// ERC20 transfer ABI
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

interface Props {
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

export function WalletPayModal({ onClose, onSuccess }: Props) {
  const { isConnected, chain } = useAccount();
  const [error, setError] = useState("");
  const [step, setStep] = useState<"connect" | "pay" | "confirming" | "verifying">("connect");

  const { writeContract, data: txHash, isPending: isSending } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setStep("confirming");
      },
      onError: (err) => {
        setError(err.message?.includes("rejected")
          ? "Transaction rejected."
          : err.message?.includes("insufficient")
            ? "Insufficient USDC balance."
            : "Transaction failed. Please try again.");
      },
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: base.id,
    query: {
      enabled: !!txHash,
    },
  });

  // When confirmed on-chain, verify with our backend
  if (isConfirmed && txHash && step === "confirming") {
    setStep("verifying");
    onSuccess(txHash);
  }

  function handlePay() {
    setError("");
    if (chain?.id !== base.id) {
      setError("Please switch to Base network in your wallet.");
      return;
    }
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [RECIPIENT, AMOUNT],
      chainId: base.id,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100">Pay with Wallet</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-4 text-center">
            <p className="text-2xl font-bold text-slate-100">20 USDC</p>
            <p className="text-sm text-slate-400 mt-1">on Base network</p>
          </div>

          {!isConnected ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-slate-400">Connect your wallet to pay</p>
              <ConnectButton />
            </div>
          ) : step === "confirming" || step === "verifying" ? (
            <div className="text-center py-4">
              <div className="animate-spin text-4xl mb-3">⏳</div>
              <p className="text-slate-300 font-medium">
                {step === "confirming" ? "Confirming on Base..." : "Verifying payment..."}
              </p>
              {txHash && (
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 underline mt-2 inline-block"
                >
                  View on BaseScan →
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <ConnectButton showBalance={false} />
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-400">
                <p>⚠️ <strong className="text-slate-300">Please confirm:</strong></p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Network: <span className="text-cyan-300">Base</span></li>
                  <li>• Token: <span className="text-cyan-300">USDC</span></li>
                  <li>• Amount: <span className="text-cyan-300">20 USDC</span></li>
                </ul>
              </div>

              <button
                onClick={handlePay}
                disabled={isSending}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:bg-slate-700 disabled:text-slate-500 hover:bg-blue-500 transition-colors"
              >
                {isSending ? "Confirm in wallet..." : "Pay 20 USDC"}
              </button>
            </div>
          )}

          {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
