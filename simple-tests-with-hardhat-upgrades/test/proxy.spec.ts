import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { Contract } from "ethers"

describe("proxy", () => {
    let test1: Contract

    before(async () => {
        const TEST1 = await ethers.getContractFactory("Test1")
        test1 = await upgrades.deployProxy(TEST1, ["Bod", 7])
    })
    
    it("should return values which are set by initializazion", async () => {
        expect(await test1.getName()).to.equal("Bod")
        expect(await test1.number()).to.equal(7)
    })
    it("should set the new name", async () => {
        await test1.updateName("Alice")
        expect(await test1.getName()).to.equal("Alice")
    })
})