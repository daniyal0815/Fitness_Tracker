import { NavLink } from "react-router-dom"
import { HomeIcon, UtensilsIcon, ActivityIcon, UserIcon } from "lucide-react"

const MobileBottomNav = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/food', label: 'Food', icon: UtensilsIcon },
    { path: '/activity', label: 'Activity', icon: ActivityIcon },
    { path: '/profile', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-3">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive
                ? 'text-emerald-500'
                : 'text-slate-400'
            }`
          }
        >
          <item.icon className="size-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav