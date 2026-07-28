"use client";

import React, { useState } from 'react';
import styles from '../login/login.module.css'; // Reusing login styles
import { useLanguage } from '../LanguageContext';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const { language } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nationalId: '',
    password: '',
    confirmPassword: '',
    type: 'expert',
    experience: '',
    specialization: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const t = {
    ar: { title: 'إنشاء حساب جديد', name: 'الاسم الكامل', email: 'البريد الإلكتروني', nationalId: 'رقم الهوية الوطنية', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور', experience: 'سنوات الخبرة', specialization: 'المجال أو التخصص', submit: 'تسجيل', back: 'لديك حساب؟ تسجيل الدخول', expert: 'خبير متقاعد', company: 'جهة / شركة', passError: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص.', matchError: 'كلمات المرور غير متطابقة.', emailExists: 'البريد الإلكتروني مسجل مسبقاً.' },
    en: { title: 'Create Account', name: 'Full Name', email: 'Email Address', nationalId: 'National ID', password: 'Password', confirmPassword: 'Confirm Password', experience: 'Years of Experience', specialization: 'Field / Specialization', submit: 'Sign Up', back: 'Already have an account? Login', expert: 'Retired Expert', company: 'Organization', passError: 'Password must be at least 8 characters long, uppercase, lowercase, number, and special char.', matchError: 'Passwords do not match.', emailExists: 'Email is already registered.' }
  }[language];

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(t.matchError);
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMsg(t.passError);
      return;
    }

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
    
    const expertsCount = users.filter(u => u.type === 'expert').length;
    const companiesCount = users.filter(u => u.type === 'company').length;

    if (formData.type === 'expert' && expertsCount >= 10) {
      setErrorMsg(language === 'ar' ? 'عذراً، تم الوصول إلى الحد الأقصى المسموح به (10 خبراء).' : 'Sorry, the maximum limit of 10 experts has been reached.');
      return;
    }

    if (formData.type === 'company' && companiesCount >= 10) {
      setErrorMsg(language === 'ar' ? 'عذراً، تم الوصول إلى الحد الأقصى المسموح به (10 شركات).' : 'Sorry, the maximum limit of 10 companies has been reached.');
      return;
    }

    const existingUser = users.find(u => u.email === formData.email);
    if (existingUser) {
      setErrorMsg(t.emailExists);
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData
    };
    delete newUser.password; // Don't save password plainly in a real app, but for this prototype we'll keep it or check later.
    // Actually we need to check password on login, so we store it (prototype only)
    const newUserWithPass = { ...newUser, password: formData.password };
    users.push(newUserWithPass);
    localStorage.setItem('erth_users', JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem('erth_currentUser', JSON.stringify(newUser));

    // Redirect to respective dashboard
    if (formData.type === 'expert') {
      router.push('/expert/dashboard');
    } else {
      router.push('/company/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.loginCard} glass animate-fade-in`} style={{maxWidth: '550px'}}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="إرث | ERTH" style={{ height: '60px' }} />
        </div>
        <h1 className={styles.title}>{t.title}</h1>
        
        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="type" id="type" value="expert" checked={formData.type === 'expert'} onChange={(e) => setFormData({...formData, type: e.target.value})} />
              {t.expert}
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="type" id="type" value="company" checked={formData.type === 'company'} onChange={(e) => setFormData({...formData, type: e.target.value})} />
              {t.company}
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name">{t.name}</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} required className={styles.input} />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="nationalId">{t.nationalId}</label>
            <input type="text" id="nationalId" value={formData.nationalId} onChange={handleChange} required className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">{t.email}</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required className={styles.input} />
          </div>
          
          {formData.type === 'expert' && (
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className={styles.inputGroup} style={{flex: 1}}>
                <label htmlFor="experience">{t.experience}</label>
                <input type="number" id="experience" value={formData.experience} onChange={handleChange} required className={styles.input} min="1" />
              </div>
              <div className={styles.inputGroup} style={{flex: 1}}>
                <label htmlFor="specialization">{t.specialization}</label>
                <input type="text" id="specialization" value={formData.specialization} onChange={handleChange} required className={styles.input} />
              </div>
            </div>
          )}

          {formData.type === 'company' && (
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className={styles.inputGroup} style={{flex: 1}}>
                <label htmlFor="companyField">{language === 'ar' ? 'المجال' : 'Field'}</label>
                <input type="text" id="companyField" value={formData.companyField || ''} onChange={handleChange} required className={styles.input} />
              </div>
              <div className={styles.inputGroup} style={{flex: 1}}>
                <label htmlFor="companyDescription">{language === 'ar' ? 'وصف الشركة' : 'Description'}</label>
                <input type="text" id="companyDescription" value={formData.companyDescription || ''} onChange={handleChange} required className={styles.input} />
              </div>
            </div>
          )}
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className={styles.inputGroup} style={{flex: 1}}>
              <label htmlFor="password">{t.password}</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} required className={styles.input} />
            </div>
            <div className={styles.inputGroup} style={{flex: 1}}>
              <label htmlFor="confirmPassword">{t.confirmPassword}</label>
              <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={styles.input} />
            </div>
          </div>
          
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            {t.submit}
          </button>
        </form>
        
        <div className={styles.backLink}>
          <a href="/login">{t.back}</a>
        </div>
      </div>
    </div>
  );
}
