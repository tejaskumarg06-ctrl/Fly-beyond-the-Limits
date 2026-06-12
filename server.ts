import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  try {
    const dotenv = await import("dotenv");
    dotenv.config();
  } catch (e) {
    console.log("No dotenv found or environment variables already injected.");
  }

  app.use(express.json());

  // API Route for our elite AI travel planner chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "No message was provided." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please check your Settings > Secrets panel." 
        });
      }

      // Dynamic import of official Google GenAI library
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are the AeroLux VIP Travel Guide, a highly refined and bespoke AI travel advisor for our ultra-high-net-worth members.
Your language is elegant, professional, highly customized (focused on quiet luxury), and speaks deeply of state-of-the-art aviation fleets (e.g. Gulfstream G700, Bombardier Global 7500, Dassault Falcon 10X, Embraer Phenom 300E).
Recommend luxury travel itineraries, private FBO terminal coordinates, helicopter shuttle transfers, yacht configurations, or private island villas. Keep suggestions concise, bespoke, structured with bullet points, and extremely premium. Avoid marketing hype.`;

      // Construct history messages correctly
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        const replyText = response.text || "I apologize, but I could not formulate a response at this moment. Let me consult with your private ground liaison.";
        return res.json({ text: replyText });
      } catch (geminiError: any) {
        console.warn("Gemini API is unavailable or overloaded. Engaging AeroLux Premium Offline Liaison fallback...", geminiError);
        
        // Generate high-end offline fallback content based on user input keywords
        const replyText = getOfflineBespokeReply(message);
        return res.json({ text: replyText });
      }

    } catch (err: any) {
      console.error("Gemini API Error in /api/chat:", err);
      return res.status(500).json({ 
        error: `Liaison link lost: ${err.message || 'An unexpected operation error occurred.'}` 
      });
    }
  });

  // Helper helper to generate high-end custom offline flight travel coordinates
  function getOfflineBespokeReply(message: string): string {
    const raw = message.toLowerCase();
    
    if (raw.includes("tokyo")) {
      return `### 🇯🇵 TOKYO DIRECTIVES (OFFLINE TELEMETRY)
Greetings, Admiral. Your targeted coordinates to **Tokyo (RJTT)** have been logged with our Prestige Offline backup.

*   **Bespoke Airframe:** We have designated a *Gulfstream G700* departing from your preferred FBO terminal with custom flight crew.
*   **Stay Partners:** Exclusive accommodations are pre-arranged in partnership with the exquisite **Aman Tokyo** or the high-altitude **Park Hyatt Tokyo** presidential suite.
*   **Private Ground Liaison:** A dedicated executive transport chauffeur with private security detail will be on standby immediately upon touchdown at Haneda.

Please confirm if you would like me to lock these flight coordinates and arrange terminal clearances.`;
    }

    if (raw.includes("london")) {
      return `### 🇬🇧 LONDON STATION LOGS (OFFLINE TELEMETRY)
Coordinates for **London Luton/Farnborough (EGGW/EGLF)** have been mapped into our local offline telemetry system.

*   **Flight Dispatch:** A direct positioning leg in our *Bombardier Global 7500* has been drafted for immediate crew clearance.
*   **Stay Partners:** Enjoy bespoke arrangements at **The Savoy** or **Rosewood London**, featuring round-the-clock dedicated butler service.
*   **FBO Services:** Signature Flight Support at London Luton is briefed to grant your private diplomatic party expedited curbside arrivals.

How would you like to structure your departure timings?`;
    }

    if (raw.includes("paris")) {
      return `### 🇫🇷 PARIS COMMAND POST (OFFLINE TELEMETRY)
Your private voyage parameters to **Paris Le Bourget (LFPB)** have been registered.

*   **Airframe Selection:** We recommend our ultra-long-range *Bombardier Global 7500* or customized *Airbus ACJ329neo* for optimal trans-Atlantic dining space.
*   **Stay Partners:** Exquisite arrangements can be made at **Four Seasons Hotel George V** or **Hôtel de Crillon**, with VIP Michelin-starred dining priority.
*   **Helicopter Transfer:** On-demand helipad transfers are pre-cleared to transport you directly to private châteaux or seaside estates.

