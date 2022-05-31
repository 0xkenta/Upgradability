import { expect } from "chai"
import { ethers } from "hardhat"
import { Contract } from 'ethers'
import chai from "chai";
import { solidity } from "ethereum-waffle";

chai.use(solidity);

describe("Test3", () => {
    let test3: Contract;

    before(async () => {
        test3 = await (await ethers.getContractFactory("Test3")).deploy()
    })

    it("should return number + 100", async () => {
        expect(await test3.number()).to.equal(0)
        expect(await test3.getNumber()).to.equal(100)
    })
    it("should exist and update the state variable country", async () => {
        const newCountry = "Brasil"
        expect(await test3.country()).to.equal("")
        await expect(test3.updateCountry(newCountry))
            .to.emit(test3, 'CountryUpdated')
            .withArgs("", newCountry)
            expect(await test3.country()).to.equal(newCountry)
    })
})