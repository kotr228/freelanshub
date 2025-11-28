import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              FreelanceHub
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link to="/projects" className="px-3 py-2 hover:text-primary">
                Проєкти
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 hover:text-primary">
                  Панель
                </Link>
                {user?.role === 'client' && (
                  <Link to="/create-project" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Створити проєкт
                  </Link>
                )}
                <Link to={`/profile/${user?.id}`} className="px-3 py-2 hover:text-primary">
                  {user?.name}
                </Link>
                <button onClick={logout} className="px-3 py-2 text-red-600 hover:text-red-700">
                  Вихід
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 hover:text-primary">
                  Вхід
                </Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
