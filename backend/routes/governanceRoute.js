// routes/governance.routes.js
const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");
const abi = require("../../lib/abis/governance.json");

const GOVERNANCE_ADDRESS = "0xD396FE92075716598FAC875D12E708622339FA3e";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(GOVERNANCE_ADDRESS, abi, wallet);

// --- helpers ---
const mustAddr = (a) => ethers.getAddress(a);

// --- routes ---

// Create a proposal
router
  .route("/proposals")
  .post(/* isAuthenticatedUser, */ async (req, res) => {
    try {
      const { description, target, callData } = req.body;
      if (!description || !target || !callData)
        return res.status(400).json({ error: "description, target, callData required" });

      const tx = await contract.createProposal(description, mustAddr(target), callData);
      const receipt = await tx.wait();
      // Read the new proposalId from logs or just fetch proposalCount-1
      const count = await contract.proposalCount();
      const proposalId = count - 1n;
      res.json({ txHash: receipt.hash, proposalId: proposalId.toString() });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Get proposal count
router
  .route("/proposals/count")
  .get(async (_req, res) => {
    try {
      const count = await contract.proposalCount();
      res.json({ proposalCount: count.toString() });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Get proposal state/details
router
  .route("/proposals/:id(\\d+)")
  .get(async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const state = await contract.getProposalState(id);
      const details = await contract.getProposalDetails(id);
      res.json({
        id: id.toString(),
        state: Number(state),             // map to enum in frontend
        details: {
          proposer: details.proposer,
          description: details.description,
          createdAt: details.createdAt.toString(),
          votesFor: details.votesFor.toString(),
          votesAgainst: details.votesAgainst.toString(),
          executed: details.executed,
          canceled: details.canceled,
          state: Number(details.state)
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Get votes summary
router
  .route("/proposals/:id(\\d+)/votes")
  .get(async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const [forV, againstV] = await contract.getProposalVotes(id);
      res.json({ votesFor: forV.toString(), votesAgainst: againstV.toString() });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Get a user's vote on a proposal
router
  .route("/proposals/:id(\\d+)/vote/:address(0x[a-fA-F0-9]{40})")
  .get(async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const voter = mustAddr(req.params.address);
      const v = await contract.getVoteByUser(id, voter);
      res.json({ vote: Number(v) }); // 0=None, 1=For, 2=Against
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Cast a vote
router
  .route("/proposals/:id(\\d+)/vote")
  .post(/* isAuthenticatedUser, */ async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const { support } = req.body; // boolean
      if (typeof support !== "boolean")
        return res.status(400).json({ error: "support (boolean) required" });

      const tx = await contract.castVote(id, support);
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Execute a proposal
router
  .route("/proposals/:id(\\d+)/execute")
  .post(/* isAuthenticatedUser, authorizeRoles("admin"), */ async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const tx = await contract.executeProposal(id);
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Cancel a proposal
router
  .route("/proposals/:id(\\d+)/cancel")
  .post(/* isAuthenticatedUser, */ async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const tx = await contract.cancelProposal(id);
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Read governance parameters
router
  .route("/params")
  .get(async (_req, res) => {
    try {
      const [vp, ed, q] = await Promise.all([
        contract.votingPeriod(),
        contract.executionDelay(),
        contract.quorum()
      ]);
      res.json({
        votingPeriod: vp.toString(),
        executionDelay: ed.toString(),
        quorum: q.toString()
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

// Update governance parameters (owner/admin)
router
  .route("/params")
  .put(/* isAuthenticatedUser, authorizeRoles("admin"), */ async (req, res) => {
    try {
      const { votingPeriod, executionDelay, quorum } = req.body; // numbers/strings
      if (votingPeriod == null || executionDelay == null || quorum == null)
        return res.status(400).json({ error: "votingPeriod, executionDelay, quorum required" });

      const tx = await contract.updateGovernanceParams(
        BigInt(votingPeriod),
        BigInt(executionDelay),
        BigInt(quorum)
      );
      const receipt = await tx.wait();
      res.json({ txHash: receipt.hash });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = router;
