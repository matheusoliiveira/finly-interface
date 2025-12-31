import { Activity, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface NavLink {
  name: string;
  path: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { authState, signOut } = useAuth();
  const { pathname } = useLocation();

  const isAuthenticated: boolean = !!authState.user;

  const navLinks: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transações", path: "/transacoes" },
  ];

  const handleSignOut = (): void => {
    setIsOpen(false);
    signOut();
  };

  const changeMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const handleAvatar = () => {
    if (!authState.user) return null;

    if (authState.user.photoURL) {
      return (
        <img
          src={authState.user.photoURL}
          alt={`foto do perfil do(a) ${authState.user.displayName}`}
          className="w-8 h-8 rounded-full border border-gray-700"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
        {authState.user.displayName?.charAt(0)}
      </div>
    );
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          <Link to={"/"} className="flex gap-2 text-xl text-primary-500 items-center font-bold">
            <Activity className="h-6 w-6" />
            Finly
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex space-x-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={
                    pathname === link.path
                      ? "text-primary-500 bg-primary-500/10 rounded-md h-10 px-3 py-2"
                      : "text-gray-400 rounded-md h-10 px-3 py-2 hover:text-primary-500 hover:bg-primary-500/5"
                  }
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {handleAvatar()}
                  <span className="text-sm font-medium">{authState.user?.displayName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className=" p-2 rounded-full  cursor-pointer"
                >
                  <LogOut className="text-gray-200 hover:text-red-700 transition-colors" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <LogIn className="bg-primary-500 text-gray-900 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all" />
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={changeMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div>
          <div>
            {isAuthenticated ? (
              <>
                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      to={link.path}
                      key={link.path}
                      className={`block px-3 p-5 rounded-lg
										${
                      pathname === link.path
                        ? "bg-gray-800 text-primary-500"
                        : "text-gray-400 hover:bg-primary-500"
                    }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center justify-between p-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    {handleAvatar()}
                    <span>{authState.user?.displayName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-red-700 p-2 rounded-full transition-colors cursor-pointer"
                  >
                    <LogOut size={24} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                className="bg-primary-500 text-gray-800 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600"
                to="/login"
                onClick={() => setIsOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
