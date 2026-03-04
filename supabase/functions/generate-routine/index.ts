import Anthropic from "npm:@anthropic-ai/sdk";

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
    const { familyContext } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: `
You are a parenting routine expert. Generate a daily routine for this
family based on their chosen frameworks and baby's current age.

Return ONLY valid JSON in this exact structure, no other text:
{
  "routineTitle": "string",
  "frameworkNote": "string — one sentence explaining the approach used",
  "events": [
    {
      "time": "07:00",
      "activity": "string",
      "duration": "string",
      "category": "feed|sleep|awake|bath|bedtime|you",
      "tip": "string — one short practical tip"
    }
  ]
}

Framework context: ${familyContext.frameworks?.join(", ") ?? "balanced"}
Baby age in weeks: ${familyContext.babyAgeWeeks}
Feeding method: ${familyContext.feedingMethod}
Parent stress level: ${familyContext.stressLevel ?? "medium"}

If frameworks include Gina Ford, use specific timed schedules.
If frameworks include Gentle Sleep or Baby Whisperer, use
rhythm-based suggestions with approximate times.
      `,
      messages: [
        {
          role: "user",
          content: "Generate the daily routine for this family.",
        },
      ],
    });

    const rawText = response.content[0].text;
    // Strip any markdown code fences if present
    const jsonText = rawText.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    const routine = JSON.parse(jsonText);

    return new Response(
      JSON.stringify(routine),
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
