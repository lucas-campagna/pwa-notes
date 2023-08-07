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
        console.log('handleLogin')
        login(name, password)
        .then(token=>console.log('login successfully done ' + token))
        .catch(error => console.log(error))
    }
    function handleCreateAccount(){
        console.log('handleCreateAccount')
        createAccount(name, password)
        .then(()=>handleCancelCreateAccount())
        .catch(error=>console.log(error));
    }
    function handleCancelCreateAccount(){
        console.log('handleCancelCreateAccount')
        setIsCreatingAccount(false);
        clearInputs();
    }
    function handleGoToCreateAccount(){
        console.log('handleGoToCreateAccount')
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
                        <input type="button" value="Create" disabled={loginDisabled} onClick={handleCreateAccount}/>
                        <input type="button" value="Cancel" onClick={handleCancelCreateAccount}/>
                    </>
                    :
                    <input type="button" value="Login" disabled={loginDisabled} onClick={handleLogin}/>
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
    