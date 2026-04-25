import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './UsersPage.css';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/users').then(res => setUsers(res.data.users));
    }, []);

    const startChat = async (userId) => {
        const res = await axios.post('/chats', { userId });
        navigate(`/chats/${res.data.chat.id}`);
    };

    return (
        <div className="users-page">
            <div className="users-header">
                <button className="back-btn" onClick={() => navigate('/chats')}>← Назад</button>
                <h2>Новый чат</h2>
            </div>
            <div className="users-list">
                {users.map(u => (
                    <div key={u.id} className="user-item" onClick={() => startChat(u.id)}>
                        <div className="user-avatar">{u.username[0].toUpperCase()}</div>
                        <div className="user-info">
                            <span className="user-name">{u.username}</span>
                            <span className="user-email">{u.email}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}