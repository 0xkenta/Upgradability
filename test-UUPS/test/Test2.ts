import { ethers } from "hardhat";
import { expect } from "chai";
import { Test2 } from '../types'

describe("Test2", function () {
    let contract: Test2
    
    before(async () => {
        const contractFactory = await ethers.getContractFactory("Test2")
        contract = await contractFactory.deploy()
        await contract.initialize(7, 34)
    })

    it("should be initialized", async () => {
        expect(await contract.number()).to.equal(7)
        expect(await contract.secondNumber()).to.equal(34)    
    })

    it("should set the number variables", async () => {
        await contract.setNumber(12)
        expect(await contract.number()).to.equal(12)

        await contract.setSecondNumber(24)
        expect(await contract.secondNumber()).to.equal(24)
    })
});
 