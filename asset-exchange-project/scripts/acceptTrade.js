const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xD285A3954cd7E4A9Ef4D55F00E23aE535A348977";
  const [originalSigner] = await ethers.getSigners();
  
  const Contract = await ethers.getContractFactory("Contract", originalSigner);
  const contract = Contract.attach(contractAddress);

  // Accept the first proposal for listing #1
  let tx = await contract.acceptTrade(1, 1);
  await tx.wait();

  console.log("Trade accepted by original signer. Asset ownership swapped.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
