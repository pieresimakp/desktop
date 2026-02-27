import * as React from 'react'
import { DialogContent } from '../dialog'
import { RefNameTextBox } from '../lib/ref-name-text-box'
import { Ref } from '../lib/ref'
import { LinkButton } from '../lib/link-button'
import { Account } from '../../models/account'
import { GitConfigUserForm } from '../lib/git-config-user-form'
import { TabBar } from '../tab-bar'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { Select } from '../lib/select'
import { TextBox } from '../lib/text-box'
import { itdpmEndpointPlaceholder } from '../../lib/itdpm'
import {
  shellFriendlyNames,
  SupportedHooksEnvShell,
} from '../../lib/hooks/config'

interface IGitProps {
  readonly name: string
  readonly email: string
  readonly defaultBranch: string
  readonly isLoadingGitConfig: boolean

  readonly accounts: ReadonlyArray<Account>

  readonly onNameChanged: (name: string) => void
  readonly onEmailChanged: (email: string) => void
  readonly onDefaultBranchChanged: (defaultBranch: string) => void

  readonly onEditGlobalGitConfig: () => void

  readonly selectedTabIndex?: number
  readonly onSelectedTabIndexChanged: (index: number) => void

  readonly onEnableGitHookEnvChanged: (enableGitHookEnv: boolean) => void
  readonly onCacheGitHookEnvChanged: (cacheGitHookEnv: boolean) => void
  readonly onSelectedShellChanged: (selectedShell: string) => void

  readonly enableGitHookEnv: boolean
  readonly cacheGitHookEnv: boolean
  readonly selectedShell: string

  readonly itdpmCookie: string
  readonly onItdpmCookieChanged: (cookie: string) => void
  readonly itdpmEndpoint: string
  readonly onItdpmEndpointChanged: (endpoint: string) => void
}

const windowsShells: ReadonlyArray<SupportedHooksEnvShell> = [
  'git-bash',
  'pwsh',
  'powershell',
  'cmd',
]

export class Git extends React.Component<IGitProps> {
  private get selectedTabIndex() {
    return this.props.selectedTabIndex ?? 0
  }

  private onTabClicked = (index: number) => {
    this.props.onSelectedTabIndexChanged?.(index)
  }

