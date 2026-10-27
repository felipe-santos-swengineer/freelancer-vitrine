'use client';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
export function useStored<T,>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState(initial);
  const [loadedKey, setLoadedKey] = useState('');
  useEffect(() => {
    let next = initial;
    try { const raw = localStorage.getItem(key); if (raw) next = JSON.parse(raw); } catch { /* The demo can continue in memory. */ }
    setValue(next); setLoadedKey(key);
    // Initial state is a fallback, not a reason to reload persisted state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => { if (loadedKey === key) try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional. */ } }, [key, value, loadedKey]);
  return [value, setValue, loadedKey === key];
}
export function saveText(name: string, text: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
