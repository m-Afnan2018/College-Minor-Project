import React, { useState } from 'react'
import style from './Generate.module.css'
import axios from 'axios';
import gifImage from '../../../assets/giphy.gif'

const key = process.env.REACT_APP_GIF_API_KEY;
const URL = `${process.env.REACT_APP_URL}?api_key=${key}`;

const Generate = ({chat}) => {
    const [gifUrl, setGifUrl] = useState(gifImage);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    const generate = async()=>{
        setLoader(true);
        if(search.length === 0){
            setGifUrl(await generateRandom());
        }else{
            setGifUrl(await generateSearched(search));
        }
        setLoader(false);
    }

    const inputHandler = (e)=>{
        setSearch(e.target.value)
    }

    return (
        <div className={` ${chat ? 'show':'hide'} ${style.generate}`}>
            <div className={style.gifPart}>
                {
                    loader ? <div className='Spinner'/> : 
                    <div className={style.gif}  style={{backgroundImage: `url(${gifUrl})`}}/>
                }
            </div>
            <div className={`${style.opt}`}>
                <div className={`${style.optBtn} ${style.btn}`} onClick={()=>Download(gifUrl, search)}>Download</div>
            </div>
            <input type='text' className={`${style.txtArea}`} placeholder='Search GIF' value={search} onChange={inputHandler} onKeyDown={(btn) => {btn.key==='Enter' && generate()}}/>
            <div className={`${style.gen} ${style.btn}`} onClick={generate}>Generate {search.length === 0 ? "Random" : "Searched"}</div>
        </div>
    )
}

async function generateRandom(){
    const url = URL;
    const {data} = await axios.get(url);
    let gifUrl = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGU5ODAzMGI4NWU5NDM1MGNmMWU2YjA5NDVmNzc5NDA4MzcwMWMxNyZjdD1n/C21GGDOpKT6Z4VuXyn/giphy.gif';
    if(data?.data?.images){
      gifUrl = data?.data?.images.downsized_large.url;
    }
    return gifUrl;
}

async function generateSearched(search){
    const url = `${URL}&tag=${search}`;
    const {data} = await axios.get(url);
    let gifUrl = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGU5ODAzMGI4NWU5NDM1MGNmMWU2YjA5NDVmNzc5NDA4MzcwMWMxNyZjdD1n/C21GGDOpKT6Z4VuXyn/giphy.gif';
    if(data?.data?.images){
      gifUrl = data?.data?.images.downsized_large.url;
    }
    return gifUrl;
}

async function Download(gif, search){
    const rawImage = await fetch(gif);
    const blobImage = await rawImage.blob();

    const aElement = document.createElement('a');
    aElement.setAttribute('download', `gif-${search ? search:'random'}`);
    const href = window.URL.createObjectURL(blobImage);
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    window.URL.revokeObjectURL(href);
}

export default Generate;