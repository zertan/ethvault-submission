// Minimal ABI for StakingDashboard
module.exports = [
  // --- token refs ---
  { "type":"function","name":"sETHToken","stateMutability":"view","inputs":[],"outputs":[{ "type":"address" }] },
  { "type":"function","name":"dETHToken","stateMutability":"view","inputs":[],"outputs":[{ "type":"address" }] },

  // --- reads ---
  {
    "type":"function","name":"getStakingOverview","stateMutability":"view","inputs":[],
    "outputs":[
      { "name":"totalETHDeposited",   "type":"uint256" },
      { "name":"totalETHStaked",      "type":"uint256" },
      { "name":"totalStakers",        "type":"uint256" },
      { "name":"averageStakeAmount",  "type":"uint256" }
    ]
  },
  {
    "type":"function","name":"getLeaderboard","stateMutability":"view",
    "inputs":[ { "name":"count","type":"uint256" } ],
    "outputs":[
      { "name":"stakerAddresses",   "type":"address[]"  },
      { "name":"stakedAmounts",     "type":"uint256[]"  },
      { "name":"percentageOfTotal", "type":"uint256[]"  }
    ]
  },
  {
    "type":"function","name":"getStakerDetails","stateMutability":"view",
    "inputs":[ { "name":"staker","type":"address" } ],
    "outputs":[
      { "name":"stakedAmount",       "type":"uint256" },
      { "name":"stakingTimestamp",   "type":"uint256" },
      { "name":"rank",               "type":"uint256" },
      { "name":"percentageOfTotal",  "type":"uint256" }
    ]
  },
  {
    "type":"function","name":"getStakingActivity","stateMutability":"view",
    "inputs":[ { "name":"daysAgo","type":"uint256" } ],
    "outputs":[
      { "name":"activeStakers",  "type":"uint256" },
      { "name":"recentStakers",  "type":"address[]" }
    ]
  },
  {
    "type":"function","name":"getPaginatedStakersDetailed","stateMutability":"view",
    "inputs":[
      { "name":"offset","type":"uint256" },
      { "name":"limit", "type":"uint256" }
    ],
    "outputs":[
      { "name":"stakers",     "type":"address[]"  },
      { "name":"amounts",     "type":"uint256[]"  },
      { "name":"timestamps",  "type":"uint256[]"  },
      { "name":"ranks",       "type":"uint256[]"  },
      { "name":"percentages", "type":"uint256[]"  }
    ]
  }
];
