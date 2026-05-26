import React from 'react'
import { Button } from '../lib/button'
import {
  Popover,
  PopoverAnchorPosition,
  PopoverDecoration,
} from '../lib/popover'
import { SectionList } from '../lib/list/section-list'
import { RowIndexPath } from '../lib/list/list-row-index-path'

export type CommitMessageAvatarWarningType =
  | 'none'
  | 'misattribution'
  | 'disallowedEmail'

// Dummy data interface for emoji items
interface IEmojiItem {
  readonly emoji: string
  readonly code: string
  readonly description: string
}

interface ICommitMessageEmojiState {
  readonly isPopoverOpen: boolean

  // /** Currently selected account email address. */
  // readonly accountEmail: string

  /** Whether the git configuration is local to the repository or global  */
  readonly isGitConfigLocal: boolean

  /** Dummy emoji data for the section list */
  readonly emojiData: ReadonlyArray<IEmojiItem>

  /** Selected emoji rows */
  readonly selectedEmojiRows: ReadonlyArray<RowIndexPath>
}

interface ICommitMessageEmojiProps {
  readonly buttonClassName?: string
  readonly commitValue?: string
  readonly commitValueChanged: (value: string) => void
  // /** The user whose avatar should be displayed. */
  // readonly user?: IAvatarUser

  // /** Current email address configured by the user. */
  // readonly email?: string

  // /**
  //  * Controls whether a warning should be displayed.
  //  * - 'none': No error is displayed, the field is valid.
  //  * - 'misattribution': The user's Git config emails don't match and the
  //  * commit may not be attributed to the user.
  //  * - 'disallowedEmail': A repository rule may prevent the user from
  //  * committing with the selected email address.
  //  */
  // readonly warningType: CommitMessageAvatarWarningType

  // /**
  //  * List of validations that failed for repo rules. Only used if
  //  * `warningType` is 'disallowedEmail'.
  //  */
  // readonly emailRuleFailures?: RepoRulesMetadataFailures

  // /**
  //  * Name of the current branch
  //  */
  // readonly branch: string | null

  // /** Whether or not the user's account is a GHE account. */
  // readonly isEnterpriseAccount: boolean

  // /** Email addresses available in the relevant GitHub (Enterprise) account. */
  // readonly accountEmails: ReadonlyArray<string>

  // /** Preferred email address from the user's account. */
  // readonly preferredAccountEmail: string

  // /**
  //  * The currently selected repository
  //  */
  // readonly repository: Repository

  // readonly onUpdateEmail: (email: string) => void

  // /**
  //  * Called when the user has requested to see the Git Config tab in the
  //  * repository settings dialog
  //  */
  // readonly onOpenRepositorySettings: () => void

  // /**
  //  * Called when the user has requested to see the Git tab in the user settings
  //  * dialog
  //  */
  // readonly onOpenGitSettings: () => void

  // readonly accounts: ReadonlyArray<Account>
}

/**
 * User avatar shown in the commit message area. It encapsulates not only the
 * user avatar, but also any badge and warning we might display to the user.
 */
export class CommitMessageEmoji extends React.Component<
  ICommitMessageEmojiProps,
  ICommitMessageEmojiState
