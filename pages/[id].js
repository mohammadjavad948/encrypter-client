import AES from 'crypto-js/aes';
import {useRouter} from "next/router";
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react';
import {ENDPOINT} from "../endpoint";
import Head from "next/head";
const cr = require('crypto-js');
const axios = require('axios');

export default function Decrypt({data}) {

    const [text, setText] = useState('')
    const [key, setKey] = useState(false)
    const [token, setToken] = useState('')


    function unlock(){
        const dec = AES.decrypt(data, token);
        setText(dec.toString(cr.enc.Utf8));

        setKey(true)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>encrypter</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                {
                    key ? <div>{text}</div> :  <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="secret token"
                            onChange={(e) => {setToken(e.target.value)}}
                        />
                        <button className="input-group-text" onClick={unlock}>
                            <i className="bi bi-check"></i>
                        </button>
                    </div>
                }
            </main>

            <footer className={styles.footer}>
                made by javad
            </footer>
        </div>
    )
}


export async function getServerSideProps(context){

    const {id} = context.query;

    const r = await axios.get(ENDPOINT + '/f/' + id);

    return { props: { data: r.data.value } }

}
