import { AuthFormHeader } from "../AuthFormHeader";
import SignInForm from "./SignInForm";

import React from "react";

const page = () => {
  return (
    <div className="sm:w-96">
      <AuthFormHeader
        title="Log in to your account"
        subtitle="Welcome back! Please enter your details"
        // noAccountText="Don't have an account?"
        // switchPageUrl="/signUp"
        // switchPageUrlText="Sign up"
      />
      <SignInForm />
    </div>
  );
};

export default page;
