"use client";

import Link from "next/link";
import { ShieldCheck, Search, ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WalletConnect } from "./WalletConnect";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-zinc-200 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-zinc-900 text-white p-1.5 rounded-lg group-hover:bg-zinc-800 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            VeriGadget
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Sell a Gadget
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
