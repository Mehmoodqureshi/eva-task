import React, { useState } from "react";

const HubspotForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      // TODO: Integrate HubSpot API submission here
      // await submitToHubspot(formData);
      setSuccess("Form submitted successfully!");
    } catch {
      setSuccess("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded"
    >
      <input
        className="w-full p-2 mb-2 border rounded"
        name="name"
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {success && <p className="mt-2 text-center">{success}</p>}
    </form>
  );
};

export default HubspotForm;
