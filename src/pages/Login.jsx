import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';


const EmailIcon = () => (
  <svg
    className="input-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16v16H4z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PasswordIcon = () => (
  <svg
    className="input-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const InfoIcon = () => (
  <svg
    className="info-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="8" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

  

    try {
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1',
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          throw new Error('Неверный email или пароль');
        }
        throw new Error('Ошибка сервера');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setLoading(false);
      navigate('/weather');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const toggleTheme = () => setDarkTheme(prev => !prev);

  return (
    <div className={`login-container ${darkTheme ? 'dark' : 'light'}`}>
      <div className="theme-switch-wrapper">
       <label className="theme-switch" htmlFor="theme-checkbox">
  <input
    type="checkbox"
    id="theme-checkbox"
    checked={darkTheme}
    onChange={toggleTheme}
  />
  <span className="slider">
    <span className="icon-sun" aria-hidden="true">🌞</span>
    <span className="icon-moon" aria-hidden="true">🌙</span>
    <span className="slider-button"></span>
  </span>
</label>


        <span className="theme-label">{darkTheme ? 'Тёмная тема' : 'Светлая тема'}</span>
      </div>

      <h2 className="login-title">Вход</h2>
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>
            Email
            <div className="input-wrapper">
              <EmailIcon />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Введите email"
                required
                autoComplete="username"
              />
            </div>
          </label>
        </div>

        <div className="form-group">
          <label>
            Пароль
            <div className="input-wrapper">
              <PasswordIcon />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                autoComplete="current-password"
              />
            </div>
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="login-hint">
        <InfoIcon />
        Для теста можно использовать:<br />
        <b>email:</b> eve.holt@reqres.in<br />
        <b>пароль:</b> cityslicka
      </p>
    </div>
  );
};

export default Login;
