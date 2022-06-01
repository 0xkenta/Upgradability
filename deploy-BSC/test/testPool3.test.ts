import { ethers } from 'hardhat'
import { constants } from 'ethers';
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { MockNFT, TestPool3 } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'


chai.use(solidity);

describe("TestPool3", () => {
    let testPool3: TestPool2
    let mockNFT: MockNFT

    let testPool3WithUser1: TestPool3
    let testPool3WithUser2: TestPool3

    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let user3: SignerWithAddress

    before(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners()

        mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
        testPool3 = await (await ethers.getContractFactory("TestPool3")).deploy()
        await testPool3.deployed()
        await testPool3.initialize(mockNFT.address)

        const mockNFTWithUser1 = mockNFT.connect(user1)
        const mockNFTWithUser2 = mockNFT.connect(user2)

        await prepare(mockNFTWithUser1, user1, 1)
        await prepare(mockNFTWithUser2, user2, 2)
        await prepare(mockNFTWithUser1, user1, 3)

        testPool3WithUser1 = await testPool3.connect(user1)
        testPool3WithUser2 = await testPool3.connect(user2)
    })

    const prepare = async (nft: MockNFT, user: SignerWithAddress, tokenId: number) => {
        await nft.mint()
        await nft.approve(testPool3.address, tokenId)
    }

    describe("deposit()", () => {
        it("should increase the totalStaked", async () => {
            expect(await testPool3.totalStaked()).to.equal(0)

            await testPool3WithUser1.deposit([1])

            expect(await testPool3.totalStaked()).to.equal(1)

            await testPool3WithUser2.deposit([2])

            expect(await testPool3.totalStaked()).to.equal(2)

            await testPool3WithUser1.deposit([3])

            expect(await testPool3.totalStaked()).to.equal(3)
        })
    })

    describe("burn()", () => {
        it("should decrease the totalStaked", async () => {
            expect(await testPool3.totalStaked()).to.equal(3)
            
            await testPool3WithUser1.burn([3])

            expect(await testPool3.totalStaked()).to.equal(2)
            
            await testPool3WithUser2.burn([2])

            expect(await testPool3.totalStaked()).to.equal(1)
            
            await testPool3WithUser1.burn([1])

            expect(await testPool3.totalStaked()).to.equal(0)    
        })
    })
})