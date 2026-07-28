"use client";

import React, { useState, useMemo, useEffect } from 'react';
import styles from '../dashboard/dashboard.module.css';
import { useLanguage } from '../../LanguageContext';

export default function OpportunitiesPage() {
  const { language } = useLanguage();
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [applications, setApplications] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('erth_currentUser'));
    if (user) setCurrentUser(user);

    const contracts = JSON.parse(localStorage.getItem('erth_contracts') || '[]');
    // Only show approved contracts that don't have an expert assigned yet
    setOpportunitiesData(contracts.filter(c => c.status === 'approved' && !c.expertId));

    const apps = JSON.parse(localStorage.getItem('erth_applications') || '[]');
    setApplications(apps);
  }, []);

  const [filterType, setFilterType] = useState('all'); // all, remote, onsite
  const [filterCity, setFilterCity] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const t = {
    ar: { 
      title: 'الفرص المتاحة (سوق المعرفة)', 
      all: 'الكل', remote: 'عن بعد', onsite: 'حضوري', apply: 'تقديم على الفرصة',
      searchPlaceholder: 'ابحث عن فرصة، مهارة، أو جهة...',
      noResults: 'لا توجد فرص تطابق بحثك حالياً.',
      filters: {
        city: 'المدينة', duration: 'مدة العقد', type: 'نوع العمل',
        riyadh: 'الرياض', jeddah: 'جدة', dammam: 'الدمام',
        month1: 'شهر واحد', month3: '3 أشهر', year1: 'سنة فأكثر'
      }
    },
    en: { 
      title: 'Available Opportunities (Knowledge Market)', 
      all: 'All', remote: 'Remote', onsite: 'On-site', apply: 'Apply Now',
      searchPlaceholder: 'Search for opportunities, skills, or entities...',
      noResults: 'No opportunities match your search currently.',
      filters: {
        city: 'City', duration: 'Contract Duration', type: 'Work Type',
        riyadh: 'Riyadh', jeddah: 'Jeddah', dammam: 'Dammam',
        month1: '1 Month', month3: '3 Months', year1: '1 Year+'
      }
    }
  }[language];

  const filteredData = useMemo(() => {
    return opportunitiesData.filter(item => {
      const matchSearch = (item.companyName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (item.specialization?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || (item.nature || '').includes(filterType === 'remote' ? 'عن بعد' : 'حضوري');
      const matchCity = filterCity === '' || (item.location || '').includes(filterCity === 'riyadh' ? 'الرياض' : filterCity === 'jeddah' ? 'جدة' : 'الدمام');
      const matchDuration = filterDuration === '' || (item.duration || '').includes(filterDuration === '1m' ? 'شهر' : filterDuration === '3m' ? '3 أشهر' : 'سنة');
      
      return matchSearch && matchType && matchCity && matchDuration;
    });
  }, [searchQuery, filterType, filterCity, filterDuration, opportunitiesData]);

  const handleApply = (contract) => {
    if (!currentUser) return;
    
    const existingApp = applications.find(a => a.contractId === contract.id && a.expertId === currentUser.id);
    if (existingApp) {
      alert(language === 'ar' ? 'لقد قمت بالتقديم على هذه الفرصة مسبقاً.' : 'You have already applied for this opportunity.');
      return;
    }

    const newApp = {
      id: Date.now(),
      contractId: contract.id,
      companyId: contract.companyId,
      expertId: currentUser.id,
      expertName: currentUser.name,
      expertExperience: currentUser.experience || '',
      expertSpecialization: currentUser.specialization || '',
      expertProfilePicture: currentUser.profilePicture || '',
      date: new Date().toISOString(),
      status: 'pending'
    };

    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    localStorage.setItem('erth_applications', JSON.stringify(updatedApps));
    alert(language === 'ar' ? 'تم إرسال طلب التقديم بنجاح!' : 'Application submitted successfully!');
  };

  return (
    <>
      <section className={styles.section}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem'}}>
          <h2 className={styles.sectionTitle} style={{marginBottom: 0}}>{t.title}</h2>
          
          <div style={{display: 'flex', gap: '0.5rem', flex: '1 1 300px'}}>
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #ddd', flex: 1}}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="glass" style={{padding: '1rem', borderRadius: '0.8rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>{t.filters.type}</label>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button className={filterType === 'all' ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilterType('all')}>{t.all}</button>
              <button className={filterType === 'remote' ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilterType('remote')}>{t.remote}</button>
              <button className={filterType === 'onsite' ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilterType('onsite')}>{t.onsite}</button>
            </div>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>{t.filters.city}</label>
            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} style={{padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ddd'}}>
              <option value="">{t.all}</option>
              <option value="riyadh">{t.filters.riyadh}</option>
              <option value="jeddah">{t.filters.jeddah}</option>
              <option value="dammam">{t.filters.dammam}</option>
            </select>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>{t.filters.duration}</label>
            <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)} style={{padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid #ddd'}}>
              <option value="">{t.all}</option>
              <option value="1m">{t.filters.month1}</option>
              <option value="3m">{t.filters.month3}</option>
              <option value="1y">{t.filters.year1}</option>
            </select>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-light)'}}>
            {t.noResults}
          </div>
        ) : (
          <div className={styles.matchGrid}>
            {filteredData.map((item) => {
              const hasApplied = applications.some(a => a.contractId === item.id && a.expertId === currentUser?.id);
              return (
                <div key={item.id} className={`${styles.matchCard} glass`}>
                  <div className={styles.matchHeader}>
                    <h4>{item.companyName} - {item.specialization}</h4>
                  </div>
                  <div className={styles.matchDetails}>
                    <p>الراتب: {item.salary}</p>
                    <p>الخبرة المطلوبة: {item.experience}</p>
                    <p>المدة: {item.duration}</p>
                    <p>نوع التعاقد: {item.nature}</p>
                    <p>الموقع: {item.location}</p>
                  </div>
                  <div className={styles.matchActions}>
                    <button 
                      className={hasApplied ? "btn-secondary" : "btn-primary"} 
                      onClick={() => handleApply(item)}
                      disabled={hasApplied}
                      style={hasApplied ? {opacity: 0.7, cursor: 'not-allowed'} : {}}
                    >
                      {hasApplied ? (language === 'ar' ? 'تم التقديم' : 'Applied') : t.apply}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
