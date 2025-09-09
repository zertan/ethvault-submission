const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const path = require("path");
const abi = require(path.join(__dirname, "../../lib/abis/sETH.json"));
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");

const SETH_ETH_ADDRESS = "0x16b0cD88e546a90DbE380A63EbfcB487A9A05D8e";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(SETH_ETH_ADDRESS, abi, wallet);

// helper
const mustAddr = (a) => ethers.getAddress(a);

// NOTE: To stake, the user must have previously approved the StakedETH contract
// to spend their dETH: dETHToken.approve(STAKED_ETH_ADDRESS, amount).

// --- stake ---
router
  .route("/stake")
  .post(isAuthenticatedUser, async (req, res) => {
    try {
      const { amountWei } = req.body; // string or number; use wei of dETH
      if (amountWei == null) return res.status(400).json({ error: "amountWei required" });
      const tx = await contract.stake(BigInt(amountWei));
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- unstake ---
router
  .route("/unstake")
  .post(isAuthenticatedUser, async (req, res) => {
    try {
      const { amountWei } = req.body;
      if (amountWei == null) return res.status(400).json({ error: "amountWei required" });
      const tx = await contract.unstake(BigInt(amountWei));
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- read: stake info for a user ---
router
  .route("/stake-info/:address(0x[a-fA-F0-9]{40})")
  .get(async (req, res) => {
    try {
      const user = mustAddr(req.params.address);
      const [amount, timestamp, rank] = await contract.getStakeInfo(user);
      res.json({
        user,
        amountWei: amount.toString(),
        timestamp: timestamp.toString(),
        rank: rank.toString()
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- read: totals ---
router
  .route("/totals")
  .get(async (_req, res) => {
    try {
      const [staked, stakers, tokenAddr] = await Promise.all([
        contract.totalStaked(),
        contract.totalStakers(),
        contract.dETHToken()
      ]);
      res.json({
        totalStakedWei: staked.toString(),
        totalStakers: stakers.toString(),
        dETHToken: tokenAddr
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- read: all stakers (careful: can be large) ---
router
  .route("/stakers/all")
  .get(async (_req, res) => {
    try {
      const addrs = await contract.getAllStakers();
      res.json({ stakers: addrs });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- read: top stakers ---
router
  .route("/stakers/top")
  .get(async (req, res) => {
    try {
      const count = BigInt(req.query.count ?? 10);
      const [addresses, amounts] = await contract.getTopStakers(count);
      res.json({
        count: Number(count),
        addresses,
        amountsWei: amounts.map(x => x.toString())
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- read: paginated stakers (UI friendly) ---
router
  .route("/stakers")
  .get(async (req, res) => {
    try {
      const offset = BigInt(req.query.offset ?? 0);
      const limit  = BigInt(req.query.limit  ?? 20);
      const [addresses, amounts, timestamps, ranks] = await contract.getPaginatedStakers(offset, limit);
      res.json({
        offset: Number(offset),
        limit: Number(limit),
        addresses,
        amountsWei: amounts.map(x => x.toString()),
        timestamps: timestamps.map(x => x.toString()),
        ranks: ranks.map(x => x.toString())
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- read: ERC20 balance (sETH) ---
router
  .route("/balance/:address(0x[a-fA-F0-9]{40})")
  .get(async (req, res) => {
    try {
      const addr = mustAddr(req.params.address);
      const bal = await contract.balanceOf(addr);
      res.json({ address: addr, balanceWei: bal.toString() });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- admin: update leaderboard ---
router
  .route("/leaderboard/update")
  .post(isAuthenticatedUser, authorizeRoles("admin"), async (_req, res) => {
    try {
      const tx = await contract.updateLeaderboard();
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = router;
