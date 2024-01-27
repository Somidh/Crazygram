import React from "react";
import SignUpForm from "./SignUpForm";
import { AuthFormHeader } from "../AuthFormHeader";

const page = () => {
  return (
    <div className="sm:w-96">
      <AuthFormHeader
        title="Create a new account"
        subtitle="To use snapgram, Please enter your details"
        // noAccountText="Don't have an account?"
        // switchPageUrl="/signUp"
        // switchPageUrlText="Sign up"
      />
      <SignUpForm />
    </div>
  );
};

export default page;
