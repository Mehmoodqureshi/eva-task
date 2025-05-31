import { useState, useCallback } from "react";

const useAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    try {
      return "Assistant response placeholder"; // Placeholder response
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error };
};

export default useAssistant;
