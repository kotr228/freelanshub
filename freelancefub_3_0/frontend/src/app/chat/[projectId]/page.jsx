'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { messagesAPI } from '@/lib/api';
import { io } from 'socket.io-client';

// Socket.io потребує базову URL без /api
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Chat = () => {
  const params = useParams();
  const projectId = params.projectId;
  const { user } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Авто-скрол до останнього повідомлення
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Підключення до Socket.io
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Підключено до Socket.io');
    });

    socketRef.current.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('user_typing', ({ userName }) => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    socketRef.current.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Завантаження списку чатів
  useEffect(() => {
    fetchConversations();
  }, []);

  // Завантаження повідомлень при зміні проєкту
  useEffect(() => {
    if (projectId) {
      fetchMessages(projectId);
      socketRef.current?.emit('join_project', projectId);
    }
  }, [projectId]);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data.data);

      // Якщо є projectId в URL, знайти цей проєкт
      if (projectId) {
        const project = response.data.data.find(c => c.project.id === parseInt(projectId));
        setSelectedProject(project?.project);
      }
    } catch (error) {
      console.error('Помилка завантаження чатів:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (projId) => {
    try {
      const response = await messagesAPI.getMessages(projId);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Помилка завантаження повідомлень:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedProject(conversation.project);
    router.push(`/chat/${conversation.project.id}`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProject) return;

    const receiverId = selectedProject.client_id === user.id
      ? selectedProject.freelancer_id
      : selectedProject.client_id;

    try {
      socketRef.current?.emit('send_message', {
        projectId: selectedProject.id,
        receiverId,
        content: newMessage
      });

      setNewMessage('');
      socketRef.current?.emit('stop_typing', { projectId: selectedProject.id });
    } catch (error) {
      console.error('Помилка відправки:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!selectedProject) return;

    socketRef.current?.emit('typing', {
      projectId: selectedProject.id,
      userName: user.name
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { projectId: selectedProject.id });
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Завантаження...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 150px)' }}>
        <div className="flex h-full">
          {/* Список чатів */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Повідомлення</h2>
            </div>

            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Немає активних чатів
              </div>
            ) : (
              <div>
                {conversations.map((conv) => {
                  const otherUser = conv.project.client_id === user.id
                    ? conv.project.freelancer
                    : conv.project.client;

                  const isSelected = selectedProject?.id === conv.project.id;

                  return (
                    <div
                      key={conv.project.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {otherUser?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm truncate">
                              {otherUser?.name || 'Користувач'}
                            </h3>
                            {conv.lastMessage && (
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDate(conv.lastMessage.created_at)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {conv.project.title}
                          </p>
                          {conv.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage.content}
                            </p>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Вікно чату */}
          <div className="flex-1 flex flex-col">
            {selectedProject ? (
              <>
                {/* Заголовок */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold">{selectedProject.title}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProject.client_id === user.id
                      ? selectedProject.freelancer?.name
                      : selectedProject.client?.name}
                  </p>
                </div>

                {/* Повідомлення */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMine
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            isMine ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 px-4 py-2 rounded-lg">
                        <span className="text-sm text-gray-600">Друкує...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Форма відправки */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Напишіть повідомлення..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Відправити
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Оберіть чат</h3>
                  <p className="mt-1 text-sm text-gray-500">Виберіть розмову зі списку ліворуч</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
