import { Layout } from './components/Layout'
import { HomePage } from './app/pages/home'
import { registry } from './app/registry'
import { useHashRoute } from './app/router'

function App() {
  const route = useHashRoute()
  const LearnerPageView = route === '' ? null : registry[route].Page

  return (
    <Layout route={route}>
      {LearnerPageView ? <LearnerPageView /> : <HomePage />}
    </Layout>
  )
}

export default App
