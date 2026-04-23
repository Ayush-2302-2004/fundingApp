import { useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import FACTORY_ABI from "../utils/FactoryABI.json";
import CAMPAIGN_ABI from "../utils/CampaignABI.json";

export function useContract() {
  const { signer, provider } = useWeb3();

  const factoryAddress = import.meta.env.VITE_FACTORY_ADDRESS;

  const factoryContract = useMemo(() => {
    if (!factoryAddress) return null;
    return new ethers.Contract(factoryAddress, FACTORY_ABI, signerOrProvider);
  }, [signer, provider, factoryAddress]);

  const getCampaignContract = (address) => {
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    return new ethers.Contract(address, CAMPAIGN_ABI, signerOrProvider);
  };

  return {
    factoryContract,
    getCampaignContract,
  };
}
