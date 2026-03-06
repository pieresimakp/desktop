import { describe, it } from 'node:test'
import assert from 'node:assert'
import { readFile } from 'node:fs/promises'

describe('commit-message UI', () => {
  it('renders gitmoji button in action bar extension area', async () => {
    const source = await readFile(
      new URL('../../src/ui/changes/commit-message.tsx', import.meta.url),
      'utf8'
    )

    const extensionButtonsPattern =
      /private renderExtensionButtons\(\) {[\s\S]*\{this\.renderEmojiButton\(\)\}/
    const summaryPattern =
      /<div className=\{summaryClassName\} ref=\{this\.summaryGroupRef\}>[\s\S]*\{this\.renderEmojiButton\(\)\}/

    assert.match(source, extensionButtonsPattern)
    assert.doesNotMatch(source, summaryPattern)
  })

  it('registers gitmoji as a commit message extension', async () => {
    const registrySource = await readFile(
      new URL('../../src/lib/extensions/registry.ts', import.meta.url),
      'utf8'
    )

    assert.match(
      registrySource,
      /id:\s*'gitmoji'[\s\S]*slot:\s*'commit-message-action'[\s\S]*defaultEnabled:\s*true/
    )
  })

  it('does not redirect focus when clicking in popovers', async () => {
    const source = await readFile(
      new URL('../../src/ui/changes/commit-message.tsx', import.meta.url),
      'utf8'
    )

    assert.match(source, /closest\('\.popover-component'\)\s*!==\s*null/)
  })
})
