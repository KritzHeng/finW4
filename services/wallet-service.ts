import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any; //TODO find the type
  }
}
export const getProvider = () => {
  const ethereum = getEthereum();
  if (ethereum) {
    return new ethers.providers.Web3Provider(getEthereum());
  }
  return null;
};

export const getEthereum = () => {
  if (typeof window.ethereum !== "undefined") {
    return window.ethereum;
  }
  return null;
};

export const connectWallet = async () => {
  return getEthereum()?.request({
    method: "eth_requestAccounts",
  }) as Promise<string>;
};

export const getWalletAddress = () => {
  return getEthereum()?.selectedAddress;
  //   if (window.ethereum !== "undefined") {
  //     const walletAddr = (window.ethereum as any).selectedAddress;
  //     return walletAddr as string;
  //   }
  //   return null;
};

export const getChainId = () => {
  return getEthereum()?.request({ method: "eth_chainId" }) as Promise<string>;
  // if (window.ethereum !== "undefined") {
  //     return ethereum.request({ method: "eth_chainId" });
  // }
  // return null;
};
export const getBalance = (address: string) => {
  const provider = getProvider();
  return provider?.getBalance(address);
};
