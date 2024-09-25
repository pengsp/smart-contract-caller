'use server';

import { cookies } from 'next/headers';
import { defaultLang, cookieName } from './config';

export async function getUserLocale() {
    return cookies().get(cookieName)?.value || defaultLang;
}

export async function setUserLocale(locale: string) {
    cookies().set(cookieName, locale);
}