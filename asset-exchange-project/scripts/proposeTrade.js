const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xD285A3954cd7E4A9Ef4D55F00E23aE535A348977";
  const [originalSigner, secondSigner] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("Contract", secondSigner);
  const contract = Contract.attach(contractAddress);

  // Second signer registers asset #3 (the desired asset)
  let tx = await contract.registerAsset("Second Signer's Asset #3");
  await tx.wait();

  // Propose trade on listing #1, offering asset #3
  const asset3 = await contract.assets(3);
  console.log("Asset #3 Owner:", asset3[0]);

  tx = await contract.proposeTrade(1, 3);
  await tx.wait();

  console.log(
    "Trade proposed by second signer, offering Asset #3 for Asset #1."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
