"use client";

import React, { useState, useEffect } from 'react';
import styles from '../dashboard/dashboard.module.css';
import { useLanguage } from '../../LanguageContext';

export default function ContractsPage() {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [myContracts, setMyContracts] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('erth_currentUser'));
    if (user) setCurrentUser(user);

    const contracts = JSON.parse(localStorage.getItem('erth_contracts') || '[]');
    const apps = JSON.parse(localStorage.getItem('erth_applications') || '[]');
    
    if (user) {
      setMyContracts(contracts.filter(c => c.expertId === user.id));
      setMyApplications(apps.filter(a => a.expertId === user.id));
    }
  }, []);

  const t = {
    ar: { 
      title: 'عقودي وطلباتي', 
      status: 'الحالة: ساري', 
      view: 'عرض التفاصيل', hide: 'إخفاء التفاصيل',
      details: {
        role: 'الوصف والمهام', 
        payment: 'الراتب والدفعات',
        manager: 'الجهة / الشركة'
      },
      statusMap: { pending: 'قيد المراجعة', accepted: 'تم القبول (عقد نشط)', rejected: 'مرفوض' },
      appsTitle: 'حالة طلبات التقديم',
      contractsTitle: 'العقود النشطة'
    },
    en: { 
      title: 'My Contracts & Applications', 
      status: 'Status: Active', 
      view: 'View Details', hide: 'Hide Details',
      details: {
        role: 'Role & Responsibilities', 
        payment: 'Salary & Payments',
        manager: 'Company / Entity'
      },
      statusMap: { pending: 'Under Review', accepted: 'Accepted (Active Contract)', rejected: 'Rejected' },
      appsTitle: 'Application Statuses',
      contractsTitle: 'Active Contracts'
    }
  }[language];

  const toggleDetails = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.contractsTitle}</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {myContracts.length === 0 && <p style={{color: 'var(--text-light)'}}>{language === 'ar' ? 'لا توجد عقود نشطة حالياً.' : 'No active contracts currently.'}</p>}
          {myContracts.map((c) => (
            <div key={c.id} className="glass" style={{padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', borderLeft: '4px solid #10b981'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4 style={{fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-blue-dark)'}}>{c.specialization} - {c.companyName}</h4>
                  <p style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>{language === 'ar' ? 'الموقع:' : 'Location:'} {c.location} | {language === 'ar' ? 'المدة:' : 'Duration:'} {c.duration}</p>
                  <p style={{color: '#10b981', fontWeight: 'bold', marginTop: '0.5rem'}}>{t.status}</p>
                </div>
                <div>
                  <button className="btn-secondary" onClick={() => toggleDetails(c.id)}>
                    {expandedId === c.id ? t.hide : t.view}
                  </button>
                </div>
              </div>
              
              {expandedId === c.id && (
                <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <strong style={{color: 'var(--primary-blue)', display: 'block', marginBottom: '0.2rem'}}>{language === 'ar' ? 'الخبير:' : 'Expert:'}</strong>
                      <span style={{color: 'var(--text-light)'}}>{currentUser.name}</span>
                    </div>
                    <div>
                      <strong style={{color: 'var(--primary-blue)', display: 'block', marginBottom: '0.2rem'}}>{language === 'ar' ? 'الجهة / الشركة:' : 'Company:'}</strong>
                      <span style={{color: 'var(--text-light)'}}>{c.companyName}</span>
                    </div>
                    <div>
                      <strong style={{color: 'var(--primary-blue)', display: 'block', marginBottom: '0.2rem'}}>{language === 'ar' ? 'طبيعة العمل:' : 'Nature of Work:'}</strong>
                      <span style={{color: 'var(--text-light)'}}>{c.nature}</span>
                    </div>
                    <div>
                      <strong style={{color: 'var(--primary-blue)', display: 'block', marginBottom: '0.2rem'}}>{language === 'ar' ? 'الراتب:' : 'Salary:'}</strong>
                      <span style={{color: 'var(--text-light)'}}>{c.salary}</span>
                    </div>
                    <div>
                      <strong style={{color: 'var(--primary-blue)', display: 'block', marginBottom: '0.2rem'}}>{language === 'ar' ? 'سنوات الخبرة المطلوبة:' : 'Req. Experience:'}</strong>
                      <span style={{color: 'var(--text-light)'}}>{c.experience}</span>
                    </div>
                    <div>
                      <strong style={{color: 'var(--primary-blue)', display: 'block', marginBottom: '0.2rem'}}>{language === 'ar' ? 'تاريخ البدء:' : 'Start Date:'}</strong>
                      <span style={{color: 'var(--text-light)'}}>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} style={{marginTop: '2rem'}}>
        <h2 className={styles.sectionTitle}>{t.appsTitle}</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {myApplications.length === 0 && <p style={{color: 'var(--text-light)'}}>{language === 'ar' ? 'لم تقم بالتقديم على أي فرصة بعد.' : 'You have not applied to any opportunities yet.'}</p>}
          {myApplications.map(app => (
            <div key={app.id} className="glass" style={{padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${app.status === 'accepted' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f59e0b'}`}}>
              <div>
                <strong>{language === 'ar' ? 'طلب تقديم' : 'Application'}</strong>
                <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.25rem 0 0 0'}}>{new Date(app.date).toLocaleDateString()}</p>
              </div>
              <span style={{fontWeight: 'bold', color: app.status === 'accepted' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f59e0b'}}>
                {t.statusMap[app.status]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
