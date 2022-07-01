import { ETH_TOKENS, KOVAN_TOKENS, RINKEBY_TOKENS } from "./tokens";

export const getNetworkName = (chainId: string | null) => {
  switch (chainId) {
    case "0x1":
      return "Ethereum mainnet";
    case "0x2a":
      return "Kovan";
    case "0x4":
      return "Rinkeby";
    case "0x38":
      return "Binance Smart Chain";
    case "0x61":
      return "Binance Smart Chain Testnet";
    case "0x6545":
      return "Bitkub chain testnet";
    default:
      return "Unknown network";
  }
};

export const getNetworkCurrency = (chainId: string | null) => {
  switch (chainId) {
    case "0x38":
      return "BNB";
    case "0x61":
      return "BNB";
    case "0x6545":
      return "KUB";
    default:
      return "ETH";
  }
};

export const getNetworkTokens = (chainId: string | null) => {
  switch (chainId) {
    case "0x1":
      return ETH_TOKENS;
    case "0x2a":
      return KOVAN_TOKENS;
    case "0x4":
      return RINKEBY_TOKENS;
    case "0x38":
      return ETH_TOKENS;
    case "0x61":
      return ETH_TOKENS;
    case "0x6545":
      return ETH_TOKENS;
    default:
      return ETH_TOKENS;
  }
};
export const getNetworkToken = (
  chainId: string | null,
  tokenSymbol: string
) => {
  let tokenList = ETH_TOKENS;
  switch (chainId) {
    case "0x1":
      tokenList = ETH_TOKENS;
      break;
    case "0x2a":
      tokenList = KOVAN_TOKENS;
      break;
    case "0x4":
      tokenList = RINKEBY_TOKENS;
      break;
    case "0x38":
      tokenList = ETH_TOKENS;
      break;
    case "0x61":
      tokenList = ETH_TOKENS;
      break;
    case "0x6545":
      tokenList = ETH_TOKENS;
      break;
    default:
      tokenList = ETH_TOKENS;
      break;
  }
  return tokenList.find((token) => token.symbol === tokenSymbol);
};
