import React, { useContext, useState } from 'react'
import styles from '../styles/LoginView.module.css'
import {AuthContext} from './Auth'
import {AlertsContext} from './Alerts'

export default function LoginView() {
    const {pushAlert} = useContext(AlertsContext);
    const {login, createAccount} = useContext(AuthContext);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const loginDisabled = name === '' || password === '';

    function handleLogin(){
        login(name, password)
        .then(resp => {
            if(!resp){
                pushAlert("Wrong name or password", 2);
                clearInputs();
            }
        })
    }
    function handleCreateAccount(){
        createAccount(name, password)
        .then(()=>{
            setIsCreatingAccount(false);
            clearInputs();
        })
        .catch((e)=>{
            pushAlert("Username already used " + JSON.stringify(e), 2);
        });
    }
    function handleCancelCreateAccount(){
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
    