import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import Profile from "@/assets/images/profile.png";
import { AuthService } from '../services/authService';
import {
    FiLogOut,
    FiSettings,
    FiBell,
    FiMonitor,
    FiBarChart2,
    FiMenu,
    FiTrendingUp,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import DetectionDataContext from "@/context/DetectionDataContext";

const navItems = [
    { name: "Reports", path: "/", icon: <FiBarChart2 /> },
    { name: "Analytics", path: "/analytics", icon: <FiTrendingUp /> },
    { name: "Alert Center", path: "/alerts", icon: <FiBell /> },
    { name: "Detection History", path: "/detections", icon: <FaHistory /> },
    { name: "Live View", path: "/live", icon: <FiMonitor /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useContext(DetectionDataContext)
    const navigate = useNavigate();
    console.log(state);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const closeSidebar = () => setIsOpen(false);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // handle logout
    const handleLogout = async () => {
        try {
            setIsLoading(true);
            const { error } = await AuthService.signOut();
            if (error) throw error;
            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            {
                isLoading ? (
                    <>
                        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                            <Helix
                                className="w-16 h-16"
                                color="#4f46e5"
                                speed={1}
                                strokeWidth={2}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Toggle Button (visible on mobile) */}
                        <div className="md:hidden fixed top-4 left-4 z-50">
                            <button onClick={toggleSidebar} className="text-2xl text-textColor">
                                <FiMenu />
                            </button>
                        </div>

                        {/* Overlay (when open on small screens) */}
                        {isOpen && (
                            <div className="fixed inset-0 bg-[#292a2b]/80  z-40 md:hidden">
                                <button
                                    onClick={closeSidebar}
                                    className="absolute top-6 right-4 text-4xl text-error"
                                >
                                    <MdClose />
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            {/* Sidebar */}
                            <aside
                                ref={sidebarRef}
                                className={`fixed z-50 top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 md:block border-r border-r-[#0000001A] p-6`}
                            ><div className="flex flex-col items-center justify-between h-full">

                                    {/* Top: Logo + Nav */}
                                    <div className="flex flex-col justify-between">
                                        <Link to="/" className="flex items-center gap-3 mb-8">
                                            <h2 className="text-2xl font-bold text-myPrimary">Smart City</h2>
                                        </Link>

                                        <nav className="space-y-2">
                                            {navItems.map((item) => (
                                                <NavLink
                                                    key={item.name}
                                                    to={item.path}
                                                    onClick={closeSidebar}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                                            ? "bg-[#1B59F8]/10 text-myPrimary font-semibold"
                                                            : "text-textColor hover:bg-[#1B59F8]/10"
                                                        }`
                                                    }
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </NavLink>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Bottom: Logout + Profile - Fixed at bottom */}
                                    <div >
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-error hover:bg-red-50 hover:cursor-pointer rounded-lg">
                                            <FiLogOut />
                                            Log out
                                        </button>
                                        <div className="mt-6 text-sm flex flex-row text-gray-600 border-t border-t-[#0000001A]">
                                            <div className="mr-2">
                                                <img
                                                    src={state.user_profile[0]?.avatar_url}
                                                    alt={state.user_profile[0]?.full_name}
                                                    className="w-12 h-12 rounded-full border-2 border-white shadow"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{state.user_profile[0]?.full_name}</div>
                                                <small className="my-4 text-black ">{state.user_profile[0]?.email}</small>
                                                {/* <div>{state.user_profile[0]?.email}</div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </>
                )

            }

        </>
    );
};

export default Sidebar;
