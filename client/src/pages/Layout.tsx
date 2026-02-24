import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import MobileBottomNav from "../components/MobileBottomNav"


const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <MobileBottomNav />
      <div className="flex-1 overflow-y-scroll">
        <Outlet />
      </div>
      
    </div>
  )
}

export default Layout
