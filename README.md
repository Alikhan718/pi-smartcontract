# Decentralized Asset Exchange

## Overview

This project implements a decentralized asset exchange on an Ethereum testnet. The goal is to facilitate trustless peer-to-peer asset exchanges without requiring a centralized authority.

Users can:
- Register digital assets on the blockchain
- List their assets for trade
- Propose trades for listed assets
- Accept trades to atomically swap asset ownership without intermediaries

## Features

### Asset Registration
Users can create unique digital assets, which are stored on-chain with an owner and details.

### Asset Listing
Asset owners can list their assets for trade, specifying which asset ID they want in exchange.

### Trade Proposals
Another user can propose a trade by offering an asset they own to meet the listing's requirements.

### Trade Acceptance (Atomic Swap)
The original listing owner accepts a proposal, and ownership of both assets is exchanged atomically in one transaction.

## Technology Stack

- **Smart Contract Language:** Solidity (0.8.20)
- **Development Framework:** Hardhat
- **Testing & Deployment:** Ethers.js, Hardhat
- **Ethereum Testnet:** Sepolia

**Optional Tools:**
- Slither for static analysis
- MetaMask / Ethers.js for client-side interactions

## Project Structure

```
project-root/
├─ contracts/
│  └─ Contract.sol        # The main smart contract
├─ scripts/
│  ├─ deploy.js           # Deploy contract
│  ├─ setup.js            # Set up scenario: register assets, list an asset
│  ├─ proposeTrade.js     # Second signer proposes a trade
│  ├─ acceptTrade.js      # Original signer accepts the proposed trade
│  └─ interact.js         # Demonstration script for registering & listing assets
├─ test/
│  └─ Contract.test.js    # Unit tests
├─ hardhat.config.js      # Hardhat configuration
├─ package.json
├─ .env                   # Environment variables
└─ README.md
```

## Setup Instructions

### Prerequisites

- **Node.js & npm:** Ensure you have Node.js and npm installed
- **Hardhat & Dependencies:** This project uses Hardhat, Ethers.js, and the Hardhat Toolbox

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   PRIVATE_KEY=0xYOUR_MAIN_ACCOUNT_PRIVATE_KEY
   SECOND_PRIVATE_KEY=0xYOUR_SECOND_ACCOUNT_PRIVATE_KEY
   ```
   Ensure both accounts have test ETH on Sepolia.

3. Compile the contract:
   ```bash
   npx hardhat compile
   ```

4. Deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## Usage Guide

### Registering Assets and Listing for Trade

Run setup script:
```bash
npx hardhat run scripts/setup.js --network sepolia
```

### Proposing a Trade

Run propose trade script:
```bash
npx hardhat run scripts/proposeTrade.js --network sepolia
```

### Accepting a Trade

Run accept trade script:
```bash
npx hardhat run scripts/acceptTrade.js --network sepolia
```

## Testing

### Unit Tests

```bash
npx hardhat test
```

### Security Testing

Use Slither for static analysis:
```bash
slither ./contracts/Contract.sol
```

## Client Integration

- Connect users' wallets with MetaMask
- Provide UI to call contract functions
- Listen to emitted events for real-time updates

## Security Considerations

- Access Control: Only asset owners can list and accept trades
- Input Validation: Checks for asset existence and ownership
- Data Privacy: Minimal on-chain data storage

## Contributing

Contributions and suggestions are welcome. Please open issues or pull requests.

## License

This project is released under the MIT License.