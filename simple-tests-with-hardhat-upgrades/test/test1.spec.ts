import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract } from 'ethers'

describe("Test1", () => {
    let test1: Contract;

    before(async () => {
        test1 = await (await ethers.getContractFactory("Test1")).deploy()
    })

    it("should initialize the name and number variables", async () => {
        const name = "Bod"
        const number = 7
        expect(await test1.getName()).to.equal("")
        expect(await test1.number()).to.equal(0)
        await test1.initialize(name, number)
        expect(await test1.getName()).to.equal(name)
        expect(await test1.number()).to.equal(number)
    })
    it("should revert if initialize will be called twice", async () => {
        await expect(test1.initialize("Alice", 7)).to.be.revertedWith("Initializable: contract is already initialized")    
    })
    it("should update the name after initializing", async () => {
        expect(await test1.getName()).to.equal("Bod")
        await test1.updateName("Andi")
        expect(await test1.getName()).to.equal("Andi")    
    })
})