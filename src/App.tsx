import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import HomePage from './pages/HomePage.tsx'
import CategoryListPage from './pages/CategoryListPage.tsx'
import CategoryPage from './pages/CategoryPage.tsx'
import ChallengePage from './pages/ChallengePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":language" element={<CategoryListPage />} />
          <Route path=":language/:category" element={<CategoryPage />} />
          <Route path=":language/:category/:challengeId" element={<ChallengePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
