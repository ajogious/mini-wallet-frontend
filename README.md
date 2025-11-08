# 💸 Mini Wallet - Frontend

A React.js app for managing wallets, transfers, and transactions through a simple, secure, and responsive interface.

## ✨ Features

- JWT-based login & registration
- Dashboard: balance + recent transactions
- Wallet actions: deposit, transfer, PIN verification
- Transaction history with pagination & filters
- Responsive UI built with Tailwind CSS
- Toast notifications & real-time updates

## 🛠 Tech Stack

**React 18** • **Tailwind CSS** • **Axios** • **React Router** • **Context API** • **JWT**

## ⚙️ Setup

### 1️⃣ Clone the Repo

```bash
git clone <repo-url> && cd mini-wallet-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create `.env` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4️⃣ Run App

```bash
npm run dev
```

➡️ Opens at: `http://localhost:5173`

## 📁 Structure

```
src/
├── components/    # Reusable components (FundWallet, TransferFunds, etc.)
├── pages/         # Login, Register, Dashboard, TransactionDetails
├── services/      # API logic (authService, walletService, etc.)
├── context/       # AuthContext & ToastContext
├── utils/         # Helpers
└── App.jsx
```

## 🔐 Auth Flow

- JWT stored in localStorage
- Auto token injection in requests
- Protected routes for dashboard access
- Auto logout on token expiry

## 💰 Wallet

- Deposit & transfer with PIN
- Real-time balance updates
- Transaction refresh every 30s

## 🚀 Production Build

```bash
npm run build
```

## 📜 License

MIT License © 2025

Am updating that is why this is here
