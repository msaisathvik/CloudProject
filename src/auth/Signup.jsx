import { useState } from 'react';
import { Supabase } from '../../Supabase';
import smartcity from '../assets/images/smartcity.jpg';
import { Link, useNavigate } from 'react-router';
import smart2 from '../assets/images/smart2.jpg';

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

        const { email, password, fullName, designation, phone, gender, avatar } = formData;

        // const { data, error } = await Supabase.auth.signUp({ email, password });
        // if (error) return alert(`Signup error: ${error.message}`);

        // const userId = data.user.id; // ✅ Actual Supabase UID
        const userId = '1234567890'; // Mocked user ID for testing

        if (avatar) {
            const { error: uploadError } = await Supabase.storage
                .from('profile')
                .upload(`public/${userId}`, avatar);

            if (uploadError) {
                console.error(uploadError);
                return;
            }

            const { data: publicData } = Supabase
                .storage
                .from('profile')
                .getPublicUrl(`public/${userId}`);

            console.log(publicData.publicUrl);

            // await Supabase.from('profiles').insert({
            //     id: userId,
            //     full_name: fullName,
            //     designation,
            //     phone_number: phone,
            //     gender,
            //     avatar_url: publicData.publicUrl,
            // });

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

                <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input name="fullName" type="text" placeholder="Full Name" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input name="designation" type="text" placeholder="Designation" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input name="phone" type="tel" placeholder="Phone Number" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />

                <select name="gender" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
                    <div className="relative w-full">
                        <label
                            htmlFor="avatar-upload"
                            className="flex items-center justify-center px-4 py-2 border-myPrimary border border-dashed rounded-lg cursor-pointer hover: transition"
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


                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-blue-700 transition">
                    Sign Up
                </button>

                <p className="text-center text-sm mt-2">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
