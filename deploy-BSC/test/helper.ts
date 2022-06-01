import { MockNFT } from '../types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

export const prepare = async (nft: MockNFT, tokenId: number, poolAddress: string) => {
    await nft.mint()
    await nft.approve(poolAddress, tokenId)
}