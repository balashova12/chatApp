import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user?.username || '');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.avatar || null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', username);
            if (avatar) formData.append('avatar', avatar);

            const res = await axios.patch('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            updateUser(res.data.user);
            setSuccess('Profile updated!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <button className="back-btn" onClick={() => navigate('/chats')}>← Back</button>
                    <h2>Profile Settings</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="avatar-section">
                        <div className="avatar-preview">
                            {preview ? (
                                <img src={preview} alt="avatar" />
                            ) : (
                                <span>{user?.username?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                        <label className="avatar-upload-btn">
                            Change Avatar
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={user?.email} disabled />
                    </div>

                    {error && <p className="profile-error">{error}</p>}
                    {success && <p className="profile-success">{success}</p>}

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
}