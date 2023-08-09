import React, { useState, createContext, useEffect, useRef } from 'react'
import styles from '../styles/Alerts.module.css'

export const AlertsContext = createContext();

const getKey = () => Math.floor(Math.random() * 1e20)
const ALERT_TIMEOUT = 5000;

export default function Alerts({children}) {
    const [activeAlerts, setActiveAlerts] = useState([]);
    function pushAlert(message, level=0){
        const newAlertKey = getKey()
        setActiveAlerts([...activeAlerts, {message, level, key: newAlertKey}]);
        setTimeout(()=>{
            setActiveAlerts(activeAlerts.filter(({key})=>key !== newAlertKey))
        },ALERT_TIMEOUT);
    }
    const value = {
        pushAlert
    };
    return (
        <AlertsContext.Provider value={value}>
            {children}
            <div className={styles.root}>
                {activeAlerts.map(({key,...e})=><AlertItem {...e} key={key}/>)}
            </div>
        </AlertsContext.Provider>
    )
}

function AlertItem({message, level}){
    const [isHidden, setIsHidden] = useState(false);
    const levelClass = [styles.blue, styles.yellow, styles.red][level || 0]
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsHidden(true)
        }, ALERT_TIMEOUT-500);
        return () =>{
            clearTimeout(timer);
        }
    },[]);
    return (
        <div className={`${styles.alertItemRoot} ${levelClass} ${isHidden? styles.hidden:''}`}>
            {message}
        </div>
    );
}
