export interface IExtensionConfig {
  readonly id: string
  readonly enabled: boolean
  readonly config: Record<string, string>
}

export type ExtensionSlot = 'commit-message-action' | 'toolbar-action'
