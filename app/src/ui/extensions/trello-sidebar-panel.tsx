import * as React from 'react'
import { Button } from '../lib/button'
import { Select } from '../lib/select'
import { TextBox } from '../lib/text-box'
import {
  canLinkBoardToRepository,
  getTrelloBoardLinks,
  linkBoardToRepository,
} from '../../lib/extensions/trello-board-links'
import {
  createTrelloCard,
  fetchTrelloBoards,
  fetchTrelloLists,
  openExternal,
} from '../main-process-proxy'
import { ITrelloBoard, ITrelloList } from '../../lib/extensions/trello-api'

interface ITrelloSidebarPanelProps {
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

interface ITrelloSidebarPanelState {
  readonly issueTitle: string
  readonly issueDescription: string
  readonly issueType: 'Feature' | 'Bug' | 'Improvement'
  readonly priority: 'High' | 'Medium' | 'Low'
  readonly isSubmitting: boolean
  readonly isLoadingLists: boolean
  readonly error: string | null
  readonly successMessage: string | null
  readonly boards: ReadonlyArray<ITrelloBoard>
  readonly lists: ReadonlyArray<ITrelloList>
  readonly selectedBoardId: string
  readonly selectedListId: string
}

export class TrelloSidebarPanel extends React.Component<
  ITrelloSidebarPanelProps,
  ITrelloSidebarPanelState
> {
  public constructor(props: ITrelloSidebarPanelProps) {
    super(props)

    this.state = {
      issueTitle: '',
      issueDescription: '',
      issueType: 'Feature',
      priority: 'Medium',
      isSubmitting: false,
      isLoadingLists: false,
      error: null,
      successMessage: null,
      boards: [],
      lists: [],
      selectedBoardId: props.config.boardId,
      selectedListId: props.config.listId,
    }
  }

  public componentDidMount() {
    void this.loadBoardsAndLists()
  }

  public componentDidUpdate(prevProps: ITrelloSidebarPanelProps) {
    if (
      prevProps.config.apiKey !== this.props.config.apiKey ||
      prevProps.config.token !== this.props.config.token ||
      prevProps.config.boardId !== this.props.config.boardId ||
      prevProps.config.listId !== this.props.config.listId
    ) {
      this.setState(
        {
          selectedBoardId: this.props.config.boardId,
          selectedListId: this.props.config.listId,
          boards: [],
          lists: [],
        },
        () => void this.loadBoardsAndLists()
      )
    }
  }

  public render() {
    if (!this.props.config.apiKey.trim() || !this.props.config.token.trim()) {
      return (
        <div className="trello-sidebar-panel">
          <h4>Trello</h4>
          <p className="trello-sidebar-message">
            Set Trello API Key and Token in Preferences &gt; Extensions.
          </p>
        </div>
      )
    }

    const canCreate =
      !this.state.isSubmitting &&
      !this.state.isLoadingLists &&
      this.state.issueTitle.trim().length > 0 &&
      this.state.selectedListId.length > 0 &&
      this.getBoardConflictMessage() === null

    return (
      <div className="trello-sidebar-panel">
        <div className="trello-sidebar-header">
          <div>
            <h4>New Trello Issue</h4>
            <p className="trello-sidebar-subtitle">
              Capture work quickly and send it to Trello.
            </p>
          </div>
          <div className="trello-sidebar-status-pill">
            {this.state.selectedListId ? 'List selected' : 'Select a list'}
          </div>
        </div>

        <div className="trello-sidebar-controls">
          <Select
            label="Board"
            value={this.state.selectedBoardId}
            onChange={this.onBoardChanged}
            disabled={this.state.isLoadingLists || this.state.isSubmitting}
          >
            <option value="">Select board</option>
            {this.state.boards.map(this.renderBoardOption)}
          </Select>

          <Select
            label="List"
            value={this.state.selectedListId}
            onChange={this.onListChanged}
            disabled={
              this.state.isLoadingLists ||
              this.state.isSubmitting ||
              this.state.selectedBoardId.length === 0
            }
          >
            <option value="">Select list</option>
            {this.state.lists.map(this.renderListOption)}
          </Select>
        </div>

        {this.state.isLoadingLists ? (
          <p className="trello-sidebar-message">Loading Trello lists...</p>
        ) : null}
        {this.getBoardConflictMessage() ? (
          <p className="trello-sidebar-error">
            {this.getBoardConflictMessage()}
          </p>
        ) : null}

        <div className="trello-sidebar-form-card">
          <div className="trello-sidebar-controls">
            <Select
              label="Issue type"
              value={this.state.issueType}
              onChange={this.onIssueTypeChanged}
              disabled={this.state.isSubmitting}
            >
              <option value="Feature">Feature</option>
              <option value="Bug">Bug</option>
              <option value="Improvement">Improvement</option>
            </Select>
            <Select
              label="Priority"
              value={this.state.priority}
              onChange={this.onPriorityChanged}
              disabled={this.state.isSubmitting}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>
          <TextBox
            label="Title"
            value={this.state.issueTitle}
            onValueChanged={this.onIssueTitleChanged}
            placeholder="Issue title"
          />
          <TextBox
            label="Description"
            value={this.state.issueDescription}
            onValueChanged={this.onIssueDescriptionChanged}
            placeholder="Issue details"
          />
          <div className="trello-sidebar-actions">
            <Button
              className="trello-sidebar-create-button"
              onClick={this.onCreateIssue}
              disabled={!canCreate}
            >
              {this.state.isSubmitting ? 'Creating...' : 'Create issue'}
            </Button>
            <span className="trello-sidebar-hint">Opens the created card</span>
          </div>
        </div>
        {this.state.error ? (
          <p className="trello-sidebar-error">{this.state.error}</p>
        ) : null}
        {this.state.successMessage ? (
          <p className="trello-sidebar-message trello-sidebar-success-message">
            {this.state.successMessage}
          </p>
        ) : null}
      </div>
    )
  }

  private renderBoardOption = (board: ITrelloBoard) => (
    <option key={board.id} value={board.id}>
      {board.name}
    </option>
  )

  private renderListOption = (list: ITrelloList) => (
    <option key={list.id} value={list.id}>
      {list.name}
    </option>
  )

  private onIssueTitleChanged = (issueTitle: string) => {
    this.setState({ issueTitle })
  }

  private onIssueDescriptionChanged = (issueDescription: string) => {
    this.setState({ issueDescription })
  }

  private onIssueTypeChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value
    if (value === 'Feature' || value === 'Bug' || value === 'Improvement') {
      this.setState({ issueType: value })
    }
  }

