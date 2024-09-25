import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers'
import { cookieName, defaultLang } from './config';

function getLocale(): string {
    const cookieStore = cookies()
    const lang = cookieStore.get(cookieName)
    return lang?.value || defaultLang
}
export default getRequestConfig(async () => {
    const locale = getLocale();
    return {
        locale,
        messages: (await import(`./locales/${locale}/common.json`)).default
    };
});