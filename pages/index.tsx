import type { NextPage } from "next";
import * as ethers from "ethers";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getWalletAddress,
  getChainId,
  getEthereum,
  getBalance,
  getProvider,
} from "../services/wallet-service";
import {
  getNetworkName,
  getNetworkCurrency,
  getNetworkTokens,
} from "../constants/network-id";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Token } from "../types/token.type";
const Home: NextPage = () => {
  // useEffect(() => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  // }, []);

  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>(
    {}
  );



  // const connectWallet = async () => {
  //   if (window.ethereum !== "undefined" && window.ethereum.request) {
  //     const address = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     console.log(address);
  //     // window.ethereum.request({ method: "eth_requestAccounts" });
  //     // console.log((window.ethereum as any).selectedAddress);

  //     // const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   }
  // };

  const getTokenBalance = async (
    tokenAddress: string,
    ownerAddress: string
  ) => {
    const abi = ["function balanceOf(address owner) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, getProvider()!);
    return contract.balanceOf(ownerAddress);
  };


  const loadAccountData = async () => {
    const addr = getWalletAddress();
    setAddress(getWalletAddress());

    const chainId = await getChainId();
    setNetwork(chainId);

    const bal = await getBalance(addr);
    if (bal) {
      setBalance(formatEther(bal));
    }
    const tokenList = getNetworkTokens(chainId);

    const tokenBalList = await Promise.all(
      tokenList.map((token) =>
        getTokenBalance(token.address, addr).then((res) =>
          formatUnits(res, token.decimals)
        )
      )
    );

    tokenList.forEach((token, i) => {
      tokenBalances[token.symbol] = tokenBalList[i];
    });
    setTokenBalances({ ...tokenBalances });
  };

  useEffect(() => {
    loadAccountData();
    const handleAccountChange = (address: string[]) => {
      loadAccountData();
      setAddress(address[0]);
    };
    const handleNetworkChange = (networkId: string) => {
      loadAccountData();
      setNetwork(networkId);
    };

    getEthereum()?.on("accountsChanged", handleAccountChange);
    // window.ethereum.on('accountsChanged', (address: string[]) => {
    //     setAddress(address[0]);
    // });
    getEthereum()?.on("chainChanged", handleNetworkChange);
    // window.ethereum.on('chainChanged', (networkId: string) => {
    //     setNetwork(networkId);
    // });
    //
  }, []);
  const addTokenToWallet = async (token: Token) => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            image: token.imageUrl, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <p>hello</p>
      {address ? (
        <div>
          <p>your wallet is: {address}</p>
          <p>Current network is: {getNetworkName(network)}</p>
          <p>
            Your blance is {balance} {getNetworkCurrency(network)}
          </p>

          <div>
            {getNetworkTokens(network).map((token) => (
              <div key={token.symbol} className="flex mb-4">
                <div>
                  <img
                    onClick={() => addTokenToWallet(token)}
                    src={token.imageUrl}
                    className="w-12 h-12 mr-8 cursor-pointer"
                  />
                </div>
                <div>
                  <div>
                    {token.name} ({token.symbol})
                  </div>
                  <div>
                    {tokenBalances[token.symbol] || 0} {token.symbol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button type="button" onClick={connectWallet} className="text-balck">
          Connect
        </button>
      )}
    </div>
  );
};

export default Home;
