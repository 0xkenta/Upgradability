import { ethers } from 'hardhat'
import { constants } from 'ethers';
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { MockNFT, TestPool2 } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'


chai.use(solidity);

describe("TestPool2", () => {
    let testPool2: TestPool2
    let mockNFT: MockNFT

    let testPool2WithUser1: TestPool2
    let testPool2WithUser2: TestPool2

    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let user3: SignerWithAddress

    beforeEach(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners()

        mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
        testPool2 = await (await ethers.getContractFactory("TestPool2")).deploy()
        await testPool2.deployed()
        await testPool2.initialize(mockNFT.address)
    })

    const prepareToBurn = async (nft: MockNFT, user: SignerWithAddress, tokenId: number) => {
        await nft.mint()
        await nft.approve(testPool2.address, tokenId)
        await testPool2.connect(user).deposit([tokenId])

    }

    describe("burn()", () => {
        beforeEach(async () => {
            const mockNFTWithUser1 = mockNFT.connect(user1)
            const mockNFTWithUser2 = mockNFT.connect(user2)

            await prepareToBurn(mockNFTWithUser1, user1, 1)
            await prepareToBurn(mockNFTWithUser2, user2, 2)
            await prepareToBurn(mockNFTWithUser1, user1, 3)

            testPool2WithUser1 = await testPool2.connect(user1)
            testPool2WithUser2 = await testPool2.connect(user2)
        })

        describe("fail", () => {
            it("should revert if the token is not staked", async () => {
                await expect(testPool2.connect(user1).burn([4])).to.be.revertedWith( 'NO STAKED TOKEN')
            })
        })

        describe("success", () => {
            it("should decrease the length of the staked tokens", async () => {
                expect(await testPool2.getStakingTokenLength(user1.address)).to.equal(2)
    
                await testPool2WithUser1.burn([1])
    
                expect(await testPool2.getStakingTokenLength(user1.address)).to.equal(1)
    
                await testPool2WithUser1.burn([3])
    
                expect(await testPool2.getStakingTokenLength(user1.address)).to.equal(0)
            })
            it("should delete the nftInfo", async () => {
                const nftInfoBefore = await testPool2.nftInfos(1)
                expect(nftInfoBefore.staker).to.equal(user1.address)
                expect(nftInfoBefore.isStaked).to.equal(true)

                await testPool2WithUser1.burn([1])

                const nftInfoAfter = await testPool2.nftInfos(1)
                expect(nftInfoAfter.staker).to.equal(constants.AddressZero)
                expect(nftInfoAfter.isStaked).to.equal(false)
            })
            it("should burn the token", async () => {
                expect(await mockNFT.balanceOf(testPool2.address)).to.equal(3)

                await testPool2WithUser1.burn([1])

                expect(await mockNFT.balanceOf(testPool2.address)).to.equal(2)

                await testPool2WithUser1.burn([3])

                expect(await mockNFT.balanceOf(testPool2.address)).to.equal(1)

                await testPool2WithUser2.burn([2])

                expect(await mockNFT.balanceOf(testPool2.address)).to.equal(0)
            })
        })
    })
})