import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ItdpmTasksExtensionButton } from '../../../src/ui/extensions/itdpm-tasks-extension'

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
})
