import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react';
import AES from 'crypto-js/aes';
import {ENDPOINT} from "../endpoint";
const axios = require('axios');

export default function Home() {

    const [view, setView] = useState(false);
    const [tCop, setTcop] = useState(false);
    const [token, setToken] = useState('');
    const [text, setText] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {

        initToken();
    }, [])

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token])

    function initToken() {
        if ((localStorage.getItem('token') || '') !== '') return setToken(localStorage.getItem('token'));

        setToken(makeid(32))
    }

    function copyToken() {

        navigator.clipboard.writeText(token)

        setTcop(true);

        setTimeout(() => {
            setTcop(false);
        }, 2000);

    }

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function generate() {
        const encrypt = AES.encrypt(text, token);

        console.log(encrypt.toString());

        axios.post(ENDPOINT + '/save', {value: encrypt.toString()}).then((r) => {
            const id = r.data._id;

            setLink(`http://localhost:3000/${id}`)
        })
    }

  return (
    <div className={styles.container}>
      <Head>
        <title>encrypter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <label htmlFor="basic-url" className="form-label">Your text</label>
          <div className="input-group mb-3">
              <textarea
                className="form-control"
                id="basic-url"
                onChange={(e) => {setText(e.target.value)}}
                rows="8"
              />
          </div>
          <div className="input-group">
              <input
                  type={view ? 'text' : 'password'}
                  value={token}
                  className="form-control"
                  placeholder="secret token"
                  onChange={(e) => {setToken(e.target.value)}}
              />
              <button className="input-group-text" onClick={() => {setView(!view)}}>
                      {
                          view ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>
                      }
              </button>
              <button className="input-group-text" onClick={copyToken}>
                  {
                      tCop ? <i className="bi bi-check"></i> : <i className="bi bi-clipboard"></i>
                  }
              </button>
          </div>
          <button className="btn btn-info mt-2" onClick={generate}>generate</button>
          <a href={link} className="mt-2" target="_blank">{link}</a>
      </main>

      <footer className={styles.footer}>
        made by javad
      </footer>
    </div>
  )
}
