import { AuthFormHeader } from "../AuthFormHeader";
import SignInForm from "./SignInForm";

const page = () => {
  return (
    <div className="sm:w-96">
      <AuthFormHeader
        title="Log in to your account"
        subtitle="Welcome back! Please enter your details"
      />
      <SignInForm />
    </div>
  );
};

export default page;
