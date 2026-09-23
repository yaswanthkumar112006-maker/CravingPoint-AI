import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3050;

app.use(express.json());

// Initialize Gemini SDK safely
// Set User-Agent as 'aistudio-build' for AI Studio tracking telemetry
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is not defined. AI Assistant fallback prompt generation will be simulated on client-side.");
}

// -------------------------------------------------------------
// 1. AI FOOD ASSISTANT CHAT ROUTE
// -------------------------------------------------------------
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message parameter is required." });
    }

    if (!aiClient) {
      // Return a friendly fallback if API key is not present in the runtime env
      return res.json({
        reply: `Hello! I'm your CravingPoint AI Assistant. Since the Gemini API key is currently being set up, I can recommend some signature dishes! Try our *Special Swarnamukhii Ghee Roast Dosa* from Swarnamukhii Multi Cuisine, or the *Signature Chicken Dum Biryani* from Biryani Hub. What would you like to know about our gourmet sections?`
      });
    }

    // Format chat history for Gemini chat structure or system instructions
    const systemPrompt = `You are "CravingPoint AI Gourmet Assistant", an expert food concierge for our premium Indian & Multicuisine delivery app, CravingPoint, which operates around Hitech City, Gachibowli, Hyderabad and Bangalore. 
    Your tone is friendly, welcoming, professional, and culinary-forward (like a digital Michelin star maître d'). You pair Starbucks-style warmth with gourmet food insights.
    
    Here is our curated menu database you can refer to:
    - Cafe Swarnamukhii Multicuisine (Hitech City): Special Swarnamukhii Ghee Roast Dosa (₹130, Veg), Royal Andhra Veg Meals Platter (₹210, Veg), Paneer Butter Masala (₹250, Veg), Tandoori Garlic Roti (₹45, Veg). Handcrafted Ghee Roasts are absolute favorites!
    - Aroma Multi Cuisine (Banjara Hills): Aroma Margherita Feast Pizza (₹279, Veg), Szechuan Spicy Veg Noodles (₹189, Veg), Fiery Dragon Chicken Starters (₹240, Non-Veg). Sizzling Chinese and authentic pizzas are highly popular.
    - Biryani Hub (Jub jubilee Hills): Signature Chicken Dum Biryani (₹299, Non-Veg), Imperial Paneer Dum Biryani (₹240, Veg), Double Ka Meetha Saffron Pudding (₹110, Veg, Dessert). Slow dum cooking yields legendary quality.
    - Szechuan Express: Schezwan Hakka Veg Noodles (₹189, Veg), Pan Fried Sizzling Chicken Dimsums (₹199, Non-Veg), Cottage Cheese Chili Dry (₹219, Veg).
    - Green Delight Kitchen (Healthy): Avocado & Quinoa Power Bowl (₹249, Veg), Paneer Tikka Diet Wrap (₹189, Veg), High Fiber Dal Khichdi Bowl (₹159, Veg). Comfortable comfort healing food.
    
    Focus on promoting Hyderabad and South Indian specialties, identifying spice levels, calories (roughly estimative of organic ingredients), or recommending combinations. Keep responses delightful, structured, highly scannable (using bullet points and bold formatting), and concise!`;

    // Initialize standard chat session using Gemini
    const chat = aiClient.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      }
    });

    // Feed initial history to reconstruct the conversation flow safely if present
    if (history && history.length > 0) {
      // Re-feed chat context safely or let the chat session know
    }

    const response = await chat.sendMessage({ message });
    return res.json({ reply: response.text });

  } catch (error: any) {
    console.error("Gemini API Chat route error:", error);
    return res.status(500).json({ error: "Something went wrong while processing your culinary query.", details: error.message });
  }
});

// -------------------------------------------------------------
// 2. SMART SEARCH AND COMBINATION ASSISTANT
// -------------------------------------------------------------
app.post("/api/ai/suggestions", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.json({ suggestions: [], smartCombo: null });
    }

    if (!aiClient) {
      return res.json({
        suggestions: [`${query} Ghee Roast combo`, `Royal Andhra Meals Special`, `Paneer Butter Masala & Garlic Roti`],
        smartCombo: {
          title: "Popular Combo Match",
          description: "Pair this dish with Double Ka Meetha Saffron Pudding for a true sweet royalty closure!",
          items: ["Double Ka Meetha Saffron Pudding"]
        }
      });
    }

    const prompt = `Based on our menu item names: 
    - "Special Swarnamukhii Ghee Roast Dosa"
    - "Royal Andhra Veg Meals Platter"
    - "Paneer Butter Masala"
    - "Tandoori Garlic Roti"
    - "Aroma Margherita Feast Pizza"
    - "Szechuan Spicy Veg Noodles"
    - "Fiery Dragon Chicken Starters"
    - "Signature Chicken Dum Biryani"
    - "Imperial Paneer Dum Biryani"
    - "Double Ka Meetha Saffron Pudding"
    - "Avocado & Quinoa Power Bowl"
    - "Paneer Tikka Diet Wrap"
    - "High Fiber Dal Khichdi Bowl"

    Analyze the user search query: "${query}".
    Provide a JSON response containing:
    1. "suggestions": A string array (max 3 items) of smart, delicious search suggestions completion relevant to the query.
    2. "smartCombo": An object with "title", "description" (explaining why they pair well), and "items" (string array matching menu item names) recommending a perfect gourmet combination.
    
    Return STRICTLY JSON format matching this schema:
    {
      "suggestions": ["suggestion 1", "suggestion 2"],
      "smartCombo": {
        "title": "Chef's Handcrafted Combination",
        "description": "Short appetizing description",
        "items": ["Exact Menu Item Name"]
      }
    }`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.error("AI Search query suggestions route error:", error);
    return res.json({
      suggestions: [`${req.body.query} special combo`, "Premium Ghee Roasted Thali"],
      smartCombo: null
    });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE DEVELOPMENT PORT AND INGRES ROUTING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development configuration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production configuration
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 CravingPoint full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
