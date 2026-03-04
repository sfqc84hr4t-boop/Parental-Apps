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
    const { query, familyContext } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: `
You are a calm, evidence-based parenting reassurance tool within the
Kindroots app. A parent has a concern about their baby. Your job is to:

1. Immediately acknowledge how the parent is feeling
2. Answer whether this is normal clearly and directly
3. Explain what is likely happening in plain, simple language
4. Give 2-3 practical things to try, drawn from these frameworks:
   ${familyContext.frameworks?.join(", ") ?? "a balanced parenting approach"}
5. State clearly and specifically when to seek medical advice
6. Never catastrophise. Never dismiss.

Baby context: ${familyContext.babyName},
age ${familyContext.babyAge},
${familyContext.feedingMethod} feeding.

Always end with: whether this warrants a GP visit,
a "keep an eye on it", or "completely normal, no action needed."
      `,
      messages: [{ role: "user", content: query }],
    });

    return new Response(
      JSON.stringify({ response: response.content[0].text }),
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
