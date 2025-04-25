import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import './ChatPage.css';

export default function ChatPage() {
    const { chatId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedChatId, setSelectedChatId] = useState(chatId ? parseInt(chatId) : null);

    useEffect(() => {
        if (chatId) setSelectedChatId(parseInt(chatId));
    }, [chatId]);

    const handleSelectChat = (id) => {
        setSelectedChatId(id);
        navigate(`/chats/${id}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="chat-layout">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-user">
                        <div className="avatar">
                            {user?.avatar
                                ? <img src={user.avatar} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                                : user?.username?.[0]?.toUpperCase()
                            }
                        </div>
                        <span className="username">{user?.username}</span>
                    </div>
                    <div className="sidebar-actions">
                        <button className="icon-btn" title="New Chat" onClick={() => navigate('/users')}>+</button>
                        <button className="icon-btn" title="Profile" onClick={() => navigate('/profile')}>⚙</button>
                        <button className="icon-btn logout-btn" title="Log out" onClick={handleLogout}>←</button>
                    </div>
                </div>
                <ChatList selectedChatId={selectedChatId} onSelectChat={handleSelectChat} />
            </div>
            <div className="chat-main">
                {selectedChatId ? (
                    <ChatWindow chatId={selectedChatId} />
                ) : (
                    <div className="chat-empty">
                        <p>Choose a chat or</p>
                        <button onClick={() => navigate('/users')}>start a new one</button>
                    </div>
                )}
            </div>
        </div>
    );
}