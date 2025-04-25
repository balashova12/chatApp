import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ChatList.css';

export default function ChatList({ selectedChatId, onSelectChat }) {
    const [chats, setChats] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        axios.get('/chats').then(res => setChats(res.data.chats));
    }, []);

    const getOtherUser = (chat) => {
        const other = chat.participants.find(p => p.user.id !== user.id);
        return other?.user;
    };

    const getLastMessage = (chat) => {
        const msg = chat.messages?.[0];
        if (!msg) return 'No messages yet';
        return msg.content.length > 40 ? msg.content.slice(0, 40) + '...' : msg.content;
    };

    if (chats.length === 0) {
        return <div className="chat-list-empty">No chats. Start a new one!</div>;
    }

    return (
        <div className="chat-list">
            {chats.map(chat => {
                const other = getOtherUser(chat);
                return (
                    <div
                        key={chat.id}
                        className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelectChat(chat.id)}
                    >
                        <div className="chat-item-avatar">
                            {other?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="chat-item-info">
                            <span className="chat-item-name">{other?.username}</span>
                            <span className="chat-item-last">{getLastMessage(chat)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}