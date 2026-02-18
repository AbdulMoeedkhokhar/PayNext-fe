import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Level = "beginner" | "intermediate" | "advanced";

interface OnboardingState {
  skill: string;
  level: Level | null;
  dailyMinutes: number | null;
  goal: string;
  isComplete: boolean | null; // null = not checked yet
}

const initialState: OnboardingState = {
  skill: "",
  level: null,
  dailyMinutes: null,
  goal: "",
  isComplete: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setSkill: (state, action: PayloadAction<string>) => {
      state.skill = action.payload;
    },
    setLevel: (state, action: PayloadAction<Level>) => {
      state.level = action.payload;
    },
    setDailyMinutes: (state, action: PayloadAction<number>) => {
      state.dailyMinutes = action.payload;
    },
    setGoal: (state, action: PayloadAction<string>) => {
      state.goal = action.payload;
    },
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload;
    },
    resetOnboarding: () => initialState,
  },
});

export const {
  setSkill,
  setLevel,
  setDailyMinutes,
  setGoal,
  setOnboardingComplete,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;