export function getDepositWalletStatusColor(status: string): string {
  return status === "ACTIVE" ? "success" : "default";
}

export function formatDepositWalletDateTime(value: string): string {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export function walletAssetKey(chainCode: string, assetCode: string, network?: string): string {
  return `${chainCode}:${assetCode}:${network ?? "mainnet"}`;
}

const TRON_ADDRESS_PATTERN = /^T[a-zA-Z0-9]{33}$/;
const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function validateDepositAddress(chainCode: string, address: string): boolean {
  const trimmed = address.trim();
  if (!trimmed) return false;
  const chain = chainCode.toUpperCase();
  if (chain === "TRON" || chain === "TRX") {
    return TRON_ADDRESS_PATTERN.test(trimmed);
  }
  if (chain === "ETH" || chain === "ETHEREUM" || chain === "BSC" || chain === "BNB") {
    return EVM_ADDRESS_PATTERN.test(trimmed);
  }
  return trimmed.length >= 20;
}

export type AddressValidationState = "empty" | "valid" | "invalid";

export function getAddressValidationState(chainCode: string | undefined, address: string): AddressValidationState {
  const trimmed = address.trim();
  if (!trimmed) return "empty";
  if (!chainCode) return "invalid";
  return validateDepositAddress(chainCode, trimmed) ? "valid" : "invalid";
}

export function getAddressFormatHint(chainCode: string | undefined): string | null {
  if (!chainCode) return null;
  const chain = chainCode.toUpperCase();
  if (chain === "TRON" || chain === "TRX") return "34 / T";
  if (chain === "ETH" || chain === "ETHEREUM" || chain === "BSC" || chain === "BNB") return "0x / Hex";
  return null;
}

/** Short badge text for chain avatar (e.g. TRX). */
export function getChainBadgeShort(chainCode: string): string {
  const chain = chainCode.toUpperCase();
  if (chain === "TRON") return "TRX";
  if (chain === "ETHEREUM") return "ETH";
  if (chain === "BNB" || chain === "BSC") return "BNB";
  return chain.slice(0, 3);
}

/** Token standard / network protocol label (e.g. TRC-20). */
export function getChainProtocolLabel(chainCode: string, network?: string): string {
  const chain = chainCode.toUpperCase();
  if (chain === "TRON" || chain === "TRX") return "TRC-20";
  if (chain === "ETH" || chain === "ETHEREUM") return "ERC-20";
  if (chain === "BSC" || chain === "BNB") return "BEP-20";
  return network || "mainnet";
}

export function formatNetworkLabel(network: string): string {
  return network || "mainnet";
}

export function formatChainAssetLabel(chainCode: string, assetCode: string): string {
  return `${chainCode} / ${assetCode}`;
}
