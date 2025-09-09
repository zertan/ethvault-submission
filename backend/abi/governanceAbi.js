// governanceAbi.js
module.exports = [
  // --- state getters ---
  { "type":"function", "name":"proposalCount",   "stateMutability":"view", "inputs":[], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"votingPeriod",    "stateMutability":"view", "inputs":[], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"executionDelay",  "stateMutability":"view", "inputs":[], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"quorum",          "stateMutability":"view", "inputs":[], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"sETHToken",       "stateMutability":"view", "inputs":[], "outputs":[{"type":"address"}] },

  // --- core actions ---
  { "type":"function", "name":"createProposal",  "stateMutability":"nonpayable",
    "inputs":[
      {"name":"description","type":"string"},
      {"name":"target","type":"address"},
      {"name":"callData","type":"bytes"}
    ],
    "outputs":[{"type":"uint256"}]
  },
  { "type":"function", "name":"castVote",        "stateMutability":"nonpayable",
    "inputs":[{"name":"proposalId","type":"uint256"},{"name":"support","type":"bool"}],
    "outputs":[]
  },
  { "type":"function", "name":"executeProposal", "stateMutability":"nonpayable",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[]
  },
  { "type":"function", "name":"cancelProposal",  "stateMutability":"nonpayable",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[]
  },

  // --- reads ---
  { "type":"function", "name":"getProposalState","stateMutability":"view",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[{"type":"uint8"}]  // enum ProposalState
  },
  { "type":"function", "name":"getProposalDetails","stateMutability":"view",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[{
      "components":[
        {"name":"proposer","type":"address"},
        {"name":"description","type":"string"},
        {"name":"createdAt","type":"uint256"},
        {"name":"votesFor","type":"uint256"},
        {"name":"votesAgainst","type":"uint256"},
        {"name":"executed","type":"bool"},
        {"name":"canceled","type":"bool"},
        {"name":"state","type":"uint8"}     // enum ProposalState
      ],
      "type":"tuple"
    }]
  },
  { "type":"function", "name":"getProposalProposer","stateMutability":"view",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[{"type":"address"}]
  },
  { "type":"function", "name":"getProposalDescription","stateMutability":"view",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[{"type":"string"}]
  },
  { "type":"function", "name":"getProposalVotes","stateMutability":"view",
    "inputs":[{"name":"proposalId","type":"uint256"}],
    "outputs":[{"name":"votesFor","type":"uint256"},{"name":"votesAgainst","type":"uint256"}]
  },
  { "type":"function", "name":"getVoteByUser","stateMutability":"view",
    "inputs":[{"name":"proposalId","type":"uint256"},{"name":"voter","type":"address"}],
    "outputs":[{"type":"uint8"}] // enum Vote
  },

  // --- admin ---
  { "type":"function", "name":"updateGovernanceParams","stateMutability":"nonpayable",
    "inputs":[
      {"name":"_votingPeriod","type":"uint256"},
      {"name":"_executionDelay","type":"uint256"},
      {"name":"_quorum","type":"uint256"}
    ],
    "outputs":[]
  },

  // --- events ---
  { "type":"event","name":"ProposalCreated","anonymous":false,
    "inputs":[
      {"name":"proposalId","type":"uint256","indexed":true},
      {"name":"proposer","type":"address","indexed":true},
      {"name":"description","type":"string","indexed":false}
    ]
  },
  { "type":"event","name":"VoteCast","anonymous":false,
    "inputs":[
      {"name":"voter","type":"address","indexed":true},
      {"name":"proposalId","type":"uint256","indexed":true},
      {"name":"support","type":"bool","indexed":false},
      {"name":"weight","type":"uint256","indexed":false}
    ]
  },
  { "type":"event","name":"ProposalExecuted","anonymous":false,
    "inputs":[{"name":"proposalId","type":"uint256","indexed":true}]
  },
  { "type":"event","name":"ProposalCanceled","anonymous":false,
    "inputs":[{"name":"proposalId","type":"uint256","indexed":true}]
  }
];
