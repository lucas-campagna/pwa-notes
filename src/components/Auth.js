import React, { createContext, useState } from 'react'

const AuthContext = createContext()

export default function Auth({login, children}) {
    const [user, setUser] = useState(null);

    function handleLogin(name, password){
        
    }
    function handleCreateAccount(name, password){

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
    