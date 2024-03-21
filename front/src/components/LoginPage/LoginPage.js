import { useRef, useState, useEffect } from 'react';
import LoginCSS from "./Login.module.css"
import axios from "axios";
import Cookies from 'js-cookie';
import LogoIsee from '../../assets/ISeeLogo.png'

const LOGIN_URL = 'http://localhost:4000/users/login';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [name, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ name, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            fetch("http://localhost:4000/users/getUser/" + response.data._id)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                Cookies.set('role', data.role);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            Cookies.set('_id', response.data._id, { expires: 7 });
            Cookies.set('userName', name);
            setName('');
            setPassword('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setErrorMessage('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Login Failed');
            }
            errRef.current.focus();
        }
    }


    return (
        <>
            <body className={LoginCSS.body}>
            {success ? (
                <section className={LoginCSS.section}>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="/">Go to Home</a>
                    </p>
                </section>
            ) : (
                <div className={LoginCSS.divContainer}>
                    <img alt='Logo de ISee' src={LogoIsee}></img>
                    <section className={LoginCSS.section}>
                        <p ref={errRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>
                        <h1>Sign In</h1>
                        <form className={LoginCSS.form} onSubmit={handleSubmit}>
                            <label className={LoginCSS.label} htmlFor="username">Username:</label>
                            <input className={LoginCSS.input}
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                            />

                            <label className={LoginCSS.label} htmlFor="password">Password:</label>
                            <input className={LoginCSS.input}
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                            <button className={LoginCSS.button}>Sign In</button>
                        </form>
                        <p>
                            Need an Account?<br />
                            <span className={LoginCSS.line}>
                                {/*put router link here*/}
                                <a href="/Register">Sign Up</a>
                            </span>
                        </p>
                    </section>
                </div>
            )}
            </body>
        </>
    )
}

export default Login