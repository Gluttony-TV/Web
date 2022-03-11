import { darken } from 'polished'
import { useEffect, useReducer, VFC } from 'react'
import ReactTooltip from 'react-tooltip'
import { useTheme } from 'styled-components'

const Tooltip: VFC = () => {
   const { bg } = useTheme()
   const [mounted, setMounted] = useReducer(() => true, false)

   useEffect(setMounted)

   if (!mounted) return null
   return <ReactTooltip type='dark' effect='solid' backgroundColor={darken(0.1, bg)} />
}

export default Tooltip
