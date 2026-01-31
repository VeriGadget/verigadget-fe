"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Wallet,
  MoreVertical,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function SellerDashboard() {
  const stats = [
    { title: "Total Sales", value: "$4,250", icon: <TrendingUp className="w-4 h-4 text-green-500" />, trend: "+12%" },
    { title: "Active Escrows", value: "3", icon: <Clock className="w-4 h-4 text-blue-500" />, trend: "Ongoing" },
    { title: "Wallet Balance", value: "$1,850", icon: <Wallet className="w-4 h-4 text-zinc-900" />, trend: "Available" },
    { title: "Trust Score", value: "99.2", icon: <ShieldCheck className="w-4 h-4 text-green-600" />, trend: "Top Rated" }
  ];

  const myGadgets = [
    {
      id: "G101",
      item: "MacBook Pro M2 Max",
      price: "$1,850",
      status: "Inspecting",
      date: "Jan 28, 2026",
      buyer: "Sarah J."
    },
    {
      id: "G102",
      item: "Sony WH-1000XM5",
      price: "$280",
      status: "Completed",
      date: "Jan 25, 2026",
      buyer: "Mike R."
    },
    {
      id: "G103",
      item: "iPad Pro 12.9",
      price: "$1,100",
      status: "Waiting",
      date: "Jan 29, 2026",
      buyer: "Pending"
    },
    {
      id: "G104",
      item: "iPhone 13 (Faulty)",
      price: "$210",
      status: "Disputed",
      date: "Jan 20, 2026",
      buyer: "Alex K."
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Inspecting":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none rounded-full px-3">Inspecting</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-3">Completed</Badge>;
      case "Waiting":
        return <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 border-none rounded-full px-3">Waiting</Badge>;
      case "Disputed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none rounded-full px-3">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-zinc-50/50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 mb-2">Seller Dashboard</h1>
            <p className="text-zinc-500">Manage your gadget listings and escrow statuses.</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 h-12 px-6">
              <Plus className="w-4 h-4 mr-2" />
              List New Gadget
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="border-zinc-200 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.trend}</span>
                </div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{stat.title}</div>
                <div className="text-2xl font-black text-zinc-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-bold">My Gadget Listings</CardTitle>
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList className="bg-zinc-100 rounded-xl p-1">
                  <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
                  <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="border-zinc-100">
                  <TableHead className="px-8 font-bold text-zinc-900">Item</TableHead>
                  <TableHead className="font-bold text-zinc-900">Price</TableHead>
                  <TableHead className="font-bold text-zinc-900">Buyer</TableHead>
                  <TableHead className="font-bold text-zinc-900">Status</TableHead>
                  <TableHead className="font-bold text-zinc-900">Date</TableHead>
                  <TableHead className="text-right px-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myGadgets.map((gadget) => (
                  <TableRow key={gadget.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-zinc-400" />
                        </div>
                        <span className="font-bold text-zinc-900">{gadget.item}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-zinc-600">{gadget.price}</TableCell>
                    <TableCell className="text-zinc-500">{gadget.buyer}</TableCell>
                    <TableCell>{getStatusBadge(gadget.status)}</TableCell>
                    <TableCell className="text-zinc-400 text-sm">{gadget.date}</TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 text-center">
            <Button variant="link" className="text-zinc-500 font-bold hover:text-zinc-900 group">
              View All History <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="mt-12 p-8 bg-zinc-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Your payments are safe</h3>
              <p className="text-zinc-400 text-sm max-w-md">
                VeriGadget holds all buyer funds in institutional-grade escrow. Funds are automatically released 48h after delivery unless a dispute is opened.
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full border-zinc-700 hover:bg-zinc-800 text-white h-12 px-8">
            Learn about Protection
          </Button>
        </div>
      </div>
    </div>
  );
}
