import { describe, it } from 'node:test'
import assert from 'node:assert'
import { extensionRegistry } from '../../src/lib/extensions/registry'
import { buildExtensionsList } from '../../src/lib/extensions/selectors'

describe('buildExtensionsList', () => {
  it('marks non-configurable extensions as not editable', () => {
    const extensions = buildExtensionsList(extensionRegistry, [])

    const gitmoji = extensions.find(extension => extension.id === 'gitmoji')
    const itdpm = extensions.find(extension => extension.id === 'itdpm.tasks')

    assert.ok(gitmoji)
    assert.ok(itdpm)
    assert.equal((gitmoji as unknown as Record<string, unknown>).canEdit, false)
    assert.equal((itdpm as unknown as Record<string, unknown>).canEdit, true)
  })
})
