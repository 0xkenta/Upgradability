import { ethers } from 'hardhat'
import { constants } from 'ethers';
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { MockNFT, TestPool3, MockTreasury } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'


chai.use(solidity);

describe("TestPool3", () => {
    let testPool3: TestPool3
    let mockNFT: MockNFT
    let mockTreasury: MockTreasury

    let owner: SignerWithAddress
    let other: SignerWithAddress

    beforeEach(async () => {
        [owner, other] = await ethers.getSigners()

        mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
        mockTreasury = await (await ethers.getContractFactory("MockTreasury")).deploy()
        testPool3 = await (await ethers.getContractFactory("TestPool3")).deploy()
        await testPool3.deployed()
        await testPool3.initialize(mockNFT.address)
    })

    describe("setTreasury()", () => {
        describe("fail", () => {
            it("should revert if msg.sender is not a contract owner", async () => {
                await expect(testPool3.connect(other).setTreasury(mockTreasury.address))
                    .to.be.revertedWith('Ownable: caller is not the owner')
            })
            it("should revert if the param is an empty address", async () => {
                await expect(testPool3.setTreasury(constants.AddressZero))
                    .to.be.revertedWith('EMPTY ADDRESS')    
            })
        })
        describe("success", () => {
            it("should update a treasury address", async () => {
                expect(await testPool3.treasury()).to.equal(constants.AddressZero)

                await testPool3.setTreasury(mockTreasury.address)

                expect(await testPool3.treasury()).to.equal(mockTreasury.address)
            })
            it("should emit TreasuryUpdated event", async () => {
                await expect(testPool3.setTreasury(mockTreasury.address))
                    .to.emit(testPool3, 'TreasuryUpdated')
                    .withArgs(constants.AddressZero, mockTreasury.address)
            })
        })
    })
}) 