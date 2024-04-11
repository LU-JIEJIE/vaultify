import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { deepEqual } from 'node:assert'
import envPath from './envPath'
import { deleteProperty, getProperty, setProperty } from './utils'

interface Options {
  name: string
  displayNameTemplate?: `${string}[NAME]${string}`
  defaults?: Record<string, unknown>
}

export default class Vault {
  public name: string
  public displayName: string
  public cwd: string
  public path: string
  public defaults: Record<string, unknown>
  constructor(options: Options) {
    this.name = options.name
    this.displayName = options.displayNameTemplate ? options.displayNameTemplate.replace('[NAME]', this.name) : this.name
    this.cwd = envPath(this.displayName).config
    this.path = path.join(this.cwd, 'config.json')

    this.defaults = options.defaults || {}

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

  get store(): Record<string, unknown> {
    try {
      const data = readFileSync(this.path)
      return JSON.parse(data.toString())
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
      writeFileSync(this.path, JSON.stringify(value, null, 2))
    }
    catch (error) {
      throw new Error(`Failed to write to ${this.path}`)
    }
  }
}
