import { Link } from 'react-router-dom';
import './sections.css';
import { useUser } from '../Context/Context';

function Header() {
  const { user } = useUser() // access user from context

  return (
    <header className="header">
      <div className="logo">
        <h1 >TravelSite</h1>
        </div>

      <nav className="nav-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>

          {user ? ( // if user exists
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/reserve">reserve</Link></li>
              <li><Link to="/my-reverc">myrevce</Link></li>

              {/* If user is a company */}
              {user.isCompany && (
                <li><Link to="/company-dashboard/all-jourenes">Company Dashboard</Link></li>
              )}

              {/* If user is an admin */}
              {user.isAdmin && (
                <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
              )}
            </>
          ) : (
            <li><Link to="/login">Login</Link></li> // if no user
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
