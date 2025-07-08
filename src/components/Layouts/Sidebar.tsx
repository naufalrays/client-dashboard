import PerfectScrollbar from "react-perfect-scrollbar";
// import { useTranslation } from 'react-i18next'; // Dihapus karena t() tidak lagi digunakan
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { toggleSidebar } from "../../store/themeConfigSlice";
// import AnimateHeight from "react-animate-height";
import type { IRootState } from "../../store";
import { useEffect } from "react";
import IconCaretsDown from "../Icon/IconCaretsDown";
import { House, Users, ChartColumn } from "lucide-react"; // Import ikon dari Lucide React

const Sidebar = () => {
  // const [currentMenu, setCurrentMenu] = useState<string>("");
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );
  const location = useLocation();
  const dispatch = useDispatch();
  // const { t } = useTranslation(); // Baris ini dihapus

  // const toggleMenu = (value: string) => {
  //   setCurrentMenu((oldValue) => {
  //     return oldValue === value ? "" : value;
  //   });
  // };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={semidark ? "dark" : ""}>
      <nav
        className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
          semidark ? "text-white-dark" : ""
        }`}
      >
        <div className="bg-white dark:bg-black h-full">
          <div className="flex justify-between items-center px-4 py-3">
            <NavLink to="/" className="main-logo flex items-center shrink-0">
              {/* <img
                className="w-8 ml-[5px] flex-none"
                src="/assets/images/logo.svg"
                alt="logo"
              /> */}
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
                Japi
              </span>{" "}
            </NavLink>

            <button
              type="button"
              className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
              <li className="nav-item">
                <NavLink to="/" className="group">
                  <div className="flex items-center">
                    <House className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      Dashboard
                    </span>{" "}
                    {/* t('chat') diganti Chat */}
                  </div>
                </NavLink>
              </li>
              {/* <li className="menu nav-item">
                <button
                  type="button"
                  className={`${
                    currentMenu === "dashboard" ? "active" : ""
                  } nav-link group w-full`}
                  onClick={() => toggleMenu("dashboard")}
                >
                  <div className="flex items-center">
                    <House className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      Dashboard
                    </span>{" "}
                  </div>

                  <div
                    className={
                      currentMenu !== "dashboard"
                        ? "rtl:rotate-90 -rotate-90"
                        : ""
                    }
                  >
                    <IconCaretDown />
                  </div>
                </button>

                <AnimateHeight
                  duration={300}
                  height={currentMenu === "dashboard" ? "auto" : 0}
                >
                  <ul className="sub-menu text-gray-500">
                    <li>
                      <NavLink to="/">A</NavLink>{" "}
                    </li>
                    <li>
                      <NavLink to="/analytics">B</NavLink>{" "}
                    </li>
                  </ul>
                </AnimateHeight>
              </li> */}

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <NavLink to="/user-progress" className="group">
                      <div className="flex items-center">
                        <Users className="group-hover:!text-primary shrink-0" />
                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                          User Progress
                        </span>{" "}
                        {/* t('chat') diganti Chat */}
                      </div>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/engagement-data" className="group">
                      <div className="flex items-center">
                        <ChartColumn className="group-hover:!text-primary shrink-0" />
                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                          Engagement Data
                        </span>{" "}
                        {/* t('notes') diganti Notes */}
                      </div>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