Are there any specific catering or vintage champagne preferences to register for your flight cabin?`;
    }

    if (raw.includes("singapore")) {
      return `### 🇸🇬 SINGAPORE VIP DISPATCH (OFFLINE TELEMETRY)
Your luxury connection to **Singapore Changi (WSSS)** is ready for local offline flight clearance.

*   **Fleet Suggestion:** Our fleet's high-efficiency flagship, the *Gulfstream G700*, is available for long-range oceanic routing.
*   **Stay Partners:** Confirmed partnerships are active with **Marina Bay Sands** (Infinity Pool Suite access) or the tranquil sanctuary of **Capella Singapore** along Sentosa.
*   **Pre-Arrival VIP:** Speed through customs using our private AeroLux VIP terminal arrivals gate with custom courier clearance.

Would you like our FBO operators to initiate the final flight manifest?`;
    }

    if (raw.includes("maldives")) {
      return `### 🇲🇻 MALDIVES PRIVATE ATOLL (OFFLINE TELEMETRY)
Your private tropical coordinates for **Malé (VRMM)** are drafted in our local offline database.

*   **Flight Route:** Direct private flight from your origin terminal to our exclusive partner luxury seaplane transfers.
*   **Stay Partners:** Private island villas at **Soneva Jani** or **One&Only Reethi Rah** pre-configured with dedicated personal concierges.
*   **Private Yacht:** Direct VIP boarding to our chartered 80-meter yacht for deep ocean exploration.

Shall we coordinate custom catering options for your charter?`;
    }

    if (raw.includes("fleet") || raw.includes("g700") || raw.includes("aircraft") || raw.includes("jet") || raw.includes("bombardier") || raw.includes("falcon")) {
      return `### ✈️ AEROLUX OPERATIONAL FLEET SPECS
Our operational fleet remains fully pre-cleared for elite member flight plans:

*   **Gulfstream G700:** The pinnacle of cabin speed, offering dual living zones and the lowest pressure cabin altitude in its class.
*   **Bombardier Global 7500:** Ideal for long routing, equipped with a full master bedroom, stand-up shower, and dedicated chef galley.
*   **Dassault Falcon 10X:** Feature-rich widebody configuration, engineered for transoceanic luxury voyages.
*   **Airbus ACJ329neo:** Perfect for boardroom delegations, with executive meeting spaces and quietest decibel rating.

Which elite airframe configuration is appropriate for your flight party?`;
    }

    if (raw.includes("feature") || raw.includes("tour") || raw.includes("help") || raw.includes("what can you do") || raw.includes("how to use")) {
      return `### 🎙️ AEROLUX CORE CAPABILITIES & SERVICES
AeroLux stands as the top tier of private flight routing. Here is an overview of our layout and operations:

1.  **Direct Booking Planner:** Enter flight routes, choose custom cabin specs, configure catering, and generate private agreements instantly.
2.  **3D World Map Radar:** Click on targeted city nodes to lock coordinates and display flight trajectories.
3.  **AeroLux Live Operations:** A live tracking screen mapped to active mock flights with altitude telemetry.
4.  **Pairing Hotels:** High-end listings combining world-class hotels in Tokyo, London, Paris, and Singapore.
5.  **Elite Membership Tiers:** Upgrade cards (Silver, Black, Gold) to reveal unique flight and hotel rate terms.

I am prepared to assist you with any of these systems. What coordinates shall we explore?`;
    }

    // Default polite response
    return `### 🛰️ AUXILIARY COMMUNICATIONS LINK ENGAGED
Greetings, Admiral. Your direct instructions have been logged by our AeroLux Prestige Offline Backup.

Due to extremely high global communications volume, our secondary server has stepped in. I have full offline access to coordinates for **Tokyo, London, Paris, Singapore, and the Maldives**, as well as the complete specs of our fleet (*Gulfstream G700*, *Bombardier Global 7500*, etc.).

*   **Active Telemetry:** Mapped to safe private FBO airfields.
*   **VIP Clearance:** Fully certified FAA Part 135 fleets are standing by.

Please let me know how we should coordinate your global travel route target!`;
  }

  // Serve static assets or mount the live development middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file delivery...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AeroLux Elite Server successfully listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
