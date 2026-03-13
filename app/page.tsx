import { Metadata } from 'next';
import { Boards } from './_components/Boards';
import { Board, getBoards, Vendor } from './queries/boards';

type PageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export const metadata: Metadata = {
  title: 'Vendor Aggregation',
};

export default async function Page({ searchParams }: PageProps) {
  const boards = await getBoards();

  // Extract search and vendor from searchParams if available
  const params = await searchParams;
  const search = params?.search
    ? decodeURIComponent(params.search as string)
    : '';
  const vendor = params?.vendor
    ? decodeURIComponent(params.vendor as string)
    : '';

  const vendors: Vendor[] = [];
  const boardsByVendor: Record<string, Board[]> = {};

  // Heavy lifting of filtering the boards based on the search and vendor filters
  // Ideally this should be handled by different API endpoints and cached separately
  boards.forEach((board) => {
    // create a list of vendors for the filters
    if (!vendors.some((v) => v.slug === board.vendor.slug)) {
      vendors.push(board.vendor);
    }

    if (!boardsByVendor[board.vendor.slug]) {
      boardsByVendor[board.vendor.slug] = [];
    }

    const matchesVendor = !vendor || board.vendor.slug === vendor;
    const matchesSearch =
      !search ||
      board.name.toLowerCase().includes(search) ||
      board.devices.some((device) =>
        device.name.toLowerCase().includes(search)
      );

    if (matchesVendor && matchesSearch) {
      boardsByVendor[board.vendor.slug].push(board);
    }
  });

  return <Boards vendors={vendors} boardsByVendor={boardsByVendor} />;
}
