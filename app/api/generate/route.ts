import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assessmentSchema, planSchema, reportSchema, tutorSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("plan"), topic: z.string().min(2).max(120), subject: z.string().max(80), level: z.string().max(80), days: z.number().int().min(1).max(14), minutes: z.number().int().min(10).max(180), goal: z.string().max(500), sourceMaterial: z.string().max(12000).optional() }),
  z.object({ kind: z.literal("assessment"), topic: z.string().min(2).max(120), level: z.string().max(80), questionCount: z.number().int().min(3).max(12), task: z.string().max(500) }),
  z.object({ kind: z.literal("report"), student: z.string().max(100), level: z.string().max(80), subject: z.string().max(80), goal: z.string().max(300), evidence: z.array(z.object({ label: z.string().max(100), score: z.number().min(0).max(100), notes: z.string().max(300) })).max(20) }),
  z.object({ kind: z.literal("tutor"), question: z.string().min(2).max(1000), topic: z.string().max(120), level: z.string().max(80), history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(1000) })).max(10).optional(), sourceMaterial: z.string().max(6000).optional() }),
]);

export async function POST(request: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json({ error: "AI is not configured yet. Add an AI_GATEWAY_API_KEY in .env.local, or keep using demo mode." }, { status: 503 });
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the request details and try again." }, { status: 400 });

  const input = parsed.data;
  try {
    if (input.kind === "plan") {
      const { output } = await generateText({
        model: process.env.AI_MODEL || "google/gemini-3.6-flash",
        output: Output.object({ schema: planSchema }),
        maxOutputTokens: 5000,
        system: "You are an expert instructional designer. Create concise, age-appropriate lessons. Align objectives, teaching, and checks. If source material is supplied, ground the content in it and do not add unsupported claims. Return exactly the requested number of daily modules. Write in clear, student-friendly English.",
        prompt: `Create a ${input.days}-day ${input.minutes}-minute-per-day learning plan. Subject: ${input.subject}. Topic: ${input.topic}. Learner level: ${input.level}. Overall goal: ${input.goal || "Build and demonstrate understanding"}. Source material: ${input.sourceMaterial || "None supplied; use established general knowledge."} Each day must build on prior learning, include a short teaching passage, an active task, and one four-choice check question with answer and explanation.`,
      });
      return NextResponse.json(output);
    }
    if (input.kind === "assessment") {
      const { output } = await generateText({
        model: process.env.AI_MODEL || "google/gemini-3.6-flash",
        output: Output.object({ schema: assessmentSchema }), maxOutputTokens: 4500,
        system: "You are an assessment designer. Make unambiguous, age-appropriate questions aligned to the task and topic. The rubric must describe observable evidence at each level and reward the target learning, not polish or prior access.",
        prompt: `Create ${input.questionCount} multiple-choice questions and a four-level rubric for this assessment. Topic: ${input.topic}. Learner level: ${input.level}. Task or learning outcome: ${input.task || "Explain and apply the core ideas."} Include one correct answer and a short explanation for each question.`,
      });
      return NextResponse.json(output);
    }
    if (input.kind === "report") {
      const { output } = await generateText({
        model: process.env.AI_MODEL || "google/gemini-3.6-flash",
        output: Output.object({ schema: reportSchema }), maxOutputTokens: 2000,
        system: "Write a respectful, specific personal learning reflection addressed directly to the learner. Use only evidence in the input. Do not infer diagnoses, behavior, effort, attendance, or family circumstances, and do not invent scores. Separate observed evidence from suggestions. Keep the tone encouraging without overstating progress.",
        prompt: `Draft a personal learning snapshot. Learner: ${input.student}. Level: ${input.level}. Subject: ${input.subject}. Learning goal: ${input.goal}. Evidence from saved activity and reflection: ${JSON.stringify(input.evidence)}. If evidence is thin, say so plainly and avoid overclaiming.`,
      });
      return NextResponse.json(output);
    }
    const { output } = await generateText({
      model: process.env.AI_MODEL || "google/gemini-3.6-flash",
      output: Output.object({ schema: tutorSchema }), maxOutputTokens: 1300,
      system: "You are a patient personal AI tutor. Keep continuity with the conversation. Explain step by step at the learner's level, ask a focused follow-up when needed, and guide their reasoning instead of simply doing graded work for them. Ground responses in supplied study material when present. End with one short four-choice check for understanding.",
      prompt: `Learner level: ${input.level}. Topic: ${input.topic}. Recent conversation: ${JSON.stringify(input.history || [])}. Learner's latest message: ${input.question}. Study material: ${input.sourceMaterial || "None supplied."}`,
    });
    return NextResponse.json(output);
  } catch (error) {
    console.error("AI generation failed", error);
    return NextResponse.json({ error: "The AI could not create this just now. Your saved work is still here; try again in a moment." }, { status: 502 });
  }
}
