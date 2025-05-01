import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import configuration from "@/config/configuration.js";
import { quizValidationSchema } from "@/validators/quizzes.validator.js";
import { z } from "zod";

class Aiservice {
  private readonly client: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  constructor() {
    this.client = new GoogleGenerativeAI(configuration.ai.key);
    this.model = this.client.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });
  }
  async improveQuiz(
    createQuizDto: z.infer<typeof quizValidationSchema>,
  ): Promise<Record<string, unknown> | null> {
    const prompt = `
    I want you to take the following name and description of a quiz application and enhance them to make them more engaging, creative, and appealing. The enhanced name should be concise, attractive, and clearly indicate the purpose of the quiz app. The enhanced description should be detailed, exciting, and communicate the app's unique features and value in a way that entices users to participate.

    Make sure the response is strictly in the following JSON format:

    {
        "name": "enhanced name",
        "description": "enhanced description"
    }
    Here is the name and description to enhance:

    Name: ${createQuizDto.name}
    Description: ${createQuizDto.description}

    Please return only the enhanced name and description in the JSON format specified.
    `;
    const result = await this.model.generateContent(prompt);
    const parsedResult = this.extractJsonFromMarkdown(
      result.response.candidates[0].content.parts[0].text,
    );

    return parsedResult;
  }

  async generateQuiz(
    createQuizDto: z.infer<typeof quizValidationSchema>,
  ): Promise<string | null> {
    const prompt = `
    You are a quiz generator. Based on the title ${createQuizDto.name} and description ${createQuizDto.description} provided, generate a quiz in the following file format. Include 4 questions: 1 multiple choice (mcq), 1 true/false (true_false), 1 written response (written), and 1 multi-select (multi_select). Use varied and accurate questions appropriate to the topic.

    Format:

    name: <title>
    description: <description>

    ---question---
    type: mcq
    question: <MCQ question>
    options:
    1. <option>
    2. <option> [correct]
    3. <option>
    4. <option>
    tags: <comma-separated tags>

    ---question---
    type: true_false
    question: <true/false question>
    correct: <true/false>
    tags: <comma-separated tags>

    ---question---
    type: written
    question: <written response question>
    tags: <comma-separated tags>

    ---question---
    type: multi_select
    question: <multi-select question>
    options:
    1. <option> [correct]
    2. <option> [correct]
    3. <option>
    4. <option>
    tags: <comma-separated tags>

    Generate the output now for:
    Title: Python Basics Quiz  
    Description: A quiz to test basic knowledge of Python programming.
    `;
    const result = await this.model.generateContent(prompt);
    return result.response.candidates[0].content.parts[0].text;
  }

  private extractJsonFromMarkdown(
    markdown: string,
  ): Record<string, unknown> | null {
    try {
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const jsonMatch = jsonRegex.exec(markdown);

      if (jsonMatch?.[1]) {
        const jsonString = jsonMatch[1];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedJson = JSON.parse(jsonString);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parsedJson;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error parsing JSON from markdown:", error);
      return null;
    }
  }
}

export default Aiservice;
