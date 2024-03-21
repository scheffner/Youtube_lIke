import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegisterCSS from "./Register.module.css"
import axios from "axios";

const NAME_SEC = /^[A-z][A-z0-9-_]{3,23}$/;
const PASS_SEC = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = 'http://localhost:4000/users/signup';

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
  
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(NAME_SEC.test(name));
    }, [name])

    useEffect(() => {
        setValidPassword(PASS_SEC.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [name, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = NAME_SEC.test(name);
        const v2 = PASS_SEC.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name, email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setEmail('');
            setName('');
            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }
    return (
        <>
        <body className={RegisterCSS.body}>
            <div className={RegisterCSS.divContainer}>
            {success ? (
                <section className={RegisterCSS.section}>
                    <h1>Success!</h1>
                    <p>
                        <a href="/Login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section className={RegisterCSS.section}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                    <h1>Register</h1>

                    <form className={RegisterCSS.form} onSubmit={handleSubmit}>
                    <label className={RegisterCSS.lable} htmlFor="email"> Email: </label>
                        <input type="text" id="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        
                        <label className={RegisterCSS.label} htmlFor="username"> Username: <FontAwesomeIcon icon={faCheck} className={validName ? RegisterCSS.valid : RegisterCSS.hide} /> <FontAwesomeIcon icon={faTimes} className={validName || !name ? RegisterCSS.hide : RegisterCSS.invalid} /> </label>
                        <input type="text" id="username" ref={userRef} autoComplete="off" onChange={(e) => setName(e.target.value)} value={name} required aria-invalid={validName ? "false" : "true"} aria-describedby="uidnote" onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)} />
                        <p id="uidnote" className={userFocus && name && !validName ? RegisterCSS.instructions : RegisterCSS.offscreen}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                        </p>

                        <label className={RegisterCSS.label} htmlFor="password"> Password: <FontAwesomeIcon icon={faCheck} className={validPassword ? RegisterCSS.valid : RegisterCSS.hide} /> <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? RegisterCSS.hide : RegisterCSS.invalid} /> </label>
                        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} required aria-invalid={validPassword ? "false" : "true"} aria-describedby="passwordnote" onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="passwordnote" className={passwordFocus && !validPassword ? RegisterCSS.instructions : RegisterCSS.offscreen}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        <label className={RegisterCSS.label} htmlFor="confirm_password"> Confirm Password: <FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? RegisterCSS.valid : RegisterCSS.hide} /> <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? RegisterCSS.hide : RegisterCSS.invalid} /> </label>
                        <input type="password" id="confirm_password" onChange={(e) => setMatchPassword(e.target.value)} value={matchPassword} required aria-invalid={validMatch ? "false" : "true"} aria-describedby="confirmnote" onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} />
                        <p id="confirmnote" className={matchFocus && !validMatch ? RegisterCSS.instructions : RegisterCSS.offscreen}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        <button className={RegisterCSS.button} disabled={!validName || !validPassword || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="/Login">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
            </div>
        </body>
        </>
    )
}

export default Register