import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { ProblemDetailsPage } from "./pages/ProblemDetailsPage";
import { PracticePage } from "./pages/PracticePage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { AttemptsPage } from "./pages/AttemptsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="problems/:id" element={<ProblemDetailsPage />} />
        <Route path="practice/:problemId" element={<PracticePage />} />
        <Route path="attempts" element={<AttemptsPage />} />
        <Route path="attempts/:id" element={<EvaluationPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
