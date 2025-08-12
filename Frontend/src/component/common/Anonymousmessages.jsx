import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { FaRegSmile, FaRegImage } from "react-icons/fa";

const Anonymousmessages = () => {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Store message in localStorage
    fetch("/api/anonymous/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setSubmitted(true);
    console.log("Form submitted:", formData);
  };

  // Handle form data changes

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [formData.category]: {
          ...prev[formData.category],
          [name]: files,
        },
      }));
    } else if (name.includes(".")) {
      const [category, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6 flex items-center sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <IoMdArrowBack className="mr-2" />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-center flex-grow">
          Anonymous Message
        </h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSend className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Message Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              Your message has been sent anonymously. Thank you for sharing your
              thoughts!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors w-full"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-center">
                <h2 className="text-2xl font-bold text-white">
                  Send Anonymous Message
                </h2>
                <p className="text-indigo-100 mt-1">
                  Your identity will remain completely hidden
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block font-medium mb-3 text-gray-700">
                    Describe your concern:
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none min-h-[120px]"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => handleChange(e, "message")}
                      name="message"
                      required
                    ></textarea>
                    <FaRegSmile className="absolute right-4 top-4 text-gray-400 cursor-pointer hover:text-indigo-500 transition-colors" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all w-full flex items-center justify-center"
                >
                  <FiSend className="mr-2" />
                  Send Anonymously
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <h3 className="font-medium text-gray-700 mb-2">How it works</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <span>Write</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <span>Send</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <span>Stay Anonymous</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anonymousmessages;
