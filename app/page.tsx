import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Boards } from './_components/Boards';
import { PreloadQuery } from '@/api/ApolloClient';
import { GET_BOARDS } from './queries/boards';

export const metadata: Metadata = {
  title: 'Vendor Aggregation',
};

export default function Page() {
  return (
    <PreloadQuery query={GET_BOARDS}>
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <Boards />
      </Suspense>
    </PreloadQuery>
  );
}
