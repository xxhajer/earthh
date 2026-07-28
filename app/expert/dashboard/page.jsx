"use client";

import React, { useState, useRef } from 'react';
import styles from './dashboard.module.css';
import { useLanguage } from '../../LanguageContext';

const MatchCard = ({ item, t }) => {
  const [status, setStatus] = useState('pending');

  return (
    <div className={`${styles.matchCard} glass`}>
      <div className={styles.matchHeader}>
        <h4>{item === 1 ? 'جهة حكومية (سرية)' : `شركة قطاع التجزئة ${item}`}</h4>
        <span className={styles.matchBadge}>{t.aiMatch.match} 95%</span>
      </div>
      <div className={styles.matchDetails}>
        <p>نوع المهمة: استشارة هاتفية (ساعة واحدة)</p>
        <p>المقابل: 1500 ريال</p>
      </div>
      <div className={styles.matchActions}>
        {status === 'pending' ? (
          <>
            <button className="btn-primary" onClick={() => setStatus('accepted')}>✅ {t.aiMatch.accept}</button>
            <button className="btn-secondary" onClick={() => {
              alert("تم طلب تعديل الموعد وسيتم إرساله للجهة.");
              setStatus('suggested');
            }}>⏳ {t.aiMatch.suggestTime}</button>
            <button className={styles.btnText} onClick={() => setStatus('rejected')}>❌ {t.aiMatch.reject}</button>
          </>
        ) : status === 'accepted' ? (
          <span style={{color: '#10b981', fontWeight: 'bold', width: '100%', textAlign: 'center'}}>تم قبول الفرصة بنجاح!</span>
        ) : status === 'suggested' ? (
          <span style={{color: '#f59e0b', fontWeight: 'bold', width: '100%', textAlign: 'center'}}>تم طلب تعديل الموعد.</span>
        ) : (
          <span style={{color: 'var(--text-light)', fontWeight: 'bold', width: '100%', textAlign: 'center'}}>تم الرفض، سيتعلم الذكاء الاصطناعي من ذلك.</span>
        )}
      </div>
    </div>
  );
};

