import NavBarCss from "./NavBar.module.css"
import Logo from "../../assets/ISeeLogo.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";


const NavBar = ({ onSearchInputChange,  }) => {
    const navigate = useNavigate();
    const [bool, SetBool] = useState(false);

    const checkAdmin = async() => {
        if (Cookies.get("role") === "admin") {
            SetBool(true);
        } else {
            SetBool(false);
        }
    }

    const Logout = async() => {
        await fetch("http://localhost:4000/users/logout", {
            credentials: 'include'
          })
        Cookies.remove('_id');
        Cookies.remove('userName');
        navigate("/Login");
    }

    useEffect(() => {
        checkAdmin();
    }, []);

    return (
    <>
        <header>
            <div className={NavBarCss.maindiv}>
                <section className={NavBarCss.logo}>
                    <img src={Logo} width="170" height="80" onClick={event => window.location.href = '/'} />
                </section>

                <section className={NavBarCss.searchbar}>
                    <input className={NavBarCss.input} type="text" name="name" placeholder="Search" onChange={onSearchInputChange} />
                </section>

                <section className={NavBarCss.profile}>
                    {bool ?
                        <button onClick={event => window.location.href = '/AdminCenter'}>Admin Center</button>
                    :
                        <p></p>
                    }
                    <button onClick={event => window.location.href = '/Profile'}>Profile</button>
                    <button onClick={Logout}>Log out </button>
                </section>
            </div>
        </header>    
    </>
    )
} 
export default NavBar;