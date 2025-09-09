// Minimal ABI for StakedETH (plus a few ERC20 reads)
module.exports = [
  // --- ERC20 basics ---
  { "type":"function","name":"name","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}] },
  { "type":"function","name":"symbol","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}] },
  { "type":"function","name":"decimals","stateMutability":"view","inputs":[],"outputs":[{"type":"uint8"}] },
  { "type":"function","name":"totalSupply","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"balanceOf","stateMutability":"view","inputs":[{"name":"account","type":"address"}],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"transfer","stateMutability":"nonpayable","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"type":"bool"}] },
  { "type":"function","name":"approve","stateMutability":"nonpayable","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"type":"bool"}] },
  { "type":"function","name":"allowance","stateMutability":"view","inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"outputs":[{"type":"uint256"}] },

  // --- state getters ---
  { "type":"function","name":"dETHToken","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}] },
  { "type":"function","name":"totalStaked","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"totalStakers","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}] },

  // --- core actions ---
  { "type":"function","name":"stake","stateMutability":"nonpayable","inputs":[{"name":"amount","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"unstake","stateMutability":"nonpayable","inputs":[{"name":"amount","type":"uint256"}],"outputs":[] },

  // --- reads (helpers) ---
  { "type":"function","name":"getStakeInfo","stateMutability":"view","inputs":[{"name":"user","type":"address"}],
    "outputs":[
      {"name":"amount","type":"uint256"},
      {"name":"timestamp","type":"uint256"},
      {"name":"rank","type":"uint256"}
    ]
  },
  { "type":"function","name":"getTotalStakers","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"getAllStakers","stateMutability":"view","inputs":[],"outputs":[{"type":"address[]"}] },
  { "type":"function","name":"getTopStakers","stateMutability":"view","inputs":[{"name":"count","type":"uint256"}],"outputs":[{"type":"address[]"},{"type":"uint256[]"}] },
  { "type":"function","name":"getStakingStats","stateMutability":"view","inputs":[],"outputs":[
      {"name":"_totalStaked","type":"uint256"},
      {"name":"_totalStakers","type":"uint256"},
      {"name":"_averageStake","type":"uint256"}
    ]
  },
  { "type":"function","name":"getPaginatedStakers","stateMutability":"view",
    "inputs":[{"name":"offset","type":"uint256"},{"name":"limit","type":"uint256"}],
    "outputs":[{"type":"address[]"},{"type":"uint256[]"},{"type":"uint256[]"},{"type":"uint256[]"}]
  },

  // --- admin ---
  { "type":"function","name":"updateLeaderboard","stateMutability":"nonpayable","inputs":[],"outputs":[] },

  // --- events ---
  { "type":"event","name":"Staked","anonymous":false,"inputs":[
    {"name":"user","type":"address","indexed":true},
    {"name":"amount","type":"uint256","indexed":false}
  ]},
  { "type":"event","name":"Unstaked","anonymous":false,"inputs":[
    {"name":"user","type":"address","indexed":true},
    {"name":"amount","type":"uint256","indexed":false}
  ]},
  { "type":"event","name":"LeaderboardUpdated","anonymous":false,"inputs":[
    {"name":"timestamp","type":"uint256","indexed":false}
  ]}
];
