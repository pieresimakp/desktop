import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  canLinkBoardToRepository,
  linkBoardToRepositoryInMemory,
} from '../../../src/lib/extensions/trello-board-links'

describe('trello board links', () => {
  it('prevents linking board to a different repository', () => {
    const links = linkBoardToRepositoryInMemory(
      {},
      'board-1',
      '/repos/a',
      'Repo A'
    )

    assert.strictEqual(
      canLinkBoardToRepository(links, 'board-1', '/repos/a'),
      true
    )
    assert.strictEqual(
      canLinkBoardToRepository(links, 'board-1', '/repos/b'),
      false
    )
  })
})
