import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function VerifyPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/register');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/auth/verify-email', { email, code });
            login(res.data.token, res.data.user);
            navigate('/chats');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка подтверждения');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Подтвердите email</h1>
                <p className="auth-subtitle">Мы отправили код на {email}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Код подтверждения</label>
                        <input
                            type="text"
                            placeholder="123456"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Проверяем...' : 'Подтвердить'}
                    </button>
                </form>
            </div>
        </div>
    );
}