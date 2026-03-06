import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  ItdpmTasksExtensionButton,
  filterMyTasks,
} from '../../../src/ui/extensions/itdpm-tasks-extension'

describe('ITDPM extension button', () => {
  it('renders My task button', () => {
    const html = renderToStaticMarkup(
      <ItdpmTasksExtensionButton
        config={{ endpoint: 'https://example.com', cookie: 'abc' }}
        onApplyTaskId={() => undefined}
        onShowPopup={() => undefined}
      />
    )

    assert.ok(html.includes('My task'))
  })

  it('filters tasks by id, status, and description', () => {
    const tasks = [
      {
        id: 'ABC-101',
        status: 'In Progress',
        description: 'Polish popup UI',
        linkId: 101,
      },
      {
        id: 'ABC-102',
        status: 'Done',
        description: 'Search integration',
        linkId: 102,
      },
    ]

    assert.equal(filterMyTasks(tasks, 'abc-101').length, 1)
    assert.equal(filterMyTasks(tasks, 'done').length, 1)
    assert.equal(filterMyTasks(tasks, 'search').length, 1)
  })

  it('returns all tasks for blank query', () => {
    const tasks = [
      {
        id: 'ABC-101',
        status: 'In Progress',
        description: 'Polish popup UI',
        linkId: 101,
      },
    ]

    assert.equal(filterMyTasks(tasks, '').length, 1)
    assert.equal(filterMyTasks(tasks, '   ').length, 1)
  })
})
