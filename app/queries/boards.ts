import { query } from "@/api/ApolloClient"
import { gql } from "@apollo/client"

export type Vendor = {
  name: string
  slug: string
}

export type Device = {
  name: string
  id: string
}

export type Board = {
  id: string
  name: string
  vendor: Vendor
  devices: Device[]
}

type GetBoardsResponse = {
  boards: Board[]
}

const GET_BOARDS = gql`
  query {
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
      }
    }
  }
`

export const getBoards = async (): Promise<Board[]> => {
  try {
    const { data } = await query<GetBoardsResponse>({ query: GET_BOARDS })
    return data?.boards || []
  } catch (error) {
    console.error("Error fetching boards:", error)
    return []
  }
}
