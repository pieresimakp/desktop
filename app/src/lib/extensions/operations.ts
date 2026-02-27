import { IExtensionConfig } from './types'

export const toggleExtensionEnabled = (
  configs: ReadonlyArray<IExtensionConfig>,
  id: string,
  enabled: boolean
): ReadonlyArray<IExtensionConfig> =>
  configs.map(config => (config.id === id ? { ...config, enabled } : config))

export const updateExtensionConfig = (
  configs: ReadonlyArray<IExtensionConfig>,
  id: string,
  updates: Record<string, string>
): ReadonlyArray<IExtensionConfig> =>
  configs.map(config =>
    config.id === id
      ? { ...config, config: { ...config.config, ...updates } }
      : config
  )

export const removeExtensionConfig = (
  configs: ReadonlyArray<IExtensionConfig>,
  id: string
): ReadonlyArray<IExtensionConfig> =>
  configs.map(config =>
    config.id === id ? { ...config, enabled: false, config: {} } : config
  )

export const upsertExtensionConfig = (
  configs: ReadonlyArray<IExtensionConfig>,
  entry: IExtensionConfig
): ReadonlyArray<IExtensionConfig> => {
  const exists = configs.some(config => config.id === entry.id)

  if (exists) {
    return configs.map(config => (config.id === entry.id ? entry : config))
  }

  return [...configs, entry]
}
