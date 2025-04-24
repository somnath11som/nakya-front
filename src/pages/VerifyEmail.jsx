import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "../assets/Images/loginImg/LogoImg.png"

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  const handleVerify = async () => {
    if (!token) {
      setMessage(" Invalid verification link.");
      toast.error("Invalid verification link.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`https://crp.mydevfactory.com/api/users/verify-email/${token}/`);
      if (response.data.status === 1) {
        setMessage("✅ Email verified successfully!");
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("❌ Verification failed. The link may be expired.");
        toast.error("Verification failed. The link may be expired.");
      }
    } catch (error) {
      setMessage("⚠️ Email already verified.");
      toast.warning("Email already verified.");
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#38383866] p-8 rounded-lg md:w-2/5 w-full shadow-lg px-10 py-14">
      <img src={Logo} alt="" className="mx-auto mb-5 w-[8vw]"/>
        <h2 className="text-2xl font-semibold text-white text-center mb-4">Email Verification</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Please click the button below to verify your email.</p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-1/2 bg-[#BBA14F] text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {message && (
          <p className="text-center mt-6 font-medium">
            <span
              className={`
              ${message.includes("✅") ? "text-green-500" : ""}
              ${message.includes("❌") ? "text-red-500" : ""}
              ${message.includes("⚠️") ? "text-yellow-500" : ""}
            `}
            >
              {message}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
