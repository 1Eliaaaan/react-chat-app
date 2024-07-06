import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });
    const [loading, setLoading] = useState(false)
    const handleAvatar = (e: any) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleLogin = async(e: any) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);
        try {
   const login =    await signInWithEmailAndPassword(auth,email as string,password as string)
      console.log("login",login)
        toast.success("Login Successfully!")
        } catch (error : any) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email as string, password as string);
            console.log(res);
            
            const imgUrl = await upload(avatar.file)


            // Add a new document in collection "cities"
              await setDoc(doc(db, "users", res.user.uid), {
            username,
            email,
            avatar : imgUrl,
            id : res.user.uid,
            blocked:[],
  });

            await setDoc(doc(db, "userchats", res.user.uid), {
            chats: [],
})


  toast.success("Account created! You can login now!")
  


        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome Back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">Upload a Image
                        <img src={avatar.url || "/src/assets/avatar.png"} alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading} >{ loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;