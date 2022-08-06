export function shortenAddress(address, chars = 4) {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function financial(x, fixed = 2) {
  return Number.parseFloat(x).toFixed(fixed);
}
