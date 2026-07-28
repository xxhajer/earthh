"use client";

import React, { useState, useEffect } from 'react';
import styles from '../dashboard/dashboard.module.css';
import { useLanguage } from '../../LanguageContext';

export default function MessagesPage() {
  const { language } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('erth_currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const storedChats = JSON.parse(localStorage.getItem('erth_chats') || '[]');
    setChats(storedChats);
  }, [currentUser]);

  const t = {
    ar: { title: 'الرسائل والمحادثات', send: 'إرسال', typeMsg: 'اكتب رسالتك هنا...' },
    en: { title: 'Messages', send: 'Send', typeMsg: 'Type your message...' }
  }[language];

  const handleSend = () => {
    if(reply.trim() && activeCompanyId && currentUser) {
      const activeCompany = companies.find(c => c.id === activeCompanyId);
      const newChat = { 
        id: Date.now(), 
        fromId: currentUser.id, 
        fromName: currentUser.name, 
        toId: activeCompanyId, 
        toName: activeCompany.name, 
        text: reply, 
        date: new Date().toISOString() 
      };
      const updatedChats = [...chats, newChat];
      setChats(updatedChats);
      localStorage.setItem('erth_chats', JSON.stringify(updatedChats));
      setReply('');
    }
  };

  if (!currentUser) return null;

  // Group messages by company
  const myChats = chats.filter(c => c.fromId === currentUser.id || c.toId === currentUser.id);
  const companiesMap = {};
  myChats.forEach(msg => {
    const otherId = msg.fromId === currentUser.id ? msg.toId : msg.fromId;
    const otherName = msg.fromId === currentUser.id ? msg.toName : msg.fromName;
    if (!companiesMap[otherId]) {
      companiesMap[otherId] = { id: otherId, name: otherName, messages: [] };
    }
    companiesMap[otherId].messages.push(msg);
  });

  const companies = Object.values(companiesMap);
  const activeCompany = activeCompanyId ? companiesMap[activeCompanyId] : null;

  return (
    <>
      <section className={styles.section} style={{height: '80vh', display: 'flex', flexDirection: 'column'}}>
        <h2 className={styles.sectionTitle}>{t.title}</h2>
        
        {companies.length === 0 ? (
          <div className="glass" style={{padding: '2rem', textAlign: 'center', borderRadius: '1rem'}}>
            لا توجد رسائل حالياً.
          </div>
        ) : (
          <div className="glass" style={{flex: 1, display: 'flex', borderRadius: '1rem', overflow: 'hidden'}}>
            {/* Chat List */}
            <div style={{width: '300px', borderLeft: '1px solid var(--light-gray)', padding: '1rem', background: '#fff', overflowY: 'auto'}}>
              {companies.map((company) => (
                <div 
                  key={company.id} 
                  onClick={() => setActiveCompanyId(company.id)}
                  style={{padding: '1rem', borderBottom: '1px solid var(--light-gray)', cursor: 'pointer', background: activeCompanyId === company.id ? 'var(--light-gray)' : 'transparent', borderRadius: '0.5rem'}}
                >
                  <h4 style={{marginBottom: '0.25rem'}}>{company.name}</h4>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {company.messages.length > 0 ? company.messages[company.messages.length - 1].text : 'لا توجد رسائل'}
                  </p>
                </div>
              ))}
            </div>
            {/* Chat Area */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa'}}>
              {activeCompany ? (
                <>
                  <div style={{padding: '1rem', borderBottom: '1px solid var(--light-gray)', background: '#fff'}}>
                    <h3>محادثة مع: {activeCompany.name}</h3>
                  </div>
                  <div style={{flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {activeCompany.messages.map((msg) => (
                      <div key={msg.id} style={{
                        alignSelf: msg.fromId === currentUser.id ? 'flex-end' : 'flex-start',
                        background: msg.fromId === currentUser.id ? 'var(--primary-teal)' : '#e2e8f0',
                        color: msg.fromId === currentUser.id ? '#fff' : 'var(--text-dark)',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        maxWidth: '70%',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <p style={{margin: 0, fontSize: '0.95rem'}}>{msg.text}</p>
                        <span style={{fontSize: '0.7rem', opacity: 0.7}}>{new Date(msg.date).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{padding: '1rem', background: '#fff', borderTop: '1px solid var(--light-gray)', display: 'flex', gap: '1rem'}}>
                    <input 
                      type="text" 
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder={t.typeMsg} 
                      style={{flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd'}}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="btn-primary" onClick={handleSend}>{t.send}</button>
                  </div>
                </>
              ) : (
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}>
                  اختر محادثة من القائمة للبدء
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
