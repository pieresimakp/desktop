import { describe, it } from 'node:test'
import assert from 'node:assert'
import { PreferencesTab } from '../../../src/models/preferences'

describe('preferences tabs', () => {
  it('includes Extensions tab', () => {
    assert.ok(PreferencesTab.Extensions !== undefined)
  })
})
