import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js";

const client = new Anthropic();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { familyContext, contentType } = await req.json();

    // contentType: "daily_tip" | "weekly_insight" | "leap_alert"
    const prompts: Record<string, string> = {
      daily_tip: `
Generate a single, personalised daily parenting tip for this family.
Baby: ${familyContext.babyName}, age ${familyContext.babyAge}.
Frameworks: ${familyContext.frameworks?.join(", ")}.
Return JSON: { "tip": "string", "category": "string", "source_framework": "string" }
Keep the tip warm, specific, and actionable. Under 60 words.
      `,
      weekly_insight: `
Generate a weekly developmental insight for this family.
Baby: ${familyContext.babyName}, age ${familyContext.babyAge}.
Frameworks: ${familyContext.frameworks?.join(", ")}.
Return JSON: { "title": "string", "insight": "string", "activities": ["string", "string", "string"] }
The insight should relate to what the baby is learning this week. Under 100 words.
      `,
      leap_alert: `
The baby may be entering or in a Wonder Week leap.
Baby: ${familyContext.babyName}, age ${familyContext.babyAge}.
Leap details: ${JSON.stringify(familyContext.currentLeap)}.
Generate a compassionate, reassuring message for the parent.
Return JSON: { "headline": "string", "message": "string", "what_to_expect": ["string", "string"], "what_helps": ["string", "string"] }
      `,
    };

    const prompt = prompts[contentType] ?? prompts.daily_tip;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].text;
    const jsonText = rawText.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    const content = JSON.parse(jsonText);

    return new Response(
      JSON.stringify(content),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
