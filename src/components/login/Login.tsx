import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatar = (e: any) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      toast.success("Login Successfully!");
      navigate('/chat');
    } catch (error: any) {
      console.log(error);
      toast.error('Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setRegisterLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });
      
      // After successful registration, automatically sign in and redirect
      toast.success("Account created successfully! Redirecting to chat...");
      
      // Small delay to ensure Firestore documents are fully written
      setTimeout(() => {
        navigate('/chat');
      }, 1000);
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2 className="title">Welcome Back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loginLoading} className={loginLoading ? '' : ''}>
            {loginLoading ? (
              <div className="auth-button-loader-container">
                <div className="auth-button-loader"></div>

              </div>
            ) : (
              "Sign In"
            )}
          </button>
          <a className="subtitle" href="">
            Forgot Password?
          </a>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2 className="title">Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label className="subtitle" htmlFor="file">
            Upload an Image
            <img src={avatar.url || "/src/assets/avatar.png"} alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={registerLoading} className={registerLoading ? '' : ''}>
            {registerLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
          
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
