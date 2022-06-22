import { ethers, upgrades } from 'hardhat'
import { constants } from 'ethers';
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ERC20Token, NFT, Receiver1, Receiver2 } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'


describe("Upgradability", () => {
    let erc20: ERC20Token
    let nft: NFT
    let receiver1: Receiver1
    let receiver2: Receiver2

    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress

    const nftId = 1
    const amount = "100000000"

    before(async () => {
        [owner, user1, user2] = await ethers.getSigners()
        
        erc20 = await (await ethers.getContractFactory("ERC20Token")).deploy()
        nft = await (await ethers.getContractFactory("NFT")).deploy("Test", "TEST")

        const receiverFactory = await ethers.getContractFactory("Receiver1")
        receiver1 = await upgrades.deployProxy(receiverFactory, ["1"])

        await nft.connect(user1).mint()
        await nft.connect(user1).approve(receiver1.address, nftId)
        await nft.connect(user1).transferFrom(user1.address, receiver1.address, nftId)
        await erc20.mint(receiver1.address, amount)
    })

    describe("the first logic", () => {
      it("should be owned by receiver1", async () => {
        expect(await nft.ownerOf(nftId)).to.equal(receiver1.address)
        expect(await erc20.balanceOf(receiver1.address)).to.equal(amount)
      })
    })
    describe("the second logic", () => {
      before(async () => {
          const receiver2Factory = await ethers.getContractFactory("Receiver2")
          receiver2 = await upgrades.upgradeProxy(receiver1, receiver2Factory)  
      })
      it("should inherit the state variables", async () => {
        expect(await nft.ownerOf(nftId)).to.equal(receiver2.address)
        expect(await erc20.balanceOf(receiver2.address)).to.equal(amount)  
        expect(await receiver2.version()).to.equal("1")
      })
      it("should send ERC20 and ERC721 to the user1 and update the version", async () => {
        await receiver2.recoverERC20(erc20.address, user1.address)
        await receiver2.recoverERC721(nft.address, user1.address, nftId)
        await receiver2.updateVersion("2")

        expect(await nft.ownerOf(nftId)).to.equal(user1.address)
        expect(await erc20.balanceOf(user1.address)).to.equal(amount)
        expect(await receiver2.version()).to.equal("2")
      })
    })
})