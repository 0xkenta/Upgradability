import { ethers } from "hardhat"
import { upgrades } from "hardhat"

async function main() {

  const V1 = await ethers.getContractFactory("V1")
  console.log("Deploying V1...")
  const v1 = await upgrades.deployProxy(V1, ["Bod"])

  console.log(v1.address," v1(proxy) address")
  console.log(await upgrades.erc1967.getImplementationAddress(v1.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(v1.address)," getAdminAddress")    
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})