import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <h1 style={{
        fontSize: '6rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
      }}>
        404
      </h1>
      <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <FiHome /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
