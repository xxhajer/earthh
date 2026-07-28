"use client";

import React from 'react';
import styles from './page.module.css';
import { useLanguage } from './LanguageContext';

import Link from 'next/link';

export default function Home() {
  const { language, toggleLanguage } = useLanguage();

  const content = {
    ar: {
      nav: { about: 'عن إرث', companies: 'الشركات', experts: 'الخبراء', faq: 'الأسئلة الشائعة', contact: 'اتصل بنا', login: 'تسجيل الدخول', signup: 'إنشاء حساب' },
      hero: { title: 'خبرتك "', titleGold: 'إرث', titleEnd: '" ماينقطع', subtitle: 'Your Experience Never Retires', desc: 'منصة وطنية تربط الخبراء المتقاعدين بالجهات الباحثة عن خبرات حقيقية عبر عقود مرنة وموثوقة.', btnLogin: 'تسجيل الدخول', btnSignup: 'إنشاء حساب', btnBrowse: 'تصفح الخبراء' },
      stats: { title: 'إحصائيات إرث', experts: 'خبير مسجل', hours: 'ساعة توجيه مهني', orgs: 'جهة حكومية وخاصة', quote: '"كل رقم هنا هو إرث مستثمر من الخبرة."' },
      how: { title: 'كيف تعمل إرث؟', step1: 'سجل بياناتك', step2: 'الذكاء الاصطناعي يحلل خبرتك', step3: 'استقبل فرص مدفوعة' },
      footer: { privacy: 'الخصوصية', terms: 'الشروط', support: 'الدعم', social: 'التواصل الاجتماعي', rights: 'جميع الحقوق محفوظة © إرث 2026' },
      dashboards: 'لوحات التحكم (للمعاينة)'
    },
    en: {
      nav: { about: 'About ERTH', companies: 'Companies', experts: 'Experts', faq: 'FAQ', contact: 'Contact', login: 'Login', signup: 'Sign Up' },
      hero: { title: 'Your Expertise is a Lasting "', titleGold: 'Legacy', titleEnd: '"', subtitle: 'Your Experience Never Retires', desc: 'A national platform connecting retired professionals with organizations seeking real expertise through secure paid contracts.', btnLogin: 'Login', btnSignup: 'Create Account', btnBrowse: 'Browse Experts' },
      stats: { title: 'ERTH Statistics', experts: 'Registered Experts', hours: 'Professional Mentoring Hours', orgs: 'Government & Private Organizations', quote: '"Every number here is an invested legacy of experience."' },
      how: { title: 'How It Works', step1: 'Register', step2: 'AI Analyzes Experience', step3: 'Receive Paid Opportunities' },
      footer: { privacy: 'Privacy', terms: 'Terms', support: 'Support', social: 'Social Media', rights: 'All Rights Reserved © ERTH 2026' },
      dashboards: 'Dashboards (Preview)'
    }
  };

  const t = content[language];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="إرث | ERTH" style={{ height: '50px' }} />
        </div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>{t.nav.about}</a>
          <a href="#" className={styles.navLink}>{t.nav.companies}</a>
          <a href="#" className={styles.navLink}>{t.nav.experts}</a>
          <Link href="/expert/dashboard" className={styles.navLink} style={{color: 'var(--gold-accent)'}}>{t.dashboards}</Link>
        </div>
        <div className={styles.navActions}>
          <button onClick={toggleLanguage} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
          <Link href="/login" className="btn-secondary" style={{display: 'inline-block'}}>{t.nav.login}</Link>
          <Link href="/signup" className="btn-primary" style={{display: 'inline-block'}}>{t.nav.signup}</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} animate-fade-in`}>
          <h1 className={`${styles.heroTitle} display-heading`}>
            {t.hero.title}<span className={styles.heroTitleGold}>{t.hero.titleGold}</span>{t.hero.titleEnd}
          </h1>
          <h2 className={styles.heroSubtitle}>{t.hero.subtitle}</h2>
          <p className={styles.heroDesc}>{t.hero.desc}</p>
          <div className={styles.heroButtons}>
            <button className="btn-primary">{t.hero.btnSignup}</button>
            <button className="btn-secondary">{t.hero.btnBrowse}</button>
          </div>
        </div>
      </header>

      {/* Statistics Section */}
      <section className={styles.statsSection}>
        <h2 className="display-heading">{t.stats.title}</h2>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass animate-fade-in animate-delay-1`}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNumber}>480+</div>
            <div className={styles.statLabel}>{t.stats.experts}</div>
          </div>
          <div className={`${styles.statCard} glass animate-fade-in animate-delay-2`}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNumber}>120+</div>
            <div className={styles.statLabel}>{t.stats.hours}</div>
          </div>
          <div className={`${styles.statCard} glass animate-fade-in animate-delay-3`}>
            <div className={styles.statIcon}></div>
            <div className={styles.statNumber}>25+</div>
            <div className={styles.statLabel}>{t.stats.orgs}</div>
          </div>
        </div>
        <p className={styles.statQuote}>{t.stats.quote}</p>
      </section>

      {/* How it Works Section */}
      <section className={styles.howItWorks}>
        <h2 className="display-heading">{t.how.title}</h2>
        <div className={styles.stepsGrid}>
          <div className={`${styles.stepCard} glass`}>
            <div className={styles.stepNumber}>1</div>
            <h3>{t.how.step1}</h3>
          </div>
          <div className={`${styles.stepCard} glass`}>
            <div className={styles.stepNumber}>2</div>
            <h3>{t.how.step2}</h3>
          </div>
          <div className={`${styles.stepCard} glass`}>
            <div className={styles.stepNumber}>3</div>
            <h3>{t.how.step3}</h3>
          </div>
        </div>
      </section>

      {/* Login Bottom Center */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-light)' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue-dark)' }}>{language === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}</h2>
        <Link href="/login" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', display: 'inline-block' }}>
          {t.nav.login}
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#">{t.footer.privacy}</a>
          <a href="#">{t.footer.terms}</a>
          <a href="#">{t.footer.support}</a>
          <a href="#">{t.footer.social}</a>
        </div>
        <div className={styles.footerBottom}>
          <p>{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
