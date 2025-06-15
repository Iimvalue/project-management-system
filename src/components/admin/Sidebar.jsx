import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Settings,
  User,
  BarChart3,
  FileText,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router"; 

export default function Sidebar({ menuItems = [], logo = "MyApp" }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Added for navigation

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  // Default menu items if none provided
  const defaultMenuItems = [
    { title: "Dashboard", path: "/dashboard", icon: Home },
    { title: "Analytics", path: "/analytics", icon: BarChart3 },
    { title: "Documents", path: "/documents", icon: FileText },
    { title: "Messages", path: "/messages", icon: Mail },
    { title: "Profile", path: "/profile", icon: User },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">{logo}</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {items.map((item, index) => {
              const IconComponent = item.icon || Home;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent
                      size={20}
                      className="mr-3 text-gray-400 group-hover:text-white"
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with Red Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
          <button
            className="flex items-center justify-center w-full space-x-1 px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={handleLogout}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span className="text-sm font-semibold text-white">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
}