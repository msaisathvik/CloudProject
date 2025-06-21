import DetectionDataContext from "@/context/DetectionDataContext";
import React, { useContext, useState } from "react";
import { CiBellOn } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";

const SectionLayout = (WrappedComponent) => {
    return ({ title, ...props }) => {
        const { state, dispatch } = useContext(DetectionDataContext);
        const [showDropdown, setShowDropdown] = useState(false);
        const navigate = useNavigate();

        const handleNotificationClick = () => {
            setShowDropdown(prev => !prev);
        };

        const removeAlert = (id) => {
            const updatedAlerts = (state.alertData || []).filter(alert => alert.id !== id);
            dispatch({
                type: "SET_ALERT_DATA",
                payload: updatedAlerts
            });
        };

        const handleAlertClick = (id) => {
            removeAlert(id);
            setShowDropdown(false);
            navigate("/alerts");
        };

        const alertCount = (state.alertData || []).slice(0, 5).length;

        return (
            <section className="p-2 md:p-4 bg-[#F9F9F9] mb-8 relative">
                {title && (
                    <div className="mb-4 relative border-b border-b-[#0000001A] pb-2 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-textColor text-center flex-1">{title}</h2>
                        <div className="relative">
                            <CiBellOn
                                onClick={handleNotificationClick}
                                className="text-2xl text-error cursor-pointer"
                            />
                            {alertCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                    {alertCount}
                                </span>
                            )}

                            {showDropdown && (
                                <div className="absolute top-10 right-0 w-80 max-w-[90vw] bg-white rounded-lg shadow-lg z-[100] max-h-96 overflow-y-auto border border-gray-200">
                                    {alertCount > 0 ? (
                                        (state.alertData || []).slice(0, 5).map(alert => (
                                            <div
                                                key={alert.id}
                                                className="flex justify-between items-start gap-2 p-3 border-b hover:bg-lightPrimary cursor-pointer"
                                                onClick={() => handleAlertClick(alert.id)}
                                            >
                                                <div className="text-sm text-gray-800">
                                                    <span className="font-medium">{alert?.detections?.label}</span> detected at <b>{alert?.detections?.location}</b><br />
                                                    📅 {new Date(alert.sent_at).toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering alert click
                                                        removeAlert(alert.id);
                                                    }}
                                                    className="text-error hover:text-red-500 text-sm hover:cursor-pointer"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-gray-500 text-sm">No new notifications</div>
                                    )}
                                    <Link to="/alerts">
                                        <h5 className="text-myPrimary text-xs p-4 text-center hover:underline">
                                            See all alerts
                                        </h5>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <WrappedComponent {...props} />
            </section>
        );
    };
};

export default SectionLayout;
