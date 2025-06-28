// app/test-email.js 
'use client';
import { useState } from 'react';

export default function EmailTest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail: email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        success: false, 
        error: 'Network error: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Email Configuration Test</h1>
      
      <form onSubmit={testEmail} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Your Email Address:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your-email@example.com"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Sending Test Email...' : '📧 Send Test Email'}
        </button>
      </form>

      {result && (
        <div style={{
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: result.success ? '#f0f9ff' : '#fef2f2',
          border: result.success ? '1px solid #3b82f6' : '1px solid #ef4444'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: result.success ? '#1e40af' : '#dc2626' 
          }}>
            {result.success ? '✅ Success!' : '❌ Error'}
          </h3>
          
          {result.success ? (
            <div>
              <p><strong>Message:</strong> {result.message}</p>
              <p><strong>Message ID:</strong> {result.messageId}</p>
              <p><strong>Port Used:</strong> {result.port}</p>
              {result.response && <p><strong>Server Response:</strong> {result.response}</p>}
              <div style={{ 
                backgroundColor: '#dcfce7', 
                padding: '10px', 
                borderRadius: '4px', 
                marginTop: '10px',
                border: '1px solid #16a34a'
              }}>
                <p style={{ margin: 0, color: '#166534' }}>
                  📬 Check your email inbox (and spam folder) for the test message!
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {result.error}</p>
              {result.details && (
                <div style={{ marginTop: '10px' }}>
                  <p><strong>Details:</strong></p>
                  <pre style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '10px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px'
                  }}>
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>🔍 What this test does:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Tests both port 587 and 2525</li>
          <li>Verifies SMTP server connection</li>
          <li>Sends a real test email</li>
          <li>Shows detailed error information if something fails</li>
        </ul>
      </div>
    </div>
  );
}