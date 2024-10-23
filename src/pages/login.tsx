import React, { useEffect, useRef, useState } from 'react';
import { loadUsername, storeUsername, useUserStore } from '../store/auth-user';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const setUsername = useUserStore((state) => state.setUsername);
  const navigate = useNavigate();
  const loginButton2Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const savedUsername = loadUsername();
    if (savedUsername) {
      navigate('/');
    }
  }, [navigate]);

  const onLogin = () => {
    const name = nameRef.current?.value.trim() || '';
    // if (name) {
    storeUsername(name);
    setUsername(name);
    console.log('Logged in as:', name);
    navigate('/');
    // } else {
    // setError('Please enter a valid name');
    // }
  };
  const onLoginButton2Click = () => {
    console.log('clicksssss');
    const buttonText = loginButton2Ref.current?.textContent?.trim() || '';
    console.log('Button text:', buttonText);
    onLogin();
  };

  return (
    <div
      className="h-screen overflow-hidden z-[999]"
      style={{
        background:
          'linear-gradient(to top, rgb(75, 164, 69) 0%, rgb(16, 79, 80) 40%, rgb(0, 0, 0) 65%)',
      }}
    >
      <div className="z-50 absolute left-4 top-4">
        <img
          src="./assets/images/logo.png"
          alt="logo"
          className="object-contain w-28"
        />
      </div>
      <div
        className="bg-cover bg-center w-full h-full flex justify-center mt-10"
        style={{
          backgroundImage:
            'url(https://verchool-image-bucket.s3.amazonaws.com/verchool.online/features_bg.png)',
        }}
      >
        <div className="w-[100%]">
          <div className="mt-20 md:mt-[3.4rem]">
            <div className="flex items-center justify-center">
              <h2 className="mb-20 font-futurism mr-4 text-xl md:text-4xl">
                BOARDROOM LIVE
              </h2>
            </div>
            <div className="flex justify-center">
              <div className="flex md:w-[25rem] w-[20rem] flex-col pb-20 pt-16 border-[1px] border-[#f3f4f6] rounded-3xl bg-[#111827] p-8 text-white">
                <h1 className="text-xl font-futurism md:text-4xl text-center">
                  LOGIN
                </h1>
                <div className="mt-8">
                  <input
                    ref={nameRef}
                    className="mt-2 w-full rounded-xl border-[1px] border-[#f3f4f6] bg-transparent py-3 px-4 leading-tight text-white placeholder-gray-500 focus:border-green-400 focus:bg-transparent focus:outline-none"
                    id="name"
                    placeholder="Name"
                    type="text"
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                <button
                  id="loginButton"
                  onClick={onLogin}
                  className="mt-16 w-full rounded bg-[#43f558] py-2 px-4 font-semibold text-sm uppercase tracking-wider text-black hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300"
                >
                  Login
                </button>

                <div
                  id="loginButton2"
                  ref={loginButton2Ref}
                  className="bg-black text-white py-4 px-2"
                  onClick={onLoginButton2Click}
                >
                  Calling login
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
