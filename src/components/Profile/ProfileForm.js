import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-contex";

import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const enteredPasswordRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredPassword = enteredPasswordRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB4nuNJFr4S6ceGOYWuZdnavN25466Bcao",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => {
      //Assuming: always succeeds
    })
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={enteredPasswordRef} minLength='7' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
