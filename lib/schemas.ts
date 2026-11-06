import { z } from "zod";

export const planSchema = z.object({
  title: z.string(), subject: z.string(), level: z.string(), goal: z.string(),
  days: z.array(z.object({
    day: z.number(), title: z.string(), focus: z.string(), objective: z.string(),
    miniLesson: z.string(), activity: z.string(), checkQuestion: z.string(),
    choices: z.array(z.string()).length(4), answerIndex: z.number().int().min(0).max(3),
    explanation: z.string(),
  })),
});

export const assessmentSchema = z.object({
  title: z.string(), intro: z.string(),
  questions: z.array(z.object({
    prompt: z.string(), choices: z.array(z.string()).length(4),
    answerIndex: z.number().int().min(0).max(3), explanation: z.string(),
  })),
  rubric: z.array(z.object({
    criterion: z.string(), beginning: z.string(), developing: z.string(),
    proficient: z.string(), advanced: z.string(),
  })),
});

export const reportSchema = z.object({
  student: z.string(), summary: z.string(), evidenceSummary: z.string(),
  strengths: z.array(z.string()), focusAreas: z.array(z.string()), nextSteps: z.array(z.string()),
});

export const tutorSchema = z.object({
  response: z.string(), checkQuestion: z.string(), choices: z.array(z.string()).length(4),
  answerIndex: z.number().int().min(0).max(3), explanation: z.string(),
});
