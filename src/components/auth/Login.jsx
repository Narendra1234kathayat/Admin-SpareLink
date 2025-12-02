import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});   // ✅ validation errors
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")?.replace(/"/g, ''); // ✅ remove quotes

    useEffect(() => {
        if (token && role === "admin") {
            navigate("/admin");
        }
    }, [token, role, navigate]);

    // ✅ Validation function
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Error in the credential", { autoClose: 2500 });
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axiosInstance.post('/api/users/login', { email, password });
            const roleName = response?.data?.data?.roleId?.roleName;

            if (roleName !== 'admin') {
                toast.error("You don't have admin access", { autoClose: 4000 });
                setIsLoading(false);
            } else {
                // ✅ Store authentication data
                localStorage.setItem('token', response.data.authtoken);
                localStorage.setItem('user', JSON.stringify(response.data.data._id));
                localStorage.setItem('role', JSON.stringify(response.data.data.roleId.roleName));

                toast.success('Login successful! Redirecting...', { autoClose: 2000 });

                setTimeout(() => {
                    navigate('/admin');
                }, 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.', { autoClose: 4000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.div 
                className="login-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div 
                    className="login-card"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <motion.div className="login-header">
                        <div className="logo-container">
                            <div className="logo"><span className="logo-text">SL</span></div>
                        </div>
                        <h2 className="login-title">Admin Login</h2>
                        <p className="login-subtitle">Access your Sparelink admin panel</p>
                    </motion.div>

                    <motion.form onSubmit={handleSubmit}>
                       
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <motion.input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`form-input ${errors.email ? "error" : ""}`}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <motion.input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`form-input ${errors.password ? "error" : ""}`}
                                placeholder="Enter your password"
                                required
                            />
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                      
                        <motion.button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="loading-container">
                                    <ClipLoader color="#ffffff" size={20} />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </motion.form>

                    <div className="login-footer">
                        <p className="footer-text">Secure admin access for Sparelink platform</p>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Login;
