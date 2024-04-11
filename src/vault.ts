import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { deepEqual } from 'node:assert'
import { Buffer } from 'node:buffer'
import envPath from './envPath'
import { deleteProperty, getProperty, setProperty } from './utils'

export interface Options {
  name: string
  displayNameTemplate?: `${string}[NAME]${string}`
  fileName?: string
  fileExtension?: string
  defaults?: Record<string, unknown>
  obfuscate?: boolean
}

export default class Vault {
  public readonly name: string
  public readonly displayName: string
  public readonly cwd: string
  public readonly filePath: string
  public readonly obfuscate: boolean
  public readonly defaults: Record<string, unknown>
  constructor(options: Options) {
    const formatOptions = {
      displayNameTemplate: '[NAME]',
      fileName: 'config',
      fileExtension: 'json',
      obfuscate: false,
      ...options
    }

    this.name = formatOptions.name
    this.displayName = formatOptions.displayNameTemplate.replace('[NAME]', this.name)
    this.cwd = envPath(this.displayName).config
    this.filePath = path.join(this.cwd, `${formatOptions.fileName}${formatOptions.fileExtension === '' ? '' : '.'}${formatOptions.fileExtension}`)

    this.obfuscate = formatOptions.obfuscate

    this.defaults = formatOptions.defaults || {}

    // init default
    const newStore = { ...this.defaults, ...this.store }
    try {
      deepEqual(this.store, newStore)
    }
    catch (error) {
      this.store = newStore
    }
  }

  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    return getProperty(this.store, key, defaultValue)
  }

  set(object: Record<string, unknown>): void
  set(key: string, value: unknown): void
  set(key: string | Record<string, unknown>, value?: unknown): void {
    let newStore: Record<string, unknown>

    if (typeof key === 'object') {
      newStore = { ...this.store, ...key }
    }
    else {
      newStore = { ...this.store }
      setProperty(newStore, key, value)
    }
    this.store = newStore
  }

  has(key: string): boolean {
    return getProperty(this.store, key) !== undefined
  }

  delete(key: string) {
    const newStore = this.store
    deleteProperty(newStore, key)
    this.store = newStore
  }

  reset(isDefault: boolean = true) {
    this.store = isDefault ? this.defaults : {}
  }

  [Symbol.iterator](): Iterator<[string, unknown]> {
    const store = this.store
    const keys = Object.keys(store)
    let index = 0
    return {
      next: () => {
        if (index < keys.length)
          return { value: [keys[index], store[keys[index++]]], done: false }

        else
          return { value: undefined, done: true }
      }
    }
  }

  get store(): Record<string, unknown> {
    try {
      const data = readFileSync(this.filePath)
      const rawData = this.obfuscate ? this._deobfuscate(data.toString()) : JSON.parse(data.toString())
      return rawData
    }
    catch (error: any) {
      if (error.code === 'ENOENT')
        this._mkdirCwd()

      return {}
    }
  }

  set store(value: Record<string, unknown>) {
    this._mkdirCwd()
    this._writeFile(value)
  }

  private _mkdirCwd() {
    mkdirSync(this.cwd, { recursive: true })
  }

  private _writeFile(value: Record<string, unknown>) {
    try {
      const _value = this.obfuscate ? this._obfuscate(value) : JSON.stringify(value, null, 2)
      writeFileSync(this.filePath, _value)
    }
    catch (error) {
      throw new Error(`Failed to write to ${this.filePath}`)
    }
  }

  private _obfuscate(value: Record<string, unknown>): string {
    const jsonData = JSON.stringify(value, null, 2)
    const base64Data = Buffer.from(jsonData).toString('base64')
    return base64Data
  }

  private _deobfuscate(value: string): Record<string, unknown> {
    const jsonData = Buffer.from(value, 'base64').toString()
    const rawData = JSON.parse(jsonData)
    return rawData
  }
}
