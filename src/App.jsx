import React from 'react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1D428A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        fontWeight: 900,
        marginBottom: '16px',
        letterSpacing: '-1px'
      }}>
        <span style={{ color: '#00d4ff' }}>KYNETICS</span> SPORTS
      </h1>
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        opacity: 0.7,
        maxWidth: '500px'
      }}>
        AI-Powered NBA Predictions — Coming Soon
      </p>
      <div style={{
        marginTop: '40px',
        padding: '12px 24px',
        background: 'rgba(0, 212, 255, 0.15)',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#00d4ff'
      }}>
        ✅ Site is live and running
      </div>
    </div>
  )
}

export default App
