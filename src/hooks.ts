import { Inputs, useEffect, useState } from 'preact/hooks'
import { dispatchError } from './components/AlertBox'

export function useIntUrlFragment(): number | undefined {
  const [fragment, setFragment] = useState(getIntUrlFragment)

  useEffect(() => {
    const handleHashChange = () => setFragment(getIntUrlFragment)
    addEventListener('hashchange', handleHashChange)
    return () => removeEventListener('hashchange', handleHashChange)
  }, [])

  return fragment
}

function getIntUrlFragment(): number | undefined {
  // We'll use parseInt instead of Number because:
  // * Number('') returns 0;
  // * parseInt('') returns NaN.
  const value = parseInt(location.hash.substring(1))
  return Number.isNaN(value) ? undefined : value
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key)
    return item !== null ? JSON.parse(item) as T : defaultValue
  })

  const storeValue = (newValue: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (err) {
      dispatchError(err as Error)
    } finally {
      setValue(newValue)
    }
  }

  return [value, storeValue]
}

export function useEvents<T>(url: string, handle: (event: T) => void, inputs: Inputs) {
  useEffect(() => {
    const source = new EventSource(url)

    source.onmessage = e => handle(JSON.parse(e.data) as T)

    // If a disconnection occurs, try again after 5 seconds.
    source.onerror = e => {
      setTimeout(() => location.reload(), 5000)
      dispatchError(e instanceof ErrorEvent
        ? e.error
        : new TypeError('disconnected from server-sent events'))
    }

    return () => source.close()
  }, inputs)
}
