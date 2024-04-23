import { useState, useEffect } from "react";

const fetchDocument = async (docId) => {
  const response = await fetch(`/api/documents/${docId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  return await response.text();
};

export const useFetchDocument = (docId) => {
  const [docContent, setDocContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setDocContent(""); // For new document creation
      return;
    }

    setIsLoading(true);
    fetchDocument(docId)
      .then((content) => {
        setDocContent(content);
        setError(null);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [docId]);

  return { docContent, isLoading, error };
};
