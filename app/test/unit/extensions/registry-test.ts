import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  extensionRegistry,
  getConfiguredExtensions,
} from '../../../src/lib/extensions/registry'

describe('extensions registry', () => {
  it('merges stored config with defaults', () => {
    const config = [
      {
        id: 'itdpm.tasks',
        enabled: true,
        config: { endpoint: 'https://example.com', cookie: 'abc' },
      },
    ]

    const configured = getConfiguredExtensions(extensionRegistry, config)
    const entry = configured.find(e => e.id === 'itdpm.tasks')

    assert.ok(entry)
    assert.strictEqual(entry.enabled, true)
    assert.strictEqual(entry.config.endpoint, 'https://example.com')
  })
})
