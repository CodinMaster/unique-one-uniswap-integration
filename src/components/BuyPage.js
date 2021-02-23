import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const BuyPage = () => {
  const [tparams, setParams] = useState({
    sellToken: 'DAI',
    sellAmount: '',
  });
  const [amount, setAmount] = useState(0)
  const [quoteText, setQuoteText] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    setParams({
      ...tparams,
      [name]: event.target.value,
    });
  };

  return (
    <Grid container direction="row">
      <Grid
        item
        xs={6}
        style={{ maxWidth: "50%", marginTop: "40px", paddingBottom: "20px" }}
      >
        <Grid
          container
          direction="column"
          justify="space-between"
          style={{
            marginLeft: "100px"
          }}
        >
          <Box
            fontWeight="fontWeightBold"
            fontSize="h4.fontSize"
            fontFamily="fontFamily"
            style={{
              marginBottom: "40px",
              color: "orange",
            }}
          >
            Unique.One
          </Box>
          <InputLabel shrink id="from-token" style={{fontSize: "1.5em"}}>
            From Token
          </InputLabel>
          <Select
            name="sellToken"
            labelId="from-token"
            id="from-token-select"
            value={tparams.sellToken}
            onChange={handleChange}
            style={{
              maxWidth: "400px",
            }}
          >
            <MenuItem value={"DAI"}>DAI</MenuItem>
            <MenuItem value={"WBTC"}>WBTC</MenuItem>
            <MenuItem value={"USDC"}>USDC</MenuItem>
            <MenuItem value={"UNI"}>UNI</MenuItem>
            <MenuItem value={"CRV"}>CRV</MenuItem>
          </Select>
          <Box
            fontWeight="fontWeightBold"
            fontSize="h6.fontSize"
            fontFamily="fontFamily"
            style={{
              marginTop: "40px",
              color: "green"
            }}
          >
            {quoteText}
          </Box>
          <TextField
          type="text"
          label="Amount to Pay:"
          variant="outlined"
          style={{
            maxWidth: "480px",
            marginTop: "100px"
          }}
          value={amount}
        />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              minHeight: "55px",
              margin: "20px",
              marginTop: "50px",
              maxWidth: "200px"
            }}
          >
            Purchase NFT
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        xs={6}
        style={{
          paddingLeft: "100px",
        }}
      >
        <Box
          fontWeight="fontWeightBold"
          fontSize="h7.fontSize"
          fontFamily="fontFamily"
          style={{
            marginBottom: "10px",
          }}
        >
          NFT Preview:
        </Box>
        <img
          style={{
            maxHeight: "40%",
          }}
          src="./pencil-church.jfif"
        />
        <Box
          fontWeight="fontWeightBold"
          fontSize="h5.fontSize"
          fontFamily="fontFamily"
          style={{
            marginBottom: "10px",
            color: "orange",
          }}
        >
          Price: 5 ETH
        </Box>
      </Grid>
    </Grid>
  );
};

export default BuyPage;
