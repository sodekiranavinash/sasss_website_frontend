import { useNavbarMenu } from "../scripts/menu";
import Logo from "../assets/images/logo.png";
import DesktopMenu from "../components/DesktopMenu";
import MobMenu from "../components/MobMenu";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import routes from "../scripts/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/slice/userSlice";
import * as storeModule from "../store/store";
import { setUser } from "../store/slice/userSlice";
import { logOutUser } from "../scripts/userRequests";

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navBarMenu = useNavbarMenu();
  const navigate = useNavigate(); // Hook for navigation

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    setProfileDropdownOpen(false);
    localStorage.removeItem("user");
    logOutUser();
    navigate(routes.indexRoute);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log(user);
      dispatch(setUser(user));
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner, if needed
  }

  return (
    <div>
      {/* Main Navbar */}
      <header className="h-16 fixed top-0 inset-x-0 bg-orange-600 z-30 mt-7">
        <nav className="flex justify-between items-center mx-auto h-full px-4 md:px-6">
          <Link to={routes.indexRoute}>
            <div className="flex items-center">
              <img src={Logo} alt="company logo" className="w-10 mr-2" />
              <p className="text-lg hidden lg:block text-white">{t("common.sasss")}</p>
              <p className="text-ms text-white lg:hidden">SASSS</p>
            </div>
          </Link>

          <ul className="hidden lg:flex flex-1 justify-center gap-x-6">
            {navBarMenu.map((menu) => (
              <DesktopMenu menu={menu} key={menu.name} />
            ))}
          </ul>

          <div className="flex items-center gap-x-2 md:gap-x-3 lg:gap-x-5 relative">
            <Link
              to="/donate"
              className="bg-transparent text-white font-semibold px-4 py-2 rounded-full border-2 border-white hover:bg-orange-500 transition duration-300 text-sm"
            >
              {t("common.donate")}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center"
                >
                 <img
                    src={user.picture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2"
                  />
                </button>
                {isProfileDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="text-black block w-full text-left px-3 py-1 text-sm font-bold hover:bg-orange-500 hover:text-white"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate(routes.loginRoute)} // Navigate to the login page
                aria-label="login"
                className="bg-transparent text-white font-semibold px-4 py-2 rounded-full border-2 border-white hover:bg-orange-500 transition duration-300 text-sm"
              >
                {t("common.logIn")}
              </button>
            )}

            <div className="lg:hidden">
              <MobMenu Menus={navBarMenu} />
            </div>
          </div>
        </nav>
      </header>

      {/* Small Navbar */}
      <div className="bg-orange-700 text-white fixed top-0 inset-x-0 z-40 flex justify-between items-center px-4 md:px-6">
        <p className="text-ms hidden lg:block text-white">Sri Ayyappa Swamy Seva Sannidhi</p>
        <p className="text-xs text-white lg:hidden">Sri Ayyappa Swamy Seva Sannidhi</p>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="text-sm font-semibold px-3 py-1 flex items-center"
          >
            <FontAwesomeIcon icon={faLanguage} className="mr-2" />
            {currentLanguage === "en"
              ? "English"
              : currentLanguage === "kn"
              ? "ಕನ್ನಡ"
              : "తెలుగు"}
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50"
            >
              <button
                onClick={() => changeLanguage("en")}
                className="text-black block w-full text-left px-3 py-1 text-sm font-bold hover:bg-orange-500 hover:text-white"
              >
                English
              </button>
              <button
                onClick={() => changeLanguage("kn")}
                className="text-black block w-full text-left px-3 py-1 text-sm font-bold hover:bg-orange-500 hover:text-white"
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => changeLanguage("te")}
                className="text-black block w-full text-left px-3 py-1 text-sm font-bold hover:bg-orange-500 hover:text-white"
              >
                తెలుగు
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;