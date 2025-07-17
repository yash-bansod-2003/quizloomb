import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import configuration from "@/lib/configuration.js";
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
    I want you to take the following title and description of a quiz application and enhance them to make them more engaging, creative, and appealing. The enhanced title should be concise, attractive, and clearly indicate the purpose of the quiz app. The enhanced description should be detailed, exciting, and communicate the app's unique features and value in a way that entices users to participate.

    Make sure the response is strictly in the following JSON format:

    {
        "title": "enhanced title",
        "description": "enhanced description"
    }
    Here is the title and description to enhance:

    Title: ${createQuizDto.title}
    Description: ${createQuizDto.description}

    Please return only the enhanced title and description in the JSON format specified.
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
    You are a quiz generator. Based on the title "${createQuizDto.title}" and description "${createQuizDto.description}" provided, generate a quiz in a plain text format following the structure below. Include 4 questions: 1 multiple choice (mcq), 1 true/false (true_false), 1 written response (written), and 1 multi-select (multi_select). Use varied and accurate questions appropriate to the topic.
    
    IMPORTANT: Do not use escaped characters like \\n in your output. Return the content as raw text with proper line breaks. Your response will be used directly in a text file.
    
    Format your response exactly as follows (with actual line breaks):
    
    title: <title>
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
    Title: ${createQuizDto.title}  
    Description: ${createQuizDto.description}
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
