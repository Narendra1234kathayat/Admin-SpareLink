import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBox,
  FaClipboardList,
  FaPlus,
  FaUser,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaAddressCard,
  FaAtlas,
  FaCreditCard,
  FaProductHunt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../Store/Slice/SidebarSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { FaFaceAngry, FaFaceFrown, FaFaceGrinHearts } from "react-icons/fa6";

const Sidebar = () => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      x: -250,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
    },
  };

  const submenuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login"); // redirect
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => dispatch(toggleSidebar(isOpen))}
        className="btn btn-primary position-fixed top-0 start-0 m-3"
        style={{ zIndex: 1050 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 360 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <FaBars size={20} />
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="bg-dark text-white vh-100 position-fixed top-0 start-0 p-3 d-flex flex-column justify-content-between"
            style={{ width: "235px", zIndex: 1040 }}
          >
            {/* Top Section */}
            <div>
              <motion.h4
                className="fw-bold border-bottom pb-3 mb-3 mt-5"
                variants={itemVariants}
              >
                Admin Panel
              </motion.h4>

              <motion.nav
                className="nav flex-column gap-2"
                variants={itemVariants}
              >
                {/* Dashboard */}
                <motion.div
                  whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.2 }}
                  style={{ borderRadius: "5px" }}
                >
                  <Link
                    to="/admin/dashboard"
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    <FaBox />
                    Dashboard
                  </Link>
                </motion.div>

                {/* Spare Parts */}
                <motion.div
                  whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 0.2 }}
                  style={{ borderRadius: "5px" }}
                >
                  <Link
                    to="/admin/spareparts"
                    className="nav-link text-white d-flex align-items-center gap-2"
                  >
                    <FaProductHunt />
                    Spare Parts
                  </Link>
                </motion.div>

                {/* Product Management Dropdown */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    className="btn btn-link text-white text-start w-100 d-flex justify-content-between align-items-center"
                    onClick={() => setIsManageOpen(!isManageOpen)}
                    whileHover={{
                      x: 8,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ borderRadius: "5px" }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <FaClipboardList/>
                      Product Management
                    </span>
                    <motion.div
                      animate={{ rotate: isManageOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isManageOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </motion.div>
                  </motion.button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {isManageOpen && (
                      <motion.div
                        key="submenu"
                        variants={submenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="ms-4 d-flex flex-column gap-2 overflow-hidden"
                      >
                        <Link
                          to="/admin/category"
                          className="nav-link text-white"
                        >
                          <FaPlus /> Category
                        </Link>
                        <Link to="/admin/brand" className="nav-link text-white">
                          <FaPlus /> Brand
                        </Link>
                        <Link to="/admin/model" className="nav-link text-white">
                          <FaPlus /> Model
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Other Items */}
                {[
                  
                  {
                    to: "/admin/quotation",
                    icon: FaUser,
                    text: "Supplier Management",
                  },
                  // {
                  //   to: "/admin/analytics",
                  //   icon: FaClipboardList,
                  //   text: "Analytics Stats",
                  // },
                ].map((item) => (
                  <motion.div
                    key={item.to}
                    variants={itemVariants}
                    whileHover={{
                      x: 8,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ borderRadius: "5px" }}
                  >
                    <Link
                      to={item.to}
                      className="nav-link text-white d-flex align-items-center gap-2"
                    >
                      <item.icon />
                      {item.text}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            {/* Bottom Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="btn btn-danger w-100 rounded-pill mt-3 d-flex align-items-center justify-content-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
