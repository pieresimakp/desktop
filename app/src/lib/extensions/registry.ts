import { ExtensionSlot, IExtensionConfig } from './types'

export interface IExtensionDefinition {
  readonly id: string
  readonly name: string
  readonly slot: ExtensionSlot
  readonly defaultEnabled: boolean
  readonly defaultConfig: Record<string, string>
}

export interface IConfiguredExtension extends IExtensionDefinition {
  readonly enabled: boolean
  readonly config: Record<string, string>
}

export const extensionRegistry: ReadonlyArray<IExtensionDefinition> = [
  {
    id: 'itdpm.tasks',
    name: 'ITDPM My Tasks',
    slot: 'commit-message-action',
    defaultEnabled: true,
    defaultConfig: {
      endpoint: '',
      cookie: '',
    },
  },
]

export const getConfiguredExtensions = (
  registry: ReadonlyArray<IExtensionDefinition>,
  configs: ReadonlyArray<IExtensionConfig>
): ReadonlyArray<IConfiguredExtension> =>
  registry.map(definition => {
    const stored = configs.find(config => config.id === definition.id)

    return {
      ...definition,
      enabled: stored?.enabled ?? definition.defaultEnabled,
      config: {
        ...definition.defaultConfig,
        ...(stored?.config ?? {}),
      },
    }
  })
