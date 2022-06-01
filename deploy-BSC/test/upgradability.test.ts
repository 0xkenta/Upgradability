import { ethers, upgrades } from 'hardhat'
import { constants } from 'ethers';
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { MockNFT, MockTreasury, TestPool1, TestPool2, TestPool3 } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { prepare } from './helper'

describe("Upgradability", () => {
    let testPool1: TestPool1
    let testPool2: TestPool2
    let testPool3: TestPool3
    let mockNFT: MockNFT
    let mockTreasury: MockTreasury

    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress

    const firstToken = 1
    const secondToken = 2
    const thirdToken = 3

    before(async () => {
        [owner, user1, user2] = await ethers.getSigners()

        mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
        const testPool1Factory = await ethers.getContractFactory("TestPool1")
        testPool1 = await upgrades.deployProxy(testPool1Factory, [mockNFT.address])
        mockTreasury = await (await ethers.getContractFactory("MockTreasury")).deploy()

        const mockNFTWithUser1 = mockNFT.connect(user1)
        const mockNFTWithUser2 = mockNFT.connect(user2)
        
        const testPool1Address = testPool1.address
        await prepare(mockNFTWithUser1, firstToken, testPool1Address)
        await prepare(mockNFTWithUser2, secondToken, testPool1Address)
        await prepare(mockNFTWithUser1, thirdToken, testPool1Address)
    })

    describe("the first logic contract", () => {
        it("should be initialized", async () => {
            expect(await testPool1.nft()).to.equal(mockNFT.address)
        })
        it("should update nftInfo and nftIdsStaked and transfer tokens to the pool contract", async () => {
            expect(await testPool1.getStakingTokenLength(user1.address)).to.equal(0)
            expect(await testPool1.getStakingTokenLength(user2.address)).to.equal(0)

            expect(await mockNFT.balanceOf(testPool1.address)).to.equal(0)
            expect(await mockNFT.balanceOf(user1.address)).to.equal(2)
            expect(await mockNFT.balanceOf(user2.address)).to.equal(1)

            await testPool1.connect(user1).deposit([firstToken])
            
            const nftInfo1 = await testPool1.nftInfos(firstToken)
            expect(nftInfo1.isStaked).to.equal(true)
            expect(nftInfo1.staker).to.equal(user1.address)
            expect(await testPool1.getStakingTokenLength(user1.address)).to.equal(1)
            expect(await mockNFT.balanceOf(testPool1.address)).to.equal(1)
            expect(await mockNFT.balanceOf(user1.address)).to.equal(1)
            expect(await mockNFT.balanceOf(user2.address)).to.equal(1)

            await testPool1.connect(user2).deposit([secondToken])
            
            const nftInfo2 = await testPool1.nftInfos(secondToken)
            expect(nftInfo2.isStaked).to.equal(true)
            expect(nftInfo2.staker).to.equal(user2.address)
            expect(await testPool1.getStakingTokenLength(user2.address)).to.equal(1)
            expect(await mockNFT.balanceOf(testPool1.address)).to.equal(2)
            expect(await mockNFT.balanceOf(user1.address)).to.equal(1)
            expect(await mockNFT.balanceOf(user2.address)).to.equal(0)

            await testPool1.connect(user1).deposit([thirdToken])
            
            const nftInfo3 = await testPool1.nftInfos(thirdToken)
            expect(nftInfo3.isStaked).to.equal(true)
            expect(nftInfo3.staker).to.equal(user1.address)
            expect(await testPool1.getStakingTokenLength(user1.address)).to.equal(2)
            expect(await mockNFT.balanceOf(testPool1.address)).to.equal(3)
            expect(await mockNFT.balanceOf(user1.address)).to.equal(0)
            expect(await mockNFT.balanceOf(user2.address)).to.equal(0)
        })
    })
    describe("the second logic contract", () => {
        before(async () => {
            const testPool2Factory = await ethers.getContractFactory("TestPool2")
            testPool2 = await upgrades.upgradeProxy(testPool1, testPool2Factory)
        })
        describe("should keep state variable of the previous contract after upgrading the login contract", () => {
            it("should keep the nftInfo and nftIdsStaked", async () => {
                expect(await testPool2.getStakingTokenLength(user1.address)).to.equal(2)
                expect(await testPool2.getStakingTokenLength(user2.address)).to.equal(1)

                const nftInfo1 = await testPool2.nftInfos(firstToken)
                expect(nftInfo1.isStaked).to.equal(true)
                expect(nftInfo1.staker).to.equal(user1.address)

                const nftInfo2 = await testPool2.nftInfos(secondToken)
                expect(nftInfo2.isStaked).to.equal(true)
                expect(nftInfo2.staker).to.equal(user2.address)

                const nftInfo3 = await testPool2.nftInfos(thirdToken)
                expect(nftInfo3.isStaked).to.equal(true)
                expect(nftInfo3.staker).to.equal(user1.address)
            })
        })
        describe("the new function with the second logic contract: burn()", () => {
            it("should burn the token, delete the nftInfo, and decrease the the length of the staked tokens", async () => {
                expect(await mockNFT.balanceOf(testPool2.address)).to.equal(3)
                const nftInfo1Before = await testPool2.nftInfos(firstToken)
                expect(nftInfo1Before.isStaked).to.equal(true)
                expect(nftInfo1Before.staker).to.equal(user1.address)
                expect(await testPool2.getStakingTokenLength(user1.address)).to.equal(2)

                await testPool2.connect(user1).burn([firstToken])

                expect(await mockNFT.balanceOf(testPool2.address)).to.equal(2)
                const nftInfo1After = await testPool2.nftInfos(firstToken)
                expect(nftInfo1After.isStaked).to.equal(false)
                expect(nftInfo1After.staker).to.equal(constants.AddressZero)
                expect(await testPool2.getStakingTokenLength(user1.address)).to.equal(1)
            })
        })
    })

    describe("the third logic contract", () => {
        before(async () => {
            const testPool3Factory = await ethers.getContractFactory("TestPool3")
            testPool3 = await upgrades.upgradeProxy(testPool2, testPool3Factory)
        })

        describe("should keep state variable of the previous contract after upgrading the login contract", () => {
            it("should keep the nftInfo and nftIdsStaked", async () => {
                expect(await testPool3.getStakingTokenLength(user1.address)).to.equal(1)
                expect(await testPool3.getStakingTokenLength(user2.address)).to.equal(1)

                const nftInfo2 = await testPool3.nftInfos(secondToken)
                expect(nftInfo2.isStaked).to.equal(true)
                expect(nftInfo2.staker).to.equal(user2.address)

                const nftInfo3 = await testPool3.nftInfos(thirdToken)
                expect(nftInfo3.isStaked).to.equal(true)
                expect(nftInfo3.staker).to.equal(user1.address)
            })
        })
        describe("the new state variable treasury with the new setter: setTreasury()", () => {
            it("should be a empty address after the deploy", async () => {
                expect(await testPool3.treasury()).to.equal(constants.AddressZero)
            })
            it("should set the new treasury address", async () => {
                expect(await testPool3.treasury()).to.equal(constants.AddressZero)
                
                await testPool3.setTreasury(mockTreasury.address)

                expect(await testPool3.treasury()).to.equal(mockTreasury.address)
            })
        })
    })
})