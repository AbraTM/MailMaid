import React from 'react'
import "./get-started.css"
import GmailPNG from "../assets/gmail.png"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function GetStarted() {
    const attemptOAuthLogin = () => {
        window.location.href = `${BACKEND_URL}/api/v1/auth/google`;
    }
    return (
        <div className='get-started-page'>
            <div className='get-started-l1'>
                <div className='get-started-head'>
                    <h2>Let's Get Started.</h2>
                </div>
                <div className='gmail-login'>
                    <h3>Gmail Account</h3>
                    <button className='gmail-btn' onClick={attemptOAuthLogin}>
                        <img src={GmailPNG}></img>
                        Login to your gmail account.
                    </button>
                </div>
            </div>
            <div className='login-step'> 
                <h3>First, login your gamil account.</h3>
                <p>Don't worry, we will delete your data after cleaning up the emails — unless you choose to share it to help us improve our model. </p>
            </div>
        </div>
    )
}
