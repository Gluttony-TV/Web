import { FC, Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'

const AppSuspense: FC = ({ children }) => (
   <ErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
   </ErrorBoundary>
)

const Loading = () => <p>Loading...</p>

export default AppSuspense
