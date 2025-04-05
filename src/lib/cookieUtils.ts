// src/lib/cookieUtils.ts
'use client'

import { setCookie as sc, deleteCookie as dc } from 'cookies-next'

export function setCookie(key: string, value: string, days = 7) {
  sc(key, value, {
    maxAge: 60 * 60 * 24 * days,
    path: '/',
  })
}

export function deleteCookie(key: string) {
  dc(key)
}
