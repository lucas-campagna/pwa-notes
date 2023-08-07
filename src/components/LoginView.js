import React, { useContext, useState } from 'react'
import styles from '../styles/LoginView.module.css'
import {AuthContext} from './Auth'

export default function LoginView() {
    const {login, createAccount} = useContext(AuthContext);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const loginDisabled = name === '' || password === '';

    function handleLogin(){
        login(name, password)
        // .catch();
    }
    function handleCreateAccount(){
        createAccount(name, password)
        .catch();
    }
    function handleCancelCreateAccount(){
        setIsCreatingAccount(false);
        clearInputs();
    }
    function handleGoToCreateAccount(){
        setIsCreatingAccount(true);
        clearInputs();
    }
    function clearInputs(){
        setName('');
        setPassword('');
    }
    return (
        <div className={styles.root}>
            <div className={styles.loginBox}>
                <div className={styles.loginBoxFields}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={name} onChange={ev=>setName(ev.target.value)}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={ev=>setPassword(ev.target.value)}/>
                </div>
                <div className={styles.loginBoxActionButtons}>
                {
                    isCreatingAccount?
                    <>
                        <input type="button" value="Logon" disabled={loginDisabled}/>
                        <input type="button" value="Cancel" onClick={handleCancelCreateAccount}/>
                    </>
                    :
                    <input type="button" value="Login" disabled={loginDisabled} onClick={isCreatingAccount?handleCreateAccount():handleLogin()}/>
                }
                </div>
            </div>
            {
                isCreatingAccount?
                <></>
                :
                <div className={styles.logonSpace}>
                    {"Newer? "}
                    <span className={styles.logonButton} onClick={handleGoToCreateAccount}>Create account</span>
                </div>
            }
        </div>
        )
}
    