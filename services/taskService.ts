import { supabase } from "../lib/supabase";

export async function generateAndSaveTasks(userId: string, skillId: string) {
  // Get user skill info
  const { data: skill } = await supabase
    .from("user_skills")
    .select("*")
    .eq("id", skillId)
    .single();

  if (!skill) throw new Error("Skill not found");

  // Get all previously completed tasks for context
  const { data: completedTasks } = await supabase
    .from("tasks")
    .select("title")
    .eq("user_id", userId)
    .eq("is_complete", true);

  const completedTitles = completedTasks?.map((t) => t.title) ?? [];

  // Check if tasks already generated today
  const today = new Date().toISOString().split("T")[0];
  const { data: todayTasks } = await supabase
    .from("tasks")
    .select("id")
    .eq("user_id", userId)
    .eq("generated_at", today);

  if (todayTasks && todayTasks.length > 0) {
    console.log("Tasks already generated today, skipping");
    return;
  }

  // Debug logs
  console.log("Calling URL:", process.env.EXPO_PUBLIC_GENERATE_TASKS_URL);
  console.log("Anon key exists:", !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

  // Call Edge Function
  const response = await fetch(process.env.EXPO_PUBLIC_GENERATE_TASKS_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!}`,
      "apikey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    },
    body: JSON.stringify({
      skill: skill.skill,
      level: skill.level,
      goal: skill.goal,
      dailyMinutes: skill.daily_minutes,
      completedTasks: completedTitles,
    }),
  });

  const json = await response.json();
  console.log("Edge Function response:", JSON.stringify(json));

  const { tasks, error } = json;
  if (error) throw new Error(error);

  if (!tasks || !Array.isArray(tasks)) {
    throw new Error("Invalid tasks response from Edge Function");
  }

  // Save tasks to Supabase
  const tasksToInsert = tasks.map((t: { title: string; description: string }) => ({
    user_id: userId,
    skill_id: skillId,
    title: t.title,
    description: t.description,
    generated_at: today,
  }));

  const { error: insertError } = await supabase.from("tasks").insert(tasksToInsert);
  if (insertError) throw new Error(insertError.message);

  console.log("Tasks saved successfully:", tasksToInsert.length);
}