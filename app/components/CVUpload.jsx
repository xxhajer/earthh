"use client";

import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

export default function CVUpload() {
  const { language } = useLanguage();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const t = {
    ar: { title: 'رفع السيرة الذاتية', drop: 'اسحب وأفلت ملف السيرة الذاتية هنا أو انقر للرفع', formats: 'الصيغ المدعومة: PDF, DOC, DOCX (الحد الأقصى 5 ميجابايت)', errExt: 'عذراً، امتداد الملف غير مدعوم. يرجى رفع PDF أو DOC أو DOCX.', errSize: 'عذراً، حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.', success: 'تم رفع الملف بنجاح! جاري فحصه من الفيروسات...' },
    en: { title: 'Upload CV', drop: 'Drag & drop your CV here or click to browse', formats: 'Supported formats: PDF, DOC, DOCX (Max 5MB)', errExt: 'Unsupported file extension. Please upload PDF, DOC, or DOCX.', errSize: 'File size too large. Max allowed is 5MB.', success: 'File uploaded successfully! Scanning for viruses...' }
  }[language];

  const handleFileChange = (e) => {
    setError('');
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate Extension
    const validExtensions = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validExtensions.includes(selected.type) && !selected.name.match(/\.(pdf|doc|docx)$/i)) {
      setError(t.errExt);
      return;
    }

    // Validate Size (5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setError(t.errSize);
      return;
    }

    setFile(selected);
    alert(t.success);
  };

  return (
    <div style={{padding: '2rem', background: 'var(--soft-white)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--primary-teal)', textAlign: 'center'}}>
      <h3 style={{color: 'var(--primary-blue)', marginBottom: '1rem'}}>{t.title}</h3>
      <input 
        type="file" 
        id="cv-upload" 
        style={{display: 'none'}} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
      <label htmlFor="cv-upload" style={{cursor: 'pointer', display: 'block', padding: '2rem'}}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📄</div>
        <p style={{fontWeight: 'bold'}}>{t.drop}</p>
        <p style={{color: 'var(--text-light)', fontSize: '0.875rem', marginTop: '0.5rem'}}>{t.formats}</p>
      </label>

      {error && <div style={{color: '#dc2626', marginTop: '1rem', padding: '0.5rem', background: '#fef2f2', borderRadius: '4px'}}>{error}</div>}
      {file && !error && <div style={{color: '#059669', marginTop: '1rem'}}>{file.name} - Ready for AI Analysis</div>}
    </div>
  );
}
