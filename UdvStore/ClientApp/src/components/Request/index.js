import React, { useContext } from 'react'
import { RequestStateContext } from '../../context/RequestStateContext';
import styles from './request.module.css'

export const Request = ({ fullName, requestId, event, description, time, employeeId, isOpen }) => {
    const context = useContext(RequestStateContext);
    const toggle = context.toggleClicked;

    return (
        <div className={styles.request} onClick={toggle}>
            <div>{fullName}</div>
            <div>{time.slice(0,-9)}</div>
        </div>
    )
}