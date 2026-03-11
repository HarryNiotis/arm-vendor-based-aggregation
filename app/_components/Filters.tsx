"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Search } from "lucide-react"
import { useState } from "react"

type Vendor = {
  value: string
  label: string
}

interface FiltersProps {
  vendors: Vendor[]
}

export function Filters({ vendors }: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<
    (typeof vendors)[number] | undefined
  >()
  return (
    <aside className="w-80 border-r bg-muted/20 p-6">
      <h2 className="mb-6 text-lg font-semibold">Filters</h2>
      <div className="mb-6 flex flex-col gap-3">
        <label className="text-sm font-medium">Search</label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full">Search</Button>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        <label className="text-sm font-medium">Vendor</label>
        <Combobox items={vendors} value={selectedVendor}>
          <ComboboxInput placeholder="Select a vendor" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(vendor: Vendor) => (
                <ComboboxItem
                  key={vendor.value}
                  value={vendor}
                  onSelect={() => setSelectedVendor(vendor)}
                >
                  {vendor.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </aside>
  )
}
