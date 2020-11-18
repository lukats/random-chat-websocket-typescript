import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/user';
import { signIn, signUp } from '../../reducers/user';
import { SET_ALL } from '../../reducers/user/actionTypes';
import './Sign.css';

function Sign(): JSX.Element {
  const [pseudo, setPseudo] = useState('');
  const [age, setAge] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [signInMode, setSignInMode] = useState(true);
  const [inputNotFilled, setInputNotFilled] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [ageLimit, setAgeLimit] = useState(false);
  const { dispatch } = useContext(UserContext);

  const registerUser = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (pseudo === '' || password1 === '' || password2 === '' || age === '') {
      setInputNotFilled(true);
      event.preventDefault();
      return;
    }
    if (password1 !== password2 && password1 !== '') {
      setErrorPassword(true);
      event.preventDefault();
      return;
    }
    if (parseInt(age) < 18) {
      setAgeLimit(true);
      event.preventDefault();
      return;
    }
    signUp(dispatch)({
      type: SET_ALL,
      payload: { password: password1, username: pseudo }
    });
  };

  const sign = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (signInMode) {
      if (pseudo === '' || password1 === '') {
        setInputNotFilled(true);
        event.preventDefault();
        return;
      }
      signIn(dispatch)({
        type: SET_ALL,
        payload: { password: password1, username: pseudo }
      });
    } else {
      registerUser(event);
    }
  };

  const switchFunction = () => {
    setInputNotFilled(false);
    setSignInMode((prevSignIn) => !prevSignIn);
  };

  return (
    <div className="signOuterContainer">
      <div className="signInnerContainer">
        <h1 className="heading">Sign {signInMode ? 'In' : 'Up'}</h1>
        <div>
          <input
            placeholder="Pseudo"
            className={`signInput ${
              inputNotFilled && pseudo === '' && 'makeItRed'
            }`}
            type="text"
            onChange={(e) => {
              setPseudo(e.target.value);
            }}
            value={pseudo}
          />
        </div>
        {!signInMode && (
          <div>
            <input
              placeholder="Age"
              className={`signInput mt-20 ${
                ((inputNotFilled && age === '') || ageLimit) && 'makeItRed'
              }`}
              type="number"
              onChange={(e) => {
                const num = parseInt(e.target.value);
                setAge(`${num}`);
                setAgeLimit(false);
              }}
              value={age}
            />
          </div>
        )}
        <div>
          <input
            placeholder="Password"
            className={`signInput mt-20 ${
              ((inputNotFilled && password1 === '') || errorPassword) &&
              'makeItRed'
            }`}
            type="password"
            onChange={(e) => {
              setPassword1(e.target.value);
              setErrorPassword(false);
            }}
            value={password1}
          />
        </div>
        {!signInMode && (
          <div>
            <input
              placeholder="Confirm Password"
              className={`signInput mt-20 ${
                ((inputNotFilled && password2 === '') || errorPassword) &&
                'makeItRed'
              }`}
              type="password"
              onChange={(e) => {
                setPassword2(e.target.value);
                setErrorPassword(false);
              }}
              value={password2}
            />
          </div>
        )}
        <button className="button mt-20" onClick={sign} type="submit">
          Sign {signInMode ? 'In' : 'Up'}
        </button>
        <button className="button mt-20 switch" onClick={switchFunction}>
          Switch to Sign {signInMode ? 'Up' : 'In'}
        </button>
      </div>
    </div>
  );
}

export default Sign;
