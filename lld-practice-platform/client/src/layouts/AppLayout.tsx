import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/problems", label: "Problems" },
  { to: "/attempts", label: "My Attempts" },
  { to: "/progress", label: "Progress" },
];

export function AppLayout() {
  return (
    <div className="min-h-full">
      <header className="border-b border-ink-800/10 bg-ink-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blueprint-500 font-mono-data text-xs font-bold text-white">
              {"</>"}
            </div>
            <span className="font-mono-data text-sm font-medium tracking-tight text-paper">
              LLD Practice Platform
            </span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-paper" : "text-paper/60 hover:text-paper/90"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blueprint-500/20 text-xs font-medium text-blueprint-400">
              DL
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/5 px-4 py-1.5 sm:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ${
                  isActive ? "bg-white/10 text-paper" : "text-paper/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
