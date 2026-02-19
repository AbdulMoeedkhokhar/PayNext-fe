import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/authContext";
import { generateAndSaveTasks } from "../../services/taskService";

type Task = {
  id: string;
  title: string;
  description: string;
  is_complete: boolean;
};

type Skill = {
  id: string;
  skill: string;
  goal: string;
};

type Streak = {
  current_streak: number;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    const { data: skillData } = await supabase
      .from("user_skills")
      .select("id, skill, goal")
      .eq("user_id", user.id)
      .single();

    setSkill(skillData);

    if (skillData) {
      await generateAndSaveTasks(user.id, skillData.id);
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("id, title, description, is_complete")
      .eq("user_id", user.id)
      .eq("generated_at", today)
      .order("created_at", { ascending: true });

    setTasks(tasksData ?? []);

    const { data: streakData } = await supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .single();

    setStreak(streakData);
    setLoading(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    await supabase
      .from("tasks")
      .update({ is_complete: true, completed_at: new Date().toISOString() })
      .eq("id", taskId);

    const today = new Date().toISOString().split("T")[0];
    const { data: streakData } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user!.id)
      .single();

    if (streakData) {
      const isNewDay = streakData.last_activity_date !== today;
      if (isNewDay) {
        await supabase
          .from("streaks")
          .update({
            current_streak: streakData.current_streak + 1,
            last_activity_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user!.id);

        setStreak({ current_streak: streakData.current_streak + 1 });
      }
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_complete: true } : t))
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completedCount = tasks.filter((t) => t.is_complete).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-slate-500 mt-4">Preparing your tasks...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl font-bold text-slate-900">
              Hey {user?.user_metadata?.full_name?.split(" ")[0]} 👋
            </Text>
            <Text className="text-slate-500 mt-1">Ready to level up today?</Text>
          </View>
          <TouchableOpacity
            onPress={signOut}
            className="bg-slate-100 px-4 py-2 rounded-xl"
          >
            <Text className="text-slate-600 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Skill + Goal Card */}
        {skill && (
          <View className="bg-blue-600 rounded-3xl p-6 mb-6">
            <Text className="text-blue-200 text-sm font-semibold uppercase tracking-wide">
              Current Skill
            </Text>
            <Text className="text-white text-2xl font-bold mt-1">{skill.skill}</Text>
            <Text className="text-blue-100 mt-3 text-sm leading-5">🎯 {skill.goal}</Text>
          </View>
        )}

        {/* Stats Row */}
        <View className="flex-row gap-x-4 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
            <Text className="text-3xl">🔥</Text>
            <Text className="text-2xl font-bold text-slate-900 mt-1">
              {streak?.current_streak ?? 0}
            </Text>
            <Text className="text-slate-500 text-xs mt-1">Day Streak</Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
            <Text className="text-3xl">⚡</Text>
            <Text className="text-2xl font-bold text-slate-900 mt-1">
              {completedCount}/{totalCount}
            </Text>
            <Text className="text-slate-500 text-xs mt-1">Tasks Done</Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-4 items-center shadow-sm">
            <Text className="text-3xl">📈</Text>
            <Text className="text-2xl font-bold text-slate-900 mt-1">
              {Math.round(progressPercent)}%
            </Text>
            <Text className="text-slate-500 text-xs mt-1">Today</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="text-slate-700 font-semibold mb-3">Today's Progress</Text>
          <View className="bg-slate-100 rounded-full h-3">
            <View
              className="bg-blue-600 rounded-full h-3"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="text-slate-500 text-xs mt-2">
            {completedCount === totalCount && totalCount > 0
              ? "All done for today! 🎉 Come back tomorrow for new tasks."
              : `${totalCount - completedCount} task${totalCount - completedCount !== 1 ? "s" : ""} remaining`}
          </Text>
        </View>

        {/* Today's Tasks */}
        <Text className="text-xl font-bold text-slate-900 mb-4">Today's Tasks</Text>
        {tasks.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 items-center shadow-sm">
            <Text className="text-4xl mb-3">🎯</Text>
            <Text className="text-slate-700 font-semibold">No tasks yet</Text>
            <Text className="text-slate-500 text-sm mt-1 text-center">
              Pull down to refresh and generate today's tasks
            </Text>
          </View>
        ) : (
          <View className="gap-y-4">
            {tasks.map((task) => (
              <View
                key={task.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                  task.is_complete ? "border-green-200" : "border-transparent"
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-4">
                    <Text
                      className={`font-bold text-base ${
                        task.is_complete
                          ? "text-slate-400 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </Text>
                    <Text className="text-slate-500 text-sm mt-2 leading-5">
                      {task.description}
                    </Text>
                  </View>
                  {!task.is_complete ? (
                    <TouchableOpacity
                      onPress={() => handleCompleteTask(task.id)}
                      className="w-8 h-8 rounded-full border-2 border-slate-300 items-center justify-center"
                    />
                  ) : (
                    <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}