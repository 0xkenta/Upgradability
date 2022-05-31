import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { Contract, ContractFactory } from "ethers"

describe("upgradability", () => {
    let test1: Contract
    let test2: Contract
    let test3: Contract

    let test2Factory: ContractFactory
    let test3Factory: ContractFactory

    const initName = "Andi"
    const initNumber = 7

    const newNameInTest1 = "Benni"

    const newNameInTest2 = "Dietmer"
    const newNumberInTest2 = 9

    before(async () => {
        const test1Factory = await ethers.getContractFactory("Test1")
        test1 = await upgrades.deployProxy(test1Factory, [initName, initNumber])
        test2Factory = await ethers.getContractFactory("Test2")
        test3Factory = await ethers.getContractFactory("Test3")
    })

    describe("the first logic contract", () => {
        it("should initialize the name and number variables", async () => {
            expect(await test1.getName()).to.equal(initName)
            expect(await test1.number()).to.equal(initNumber)
        })
        it("should update name", async () => {
            await test1.updateName(newNameInTest1)
            expect(await test1.getName()).to.equal(newNameInTest1)
        })
    })
    
    describe("the second logic contract", () => {
        it("should keep the values in the proxy if upgradeProxy is executed", async () => {
            test2 = await upgrades.upgradeProxy(test1.address, test2Factory)
            expect(await test2.getName()).to.equal(newNameInTest1)
            expect(await test2.getNumber()).to.equal(initNumber)
        })
        // a new functionality which is added in the second logic contract
        it("should set new number using the new logic contract", async () => {
            await test2.updateNumber(newNumberInTest2)
            expect(await test2.getNumber()).to.equal(newNumberInTest2)
        })
        it("should update the name variable", async () => {
            expect(await test2.getName()).to.equal(newNameInTest1)
            await test2.updateName(newNameInTest2)
            expect(await test2.getName()).to.equal(newNameInTest2)
        })
    })
    
    describe("the third logic contract", () => {
        it("should keep the values in the proxy if upgradeProxy is executed", async () => {
            test3 = await upgrades.upgradeProxy(test2.address, test3Factory)
            expect(await test3.getName()).to.equal(newNameInTest2)
            expect(await test3.number()).to.equal(newNumberInTest2)
        })
        // a new state variable and the setter for it is added in the third logic contract 
        it("should exist and update a new state variable", async () => {
            expect(await test3.country()).to.equal("")
            await test3.updateCountry("Brasil")
            expect(await test3.country()).to.equal("Brasil")
        })
        // the functionality of the getNumber() is modified 
        it("should return number + 100 when the updated getNumber function called", async () => {
            const number = await test3.number() 
            expect((await test3.getNumber()).toString()).to.equal(number.add(100).toString())
        })
    })

    describe("Proxy", () => {
        it("should always be the same proxy contract", async () => {
            expect(test1.address).to.equal(test2.address)
            expect(test2.address).to.equal(test3.address)
        })
    })
})