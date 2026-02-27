import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Extensions } from '../../../src/ui/preferences/extensions'

describe('Extensions preferences tab', () => {
  it('renders extension name in list', () => {
    const html = renderToStaticMarkup(
      <Extensions
        extensions={[
          { id: 'itdpm.tasks', name: 'ITDPM My Tasks', enabled: true },
        ]}
        onToggle={() => undefined}
        onEdit={() => undefined}
        onRemove={() => undefined}
      />
    )

    assert.ok(html.includes('ITDPM My Tasks'))
  })
})
