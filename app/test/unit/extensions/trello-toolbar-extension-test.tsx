import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TrelloToolbarExtensionButton } from '../../../src/ui/extensions/trello-toolbar-extension'

describe('Trello toolbar extension', () => {
  it('renders Trello toolbar button label', () => {
    const html = renderToStaticMarkup(
      <TrelloToolbarExtensionButton
        repository={{ path: '/repos/example', name: 'example' }}
        config={{ apiKey: 'key', token: 'token', boardId: '', listId: '' }}
      />
    )

    assert.ok(html.includes('Trello'))
  })

  it('uses trello toolbar width class', () => {
    const html = renderToStaticMarkup(
      <TrelloToolbarExtensionButton
        repository={{ path: '/repos/example', name: 'example' }}
        config={{ apiKey: 'key', token: 'token', boardId: '', listId: '' }}
      />
    )

    assert.ok(html.includes('trello-toolbar-button'))
  })
})
