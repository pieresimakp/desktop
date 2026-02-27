import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  buildTaskLink,
  prependTaskIdToSummary,
} from '../../../src/lib/extensions/itdpm'

describe('itdpm extension helpers', () => {
  it('builds task link from endpoint origin', () => {
    const link = buildTaskLink(
      'https://example.com/web/dataset/search_read',
      123
    )

    assert.strictEqual(
      link,
      'https://example.com/web#id=123&cids=1&menu_id=109&action=185&model=project.task&view_type=form'
    )
  })

  it('prepends task id to summary and replaces existing prefix', () => {
    const summary = prependTaskIdToSummary('Fix bug', 'TASK-1')
    const replaced = prependTaskIdToSummary('[TASK-OLD] Fix bug', 'TASK-2')

    assert.strictEqual(summary, '[TASK-1] Fix bug')
    assert.strictEqual(replaced, '[TASK-2] Fix bug')
  })
})
