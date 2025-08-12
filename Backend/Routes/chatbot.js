import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Use Grok API
router.post("/", async (req, res) => {
  try {
    console.log("Received request:", JSON.stringify(req.body, null, 2));

    // Use your actual Groq API key from environment variables
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error("GROK_API_KEY is not defined in environment variables");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: req.body.messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || "Groq API error",
      });
    }

    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default router;
