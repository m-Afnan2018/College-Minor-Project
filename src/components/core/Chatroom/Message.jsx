import { getAuth } from 'firebase/auth'
import React from 'react'
import style from './Chatroom.module.css'


const Message = (props) => {
    const { link, uid, photoURL, app } = props.message;

    const auth = getAuth(app);

    const messageClass = uid === auth.currentUser.uid ? style.sent : style.received;

    return (<>
        <div className={`${style.message} ${messageClass}`}>
            <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='user' />
            <div>
                <img src={link} alt='gif' />
            </div>
        </div>
    </>)
}

export default Message