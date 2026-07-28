"use client";

import React, { useState, useEffect } from 'react';
import styles from '../dashboard/dashboard.module.css';
import { useLanguage } from '../../LanguageContext';

export default function ProfilePage() {
  const { language } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({ name: '', bio: '', skills: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('erth_currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const t = {
    ar: { title: 'الملف الشخصي والخبرات', edit: 'تعديل الملف', save: 'حفظ التغييرات', name: 'الاسم', bio: 'النبذة التعريفية', skills: 'المهارات (مفصولة بفاصلة)', success: 'تم حفظ التغييرات بنجاح!' },
    en: { title: 'Profile & Expertise', edit: 'Edit Profile', save: 'Save Changes', name: 'Name', bio: 'Bio', skills: 'Skills (comma separated)', success: 'Changes saved successfully!' }
  }[language];

  const handleSave = () => {
    if (editing) {
      // Save logic
      localStorage.setItem('erth_currentUser', JSON.stringify(user));
      const users = JSON.parse(localStorage.getItem('erth_users') || '[]');
      const updatedUsers = users.map(u => u.email === user.email ? { ...u, ...user } : u);
      localStorage.setItem('erth_users', JSON.stringify(updatedUsers));
      alert(t.success);
    }
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (!user.name && !editing) return null;

  return (
    <>
      <section className={styles.section}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h2 className={styles.sectionTitle}>{t.title}</h2>
          <button className={editing ? "btn-primary" : "btn-secondary"} onClick={handleSave}>
            {editing ? t.save : t.edit}
          </button>
        </div>

        <div className="glass" style={{padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{language === 'ar' ? 'الصورة الشخصية' : 'Profile Picture'}</label>
            {editing ? (
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setUser({ ...user, profilePicture: reader.result });
                    reader.readAsDataURL(file);
                  }
                }}
                style={{width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px dashed var(--light-gray)'}}
              />
            ) : null}
            {user.profilePicture && (
              <img src={user.profilePicture} alt="Profile" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginTop: '1rem', border: '2px solid #ddd'}} />
            )}
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t.name}</label>
            <input 
              type="text" 
              name="name"
              value={user.name || ''}
              onChange={handleChange}
              disabled={!editing}
              style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--light-gray)', background: editing ? '#fff' : 'var(--light-gray)'}}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t.bio}</label>
            <textarea 
              name="bio"
              value={user.bio || ''} 
              onChange={handleChange}
              disabled={!editing}
              rows={4}
              style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--light-gray)', background: editing ? '#fff' : 'var(--light-gray)'}}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t.skills}</label>
            <input 
              type="text" 
              name="skills"
              value={user.skills || ''} 
              onChange={handleChange}
              disabled={!editing}
              style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--light-gray)', background: editing ? '#fff' : 'var(--light-gray)'}}
            />
          </div>
        </div>
      </section>
    </>
  );
}
