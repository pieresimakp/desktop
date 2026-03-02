import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Extensions } from '../../../src/ui/preferences/extensions'

describe('Extensions editor', () => {
  it('renders ITDPM editor fields when selected', () => {
    const html = renderToStaticMarkup(
      <Extensions
        extensions={[
          {
            id: 'itdpm.tasks',
            name: 'ITDPM My Tasks',
            enabled: true,
            canEdit: true,
          },
        ]}
        selectedExtensionId="itdpm.tasks"
        itdpmConfig={{ endpoint: '', cookie: '' }}
        onToggle={() => undefined}
        onEdit={() => undefined}
        onRemove={() => undefined}
        onItdpmConfigChange={() => undefined}
      />
    )

    assert.ok(html.includes('Endpoint'))
  })
})
