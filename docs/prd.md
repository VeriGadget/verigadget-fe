# VeriGadget - Product Requirements Document

## Overview

VeriGadget is a decentralized escrow system built on Sui blockchain featuring a unique **Partial Settlement** mechanism controlled by the buyer. The system creates NFT-based warranty items that hold escrowed funds and can be discovered in the Sui ecosystem.

## Problem Statement

Traditional escrow systems have limitations:

- **All-or-nothing settlements** — Funds are either fully released or fully refunded
- **Lack of transparency** — Buyers can't verify the escrow state on-chain
- **Poor discoverability** — Escrowed items aren't visible in wallets/explorers

## Solution

A Sui Move smart contract that:

- Creates **NFT Listing Items** visible in Sui Wallet/Explorer (Display Standard)
- Enables **Partial Settlement** — Buyer approves a portion, rest is auto-refunded
- Uses **Shared Objects** for discoverability by all parties

## Functional Requirements

### 1. WarrantyItem NFT Structure

| Field       | Type              | Description                          |
| ----------- | ----------------- | ------------------------------------ |
| id          | UID               | Unique object identifier             |
| name        | String            | Item name (displayed in wallet)      |
| description | String            | Item description                     |
| image_url   | String            | Image URL (displayed in wallet)      |
| price       | u64               | Expected escrow amount               |
| status      | u8                | 0=Listed, 1=Locked, 2=Completed      |
| seller      | address           | Seller's address                     |
| buyer       | Option\<address\> | Buyer's address (set on lock)        |
| balance     | Balance\<T\>      | Escrowed funds                       |

### 2. Core Functions

#### `create_item` (Seller Action)

- **Input:** name, description, image_url, price
- **Action:** Mint new WarrantyItem as Shared Object
- **Output:** Emit `ItemCreated` event
- **Status:** Listed (0)

#### `lock_funds` (Buyer Action)

- **Input:** WarrantyItem reference, Coin
- **Validation:** Coin value must equal item price
- **Action:** Store funds in item, record buyer address
- **Output:** Emit `FundsLocked` event
- **Status:** Locked (1)

#### `finalize_and_split` (Buyer Action — Unique Feature)

- **Input:** WarrantyItem reference, amount_for_seller
- **Permission:** Only buyer can call
- **Validation:** amount_for_seller ≤ locked balance
- **Action:**
  - Send amount_for_seller to Seller
  - Auto-refund remaining balance to Buyer
- **Output:** Emit `ItemFinalized` event
- **Status:** Completed (2)

**Partial Settlement Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│                    PARTIAL SETTLEMENT FLOW                    │
├─────────────────────────────────────────────────────────────┤
│  Locked Amount: 1000 USDC                                    │
│  Buyer Approves: 600 USDC for Seller                         │
│                                                              │
│  ┌──────────┐     600 USDC     ┌──────────┐                 │
│  │  ESCROW  │ ───────────────► │  SELLER  │                 │
│  │  1000    │                  └──────────┘                 │
│  │          │     400 USDC     ┌──────────┐                 │
│  │          │ ───────────────► │  BUYER   │  (Auto-refund)  │
│  └──────────┘                  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 3. Events

| Event          | Fields                          |
| -------------- | ------------------------------- |
| ItemCreated    | item_id, seller, name, price     |
| FundsLocked    | item_id, buyer, amount          |
| ItemFinalized  | item_id, seller_amount, buyer_refund |

### 4. Error Codes

| Code | Name           | Description                    |
| ---- | -------------- | ------------------------------ |
| 0    | ENotBuyer      | Caller is not the buyer        |
| 1    | EAmountMismatch| Coin value ≠ price             |
| 2    | EInvalidStatus | Wrong status for operation     |
| 3    | EExcessiveAmount | amount_for_seller > balance  |
| 4    | EAlreadyLocked | Item already has a buyer       |

## Technical Requirements

### Sui Display Standard

The `init` function must create a `Display<WarrantyItem<T>>` object with:

- `name` → `{name}`
- `description` → `{description}`
- `image_url` → `{image_url}`

### Generic Token Support

Use `<phantom T>` type parameter for coin types (SUI, USDC, etc.).
