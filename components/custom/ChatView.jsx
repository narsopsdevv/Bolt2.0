"use client"
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { MessagesContext } from '@/contexts/MessagesContext';
import { UserDetailContext } from '@/contexts/UserDetailContext';
import axios from 'axios';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const [messages, setMessage] = useContext(MessagesContext);
    const [userDetail] = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const UpdateToken = useMutation(api.users.UpdateToken);

    useEffect(() => {
        if (id) {
            GetWorkspaceData();
        }
    }, [id]);

    /**
     * Used to get the workspace data using workspace id 
     */
    const GetWorkspaceData = async () => {
        try {
            const result = await convex.query(api.workspace.GetWorkspaces, {
                workspaceId: id
            });
            setMessage(result?.messages || []);
            console.log(result);
        } catch (error) {
            console.error('Error fetching workspace data:', error);
        }
    }

    const GetAiResponse = async () => {
        try {
            setLoading(true);
            const PROMPT = JSON.stringify(messages);
            const result = await axios.post('/api/ai-chat', {
                prompt: PROMPT
            });
            console.log(result);
            setMessage(prev => [...prev, {
                role: 'ai',
                content: result.data.result
            }]);
        } catch (error) {
            console.error('Error getting AI response:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSendMessage = (newMessage) => {
        setMessage(prev => [...prev, { role: 'user', content: newMessage }]);
    };

    return (
        <>
            <div>ChatView</div>
            <div className="flex flex-col h-full p-4 bg-gray-100">
                <div className="flex-1 overflow-y-auto">
                    {messages && messages.map((msg, index) => (
                        <div key={index} className={`my-2 p-3 rounded-lg ${msg.role === 'ai' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Type your message..."
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const newMessage = e.currentTarget.value.trim();
                                if (newMessage) {
                                    handleSendMessage(newMessage);
                                    e.currentTarget.value = '';
                                    GetAiResponse();
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default ChatView
