import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ReportsLayout } from './pages/reports/ReportsLayout'
import { FinancialPage } from './pages/reports/FinancialPage'
import { MedicamentosPage } from './pages/reports/MedicamentosPage'
import { IdeasPage } from './pages/reports/IdeasPage'
import { RememberPage } from './pages/reports/RememberPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reports" element={<ReportsLayout />}>
        <Route index element={<Navigate to="/reports/financial" replace />} />
        <Route path="financial" element={<FinancialPage />} />
        <Route path="medicamentos" element={<MedicamentosPage />} />
        <Route path="ideas" element={<IdeasPage />} />
        <Route path="remember" element={<RememberPage />} />
      </Route>
    </Routes>
  )
}
