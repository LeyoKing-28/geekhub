import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { io } from 'socket.io-client';

export function ChatPage({ initialActive }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(initialActive || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('geekhub_token');
    const s = io('http://localhost:3001', { auth: { token } });
    setSocket(s);

    s.on('new_message', (msg) => {
      if (msg.conversation_id === activeConvo) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => s.disconnect();
  }, [activeConvo]);

  useEffect(() => {
    const fetchConversations = async () => {
      const data = await api.getConversations();
      setConversations(data);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvo) {
      const fetchMessages = async () => {
        const data = await api.getMessages(activeConvo);
        setMessages(data);
      };
      fetchMessages();
    }
  }, [activeConvo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (convo) => {
    setActiveConvo(convo.id);
  };

  const startChat = async (userId) => {
    const convo = await api.createConversation(userId);
    const convoData = await api.getConversations();
    setConversations(convoData);
    const newConvo = convoData.find(c => c.id === convo.id);
    if (newConvo) setActiveConvo(newConvo.id);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activeConvo) return;
    socket.emit('send_message', { conversationId: activeConvo, content: newMessage });
    setNewMessage('');
  };

  const activeConvoData = conversations.find(c => c.id === activeConvo);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Messages</h2>
        {conversations.length === 0 && (
          <p style={styles.empty}>No conversations yet. Start chatting from Discover!</p>
        )}
        {conversations.map(convo => (
          <div
            key={convo.id}
            style={{ ...styles.convoItem, ...(activeConvo === convo.id ? styles.convoActive : {}) }}
            onClick={() => openConversation(convo)}
          >
            <img src={convo.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${convo.username}`} alt="" style={styles.convoAvatar} />
            <div style={styles.convoInfo}>
              <span style={styles.convoName}>{convo.display_name || convo.username}</span>
              <span style={styles.convoLast}>{convo.last_message || 'Start chatting...'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chatArea}>
        {activeConvo ? (
          <>
            <div style={styles.chatHeader}>
              <img src={activeConvoData?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeConvoData?.username}`} alt="" style={styles.chatAvatar} />
              <span style={styles.chatName}>{activeConvoData?.display_name || activeConvoData?.username}</span>
            </div>
            <div style={styles.messages}>
              {messages.map(msg => (
                <div key={msg.id} style={{ ...styles.message, ...(msg.sender_id === user.id ? styles.myMessage : {}) }}>
                  <span style={styles.messageText}>{msg.content}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form style={styles.inputRow} onSubmit={sendMessage}>
              <input
                style={styles.messageInput}
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <button style={styles.sendBtn} type="submit">Send</button>
            </form>
          </>
        ) : (
          <div style={styles.noChat}>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: 'calc(100vh - 54px)', maxWidth: '900px', margin: '0 auto' },
  sidebar: { width: '300px', overflowY: 'auto', background: '#1e293b' },
  sidebarTitle: { color: '#fff', fontSize: '1rem', fontWeight: 700, padding: '16px', margin: 0 },
  empty: { color: '#64748b', fontSize: '0.85rem', padding: '16px' },
  convoItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer' },
  convoActive: { background: 'rgba(255, 69, 0, 0.1)' },
  convoAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
  convoInfo: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  convoName: { color: '#fff', fontSize: '0.9rem', fontWeight: 600 },
  convoLast: { color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a' },
  chatHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#1e293b' },
  chatAvatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' },
  chatName: { color: '#fff', fontWeight: 700, fontSize: '0.95rem' },
  messages: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  message: { maxWidth: '70%', padding: '10px 14px', borderRadius: '16px', background: '#334155', color: '#fff', fontSize: '0.9rem' },
  myMessage: { alignSelf: 'flex-end', background: '#ff4500' },
  messageText: { wordBreak: 'break-word' },
  inputRow: { display: 'flex', gap: '8px', padding: '12px 16px', background: '#1e293b' },
  messageInput: { flex: 1, padding: '10px 14px', borderRadius: '20px', border: 'none', outline: 'none', background: '#0f172a', color: '#fff', fontSize: '0.9rem' },
  sendBtn: { padding: '10px 20px', borderRadius: '20px', border: 'none', background: '#ff4500', color: '#fff', fontWeight: 600, cursor: 'pointer' },
  noChat: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }
};
