"use client"

import Header from '@/app/(app)/Header'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const Dashboard = () => {
   
    const [users, setUsers] = useState([])

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

        axios.delete(`/api/user/destroy/${userId}`, { withCredentials: true })
            .then(response => {
                window.location.reload();
            })
    }
    return (
    <>
        <Header title="Usuários" />
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex p-5 flex flex-col" style={{ height: '75vh' }}>
                <div className='flex w-full '>
                       
                        <Link href="/store" className='ml-auto bg-blue-500 text-white px-4 py-2 w2 h-10 mb-5'>Cadastrar</Link>
                    </div>
                    <div className='flex w-full '>
                        <input type="text" className='border border-gray-300 h-10  p-2 w-full mb-10' placeholder='Pesquisar usuário' />
                    </div>
                    <div className='flex w-full overflow-y-auto scrollbar-transparent'>
                        <table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                <tr>
                                    <th className='border border-gray-300 p-3'>Nome</th>
                                    <th className='border border-gray-300 p-3'>Email</th>
                                    <th className='border border-gray-300 p-3'>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className='border border-gray-300 p-4'>{user.name}</td>
                                        <td className='border border-gray-300 p-4'>{user.email}</td>
                                        <td className='border border-gray-300 p-4'>
                                        <Link href={`/user/${user.id}`} className='bg-blue-400 text-white px-4 py-2'>Editar</Link>                                           
                                        <button onClick={() => handleUserClick(user.id)} className='bg-red-500 text-white px-4 py-2 ml-5'>Excluir</button>                                           
                                        </td>
                                    </tr>                                    
                                ))}
                                 
                            </tbody> 
                        </table>
                    </div>
                </div>
            </div>


        </div>
    </>)
}

export default Dashboard