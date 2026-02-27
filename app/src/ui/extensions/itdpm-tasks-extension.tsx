import * as React from 'react'
import classNames from 'classnames'
import { Button } from '../lib/button'
import {
  Popover,
  PopoverAnchorPosition,
  PopoverDecoration,
} from '../lib/popover'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { fetchItdpmTasks, openExternal } from '../main-process-proxy'
import { Popup, PopupType } from '../../models/popup'
import { buildTaskLink } from '../../lib/extensions/itdpm'
import { IItdpmResponse } from '../../lib/extensions/itdpm-api'

interface IMyTaskItem {
  readonly id: string
  readonly description: string
  readonly status: string
  readonly linkId: number
}

interface IItdpmTasksExtensionProps {
  readonly config: {
    readonly endpoint: string
    readonly cookie: string
  }
  readonly onApplyTaskId: (taskId: string) => void
  readonly onShowPopup: (popup: Popup) => void
}

interface IItdpmTasksExtensionState {
  readonly isOpen: boolean
  readonly isLoading: boolean
  readonly error: string | null
  readonly tasks: ReadonlyArray<IMyTaskItem>
}

export class ItdpmTasksExtensionButton extends React.Component<
  IItdpmTasksExtensionProps,
  IItdpmTasksExtensionState
> {
  private buttonRef: HTMLButtonElement | null = null

  public constructor(props: IItdpmTasksExtensionProps) {
    super(props)

    this.state = {
      isOpen: false,
      isLoading: false,
      error: null,
      tasks: [],
    }
  }

  public render() {
    const ariaLabel = 'My task'

    return (
      <>
        <Button
          className="my-task-button"
          onClick={this.onButtonClick}
          onButtonRef={this.onButtonRef}
          ariaLabel={ariaLabel}
        >
          <Octicon symbol={octicons.tasklist} />
        </Button>
        {this.renderPopover()}
      </>
    )
  }

  private onButtonRef = (elem: HTMLButtonElement | null) => {
    this.buttonRef = elem
  }

  private onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.setState(
      prevState => ({ isOpen: !prevState.isOpen }),
      () => {
        if (this.state.isOpen) {
          this.loadTasks()
        }
      }
    )
  }

  private closePopover = () => {
    this.setState({ isOpen: false })
  }

  private renderPopover() {
    if (!this.state.isOpen || this.buttonRef === null) {
      return null
    }

    return (
      <Popover
        anchor={this.buttonRef}
        anchorPosition={PopoverAnchorPosition.Right}
        decoration={PopoverDecoration.Balloon}
        ariaLabelledby="my-task-popover-header"
        onClickOutside={this.closePopover}
        trapFocus={false}
        isDialog={false}
        style={{ width: '720px' }}
      >
        <div className="my-task-popover">
          <h3 id="my-task-popover-header">My tasks</h3>
          <div className="my-task-header-row">
            <div className="my-task-id">Task ID</div>
            <div className="my-task-status">Status</div>
            <div className="my-task-description">Description</div>
            <div className="my-task-link" aria-hidden={true} />
          </div>
          <div className="my-task-list">{this.renderRows()}</div>
        </div>
      </Popover>
    )
  }

  private renderRows() {
    if (this.state.isLoading) {
      return <div className="my-task-status">Loading tasks…</div>
    }

    if (this.state.error) {
      return <div className="my-task-status">{this.state.error}</div>
    }

    if (this.state.tasks.length === 0) {
      return <div className="my-task-status">No tasks found.</div>
    }

    return this.state.tasks.map(task => (
      <div
        className={classNames('my-task-row')}
        role="button"
        tabIndex={0}
        onClick={() => this.onTaskSelected(task.id)}
        onKeyDown={event => this.onTaskKeyDown(event, task.id)}
        key={task.id}
      >
        <div className="my-task-id">{task.id}</div>
        <div className="my-task-status">{task.status}</div>
        <div className="my-task-description">{task.description}</div>
        <Button
          className="my-task-link"
          onClick={event => this.onTaskOpenLink(event, task.linkId)}
          ariaLabel="Open task in browser"
          tooltip="Open task in browser"
        >
          <Octicon symbol={octicons.link} />
        </Button>
      </div>
    ))
  }

  private async loadTasks() {
    if (this.state.isLoading) {
      return
    }

    const { endpoint, cookie } = this.props.config
    if (!endpoint.trim()) {
      this.setState({ error: 'Set the ITDPM endpoint in Extensions.' })
      return
    }

    if (!cookie.trim()) {
      this.setState({ error: 'Set your ITDPM cookie in Extensions.' })
      return
    }

    this.setState({ isLoading: true, error: null })

    try {
      const data = (await fetchItdpmTasks(
        endpoint,
        cookie.trim().length > 0 ? cookie : null
      )) as IItdpmResponse
      const records = data.result?.records ?? []
      const tasks = records
        .filter(record => record.sequence_name && record.name)
        .map(record => ({
          id: record.sequence_name,
          description: record.name,
          status:
            record.stage_id && record.stage_id[1]
              ? record.stage_id[1]
              : 'Unknown',
          linkId: record.id,
        }))

      this.setState({ tasks, isLoading: false })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load tasks.'
      this.setState({ error: message, isLoading: false })
      this.props.onShowPopup({
        type: PopupType.Error,
        error: new Error(message),
      })
    }
  }

  private onTaskSelected = (taskId: string) => {
    this.setState({ isOpen: false })
    this.props.onApplyTaskId(taskId)
  }

  private onTaskKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    taskId: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.onTaskSelected(taskId)
    }
  }

  private onTaskOpenLink = async (
    event: React.MouseEvent<HTMLButtonElement>,
    taskId: number
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const url = buildTaskLink(this.props.config.endpoint, taskId)
    await openExternal(url)
  }
}
