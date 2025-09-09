const express = require("express");
const { ethers } = require("ethers");
const router = express.Router();
const abi = require("../../lib/abis/dETH.json");

const DETH_ADDRESS = "0x520d7dAB4A5bCE6ceA323470dbffCea14b78253a";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(DETH_ADDRESS, abi, wallet);

// --- Routes ---

// Deposit ETH → mints dETH
router
  .route("/deposit")
  .post(async (req, res) => {
    try {
      const { amountEth } = req.body;
      if (!amountEth) {
        return res.status(400).json({ error: "amountEth required" });
      }
      const tx = await contract.deposit({ value: ethers.parseEther(amountEth) });
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Withdraw ETH by burning dETH
router
  .route("/withdraw")
  .post(async (req, res) => {
    try {
      const { amountEth } = req.body;
      if (!amountEth) {
        return res.status(400).json({ error: "amountEth required" });
      }
      const wei = ethers.parseEther(amountEth);
      const tx = await contract.withdraw(wei);
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Balance of a given user
router
  .route("/balance/:address")
  .get(async (req, res) => {
    try {
      const bal = await contract.balanceOf(req.params.address);
      res.json({ address: req.params.address, balanceWei: bal.toString() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Contract’s ETH reserve
router
  .route("/contract-balance")
  .get(async (_req, res) => {
    try {
      const bal = await contract.getContractETHBalance();
      res.json({ contractBalanceWei: bal.toString() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
