const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xD285A3954cd7E4A9Ef4D55F00E23aE535A348977";
  const Contract = await ethers.getContractFactory("Contract");
  const contract = Contract.attach(contractAddress);

  // Register first asset
  let tx = await contract.registerAsset("New Asset on Testnet");
  let receipt = await tx.wait();
  console.log("Asset registered tx hash:", receipt.hash);

  const asset1 = await contract.assets(1);
  console.log("Asset #1 details:", {
    owner: asset1[0],
    details: asset1[1],
    exists: asset1[2]
  });

  // Register second asset
  tx = await contract.registerAsset("Second Test Asset");
  receipt = await tx.wait();
  console.log("Second asset registered tx hash:", receipt.hash);

  const asset2 = await contract.assets(2);
  console.log("Asset #2 details:", {
    owner: asset2[0],
    details: asset2[1],
    exists: asset2[2]
  });

  // List the first asset for trade
  tx = await contract.listAssetForTrade(1, 2);
  receipt = await tx.wait();
  console.log("Asset #1 listed for trade tx hash:", receipt.hash);

  const listing1 = await contract.listings(1);
  const assetId = Number(listing1[0]);
  const desiredAssetId = Number(listing1[1]);
  const lister = listing1[2];
  const active = listing1[3];

  console.log("Listing #1 details:", {
    assetId,
    desiredAssetId,
    lister,
    active
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
