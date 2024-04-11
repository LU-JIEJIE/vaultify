export function getProperty<T = unknown>(obj: Record<string, unknown>, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.')

  if (!keys.length)
    return defaultValue

  let pre: Record<string, unknown> = obj
  for (let i = 0; i < keys.length; i++) {
    if (pre[keys[i]] === undefined)
      return defaultValue
    if (i === keys.length - 1)
      return pre[keys[i]] as T
    pre = pre[keys[i]] as Record<string, unknown>
  }
}

export function setProperty(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.')
  if (!keys.length)
    return
  let pre: Record<string, unknown> = obj
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) { pre[keys[i]] = value }
    else {
      if (pre[keys[i]] === undefined)
        pre[keys[i]] = {}
      pre = pre[keys[i]] as Record<string, unknown>
    }
  }
}

export function deleteProperty(obj: Record<string, unknown>, path: string) {
  const keys = path.split('.')
  if (!keys.length)
    return
  let pre: Record<string, unknown> = obj
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) { delete pre[keys[i]] }
    else {
      if (pre[keys[i]] === undefined)
        return
      pre = pre[keys[i]] as Record<string, unknown>
    }
  }
}
