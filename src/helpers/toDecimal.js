const BN = require("web3-utils").BN;

export default function toDecimal(amount) {
  const decimals = 18;
  const divisor = new BN("10").pow(new BN(decimals));
  const beforeDec = new BN(amount).div(divisor).toString();
  var afterDec = new BN(amount).mod(divisor).toString();

  if (afterDec.length < decimals && afterDec !== "0") {
    // pad with extra zeroes
    const pad = Array(decimals + 1).join("0");
    afterDec = (pad + afterDec).slice(-decimals);
  }

  // remove insignificant trailing zeros
  return ((beforeDec + "." + afterDec) * 1).toString();
}
