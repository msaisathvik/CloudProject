import React, { useContext, useState } from 'react';
import SectionLayout from '../layouts/SectionLayout';
import { BsCameraVideoFill } from 'react-icons/bs';
import DetectionDataContext from '@/context/DetectionDataContext';
import ThumbImg from '@/assets/images/cam_thumbnail.jpg';
import { Supabase } from "../../Supabase";
import { Helix } from 'ldrs/react'
import 'ldrs/react/Helix.css'



const Live_Camera = () => {
    const { state, dispatch } = useContext(DetectionDataContext);
    const cameraList = state.camerasData || [];

    const [newCameraFormData, setNewCameraFormData] = useState({
        location: '',
        area: '',
        status: '',
    });

    const [showModal, setShowModal] = useState({
        newCamera: false,
        ipAddressFor: null, // cameraId for IP modal
    });

    const [cameraIpMap, setCameraIpMap] = useState({}); // { [cameraId]: ipAddress }

    const [connectedStreams, setConnectedStreams] = useState({}); // { [cameraId]: streamURL }
    const [loadingStreams, setLoadingStreams] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleAddNewCamera = () => {
        setShowModal({ ...showModal, newCamera: true });
    };

    const handleViewCamera = (cameraId) => {
        setShowModal({ ...showModal, ipAddressFor: cameraId });
    };

    const handleConnectStream = (cameraId, e) => {
        e.preventDefault();
        let input = cameraIpMap[cameraId]?.trim();
        if (!input) return;

        let streamUrl = input;

        // Ensure there is a protocol
        if (!streamUrl.startsWith('http://') && !streamUrl.startsWith('https://')) {
            streamUrl = 'http://' + streamUrl;
        }

        try {
            const url = new URL(streamUrl);
            // If only hostname/ip is provided (path is empty or '/'), append '/video'.
            if (url.pathname === '/' || url.pathname === '') {
                // remove trailing slash if any before appending
                streamUrl = streamUrl.replace(/\/$/, '');
                streamUrl = `${streamUrl}/video`;
            }
        } catch (e) {
            // if parsing fails, it might be an invalid URL.
            // For now, we'll let it try to connect anyway.
            console.error("Invalid URL format:", streamUrl);
        }

        setLoadingStreams(prev => ({ ...prev, [cameraId]: true }));

        // Simulate stream loading delay
        const testImg = new Image();
        testImg.src = streamUrl;
        testImg.onload = () => {
            setConnectedStreams(prev => ({ ...prev, [cameraId]: streamUrl }));
            setLoadingStreams(prev => ({ ...prev, [cameraId]: false }));
        };
        testImg.onerror = () => {
            alert("Failed to load stream.");
            setLoadingStreams(prev => ({ ...prev, [cameraId]: false }));
        };

        setShowModal({ ...showModal, ipAddressFor: null });
    };


    const handleAddNewCameraFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { location, area, status } = newCameraFormData;
        if (!location || !area || !status) return;

        try {
            const formattedId = cameraList.length < 10 ? `CAM_0${cameraList.length + 1}` : `CAM_${cameraList.length + 1}`;
            const newCamera = {
                id: formattedId,
                location,
                area,
                status,
                last_active_at: new Date().toISOString(),
            };
            const { error } = await Supabase.from("cameras").insert([newCamera]);
            if (error) throw error;

            dispatch({
                type: "SET_CAMERAS_DATA",
                payload: [...cameraList, newCamera],
            });
            setIsLoading(false);
        } catch (error) {
            console.error("Error adding new camera:", error);
            setIsLoading(false);
        }

        setShowModal({ ...showModal, newCamera: false });
    };

    return (
        <div className="space-y-6">
            {/* Add New Camera Modal */}
            {isLoading ? (
                <div className="col-span-full flex items-center justify-center h-[50vh]">
                    <Helix
                        size="45"
                        speed="2.5"
                        color='#1B59F8'
                    />
                </div>
            ) : (

                <>

                    {
                        showModal.newCamera && (
                            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                    <form
                                        onSubmit={(e) => handleAddNewCameraFormSubmit(e)}
                                        className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                                    >
                                        <h2 className="text-xl font-semibold text-gray-800 text-center">Add New Camera</h2>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                value={newCameraFormData.location}
                                                onChange={(e) =>
                                                    setNewCameraFormData({ ...newCameraFormData, location: e.target.value })
                                                }
                                                placeholder="Location of new camera"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-myPrimary"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Area</label>
                                            <input
                                                type="text"
                                                value={newCameraFormData.area}
                                                onChange={(e) =>
                                                    setNewCameraFormData({ ...newCameraFormData, area: e.target.value })
                                                }
                                                placeholder="Area"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-myPrimary"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Camera Status</label>
                                            <select
                                                value={newCameraFormData.status}
                                                onChange={(e) =>
                                                    setNewCameraFormData({ ...newCameraFormData, status: e.target.value })
                                                }
                                                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-myPrimary"
                                                required
                                            >
                                                <option value="" disabled>Select Camera Status</option>
                                                <option value="active">Active</option>
                                                <option value="offline">Inactive</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal({ newCamera: false })}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition hover:cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-myPrimary text-white px-4 py-2 rounded-lg hover:bg-myPrimary/90 transition hover:cursor-pointer"
                                            >
                                                Add Camera
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        )
                    }
                </>
            )}

            {/* Add New Camera Button */}
            <div className="text-end">
                {!isLoading && (
                    <button
                        onClick={handleAddNewCamera}
                        className="px-4 py-2 bg-myPrimary text-white rounded-md hover:bg-myPrimary/90"
                    >
                        Add New Camera
                    </button>
                )}

            </div>

            {/* Camera Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading || cameraList.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center h-[50vh]">
                        <Helix
                            size="45"
                            speed="2.5"
                            color='#1B59F8'
                        />
                    </div>
                ) : (
                    <>
                        {cameraList.map((camera) => (
                            <div key={camera.id} className="bg-white border rounded-xl shadow p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <BsCameraVideoFill className="text-blue-600" />
                                        {camera.id}
                                    </h2>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${camera.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-error'
                                            }`}
                                    >
                                        {camera.status}
                                    </span>
                                </div>

                                {/* Thumbnail / Loader / Stream */}
                                {loadingStreams[camera.id] ? (
                                    <div className="flex items-center justify-center h-48">
                                        <Helix
                                            size="45"
                                            speed="2.5"
                                            color='#1B59F8'
                                        />
                                    </div>
                                ) : connectedStreams[camera.id] ? (
                                    <img
                                        src={connectedStreams[camera.id]}
                                        alt="Live camera feed"
                                        className="w-full h-48 object-cover rounded-md border"
                                        onError={(e) => (e.currentTarget.src = '/fallback-camera.jpg')}
                                    />
                                ) : (
                                    <img
                                        src={ThumbImg}
                                        alt="Camera Thumbnail"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                )}

                                <p><strong>Location:</strong> {camera.location}</p>
                                <p><strong>Area:</strong> {camera.area}</p>
                                <p className="text-xs text-gray-400">
                                    Last Active: {new Date(camera.last_active_at).toLocaleString()}
                                </p>

                                {connectedStreams[camera.id] ? (
                                    <button
                                        onClick={() => {
                                            const updatedStreams = { ...connectedStreams };
                                            delete updatedStreams[camera.id];
                                            setConnectedStreams(updatedStreams);
                                        }}
                                        className="w-full py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Disconnect
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleViewCamera(camera.id)}
                                        className="w-full py-2 text-sm bg-myPrimary text-white rounded-md hover:bg-myPrimary/90"
                                    >
                                        View Camera
                                    </button>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>


            {/* IP Input Modal */}
            {showModal.ipAddressFor && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-center">Enter Camera Stream Address</h2>
                        <form onSubmit={(e) => handleConnectStream(showModal.ipAddressFor, e)} className="space-y-4">
                            <input
                                type="text"
                                placeholder="e.g. 192.168.1.10:8080 or my-cam.com/stream"
                                value={cameraIpMap[showModal.ipAddressFor] || ''}
                                onChange={(e) =>
                                    setCameraIpMap(prev => ({ ...prev, [showModal.ipAddressFor]: e.target.value }))
                                }
                                className="w-full border px-4 py-2 rounded-md"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal({ ...showModal, ipAddressFor: null })}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                                >
                                    Connect
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionLayout(Live_Camera);
