import React, { useState } from "react";
import {
  FaUserCheck,
  FaUserGraduate,
  FaBuilding,
  FaUsers,
  FaQuestionCircle,
  FaUser,
  FaIdCard,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack, IoMdCheckmarkCircle } from "react-icons/io";
import { useAuth } from "../context/authContext.jsx";

const Myinfo = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    academic: { department: "", course: "", issueType: "" },
    personal: { issueType: "" },
    fellowStudent: { relationship: "", issueType: "" },
    hostel: { name: "", room: "", issueType: "", photos: [] },
    other: { details: "", photos: [] },
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // For multi-step form

  const navigate = useNavigate();

  //error state
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null); // Reset error

    const dataWithUserId = {
      ...formData,
      fullname: currentUser.name,
      studentRef: currentUser.studentRef,
      userId: currentUser._id,
    };

    delete dataWithUserId.email;

    fetch("/api/userinfo/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataWithUserId),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to submit form");
          });
        }
        setSubmitted(true);
      })
      .catch((error) => {
        console.error("Submission error:", error);
        setSubmitError(error.message);
      });
  };

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

  const renderCategoryFields = () => {
    {
      submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{submitError}</p>
        </div>
      );
    }

    switch (formData.category) {
      case "academic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="academic.department"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={formData.academic.department}
                onChange={handleChange}
                required
                placeholder="Enter your department"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Course Name/Code
              </label>
              <input
                type="text"
                name="academic.course"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={formData.academic.course}
                onChange={handleChange}
                required
                placeholder="e.g. CS101"
              />
            </div>
          </div>
        );
      case "personal":
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Nature of Issue:
              </label>
              <select
                name="personal.issueType"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-300 focus:outline-none"
                value={formData.personal.issueType}
                onChange={handleChange}
                required
              >
                <option value="">Select issue type</option>
                <option value="accommodation">Accommodation</option>
                <option value="harassment">Harassment/Bullying</option>
                <option value="stress">Stress</option>
                <option value="relationship">Relationship</option>
                <option value="family">Family</option>
                <option value="financial">Financial</option>
                <option value="mentalHealth">Mental Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );
      case "fellowStudent":
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Relationship:
              </label>
              <select
                name="fellowStudent.relationship"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-300 focus:outline-none"
                value={formData.fellowStudent.relationship}
                onChange={handleChange}
                required
              >
                <option value="">Select relationship</option>
                <option value="friend">Friend</option>
                <option value="classmate">Classmate</option>
                <option value="roommate">Roommate</option>
                <option value="acquaintance">Acquaintance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Nature of Issue:
              </label>
              <select
                name="fellowStudent.issueType"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-300 focus:outline-none"
                value={formData.fellowStudent.issueType}
                onChange={handleChange}
                required
              >
                <option value="">Select issue type</option>
                <option value="conflict">Conflict</option>
                <option value="bullying">Bullying</option>
                <option value="harassment">Harassment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case "hostel":
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Hostel Name:
              </label>
              <input
                type="text"
                name="hostel.name"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-300 focus:outline-none"
                value={formData.hostel.name}
                onChange={handleChange}
                placeholder="e.g. Unity Hall"
                required
              />
              <div className="mt-3">
                <label className="block font-medium mb-2 text-gray-700">
                  Room Number
                </label>
                <input
                  type="text"
                  name="hostel.room"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  value={formData.hostel.room}
                  onChange={handleChange}
                  placeholder="e.g. Room 305"
                  required
                />
              </div>

              <div className="mt-3">
                <label className="block font-medium mb-2 text-gray-700">
                  Issue
                </label>
                <select
                  name="hostel.issueType"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  value={formData.hostel.issueType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="A">
                    Maintenance (e.g., plumbing, electricity)
                  </option>
                  <option value="B">Safety/Security Concerns</option>
                  <option value="C">Cleanliness</option>
                  <option value="D">Noise Complaints</option>
                  <option value="E">Roommate Issues</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "other":
        return (
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Additional Details
            </label>
            <input
              type="text"
              name="other.details"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={formData.other.details}
              onChange={handleChange}
              placeholder="Please specify your concern..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderFormStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Information
            </h2>
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaUser className="text-teal-600 mr-2" />
                  <span className="font-medium text-gray-700">Full Name:</span>
                  <span className="ml-2">{currentUser.name}</span>
                </div>
                <div className="flex items-center mb-3">
                  <FaIdCard className="text-teal-600 mr-2" />
                  <span className="font-medium text-gray-700">Student ID:</span>
                  <span className="ml-2">{currentUser.studentRef}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-teal-600 mr-2" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2">{currentUser.email}</span>
                </div>
              </div>

              {/* Keep phone input since it's not in registration */}
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-300 focus:outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
              >
                Next Step
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Report Your Concern
            </h2>

            <div className="mb-8">
              <label className="block font-medium mb-3 text-gray-700">
                What type of concern do you have?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: "academic",
                    label: "Academic",
                    icon: <FaUserGraduate />,
                  },
                  { id: "personal", label: "Personal", icon: <FaUserCheck /> },
                  {
                    id: "fellowStudent",
                    label: "Fellow Student",
                    icon: <FaUsers />,
                  },
                  { id: "hostel", label: "Hostel", icon: <FaBuilding /> },
                  { id: "other", label: "Other", icon: <FaQuestionCircle /> },
                ].map((category) => (
                  <div key={category.id}>
                    <input
                      type="radio"
                      name="category"
                      id={category.id}
                      value={category.id}
                      checked={formData.category === category.id}
                      onChange={handleChange}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor={category.id}
                      className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all h-full ${
                        formData.category === category.id
                          ? "border-teal-500 bg-teal-50 text-teal-700 font-medium"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      <span className="text-2xl mb-2">{category.icon}</span>
                      <span>{category.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {formData.category && (
              <div className="mb-8">{renderCategoryFields()}</div>
            )}

            <div className="mb-8">
              <label className="block font-medium mb-3 text-gray-700">
                Please describe your concern in detail:
              </label>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-300 focus:outline-none min-h-[150px]"
                placeholder="Provide as much detail as possible..."
                value={formData.description}
                onChange={(e) => handleChange(e)}
                name="description"
                required
              ></textarea>
            </div>

            {(formData.category === "hostel" ||
              formData.category === "other") && (
              <div className="mb-8">
                <label className="block font-medium mb-3 text-gray-700">
                  Attach supporting documents (optional):
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF (MAX. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      name="photos"
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="text-teal-600 hover:text-teal-800 font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="mr-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                Back
              </button>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center"
              >
                Submit Concern
                <IoMdCheckmarkCircle className="ml-2 text-xl" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm py-4 px-6 flex items-center sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
        >
          <IoMdArrowBack className="mr-2" />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">
          Student Concern Reporting
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoMdCheckmarkCircle className="text-teal-600 text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Concern Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for bringing this to our attention. Our team will review
              your concern and get back to you .
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Report Another Concern
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="bg-gray-100 px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`flex items-center ${
                    activeStep === 1
                      ? "text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      activeStep === 1
                        ? "bg-teal-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    1
                  </div>
                  <span>Personal Information</span>
                </div>

                <div className="flex-grow mx-2">
                  <div className="h-1 bg-gray-300">
                    <div
                      className={`h-1 bg-teal-500 ${
                        activeStep === 1 ? "w-0" : "w-full"
                      }`}
                    ></div>
                  </div>
                </div>

                <div
                  className={`flex items-center ${
                    activeStep === 2
                      ? "text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      activeStep === 2
                        ? "bg-teal-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    2
                  </div>
                  <span>Concern Details</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-10">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Report a Concern
                </h1>
                <p className="text-gray-600">
                  Your feedback helps us improve the student experience. Please
                  provide as much detail as possible.
                </p>
              </div>

              {renderFormStep()}
            </div>
          </form>
        )}

        {/* Information Card */}
        {!submitted && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-teal-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              What happens next?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Your concern will be reviewed by our support team
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                We'll contact you via email within 3 business days
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                All information is kept confidential
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Myinfo;
