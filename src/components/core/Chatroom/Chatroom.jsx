import React from 'react'
import Room from './Room';
import style from './Chatroom.module.css';


import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

// import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app);

const Chatroom = ({ chat }) => {

    const [user] = useAuthState(auth);

    return (
        <div className={` ${chat ? 'hide' : 'show'} ${style.chatroom}`}>
            <div className={style.header}>
                <p>Chatroom</p>
                {user && <div className={style.signBtn} onClick={() => auth.signOut()}>Sign Out</div>}
            </div>
            <div className={style.roomSection}>
                {user ? <Room app={app} /> :
                    <button className={`${style.signBtn}`} onClick={signInWithGoogle}>Sign in with Google</button>
                }

            </div>
        </div>
    )
}

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}


export default Chatroom