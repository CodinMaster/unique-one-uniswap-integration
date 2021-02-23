import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { red } from "@material-ui/core/colors";
import toDecimal from "../helpers/toDecimal";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function SimpleCard({
  nftInfo,
  setSelectedNFTInfo,
  buttonEnabled,
}) {
  let ETHPrice;
  if (nftInfo.isERC1155) {
    ETHPrice = toDecimal(nftInfo.decodedData[5].value);
  } else {
    ETHPrice = toDecimal(nftInfo.decodedData[2].value);
  }

  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={`/nfts/${nftInfo.img}`}
        title="nft thumbnail"
      />
      <CardContent>
        <Box
          fontWeight="fontWeightBold"
          fontSize="h6.fontSize"
          fontFamily="fontFamily"
          style={{
            marginBottom: "10px",
            color: "orange",
          }}
        >
          ERC-{nftInfo.isERC1155 ? "1155" : "721"}
        </Box>
        <Box
          fontWeight="fontWeightBold"
          fontSize="h6.fontSize"
          fontFamily="fontFamily"
          style={{
            color: "purple",
          }}
        >
          Price: {ETHPrice} ETH
        </Box>
        <Grid container direction="row" justify="center">
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
            onClick={() => setSelectedNFTInfo(nftInfo)}
            disabled={!buttonEnabled}
          >
            Buy
          </Button>
        </Grid>
        {!buttonEnabled && (
          <Grid container direction="row" justify="center">
            <Box
              fontSize="h6.fontSize"
              fontFamily="fontFamily"
              style={{
                color: "red",
              }}
            >
              (Connect Wallet)
            </Box>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
