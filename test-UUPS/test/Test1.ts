import { ethers } from "hardhat";
import { expect } from "chai";
import { Test1 } from '../types'

describe("Test1", function () {
    let contract: Test1  
    
    before(async () => {
        const contractFactory = await ethers.getContractFactory("Test1")
        contract = await contractFactory.deploy()
        await contract.initialize(7)
    })

    it("should be initialized", async () => {
        expect(await contract.number()).to.equal(7)
    })
    it("should set the number variable", async () => {
        await contract.setNumber(12)
        expect(await contract.number()).to.equal(12)
    })
});
 