  private onEnableGitHookEnvChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onEnableGitHookEnvChanged(event.currentTarget.checked)
  }

  private onCacheGitHookEnvChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onCacheGitHookEnvChanged(event.currentTarget.checked)
  }

  private onSelectedShellChanged = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    this.props.onSelectedShellChanged(event.currentTarget.value)
  }

  private onItdpmCookieChanged = (value: string) => {
    this.props.onItdpmCookieChanged(value)
  }

  private onItdpmEndpointChanged = (value: string) => {
    this.props.onItdpmEndpointChanged(value)
  }

  private renderHooksSettings() {
    return (
      <>
        <div className="hooks-warning">
          GitHub Desktop hook support is experimental and currently only
          supports hooks related to committing. Please{' '}
          <LinkButton uri="https://github.com/desktop/desktop/issues/new/choose">
            let us know
          </LinkButton>{' '}
          if you encounter any issues or have feedback!
        </div>
        <Checkbox
          label="Load Git hook environment variables from shell"
          ariaDescribedBy="git-hooks-env-description"
          value={
            this.props.enableGitHookEnv ? CheckboxValue.On : CheckboxValue.Off
          }
          onChange={this.onEnableGitHookEnvChanged}
        />
        <p className="git-hooks-env-description">
          When enabled, GitHub Desktop will attempt to load environment
          variables from your shell when executing Git hooks. This is useful if
          your Git hooks depend on environment variables set in your shell
          configuration files, a common practive for version managers such as
          nvm, rbenv, asdf, etc.
        </p>

        {this.props.enableGitHookEnv && __WIN32__ && (
          <>
            <Select
              className="git-hook-shell-select"
              label={'Shell to use when loading environment'}
              value={this.props.selectedShell}
              onChange={this.onSelectedShellChanged}
            >
              {windowsShells
                .map(s => ({ key: s, title: shellFriendlyNames[s] }))
                .map(s => (
                  <option key={s.key} value={s.key}>
                    {s.title}
                  </option>
                ))}
            </Select>
          </>
        )}

        {this.props.enableGitHookEnv && (
          <>
            <Checkbox
              label="Cache Git hook environment variables"
              ariaDescribedBy="git-hooks-cache-description"
              onChange={this.onCacheGitHookEnvChanged}
              value={
                this.props.cacheGitHookEnv
                  ? CheckboxValue.On
                  : CheckboxValue.Off
              }
            />

            <div className="git-hooks-cache-description">
              Cache hook environment variables to improve performance. Disable
              if your hooks rely on frequently changing environment variables.
            </div>
          </>
        )}
      </>
    )
  }

  public render() {
    return (
      <DialogContent className="git-preferences">
        <TabBar
          selectedIndex={this.selectedTabIndex}
          onTabClicked={this.onTabClicked}
        >
          <span>Author</span>
          <span>Default branch</span>
          <span>
            Hooks <span className="beta-pill">Beta</span>
          </span>
          <span>ITDPM</span>
        </TabBar>
        <div className="git-preferences-content">{this.renderCurrentTab()}</div>
      </DialogContent>
    )
  }

  private renderCurrentTab() {
    if (this.selectedTabIndex === 0) {
      return this.renderGitConfigAuthorInfo()
    } else if (this.selectedTabIndex === 1) {
      return this.renderDefaultBranchSetting()
    } else if (this.selectedTabIndex === 2) {
      return this.renderHooksSettings()
    } else if (this.selectedTabIndex === 3) {
      return this.renderItdpmSettings()
    }

    return null
  }

  private renderItdpmSettings() {
    return (
      <div className="itdpm-settings">
        <h2 id="itdpm-settings-heading">ITDPM</h2>
        <TextBox
          label="Endpoint"
          value={this.props.itdpmEndpoint}
          onValueChanged={this.onItdpmEndpointChanged}
          placeholder={itdpmEndpointPlaceholder}
        />
        <TextBox
          label="Cookie"
          value={this.props.itdpmCookie}
          onValueChanged={this.onItdpmCookieChanged}
          placeholder="Paste cookie value here"
        />
        <p className="git-settings-description">
          Used to load tasks for the My task list in the commit panel.
        </p>
      </div>
    )
  }

  private renderGitConfigAuthorInfo() {
    return (
      <>
        <GitConfigUserForm
          email={this.props.email}
          name={this.props.name}
          isLoadingGitConfig={this.props.isLoadingGitConfig}
          accounts={this.props.accounts}
          onEmailChanged={this.props.onEmailChanged}
          onNameChanged={this.props.onNameChanged}
        />
        {this.renderEditGlobalGitConfigInfo()}
      </>
    )
  }

  private renderDefaultBranchSetting() {
    return (
      <div className="default-branch-component">
        <h2 id="default-branch-heading">
          Default branch name for new repositories
        </h2>

        <RefNameTextBox
          initialValue={this.props.defaultBranch}
          onValueChange={this.props.onDefaultBranchChanged}
          ariaLabelledBy={'default-branch-heading'}
          ariaDescribedBy="default-branch-description"
          warningMessageVerb="saved"
        />

        <p id="default-branch-description" className="git-settings-description">
          GitHub's default branch name is <Ref>main</Ref>. You may want to
          change it due to different workflows, or because your integrations
          still require the historical default branch name of <Ref>master</Ref>.
        </p>

        {this.renderEditGlobalGitConfigInfo()}
      </div>
    )
  }

  private renderEditGlobalGitConfigInfo() {
    return (
      <p className="git-settings-description">
        These preferences will{' '}
        <LinkButton onClick={this.props.onEditGlobalGitConfig}>
          edit your global Git config file
        </LinkButton>
        .
      </p>
    )
  }
}