export default function ExpertDashboard() {
  const { language } = useLanguage();
  const [isAvailable, setIsAvailable] = useState(true);
  const [studioTab, setStudioTab] = useState('blog'); // 'blog' | 'webinar'
  const [posts, setPosts] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState('');
  const [cvSuccess, setCvSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const fileInputRef = useRef(null);
  
  React.useEffect(() => {
    const storedUser = localStorage.getItem('erth_currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const displayName = currentUser?.name || 'أحمد';

  const t = {
    ar: {
      welcomeMsg: `مرحباً ${displayName}، خبرتك تصنع فارق.`,
      availability: { title: 'بطاقة الحالة', available: 'متاح حالياً لاستقبال الطلبات', busy: 'مشغول / في إجازة' },
      studio: { title: 'استوديو نقل المعرفة', blog: 'المدوّنة والمعرفة المكتوبة', webinar: 'الجلسات الحية (Webinars)', addPost: 'نشر مقال/نصيحة', schedule: 'جدولة جلسة مباشرة', titleInput: 'العنوان', contentInput: 'اكتب نصيحتك أو مقالك هنا...', dateInput: 'التاريخ', timeInput: 'الوقت' },
      cv: { title: 'تحليل السيرة الذاتية (AI Profile Analysis)', uploadBtn: 'اختر ملف السيرة الذاتية (PDF, DOC, DOCX)', noFile: 'لم يتم اختيار ملف', analyzing: 'جاري التحليل واستخراج البيانات...', success: 'تم بناء ملفك الشخصي كخبير بنجاح بناءً على سيرتك!' },
      aiMatch: { title: 'الفرص المقترحة من الذكاء الاصطناعي', desc: 'هنا ترى الفرص التي رشحها الذكاء الاصطناعي لك، الفرص تأتي إليك ولا تبحث عنها:', match: 'تطابق', accept: 'قبول المهمة', suggestTime: 'طلب تعديل', reject: 'غير مهتم', noCvMsg: 'يرجى رفع السيرة الذاتية أولاً ليتمكن الذكاء الاصطناعي من تحليلها وعرض الاقتراحات المناسبة لك.' },
      stats: { title: 'ملخص الإحصائيات (الأثر)', upcoming: 'الاستشارات القادمة', hours: 'ساعات التدريب المنجزة', youth: 'الشباب المستفيدين', returnVal: 'العائد (ريال/معنوي)' },
      actions: { edit: 'تعديل', delete: 'حذف', like: 'إعجاب', views: 'مشاهدة' }
    },
    en: {
      welcomeMsg: `Welcome ${displayName}, your expertise is making a difference in 3 new organizations today.`,
      availability: { title: 'Availability Status', available: 'Available for requests', busy: 'Busy / On leave' },
      studio: { title: 'Knowledge Studio', blog: 'Blog & Written Knowledge', webinar: 'Live Sessions (Webinars)', addPost: 'Publish Post', schedule: 'Schedule Session', titleInput: 'Title', contentInput: 'Write your tip or article here...', dateInput: 'Date', timeInput: 'Time' },
      cv: { title: 'AI Profile Analysis', uploadBtn: 'Select CV File (PDF, DOC, DOCX)', noFile: 'No file selected', analyzing: 'Analyzing and extracting data...', success: 'Your expert profile has been built successfully based on your CV!' },
      aiMatch: { title: 'AI Matched Opportunities', desc: 'Opportunities come to you based on AI analysis of your profile:', match: 'Match', accept: 'Accept Task', suggestTime: 'Request Change', reject: 'Not Interested', noCvMsg: 'Please upload your CV first so the AI can analyze it and show suitable suggestions.' },
      stats: { title: 'Impact Statistics', upcoming: 'Upcoming Consultations', hours: 'Training Hours', youth: 'Youth Benefited', returnVal: 'Returns (SAR/Moral)' },
      actions: { edit: 'Edit', delete: 'Delete', like: 'Like', views: 'Views' }
    }
  }[language];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      type: studioTab,
      title: e.target.title.value,
      content: studioTab === 'blog' ? e.target.content.value : `${e.target.date.value} - ${e.target.time.value}`,
      likes: 0,
      views: 0
    };
    setPosts([newPost, ...posts]);
    e.target.reset();
  };

  const handlePostDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleFileUpload = (e) => {
    setCvError('');
    setCvSuccess('');
    const file = e.target.files[0];
    
    if (!file) {
      setCvError(language === 'ar' ? 'الملف فارغ أو غير صالح.' : 'Empty or invalid file.');
      return;
    }
    
    const validExtensions = ['pdf', 'doc', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      setCvError(language === 'ar' ? 'امتداد الملف غير مسموح. يرجى رفع PDF, DOC, أو DOCX.' : 'Invalid extension. Please upload PDF, DOC, or DOCX.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setCvError(language === 'ar' ? 'حجم الملف يتجاوز الحد المسموح (5 ميجابايت).' : 'File size exceeds limit (5MB).');
      return;
    }
    
    // Read file and Simulate AI Processing
    setCvFile(file);
    setCvSuccess(t.cv.analyzing);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const cvData = reader.result;
      
      setTimeout(() => {
        setCvSuccess(t.cv.success);
        
        // Save to Database (localStorage)
        const updatedUser = { ...currentUser, cvName: file.name, cvData: cvData, cvAnalyzed: true };
        setCurrentUser(updatedUser);
        localStorage.setItem('erth_currentUser', JSON.stringify(updatedUser));
        
        const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
        const updatedUsers = users.map(u => u.email === updatedUser.email ? { ...u, ...updatedUser } : u);
        localStorage.setItem('erth_users', JSON.stringify(updatedUsers));
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Welcome & Availability */}
      <section style={{marginBottom: '2rem'}}>
        <p style={{fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-light)'}}>{t.welcomeMsg}</p>
        <div className="glass" style={{padding: '1rem 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', width: 'fit-content'}}>
          <span style={{fontWeight: 'bold'}}>{t.availability.title}:</span>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: isAvailable ? '#ecfdf5' : '#fef2f2',
              color: isAvailable ? '#10b981' : '#ef4444',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            {isAvailable ? '🟢 ' + t.availability.available : '🔴 ' + t.availability.busy}
          </button>
        </div>
      </section>

      {/* Knowledge Studio */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.studio.title}</h2>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <button className={studioTab === 'blog' ? 'btn-primary' : 'btn-secondary'} onClick={() => setStudioTab('blog')}>{t.studio.blog}</button>
          <button className={studioTab === 'webinar' ? 'btn-primary' : 'btn-secondary'} onClick={() => setStudioTab('webinar')}>{t.studio.webinar}</button>
        </div>
        
        <div className="glass" style={{padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem'}}>
          <form onSubmit={handlePostSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <input name="title" type="text" placeholder={t.studio.titleInput} required className={styles.inputField} style={{padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #ddd'}} />
            
            {studioTab === 'blog' ? (
              <textarea name="content" placeholder={t.studio.contentInput} required rows={4} style={{padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #ddd', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
            ) : (
              <div style={{display: 'flex', gap: '1rem'}}>
                <input name="date" type="date" required style={{padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #ddd', flex: 1}} />
                <input name="time" type="time" required style={{padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid #ddd', flex: 1}} />
              </div>
            )}
            <button type="submit" className="btn-primary" style={{alignSelf: 'flex-start'}}>{studioTab === 'blog' ? t.studio.addPost : t.studio.schedule}</button>
          </form>
        </div>

        {/* Posts List */}
        {posts.length > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {posts.map(post => (
              <div key={post.id} className="glass" style={{padding: '1rem', borderRadius: '0.8rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <h4 style={{color: 'var(--primary-blue-dark)', marginBottom: '0.5rem'}}>{post.title}</h4>
                    <p style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>{post.content}</p>
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-light)'}}>
                      <span>❤️ 12 {t.actions.like}</span>
                      <span>👁️ 45 {t.actions.views}</span>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button className={styles.btnText} style={{color: '#3b82f6'}}>{t.actions.edit}</button>
                    <button className={styles.btnText} style={{color: '#ef4444'}} onClick={() => handlePostDelete(post.id)}>{t.actions.delete}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CV Upload & AI Analysis */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.cv.title}</h2>
        <div className="glass" style={{padding: '2rem', borderRadius: '1rem', textAlign: 'center'}}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.doc,.docx" 
            style={{display: 'none'}} 
          />
          <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
            📄 {t.cv.uploadBtn}
          </button>
          {cvFile && <p style={{marginTop: '1rem', color: 'var(--primary-blue)'}}>{cvFile.name}</p>}
          
          {cvError && (
            <div style={{marginTop: '1rem', padding: '0.8rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '0.5rem'}}>
              {cvError}
            </div>
          )}
          
          {cvSuccess && (
            <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '0.5rem', fontWeight: 'bold'}}>
              {cvSuccess}
            </div>
          )}
        </div>
      </section>

      {/* AI Matches */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.aiMatch.title}</h2>
        {!currentUser?.cvAnalyzed ? (
          <div className="glass" style={{padding: '2rem', borderRadius: '1rem', textAlign: 'center', color: 'var(--text-light)'}}>
            <p>{t.aiMatch.noCvMsg}</p>
          </div>
        ) : (
          <>
            <p style={{marginBottom: '1rem', color: 'var(--text-light)'}}>{t.aiMatch.desc}</p>
            <div className={styles.matchGrid}>
              {[1, 2, 3].map((item) => (
                <MatchCard key={item} item={item} t={t} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Statistics Dashboard (Impact) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.stats.title}</h2>
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass`}>
            <h3>4</h3>
            <p>{t.stats.upcoming}</p>
          </div>
          <div className={`${styles.statCard} glass`}>
            <h3>32</h3>
            <p>{t.stats.hours}</p>
          </div>
          <div className={`${styles.statCard} glass`}>
            <h3>120</h3>
            <p>{t.stats.youth}</p>
          </div>
          <div className={`${styles.statCard} glass`}>
            <h3>45,000</h3>
            <p>{t.stats.returnVal}</p>
          </div>
        </div>
      </section>
    </>
  );
}

