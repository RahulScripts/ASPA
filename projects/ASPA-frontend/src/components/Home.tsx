import React from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import logo from '../assets/ASPA.png'

const Home: React.FC = () => {
  const navigate = useNavigate() // Hook to navigate programmatically
  const isMobile = window.innerWidth < 768

  const handleGetStarted = () => {
    navigate('/login') // Navigate to the login page when "Get Started" is clicked
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: '#319795',
          color: 'white',
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '800px',
          width: '100%',
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="animated-logo"
          style={{
            width: '150px',
            marginBottom: '1rem',
            animation: 'fadeIn 1s ease-out',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto', // This will center the logo horizontally
          }}
        />
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ASPA Asset Tokenization Platform using Algorand</h1>
        <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Own, Trade, and Invest in Tokenized Assets with Ease and Security.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
          <button
            style={{
              backgroundColor: '#000',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              width: isMobile ? '100%' : 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            onClick={handleGetStarted} // Trigger navigation on click
          >
            Get Started
          </button>
        </div>
      </div>

      {/* The rest of your sections... */}
    </div>
  )
}

export default Home
