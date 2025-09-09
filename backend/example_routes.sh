##############################
# DepositETH (dETH) endpoints
##############################

# Deposit 0.1 ETH (mint dETH)
curl -X POST http://localhost:4001/api/deth/deposit \
  -H "Content-Type: application/json" \
  -d '{"amountEth":"0.1"}'

# Withdraw 0.05 ETH (burn dETH)
curl -X POST http://localhost:4001/api/deth/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amountEth":"0.05"}'

# Get dETH balance of an address
curl http://localhost:4001/api/deth/balance/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Get ETH balance held by the dETH contract
curl http://localhost:4001/api/deth/contract-balance


##############################
# StakedETH (sETH) endpoints
##############################

# Stake dETH (requires prior approval of dETH)
curl -X POST http://localhost:4001/api/seth/stake \
  -H "Content-Type: application/json" \
  -d '{"amountWei":"100000000000000000"}'   # 0.1 dETH

# Unstake sETH → receive dETH back
curl -X POST http://localhost:4001/api/seth/unstake \
  -H "Content-Type: application/json" \
  -d '{"amountWei":"50000000000000000"}'   # 0.05 sETH

# Get stake info for a user
curl http://localhost:4001/api/seth/stake-info/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Get total staked + staker count
curl http://localhost:4001/api/seth/totals

# Get all stakers (careful: may be large)
curl http://localhost:4001/api/seth/stakers/all

# Get top 5 stakers
curl http://localhost:4001/api/seth/stakers/top?count=5

# Get paginated stakers (offset=0, limit=10)
curl http://localhost:4001/api/seth/stakers?offset=0&limit=10

# Get sETH token balance for a user
curl http://localhost:4001/api/seth/balance/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Admin: update leaderboard
curl -X POST http://localhost:4001/api/seth/leaderboard/update


##############################
# Governance endpoints
##############################

# Create a new proposal
curl -X POST http://localhost:4001/api/governance/proposals \
  -H "Content-Type: application/json" \
  -d '{"description":"Upgrade rewards","target":"0x0000000000000000000000000000000000000000","callData":"0x"}'

# Get total proposal count
curl http://localhost:4001/api/governance/proposals/count

# Get details of proposal ID 0
curl http://localhost:4001/api/governance/proposals/0

# Get votes summary of proposal ID 0
curl http://localhost:4001/api/governance/proposals/0/votes

# Get how a user voted on proposal 0
curl http://localhost:4001/api/governance/proposals/0/vote/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Cast a vote on proposal 0 (support=true)
curl -X POST http://localhost:4001/api/governance/proposals/0/vote \
  -H "Content-Type: application/json" \
  -d '{"support":true}'

# Execute proposal 0
curl -X POST http://localhost:4001/api/governance/proposals/0/execute

# Cancel proposal 0
curl -X POST http://localhost:4001/api/governance/proposals/0/cancel

# Read current governance params
curl http://localhost:4001/api/governance/params

# Update governance params (admin only)
curl -X PUT http://localhost:4001/api/governance/params \
  -H "Content-Type: application/json" \
  -d '{"votingPeriod":"259200","executionDelay":"172800","quorum":"100000000000000000000"}'


##############################
# StakingDashboard endpoints
##############################

# Get staking overview
curl http://localhost:4001/api/dashboard/overview

# Get leaderboard (top 5)
curl http://localhost:4001/api/dashboard/leaderboard?count=5

# Get details for a specific staker
curl http://localhost:4001/api/dashboard/staker/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Get staking activity in the last 7 days
curl http://localhost:4001/api/dashboard/activity?daysAgo=7

# Get paginated stakers (offset=0, limit=10)
curl http://localhost:4001/api/dashboard/stakers?offset=0&limit=10

# Get addresses of sETH and dETH tokens
curl http://localhost:4001/api/dashboard/tokens
