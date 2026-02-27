import { getObject, setObject } from '../local-storage'
import { IExtensionConfig } from './types'

const extensionsStorageKey = 'extensions/config'

export const getExtensionsConfig = (): ReadonlyArray<IExtensionConfig> =>
  getObject<ReadonlyArray<IExtensionConfig>>(extensionsStorageKey) ?? []

export const setExtensionsConfig = (value: ReadonlyArray<IExtensionConfig>) =>
  setObject(extensionsStorageKey, value)
