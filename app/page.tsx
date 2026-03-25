import { Metadata } from 'next';
import { Suspense } from 'react';
import { Boards } from './_components/Boards';
import { Loader } from './_components/Loader';
import { PreloadQuery } from '@/api/ApolloClient';
import { GET_BOARDS } from './queries/boards';

export const metadata: Metadata = {
  title: 'Vendor Aggregation',
};

type PageProps = {
  searchParams: Promise<{ search?: string; vendor?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search ? decodeURIComponent(params.search) : '';
  const vendor = params.vendor ? decodeURIComponent(params.vendor) : '';

  return (
    <PreloadQuery query={GET_BOARDS}>
      <Suspense fallback={<Loader />}>
        <Boards search={search} vendor={vendor} />
      </Suspense>
    </PreloadQuery>
  );
}
