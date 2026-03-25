'use client';

import { useSuspenseQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { Filters } from './Filters';
import { Results } from './Results';
import { Board, Vendor, GET_BOARDS } from '../queries/boards';

type GetBoardsData = {
  boards: Board[];
};

export type BoardsProps = {
  search: string;
  vendor: string;
};

export function Boards({ search, vendor }: BoardsProps) {
  const { data } = useSuspenseQuery<GetBoardsData>(GET_BOARDS);
  const router = useRouter();

  // The following aggregation would normally be memoized, but since we are using
  // the react compiler in this project, they should be optimized

  const seen = new Set<string>();
  const vendors: Vendor[] =
    data?.boards.reduce<Vendor[]>((acc, board) => {
      if (!seen.has(board.vendor.slug)) {
        seen.add(board.vendor.slug);
        acc.push(board.vendor);
      }
      return acc;
    }, []) ?? [];

  const boardsByVendor: Record<string, Board[]> = {};
  const lowerSearch = search.toLowerCase();

  data?.boards.forEach((board) => {
    if (!boardsByVendor[board.vendor.slug]) {
      boardsByVendor[board.vendor.slug] = [];
    }

    const matchesVendor = !vendor || board.vendor.slug === vendor;
    const matchesSearch =
      !search ||
      board.name.toLowerCase().includes(lowerSearch) ||
      board.devices.some((device) =>
        device.name.toLowerCase().includes(lowerSearch)
      );

    if (matchesVendor && matchesSearch) {
      boardsByVendor[board.vendor.slug].push(board);
    }
  });

  const handleFilter = (newSearch: string, newVendor: string) => {
    const params = new URLSearchParams();
    if (newSearch) {
      params.set('search', encodeURIComponent(newSearch));
    }
    if (newVendor) {
      params.set('vendor', encodeURIComponent(newVendor));
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-1">
      <Filters vendors={vendors} search={search} vendor={vendor} onFilter={handleFilter} />
      <Results vendors={vendors} boardsByVendor={boardsByVendor} />
    </div>
  );
}
