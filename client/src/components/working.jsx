import React from 'react';
import "./working.css";
import MailsPNG from "../assets/mails.jpg";

export default function Working() {
    return (
      <div className='working' id="working">
        <h2>How Mail Maid Works ?</h2>
        <p className="intro-text">
          We use advanced AI to analyze and classify your emails so you can easily decide what to delete.
          You stay in control — nothing is removed without your approval, and your data is always safe.
        </p>

        <div className='working-l2'>
            <div className='working-diary-cn'>
              <div className='working-diary'>
                <ul>
                  <li>Step 1. Analyze</li>
                  <li>We scan your inbox using AI to detect clutter and unnecessary emails.</li>
                  <br></br>
                  <li>Step 2. Review</li>
                  <li>We show you grouped emails so you can decide what to keep or delete.</li>
                  <br></br>
                  <li>Step 3. Clean</li>
                  <li>We remove selected emails and securely delete your data after cleanup.</li>
                </ul>
              </div>
            </div>
            <img src={MailsPNG} className='mails-img'></img>
        </div>
      </div>
    )
}