  private onPriorityChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value
    if (value === 'High' || value === 'Medium' || value === 'Low') {
      this.setState({ priority: value })
    }
  }

  private onBoardChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    const selectedBoardId = event.currentTarget.value
    this.setState(
      { selectedBoardId, selectedListId: '', lists: [] },
      () => void this.loadListsForSelectedBoard()
    )
  }

  private onListChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({ selectedListId: event.currentTarget.value })
  }

  private loadBoardsAndLists = async () => {
    const { apiKey, token } = this.props.config
    if (!apiKey.trim() || !token.trim()) {
      return
    }

    this.setState({ isLoadingLists: true, error: null })

    try {
      const boards = await fetchTrelloBoards(apiKey, token)
      const selectedBoardId = this.getPreferredBoardId(boards)

      this.setState({ boards, selectedBoardId })
      await this.loadListsForBoard(selectedBoardId)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load Trello boards.'
      this.setState({ error: message, isLoadingLists: false })
    }
  }

  private loadListsForSelectedBoard = async () => {
    await this.loadListsForBoard(this.state.selectedBoardId)
  }

  private async loadListsForBoard(boardId: string) {
    if (!boardId) {
      this.setState({ lists: [], selectedListId: '', isLoadingLists: false })
      return
    }

    const { apiKey, token } = this.props.config

    try {
      const lists = await fetchTrelloLists(apiKey, token, boardId)
      const selectedListId = this.getPreferredListId(lists)
      this.setState({
        lists,
        selectedListId,
        isLoadingLists: false,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load Trello lists.'
      this.setState({ error: message, isLoadingLists: false })
    }
  }

  private getPreferredBoardId(boards: ReadonlyArray<ITrelloBoard>) {
    if (boards.length === 0) {
      return ''
    }

    const configuredBoardId = this.props.config.boardId
    if (
      configuredBoardId &&
      boards.some(board => board.id === configuredBoardId)
    ) {
      return configuredBoardId
    }

    return boards[0].id
  }

  private getPreferredListId(lists: ReadonlyArray<ITrelloList>) {
    if (lists.length === 0) {
      return ''
    }

    const configuredListId = this.props.config.listId
    if (configuredListId && lists.some(list => list.id === configuredListId)) {
      return configuredListId
    }

    return lists[0].id
  }

  private onCreateIssue = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()

    const title = this.state.issueTitle.trim()
    const { selectedListId, isSubmitting, isLoadingLists } = this.state
    const boardConflict = this.getBoardConflictMessage()

    if (
      !title ||
      !selectedListId ||
      isSubmitting ||
      isLoadingLists ||
      boardConflict !== null
    ) {
      if (boardConflict !== null) {
        this.setState({ error: boardConflict })
      }
      return
    }

    this.setState({ isSubmitting: true, error: null, successMessage: null })

    try {
      const created = await createTrelloCard(
        this.props.config.apiKey,
        this.props.config.token,
        this.state.selectedBoardId,
        selectedListId,
        title,
        this.state.issueDescription.trim(),
        this.state.issueType,
        this.state.priority
      )

      this.setState({
        issueTitle: '',
        issueDescription: '',
        isSubmitting: false,
        successMessage: `Created: ${created.name}`,
      })
      linkBoardToRepository(
        this.state.selectedBoardId,
        this.props.repository.path,
        this.props.repository.name
      )

      const cardUrl = created.shortUrl ?? created.url
      if (cardUrl) {
        await openExternal(cardUrl)
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create Trello issue.'
      this.setState({ error: message, isSubmitting: false })
    }
  }

  private getBoardConflictMessage() {
    const boardId = this.state.selectedBoardId
    if (boardId.length === 0) {
      return null
    }

    const links = getTrelloBoardLinks()
    if (canLinkBoardToRepository(links, boardId, this.props.repository.path)) {
      return null
    }

    const linked = links[boardId]
    if (!linked) {
      return null
    }

    return `This board is already linked to ${linked.repositoryName}.`
  }
}
