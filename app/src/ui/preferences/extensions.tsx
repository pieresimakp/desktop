import * as React from 'react'
import { DialogContent } from '../dialog'
import { Button } from '../lib/button'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { TextBox } from '../lib/text-box'

export interface IExtensionListItem {
  readonly id: string
  readonly name: string
  readonly enabled: boolean
  readonly canEdit: boolean
}

interface IExtensionsProps {
  readonly extensions: ReadonlyArray<IExtensionListItem>
  readonly selectedExtensionId?: string
  readonly itdpmConfig?: {
    readonly endpoint: string
    readonly cookie: string
  }
  readonly onToggle: (id: string, enabled: boolean) => void
  readonly onEdit: (id: string) => void
  readonly onRemove: (id: string) => void
  readonly onItdpmConfigChange?: (updates: {
    readonly endpoint?: string
    readonly cookie?: string
  }) => void
}

export class Extensions extends React.Component<IExtensionsProps> {
  public render() {
    return (
      <DialogContent className="extensions-preferences">
        <h2>Extensions</h2>
        <div className="extensions-list">
          {this.props.extensions.map(extension => (
            <div className="extensions-row" key={extension.id}>
              <Checkbox
                label={extension.name}
                value={extension.enabled ? CheckboxValue.On : CheckboxValue.Off}
                onChange={event =>
                  this.props.onToggle(extension.id, event.currentTarget.checked)
                }
              />
              {this.renderEditButton(extension)}
              <Button onClick={() => this.props.onRemove(extension.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        {this.renderEditor()}
      </DialogContent>
    )
  }

  private renderEditButton(extension: IExtensionListItem) {
    if (!extension.canEdit) {
      return null
    }

    return <Button onClick={() => this.props.onEdit(extension.id)}>Edit</Button>
  }

  private renderEditor() {
    if (this.props.selectedExtensionId !== 'itdpm.tasks') {
      return null
    }

    const config = this.props.itdpmConfig
    if (!config) {
      return null
    }

    return (
      <div className="extensions-editor">
        <h3>ITDPM My Tasks</h3>
        <TextBox
          label="Endpoint"
          value={config.endpoint}
          onValueChanged={value =>
            this.props.onItdpmConfigChange?.({ endpoint: value })
          }
          placeholder="https://example.com"
        />
        <TextBox
          label="Cookie"
          value={config.cookie}
          onValueChanged={value =>
            this.props.onItdpmConfigChange?.({ cookie: value })
          }
          placeholder="session=..."
        />
      </div>
    )
  }
}
