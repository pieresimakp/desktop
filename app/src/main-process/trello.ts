import { net } from 'electron'
import {
  ITrelloBoard,
  ITrelloBoardLabel,
  ITrelloCard,
  ITrelloCardResponse,
  ITrelloCreatedCard,
  ITrelloList,
  normalizeTrelloBoards,
  normalizeTrelloCards,
  normalizeTrelloLists,
} from '../lib/extensions/trello-api'
import {
  buildTrelloIssueLabels,
  formatTrelloIssueDescription,
  TTrelloIssueType,
  TTrelloPriority,
} from '../lib/extensions/trello'

function createTrelloUrl(path: string, apiKey: string, token: string) {
  const url = new URL(`https://api.trello.com/1/${path}`)
  url.searchParams.set('key', apiKey)
  url.searchParams.set('token', token)
  return url.toString()
}

async function trelloGet<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = net.request({ method: 'GET', url })

    request.setHeader('Accept', 'application/json')

    request.on('response', response => {
      const statusCode = response.statusCode ?? 0
      const chunks: Array<Buffer> = []

      response.on('data', chunk => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })

      response.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8')

        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`Trello request failed (${statusCode})`))
          return
        }

        try {
          resolve(JSON.parse(body) as T)
        } catch (error) {
          reject(error)
        }
      })
    })

    request.on('error', reject)
    request.end()
  })
}

async function trelloPost<T>(url: string, body: URLSearchParams): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = net.request({ method: 'POST', url })

    request.setHeader('Accept', 'application/json')
    request.setHeader('Content-Type', 'application/x-www-form-urlencoded')

    request.on('response', response => {
      const statusCode = response.statusCode ?? 0
      const chunks: Array<Buffer> = []

      response.on('data', chunk => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      })

      response.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString('utf8')

        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`Trello request failed (${statusCode})`))
          return
        }

        try {
          resolve(JSON.parse(responseBody) as T)
        } catch (error) {
          reject(error)
        }
      })
    })

    request.on('error', reject)
    request.end(body.toString())
  })
}

export async function fetchTrelloBoards(apiKey: string, token: string) {
  const url = createTrelloUrl('members/me/boards', apiKey, token)
  const boards = await trelloGet<ReadonlyArray<ITrelloBoard>>(url)
  return normalizeTrelloBoards(boards)
}

export async function fetchTrelloLists(
  apiKey: string,
  token: string,
  boardId: string
) {
  const url = createTrelloUrl(`boards/${boardId}/lists`, apiKey, token)
  const lists = await trelloGet<ReadonlyArray<ITrelloList>>(url)
  return normalizeTrelloLists(lists)
}

export async function fetchTrelloCards(
  apiKey: string,
  token: string,
  listId: string
): Promise<ReadonlyArray<ITrelloCard>> {
  const url = createTrelloUrl(`lists/${listId}/cards`, apiKey, token)
  const cards = await trelloGet<ReadonlyArray<ITrelloCardResponse>>(url)
  return normalizeTrelloCards(cards)
}

export async function createTrelloCard(
  apiKey: string,
  token: string,
  boardId: string,
  listId: string,
  name: string,
  description: string,
  issueType: string,
  priority: string
): Promise<ITrelloCreatedCard> {
  const normalizedType = normalizeIssueType(issueType)
  const normalizedPriority = normalizePriority(priority)
  const labels = buildTrelloIssueLabels(normalizedType, normalizedPriority)
  const boardLabels = await fetchTrelloBoardLabels(apiKey, token, boardId)
  const labelIds = await ensureBoardLabelIds(
    apiKey,
    token,
    boardId,
    boardLabels,
    labels
  )

  const url = createTrelloUrl('cards', apiKey, token)
  const body = new URLSearchParams()
  body.set('idList', listId)
  body.set('name', name)
  body.set(
    'desc',
    formatTrelloIssueDescription(
      description,
      normalizedType,
      normalizedPriority
    )
  )

  if (labelIds.length > 0) {
    body.set('idLabels', labelIds.join(','))
  }

  return trelloPost<ITrelloCreatedCard>(url, body)
}

async function fetchTrelloBoardLabels(
  apiKey: string,
  token: string,
  boardId: string
) {
  const url = createTrelloUrl(`boards/${boardId}/labels`, apiKey, token)
  return trelloGet<ReadonlyArray<ITrelloBoardLabel>>(url)
}

async function ensureBoardLabelIds(
  apiKey: string,
  token: string,
  boardId: string,
  existingBoardLabels: ReadonlyArray<ITrelloBoardLabel>,
  desiredLabels: ReturnType<typeof buildTrelloIssueLabels>
) {
  const boardLabels = [...existingBoardLabels]
  const labelIds: Array<string> = []

  for (const desired of desiredLabels) {
    const existing = boardLabels.find(
      label => label.name.toLowerCase() === desired.name.toLowerCase()
    )

    if (existing) {
      labelIds.push(existing.id)
      continue
    }

    const created = await createBoardLabel(
      apiKey,
      token,
      boardId,
      desired.name,
      desired.color
    )

    boardLabels.push(created)
    labelIds.push(created.id)
  }

  return labelIds
}

async function createBoardLabel(
  apiKey: string,
  token: string,
  boardId: string,
  name: string,
  color: string
): Promise<ITrelloBoardLabel> {
  const url = createTrelloUrl('labels', apiKey, token)
  const body = new URLSearchParams()
  body.set('idBoard', boardId)
  body.set('name', name)
  body.set('color', color)

  return trelloPost<ITrelloBoardLabel>(url, body)
}

function normalizeIssueType(value: string): TTrelloIssueType {
  switch (value) {
    case 'Feature':
    case 'Bug':
    case 'Improvement':
      return value
    default:
      return 'Feature'
  }
}

function normalizePriority(value: string): TTrelloPriority {
  switch (value) {
    case 'High':
    case 'Medium':
    case 'Low':
      return value
    default:
      return 'Medium'
  }
}
