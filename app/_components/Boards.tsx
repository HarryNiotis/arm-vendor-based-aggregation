'use client';

import { useSuspenseQuery } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filters } from './Filters';
import { Results } from './Results';
import { Board, Vendor, GET_BOARDS } from '../queries/boards';

type GetBoardsData = {
  boards: Board[];
};

export function Boards() {
  const { data } = useSuspenseQuery<GetBoardsData>(GET_BOARDS);
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search')
    ? decodeURIComponent(searchParams.get('search')!)
    : '';
  const vendor = searchParams.get('vendor')
    ? decodeURIComponent(searchParams.get('vendor')!)
    : '';

  // This could be memoized but we are using react compiler in this
  // solution that should take care of this.
  const vendors: Vendor[] = (() => {
    const seen = new Set<string>();
    return data.boards.reduce<Vendor[]>((acc, board) => {
      if (!seen.has(board.vendor.slug)) {
        seen.add(board.vendor.slug);
        acc.push(board.vendor);
      }
      return acc;
    }, []);
  })();

  const boardsByVendor: Record<string, Board[]> = (() => {
    const result: Record<string, Board[]> = {};
    const lowerSearch = search.toLowerCase();

    data.boards.forEach((board) => {
      if (!result[board.vendor.slug]) {
        result[board.vendor.slug] = [];
      }

      const matchesVendor = !vendor || board.vendor.slug === vendor;
      const matchesSearch =
        !search ||
        board.name.toLowerCase().includes(lowerSearch) ||
        board.devices.some((device) =>
          device.name.toLowerCase().includes(lowerSearch)
        );

      if (matchesVendor && matchesSearch) {
        result[board.vendor.slug].push(board);
      }
    });

    return result;
  })();

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
      <Filters vendors={vendors} onFilter={handleFilter} />
      <Results vendors={vendors} boardsByVendor={boardsByVendor} />
    </div>
  );
}
