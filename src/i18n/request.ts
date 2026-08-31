import { getRequestConfig } from 'next-intl/server';

function deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
): Record<string, unknown> {
    if (!source) return target;
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (
            sourceValue instanceof Object &&
            !Array.isArray(sourceValue) &&
            key in target &&
            targetValue instanceof Object &&
            !Array.isArray(targetValue)
        ) {
            result[key] = deepMerge(
                targetValue as Record<string, unknown>,
                sourceValue as Record<string, unknown>,
            );
        } else {
            result[key] = sourceValue;
        }
    }
    return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    const locales = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'pt'];

    // Ensure that a valid locale is used
    if (!locale || !locales.includes(locale)) {
        locale = 'en';
    }

    let messages: Record<string, unknown> = {};
    try {
        messages = (await import(`../../messages/${locale}.json`)).default;
    } catch {
        console.warn(`Messages for locale "${locale}" not found, falling back to English.`);
    }

    let defaultMessages: Record<string, unknown> = {};
    try {
        defaultMessages = (await import(`../../messages/en.json`)).default;
    } catch {
        console.error(`Default English messages not found!`);
    }

    return {
        locale,
        messages: deepMerge(defaultMessages, messages),
    };
});
