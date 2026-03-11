"use client"

import { Filters } from "./Filters"
import { Results } from "./Results"
import { Board } from "../queries/boards"

type Vendor = {
  value: string
  label: string
}

type Device = {
  id: number
  name: string
}

interface BoardsProps {
  boards: Board[]
}

export function Boards({ boards }: BoardsProps) {
  // Extract unique vendors from boards
  const uniqueVendorsMap = new Map<string, { name: string; slug: string }>()
  boards.forEach((board) => {
    if (!uniqueVendorsMap.has(board.vendor.slug)) {
      uniqueVendorsMap.set(board.vendor.slug, board.vendor)
    }
  })

  const dynamicVendors: Vendor[] = Array.from(uniqueVendorsMap.values()).map(
    (vendor) => ({
      value: vendor.slug,
      label: vendor.name,
    })
  )

  // Map devices per board
  const devicesByBoard = new Map<string, Device[]>()
  boards.forEach((board) => {
    const boardDevices: Device[] = board.devices.map((device, index) => ({
      id: index + 1,
      name: device.name,
    }))
    devicesByBoard.set(board.id, boardDevices)
  })

  return (
    <div className="flex flex-1">
      <Filters vendors={dynamicVendors} />
      <Results boards={boards} devicesByBoard={devicesByBoard} />
    </div>
  )
}
