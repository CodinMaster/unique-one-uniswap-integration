# Unique.One Uniswap Integration
Use Uniswap pools to allow user to buy NFTs from Unique.One marketplace using any Token of their choice.

### LIVE RINKEBY DEMO: [Link](https://apoorvlathey.com/projects/unique-one-uniswap-integration/)
### VIDEO DEMO: [Link](https://www.youtube.com/watch?v=m08Br1dDh54)

## Setup

### React UI:
1. `npm i` to install required dependencies for react application
2. `npm run start` to preview application.

### Smart Contracts:
1. `cd Ethereum` Smart Contracts in Ethereum directory.

* Already deployed on Rinkeby at: [0x7352d1DDDb09a2e3c5600C7c0a25cdd4d3a76a20](https://rinkeby.etherscan.io/address/0x7352d1dddb09a2e3c5600c7c0a25cdd4d3a76a20)

#### Contract Functions:

```solidity
function buyERC721NFT(
        address fromToken,          // input token address (like DAI, USDC, etc.)
        uint256 maxFromAmount,      // max input token amount (used for slippage check during swap)
        IERC721 nft, 
        uint256 tokenId, 
        uint256 price, 
        uint256 sellerFee,
        IERC721Sale.Sig calldata signature
    ) external
```

```solidity
function buyERC1155NFT(
        address fromToken,        // input token address (like DAI, USDC, etc.)
        uint256 maxFromAmount,    // max input token amount (used for slippage check during swap)
        IERC1155 nft, 
        uint256 tokenId,
        address payable owner,
        uint256 selling,
        uint256 buying,
        uint256 price, 
        uint256 sellerFee,
        IERC1155Sale.Sig calldata signature
    ) external
```

### Flow:

1. Approve contract to spend user's fromToken
2. Call `buyERC721NFT` or `buyERC1155NFT` function
3. Contract pulls the required `fromToken` amount from user, swaps it to ETH, buys NFT and sends the NFT back to the user, all in one transaction!
