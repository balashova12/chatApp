import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ChatWindow.css';

let socket;

export default function ChatWindow({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [chatInfo, setChatInfo] = useState(null);
    const { user } = useAuth();
    const bottomRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        socket = io('http://localhost:5000', { auth: { token } });

        socket.on('new_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (!chatId) return;

        axios.get('/chats').then(res => {
            const chat = res.data.chats.find(c => c.id === chatId);
            setChatInfo(chat);
        });

        axios.get(`/chats/${chatId}/messages`).then(res => {
            setMessages(res.data.messages);
        });

        socket.emit('join_chat', chatId);

        return () => socket.emit('leave_chat', chatId);
    }, [chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getOtherUser = () => {
        if (!chatInfo) return '';
        const other = chatInfo.participants.find(p => p.user.id !== user.id);
        return other?.user?.username || '';
    };

    const sendMessage = () => {
        if (!text.trim()) return;
        socket.emit('send_message', { chatId, content: text.trim() });
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-header-avatar">{getOtherUser()?.[0]?.toUpperCase()}</div>
                <span className="chat-header-name">{getOtherUser()}</span>
            </div>
            <div className="messages">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.senderId === user.id ? 'own' : 'other'}`}
                    >
                        <div className="message-bubble">{msg.content}</div>
                        <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="message-input">
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Написать сообщение..."
                    rows={1}
                />
                <button onClick={sendMessage} disabled={!text.trim()}>
                    ➤
                </button>
            </div>
        </div>
    );
}