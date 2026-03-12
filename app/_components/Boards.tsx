'use client';

import { Filters } from './Filters';
import { Results } from './Results';
import { Board, Vendor } from '../queries/boards';
import { useRouter } from 'next/navigation';

interface BoardsProps {
  vendors: Vendor[];
  boardsByVendor: Record<string, Board[]>;
}

export function Boards({ vendors, boardsByVendor }: BoardsProps) {
  const router = useRouter();

  // Handle filter changes by updating the URL search parameters
  const handleFilter = (search: string, vendor: string) => {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', encodeURIComponent(search));
    }
    if (vendor) {
      params.append('vendor', encodeURIComponent(vendor));
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-1">
      <Filters vendors={vendors} onFilter={handleFilter} />
      <Results vendors={vendors} boardsByVendor={boardsByVendor} />
    </div>
  );
}
