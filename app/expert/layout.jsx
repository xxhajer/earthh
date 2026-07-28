"use client";

import React, { useEffect, useState } from 'react';
import styles from './dashboard/dashboard.module.css';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../LanguageContext';
import Link from 'next/link';

export default function ExpertLayout({ children }) {
  const { language } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('erth_currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  
  const t = {
    ar: {
      sidebar: { home: 'الرئيسية', opportunities: 'الفرص المتاحة', contracts: 'عقودي', messages: 'الرسائل', payments: 'الرواتب', profile: 'الملف الشخصي', logout: 'تسجيل الخروج' },
      header: { welcome1: 'خبرتك ', welcomeGold: 'إرث', welcome2: ' مايننقطع يا ', fallbackRole: 'خبير تقنية معلومات - 30 سنة خبرة' }
    },
    en: {
      sidebar: { home: 'Home', opportunities: 'Opportunities', contracts: 'My Contracts', messages: 'Messages', payments: 'Salaries', profile: 'Profile', logout: 'Logout' },
      header: { welcome1: 'Your experience is an endless ', welcomeGold: 'legacy', welcome2: ', ', fallbackName: 'Dr. Ahmed', fallbackRole: 'IT Expert - 30 Years Experience' }
    }
  }[language];
  
  const displayName = currentUser?.name || '';
  const displayRole = currentUser ? `${currentUser.specialization} - ${currentUser.experience} ${language === 'ar' ? 'سنة خبرة' : 'Years Experience'}` : t.header.fallbackRole;

  // We determine the active path in a real app using usePathname, but for now we'll rely on the dashboard's layout to be consistent.
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar} style={{display: 'flex', flexDirection: 'column'}}>
        <div className={styles.logo}>إرث | ERTH</div>
        <nav className={styles.navMenu} style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Link href="/expert/dashboard" className={`${styles.navItem} ${usePathname() === '/expert/dashboard' ? 'active' : ''}`}>{t.sidebar.home}</Link>
          <Link href="/expert/opportunities" className={`${styles.navItem} ${usePathname() === '/expert/opportunities' ? 'active' : ''}`}>{t.sidebar.opportunities}</Link>
          <Link href="/expert/contracts" className={`${styles.navItem} ${usePathname() === '/expert/contracts' ? 'active' : ''}`}>{t.sidebar.contracts}</Link>
          <Link href="/expert/messages" className={`${styles.navItem} ${usePathname() === '/expert/messages' ? 'active' : ''}`}>{t.sidebar.messages}</Link>
          <Link href="/expert/payments" className={`${styles.navItem} ${usePathname() === '/expert/payments' ? 'active' : ''}`}>{t.sidebar.payments}</Link>
          <Link href="/expert/profile" className={`${styles.navItem} ${usePathname() === '/expert/profile' ? 'active' : ''}`}>{t.sidebar.profile}</Link>
          <Link href="/" style={{marginTop: '4rem', marginBottom: '2rem'}} className={styles.navItem} onClick={() => localStorage.removeItem('erth_currentUser')}>{t.sidebar.logout}</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.welcomeText}>
              {t.header.welcome1}
              <span style={{ color: 'var(--accent-gold)' }}>{t.header.welcomeGold}</span>
              {t.header.welcome2}
              {displayName}
            </h1>
            <p className={styles.roleText}>{displayRole}</p>
          </div>
          {currentUser?.profilePicture ? (
            <img src={currentUser.profilePicture} alt="Profile" className={styles.profileAvatar} style={{objectFit: 'cover', padding: 0, border: 'none'}} />
          ) : (
            <div className={styles.profileAvatar}>{displayName.charAt(0)}</div>
          )}
        </header>

        {/* Dynamic Page Content */}
        {children}
      </main>
    </div>
  );
}
