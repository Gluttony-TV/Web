import { FC, useMemo } from "react"
import { IShow } from "../api/models"


const ShowName: FC<Partial<IShow>> = ({ name_translated, name, aliases }) => {
   //const { locale } = useIntl()
   const locale = useMemo(() => 'eng', [])

   const names = useMemo(() => {

      if (name_translated) {

         if (typeof name_translated === 'string') return JSON.parse(name_translated)
         return name_translated

      } else if (aliases) {
         return aliases
            .filter(a => typeof a !== 'string')
            .reduce((o, { language, name }) => ({ ...o, [language]: name }), {})
      }

      return {}

   }, [name_translated, aliases])

   const translated = useMemo(() => names[locale] ?? name ?? '???', [names, locale, name])

   return <>{translated}</>
}

export default ShowName