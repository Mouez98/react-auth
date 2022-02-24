import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-contex";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory();

  const authCtx = useContext(AuthContext)

  const enteredEmailRef = useRef();
  const enteredPasswordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = enteredEmailRef.current.value;
    const enteredPassword = enteredPasswordRef.current.value;
    setIsLoading(true)
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4nuNJFr4S6ceGOYWuZdnavN25466Bcao'
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4nuNJFr4S6ceGOYWuZdnavN25466Bcao"
    }
    fetch(
      url ,
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => {
      setIsLoading(false)
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then((data) => {
          let errorMessage = 'Authentication failed';
          // if(data && data.error && data.error.message){
          //   errorMessage = data.error.message
          // }
          
          throw new Error(errorMessage)
        });
      }
    }).then(data => {
      const expirationTime = new Date(new Date().getTime() + +data.expiresIn*1000)
      console.log(expirationTime.toISOString())
      authCtx.login(data.idToken, expirationTime.toISOString())
      history.replace('/')
    }).catch(err => {
      alert(err.message);
    })
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={enteredEmailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={enteredPasswordRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
