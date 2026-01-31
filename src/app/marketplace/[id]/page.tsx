"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Clock,
  ArrowLeft, 
  CheckCircle2,
  Lock,
  Box,
  Fingerprint,
  Split,
  ChevronRight,
  Info,
  History as HistoryIcon
} from "lucide-react";
// import { WARRANTY_ITEMS, WarrantyItem } from "@/lib/data"; // Removed static
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useMarketplaceItem } from "@/sui/hooks/useMarketplaceItems";
import { useWarrantyProtocol } from "@/sui/hooks/useWarrantyProtocol";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { MOCK_USDC_TYPE } from "@/sui/config";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { item, isLoading } = useMarketplaceItem(id as string);
  const { lockFunds, finalizeAndSplit, mintMockUsdc } = useWarrantyProtocol();
  const account = useCurrentAccount();
  
  const [settlementAmount, setSettlementAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch User's Coins for the specific Item Type
  const { data: userCoins } = useSuiClientQuery('getCoins', {
    owner: account?.address || '',
    coinType: item?.coinType // Dynamically fetch coins matching the item
  }, {
    enabled: !!account && !!item?.coinType
  });

  // Helper for Mock USDC Minting
  const handleMint = async () => {
    try {
        setIsProcessing(true);
        await mintMockUsdc(1000000000); // Mint 1000 USDC (assuming 6 decimals)
        alert("Minted MOCK USDC! Refreshing balance...");
        window.location.reload();
    } catch (e) {
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  }

  const handleLockFunds = async () => {
    try {
        if (!item || !account) return;
        
        // AUTOMATIC COIN SELECTION
        // Find a coin with enough balance
        const suitableCoin = userCoins?.data.find(coin => BigInt(coin.balance) >= BigInt(item.price));

        if (!suitableCoin) {
            alert(`Insufficient Balance! You need at least ${item.price / 1_000_000} ${item.coinType.includes('USDC') ? 'USDC' : 'Tokens'}. Try minting some if this is a testnet token.`);
            return;
        }

        setIsProcessing(true);
        // Use the automatically selected coin + the Item's Coin Type
        await lockFunds(item.id, item.price, suitableCoin.coinObjectId, item.coinType);
        alert("Funds locked successfully!");
    } catch (e) {
        console.error(e);
        alert("Failed to lock funds. Check console.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFinalize = async () => {
     try {
        if (!item) return;
        setIsProcessing(true);
        await finalizeAndSplit(item.id, settlementAmount, item.coinType);
        alert("Transaction finalized!");
    } catch (e) {
        console.error(e);
        alert("Failed to finalize transaction.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (isLoading) {
      return <div className="pt-32 pb-20 text-center"><h1 className="text-xl">Loading NFT Details...</h1></div>;
  }

  if (!item) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold">Listing NFT not found</h1>
        <p className="text-zinc-500 mb-4">The object ID {id} could not be fetched.</p>
        <Button asChild className="mt-4">
          <Link href="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  // Initialize settlement amount to price if not already set (for UI demo)
  if (settlementAmount === 0 && item.price) setSettlementAmount(item.price);

  const getStatusDisplay = (status: number) => {
    switch(status) {
      case 0: return { label: "Listed", color: "text-green-600 bg-green-50 border-green-100", icon: <Box className="w-4 h-4" /> };
      case 1: return { label: "Funds Locked", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Lock className="w-4 h-4" /> };
      case 2: return { label: "Completed", color: "text-zinc-600 bg-zinc-50 border-zinc-100", icon: <CheckCircle2 className="w-4 h-4" /> };
      default: return null;
    }
  };

  const statusInfo = getStatusDisplay(item.status);

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <Link 
          href="/marketplace" 
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </Link>
        
        {/* Debug Mint Button (Optional) */}
        {account && (
             <div className="mb-4 text-right">
                 <Button variant="outline" size="sm" onClick={handleMint} disabled={isProcessing}>
                    Mint Test MOCK USDC (Faucet)
                 </Button>
             </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Images & NFT Identity */}
          <div className="space-y-8">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-zinc-100 border border-zinc-200 relative group">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                        <Fingerprint className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sui NFT Object</div>
                        <div className="text-sm font-mono font-bold text-zinc-900">{item.id.substring(0, 16)}...</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
            </div>
            
            <Card className="border-zinc-100 bg-zinc-50/50 rounded-[2rem]">
              <CardContent className="p-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5" />
                  On-Chain History
                </h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200">
                  {item.history.map((event, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-zinc-200 border-2 border-white" />
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                        {event.date}
                      </div>
                      <div className="text-sm font-semibold text-zinc-900 mb-1">
                        {event.event}
                      </div>
                      {event.txHash && (
                        <div className="text-[10px] font-mono text-blue-500 hover:underline cursor-pointer">
                          TX: {event.txHash}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge variant="outline" className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-zinc-200">
                  {item.brand} • {item.category}
                </Badge>
                <Badge className="bg-zinc-100 text-zinc-900 border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                  {item.condition}
                </Badge>
                {statusInfo && (
                  <Badge className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tight leading-[1.1]">
                {item.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-zinc-900">
                    {(item.price / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                  <span className="text-xl font-bold text-zinc-400">USDC</span>
                </div>
                <div className="h-10 w-[1px] bg-zinc-100" />
                <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                  Escrow Active
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Smart Contract Feature: Partial Settlement UI */}
            {item.status === 1 ? (
              <Card className="border-blue-200 bg-blue-50/30 rounded-[2.5rem] mb-8 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <Split className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">Execute Partial Settlement</h4>
                      <p className="text-xs text-zinc-500">Only you (the buyer) can finalize this split.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Seller receives</label>
                        <div className="text-2xl font-black text-blue-600">
                            {(settlementAmount / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC
                        </div>
                      </div>
                      <Slider 
                        value={[settlementAmount]} 
                        max={item.price} 
                        step={100_000} // Step by 0.1 USDC
                        onValueChange={(val) => setSettlementAmount(val[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-blue-100">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Auto-refund to you</div>
                        <div className="text-lg font-black text-green-600">
                            {((item.price - settlementAmount) / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC
                        </div>
                      </div>
                    </div>

                    <Button 
                        onClick={handleFinalize} 
                        disabled={isProcessing}
                        className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-bold shadow-lg shadow-blue-200 transition-all">
                      {isProcessing ? 'Processing Transaction...' : 'Finalize & Split Funds'}
                    </Button>
                    <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      This action burns the Listing NFT and distributes funds on-chain.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : item.status === 0 ? (
              <div className="space-y-8">
                <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-200 flex-shrink-0">
                      <Clock className="w-5 h-5 text-zinc-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-1">
                        {item.inspectionDays}-Day Inspection window
                      </h4>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        Funds are held in a shared object. You have full control over the settlement until the window expires.
                      </p>
                    </div>
                  </div>
                </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex justify-between">
                          <span>Your Balance</span>
                          <span className={
                              (userCoins?.data.reduce((acc, coin) => acc + Number(coin.balance), 0) || 0) >= item.price
                              ? "text-green-600"
                              : "text-red-600"
                          }>
                              {((userCoins?.data.reduce((acc, coin) => acc + Number(coin.balance), 0) || 0) / 1_000_000).toLocaleString()} {item.coinType.split('::').pop()}
                          </span>
                       </div>
                       <Button 
                        size="lg" 
                        className="w-full rounded-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 shadow-xl shadow-zinc-200"
                        onClick={handleLockFunds}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Lock Funds & Buy'}
                      </Button>
                    </div>

                    <Button variant="outline" size="lg" className="rounded-full h-14 text-lg border-zinc-200 px-8">
                      Message Seller
                    </Button>
                  </div>
              </div>
            ) : (
              <div className="p-12 rounded-[3.5rem] bg-zinc-50 border border-zinc-100 text-center">
                <CheckCircle2 className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-400">Escrow Completed</h3>
                <p className="text-sm text-zinc-400 mt-2">This NFT has been finalized and the warranty is active.</p>
              </div>
            )}

            <div className="mt-12 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4 uppercase tracking-widest text-[11px]">Seller Declaration</h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>

              <Separator className="bg-zinc-50" />

              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-200" />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Seller: {item.seller.substring(0, 10)}...</div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Verified Merchant</div>
                    </div>
                 </div>
                 <Badge variant="outline" className="text-zinc-400 font-bold text-[10px] border-none">99.8% TRUST SCORE</Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* On-Chain Verification Block */}
        <div className="mt-32 p-12 md:p-20 bg-zinc-900 rounded-[4rem] text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
           </div>
           
           <div className="max-w-4xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Verify on Sui Explorer</h2>
                <p className="text-zinc-400 mb-10 leading-relaxed">
                  Every Warranty on Chain listing is a first-class object on the Sui blockchain. You can verify the price, seller address, and locked status directly in the explorer.
                </p>
                <div className="space-y-4">
                  {[
                    "Item Metadata (Display Standard)",
                    "Partial Settlement Permissions",
                    "Generic Coin Type Support",
                    "Shared Object Discoverability"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-zinc-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[3rem]">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Info className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm font-bold text-zinc-300">Smart Contract Rules</span>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] text-zinc-400 space-y-2">
                       <p className="text-blue-400"># ENforce settlement rules</p>
                       <p>assert!(caller == buyer, ENotBuyer);</p>
                       <p>assert!(amount_for_seller &lt;= balance, EExcessiveAmount);</p>
                       <p className="text-green-400"># execute split</p>
                       <p>transfer(seller_amount, seller);</p>
                       <p>transfer(buyer_refund, buyer);</p>
                    </div>
                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                      View Source on Sui
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
