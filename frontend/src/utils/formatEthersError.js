import { Interface } from "ethers";

/**
 * Turn nested ethers / RPC / MetaMask errors into a short user-visible string.
 */
export function formatEthersError(err) {
  if (!err) return "Unknown error.";

  const code = err.code;
  if (code === "ACTION_REJECTED" || code === 4001) {
    return "Transaction was rejected in your wallet.";
  }

  if (code === "UNSUPPORTED_OPERATION") {
    return err.message || "This operation is not supported.";
  }

  const reason = err.reason || err.revert?.args?.[0];
  if (reason && typeof reason === "string") return reason;

  const data = err.data;
  if (typeof data === "string" && data.length > 2 && data !== "0x") {
    try {
      const iface = new Interface(["error Error(string)"]);
      const parsed = iface.parseError(data);
      if (parsed?.args?.[0]) return String(parsed.args[0]);
    } catch {
      /* ignore */
    }
  }

  const nested = err.error ?? err.cause;
  if (nested && nested !== err) {
    const inner = formatEthersError(nested);
    if (inner && inner !== "Unknown error.") return inner;
  }

  const msg = err.shortMessage || err.message;
  if (msg && !/could not coalesce error/i.test(msg)) return msg;

  return "Transaction failed. Switch MetaMask to Polygon Amoy (chain 80002), ensure you have POL for gas, and that VITE_FACTORY_ADDRESS matches your deployed factory.";
}
