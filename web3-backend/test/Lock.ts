import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SwagDogs", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  it("should mint and transfer an NFT to someone who has enough funds", async function () {
    const SwagDogs = await ethers.getContractFactory("SwagDogs");
    const swagDogs = await SwagDogs.deploy();
    await swagDogs.deployed();

    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Account #1
    const metadataURI = "cid/test.png";
    let balance = await swagDogs.balanceOf(recipient);
    expect(balance).to.equal(0);
    const newlyMintedToken = await swagDogs.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther("1"),
    });

    await newlyMintedToken.wait();
    balance = await swagDogs.balanceOf(recipient);
    expect(balance).to.equal(1);
    expect(await swagDogs.isContentOwned(metadataURI)).to.equal(true);
  });

  it("should not transfer an already owned NFT", async () => {
    const SwagDogs = await ethers.getContractFactory("SwagDogs");
    const swagDogs = await SwagDogs.deploy();
    await swagDogs.deployed();

    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Account #1
    const metadataURI = "cid/test.png";
    let balance = await swagDogs.balanceOf(recipient);
    expect(balance).to.equal(0);
    const newlyMintedToken = await swagDogs.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther("5"),
    });

    await newlyMintedToken.wait();
    balance = await swagDogs.balanceOf(recipient);
    expect(balance).to.equal(1);
    expect(await swagDogs.isContentOwned(metadataURI)).to.equal(true);

    const recipient2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Account #2
    try {
      await swagDogs.payToMint(recipient2, metadataURI, {
        value: ethers.utils.parseEther("1"),
      });
    } catch (e) {
      expect((e as any).message).to.equal(
        "VM Exception while processing transaction: reverted with reason string 'NFT already minted'"
      );
    }
  });

  it("buyer cannot bid an amount more than he owns", async () => {
    const SwagDogs = await ethers.getContractFactory("SwagDogs");
    const swagDogs = await SwagDogs.deploy();
    await swagDogs.deployed();

    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Account #1
    const metadataURI = "cid/test.png";
    let balance = await swagDogs.balanceOf(recipient);
    expect(balance).to.equal(0);
    try {
      await swagDogs.payToMint(recipient, metadataURI, {
        value: ethers.utils.parseEther("110000"),
      });
    } catch (e) {
      expect((e as any).message).to.match(
        /.*sender doesn't have enough funds to send tx.*/
      );
    }
  });
});
