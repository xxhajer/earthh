"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../expert/dashboard/dashboard.module.css'; // Reusing layout styles
import { useLanguage } from '../../LanguageContext';

export default function CompanyDashboard() {
  const { language, setLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [experts, setExperts] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [daysLeft, setDaysLeft] = useState(0);
  const [chats, setChats] = useState([]);
  const [applications, setApplications] = useState([]);

  // Form states
  const [contractForm, setContractForm] = useState({
    experience: '', duration: '', nature: '', salary: '', specialization: '', location: ''
  });

  const [profileForm, setProfileForm] = useState({ name: '', companyField: '', companyDescription: '', logo: '' });
  const [ticketText, setTicketText] = useState('');
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('erth_currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setIsSubscribed(!!parsedUser.isSubscribed);
      setProfileForm({
        name: parsedUser.name || '',
        companyField: parsedUser.companyField || '',
        companyDescription: parsedUser.companyDescription || '',
        logo: parsedUser.logo || ''
      });

      if (parsedUser.subscriptionDate) {
        const subDate = new Date(parsedUser.subscriptionDate);
        const expiryDate = new Date(subDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const diffTime = Math.max(0, expiryDate - new Date());
        setDaysLeft(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }
    }
    const storedUsers = JSON.parse(localStorage.getItem('erth_users') || '[]');
    setExperts(storedUsers.filter(u => u.type === 'expert'));

    const storedContracts = JSON.parse(localStorage.getItem('erth_contracts') || '[]');
    setContracts(storedContracts);

    const storedChats = JSON.parse(localStorage.getItem('erth_chats') || '[]');
    setChats(storedChats);

    const storedApps = JSON.parse(localStorage.getItem('erth_applications') || '[]');
    setApplications(storedApps);
  }, []);

  const t = {
    ar: { 
      sidebar: { home: 'الرئيسية', create: 'إنشاء عقد', search: 'البحث عن خبراء', salaries: 'الرواتب', profile: 'ملف الشركة', logout: 'تسجيل الخروج' },
      welcome: 'مرحباً، ',
      actions: { title: 'إجراءات سريعة', create: 'إنشاء عقد جديد' },
      subscription: { title: 'الاشتراك الحالي', plan: 'الباقة الشهرية', price: isSubscribed ? 'نشط (تم الدفع)' : 'غير نشط', upgrade: isSubscribed ? 'باقة مفعلة' : 'ترقية الباقة (دفع)', expires: 'تاريخ الانتهاء', daysLeft: 'يوماً متبقياً' },
      contracts: { title: 'العقود الخاصة بك', pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض', reqExperience: 'الخبرة المطلوبة', duration: 'المدة' },
      search: { title: 'البحث عن خبراء', noResults: 'لا يوجد خبراء', sendMsg: 'إرسال رسالة', viewProfile: 'عرض الملف', typeMsg: 'اكتب رسالتك هنا...', downloadCv: 'تحميل السيرة الذاتية', noCv: 'لم يقم الخبير برفع سيرة ذاتية بعد' },
      createForm: { title: 'إنشاء عقد جديد', exp: 'سنوات الخبرة', dur: 'المدة', nat: 'طبيعة العمل', sal: 'الراتب', spec: 'المجال / التخصص', loc: 'مكان العمل', submit: 'إرسال العقد للإدارة', subReq: 'يجب الاشتراك في الباقة قبل التمكن من إنشاء العقود.', limitReached: 'لقد وصلت للحد الأقصى المسموح به (100 عقد).' },
      salaries: { title: 'قسم الرواتب', paid: 'مدفوعة', upcoming: 'مجدولة الدفع قريباً', unassigned: 'لم يتم اختيار خبير', empty: 'لا توجد بيانات متاحة حالياً.' },
      profile: { title: 'ملف الشركة', name: 'اسم الشركة', field: 'المجال', desc: 'الوصف', logo: 'شعار الشركة', save: 'حفظ التغييرات', ticket: 'رفع بلاغ / شكوى', sendTicket: 'إرسال البلاغ للإدارة', lang: 'تغيير اللغة' }
    },
    en: { 
      sidebar: { home: 'Home', create: 'Create Contract', search: 'Search Experts', salaries: 'Salaries', profile: 'Company Profile', logout: 'Logout' },
      welcome: 'Welcome, ',
      actions: { title: 'Quick Actions', create: 'Create New Contract' },
      subscription: { title: 'Current Subscription', plan: 'Monthly Plan', price: isSubscribed ? 'Active' : 'Inactive', upgrade: isSubscribed ? 'Activated' : 'Upgrade Plan (Pay)', expires: 'Expires in', daysLeft: 'days' },
      contracts: { title: 'Your Contracts', pending: 'Pending', approved: 'Approved', rejected: 'Rejected', reqExperience: 'Experience Required', duration: 'Duration' },
      search: { title: 'Search Experts', noResults: 'No experts found', sendMsg: 'Send Message', viewProfile: 'View Profile', typeMsg: 'Type your message...', downloadCv: 'Download CV', noCv: 'Expert has not uploaded a CV yet' },
      createForm: { title: 'Create New Contract', exp: 'Years of Experience', dur: 'Duration', nat: 'Nature of Work', sal: 'Salary', spec: 'Specialization', loc: 'Location', submit: 'Submit to Admin', subReq: 'You must subscribe to a plan before creating contracts.', limitReached: 'You have reached the maximum limit (100 contracts).' },
      salaries: { title: 'Salaries Section', paid: 'Paid', upcoming: 'Upcoming Payments', unassigned: 'Unassigned Expert', empty: 'No data available currently.' },
      profile: { title: 'Company Profile', name: 'Company Name', field: 'Field', desc: 'Description', logo: 'Company Logo', save: 'Save Changes', ticket: 'Raise a Ticket / Complaint', sendTicket: 'Send Ticket to Admin', lang: 'Change Language' }
    }
  }[language];

  const handleSubscribe = () => {
    if (isSubscribed) return;
    alert('Simulating Apple Pay... Payment Successful!');
    setIsSubscribed(true);
    const subDate = new Date().toISOString();
    const updatedUser = { ...currentUser, isSubscribed: true, subscriptionDate: subDate };
    setCurrentUser(updatedUser);
    localStorage.setItem('erth_currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
    const updatedUsers = users.map(u => u.email === updatedUser.email ? { ...u, ...updatedUser } : u);
    localStorage.setItem('erth_users', JSON.stringify(updatedUsers));
    setDaysLeft(30);
  };

  const myContracts = contracts.filter(c => c.companyId === currentUser?.id);

  const handleCreateContract = (e) => {
    e.preventDefault();
    if (!isSubscribed) {
      alert(t.createForm.subReq);
      return;
    }
    if (myContracts.length >= 100) {
      alert(t.createForm.limitReached);
      return;
    }
    const newContract = {
      id: Date.now(),
      companyId: currentUser.id,
      companyName: currentUser.name,
      companyLogo: currentUser.logo, // Saved with contract
      ...contractForm,
      status: 'pending' // pending, approved, rejected
    };
    
    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    localStorage.setItem('erth_contracts', JSON.stringify(updatedContracts));
    alert('تم رفع العقد للإدارة بنجاح!');
    setContractForm({ experience: '', duration: '', nature: '', salary: '', specialization: '', location: '' });
    setActiveTab('home');
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...currentUser, ...profileForm };
    setCurrentUser(updatedUser);
    localStorage.setItem('erth_currentUser', JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
    const updatedUsers = users.map(u => u.email === updatedUser.email ? { ...u, ...updatedUser } : u);
    localStorage.setItem('erth_users', JSON.stringify(updatedUsers));
    alert('تم حفظ الملف الشخصي.');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendTicket = (e) => {
    e.preventDefault();
    const newTicket = { id: Date.now(), companyId: currentUser.id, companyName: currentUser.name, text: ticketText, status: 'open', date: new Date().toISOString() };
    const tickets = JSON.parse(localStorage.getItem('erth_reports') || '[]');
    tickets.push(newTicket);
    localStorage.setItem('erth_reports', JSON.stringify(tickets));
    alert('تم إرسال البلاغ للإدارة.');
    setTicketText('');
  };

  const handleSendMessage = (expertId) => {
    if (!messageText.trim()) return;
    const newChat = { id: Date.now(), from: currentUser.id, fromName: currentUser.name, to: expertId, message: messageText, date: new Date().toISOString(), companyLogo: currentUser.logo };
    const chats = JSON.parse(localStorage.getItem('erth_chats') || '[]');
    chats.push(newChat);
    localStorage.setItem('erth_chats', JSON.stringify(chats));
    alert('تم إرسال الرسالة إلى الخبير!');
    setMessageText('');
  };

  const handleAcceptExpert = (app, contractId) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من قبول هذا الخبير؟ سيتم توقيع العقد معه مباشرة.' : 'Are you sure you want to accept this expert?')) return;
    
    const updatedContracts = contracts.map(c => {
      if (c.id === contractId) {
        return { ...c, expertId: app.expertId, expertName: app.expertName, contractStatus: 'active' };
      }
      return c;
    });
    setContracts(updatedContracts);
    localStorage.setItem('erth_contracts', JSON.stringify(updatedContracts));

    const updatedApps = applications.map(a => {
      if (a.id === app.id) return { ...a, status: 'accepted' };
      if (a.contractId === contractId && a.status === 'pending') return { ...a, status: 'rejected' };
      return a;
    });
    setApplications(updatedApps);
    localStorage.setItem('erth_applications', JSON.stringify(updatedApps));
    alert(language === 'ar' ? 'تم قبول الخبير وتنشيط العقد بنجاح!' : 'Expert accepted and contract activated!');
  };

  const handleRejectExpert = (appId) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من رفض هذا الطلب؟' : 'Are you sure you want to reject this application?')) return;
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'rejected' } : a);
    setApplications(updatedApps);
    localStorage.setItem('erth_applications', JSON.stringify(updatedApps));
  };

  const filteredExperts = useMemo(() => {
    return experts.filter(item => {
      const q = searchQuery.toLowerCase();
      return (item.name?.toLowerCase() || '').includes(q) || (item.specialization?.toLowerCase() || '').includes(q);
    });
  }, [experts, searchQuery]);

  if (!currentUser) return null;

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar} style={{display: 'flex', flexDirection: 'column'}}>
        <div className={styles.logo}>إرث | ERTH</div>
        <nav className={styles.navMenu} style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <a href="#" className={activeTab === 'home' ? styles.active : ''} onClick={(e) => {e.preventDefault(); setActiveTab('home');}}>{t.sidebar.home}</a>
          <a href="#" className={activeTab === 'create' ? styles.active : ''} onClick={(e) => {e.preventDefault(); setActiveTab('create');}}>{t.sidebar.create}</a>
          <a href="#" className={activeTab === 'search' ? styles.active : ''} onClick={(e) => {e.preventDefault(); setActiveTab('search');}}>{t.sidebar.search}</a>
          <a href="#" className={activeTab === 'salaries' ? styles.active : ''} onClick={(e) => {e.preventDefault(); setActiveTab('salaries');}}>{t.sidebar.salaries}</a>
          <a href="#" className={activeTab === 'profile' ? styles.active : ''} onClick={(e) => {e.preventDefault(); setActiveTab('profile');}}>{t.sidebar.profile}</a>
          <a href="/" style={{marginTop: 'auto', color: 'var(--accent-red)'}} onClick={() => localStorage.removeItem('erth_currentUser')}>{t.sidebar.logout}</a>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          {currentUser.logo && <img src={currentUser.logo} alt="Logo" style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover'}} />}
          <h1 className="display-heading" style={{color: 'var(--primary-blue)', fontSize: '2rem'}}>
            {t.welcome}{currentUser.name}
          </h1>
        </header>

        {activeTab === 'home' && (
          <>
            <section className={styles.statsGrid} style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
              <div className={`${styles.statCard} glass`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h3>{t.actions.title}</h3>
                  <p>ابدأ رحلة البحث عن خبير</p>
                </div>
                <button className="btn-primary" onClick={() => setActiveTab('create')}>{t.actions.create}</button>
              </div>

              <div className={`${styles.statCard} glass`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h3 style={{color: 'var(--gold-accent)'}}>{t.subscription.plan}</h3>
                  {isSubscribed ? (
                    <p style={{color: '#10b981', fontWeight: 'bold'}}>{daysLeft} {t.subscription.daysLeft}</p>
                  ) : (
                    <p>{t.subscription.price}</p>
                  )}
                </div>
                <button className={isSubscribed ? "btn-secondary" : "btn-primary"} onClick={handleSubscribe} disabled={isSubscribed}>
                  {t.subscription.upgrade}
                </button>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t.contracts.title} ({myContracts.length}/100)</h2>
              <div className={styles.matchGrid}>
                {myContracts.map(c => {
                  const contractApps = applications.filter(a => a.contractId === c.id);
                  const isFilled = !!c.expertId;
                  
                  return (
                  <div key={c.id} className={`${styles.matchCard} glass`} style={{borderLeft: `4px solid ${c.status === 'approved' ? '#10b981' : c.status === 'rejected' ? '#ef4444' : '#f59e0b'}`, display: 'flex', flexDirection: 'column'}}>
                    <div className={styles.matchHeader}>
                      <h4>{c.specialization} - {c.location}</h4>
                      <span style={{color: c.status === 'approved' ? '#10b981' : c.status === 'rejected' ? '#ef4444' : '#f59e0b', fontWeight: 'bold'}}>{isFilled ? (language === 'ar' ? 'نشط (مع خبير)' : 'Active (Assigned)') : t.contracts[c.status]}</span>
                    </div>
                    <div className={styles.matchDetails}>
                      <p>{t.contracts.duration}: {c.duration}</p>
                      <p>{t.contracts.reqExperience}: {c.experience}</p>
                    </div>
                    
                    {/* Applications Section */}
                    {c.status === 'approved' && (
                      <div style={{marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem'}}>
                        <h5 style={{marginBottom: '0.5rem', color: 'var(--primary-blue)'}}>{language === 'ar' ? 'الخبراء المتقدمين:' : 'Applicants:'}</h5>
                        {contractApps.length === 0 && !isFilled && <p style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>{language === 'ar' ? 'لم يتقدم أحد بعد.' : 'No applicants yet.'}</p>}
                        
                        {isFilled && <p style={{fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold'}}>{language === 'ar' ? `تم التعاقد مع: ${c.expertName}` : `Contracted with: ${c.expertName}`}</p>}
                        
                        {!isFilled && contractApps.filter(a => a.status === 'pending').map(app => (
                          <div key={app.id} style={{background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                              {app.expertProfilePicture ? (
                                <img src={app.expertProfilePicture} alt="" style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover'}} />
                              ) : (
                                <div style={{width: '30px', height: '30px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8'}}>{app.expertName.charAt(0)}</div>
                              )}
                              <div>
                                <strong style={{display: 'block', fontSize: '0.9rem'}}>{app.expertName}</strong>
                                <span style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>{app.expertExperience} - {app.expertSpecialization}</span>
                              </div>
                            </div>
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                              <button onClick={() => handleAcceptExpert(app, c.id)} style={{background: '#10b981', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.8rem'}}>{language === 'ar' ? 'قبول' : 'Accept'}</button>
                              <button onClick={() => handleRejectExpert(app.id)} style={{background: '#ef4444', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.8rem'}}>{language === 'ar' ? 'رفض' : 'Reject'}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
                {myContracts.length === 0 && <p style={{color: 'var(--text-light)'}}>{language === 'ar' ? 'لا توجد عقود حالياً' : 'No contracts currently'}</p>}
              </div>
            </section>
          </>
        )}

        {activeTab === 'create' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.createForm.title}</h2>
            {!isSubscribed ? (
              <div style={{padding: '2rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem'}}>
                {t.createForm.subReq}
                <button className="btn-primary" style={{display: 'block', marginTop: '1rem'}} onClick={handleSubscribe}>{t.subscription.upgrade}</button>
              </div>
            ) : myContracts.length >= 100 ? (
              <div style={{padding: '2rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem'}}>
                {t.createForm.limitReached}
              </div>
            ) : (
              <form className="glass" style={{padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}} onSubmit={handleCreateContract}>
                {/* Header preview if logo exists */}
                {currentUser.logo && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem'}}>
                    <img src={currentUser.logo} alt="Logo" style={{height: '40px'}} />
                    <h3 style={{margin: 0}}>{currentUser.name}</h3>
                  </div>
                )}
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t.createForm.exp}</label>
                    <input type="text" required value={contractForm.experience} onChange={(e) => setContractForm({...contractForm, experience: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t.createForm.dur}</label>
                    <input type="text" required value={contractForm.duration} onChange={(e) => setContractForm({...contractForm, duration: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t.createForm.nat}</label>
                    <input type="text" required value={contractForm.nature} onChange={(e) => setContractForm({...contractForm, nature: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t.createForm.sal}</label>
                    <input type="text" required value={contractForm.salary} onChange={(e) => setContractForm({...contractForm, salary: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t.createForm.spec}</label>
                    <input type="text" required value={contractForm.specialization} onChange={(e) => setContractForm({...contractForm, specialization: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>{t.createForm.loc}</label>
                    <input type="text" required value={contractForm.location} onChange={(e) => setContractForm({...contractForm, location: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
                  </div>
                </div>
                <button type="submit" className="btn-primary">{t.createForm.submit}</button>
              </form>
            )}
          </section>
        )}

        {activeTab === 'search' && (
          <section className={styles.section}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2 className={styles.sectionTitle}>{t.search.title}</h2>
              <input 
                type="text" 
                placeholder="ابحث..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ddd'}}
              />
            </div>
            
            <div className={styles.matchGrid}>
              {filteredExperts.length === 0 ? <p>{t.search.noResults}</p> : filteredExperts.map(expert => {
                // Find chat history with this expert
                const expertChats = chats.filter(c => 
                  (c.fromId === currentUser.id && c.toId === expert.id) || 
                  (c.fromId === expert.id && c.toId === currentUser.id)
                );
                
                return (
                  <div key={expert.id} className={`${styles.matchCard} glass`} style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                      {expert.profilePicture ? (
                        <img src={expert.profilePicture} alt={expert.name} style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#94a3b8'}}>{expert.name?.charAt(0)}</div>
                      )}
                      <div>
                        <h4 style={{margin: '0 0 0.25rem 0'}}>{expert.name}</h4>
                        <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-light)'}}>{expert.specialization} - {expert.experience} سنة خبرة</p>
                      </div>
                    </div>
                    
                    <div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
                      <button className="btn-primary" style={{flex: 1}} onClick={() => setSelectedExpert(expert.id === selectedExpert ? null : expert.id)}>
                        {selectedExpert === expert.id ? 'إغلاق المحادثة' : 'التحدث'}
                      </button>
                    </div>

                    {selectedExpert === expert.id && (
                      <div style={{marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem', display: 'flex', flexDirection: 'column'}}>
                        <p style={{marginBottom: '0.5rem'}}><strong>نبذة:</strong> {expert.bio || 'لا توجد'}</p>
                        
                        {/* CV Section */}
                        <div style={{marginBottom: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem'}}>
                          <h5 style={{margin: '0 0 0.5rem 0', color: 'var(--primary-blue)'}}>{language === 'ar' ? 'السيرة الذاتية المرفوعة' : 'Uploaded CV'}</h5>
                          {expert.cvAnalyzed && expert.cvData ? (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                              <span style={{fontSize: '0.9rem'}}>{expert.cvName || 'CV.pdf'}</span>
                              <a href={expert.cvData} download={expert.cvName || 'CV.pdf'} className="btn-secondary" style={{textDecoration: 'none', fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}>
                                📄 {t.search.downloadCv}
                              </a>
                            </div>
                          ) : (
                            <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-light)'}}>{t.search.noCv}</p>
                          )}
                        </div>
                        
                        {/* Chat History */}
                        <div style={{flex: 1, background: '#f8fafc', borderRadius: '0.5rem', padding: '1rem', height: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem'}}>
                          {expertChats.length === 0 ? (
                            <p style={{color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem'}}>لا توجد رسائل سابقة. ابدأ المحادثة الآن!</p>
                          ) : expertChats.map((msg, i) => (
                            <div key={i} style={{alignSelf: msg.fromId === currentUser.id ? 'flex-end' : 'flex-start', background: msg.fromId === currentUser.id ? '#3b82f6' : '#e2e8f0', color: msg.fromId === currentUser.id ? '#fff' : '#0f172a', padding: '0.5rem 1rem', borderRadius: '1rem', maxWidth: '80%'}}>
                              <p style={{margin: 0, fontSize: '0.9rem'}}>{msg.text}</p>
                              <span style={{fontSize: '0.7rem', opacity: 0.7}}>{new Date(msg.date).toLocaleTimeString()}</span>
                            </div>
                          ))}
                        </div>

                        {/* Send Message */}
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <input 
                            type="text"
                            placeholder={t.search.typeMsg} 
                            value={messageText} 
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && messageText.trim()) {
                                const newChat = { id: Date.now(), fromId: currentUser.id, fromName: currentUser.name, toId: expert.id, toName: expert.name, text: messageText, date: new Date().toISOString() };
                                const updatedChats = [...chats, newChat];
                                setChats(updatedChats);
                                localStorage.setItem('erth_chats', JSON.stringify(updatedChats));
                                setMessageText('');
                              }
                            }}
                            style={{flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}}
                          />
                          <button className="btn-primary" onClick={() => {
                            if(messageText.trim()){
                                const newChat = { id: Date.now(), fromId: currentUser.id, fromName: currentUser.name, toId: expert.id, toName: expert.name, text: messageText, date: new Date().toISOString() };
                                const updatedChats = [...chats, newChat];
                                setChats(updatedChats);
                                localStorage.setItem('erth_chats', JSON.stringify(updatedChats));
                                setMessageText('');
                            }
                          }}>{t.search.sendMsg}</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'salaries' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.salaries.title}</h2>
            
            <div className={styles.statsGrid}>
              <div className="glass" style={{padding: '1.5rem', borderRadius: '1rem'}}>
                <h3 style={{color: '#10b981'}}>{t.salaries.paid}</h3>
                <p>{myContracts.filter(c => c.status === 'approved' && c.expertId && c.paymentStatus === 'paid').length === 0 ? t.salaries.empty : ''}</p>
              </div>
              <div className="glass" style={{padding: '1.5rem', borderRadius: '1rem'}}>
                <h3 style={{color: '#f59e0b'}}>{t.salaries.upcoming}</h3>
                <p>{myContracts.filter(c => c.status === 'approved' && c.expertId && c.paymentStatus !== 'paid').length === 0 ? t.salaries.empty : ''}</p>
              </div>
              <div className="glass" style={{padding: '1.5rem', borderRadius: '1rem'}}>
                <h3 style={{color: '#ef4444'}}>{t.salaries.unassigned}</h3>
                {myContracts.filter(c => c.status === 'approved' && !c.expertId).map(c => (
                  <div key={c.id} style={{padding: '0.5rem 0', borderBottom: '1px solid #eee'}}>
                    {c.specialization} - {c.salary}
                  </div>
                ))}
                {myContracts.filter(c => c.status === 'approved' && !c.expertId).length === 0 && <p>{t.salaries.empty}</p>}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className={styles.section}>
            <div style={{background: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '2rem'}}>
              {/* Profile Banner */}
              <div style={{height: '150px', background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)', position: 'relative'}}>
                {/* Profile Picture */}
                <div style={{position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px', borderRadius: '50%', background: '#fff', border: '4px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
                  {currentUser.logo ? (
                    <img src={currentUser.logo} alt="Company Logo" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <div style={{width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '2rem'}}>🏢</div>
                  )}
                </div>
              </div>
              
              {/* Profile Info */}
              <div style={{padding: '4rem 2rem 2rem 2rem', textAlign: 'center'}}>
                <h2 style={{margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.75rem'}}>{currentUser.name}</h2>
                <p style={{margin: '0 0 1rem 0', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem'}}>{currentUser.companyField || 'لم يتم تحديد المجال'}</p>
                <div style={{maxWidth: '800px', margin: '0 auto', color: '#475569', lineHeight: '1.6'}}>
                  <p>{currentUser.companyDescription || 'لا يوجد وصف مضاف للشركة حالياً.'}</p>
                </div>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
              {/* Edit Profile Form */}
              <div className="glass" style={{padding: '2rem', borderRadius: '1rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <h3 style={{margin: 0, color: '#0f172a'}}>{t.profile.title}</h3>
                  <button className="btn-secondary" style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem'}} onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}>{t.profile.lang}</button>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500'}}>{t.profile.logo}</label>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{width: '100%', padding: '0.5rem', border: '1px dashed #cbd5e1', borderRadius: '0.5rem'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500'}}>{t.profile.name}</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500'}}>{t.profile.field}</label>
                    <input type="text" value={profileForm.companyField} onChange={(e) => setProfileForm({...profileForm, companyField: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500'}}>{t.profile.desc}</label>
                    <textarea value={profileForm.companyDescription} onChange={(e) => setProfileForm({...profileForm, companyDescription: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', minHeight: '100px'}} />
                  </div>
                  <button className="btn-primary" onClick={handleSaveProfile} style={{width: '100%', background: '#3b82f6'}}>{t.profile.save}</button>
                </div>
              </div>

              {/* Raise Ticket Form */}
              <div className="glass" style={{padding: '2rem', borderRadius: '1rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                <h3 style={{margin: '0 0 1.5rem 0', color: '#0f172a'}}>{t.profile.ticket}</h3>
                <form onSubmit={handleSendTicket} style={{display: 'flex', flexDirection: 'column', height: 'calc(100% - 3rem)'}}>
                  <p style={{color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem'}}>إذا واجهتك أي مشكلة أو كان لديك اقتراح، يمكنك رفعه مباشرة للإدارة من هنا وسيتم الرد عليك في أقرب وقت.</p>
                  <textarea required value={ticketText} onChange={(e) => setTicketText(e.target.value)} placeholder="اكتب تفاصيل البلاغ أو الشكوى هنا بوضوح..." style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', flex: 1, minHeight: '150px', marginBottom: '1.5rem', resize: 'none'}} />
                  <button type="submit" className="btn-primary" style={{width: '100%', background: '#ef4444', marginTop: 'auto'}}>{t.profile.sendTicket}</button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
