import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



function ForgotPassword() {


  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");





  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
        setError("Please enter your email address.");
        return;
    }

    try {
        const response = await api.post(
            "/Auth/forgot-password",
            {
                email: normalizedEmail,
            }
        );

        const data = response.data;

        setMessage(
            data?.message ||
            "If this email exists, a password reset link will be sent."
        );
    } catch (error) {
        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        if (error.response) {
            setError(
                error.response.data?.message ||
                error.response.data?.Message ||
                "Unable to process your request. Please try again."
            );

            return;
        }

        if (error.request) {
            setError(
                "Unable to connect to the AI-PMS server. Please make sure the backend is running."
            );

            return;
        }

        setError(
            "Something went wrong. Please try again."
        );
    }
}





  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      bg-gradient-to-br
      from-slate-950
      via-blue-950
      to-indigo-950
    ">


      <Card className="
        w-full
        max-w-md
        shadow-2xl
        bg-white/95
        rounded-2xl
      ">



        <CardHeader className="text-center space-y-3">


          <div className="
            mx-auto
            w-14
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            flex
            items-center
            justify-center
          ">

            <Mail className="text-white size-7"/>

          </div>



          <CardTitle className="text-2xl font-bold">

            Forgot Password?

          </CardTitle>



          <CardDescription>

            Enter your email to reset your password

          </CardDescription>


        </CardHeader>






        <CardContent>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >



            <div className="space-y-2">


              <Label>

                Email Address

              </Label>



              <div className="relative">


                <Mail className="
                  absolute
                  left-3
                  top-2.5
                  size-4
                  text-blue-600
                "/>



                <Input

                  type="email"

                  placeholder="admin@africom.com"

                  value={email}

                  onChange={(e)=>setEmail(e.target.value)}

                  className="
                    pl-9
                    h-11
                  "

                />


              </div>


            </div>






            {
              error && (

                <p className="
                  text-sm
                  text-red-600
                  bg-red-50
                  p-3
                  rounded-lg
                ">

                  {error}

                </p>

              )
            }






            {
              message && (

                <p className="
                  text-sm
                  text-green-600
                  bg-green-50
                  p-3
                  rounded-lg
                ">

                  {message}

                </p>

              )
            }







            <Button

              type="submit"

              className="
                w-full
                h-11
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
              "

            >

              Send Reset Link

            </Button>







            <Link
              to="/login"
              className="
                flex
                items-center
                justify-center
                gap-2
                text-sm
                text-blue-600
                hover:underline
              "
            >

              <ArrowLeft size={16}/>

              Back to Login

            </Link>



          </form>


        </CardContent>



      </Card>


    </div>

  );

}


export default ForgotPassword;