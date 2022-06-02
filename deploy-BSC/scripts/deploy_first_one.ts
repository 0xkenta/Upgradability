import { ethers } from "hardhat"
import { upgrades } from "hardhat"

async function main() {

  const TestPool1 = await ethers.getContractFactory("TestPool1")
  console.log("Deploying TestPool1...")

  const mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
  const testPool1 = await upgrades.deployProxy(TestPool1, [mockNFT.address])

  console.log(testPool1.address," test1(proxy) address")
  console.log(await upgrades.erc1967.getImplementationAddress(testPool1.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(testPool1.address)," getAdminAddress")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})