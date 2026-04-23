const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying CampaignFactory...");
  const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory");
  const factory = await CampaignFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("CampaignFactory deployed to:", factoryAddress);
  // Save address to a file for frontend to use
  fs.mkdirSync("../frontend/src/utils", { recursive: true });
  fs.writeFileSync(
    "../frontend/src/utils/contractAddresses.json",
    JSON.stringify({ factory: factoryAddress }, null, 2),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
