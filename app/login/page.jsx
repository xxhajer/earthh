"use client";

import React, { useState } from 'react';
import styles from './login.module.css';
import { useLanguage } from '../LanguageContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { language } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = {
    ar: { title: 'تسجيل الدخول', email: 'البريد الإلكتروني', password: 'كلمة المرور', submit: 'دخول', errorMsg: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', forgot: 'نسيت كلمة المرور؟', back: 'العودة للرئيسية' },
    en: { title: 'Login', email: 'Email Address', password: 'Password', submit: 'Sign In', errorMsg: 'Incorrect email or password.', forgot: 'Forgot Password?', back: 'Back to Home' }
  }[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for hardcoded admin credentials
    if (email === '445201182@student.ksu.edu.sa' && password === 'Hajerrr1@') {
      const adminUser = {
        id: 'admin-1',
        type: 'admin',
        email: '445201182@student.ksu.edu.sa',
        name: 'National Center Admin'
      };
      localStorage.setItem('erth_currentUser', JSON.stringify(adminUser));
      router.push('/admin/dashboard');
      return;
    }

    const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    
    console.log('[DEBUG] Login Attempt - Input Email:', normalizedEmail);
    
    const userByEmail = users.find(u => (u.email || '').trim().toLowerCase() === normalizedEmail);
    if (userByEmail) {
      console.log('[DEBUG] DB Password:', userByEmail.password, 'Match?', userByEmail.password === normalizedPassword);
    }

    let user = users.find(u => 
      (u.email || '').trim().toLowerCase() === normalizedEmail && 
      (u.password || '').trim() === normalizedPassword
    );
    
    // Auto-recovery for accounts that lost their password due to previous dashboard bug
    if (!user) {
      const corruptedUser = users.find(u => (u.email || '').trim().toLowerCase() === normalizedEmail && !u.password);
      if (corruptedUser) {
        corruptedUser.password = password; // Restore the password they typed
        localStorage.setItem('erth_users', JSON.stringify(users));
        user = corruptedUser;
        console.log('[DEBUG] Auto-recovered password for user:', user.email);
      }
    }

    console.log('[DEBUG] Found exact user match?', user ? 'Yes' : 'No');
    
    if (user) {
      if (user.isBlocked) {
        console.log('[DEBUG] User is blocked.');
        setError(language === 'ar' ? 'تم حظر حسابك من قبل الإدارة.' : 'Your account has been blocked by the admin.');
        return;
      }
      
      // Create user without password to store in session/current user
      const { password, confirmPassword, ...safeUser } = user;
      console.log('[DEBUG] Creating Session for Safe User:', safeUser);
      localStorage.setItem('erth_currentUser', JSON.stringify(safeUser));
      
      console.log('[DEBUG] User Type is:', user.type);
      if (user.type === 'expert') {
        console.log('[DEBUG] Routing to Expert Dashboard');
        router.push('/expert/dashboard');
      } else {
        console.log('[DEBUG] Routing to Company Dashboard');
        router.push('/company/dashboard');
      }
    } else {
      console.log('[DEBUG] Login Failed: Incorrect email or password');
      setError(t.errorMsg);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.loginCard} glass animate-fade-in`}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="إرث | ERTH" style={{ height: '60px' }} />
        </div>
        <h1 className={styles.title}>{t.title}</h1>
        
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">{t.email}</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">{t.password}</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className={styles.input}
            />
          </div>
          
          <div className={styles.forgotPassword}>
            <a href="#">{t.forgot}</a>
          </div>
          
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            {t.submit}
          </button>
        </form>
        
        <div className={styles.backLink}>
          <a href="/">{t.back}</a>
        </div>
      </div>
    </div>
  );
}
