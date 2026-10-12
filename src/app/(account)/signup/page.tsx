import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create an Account",
};

const Signup = () => {
  return <SignupForm />;
};

export default Signup;
