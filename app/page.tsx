import { Boards } from "./_components/Boards"
import { getBoards } from "./queries/boards"

export default async function Page() {
  const boards = await getBoards()

  return <Boards boards={boards} />
}
