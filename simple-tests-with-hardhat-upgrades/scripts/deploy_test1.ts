import { ethers } from "hardhat"
import { upgrades } from "hardhat"

async function main() {

  const Test1 = await ethers.getContractFactory("Test1")
  console.log("Deploying Test1...")
  const test1 = await upgrades.deployProxy(Test1, ["Bod"])

  console.log(test1.address," test1(proxy) address")
  console.log(await upgrades.erc1967.getImplementationAddress(test1.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(test1.address)," getAdminAddress")    
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})