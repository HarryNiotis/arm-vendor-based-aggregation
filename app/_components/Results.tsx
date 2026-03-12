'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { Board, Vendor } from '../queries/boards';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

type ResultsProps = {
  vendors: Vendor[];
  boardsByVendor: Record<string, Board[]>;
};

// This component is responsible for rendering the results of the search
// It could be broken down a bit more given time, and a table component is probably a better way forward
export function Results({ vendors, boardsByVendor }: ResultsProps) {
  return (
    <main className="flex flex-1 flex-col p-6">
      <h2 className="mb-6 text-xl font-semibold">Devices by Vendor</h2>
      <div className="max-h-[85vh] overflow-y-auto rounded-lg border bg-card">
        <div className="p-4">
          {Object.values(boardsByVendor).some((boards) => boards.length > 0) ? (
            <Accordion type="multiple" className="w-full">
              {vendors
                .filter((v) => boardsByVendor[v.slug]?.length > 0)
                .map((vendor) => {
                  const boards = boardsByVendor[vendor.slug];
                  return (
                    <AccordionItem
                      key={vendor.slug}
                      value={`item-${vendor.slug}`}
                    >
                      <AccordionTrigger>
                        <div className="flex flex-col items-start">
                          <div className="align-left flex items-center gap-2 text-lg">
                            <div>{vendor.name}</div>
                            <Badge className="grow">
                              {boards.length} Boards
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="max-h-72 space-y-2 overflow-y-auto pr-3 pb-2">
                          {boards.map((board) => (
                            <div key={board.id} className="py-2 pb-2">
                              <Collapsible className="rounded-md data-[state=open]:bg-muted">
                                <CollapsibleTrigger asChild>
                                  <div className="align-left flex items-center gap-2 text-lg">
                                    <Button
                                      variant="ghost"
                                      className="group w-full text-base"
                                    >
                                      {board.name}
                                      <Badge>
                                        {board.devices.length} Devices
                                      </Badge>
                                      <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                                    </Button>
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                                  {board.devices.map((device) => (
                                    <div
                                      key={device.id}
                                      className="flex w-full gap-2 border-t pt-2"
                                    >
                                      <div>{device.name}</div>
                                      <div className="flex-1 pr-2 text-right">
                                        {/* Assuming there is one core */}
                                        {device.processors?.[0]?.core}
                                      </div>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No results found. Try adjusting your filters.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
