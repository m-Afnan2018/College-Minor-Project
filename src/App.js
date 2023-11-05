import { useState } from 'react';
import './App.css';
import Chatroom from './components/core/Chatroom/Chatroom';
import Generate from './components/core/Generate/Generate';

function App() {
    const [chat, setChat] = useState(false);
    return (
        <div className="App">
            <h1 className='main-heading'>Dynamic GIF Generator</h1>
            <div className='sections'>
                <Generate chat={chat}/>
                <Chatroom chat={chat}/>
            </div>
            <div className='buttonStyle hidden' onClick={()=>setChat(!chat)}>{chat ? 'Switch to Chat' : 'Switch to Generate'}</div>
        </div>
    );
}

export default App;
