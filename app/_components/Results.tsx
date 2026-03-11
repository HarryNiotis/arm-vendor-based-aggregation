"use client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Board } from "../queries/boards"

type Device = {
  id: number
  name: string
}

interface ResultsProps {
  boards: Board[]
  devicesByBoard: Map<string, Device[]>
}

export function Results({ boards: results, devicesByBoard }: ResultsProps) {
  return (
    <main className="flex flex-1 flex-col p-6">
      <h2 className="mb-6 text-xl font-semibold">Results ({results.length})</h2>
      <div className="max-h-[85vh] overflow-y-auto rounded-lg border bg-card">
        <div className="p-4">
          {results.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {results.map((result) => {
                const boardDevices = devicesByBoard.get(result.id) || []
                return (
                  <AccordionItem key={result.id} value={`item-${result.id}`}>
                    <AccordionTrigger>
                      <div className="flex flex-col items-start">
                        <h3 className="font-medium">
                          {result.name} ({boardDevices.length})
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {result.vendor.name}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="max-h-72 space-y-2 overflow-y-auto pr-4 pb-2">
                        {boardDevices.map((device) => (
                          <Card key={device.id} className="p-3">
                            <p className="text-sm font-medium">{device.name}</p>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
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
  )
}
