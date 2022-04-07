export async function getTranslations(locale: string): Promise<[string, Record<string, string>]> {
   try {
      const messages = await import(`../lang/generated/${locale}.json`)
      return [locale, messages]
   } catch {
      if (locale === 'en') throw new Error('No messages defined')
      return getTranslations('en')
   }
}
