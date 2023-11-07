import React, { useEffect, useRef, useState } from 'react'
import style from './Chatroom.module.css'

import { getFirestore, collection, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore'

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from 'firebase/auth';
import Message from './Message';
import axios from 'axios';

const key = process.env.REACT_APP_GIF_API_KEY;
const URL = `${process.env.REACT_APP_GIF_SEARCH_URL}?api_key=${key}`;


const Room = ({ app }) => {
    const db = getFirestore(app);
    const auth = getAuth(app);

    const dummy = useRef();
    const messagesRef = collection(db, 'messages');
    let q = query(messagesRef, orderBy("createdAt", "desc"), limit(30));
    q = query(messagesRef, orderBy("createdAt"));

    const [messages] = useCollectionData(q, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const [loader, setLoader] = useState(false);

    const [links, setLinks] = useState([]);

    useEffect(() => {
        if(formValue.length === 0){
            return;
        }
        const setting = async()=>{
            setLoader(true);
            setLinks([]);
            dummy.current.scrollIntoView({ behavior: 'smooth' });
            const temp = await generateSearched(formValue)
            setLinks(temp);
            setLoader(false);
        }

        setting();
    }, [formValue]);


    const sendMessage = async (l) => {
        const { uid, photoURL } = auth.currentUser;
        setFormValue('');
        setLinks([]);

        await addDoc(collection(db, "messages"), {
            link: l,
            createdAt: serverTimestamp(),
            uid,
            photoURL
        })

    }

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const width = useRef();


    return (
        <div className={style.roomSection}>
            <main className={style.messageSection}>
                {messages && messages.map(msg => <Message key={msg.id} message={msg} app={app} />)}
                <span ref={dummy}></span>
            </main>
            <form onSubmit={(e) => e.preventDefault()} className={style.formSection}>
                <div ref={width} style={{ width: '100%', height: 0 }}></div>
                {formValue &&
                    <div className={style.options} style={{ maxWidth: width.current.offsetWidth }}>
                        {
                            loader ? <div className={style.spinnerSection}>
                                <div className='Spinner' />
                            </div> :
                                links.length > 0 ?
                                    links?.map((link, index) => (<Gifs link={link} index={index} sendMessage={sendMessage} />)) :
                                    <div className={style.spinnerSection}>Not Found</div>
                        }
                    </div>
                }
                <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} placeholder="search something nice..." />

            </form>
        </div>)
}

const Gifs = ({ link, index, sendMessage }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={style.optionImg}>
            <div style={{ display: loaded ? 'none' : 'block', margin: '12px' }} className='Spinner' />
            <img style={{ height: loaded ? '80px' : '0px' }} onLoad={() => setLoaded(true)} src={link} key={index} alt='gif' onClick={() => sendMessage(link)} />
        </div>
    )
}

async function generateSearched(search) {
    const url = `${URL}&q=${search}&limit=10`;
    const giphyData = await axios.get(url);
    const data = giphyData.data.data.map((item) => item.images.preview_gif.url);
    return data;
}

export default Room