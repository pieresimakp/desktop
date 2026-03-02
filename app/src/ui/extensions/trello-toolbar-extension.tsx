import * as React from 'react'
import {
  Popover,
  PopoverAnchorPosition,
  PopoverDecoration,
} from '../lib/popover'
import { ToolbarButton } from '../toolbar'
import * as octicons from '../octicons/octicons.generated'
import { TrelloSidebarPanel } from './trello-sidebar-panel'

interface ITrelloToolbarExtensionProps {
  readonly repository: {
    readonly path: string
    readonly name: string
  }
  readonly config: {
    readonly apiKey: string
    readonly token: string
    readonly boardId: string
    readonly listId: string
  }
}

interface ITrelloToolbarExtensionState {
  readonly isOpen: boolean
}

export class TrelloToolbarExtensionButton extends React.Component<
  ITrelloToolbarExtensionProps,
  ITrelloToolbarExtensionState
> {
  private toolbarButtonRef = React.createRef<ToolbarButton>()

  public constructor(props: ITrelloToolbarExtensionProps) {
    super(props)
    this.state = { isOpen: false }
  }

  public render() {
    return (
      <>
        <ToolbarButton
          ref={this.toolbarButtonRef}
          className="trello-toolbar-button"
          icon={octicons.tasklist}
          title="Trello"
          description="Cards"
          onClick={this.onButtonClick}
        />
        {this.renderPopover()}
      </>
    )
  }

  private onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.setState(prev => ({ isOpen: !prev.isOpen }))
  }

  private closePopover = () => {
    this.setState({ isOpen: false })
  }

  private renderPopover() {
    const anchor = this.toolbarButtonRef.current?.wrapperRef.current
    if (!this.state.isOpen || anchor === null || anchor === undefined) {
      return null
    }

    return (
      <Popover
        anchor={anchor}
        anchorPosition={PopoverAnchorPosition.Bottom}
        decoration={PopoverDecoration.Balloon}
        ariaLabelledby="trello-toolbar-popover-header"
        onClickOutside={this.closePopover}
        trapFocus={false}
        isDialog={false}
        style={{ width: '460px' }}
      >
        <div id="trello-toolbar-popover-header" className="sr-only">
          Trello
        </div>
        <TrelloSidebarPanel
          repository={this.props.repository}
          config={this.props.config}
        />
      </Popover>
    )
  }
}
