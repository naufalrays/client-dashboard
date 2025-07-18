import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toggleTheme, toggleSidebar } from "../../store/themeConfigSlice";
import type { IRootState } from "../../store";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

// Import components
import Dropdown from "../Dropdown";
import { GlobalFilterWidget } from "../GlobalFilter/GlobalFilterWidget";
import IconSun from "../Icon/IconSun";
import IconMoon from "../Icon/IconMoon";
import IconLaptop from "../Icon/IconLaptop";
import IconUser from "../Icon/IconUser";
import IconLogout from "../Icon/IconLogout";
import IconMenu from "../Icon/IconMenu";

const Header = () => {
  const location = useLocation();
  const { logout, loading } = useAuth();

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const all: any = document.querySelectorAll(
        "ul.horizontal-menu .nav-link.active"
      );
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove("active");
      }
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any = ul.closest("li.menu").querySelectorAll(".nav-link");
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add("active");
          });
        }
      }
    }
  }, [location]);

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Logout failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <header
      className={`z-40 ${
        themeConfig.semidark && themeConfig.menu === "horizontal" ? "dark" : ""
      }`}
    >
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
          {/* Left Section: Dashboard Overview and Welcome Back! */}
          <div className="flex items-center ltr:mr-auto rtl:ml-auto">
            <button
              type="button"
              className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:mr-2 rtl:ml-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              onClick={() => {
                dispatch(toggleSidebar());
              }}
            >
              <IconMenu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold dark:text-white-light">
                Client Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hi!</p>
            </div>
          </div>

          {/* Right Section: Global Filter, Theme Toggle, and User Profile */}
          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6] justify-end">
            {/* Mobile Filter Button - Visible only on mobile */}
            <div className="md:hidden">
              <div className="dropdown shrink-0">
                <GlobalFilterWidget showCreateGroup={true} compact={true} />
              </div>
            </div>

            {/* Desktop Global Filter Widget - Hidden on mobile */}
            <div className="hidden md:block">
              <GlobalFilterWidget showCreateGroup={true} />
            </div>

            {/* Theme Toggle */}
            <div>
              {themeConfig.theme === "light" ? (
                <button
                  className={`${
                    themeConfig.theme === "light" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => {
                    dispatch(toggleTheme("dark"));
                  }}
                >
                  <IconSun />
                </button>
              ) : (
                ""
              )}
              {themeConfig.theme === "dark" && (
                <button
                  className={`${
                    themeConfig.theme === "dark" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => {
                    dispatch(toggleTheme("system"));
                  }}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === "system" && (
                <button
                  className={`${
                    themeConfig.theme === "system" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => {
                    dispatch(toggleTheme("light"));
                  }}
                >
                  <IconLaptop />
                </button>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="dropdown shrink-0 flex">
              <Dropdown
                offset={[0, 8]}
                btnClassName="relative group block"
                button={
                  <img
                    className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src="/assets/images/user-profile.jpeg"
                    alt="userProfile"
                  />
                }
              >
                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <img
                        className="rounded-md w-10 h-10 object-cover"
                        src="/assets/images/user-profile.jpeg"
                        alt="userProfile"
                      />
                      <div className="ltr:pl-4 rtl:pr-4 truncate">
                        <h4 className="text-base">John Doe</h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          johndoe@email.com
                        </button>
                      </div>
                    </div>
                  </li>

                  <li>
                    <Link to="/users/profile" className="dark:hover:text-white">
                      <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                      Profile
                    </Link>
                  </li>
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="text-danger !py-3 w-full text-left flex items-center px-4 py-2 hover:bg-white-light/90 dark:hover:bg-dark/60 disabled:opacity-50"
                    >
                      <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                      {loading ? "Signing Out..." : "Sign Out"}
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
