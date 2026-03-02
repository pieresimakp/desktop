export const buildTrelloCardUrl = (shortLink: string) =>
  `https://trello.com/c/${shortLink}`

export type TTrelloIssueType = 'Feature' | 'Bug' | 'Improvement'
export type TTrelloPriority = 'High' | 'Medium' | 'Low'

export interface ITrelloLabelSpec {
  readonly name: string
  readonly color: string
}

const issueTypeLabelColors: Record<TTrelloIssueType, string> = {
  Feature: 'blue',
  Bug: 'red',
  Improvement: 'purple',
}

const priorityLabelColors: Record<TTrelloPriority, string> = {
  High: 'orange',
  Medium: 'yellow',
  Low: 'green',
}

export const buildTrelloIssueLabels = (
  issueType: TTrelloIssueType,
  priority: TTrelloPriority
): ReadonlyArray<ITrelloLabelSpec> => [
  {
    name: `Type: ${issueType}`,
    color: issueTypeLabelColors[issueType],
  },
  {
    name: `Priority: ${priority}`,
    color: priorityLabelColors[priority],
  },
]

export const formatTrelloIssueDescription = (
  description: string,
  issueType: TTrelloIssueType,
  priority: TTrelloPriority
) => {
  const details = description.trim()
  const summary =
    details.length > 0 ? details : '_No additional details provided._'

  return [
    '## Summary',
    summary,
    '',
    '## Metadata',
    `- Type: **${issueType}**`,
    `- Priority: **${priority}**`,
    '- Source: **GitHub Desktop Trello Extension**',
  ].join('\n')
}

export const prependTrelloCardIdToSummary = (
  summary: string,
  cardId: number
) => {
  const prefix = `[TRELLO-${cardId}]`
  const trimmed = summary.replace(/^\[TRELLO-\d+\]\s*/i, '')
  return trimmed.length > 0 ? `${prefix} ${trimmed}` : prefix
}
