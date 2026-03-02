import { getObject, setObject } from '../local-storage'

export interface ITrelloBoardLink {
  readonly repositoryPath: string
  readonly repositoryName: string
}

export type TTrelloBoardLinkMap = Readonly<Record<string, ITrelloBoardLink>>

const trelloBoardLinksStorageKey = 'extensions/trello/board-links'

export const getTrelloBoardLinks = (): TTrelloBoardLinkMap =>
  getObject<TTrelloBoardLinkMap>(trelloBoardLinksStorageKey) ?? {}

export const setTrelloBoardLinks = (links: TTrelloBoardLinkMap) =>
  setObject(trelloBoardLinksStorageKey, links)

export const canLinkBoardToRepository = (
  links: TTrelloBoardLinkMap,
  boardId: string,
  repositoryPath: string
) => {
  const link = links[boardId]
  return !link || link.repositoryPath === repositoryPath
}

export const linkBoardToRepositoryInMemory = (
  links: TTrelloBoardLinkMap,
  boardId: string,
  repositoryPath: string,
  repositoryName: string
): TTrelloBoardLinkMap => ({
  ...links,
  [boardId]: {
    repositoryPath,
    repositoryName,
  },
})

export const linkBoardToRepository = (
  boardId: string,
  repositoryPath: string,
  repositoryName: string
) => {
  const links = getTrelloBoardLinks()
  const nextLinks = linkBoardToRepositoryInMemory(
    links,
    boardId,
    repositoryPath,
    repositoryName
  )
  setTrelloBoardLinks(nextLinks)
}
