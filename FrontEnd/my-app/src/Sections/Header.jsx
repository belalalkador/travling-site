import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../Context/Context"; // User + notifications context
import {
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaUser,
  FaSignInAlt,
  FaClipboardList,
  FaSuitcase,
  FaBuilding,
  FaUserShield
} from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";

function Header() {
  const { user, notifications } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1400); // ✅ breakpoint changed to 1400

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1400);
      if (window.innerWidth > 1400) setMenuOpen(false); // close mobile menu on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const unreadCount = notifications?.filter(n => !n.isRead)?.length || 0;
  const linkClass = "hover:text-gray-300 flex items-center gap-2 relative";

  return (
    <header className="w-full bg-[#2C3E50] text-white shadow z-50 px-2 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4 md:py-6">
        <h1 className="text-xl font-bold md:text-2xl">TravelSite</h1>

        {/* Desktop Menu */}
        {isDesktop && (
          <nav>
            <ul className="flex gap-6 text-base md:gap-8 md:text-lg">
              <li><Link to="/" className={linkClass}><FaHome />Home</Link></li>
              <li><Link to="/about" className={linkClass}><FaInfoCircle />About Us</Link></li>
              {user ? (
                <>
                  <li><Link to="/profile" className={linkClass}><FaUser />Profile</Link></li>
                  <li><Link to="/reserve" className={linkClass}><FaClipboardList />Reserve</Link></li>
                  <li><Link to="/my-reverc" className={linkClass}><FaSuitcase />My Revers</Link></li>

                  <li className="relative">
                    <Link to="/notifications" className={linkClass}>
                      <IoNotificationsOutline />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>

                  {user.isCompany && (
                    <li><Link to="/company-dashboard" className={linkClass}><FaBuilding />Company Dashboard</Link></li>
                  )}
                  {user.isAdmin && (
                    <li><Link to="/admin-dashboard" className={linkClass}><FaUserShield />Admin Dashboard</Link></li>
                  )}
                </>
              ) : (
                <li><Link to="/login" className={linkClass}><FaSignInAlt />Login</Link></li>
              )}
            </ul>
          </nav>
        )}

        {/* Mobile Menu Icon */}
        {!isDesktop && (
          <div className="flex justify-end w-full">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {!isDesktop && menuOpen && (
        <div className="px-6 pb-4 bg-[#2C3E50] transition-all duration-300">
          <ul className="flex flex-col gap-4 text-base">
            <li><Link to="/" className={linkClass} onClick={() => setMenuOpen(false)}><FaHome />Home</Link></li>
            <li><Link to="/about" className={linkClass} onClick={() => setMenuOpen(false)}><FaInfoCircle />About Us</Link></li>
            {user ? (
              <>
                <li><Link to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}><FaUser />Profile</Link></li>
                <li><Link to="/reserve" className={linkClass} onClick={() => setMenuOpen(false)}><FaClipboardList />Reserve</Link></li>
                <li><Link to="/my-reverc" className={linkClass} onClick={() => setMenuOpen(false)}><FaSuitcase />My Revers</Link></li>

                <li className="relative">
                  <Link to="/notifications" className={linkClass} onClick={() => setMenuOpen(false)}>
                    <IoNotificationsOutline /> Notifications
                    {unreadCount > 0 && (
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>

                {user.isCompany && (
                  <li><Link to="/company-dashboard" className={linkClass} onClick={() => setMenuOpen(false)}><FaBuilding />Company Dashboard</Link></li>
                )}
                {user.isAdmin && (
                  <li><Link to="/admin-dashboard" className={linkClass} onClick={() => setMenuOpen(false)}><FaUserShield />Admin Dashboard</Link></li>
                )}
              </>
            ) : (
              <li><Link to="/login" className={linkClass} onClick={() => setMenuOpen(false)}><FaSignInAlt />Login</Link></li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
