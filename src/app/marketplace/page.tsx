"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock,
  LayoutGrid,
  List as ListIcon,
  Box,
  Fingerprint
} from "lucide-react";
import { useMarketplaceItems } from "@/sui/hooks/useMarketplaceItems";
// import { WARRANTY_ITEMS, WarrantyItem } from "@/lib/data"; // Removed static import
import { WarrantyItem } from "@/lib/data"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; 

export default function MarketplacePage() {
  const { items: marketplaceItems, isLoading, error } = useMarketplaceItems();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesCondition = selectedCondition === "all" || item.condition.toLowerCase() === selectedCondition.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0: return <Badge className="bg-green-500 text-white border-none">Listed</Badge>;
      case 1: return <Badge className="bg-blue-500 text-white border-none">Locked</Badge>;
      case 2: return <Badge className="bg-zinc-500 text-white border-none">Completed</Badge>;
      default: return null;
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-zinc-50/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">On-Chain Marketplace</h1>
            <p className="text-zinc-500">
              Every listing is a unique <strong>WarrantyItem NFT</strong> on the Sui blockchain.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Fingerprint className="w-4 h-4" />
            Verifiable via Sui Explorer
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm mb-10 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search by model, brand, or NFT ID..." 
              className="pl-10 h-11 bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl border-zinc-100 bg-zinc-50/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="laptop">Laptops</SelectItem>
                <SelectItem value="phone">Phones</SelectItem>
                <SelectItem value="tablet">Tablets</SelectItem>
                <SelectItem value="wearable">Wearables</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl border-zinc-100 bg-zinc-50/50">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Condition</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 px-4">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            
            <div className="h-11 w-[1px] bg-zinc-200 mx-2 hidden sm:block" />
            
            <div className="flex bg-zinc-100 p-1 rounded-xl">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-white shadow-sm text-zinc-900">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-zinc-400">
                <ListIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/marketplace/${item.id}`}>
                  <Card className="group overflow-hidden border-zinc-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white relative">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/90 backdrop-blur-md text-zinc-900 border-none shadow-sm px-3 py-1 text-xs font-bold rounded-full">
                          {item.condition}
                        </Badge>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-zinc-900/10 backdrop-blur-md text-white border-white/20 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {item.brand}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-2xl font-black text-zinc-900 flex items-baseline gap-1">
                          {(item.price / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} <span className="text-sm font-bold text-zinc-400">USDC</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100">
                          <Clock className="w-3 h-3" />
                          {item.inspectionDays}d Window
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                             <Box className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">{item.id.substring(0, 10)}...</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-500" />
                          On-Chain
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No listings found</h3>
            <p className="text-zinc-500">Try adjusting your filters or searching for an NFT ID.</p>
            <Button 
              variant="link" 
              className="mt-4 text-blue-600 font-bold"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedCondition("all");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
