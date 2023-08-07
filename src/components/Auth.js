import React, { createContext, useState } from 'react'
import {addUser, validateLogin} from '../utils/db';

export const AuthContext = createContext()

export default function Auth({login, children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    function handleLogin(name, password){
        console.log('Auth.handleLogin')
        return validateLogin(name, password).then(setToken)
    }
    function handleCreateAccount(name, password){
        console.log('Auth.handleCreateAccount')
        return addUser(name, password).then(()=>{
            setUser(name)
        })
    }

    const authValue = {
        user,
        login: handleLogin,
        createAccount: handleCreateAccount,
    }
    return <AuthContext.Provider value={authValue}>
        {user? children : login}
    </AuthContext.Provider>
}
    