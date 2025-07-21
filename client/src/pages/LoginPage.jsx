import React, { useContext, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { login } = useContext(AuthContext);

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
    <div className="min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl p-4">
      {/* Logo Section */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(40vw,500px)]" />

      {/* Card Form Section */}
      <Card className="w-full max-w-sm shadow-lg backdrop-blur-xl">
        <form onSubmit={onSubmitHandler}>
          <CardHeader className="flex flex-row justify-between items-center gap-5">
            <CardTitle>{currState}</CardTitle>
            {isDataSubmitted && (
              <img
                onClick={() => setIsDataSubmitted(false)}
                src={assets.arrow_icon}
                className="w-5 cursor-pointer"
                alt="Back"
              />
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {currState === "Sign up" && !isDataSubmitted && (
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            {!isDataSubmitted && (
              <>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  {showPassword ? (
                    <EyeIcon
                      className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </>
            )}

            {isDataSubmitted && currState === "Sign up" && (
              <Textarea
                rows={4}
                placeholder="Provide a short bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            )}

            <div className="flex items-center space-x-2 text-sm">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(Boolean(checked))}
              />
              <Label htmlFor="terms">
                Agree to the <span className="underline">terms of use</span> &{" "}
                <span className="underline">privacy policy</span>.
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-1">
            <Button type="submit" className="w-full m-3 cursor-pointer">
              {currState === "Sign up" ? "Create Account" : "Login Now"}
            </Button>

            {currState === "Sign up" ? (
              <p className="text-sm">
                Already have an account?{" "}
                <span
                  className="font-medium underline cursor-pointer"
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-sm">
                Create an account{" "}
                <span
                  className="font-medium underline cursor-pointer"
                  onClick={() => setCurrState("Sign up")}
                >
                  Click here
                </span>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
