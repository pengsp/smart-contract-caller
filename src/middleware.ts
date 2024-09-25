import { NextRequest, NextResponse } from 'next/server'
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { cookieName, defaultLang } from './i18n/config';

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest): string {
    // Get locale from cookie
    if (request.cookies.has(cookieName))
        return request.cookies.get(cookieName)!.value;
    // Get accept language from HTTP headers
    const acceptLang = request.headers.get("Accept-Language");
    if (!acceptLang) return defaultLang;
    // Get match locale
    const headers = { "accept-language": acceptLang };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, languages, defaultLang);
}

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();
    const locale = getLocale(request);
    const response = NextResponse.next()
    // Set locale to cookie
    response.cookies.set('lang', locale);
    return response;
}
