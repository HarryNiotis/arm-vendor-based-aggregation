import { Metadata } from 'next';
import { Suspense } from 'react';
import { Boards } from './_components/Boards';
import { PreloadQuery } from '@/api/ApolloClient';
import { GET_BOARDS } from './queries/boards';

export const metadata: Metadata = {
  title: 'Vendor Aggregation',
};

export default function Page() {
  return (
    <PreloadQuery query={GET_BOARDS}>
      <Suspense fallback={<p>Loading boards...</p>}>
        <Boards />
      </Suspense>
    </PreloadQuery>
  );
}
