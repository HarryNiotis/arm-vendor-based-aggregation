'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Vendor } from '../queries/boards';
import { useSearchParams } from 'next/navigation';

type FiltersProps = {
  vendors: Vendor[];
  onFilter: (search: string, vendor: string) => void;
};

// This component is responsible for rendering the filters and handling user input
//
export function Filters({ vendors, onFilter }: FiltersProps) {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [selectedVendor, setSelectedVendor] = useState(
    vendors.find((v) => v.slug === params.get('vendor'))?.name ?? ''
  );

  const handleFilter = () => {
    onFilter(
      search,
      vendors.find((v) => v.name === selectedVendor)?.slug ?? ''
    );
  };

  const handleReset = () => {
    setSearch('');
    setSelectedVendor('');
    onFilter('', '');
  };

  return (
    <aside className="w-80 border-r bg-muted/20 p-6">
      <h2 className="mb-6 text-lg font-semibold">Filters</h2>
      <div className="mb-6 flex flex-col gap-3">
        <label className="text-sm font-medium">Names</label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Board or device name"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        <label className="text-sm font-medium">Vendors</label>
        <Combobox
          items={vendors}
          value={selectedVendor}
          onValueChange={(value) => setSelectedVendor(value ?? '')}
        >
          <ComboboxInput
            placeholder="Select a vendor"
            showClear={selectedVendor !== ''}
          />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(vendor: Vendor) => (
                <ComboboxItem key={vendor.slug} value={vendor.name}>
                  {vendor.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        <Button
          className="w-full"
          disabled={search === '' && selectedVendor === ''}
          onClick={handleFilter}
        >
          Filter
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          disabled={search === '' && selectedVendor === ''}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </aside>
  );
}
