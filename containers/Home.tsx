import type { NextPage } from 'next'
import { useState } from 'react'
import { executeRequest } from '../services/api';
import { AccessTokenProps } from '../types/AccessTokenProps';

const Home: NextPage<AccessTokenProps> = ({ setAccessToken }) => {

    const sair = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('userEmail')
        setAccessToken('');
    }

    return (
        <div>
            <h1>Home</h1>
            <button value="Sair" onClick={sair}/>
        </div>
    )
}

export {Home}