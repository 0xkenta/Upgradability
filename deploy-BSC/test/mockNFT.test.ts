import { ethers } from 'hardhat'
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { MockNFT } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

chai.use(solidity);

describe("MockTest", () => {
    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let user3: SignerWithAddress

    let mockNFT: MockNFT

    before(async () => {
        [owner, user1, user2, user3] = await ethers.getSigners();
        mockNFT = await (await ethers.getContractFactory("MockNFT")).deploy("Test", "TEST")
    })
    
    it("should set the name and the symbol by initializing", async () => {
        expect(await mockNFT.name()).to.equal("Test")
        expect(await mockNFT.symbol()).to.equal("TEST")
    })
    it("should set the tokenCounter 0 by initializing", async () => {
        expect(await mockNFT.tokenCounter()).to.equal(1)
    })
    it("should mint a new token with increasing the tokenCounter", async () => {
        expect(await mockNFT.tokenCounter()).to.equal(1)
        await mockNFT.connect(user1).mint()
        expect(await mockNFT.tokenCounter()).to.equal(2)
    })
    it("should return the token owner if the id given", async () => {
        expect(await mockNFT.ownerOf(1)).to.equal(user1.address)
    })
    it("should return the token numbers of owner", async () => {
        expect(await mockNFT.balanceOf(user2.address)).to.equal(0)
        for (let i = 0; i < 5; i++) {
            await mockNFT.mint()
        }
        expect(await mockNFT.balanceOf(user2.address)).to.equal(0)
    })
})
 