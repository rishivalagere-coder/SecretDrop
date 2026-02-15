'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) return router.push('/');
      setUser(u);
      const q = query(collection(db, 'messages'), where('receiverUid', '==', u.uid));
      onSnapshot(q, (snap) => {
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    });
    return () => unsubscribe();
  }, [router]);

  const link = user ? `${window.location.origin}/${user.uid}` : '';
  
  const unlock = async (msgId: string) => {
    await updateDoc(doc(db, 'messages', msgId), { isUnlocked: true });
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',padding:16}}>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h1 style={{fontSize:28,fontWeight:'bold',color:'white'}}>SecretDrop</h1>
          <button onClick={() => signOut(auth)} style={{background:'rgba(255,255,255,0.2)',color:'white',padding:'8px 16px',borderRadius:8,border:'none',cursor:'pointer'}}>Sign Out</button>
        </div>
        
        <div style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',borderRadius:16,padding:24,border:'1px solid rgba(255,255,255,0.2)',marginBottom:24}}>
          <h2 style={{fontSize:20,fontWeight:'bold',color:'white',marginBottom:16}}>Your Link 🔗</h2>
          <div style={{display:'flex',gap:8}}>
            <input value={link} readOnly style={{flex:1,background:'rgba(255,255,255,0.1)',color:'white',padding:12,borderRadius:8,border:'1px solid rgba(255,255,255,0.2)'}} />
            <button onClick={() => {navigator.clipboard.writeText(link);alert('Copied!');}} style={{background:'white',color:'#667eea',padding:'12px 24px',borderRadius:8,border:'none',fontWeight:600,cursor:'pointer'}}>Copy</button>
          </div>
        </div>

        <h2 style={{fontSize:24,fontWeight:'bold',color:'white',marginBottom:16}}>Inbox ({messages.length})</h2>
        
        {messages.map(m => (
          <div key={m.id} style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',borderRadius:16,padding:24,border:'1px solid rgba(255,255,255,0.2)',marginBottom:16}}>
            {m.isUnlocked ? (
              <>
                <p style={{color:'white',fontSize:18,marginBottom:8}}>{m.content}</p>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:14}}>✅ Unlocked</p>
              </>
            ) : (
              <>
                <p style={{color:'white',fontSize:18,filter:'blur(8px)',marginBottom:12}}>This is a secret message...</p>
                <button onClick={() => unlock(m.id)} style={{background:'linear-gradient(135deg,#667eea,#764ba2)',color:'white',padding:'12px 24px',borderRadius:8,border:'none',fontWeight:600,cursor:'pointer'}}>
                  🔓 Unlock (Free for now!)
                </button>
              </>
            )}
          </div>
        ))}
        
        {messages.length === 0 && (
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.6)',padding:48}}>
            <div style={{fontSize:60,marginBottom:16}}>📭</div>
            <p>No messages yet. Share your link!</p>
          </div>
        )}
      </div>
    </div>
  );
}
