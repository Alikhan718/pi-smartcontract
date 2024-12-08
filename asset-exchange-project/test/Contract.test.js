const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contract", function () {
  let contract, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Contract");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  it("Should register assets correctly", async () => {
    await contract.registerAsset("My first asset");
    const [assetOwner, details] = await contract.getAsset(1);
    expect(assetOwner).to.equal(owner.address);
    expect(details).to.equal("My first asset");
  });

  it("Should list asset for trade", async () => {
    await contract.registerAsset("Trade Asset");
    await contract.listAssetForTrade(1, 999);
    const [assetId, desiredAssetId, lister, active] = await contract.getListing(1);
    expect(assetId).to.equal(1);
    expect(desiredAssetId).to.equal(999);
    expect(lister).to.equal(owner.address);
    expect(active).to.equal(true);
  });

  it("Should allow proposing a trade", async () => {
    await contract.registerAsset("Owner Asset");
    await contract.connect(addr1).registerAsset("Addr1 Asset");
    await contract.listAssetForTrade(1, 2);

    await contract.connect(addr1).proposeTrade(1, 2);
    const [proposer, offeredId, requestedId, accepted] = await contract.getProposal(1, 1);
    expect(proposer).to.equal(addr1.address);
    expect(offeredId).to.equal(2);
    expect(requestedId).to.equal(1);
    expect(accepted).to.equal(false);
  });

  it("Should accept a trade and swap ownership", async () => {
    // Owner asset = #1
    await contract.registerAsset("Owner's Asset");
    // Addr1 asset = #2
    await contract.connect(addr1).registerAsset("Addr1's Asset");

    await contract.listAssetForTrade(1, 2);
    await contract.connect(addr1).proposeTrade(1, 2);

    await contract.acceptTrade(1, 1);

    const [ownerAfter, ] = await contract.getAsset(2);
    const [addr1After, ] = await contract.getAsset(1);
    expect(ownerAfter).to.equal(owner.address);
    expect(addr1After).to.equal(addr1.address);
  });
});
