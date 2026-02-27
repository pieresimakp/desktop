import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  toggleExtensionEnabled,
  updateExtensionConfig,
  removeExtensionConfig,
  upsertExtensionConfig,
} from '../../../src/lib/extensions/operations'

describe('extensions operations', () => {
  it('toggles extension enabled state', () => {
    const result = toggleExtensionEnabled(
      [{ id: 'itdpm.tasks', enabled: true, config: {} }],
      'itdpm.tasks',
      false
    )

    assert.strictEqual(result[0].enabled, false)
  })

  it('updates extension config values', () => {
    const result = updateExtensionConfig(
      [{ id: 'itdpm.tasks', enabled: true, config: {} }],
      'itdpm.tasks',
      { endpoint: 'https://example.com' }
    )

    assert.strictEqual(result[0].config.endpoint, 'https://example.com')
  })

  it('removes extension config', () => {
    const result = removeExtensionConfig(
      [{ id: 'itdpm.tasks', enabled: true, config: { endpoint: 'x' } }],
      'itdpm.tasks'
    )

    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].enabled, false)
    assert.deepStrictEqual(result[0].config, {})
  })

  it('adds extension config when missing', () => {
    const result = upsertExtensionConfig([], {
      id: 'itdpm.tasks',
      enabled: true,
      config: { endpoint: 'https://example.com' },
    })

    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].id, 'itdpm.tasks')
  })
})
