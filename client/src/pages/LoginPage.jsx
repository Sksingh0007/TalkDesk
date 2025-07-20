import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from '../../context/AuthContext';


const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const [bio, setBio] = useState("");

  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {login} = useContext(AuthContext)


const onSubmitHandler = (event) => {
  event.preventDefault();

  if (!agreeToTerms) {
    alert("Please Agree to the terms of use & privacy policy.!");
    return;
  }

  if (currState === "Sign up" && !isDataSubmitted) {
    setIsDataSubmitted(true);
    return;
  }

  const credentials =
    currState === "Sign up"
      ? { fullName, email, password, bio }
      : { email, password };

  login(currState === "Sign up" ? "signup" : "login", credentials);
};



  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* --------------left------------ */}
      <img src={assets.logo_big} alt="" className="w-[min(40vw,500px)]" />

      {/* ------------right--------- */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-grey-500 p-6 flex flex-col gap-4 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => {
                setIsDataSubmitted(false);
              }}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full p-2 pr-10 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/*  Heroicons toggle */}
              {showPassword ? (
                <EyeIcon
                  className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeSlashIcon
                  className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </>
        )}

        {isDataSubmitted && currState === "Sign up" && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}
        <button
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
          type="submit"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-grey-500">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            id="terms"
          />
          <label htmlFor="terms">
            Agree to the <span className="underline">terms of use</span> &{" "}
            <span className="underline">privacy policy</span>.
          </label>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginPage
