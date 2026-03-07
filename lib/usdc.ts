import { ethers } from "ethers";

// USDC on Base mainnet
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_RPC = "https://mainnet.base.org";
const RECEIVING_WALLET = "0xd7aca290774a6def1Fc7C50C185B4e4107988aBc";
const REQUIRED_AMOUNT = 10_000; // 0.01 USDC (6 decimals) - TEST PRICE, change to 20_000_000 before launch

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function balanceOf(address) view returns (uint256)",
];

export async function verifyUSDCPayment(txHash: string): Promise<{ valid: boolean; from: string; amount: string }> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return { valid: false, from: "", amount: "0" };
    }

    const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
    
    for (const log of receipt.logs) {
      try {
        const parsed = usdc.interface.parseLog({ topics: [...log.topics], data: log.data });
        if (
          parsed &&
          parsed.name === "Transfer" &&
          parsed.args.to.toLowerCase() === RECEIVING_WALLET.toLowerCase() &&
          parsed.args.value >= BigInt(REQUIRED_AMOUNT)
        ) {
          return {
            valid: true,
            from: parsed.args.from,
            amount: ethers.formatUnits(parsed.args.value, 6),
          };
        }
      } catch {
        continue;
      }
    }

    return { valid: false, from: "", amount: "0" };
  } catch (err) {
    console.error("USDC verification error:", err);
    return { valid: false, from: "", amount: "0" };
  }
}

export function getPaymentDetails() {
  return {
    address: RECEIVING_WALLET,
    amount: "20",
    token: "USDC",
    chain: "Base",
    chainId: 8453,
  };
}