> {
  private avatarButtonRef: HTMLButtonElement | null = null

  public constructor(props: ICommitMessageEmojiProps) {
    super(props)

    // Create dummy emoji data with the new list
    const emojiData: IEmojiItem[] = [
      {
        emoji: '✨',
        code: ':sparkles:',
        description: '[FEATURE] - New feature implementation',
      },
      {
        emoji: '🐛',
        code: ':bug:',
        description: '[BUG] - Bug fix',
      },
      {
        emoji: '🔒',
        code: ':lock:',
        description: '[SECRET] - Security/secret related changes',
      },
      {
        emoji: '🔒',
        code: ':lock:',
        description: '[SECURITY] - Security improvements',
      },
      {
        emoji: '🎨',
        code: ':art:',
        description: '[UI] - User interface changes',
      },
      {
        emoji: '🔖',
        code: ':bookmark:',
        description: '[VERSION] - Version release',
      },
      {
        emoji: '♻️',
        code: ':recycle:',
        description: '[REFACTOR] - Code refactoring',
      },
      {
        emoji: '🎨',
        code: ':art:',
        description: '[CHORE] - Chore',
      },
      {
        emoji: '🔧',
        code: ':wrench:',
        description: '[CONFIG] - Configuration changes',
      },
      {
        emoji: '📚',
        code: ':books:',
        description: '[DOCS] - Documentation updates',
      },
      {
        emoji: '📚',
        code: ':books:',
        description: '[TODO] - TODO items',
      },
      {
        emoji: '📊',
        code: ':bar_chart:',
        description: '[REPORT] - Report generation',
      },
      {
        emoji: '🧪',
        code: ':test_tube:',
        description: '[TEST] - Testing related changes',
      },
      {
        emoji: '🗃️',
        code: ':card_file_box:',
        description: '[DATABASE] - Database changes',
      },
      {
        emoji: '🎨',
        code: ':art:',
        description: '[STRUCTURE] - Code structure improvement',
      },
      {
        emoji: '➕',
        code: ':heavy_plus_sign:',
        description: '[DEPENDENCY] - Add dependency',
      },
      {
        emoji: '➕',
        code: ':heavy_plus_sign:',
        description: '[SDK] - SDK related changes',
      },
      {
        emoji: '🎨',
        code: ':art:',
        description: '[CLEAN] - Code cleanup',
      },
      {
        emoji: '🎨',
        code: ':art:',
        description: '[MISC] - Miscellaneous changes',
      },
      {
        emoji: '🎨',
        code: ':art:',
        description: '[CODE IMPROVEMENT] - Code improvement',
      },
      {
        emoji: '✨',
        code: ':sparkles:',
        description: '[ENDPOINT] - API endpoint changes',
      },
    ]

    this.state = {
      isPopoverOpen: false,
      isGitConfigLocal: false,
      emojiData,
      selectedEmojiRows: [],
    }
  }

  public componentDidUpdate(prevProps: ICommitMessageEmojiProps) {
    // if (
    //   this.props.user?.name !== prevProps.user?.name ||
    //   this.props.user?.email !== prevProps.user?.email
    // ) {
    //   this.determineGitConfigLocation()
    // }
  }

  private onButtonRef = (buttonRef: HTMLButtonElement | null) => {
    this.avatarButtonRef = buttonRef
  }

  public render() {
    const ariaLabel = 'View emoji'
    return (
      <div>
        <Button
          className={this.props.buttonClassName ?? 'avatar-button'}
          ariaLabel={ariaLabel}
          onButtonRef={this.onButtonRef}
          onClick={this.onAvatarClick}
        >
          🎨
          {/* {warningType !== 'none' && this.renderWarningBadge()} */}
          {/* <Avatar accounts={this.props.accounts} user={user} title={null} /> */}
        </Button>
        {this.state.isPopoverOpen && this.renderPopover()}
      </div>
    )
  }

  private openPopover = () => {
    this.setState(prevState => {
      if (prevState.isPopoverOpen === false) {
        return { isPopoverOpen: true }
      }
      return null
    })
  }

  private closePopover = () => {
    this.setState(prevState => {
      if (prevState.isPopoverOpen) {
        return { isPopoverOpen: false }
      }
      return null
    })
  }

  private onAvatarClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (this.state.isPopoverOpen) {
      this.closePopover()
    } else {
      this.openPopover()
    }
  }

  // private renderWarningPopover() {
  //   return <div>TES</div>
  // }

  private renderPopover() {
    return (
      <Popover
        anchor={this.avatarButtonRef}
        anchorPosition={PopoverAnchorPosition.RightBottom}
        decoration={PopoverDecoration.Balloon}
        onClickOutside={this.closePopover}
        ariaLabelledby="commit-avatar-popover-header"
        style={{ width: '350px', maxHeight: '450px' }}
        trapFocus={false}
        isDialog={false}
      >
        <h3 id="commit-avatar-popover-header" style={{ margin: '0 0 12px 0' }}>
          GitMoji
        </h3>

        <div style={{ height: '350px', width: '100%' }}>
          <SectionList
            rowCount={[this.state.emojiData.length]} // Single section with all emoji rows
            rowRenderer={this.renderEmojiRow}
            rowHeight={40}
            selectedRows={this.state.selectedEmojiRows}
            onSelectedRowChanged={this.onEmojiRowSelected}
            onRowClick={this.onEmojiRowClick}
            selectionMode="single"
            getRowAriaLabel={this.getRowAriaLabel}
            accessibleListId="emoji-section-list"
          />
        </div>
      </Popover>
    )
  }

  private renderEmojiRow = (indexPath: RowIndexPath) => {
    const emojiItem = this.state.emojiData[indexPath.row]

    // Extract the category name from the description (e.g., "[FEATURE]" from "[FEATURE] - New feature implementation")
    const categoryMatch = emojiItem.description.match(/\[([^\]]+)\]/)
    const categoryName = categoryMatch
      ? `[${categoryMatch[1]}]`
      : emojiItem.code
    const description = emojiItem.description.replace(/\[[^\]]+\]\s*-?\s*/, '')

    return (
      <div
        className="emoji-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          cursor: 'pointer',
          borderRadius: '4px',
          minHeight: '40px',
          boxSizing: 'border-box',
        }}
      >
        <span
          className="emoji-icon"
          style={{
            fontSize: '18px',
            marginRight: '12px',
            minWidth: '24px',
            textAlign: 'center',
          }}
        >
          {emojiItem.emoji}
        </span>
        <div className="emoji-info" style={{ flex: 1, minWidth: 0 }}>
          <div
            className="emoji-code"
            style={{
              fontWeight: '600',
              fontSize: '13px',
              fontFamily: 'var(--font-family-monospace, monospace)',
              color: 'var(--text-color)',
              marginBottom: '2px',
            }}
          >
            {categoryName}
          </div>
          <div
            className="emoji-description"
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary-color, #666)',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
            title={emojiItem.description}
          >
            {description}
          </div>
        </div>
      </div>
    )
  }

  private onEmojiRowSelected = (indexPath: RowIndexPath) => {
    this.setState({
      selectedEmojiRows: [indexPath],
    })
  }

  private onEmojiRowClick = (indexPath: RowIndexPath) => {
    const emojiItem = this.state.emojiData[indexPath.row]

    // Extract the category name from the description (e.g., "[FEATURE]" from "[FEATURE] - New feature implementation")
    const categoryMatch = emojiItem.description.match(/\[([^\]]+)\]/)
    const categoryName = categoryMatch
      ? `[${categoryMatch[1]}]`
      : emojiItem.code

    this.props.commitValueChanged(
      `${emojiItem.emoji} ${categoryName} ${this.props.commitValue}`
    )
    // Here you could emit the selected emoji to parent component
    this.closePopover()
  }

  private getRowAriaLabel = (indexPath: RowIndexPath): string => {
    const emojiItem = this.state.emojiData[indexPath.row]
    // Extract the category name from the description for accessibility
    const categoryMatch = emojiItem.description.match(/\[([^\]]+)\]/)
    const categoryName = categoryMatch
      ? `[${categoryMatch[1]}]`
      : emojiItem.code
    const description = emojiItem.description.replace(/\[[^\]]+\]\s*-?\s*/, '')
    return `${categoryName}: ${description}`
  }
}
