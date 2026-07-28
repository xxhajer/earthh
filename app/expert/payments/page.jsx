"use client";

import React from 'react';
import styles from '../dashboard/dashboard.module.css';
import { useLanguage } from '../../LanguageContext';

export default function PaymentsPage() {
  const { language } = useLanguage();

  const t = {
    ar: { title: 'المحفظة والمدفوعات', balance: 'الرصيد المتاح', withdraw: 'سحب الرصيد', history: 'سجل العمليات', amount: 'المبلغ', date: 'التاريخ', status: 'الحالة', completed: 'مكتمل' },
    en: { title: 'Wallet & Payments', balance: 'Available Balance', withdraw: 'Withdraw Funds', history: 'Transaction History', amount: 'Amount', date: 'Date', status: 'Status', completed: 'Completed' }
  }[language];

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.title}</h2>
        <div className="glass" style={{padding: '2rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary-teal), var(--primary-blue))', color: '#fff'}}>
          <div>
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem', opacity: 0.9}}>{t.balance}</p>
            <h1 style={{fontSize: '3rem'}}>45,000 <span style={{fontSize: '1.5rem'}}>SAR</span></h1>
          </div>
          <button className="btn-secondary" onClick={() => alert('تم تقديم طلب سحب الرصيد بنجاح')} style={{color: 'var(--text-dark)'}}>{t.withdraw}</button>
        </div>

        <h3 style={{marginBottom: '1rem'}}>{t.history}</h3>
        <div className="glass" style={{padding: '1rem', borderRadius: '1rem'}}>
          <table style={{width: '100%', textAlign: language === 'ar' ? 'right' : 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--light-gray)'}}>
                <th style={{padding: '1rem'}}>{t.date}</th>
                <th style={{padding: '1rem'}}>{t.amount}</th>
                <th style={{padding: '1rem'}}>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} style={{borderBottom: '1px solid var(--light-gray)'}}>
                  <td style={{padding: '1rem'}}>2026-06-1{item}</td>
                  <td style={{padding: '1rem', fontWeight: 'bold'}}>15,000 SAR</td>
                  <td style={{padding: '1rem', color: '#10b981'}}>{t.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
