# Product Requirements Document (PRD): Warranty Protocol Marketplace Integration

## 1. Overview
The goal is to integrate the `warranty_protocol::marketplace` Sui Move smart contract into the existing `verigadget-fe` Next.js application. This involves setting up the Sui DApp Kit, handling wallet connections, and implementing frontend components for the three core marketplace stages: Listing, Locking Funds, and Settlement.

## 2. Technical Dependencies & Setup
### 2.1 Package Conflicts
- **Issue**: `better-auth` vs `autumn-js` peer dependency conflict.
- **Resolution**: Upgrade `better-auth` to `^1.3.17` (already updated in `package.json`, pending install).
- **New Packages**:
    - `@mysten/dapp-kit`
    - `@mysten/sui` (or `@mysten/sui.js`)
    - `@tanstack/react-query` (Required by DApp Kit)

### 2.2 Smart Contract Management
- **Location**: Create a `sui/` or `move/` directory in the project root to store the `warranty_protocol` module.
- **Deployment**: The contract needs to be published to the Sui network (Testnet or Devnet) to generate the `package_id` needed for frontend interaction.

## 3. Features & UX Flow

### 3.1 Wallet Connection
- **Feature**: Global wallet connection button.
- **Components**: `ConnectButton` from DApp Kit.
- **Logic**: Must wrap the app in `SuiClientProvider` and `WalletProvider`.

### 3.2 Seller: Create Listing (`create_item`)
- **UI**: A form with fields for `Name`, `Description`, `Image URL`, and `Price (SUI)`.
- **Transaction**:
    - Call `move_call` on `create_item`.
    - Arguments: `name` (string), `description` (string), `image_url` (string), `price` (u64).
    - Note: Inputs must be serialized correctly (e.g., Strings as bytes).

### 3.3 Buyer: Discovery & Locking (`lock_funds`)
- **UI**: A viewing page for an item (initially mocked or fetched by ID).
- **Action**: "Buy / Lock Funds" button.
- **Transaction**:
    - Call `move_call` on `lock_funds`.
    - Arguments: `item_object_id`, `payment_coin`.
    - Logic: Need to handle Coin selection/splitting to match exact price.

### 3.4 Buyer: Final Settlement (`finalize_and_split`)
- **UI**: Dashboard for "My Purchases".
- **Action**: "Release Funds" slider/input.
    - Buyer chooses how much goes to Seller (0% to 100%).
    - Remaining auto-refunds to Buyer.
- **Transaction**:
    - Call `move_call` on `finalize_and_split`.
    - Arguments: `item_object_id`, `amount_for_seller`.

## 4. Implementation Steps
1.  **Install Dependencies**: Run `npm install` with the fixed `package.json`.
2.  **Smart Contract Setup**: Save the provided Move code and (optionally) deploy it to get a Package ID for testing.
3.  **Provider Setup**: Wrap the Next.js app with `dapp-kit` providers in `src/app/providers.tsx` (or similar).
4.  **Component Development**:
    - `WalletConnect.tsx`
    - `CreateWarrantyItem.tsx`
    - `ItemView.tsx` (Handle Locking)
    - `SettlementView.tsx` (Handle Finalizing)
5.  **Integration**: logical routing and state updates.

## 5. Visual Design (Aesthetics)
- **Theme**: Premium, "Glassmorphism" dark mode using the existing Tailwind setup.
- **Components**: Use Radix UI primitives with motion effects (Framer Motion) for transaction states (Loading, Success, Error).

## 6. Open Questions
- Do we have a deployed Package ID, or should I define a placeholder? (I will assume we need to deploy or use a placeholder).
- Do we need an "Indexer" to list all created items, or will we manually test with Object IDs? (MVP: Use Object IDs).

---
**Status**: Pending Approval
