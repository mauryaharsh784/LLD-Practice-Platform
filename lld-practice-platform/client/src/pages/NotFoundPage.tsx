import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="font-mono-data text-sm text-ink-800/40">404</p>
      <h1 className="text-lg font-semibold text-ink-800">Page not found</h1>
      <p className="text-sm text-ink-800/60">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">
        <Button size="sm" variant="secondary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
