import { describe, it } from 'node:test'
import assert from 'node:assert'
import { buildExtensionsList } from '../../../src/lib/extensions/selectors'
import { extensionRegistry } from '../../../src/lib/extensions/registry'

describe('extensions selectors', () => {
  it('builds list with enabled state from config', () => {
    const list = buildExtensionsList(extensionRegistry, [
      { id: 'itdpm.tasks', enabled: false, config: {} },
    ])

    assert.strictEqual(list[0].enabled, false)
  })
})
