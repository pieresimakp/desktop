import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  buildTrelloCardUrl,
  buildTrelloIssueLabels,
  formatTrelloIssueDescription,
  prependTrelloCardIdToSummary,
} from '../../../src/lib/extensions/trello'

describe('trello extension helpers', () => {
  it('builds card link from short link', () => {
    const link = buildTrelloCardUrl('abc123')

    assert.strictEqual(link, 'https://trello.com/c/abc123')
  })

  it('prepends card id to summary and replaces existing prefix', () => {
    const summary = prependTrelloCardIdToSummary('Fix flaky tests', 42)
    const replaced = prependTrelloCardIdToSummary(
      '[TRELLO-10] Fix flaky tests',
      42
    )

    assert.strictEqual(summary, '[TRELLO-42] Fix flaky tests')
    assert.strictEqual(replaced, '[TRELLO-42] Fix flaky tests')
  })

  it('builds colorful labels for type and priority', () => {
    const labels = buildTrelloIssueLabels('Feature', 'High')

    assert.deepStrictEqual(labels, [
      { name: 'Type: Feature', color: 'blue' },
      { name: 'Priority: High', color: 'orange' },
    ])
  })

  it('formats issue description with metadata sections', () => {
    const formatted = formatTrelloIssueDescription(
      'UI composer should look modern.',
      'Improvement',
      'Medium'
    )

    assert.ok(formatted.includes('## Summary'))
    assert.ok(formatted.includes('## Metadata'))
    assert.ok(formatted.includes('- Type: **Improvement**'))
    assert.ok(formatted.includes('- Priority: **Medium**'))
  })
})
