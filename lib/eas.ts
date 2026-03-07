import { ethers } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

// Base Mainnet EAS contract
const EAS_CONTRACT = "0x4200000000000000000000000000000000000021";
const BASE_RPC = "https://mainnet.base.org";

// Our schema: registered once on Base
// Schema: string name, string email, uint64 completionDate, string credentialId, uint8 questsCompleted
// We'll register this and store the UID as env var
const SCHEMA_UID = process.env.EAS_SCHEMA_UID || "";

export interface AttestationData {
  name: string;
  email: string;
  completionDate: number;
  credentialId: string;
  questsCompleted: number;
}

export async function createAttestation(data: AttestationData): Promise<{ uid: string; txHash: string } | null> {
  const privateKey = process.env.EAS_WALLET_PRIVATE_KEY;
  if (!privateKey || !SCHEMA_UID) {
    console.error("Missing EAS_WALLET_PRIVATE_KEY or EAS_SCHEMA_UID");
    return null;
  }

  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC);
    const signer = new ethers.Wallet(privateKey, provider);
    const eas = new EAS(EAS_CONTRACT);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder(
      "string name,string email,uint64 completionDate,string credentialId,uint8 questsCompleted"
    );

    const encodedData = schemaEncoder.encodeData([
      { name: "name", value: data.name, type: "string" },
      { name: "email", value: "", type: "string" },
      { name: "completionDate", value: BigInt(data.completionDate), type: "uint64" },
      { name: "credentialId", value: data.credentialId, type: "string" },
      { name: "questsCompleted", value: BigInt(data.questsCompleted), type: "uint8" },
    ]);

    const tx = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient: ethers.ZeroAddress, // No specific recipient wallet needed
        expirationTime: BigInt(0), // Never expires
        revocable: false,
        data: encodedData,
      },
    });

    const uid = await tx.wait();

    return {
      uid,
      txHash: "",
    };
  } catch (err) {
    console.error("EAS attestation error:", err);
    return null;
  }
}

export function getAttestationUrl(uid: string): string {
  return `https://base.easscan.org/attestation/view/${uid}`;
}
