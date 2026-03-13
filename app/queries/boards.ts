import { gql } from '@apollo/client';

export type Vendor = {
  name: string;
  slug: string;
};

export type Device = {
  name: string;
  id: string;
  processors: { core: string }[];
};

export type Board = {
  id: string;
  name: string;
  vendor: Vendor;
  devices: Device[];
};

export const GET_BOARDS = gql`
  query GetBoards {
    boards {
      id
      name
      vendor {
        name
        slug
      }
      devices {
        name
        id
        processors {
          core
        }
      }
    }
  }
`;
