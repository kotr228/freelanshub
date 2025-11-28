'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { messagesAPI } from '@/lib/api';

const ChatList = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data.data);
    } catch (error) {
      console.error('Помилка завантаження чатів:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    router.push(`/chat/${conversation.project.id}`);
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Повідомлення</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Немає активних чатів</h3>
            <p className="mt-1 text-sm text-gray-500">Почніть проєкт, щоб розпочати спілкування</p>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => {
              const otherUser = conv.project.client_id === user.id
                ? conv.project.freelancer
                : conv.project.client;

              return (
                <div
                  key={conv.project.id}
                  onClick={() => handleSelectConversation(conv)}
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {otherUser?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-base truncate">
                          {otherUser?.name || 'Користувач'}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(conv.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conv.project.title}
                      </p>
                      {conv.lastMessage && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conv.lastMessage.content}
                        </p>
                      )}
                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
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
    </div>
  );
};

export default ChatList;
