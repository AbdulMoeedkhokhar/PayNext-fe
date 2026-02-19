const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { skill, level, goal, dailyMinutes, completedTasks } = await req.json();

    const tasksPerDay = dailyMinutes <= 30 ? 1 : dailyMinutes === 60 ? 2 : 3;

    const completedTasksText =
      completedTasks.length > 0
        ? `Previously completed tasks:\n${completedTasks.map((t: string) => `- ${t}`).join("\n")}`
        : "No tasks completed yet — this is their first day.";

    const prompt = `You are a personal skill coach. Generate exactly ${tasksPerDay} learning task(s) for today.

Student profile:
- Skill: ${skill}
- Level: ${level}
- Goal: ${goal}
- Daily time available: ${dailyMinutes} minutes

${completedTasksText}

Rules:
- Never repeat a previously completed task
- Each task must build on previous knowledge
- Tasks must be completable in the time available
- Be specific and actionable, not vague
- Match difficulty to their level

Respond with ONLY a valid JSON array, no explanation, no markdown:
[
  {
    "title": "short task title",
    "description": "clear specific instructions on what to do and how"
  }
]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.choices[0].message.content;
    const tasks = JSON.parse(text);

    return new Response(JSON.stringify({ tasks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});