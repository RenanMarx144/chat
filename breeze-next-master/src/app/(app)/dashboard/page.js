"use client"

import Header from '@/app/(app)/Header'
import { useAuth } from '@/hooks/auth'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'your-pusher-key',
    cluster: 'your-pusher-cluster',
    forceTLS: true,
});


const Dashboard = () => {
    const { user } = useAuth({ 
        middleware: 'auth', 
        redirectIfAuthenticated: '/dashboard'
    })
    const messagesEndRef = useRef(null)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [selectedUserId, setSelectedUserId] = useState()

    const [messageContent, setMessageContent] = useState('')
    const currentUserId = user.id

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (selectedUserId) {
            echo.private(`Process.Menssage.${currentUserId}`)
                .listen('ProcessMenssage', (e) => {
                    if (e.message.to === currentUserId || e.message.from === currentUserId) {
                        setMessages((prevMessages) => [...prevMessages, e.message]);
                    }
                });
        }
    
        return () => {
            echo.leave(`Process.Menssage.${currentUserId}`);
        };
    }, [selectedUserId]);

    useEffect(() => {
        axios.defaults.baseURL = 'http://localhost:8000'
        axios.get('/sanctum/csrf-cookie', { withCredentials: true })
            .then(() => {
                return axios.get('/api/users', { withCredentials: true })
            })
            .then(response => {
                setUsers(response.data)
            })
    }, [])

    const handleUserClick = (userId) => {
        setSelectedUserId(userId)
        axios.get(`/api/message/${userId}`, { withCredentials: true })
            .then(response => {
                setMessages(response.data)
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!selectedUserId || !messageContent.trim()) {
            return
        }

        const messageData = {
            to: selectedUserId,
            from: currentUserId,
            content: messageContent
        }

        axios.post('/api/massages', messageData, { withCredentials: true })
            .then(response => {
                setMessages([...messages, response.data])
                setMessageContent('')
            })
    }

    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex" style={{ height: '75vh' }}>
                        <div className="w-3/12 bg-gray-200 bg-opacity-25 border-r border-gray-200 overflow-y-scroll scrollbar-transparent">
                            <ul>
                                {users.map(user => (
                                    <li
                                        key={user.id}
                                        className={`p-6 text-lg text-gray-600 leading-7 font-semibold border-b border-gray-200 hover:bg-opacity-50 hover:cursor-pointer hover:bg-gray-200 ${selectedUserId === user.id ? 'bg-gray-500 text-white' : ''}`}
                                        onClick={() => handleUserClick(user.id)}
                                    >
                                        <p className='flex items-center'>
                                            {user.name}
                                            <span className='ml-2 w-2 h-2 bg-blue-400 rounded-full'></span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='w-9/12 flex flex-col justify-between'>
                            <div className='w-full p-6 flex flex-col overflow-y-scroll scrollbar-transparent'> 
                                {messages.map((message, index) => (
                                    <div key={index} className={`w-full mb-3 ${message.from === currentUserId ? 'text-right' : 'text-left'}`}>
                                        <p className={`inline-block p-3 rounded-md ${message.from === currentUserId ? ' bg-blue-200' : 'bg-gray-200'}`} style={{ maxWidth: '75%' }}>
                                            {message.content}
                                        </p>
                                        <span className='block mt-1 text-xs text-gray-500 text-opacity-75'>{message.formatted_date}</span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className='w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-200'>
                                <form onSubmit={handleSubmit}>
                                    <div className='flex overflow-hidden border-gray-300'>
                                        <input
                                            type='text'
                                            className='flex-1 px-4 py-2 text-sm focus:outline-none'
                                            disabled={!selectedUserId}
                                            value={messageContent}
                                            onChange={(e) => setMessageContent(e.target.value)}
                                        />
                                        <button
                                            type='submit'
                                            className='bg-indigo-500 px-4 py-2 hover:bg-indigo-600 text-white'
                                            style={{ transition: '.4s all easy' }}
                                            disabled={!selectedUserId || !messageContent.trim()}
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
