"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../expert/dashboard/dashboard.module.css'; // Reusing base layout structure
import { useLanguage } from '../../LanguageContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('erth_currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.type !== 'admin' || parsedUser.email !== '445201182@student.ksu.edu.sa') {
      localStorage.removeItem('erth_currentUser');
      router.push('/login');
      return;
    }
    setCurrentUser(parsedUser);

    const storedContracts = JSON.parse(localStorage.getItem('erth_contracts') || '[]');
    setContracts(storedContracts);

    const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
    setUsersList(users);
    
    const storedTickets = JSON.parse(localStorage.getItem('erth_reports') || '[]');
    setTickets(storedTickets);
  }, [router]);

  const expertsCount = usersList.filter(u => u.type === 'expert').length;
  const companiesCount = usersList.filter(u => u.type === 'company').length;
  
  const pendingContracts = contracts.filter(c => c.status === 'pending');
  const activeContracts = contracts.filter(c => c.status === 'approved');

  const handleAction = (id, newStatus) => {
    const updatedContracts = contracts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setContracts(updatedContracts);
    localStorage.setItem('erth_contracts', JSON.stringify(updatedContracts));
  };

  const handleBlockUser = (email) => {
    if(confirm("هل أنت متأكد من حظر هذا المستخدم؟ لن يتمكن من تسجيل الدخول مرة أخرى.")) {
      const updatedUsers = usersList.map(u => u.email === email ? { ...u, isBlocked: true } : u);
      setUsersList(updatedUsers);
      localStorage.setItem('erth_users', JSON.stringify(updatedUsers));
      alert("تم الحظر بنجاح.");
    }
  };

  const handleDeleteUser = (email) => {
    if(confirm("هل أنت متأكد من الحذف النهائي لهذا المستخدم؟")) {
      const updatedUsers = usersList.filter(u => u.email !== email);
      setUsersList(updatedUsers);
      localStorage.setItem('erth_users', JSON.stringify(updatedUsers));
      alert("تم الحذف بنجاح.");
    }
  };

  const handleCancelCompanyContracts = (companyId) => {
    if(confirm("هل أنت متأكد من إلغاء كافة العقود الفعالة والمعلقة لهذه الشركة؟")) {
      const updatedContracts = contracts.map(c => c.companyId === companyId ? { ...c, status: 'rejected' } : c);
      setContracts(updatedContracts);
      localStorage.setItem('erth_contracts', JSON.stringify(updatedContracts));
      alert("تم إلغاء عقود الشركة بنجاح.");
    }
  };

  if (!currentUser) return null; // Wait for auth check

  return (
    <div className={styles.dashboardContainer} style={{background: '#f1f5f9'}}>
      <aside className={styles.sidebar} style={{background: '#0f172a', display: 'flex', flexDirection: 'column', width: '280px'}}>
        <div className={styles.logo} style={{color: '#fff', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>إدارة إرث</div>
        <nav className={styles.navMenu} style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <a href="#" className={activeTab === 'home' ? styles.active : ''} onClick={(e)=>{e.preventDefault(); setActiveTab('home')}} style={{color: activeTab==='home'?'#fff':'#94a3b8', borderRadius: '0.5rem', padding: '1rem'}}>📊 نظرة عامة</a>
          <a href="#" className={activeTab === 'experts' ? styles.active : ''} onClick={(e)=>{e.preventDefault(); setActiveTab('experts')}} style={{color: activeTab==='experts'?'#fff':'#94a3b8', borderRadius: '0.5rem', padding: '1rem'}}>👨‍🏫 الخبراء</a>
          <a href="#" className={activeTab === 'companies' ? styles.active : ''} onClick={(e)=>{e.preventDefault(); setActiveTab('companies')}} style={{color: activeTab==='companies'?'#fff':'#94a3b8', borderRadius: '0.5rem', padding: '1rem'}}>🏢 الشركات</a>
          <a href="#" className={activeTab === 'contracts' ? styles.active : ''} onClick={(e)=>{e.preventDefault(); setActiveTab('contracts')}} style={{color: activeTab==='contracts'?'#fff':'#94a3b8', borderRadius: '0.5rem', padding: '1rem'}}>📄 طلبات العقود ({pendingContracts.length})</a>
          <a href="#" className={activeTab === 'reports' ? styles.active : ''} onClick={(e)=>{e.preventDefault(); setActiveTab('reports')}} style={{color: activeTab==='reports'?'#fff':'#94a3b8', borderRadius: '0.5rem', padding: '1rem'}}>✉️ الشكاوى والبلاغات ({tickets.length})</a>
          
          <a href="/" style={{marginTop: 'auto', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem'}} onClick={() => localStorage.removeItem('erth_currentUser')}>تسجيل الخروج 🚪</a>
        </nav>
      </aside>

      <main className={styles.mainContent} style={{padding: '2rem'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#fff', padding: '1.5rem 2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
          <div>
            <h1 style={{fontSize: '1.5rem', margin: 0, color: '#0f172a'}}>المركز الوطني للتوجيه</h1>
            <p style={{color: '#64748b', margin: 0, marginTop: '0.25rem'}}>مرحباً بك في لوحة تحكم الإدارة (الوصول محمي)</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{width: '40px', height: '40px', background: '#3b82f6', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'}}>A</div>
            <div>
              <p style={{margin: 0, fontWeight: 'bold', color: '#0f172a'}}>الأدمن</p>
              <p style={{margin: 0, fontSize: '0.8rem', color: '#64748b'}}>Superadmin</p>
            </div>
          </div>
        </header>

        {activeTab === 'home' && (
          <>
            <section style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
              <div style={{background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #3b82f6'}}>
                <p style={{color: '#64748b', margin: 0}}>إجمالي الخبراء</p>
                <h3 style={{fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#0f172a'}}>{expertsCount}</h3>
              </div>
              <div style={{background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #8b5cf6'}}>
                <p style={{color: '#64748b', margin: 0}}>الشركات المسجلة</p>
                <h3 style={{fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#0f172a'}}>{companiesCount}</h3>
              </div>
              <div style={{background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #10b981'}}>
                <p style={{color: '#64748b', margin: 0}}>العقود النشطة (المعتمدة)</p>
                <h3 style={{fontSize: '2rem', margin: '0.5rem 0 0 0', color: '#0f172a'}}>{activeContracts.length}</h3>
              </div>
              <div style={{background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderLeft: '4px solid #f59e0b'}}>
                <p style={{color: '#64748b', margin: 0}}>حجم العقود (بالريال)</p>
                <h3 style={{fontSize: '1.5rem', margin: '0.5rem 0 0 0', color: '#0f172a'}}>{activeContracts.reduce((acc, c) => acc + (parseFloat(c.salary) || 0), 0).toLocaleString()} </h3>
              </div>
            </section>
          </>
        )}

        {activeTab === 'experts' && (
          <section style={{background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
            <h2 style={{color: '#0f172a', marginBottom: '1.5rem'}}>قائمة الخبراء</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {usersList.filter(u => u.type === 'expert').length === 0 ? <p style={{color: '#64748b'}}>لا يوجد خبراء.</p> : usersList.filter(u => u.type === 'expert').map(expert => (
                <div key={expert.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc', opacity: expert.isBlocked ? 0.6 : 1}}>
                  <div>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem'}}>
                      {expert.name} {expert.isBlocked ? <span style={{color: '#ef4444', fontSize: '0.8rem'}}>(محظور)</span> : ''}
                    </h4>
                    <div style={{display: 'flex', gap: '1.5rem', color: '#475569', fontSize: '0.9rem'}}>
                      <p style={{margin: 0}}><strong>الإيميل:</strong> {expert.email}</p>
                      <p style={{margin: 0}}><strong>التخصص:</strong> {expert.specialization}</p>
                      <p style={{margin: 0}}><strong>الهوية:</strong> {expert.nationalId}</p>
                      <p style={{margin: 0}}><strong>الخبرة:</strong> {expert.experience} سنة</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '1rem', flexShrink: 0}}>
                    {!expert.isBlocked && <button style={{background: '#f59e0b', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleBlockUser(expert.email)}>حظر 🚫</button>}
                    <button style={{background: '#ef4444', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleDeleteUser(expert.email)}>حذف 🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'companies' && (
          <section style={{background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
            <h2 style={{color: '#0f172a', marginBottom: '1.5rem'}}>قائمة الشركات</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {usersList.filter(u => u.type === 'company').length === 0 ? <p style={{color: '#64748b'}}>لا توجد شركات.</p> : usersList.filter(u => u.type === 'company').map(company => (
                <div key={company.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc', opacity: company.isBlocked ? 0.6 : 1}}>
                  <div>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem'}}>
                      {company.name} {company.isBlocked ? <span style={{color: '#ef4444', fontSize: '0.8rem'}}>(محظور)</span> : ''}
                    </h4>
                    <div style={{display: 'flex', gap: '1.5rem', color: '#475569', fontSize: '0.9rem'}}>
                      <p style={{margin: 0}}><strong>الإيميل:</strong> {company.email}</p>
                      <p style={{margin: 0}}><strong>المجال:</strong> {company.companyField || 'غير محدد'}</p>
                      <p style={{margin: 0}}><strong>الاشتراك:</strong> {company.isSubscribed ? 'نشط' : 'غير نشط'}</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '1rem', flexShrink: 0}}>
                    {!company.isBlocked && <button style={{background: '#f59e0b', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleBlockUser(company.email)}>حظر 🚫</button>}
                    <button style={{background: '#ef4444', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleCancelCompanyContracts(company.id)}>إلغاء جميع العقود 📄❌</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'contracts' && (
          <section style={{background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
            <h2 style={{color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#f59e0b', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block'}}></span> 
              طلبات الشركات المعلقة (بانتظار الموافقة)
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {pendingContracts.length === 0 ? <p style={{color: '#64748b'}}>لا توجد طلبات معلقة حالياً.</p> : pendingContracts.map(c => (
                <div key={c.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc'}}>
                  <div>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem'}}>{c.companyName}</h4>
                    <div style={{display: 'flex', gap: '1.5rem', color: '#475569', fontSize: '0.9rem'}}>
                      <p style={{margin: 0}}><strong>التخصص:</strong> {c.specialization}</p>
                      <p style={{margin: 0}}><strong>الراتب المقترح:</strong> {c.salary}</p>
                      <p style={{margin: 0}}><strong>المكان:</strong> {c.location}</p>
                    </div>
                    <div style={{display: 'flex', gap: '1.5rem', color: '#475569', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                      <p style={{margin: 0}}><strong>الخبرة:</strong> {c.experience}</p>
                      <p style={{margin: 0}}><strong>المدة:</strong> {c.duration}</p>
                      <p style={{margin: 0}}><strong>طبيعة العمل:</strong> {c.nature}</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button style={{background: '#10b981', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleAction(c.id, 'approved')}>قبول ✅</button>
                    <button style={{background: '#ef4444', color: '#fff', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleAction(c.id, 'rejected')}>رفض ❌</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'reports' && (
          <section style={{background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
            <h2 style={{color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{background: '#ef4444', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block'}}></span> 
              الشكاوى والبلاغات الواردة
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {tickets.length === 0 ? <p style={{color: '#64748b'}}>لا توجد بلاغات حالياً.</p> : tickets.map(ticket => (
                <div key={ticket.id} style={{padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem'}}>
                    <h4 style={{margin: 0, color: '#0f172a', fontSize: '1.1rem'}}>{ticket.companyName}</h4>
                    <span style={{color: '#64748b', fontSize: '0.85rem'}}>{new Date(ticket.date).toLocaleString()}</span>
                  </div>
                  <div>
                    <p style={{margin: 0, whiteSpace: 'pre-wrap', color: '#334155', lineHeight: '1.6'}}>{ticket.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
