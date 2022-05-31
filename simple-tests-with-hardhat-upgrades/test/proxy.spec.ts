import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { Contract } from "ethers"
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

describe("proxy", () => {
    let test1: Contract
    let owner: SignerWithAddress
    let nextOwner: SignerWithAddress

    before(async () => {
        const TEST1 = await ethers.getContractFactory("Test1")
        test1 = await upgrades.deployProxy(TEST1, ["Bod", 7])
        ;[owner, nextOwner] = await ethers.getSigners()
    })
    
    it("should return values which are set by initializazion", async () => {
        expect(await test1.getName()).to.equal("Bod")
        expect(await test1.number()).to.equal(7)
    })
    it("should set the new name", async () => {
        await test1.updateName("Alice")
        expect(await test1.getName()).to.equal("Alice")
    })
    it("should set a new proxy admin owner", async () => {
        const adminProxyOwnerBefore = await (await upgrades.admin.getInstance()).owner()
        expect(adminProxyOwnerBefore).to.equal(owner.address)
        
        await upgrades.admin.transferProxyAdminOwnership(nextOwner.address)
        
        const adminProxyOwnerAfter = await (await upgrades.admin.getInstance()).owner()
        expect(adminProxyOwnerAfter).to.equal(nextOwner.address)
    })
})