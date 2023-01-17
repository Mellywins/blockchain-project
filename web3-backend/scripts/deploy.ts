import { ethers } from "hardhat";

async function main() {
  const SwagDogs = await ethers.getContractFactory("SwagDogs");
  const swagDogs = await SwagDogs.deploy();

  await swagDogs.deployed();

  console.log(`SwagDogs deployed to ${swagDogs.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
