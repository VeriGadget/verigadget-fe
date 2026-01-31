export type WarrantyStatus = 0 | 1 | 2; // 0=Listed, 1=Locked, 2=Completed

export interface WarrantyItem {
  id: string; // Sui UID
  name: string;
  description: string;
  image_url: string;
  price: number; // in SUI/USDC
  status: WarrantyStatus;
  seller: string; // Address
  buyer?: string; // Address
  balance: number; // Escrowed funds
  coinType: string; // The Coin Type accepted (e.g., SUI or MOCK_USDC)
  
  // Metadata for the Gadget marketplace context
  category: "Laptop" | "Phone" | "Tablet" | "Wearable";
  brand: string;
  condition: "Mint" | "Excellent" | "Good" | "Fair";
  inspectionDays: number;
  history: {
    date: string;
    event: string;
    txHash?: string;
  }[];
}

export const WARRANTY_ITEMS: WarrantyItem[] = [
  {
    id: "0x7a...f1",
    name: "MacBook Pro M2 Max 14-inch (2023)",
    description: "Barely used MacBook Pro. Battery health at 100%. Comes with original box and charger.",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    price: 1850,
    status: 0,
    seller: "0x9e...a2",
    balance: 0,
    category: "Laptop",
    brand: "Apple",
    condition: "Mint",
    inspectionDays: 3,
    coinType: '0x2::sui::SUI',
    history: [
      { date: "Jan 2026", event: "NFT Created & Listed", txHash: "0x12...34" }
    ]
  },
  {
    id: "0x4b...e9",
    name: "iPhone 15 Pro Max 256GB",
    description: "Always kept in a case. Screen is flawless. Battery health 98%.",
    image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
    price: 920,
    status: 1,
    seller: "0x3c...d5",
    buyer: "0xf8...b1",
    balance: 920,
    category: "Phone",
    brand: "Apple",
    condition: "Excellent",
    inspectionDays: 2,
    coinType: '0x2::sui::SUI',
    history: [
      { date: "Jan 2026", event: "NFT Created & Listed", txHash: "0x56...78" },
      { date: "Jan 2026", event: "Funds Locked by Buyer", txHash: "0x90...ab" }
    ]
  },
  {
    id: "0x2c...c8",
    name: "Dell XPS 15 (9530)",
    description: "High performance workstation. Minor scratches on bottom.",
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
    price: 1450,
    status: 2,
    seller: "0x1a...b2",
    buyer: "0xde...f3",
    balance: 0,
    category: "Laptop",
    brand: "Dell",
    condition: "Good",
    inspectionDays: 3,
    coinType: '0x2::sui::SUI',
    history: [
      { date: "Dec 2025", event: "NFT Created & Listed", txHash: "0xcd...ef" },
      { date: "Jan 2026", event: "Funds Locked by Buyer", txHash: "0xgh...ij" },
      { date: "Jan 2026", event: "Partial Settlement Completed ($1,300 to Seller, $150 Refunded)", txHash: "0xkl...mn" }
    ]
  },
  {
    id: "0x8d...d4",
    name: "iPad Pro 12.9-inch (6th Gen)",
    description: "M2 chip, 256GB. Includes Magic Keyboard.",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
    price: 1100,
    status: 0,
    seller: "0x5e...f6",
    balance: 0,
    category: "Tablet",
    brand: "Apple",
    condition: "Mint",
    inspectionDays: 2,
    coinType: '0x2::sui::SUI',
    history: [
      { date: "Jan 2026", event: "NFT Created & Listed", txHash: "0xop...qr" }
    ]
  }
];
