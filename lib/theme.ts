import { lighten } from 'polished'
import { DefaultTheme } from 'styled-components'

const theme: DefaultTheme = {
   bg: '#3e4247',
   text: '#EEE',
   error: '#cf2351',
   warning: '#dbb921',
   ok: '#65db21',
   primary: '#872ce8',
   secondary: lighten(0.2, '#3e4247'),
   link: {
      default: '#872ce8',
      visited: '#872ce8',
   },
}

export default theme
