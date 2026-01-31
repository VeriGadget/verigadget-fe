'use client';

import { useState } from 'react';
import { useWarrantyProtocol } from '@/sui/hooks/useWarrantyProtocol';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function CreateWarrantyItem() {
  const { createItem } = useWarrantyProtocol();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    
    try {
        setIsLoading(true);
        // Convert to base units (6 decimals for USDC)
        const priceInBaseUnits = Math.floor(Number(price) * 1_000_000);
        await createItem(name, description, imageUrl, priceInBaseUnits);
        alert('Item created successfully!');
        setName('');
        setDescription('');
        setImageUrl('');
        setPrice('');
    } catch (err) {
        console.error(err);
        alert('Failed to create item.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-2xl bg-white shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900">List New Warranty Item</h2>
      
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="rounded-xl bg-zinc-50 border-zinc-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl bg-zinc-50 border-zinc-200"
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input 
            id="image" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="https://..." 
            className="rounded-xl bg-zinc-50 border-zinc-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USDC)</Label>
        <Input 
            id="price" 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            min="0" 
            className="rounded-xl bg-zinc-50 border-zinc-200"
        />
      </div>

      <Button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? 'Creating NFT...' : 'Create Listing on Sui'}
      </Button>
    </form>
  );
}
