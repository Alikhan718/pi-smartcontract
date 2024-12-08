const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("Contract");
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("Contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
