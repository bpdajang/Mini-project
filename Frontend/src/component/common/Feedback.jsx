import { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    contactPermission: true,
    // Common fields
    description: "",
    urgency: "medium",
    // Category-specific fields
    academic: { department: "", course: "", issueType: "" },
    personal: { issueType: "", supportMethod: "" },
    fellowStudent: { relationship: "", issueType: "", anonymous: false },
    faculty: { name: "", course: "", issueType: "" },
    hostel: { block: "", room: "", issueType: "", photos: [] },
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
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
    switch (formData.category) {
      case "academic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Department</label>
              <select
                name="academic.department"
                className="w-full p-2 border rounded"
                value={formData.academic.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="science">Science</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Course Name/Code</label>
              <input
                type="text"
                name="academic.course"
                className="w-full p-2 border rounded"
                value={formData.academic.course}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );

      case "hostel":
        return (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Hostel Block</label>
              <select
                name="hostel.block"
                className="w-full p-2 border rounded"
                value={formData.hostel.block}
                onChange={handleChange}
                required
              >
                <option value="">Select Block</option>
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Room Number</label>
              <input
                type="text"
                name="hostel.room"
                className="w-full p-2 border rounded"
                value={formData.hostel.room}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );

      // Add other category cases similarly

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        University Experience Feedback
      </h1>

      <form className="space-y-6">
        {/* Contact Permission */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            name="contactPermission"
            checked={formData.contactPermission}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-medium">
            Allow us to contact you for follow-up
          </label>
        </div>

        {/* Category Selection */}
        <div className="space-y-4">
          <label className="block font-medium mb-2">Select Category</label>
          {["academic", "personal", "fellowStudent", "faculty", "hostel"].map(
            (category) => (
              <div key={category} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  id={category}
                  value={category}
                  checked={formData.category === category}
                  onChange={handleChange}
                  className="h-4 w-4"
                  required
                />
                <label htmlFor={category} className="capitalize">
                  {category.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            )
          )}
        </div>

        {/* Conditional Fields */}
        {formData.category && (
          <div className="space-y-6">
            {renderCategoryFields()}

            {/* Common Description Field */}
            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                name="description"
                className="w-full p-2 border rounded h-32"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Urgency Level */}
            <div className="space-y-2">
              <label className="block font-medium">Urgency Level</label>
              {["low", "medium", "high"].map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="urgency"
                    id={level}
                    value={level}
                    checked={formData.urgency === level}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <label htmlFor={level} className="capitalize">
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
