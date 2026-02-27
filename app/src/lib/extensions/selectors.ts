import { IExtensionConfig } from './types'
import {
  IConfiguredExtension,
  IExtensionDefinition,
  getConfiguredExtensions,
} from './registry'

export interface IExtensionListItem {
  readonly id: string
  readonly name: string
  readonly enabled: boolean
}

export const buildExtensionsList = (
  registry: ReadonlyArray<IExtensionDefinition>,
  configs: ReadonlyArray<IExtensionConfig>
): ReadonlyArray<IExtensionListItem> =>
  getConfiguredExtensions(registry, configs).map(extension => ({
    id: extension.id,
    name: extension.name,
    enabled: extension.enabled,
  }))

export const getEnabledExtensionsForSlot = (
  registry: ReadonlyArray<IExtensionDefinition>,
  configs: ReadonlyArray<IExtensionConfig>,
  slot: IExtensionDefinition['slot']
): ReadonlyArray<IConfiguredExtension> =>
  getConfiguredExtensions(registry, configs).filter(
    extension => extension.slot === slot && extension.enabled
  )
