import { ethers } from "hardhat"

async function main() {
  const treasury = await (await ethers.getContractFactory("MockTreasury")).deploy()
  console.log(treasury.address, "mock treasury contract")  
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})