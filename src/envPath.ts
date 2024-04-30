import process from 'node:process'
import os from 'node:os'
import path from 'node:path'

function windowsPath(name: string) {
  const appDataPath = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
  return {
    config: path.join(appDataPath, name, 'Config'),
  }
}

function linuxPath(name: string) {
  const configPath = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config')
  return {
    config: path.join(configPath, name),
  }
}

function macPath(name: string) {
  const libraryPath = path.join(os.homedir(), 'Library')
  return {
    config: path.join(libraryPath, 'Preferences', name),
  }
}

type Platform = 'win32' | 'linux' | 'darwin'

export default function envPath(name: string) {
  switch (process.platform as Platform) {
    case 'win32':
      return windowsPath(name)
    case 'linux':
      return linuxPath(name)
    case 'darwin':
      return macPath(name)
  }
}
