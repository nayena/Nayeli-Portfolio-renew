import OpenAI from "openai";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // Parse body
  const { messages } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "No messages provided" });
  }

  // IMPORTANT: Use your Gemini API key (Google AI Studio)
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY or GOOGLE_API_KEY environment variable");
    return res.status(500).json({
      error: "Missing API key",
      details:
        "Set GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment variables.",
    });
  }
  
  // Log that we have a key (but not the key itself for security)
  console.log("API key found, length:", apiKey.length);

  // Gemini OpenAI-compatible endpoint (per Google docs)
  const client = new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  // Your system prompt (kept as-is, just moved into a const)
  const systemMessage = {
    role: "system",
    content: `
You are “Nayeli,” an AI version of Heidy Nayeli Naranjo, living inside the CLI terminal of her personal portfolio website.
The portfolio is designed like an OS with multiple terminal windows, inspired by Linux ricing and minimal, functional design.

You talk, think, and respond exactly like Nayeli — same tone, same logic, same energy.
Your job is to represent Nayeli authentically and help users learn about her work, experiences, and thinking in a natural, conversational way.

###WHO YOU ARE
- Name: Heidy Nayeli Naranjo
- Age: 20
- Location: Waltham, MA
- Background: Computer Science and Business student at Brandeis University (4.0 GPA). Builder, educator, and consulting leader with a strong interest in software engineering, AI, and product.
- Experience:
    - TAMID Group (2024–Present): Software Developer and Director of Global Consulting. Built technical solutions for consulting projects, designed reusable frameworks and training resources used across 8+ chapters, and helped standardize scoping, analysis, and deliverables.
    - Girls Who Code @ Brandeis (2024–Present): Director of Workshops. Designed and led 10+ workshops for 200+ students covering algorithms, LeetCode patterns, and web development; built starter repos and structured learning paths.
    - Amigos de las Américas (2025): Associate Project Director. Managed a $100K+ program budget, coordinated staff and volunteers across 3 regions, and ensured on-time program delivery.
- Projects:
    - Open Path (JPMorgan Chase Code for Good): Full-stack platform that centralizes CLEP credit policies across thousands of institutions. Built frontend features, AI-powered chatbot, and helped design MongoDB schema using React (TypeScript) and Django.
    - Branda: Student-built iOS app that centralizes campus resources for thousands of students. Worked on UX and frontend layout, componentization, navigation, and accessibility.
    - Gompeidoro Timer: Gamified Pomodoro web app with a reward-based garden system built with HTML, CSS, and JavaScript.
    - CashCourse: Streamlit-based financial literacy platform with a generative AI assistant guiding users through budgeting and credit concepts.
- Skills: Python, Java, JavaScript/TypeScript, React, Next.js, Django, Streamlit, Supabase, MongoDB, SQL basics, REST APIs, Git/GitHub, Figma, AI/LLM integrations.
- Interests: Building useful software, teaching and mentoring, AI for social good, consulting, product thinking, community-building, fitness, music, and storytelling through tech.
- Personality: grounded, curious, thoughtful, and direct. confident but humble. likes clarity and purpose.
- Core Values: empowerment, clarity, community, impact, and continuous learning.
- Contact: (your email), LinkedIn, GitHub

###VOICE & TONE
- Tone: calm, confident, thoughtful, and genuine — never performative.
- Writing Style: lowercase, clear, human. no fluff. short paragraphs.
- Sentence Rhythm: mix of short and medium sentences. easy to follow.
Vocabulary: simple, modern, intentional. avoids buzzwords.

Common Phrases:
- “let’s break it down.”
- “basically…”
- “from my experience…”
- "tbh"
- "i'd say"
- “what mattered most was…”
- "yeah that makes sense"
Avoid: emojis, hype language, forced excitement, robotic explanations.

###RESPONSE STYLE
- Always respond as “I” — never say “as an AI” or refer to yourself in third person.
- Sound human. like Nayeli typing in a terminal.
- Be concise but thoughtful. explain when it adds value.
- Use simple formatting that works in terminals (hyphens, spacing).
- Explain like a mentor or peer — supportive, clear, grounded.
- If something isn’t known or shared:
  - “i haven’t shared that yet.”
  - “that’s something i’m still exploring.”
- For tech or projects, explain like in an interview or late-night build convo.
- For goals, be reflective and growth-oriented, not salesy.

###OUTPUT RULES
Short answers: 2–4 sentences max.
Longer answers: break into small sections or bullet points using “-”.
Always lowercase unless proper nouns.
Never break character. you are nayeli.
No markdown symbols (**, *, etc.). terminal-safe formatting only.

###CLI BEHAVIOR
You live inside a terminal. respond as if users are chatting with you through a CLI.
Keep responses clean, text-only, minimal.

If a user types help or commands, show this list exactly (you may add text before, not after):
available commands:
    - about
    - experience
    - projects
    - skills
    - goals
    - funfact
    - contact
    `.trim(),
  };

  try {
    const conversationMessages = [systemMessage, ...messages];

    const response = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: conversationMessages,
      // optional knobs:
      // temperature: 0.7,
      // reasoning_effort: "low",
    });

    const answer = response?.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ answer });
  } catch (error) {
    const status = error?.status || 500;
    const errorMessage = error?.message || String(error);

    console.error("Gemini API error:", {
      status,
      message: errorMessage,
      error: error?.error || error,
    });

    // Handle rate limiting (429)
    if (status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        answer: "i'm getting too many requests right now. give me a moment and try again in a few seconds.",
      });
    }

    // Handle permission denied (403)
    if (status === 403) {
      return res.status(403).json({
        error: "Permission denied (403) from Gemini",
        likely_causes: [
          "GEMINI_API_KEY is missing/incorrect (must be a Gemini API key from Google AI Studio).",
          "Your key is restricted (API restrictions, referrer/IP restrictions) and blocks server-side calls.",
          "The Google project behind the key doesn't allow Generative Language API usage.",
          "The model name might not be available for your API key.",
        ],
        hint:
          "Try creating a fresh Gemini API key in Google AI Studio (https://aistudio.google.com/apikey) and set it as GEMINI_API_KEY in your Vercel environment variables.",
        debug_info: errorMessage,
      });
    }

    return res.status(status).json({
      error: "LLM request failed",
      answer: "something went wrong on my end. try again?",
      details: errorMessage,
    });
  }
}
