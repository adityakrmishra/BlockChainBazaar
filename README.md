# BlockChainBazaar 🛒🌐



A next-generation NFT marketplace platform enabling seamless creation, trading, and management of digital assets through blockchain technology.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Available-green?style=for-the-badge&logo=replit)](https://d806cffc-9a2c-44ab-b2fb-c7c79268a880-00-c8y7j07uhpkk.kirk.replit.dev/)
[![GitHub License](https://img.shields.io/github/license/yourusername/BlockChainBazaar?style=for-the-badge)](https://github.com/yourusername/BlockChainBazaar)

## ✨ Features
- 🔒 Secure Web3 wallet authentication
- 🎨 NFT Minting & Auction Creation Wizard
- ⚡ Real-time bidding system with instant updates
- 🌓 Dark/Light mode toggle
- 📱 Fully responsive cross-device interface
- 📈 Activity feed with transaction history

## 🛠 Tech Stack
### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-4A154B?style=for-the-badge)

### Blockchain
![Web3.js](https://img.shields.io/badge/Web3.js-F16822?style=for-the-badge&logo=web3.js)
![Ethers.js](https://img.shields.io/badge/Ethers.js-3C3C3D?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MetaMask Wallet

### Installation
```bash
# Clone repository
git clone https://github.com/adityakrmishra/BlockChainBazaar.git

# Install dependencies
cd client && npm install
cd ../server && npm install

# Start development servers
npm run dev --prefix ../client
npm run dev --prefix ../server
```

### Configuration
Create `.env` files in both client and server directories:

**client/.env**
```env
REACT_APP_INFURA_KEY=your_infura_key
REACT_APP_ALCHEMY_KEY=your_alchemy_key
```

**server/.env**
```env
DATABASE_URL=postgres://user:password@localhost:5432/blockchainbazaar
JWT_SECRET=your_jwt_secret
```



## 🙏 Acknowledgments
- Replit for deployment support
- Ethereum developer community
