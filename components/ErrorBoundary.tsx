import React, { ReactNode } from 'react'

interface Props {
   children: ReactNode
}

export default class ErrorBoundary extends React.Component<Props, { error?: Error }> {
   constructor(props: Props) {
      super(props)
      this.state = { error: undefined }
   }

   static getDerivedStateFromError(error: Error) {
      return { error }
   }

   componentDidCatch(error: Error) {
      console.error(error)
   }

   render() {
      if (this.state.error) {
         return <h1>Something went wrong.</h1>
      }

      return this.props.children
   }
}
