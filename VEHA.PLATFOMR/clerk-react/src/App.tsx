import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      backgroundColor: '#0a0a0a', 
      color: '#f5f5f7',
      margin: 0
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          letterSpacing: '-0.025em',
          margin: '0 0 10px 0',
          background: 'linear-gradient(to right, #e8cc76, #c49b3f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Clerk Authentication Demo
        </h1>
        <p style={{ color: '#8e8e93', fontSize: '1.1rem', margin: 0 }}>
          Standalone integration proof-of-concept
        </p>
      </div>

      <header style={{ 
        display: 'flex', 
        gap: '16px', 
        alignItems: 'center', 
        padding: '24px 40px', 
        border: '1px solid #262626', 
        borderRadius: '16px', 
        background: '#121212',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ 
              background: 'linear-gradient(135deg, #e8cc76, #c49b3f)', 
              color: '#0a0a0a', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '12px',
              transition: 'opacity 0.2s'
            }}>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{ 
              background: 'transparent', 
              color: '#f5f5f7', 
              border: '1px solid #404040', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '12px',
              transition: 'background-color 0.2s'
            }}>
              Create Account
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '14px', color: '#e8cc76', fontWeight: 500 }}>
              Authenticated Session Active
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </header>
    </div>
  )
}

export default App
