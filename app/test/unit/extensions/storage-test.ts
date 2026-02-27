import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import {
  getExtensionsConfig,
  setExtensionsConfig,
} from '../../../src/lib/extensions/storage'

describe('extensions storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips extensions config list', () => {
    const config = [
      {
        id: 'itdpm.tasks',
        enabled: true,
        config: { endpoint: 'https://example.com', cookie: 'abc' },
      },
    ]

    setExtensionsConfig(config)

    assert.deepStrictEqual(getExtensionsConfig(), config)
  })
})
