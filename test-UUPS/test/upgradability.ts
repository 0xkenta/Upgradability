import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { Test1 } from '../types'

describe("Upgradability", function () {
    let withLogic1: Test1
    let withLogic2: Test2
    
    before(async () => {
        const contractFactory = await ethers.getContractFactory("Test1")
        withLogic1 = await upgrades.deployProxy(contractFactory, [7], { kind: 'uups'})
    })

    it("should be initialized", async () => {
        expect(await withLogic1.number()).to.equal(7)
    })

    it("should set the number variable", async () => {
        await withLogic1.setNumber(12)
        expect(await withLogic1.number()).to.equal(12)
    })

    it("should update the logic contract and keep the state variable", async () => {
        const logic2Factory = await ethers.getContractFactory("Test2")
        withLogic2 = await upgrades.upgradeProxy(withLogic1, logic2Factory)
        
        expect(await withLogic2.number()).to.equal(12) 
    })
    it("should set the secondNumber", async () => {
        expect(await withLogic2.secondNumber()).to.equal(0)

        await withLogic2.setSecondNumber(55)

        expect(await withLogic2.secondNumber()).to.equal(55)
    })
});
 