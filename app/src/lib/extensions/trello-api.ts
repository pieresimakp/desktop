export interface ITrelloBoard {
  readonly id: string
  readonly name: string
}

export interface ITrelloList {
  readonly id: string
  readonly name: string
}

export interface ITrelloCard {
  readonly id: string
  readonly idShort: number
  readonly name: string
  readonly shortLink: string
  readonly due: string | null
  readonly labels: ReadonlyArray<string>
}

export interface ITrelloCreatedCard {
  readonly id: string
  readonly name: string
  readonly url?: string
  readonly shortUrl?: string
}

export interface ITrelloBoardLabel {
  readonly id: string
  readonly name: string
  readonly color: string | null
}

export interface ITrelloLabelResponse {
  readonly name: string
}

export interface ITrelloCardResponse {
  readonly id: string
  readonly idShort: number
  readonly name: string
  readonly shortLink: string
  readonly due: string | null
  readonly labels?: ReadonlyArray<ITrelloLabelResponse>
}

export const normalizeTrelloBoards = (
  boards: ReadonlyArray<ITrelloBoard>
): ReadonlyArray<ITrelloBoard> => boards.map(board => ({ ...board }))

export const normalizeTrelloLists = (
  lists: ReadonlyArray<ITrelloList>
): ReadonlyArray<ITrelloList> => lists.map(list => ({ ...list }))

export const normalizeTrelloCards = (
  cards: ReadonlyArray<ITrelloCardResponse>
): ReadonlyArray<ITrelloCard> =>
  cards.map(card => ({
    id: card.id,
    idShort: card.idShort,
    name: card.name,
    shortLink: card.shortLink,
    due: card.due,
    labels:
      card.labels
        ?.map(label => label.name)
        .filter(label => label.trim().length > 0) ?? [],
  }))
