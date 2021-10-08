export async function getTranslations(locale: string): Promise<[string, Record<string, string>]> {
   try {
      const messages = await import(`../compiled-lang/${locale}.json`)
      return [locale, messages]
   } catch {
      if (locale === 'en') throw new Error('No messages defined')
      return getTranslations('en')
   }
}