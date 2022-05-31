import { ethers } from 'hardhat'
import { constants } from 'ethers';
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { MockNFT, TestPool1 } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'


chai.use(solidity);

describe("TestPool1", () => {
    let testPool1: TestPool1
    let mockNFT: MockNFT

    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let user3: SignerWithAddress

    let tokenId1: number
    let tokenId2: number
    let tokenId3: number

    beforeEach(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners()

        mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
        testPool1 = await (await ethers.getContractFactory("TestPool1")).deploy()
        await testPool1.deployed()
    })

    describe("initialize()", () => {
        describe("fail", () => {
            it("should revert if the param nft is empty",async () => {
                await expect(testPool1.initialize(constants.AddressZero)).to.be.revertedWith("EMPTY ADDRESS")
            })
            it("should revert when the second initialize attempted", async () => {
                await testPool1.initialize(mockNFT.address)
                await expect(testPool1.initialize(mockNFT.address)).to.be.revertedWith("Initializable: contract is already initialized")   
            })
        })     
        describe("success", () => {
            it("should set the nft instance", async () => {
                expect(await testPool1.nft()).to.equal(constants.AddressZero)
                await testPool1.initialize(mockNFT.address)
                expect(await testPool1.nft()).to.equal(mockNFT.address)
            })
        })
    })

    describe("deposit()", () => {
        beforeEach(async () => {
            await testPool1.initialize(mockNFT.address)
            await mockNFT.connect(user1).mint()  
            await mockNFT.connect(user1).mint()  
            await mockNFT.connect(user1).mint()  
        })
        describe("fail", () => {
            it("should revert if the token is not approved before the deposit", async () => {
                await expect(testPool1.connect(user1).deposit([1])).to.be.revertedWith('NO TRANSFER APPROVED')
            })
        })
        describe.only("success", () => {
            it("should update the nftInfo", async () => {
                const nftInfoBefore = await testPool1.nftInfos(1)
                expect(nftInfoBefore.staker).to.equal(constants.AddressZero)
                expect(nftInfoBefore.isStaked).to.equal(false)

                await mockNFT.connect(user1).approve(testPool1.address, 1)
                await testPool1.connect(user1).deposit([1])

                const nftInfoAfter = await testPool1.nftInfos(1)
                expect(nftInfoAfter.staker).to.equal(user1.address)
                expect(nftInfoAfter.isStaked).to.equal(true)
            })
            it("should push the tokenId into the nftIdsStaked", async () => {
                expect(await testPool1.getStakingTokenLength(user1.address)).to.equal(0)
                await mockNFT.connect(user1).approve(testPool1.address, 1)
                await testPool1.connect(user1).deposit([1])

                expect(await testPool1.getStakingTokenLength(user1.address)).to.equal(1)

                await mockNFT.connect(user1).approve(testPool1.address, 2)
                await testPool1.connect(user1).deposit([2])

                expect(await testPool1.getStakingTokenLength(user1.address)).to.equal(2)
            })
            it("should transfer the token from the user to the pool contract", async () => {
                expect(await mockNFT.balanceOf(testPool1.address)).to.equal(0)
                expect(await mockNFT.ownerOf(1)).to.equal(user1.address)

                await mockNFT.connect(user1).approve(testPool1.address, 1)
                await testPool1.connect(user1).deposit([1])

                expect(await mockNFT.balanceOf(testPool1.address)).to.equal(1)
                expect(await mockNFT.ownerOf(1)).to.equal(testPool1.address)
            })
        })
    })
}) 