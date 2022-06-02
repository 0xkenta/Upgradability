import { ethers } from "hardhat"
import { upgrades } from "hardhat"

const proxyAddress = "0xFb3CDCfcFc4151D907cEf596C759688980eC0ec0"

async function main() {
  const mockERC20 = await (await ethers.getContractFactory("MockERC20")).deploy()
  console.log(mockERC20.address, "MockERC20 contract")

  const TestPool3 = await ethers.getContractFactory("TestPool3")
  const testPool3 = await upgrades.upgradeProxy(proxyAddress, TestPool3)
  
  console.log(testPool3.address,"proxy after upgrade")
  console.log(await upgrades.erc1967.getImplementationAddress(testPool3.address)," getImplementationAddress after upgrade")
  console.log(await upgrades.erc1967.getAdminAddress(testPool3.address)," getAdminAddress after upgrade")   
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})