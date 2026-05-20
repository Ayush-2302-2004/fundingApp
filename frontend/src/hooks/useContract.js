import { useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import FACTORY_ABI from "../utils/FactoryABI.json";
import CAMPAIGN_ABI from "../utils/CampaignABI.json";

export function useContract() {
  const { signer, readProvider } = useWeb3();

  const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS;

  const factoryContract = useMemo(() => {
    if (!factoryAddress || !readProvider) return null;
    const connection = signer || readProvider;
    return new ethers.Contract(factoryAddress, FACTORY_ABI, connection);
  }, [signer, readProvider, factoryAddress]);

  const getCampaignContract = (address) => {
    const connection = signer || readProvider;
    if (!connection) return null;

    return new ethers.Contract(address, CAMPAIGN_ABI, connection);
  };

  const factoryContractWithSigner = useMemo(() => {
    if (!factoryAddress || !signer) return null;
    return new ethers.Contract(factoryAddress, FACTORY_ABI, signer);
  }, [signer, factoryAddress]);

  return {
    factoryContract,
    factoryContractWithSigner,
    getCampaignContract,
  };
}
