import React from 'react'
import { Link } from 'react-router-dom'
import "./footer.css"

export default function Footer() {
  return (
    <div className='footer'>
      <em>“Helping you keep your inbox sparkling clean.”</em>
      <div className='footer-links'>
        <a href="/#hero">Home</a>
        <a href="/get-started">Get Started</a>
        <a href="/#working">How Mail Maid works ?</a>
      </div>
      <div className='blackbar'></div>
    </div>
  )
}
