'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Send() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length < 10) return;
    try {
      await addDoc(collection(db, 'messages'), {
        content: message,
        receiverUid: params.username,
        timestamp: serverTimestamp(),
        isUnlocked: false,
      });
      setSent(true);
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      alert('Failed to send');
    }
  };

  if (sent) {
    return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',borderRadius:16,padding:48,border:'1px solid rgba(255,255,255,0.2)',textAlign:'center'}}>
        <div style={{fontSize:80,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:32,fontWeight:'bold',color:'white',marginBottom:8}}>Message Sent!</h2>
        <p style={{color:'rgba(255,255,255,0.8)'}}>Your anonymous message was delivered 🚀</p>
      </div>
    </div>;
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{maxWidth:600,width:'100%',background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',borderRadius:16,padding:32,border:'1px solid rgba(255,255,255,0.2)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:60,marginBottom:16}}>💬</div>
          <h1 style={{fontSize:28,fontWeight:'bold',color:'white',marginBottom:8}}>Send Anonymous Message</h1>
          <p style={{color:'rgba(255,255,255,0.8)'}}>They'll never know it's you! 🤫</p>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your secret message here..." 
            rows={6} 
            maxLength={500}
            style={{width:'100%',background:'rgba(255,255,255,0.1)',color:'white',padding:16,borderRadius:8,border:'1px solid rgba(255,255,255,0.2)',marginBottom:8,fontSize:16,fontFamily:'inherit'}} 
            required 
          />
          <div style={{textAlign:'right',color:'rgba(255,255,255,0.6)',fontSize:14,marginBottom:16}}>
            {message.length}/500 {message.length >= 10 ? '✓' : '(min 10 chars)'}
          </div>
          <button 
            type="submit" 
            disabled={message.length < 10}
            style={{width:'100%',background:message.length < 10 ? 'rgba(255,255,255,0.3)' : 'white',color:'#667eea',padding:16,borderRadius:8,border:'none',fontWeight:'bold',fontSize:18,cursor:message.length < 10 ? 'not-allowed' : 'pointer'}}
          >
            Send Anonymously 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
