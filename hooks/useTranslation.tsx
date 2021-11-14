import { useMemo } from 'react'
import { useIntl } from 'react-intl'

export default function useTranslation(fallback: string, translations?: Record<string, string>) {
   const { locale } = useIntl()
   return useMemo(() => {
      if (translations) {
         const key = Object.keys(translations).find(k => k.startsWith(locale))
         if (key) return translations[key]
      }
      return fallback
   }, [fallback, translations, locale])
}
