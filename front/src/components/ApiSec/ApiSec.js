import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export const CheckUser = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("_id");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/users/verify-account", {
          credentials: 'include'
        });

        if (response.status !== 200) {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, [navigate, token]);
};