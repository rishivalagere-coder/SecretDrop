'use client';
import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { createOrUpdateUser } from '@/lib/users';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createOrUpdateUser(user);
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      alert('Failed to sign in');
    }
  };

  if (loading) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)'}}>
      <div style={{width:48,height:48,border:'4px solid white',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
    </div>;
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',padding:16}}>
      <div style={{maxWidth:400,width:'100%',background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',borderRadius:16,padding:32,border:'1px solid rgba(255,255,255,0.2)',textAlign:'center'}}>
        <div style={{fontSize:60,marginBottom:16}}>💬</div>
        <h1 style={{fontSize:36,fontWeight:'bold',color:'white',marginBottom:8}}>SecretDrop</h1>
        <p style={{color:'rgba(255,255,255,0.8)',marginBottom:24}}>Receive anonymous confessions</p>
        <button onClick={handleSignIn} style={{width:'100%',background:'white',color:'#667eea',padding:'12px 24px',borderRadius:8,border:'none',fontWeight:600,fontSize:16,cursor:'pointer'}}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
