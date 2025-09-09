const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const path = require("path");
const abi = require(path.join(__dirname, "../../lib/abis/stakingDashboard.json"));

const STAKING_DASHBOARD_ADDRESS = "0xd33e9676463597AfFF5bB829796836631F4e2f1f";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(STAKING_DASHBOARD_ADDRESS, abi, wallet);

// helpers
const mustAddr = (a) => ethers.getAddress(a);

// --- Overview ---
router
  .route("/overview")
  .get(async (_req, res) => {
    try {
      const [dep, staked, stakers, avg] = await contract.getStakingOverview();
      res.json({
        totalETHDepositedWei: dep.toString(),
        totalETHStakedWei: staked.toString(),
        totalStakers: stakers.toString(),
        averageStakeWei: avg.toString()
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- Leaderboard ---
router
  .route("/leaderboard")
  .get(async (req, res) => {
    try {
      const count = BigInt(req.query.count ?? 10);
      const [addresses, amounts, percentages] = await contract.getLeaderboard(count);
      res.json({
        count: Number(count),
        addresses,
        amountsWei: amounts.map(x => x.toString()),
        // percentages are scaled by 100 (two decimals) but contract uses *10000; your contract uses 10000 → two decimals *hundredth percents*
        // Keep raw; format in UI as (value / 100) or (value / 10000) depending on your convention.
        percentagesBps: percentages.map(x => x.toString())
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- Staker details ---
router
  .route("/staker/:address(0x[a-fA-F0-9]{40})")
  .get(async (req, res) => {
    try {
      const addr = mustAddr(req.params.address);
      const [amount, ts, rank, pct] = await contract.getStakerDetails(addr);
      res.json({
        address: addr,
        amountWei: amount.toString(),
        timestamp: ts.toString(),
        rank: rank.toString(),
        percentageBps: pct.toString()
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- Activity: recent stakers within N days ---
router
  .route("/activity")
  .get(async (req, res) => {
    try {
      const daysAgo = BigInt(req.query.daysAgo ?? 7);
      const [activeCount, recentStakers] = await contract.getStakingActivity(daysAgo);
      res.json({
        daysAgo: Number(daysAgo),
        activeStakers: activeCount.toString(),
        recentStakers
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- Paginated stakers with details ---
router
  .route("/stakers")
  .get(async (req, res) => {
    try {
      const offset = BigInt(req.query.offset ?? 0);
      const limit  = BigInt(req.query.limit  ?? 20);
      const [addresses, amounts, timestamps, ranks, percentages] =
        await contract.getPaginatedStakersDetailed(offset, limit);

      res.json({
        offset: Number(offset),
        limit: Number(limit),
        addresses,
        amountsWei: amounts.map(x => x.toString()),
        timestamps: timestamps.map(x => x.toString()),
        ranks: ranks.map(x => x.toString()),
        percentagesBps: percentages.map(x => x.toString())
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// --- Referenced token addresses (handy for UI wiring) ---
router
  .route("/tokens")
  .get(async (_req, res) => {
    try {
      const [sETH, dETH] = await Promise.all([contract.sETHToken(), contract.dETHToken()]);
      res.json({ sETHToken: sETH, dETHToken: dETH });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = router;
