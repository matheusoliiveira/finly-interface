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
  const navLink: NavLink[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transações", path: "/transaçoes" },
  ];

  const handlesignOut = (): void => {
    setIsOpen(false);
    signOut();
  };

  const changeMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const renderAvatar = () => {
    if (!authState.user) return null;

    if (authState.user.photoURL) {
      return (
        <img
          src={authState.user.photoURL}
          alt={`foto de perfil do(a) ${authState.user.displayName}`}
          className="w-8 h-8 rounded-full border border-gray-700"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white fount-medium">
        {authState.user.displayName?.charAt(0)}
      </div>
    );
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="container-app">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex gap-2 text-xl text-primary-500 items-center font-bold">
            <Activity className="h-6 w-6" />
            DevBills
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex space-x-3">
              {navLink.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={
                    decodeURIComponent(pathname) === link.path
                      ? "text-primary-500 bg-primary-500/10 rounded-md h-10 px-3 py-2"
                      : "text-gray-400 h-10 px-3 py-2 hover:text-primary-500 hover:bg-primary-500/5 rounded-md"
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
                  {renderAvatar()}
                  <span className="text-sm font-medium">{authState.user?.displayName}</span>
                </div>

                <button
                  type="button"
                  onClick={handlesignOut}
                  className=" hover:text-red-300 hover:bg-red-500 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="text-gray-200" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <LogIn className="bg-primary-500 text-gray-900 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center houver:bg-primary-500 transition-all"></LogIn>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={changeMenu}
            >
              {" "}
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
                  {navLink.map((link) => (
                    <Link
                      to={link.path}
                      key={link.path}
                      className={`block p-5 rounded-lg ${
                        pathname === link.path
                          ? "bg-gray-800 text-primary-500 font-medium"
                          : "text-gray-400 hover:bg-gray-800 hover:text-primary-500"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    {renderAvatar()}
                    <span>{authState.user?.displayName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handlesignOut}
                    className=" cursor-pointer text-gray-400 hover:text-red-700 p-2 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-500 text-gray-800 font-semibold px-5 py-2.5 rounded-2xl flex items-center justify-center hover:bg-primary-600"
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
