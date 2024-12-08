const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xD285A3954cd7E4A9Ef4D55F00E23aE535A348977"; 
  const [originalSigner] = await ethers.getSigners();
  
  const Contract = await ethers.getContractFactory("Contract", originalSigner);
  const contract = Contract.attach(contractAddress);

  // Register two assets with the original signer
  let tx = await contract.registerAsset("Owner's Asset #1");
  await tx.wait();

  tx = await contract.registerAsset("Owner's Asset #2");
  await tx.wait();

  // Now we have:
  // Asset #1: Owner's Asset #1
  // Asset #2: Owner's Asset #2

  // List asset #1 for trade, but we want asset #3 (which doesn't exist yet)
  tx = await contract.listAssetForTrade(1, 3);
  await tx.wait();

  console.log("Setup complete: Asset #1 listed asking for Asset #3 in return.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
