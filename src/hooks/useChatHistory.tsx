import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'ai';
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export type TimeFilter = 'all' | '24h' | '5d' | '2w' | '1m';

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const getFilteredHistory = (): ChatHistory[] => {
    if (timeFilter === 'all') return chatHistory;

    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case '24h':
        filterDate.setHours(now.getHours() - 24);
        break;
      case '5d':
        filterDate.setDate(now.getDate() - 5);
        break;
      case '2w':
        filterDate.setDate(now.getDate() - 14);
        break;
      case '1m':
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }

    return chatHistory.filter(chat => chat.timestamp >= filterDate);
  };

  const updateChatHistory = (newHistory: ChatHistory[]) => {
    setChatHistory(newHistory);
  };

  return {
    chatHistory: getFilteredHistory(),
    allChatHistory: chatHistory,
    timeFilter,
    setTimeFilter,
    updateChatHistory
  };
}