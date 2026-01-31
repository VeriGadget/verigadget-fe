import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui/client';
import { PACKAGE_ID, MARKETPLACE_MODULE } from '../config';
import { WarrantyItem, WarrantyStatus } from '@/lib/data';

// Helper to check if an object is a WarrantyItem
function isWarrantyItem(type: string | undefined | null) {
  return type?.startsWith(`${PACKAGE_ID}::${MARKETPLACE_MODULE}::WarrantyItem`);
}

function parseWarrantyItem(data: SuiObjectData): WarrantyItem | null {
  if (!data.content || data.content.dataType !== 'moveObject') return null;
  
  const fields = data.content.fields as any;
  
  // Basic heuristic to guess brand and category from name
  const name = fields.name as string;
  const lowerName = name.toLowerCase();
  
  let brand = "Unknown";
  if (lowerName.includes("mac") || lowerName.includes("iphone") || lowerName.includes("ipad") || lowerName.includes("apple")) brand = "Apple";
  else if (lowerName.includes("dell")) brand = "Dell";
  else if (lowerName.includes("samsung")) brand = "Samsung";
  else if (lowerName.includes("pixel")) brand = "Google";
  else if (lowerName.includes("sony")) brand = "Sony";
  else if (lowerName.includes("hp")) brand = "HP";
  
  let category: any = "Other";
  if (lowerName.includes("book") || lowerName.includes("laptop")) category = "Laptop";
  else if (lowerName.includes("phone")) category = "Phone";
  else if (lowerName.includes("tab") || lowerName.includes("ipad")) category = "Tablet";
  else if (lowerName.includes("watch") || lowerName.includes("band")) category = "Wearable";

  // Extract generic Coin Type T from the object type string
  // Format: 0x...::marketplace::WarrantyItem<0x...::coin::Coin> or <T>
  const typeString = data.type || "";
  const coinTypeMatch = typeString.match(/<(.+)>/);
  const coinType = coinTypeMatch ? coinTypeMatch[1] : "";

  return {
    id: fields.id.id,
    name: fields.name,
    description: fields.description,
    image_url: fields.image_url,
    price: Number(fields.price), 
    status: fields.status as WarrantyStatus,
    seller: fields.seller,
    buyer: fields.buyer,
    balance: fields.balance?.fields?.value || fields.balance, 
    coinType: coinType,

    // Metadata defaults/derived
    category: category,
    brand: brand,
    condition: "Good", // Default
    inspectionDays: 3, // Default
    history: [
      { date: "Recent", event: fields.status === 0 ? "Listed on Sui" : "Status Updated" }
    ]
  };
}

// Hook to fetch a single item by ID
export function useMarketplaceItem(id: string) {
    const { data: object, isPending: isLoading, error } = useSuiClientQuery('getObject', {
        id,
        options: {
            showContent: true,
            showDisplay: true,
            showType: true,
        }
    }, {
        enabled: !!id,
        refetchInterval: 5000
    });

    const item = (object && object.data) ? parseWarrantyItem(object.data as any) : null;

    return {
        item,
        isLoading,
        error
    };
}

export function useMarketplaceItems() {
  // Strategy:
  // 1. We want to list ALL warranty items. 
  // Since we don't have an indexer, we can try to query for "events" (ItemCreated) to discover IDs, 
  // OR we can rely on a known list if we had one.
  // BUT, since we are in a hackathon/demo mode, a "getOwnedObjects" won't work for ALL items (only ours).
  // 
  // ALTERNATIVE: Use `getEvents` to find all `ItemCreated` events, then fetch the objects.
  
  const { data: events, isPending: isLoadingEvents, error: eventError } = useSuiClientQuery('queryEvents', {
    query: {
        MoveModule: {
            package: PACKAGE_ID,
            module: MARKETPLACE_MODULE,
        }
    },
    limit: 50,
    order: 'descending'
  });

  // Extract Object IDs from creation events
  // Note: This only finds items that were created. If they were deleted, fetch will return null/error.
  const itemIds = events?.data
    .filter(e => e.type.includes('::ItemCreated'))
    .map(e => (e.parsedJson as any).item_id) || [];
    
  // unique IDs
  const uniqueIds = Array.from(new Set(itemIds));

  // Fetch specific objects
  const { data: objects, isPending: isLoadingObjects } = useSuiClientQuery('multiGetObjects', {
    ids: uniqueIds,
    options: {
        showContent: true,
        showDisplay: true,
        showType: true,
    }
  }, {
    enabled: uniqueIds.length > 0,
    refetchInterval: 10000 
  });

  const items = objects?.map(obj => {
      if(obj.error) return null;
      if(!obj.data) return null;
      return parseWarrantyItem(obj.data as any);
  }).filter((item): item is WarrantyItem => item !== null) || [];

  return {
    items,
    isLoading: isLoadingEvents || isLoadingObjects,
    error: eventError
  };
}
