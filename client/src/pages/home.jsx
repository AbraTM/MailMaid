import React from 'react'
import Hero from '../components/Hero'
import Working from '../components/working'
import Footer from "../components/footer"
import "./home.css"

export default function Home() {
  return (
    <div className='home'>
        <Hero />
        <Working />
    </div>
  )
}
