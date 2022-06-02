import { ethers } from "hardhat"
import { upgrades } from "hardhat"

const proxyAddress = "0xFb3CDCfcFc4151D907cEf596C759688980eC0ec0"

async function main() {
  const TestPool2 = await ethers.getContractFactory("TestPool2")
  const testPool2 = await upgrades.upgradeProxy(proxyAddress, TestPool2)
  
  console.log(testPool2.address,"proxy after upgrade")
  console.log(await upgrades.erc1967.getImplementationAddress(testPool2.address)," getImplementationAddress after upgrade")
  console.log(await upgrades.erc1967.getAdminAddress(testPool2.address)," getAdminAddress after upgrade")   
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

