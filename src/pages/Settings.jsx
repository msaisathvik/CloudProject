import React, { useContext, useEffect, useState } from 'react';
import SectionLayout from '../layouts/SectionLayout';
import Profile from '@/assets/images/profile.png';
import DetectionDataContext from '@/context/DetectionDataContext';

const Settings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { state } = useContext(DetectionDataContext)
    const { user_profile } = state;
    const [formData, setFormData] = useState({
        fullName: user_profile[0]?.full_name,
        email: user_profile[0]?.email,
        phoneNumber: user_profile[0]?.phone_number,
        designation: user_profile[0]?.designation,
        gender: user_profile[0]?.gender,
        language: user_profile[0]?.language || "English",
    });
    useEffect(() => {

    }, [])

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={user_profile[0]?.avatar_url}
                            alt={user_profile[0]?.full_name}
                            className="md:w-20 md:h-20 w-16 h-16 rounded-full border-4 border-white shadow"
                        />
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div>
                        <h1 className="md:text-2xl text-lg font-bold text-gray-800">{formData.fullName}</h1>
                        <p className="text-gray-600 text-sm">{formData.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleEdit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {isEditing ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Cancel
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            {/* Profile Settings Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
                <div className="space-y-6">
                    {Object.keys(formData).map((key) => (
                        key !== 'email' && (
                            <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="text-sm font-medium text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <div className="md:col-span-2">
                                    <input
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2 rounded-lg border ${isEditing
                                            ? 'border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            : 'border-gray-200 bg-gray-50'
                                            } transition-all`}
                                    />
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {isEditing && (
                    <div className="border-t pt-6 flex justify-end">
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SectionLayout(Settings);