import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TrelloSidebarPanel } from '../../../src/ui/extensions/trello-sidebar-panel'

describe('Trello sidebar panel', () => {
  it('renders setup message without credentials', () => {
    const html = renderToStaticMarkup(
      <TrelloSidebarPanel
        repository={{ path: '/repos/example', name: 'example' }}
        config={{ apiKey: '', token: '', boardId: '', listId: '' }}
      />
    )

    assert.ok(html.includes('Set Trello API Key and Token'))
  })

  it('renders create issue form without preconfigured list id', () => {
    const html = renderToStaticMarkup(
      <TrelloSidebarPanel
        repository={{ path: '/repos/example', name: 'example' }}
        config={{
          apiKey: 'key',
          token: 'token',
          boardId: '',
          listId: '',
        }}
      />
    )

    assert.ok(html.includes('New Trello Issue'))
    assert.ok(html.includes('List'))
    assert.ok(html.includes('Create issue'))
  })
})
