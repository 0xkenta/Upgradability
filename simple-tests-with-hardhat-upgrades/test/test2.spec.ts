import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract } from 'ethers'

describe("Test2", () => {
    let test2: Contract;
    const newName = "Andi"
    const newNumber = 9

    before(async () => {
        test2 = await (await ethers.getContractFactory("Test2")).deploy()
    })

    it("should update the name variable", async () => {
        expect(await test2.getName()).to.equal("")
        await test2.updateName(newName)
        expect(await test2.getName()).to.equal(newName)    
    })
    it("should return the name varible", async () => {
        expect(await test2.getName()).to.equal(newName)
    })
    it("should update the number variable", async () => {
        expect(await test2.number()).to.equal(0)
        await test2.updateNumber(newNumber)
        expect(await test2.number()).to.equal(newNumber)
    })
    it("should return the number variable", async () => {
        expect(await test2.getNumber()).to.equal(newNumber)    
    })
})