import { useState } from 'react';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storageService';
import { FirestoreService } from '../services/firestoreService';
import smartcity from '../assets/images/smartcity.jpg';
import { Link, useNavigate } from 'react-router-dom';
import smart2 from '../assets/images/smart2.jpg';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        designation: '',
        phone: '',
        gender: '',
        avatar: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { email, password, fullName, designation, phone, gender, avatar } = formData;

            // Create user account with Firebase Auth
            const authResult = await AuthService.signUp(email, password, fullName);
            
            if (authResult.error) {
                setError(authResult.error);
                return;
            }

            const userId = authResult.user.uid;
            let avatarUrl = null;

            // Upload avatar to Firebase Storage if provided
            if (avatar) {
                const uploadResult = await StorageService.uploadFile(
                    avatar, 
                    `profiles/${userId}/avatar_${Date.now()}.jpg`,
                    {
                        customMetadata: {
                            userId: userId,
                            type: 'profile-avatar',
                            uploadedAt: new Date().toISOString()
                        }
                    }
                );

                if (uploadResult.error) {
                    console.error('Avatar upload error:', uploadResult.error);
                    // Continue without avatar
                } else {
                    avatarUrl = uploadResult.url;
                }
            }

            // Create user profile in Firestore
            const profileData = {
                id: userId,
                full_name: fullName,
                designation: designation || '',
                phone_number: phone || '',
                gender: gender || '',
                avatar_url: avatarUrl,
                email: email,
                created_at: new Date(),
                updated_at: new Date()
            };

            const profileResult = await FirestoreService.addDocument('profiles', profileData);
            
            if (profileResult.error) {
                console.error('Profile creation error:', profileResult.error);
                // User account was created but profile failed - this is not ideal
                setError('Account created but profile setup failed. Please contact support.');
                return;
            }

            // Success - redirect to dashboard
            navigate('/');

        } catch (error) {
            console.error('Signup error:', error);
            setError('An unexpected error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center md:px-30 md:justify-end overflow-hidden">
            <img
                src={smart2}
                alt="Smart City UET Peshawar"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black opacity-30 z-10" />

            <form onSubmit={handleSubmit} className="relative z-20 bg-white/100 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Create Your Account</h2>

                {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    name="fullName" 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.fullName}
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    name="designation" 
                    type="text" 
                    placeholder="Designation" 
                    value={formData.designation}
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />

                <select 
                    name="gender" 
                    value={formData.gender}
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
                    <div className="relative w-full">
                        <label
                            htmlFor="avatar-upload"
                            className="flex items-center justify-center px-4 py-2 border-myPrimary border border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        >
                            Upload Image
                        </label>
                        <input
                            id="avatar-upload"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>
                    {formData.avatar && (
                        <div className="mt-3">
                            <img
                                src={URL.createObjectURL(formData.avatar)}
                                alt="Selected Avatar"
                                className="w-24 h-24 object-cover rounded-full border shadow-md"
                            />
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Helix size="20" color="white" speed={1} />
                            <span className="ml-2">Creating Account...</span>
                        </div>
                    ) : (
                        'Sign Up'
                    )}
                </button>

                <p className="text-center text-sm mt-2">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
