import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";

import toDecimal from "./helpers/toDecimal";
import SimpleCard from "./components/SimpleCard";
const BN = require("web3-utils").BN;

const contractABI = require("./abis/UniqueOneUniswap.json");
const tokenABI = require("./abis/ERC20.json");
const uniswapABI = require("./abis/UniswapV2Router02.json");
// rinkeby
const contractAddress = "0x7352d1DDDb09a2e3c5600C7c0a25cdd4d3a76a20";
const DAIAddress = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
const uniswapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETHAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const nftsInfo = require("./nftsInfo.json");

function App() {
  const [web3Instance, setWeb3Instance] = useState();
  const [contract, setContract] = useState();
  const [DAI, setDAI] = useState();
  const [uniswap, setUniswap] = useState();
  const [account, setAccount] = useState("");
  const [selectedNFTInfo, setSelectedNFTInfo] = useState();
  const [userDAIBalance, setUserDAIBalance] = useState();
  const [ethToDai, setEthToDai] = useState();
  const [nftPriceInDAI, setNftPriceInDAI] = useState();
  const [daiAllowance, setDaiAllowance] = useState();
  const [shouldApprove, setShouldApprove] = useState(true);
  const [canBuy, setCanBuy] = useState();
  const [approveLoading, setApproveLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  const setupWeb3 = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3Instance(web3);
      try {
        const accounts = await window.ethereum.enable();
        setAccount(accounts[0]);
        // User has allowed account access to DApp...
        web3.eth.net.getNetworkType().then((network) => {
          if (network !== "rinkeby")
            alert("Please Switch to Rinkeby to use this DApp");
        });
      } catch (e) {
        // User has denied account access to DApp...
        console.log(e);
      }
    }
    // Non-DApp Browsers
    else {
      alert("You have to install MetaMask!");
    }
  };

  const approveDAI = () => {
    setApproveLoading(true);
    DAI.methods
      .approve(
        contractAddress,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      )
      .send({ from: account })
      .then(() => {
        setShouldApprove(false);
        setApproveLoading(false);
      })
      .catch((r) => {
        setApproveLoading(false);
      });
  };

  const buyNFT = () => {
    setBuyLoading(true);
    if (selectedNFTInfo.isERC1155) {
      contract.methods
        .buyERC1155NFT(
          DAIAddress,
          "115792089237316195423570985008687907853269984665640564039457584007913129639935",
          selectedNFTInfo.decodedData[0].value,
          selectedNFTInfo.decodedData[1].value,
          selectedNFTInfo.decodedData[2].value,
          selectedNFTInfo.decodedData[3].value,
          selectedNFTInfo.decodedData[4].value,
          selectedNFTInfo.decodedData[5].value,
          selectedNFTInfo.decodedData[6].value,
          selectedNFTInfo.decodedData[7].value
        )
        .send({ from: account })
        .then(() => {
          setBuyLoading(false);
        })
        .catch((r) => {
          setBuyLoading(false);
        });
    } else {
      contract.methods
        .buyERC721NFT(
          DAIAddress,
          "115792089237316195423570985008687907853269984665640564039457584007913129639935",
          selectedNFTInfo.decodedData[0].value,
          selectedNFTInfo.decodedData[1].value,
          selectedNFTInfo.decodedData[2].value,
          selectedNFTInfo.decodedData[3].value,
          selectedNFTInfo.decodedData[4].value
        )
        .send({ from: account })
        .then(() => {
          setBuyLoading(false);
        })
        .catch((r) => {
          setBuyLoading(false);
        });
    }
  };

  useEffect(() => {
    if (web3Instance) {
      setContract(new web3Instance.eth.Contract(contractABI, contractAddress));
      setDAI(new web3Instance.eth.Contract(tokenABI, DAIAddress));
      setUniswap(new web3Instance.eth.Contract(uniswapABI, uniswapAddress));
    }
  }, [web3Instance]);

  useEffect(() => {
    if (selectedNFTInfo) {
      DAI.methods
        .balanceOf(account)
        .call()
        .then((r) => {
          setUserDAIBalance(toDecimal(r));
        });

      DAI.methods
        .allowance(account, contractAddress)
        .call()
        .then((r) => {
          setDaiAllowance(toDecimal(r));
        });

      uniswap.methods
        .getAmountsOut("1000000000000000000", [WETHAddress, DAIAddress])
        .call()
        .then((r) => {
          setEthToDai(toDecimal(r[1]));
        });
    }
  }, [selectedNFTInfo]);

  useEffect(() => {
    if (selectedNFTInfo && ethToDai) {
      let ETHPrice;
      if (selectedNFTInfo.isERC1155) {
        ETHPrice = toDecimal(selectedNFTInfo.decodedData[5].value);
      } else {
        ETHPrice = toDecimal(selectedNFTInfo.decodedData[2].value);
      }
      setNftPriceInDAI(ETHPrice * ethToDai);
    }
  }, [selectedNFTInfo, ethToDai]);

  useEffect(() => {
    if (daiAllowance && nftPriceInDAI) {
      setShouldApprove(daiAllowance < nftPriceInDAI);
    }
  }, [daiAllowance, nftPriceInDAI]);

  useEffect(() => {
    if (userDAIBalance && nftPriceInDAI) {
      setCanBuy(userDAIBalance >= nftPriceInDAI);
    }
  }, [userDAIBalance, nftPriceInDAI]);

  return (
    <Grid container direction="column" justify="space-between">
      <Grid container>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <Grid
            container
            direction="row"
            justify="center"
            spacing={10}
            style={{
              marginTop: "5rem",
            }}
          >
            <Box
              fontWeight="fontWeightBold"
              fontSize="h4.fontSize"
              fontFamily="fontFamily"
              fontStyle=""
              style={{
                margin: "auto",
                marginBottom: "40px",
                color: "orange",
              }}
            >
              Unique.One + Uniswap
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            justify="flex-end"
            style={{
              paddingRight: "2rem",
            }}
          >
            {!account ? (
              <Button
                variant="contained"
                color="primary"
                style={{
                  minHeight: "55px",
                  maxWidth: "200px",
                }}
                onClick={() => {
                  setupWeb3();
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              <Box
                fontWeight="fontWeightBold"
                fontSize="1.2rem"
                fontFamily="fontFamily"
                fontStyle=""
                style={{
                  color: "green",
                  marginTop: "1.2rem",
                  marginRight: "2rem",
                }}
              >
                Connected
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
      {!selectedNFTInfo ? (
        <Grid
          container
          direction="row"
          justify="center"
          spacing={10}
          style={{
            marginTop: "5rem",
          }}
        >
          {nftsInfo.map((nftInfo, index) => (
            <Grid item key={index}>
              <SimpleCard
                nftInfo={nftInfo}
                setSelectedNFTInfo={setSelectedNFTInfo}
                buttonEnabled={account}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          direction="row"
          justify="space-between"
          style={{
            marginTop: "3rem",
          }}
        >
          <Grid item>
            <Box
              fontWeight="fontWeightBold"
              fontSize="h7.fontSize"
              fontFamily="fontFamily"
              style={{
                marginBottom: "10px",
                color: "gray",
              }}
            >
              Your DAI Balance: {userDAIBalance} DAI (Buy DAI from Uniswap:{" "}
              <Link
                href="https://app.uniswap.org/"
                target="_blank"
                rel="noopener"
              >
                Link
              </Link>
              )
            </Box>
            <Box
              fontWeight="fontWeightBold"
              fontSize="h7.fontSize"
              fontFamily="fontFamily"
              style={{
                marginBottom: "10px",
                color: "orange",
              }}
            >
              NFT Price (in ETH):{" "}
              {selectedNFTInfo.isERC1155
                ? toDecimal(selectedNFTInfo.decodedData[5].value)
                : toDecimal(selectedNFTInfo.decodedData[2].value)}{" "}
              ETH
            </Box>
            <Box
              fontWeight="fontWeightBold"
              fontSize="h7.fontSize"
              fontFamily="fontFamily"
              style={{
                marginBottom: "10px",
              }}
            >
              From Uniswap: 1 ETH = {ethToDai} DAI
            </Box>
            <Box
              fontWeight="fontWeightBold"
              fontSize="h7.fontSize"
              fontFamily="fontFamily"
              style={{
                marginBottom: "10px",
              }}
            >
              NFT Price in DAI: {nftPriceInDAI} DAI
            </Box>

            <Grid container>
              {shouldApprove && (
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{
                      minHeight: "55px",
                      margin: "20px",
                      marginTop: "50px",
                      minWidth: "100px",
                    }}
                    disabled={!canBuy}
                    onClick={() => approveDAI()}
                  >
                    Approve DAI
                    {approveLoading && (
                      <CircularProgress
                        style={{ color: "white", marginLeft: "1rem" }}
                      />
                    )}
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    minHeight: "55px",
                    margin: "20px",
                    marginTop: "50px",
                    minWidth: "100px",
                  }}
                  disabled={!canBuy || shouldApprove}
                  onClick={() => buyNFT()}
                >
                  BUY NFT
                  {buyLoading && (
                    <CircularProgress
                      style={{ color: "white", marginLeft: "1rem" }}
                    />
                  )}
                </Button>
                {!canBuy && (
                  <Box
                    fontSize="h6.fontSize"
                    fontFamily="fontFamily"
                    style={{
                      color: "red",
                    }}
                  >
                    (Insufficient DAI Balance)
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <img
              style={{
                maxHeight: "30rem",
                margin: "auto",
              }}
              src={`./nfts/${selectedNFTInfo.img}`}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default App;
