import React, { createContext, useState } from 'react'
import {addUser, validateLogin} from '../utils/db';

export const AuthContext = createContext()

export default function Auth({login, children}) {
    const [user, setUser] = useState();

    function handleLogout(){
        setUser(null)
    }
    function handleLogin(name, password){
        return validateLogin(name, password)
            .then(user=>{
                setUser(user)
                return user
            })
    }
    function handleCreateAccount(name, password){
        return addUser(name, password)
    }

    const authValue = {
        user,
        logout: handleLogout,
        login: handleLogin,
        createAccount: handleCreateAccount,
    }
    return <AuthContext.Provider value={authValue}>
        {user? children : login}
    </AuthContext.Provider>
}
    