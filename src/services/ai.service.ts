import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import configuration from "@/lib/configuration.js";
import { quizValidationSchema } from "@/validators/quizzes.validator.js";
import { z } from "zod";
import { QuestionType, Difficulty } from "@/entities/Question.js";

class Aiservice {
  private readonly client: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  constructor() {
    this.client = new GoogleGenerativeAI(configuration.ai.key);
    this.model = this.client.getGenerativeModel({
      model: "gemini-2.5-flash",
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
    You are a quiz generator. Based on the title "${createQuizDto.title}" and description "${createQuizDto.description}" provided, generate a quiz in a plain text format following the structure below. Include 16 questions: 4 multiple choice (${QuestionType.MCQ}), 4 true/false (${QuestionType.TRUE_FALSE}), 4 written response (${QuestionType.WRITTEN}), and 4 multi-select (${QuestionType.WRITTEN}). Use varied and accurate questions appropriate to the topic.
    
    IMPORTANT: 
    Do not use escaped characters like \\n in your output. Return the content as raw text with proper line breaks. Your response will be used directly in a text file.
    Tags should be relevant to the quiz topic and separated by commas. and tags only be an high-level topic like React , Expressjs , Nodejs , Java etc.

    Format your response exactly as follows (with actual line breaks):
    
    title: <title>
    description: <description>
    
    ---question---
    type: ${QuestionType.MCQ}
    question: <MCQ question>
    difficulty: <${Difficulty.HIGH}|${Difficulty.MEDIUM}|${Difficulty.LOW}>
    options:
    1. <option>
    2. <option> [correct]
    3. <option>
    4. <option>
    tags: <comma-separated tags>
    
    ---question---
    type: ${QuestionType.TRUE_FALSE}
    question: <true/false question>
    difficulty: <${Difficulty.HIGH}|${Difficulty.MEDIUM}|${Difficulty.LOW}>
    correct: <true/false>
    tags: <comma-separated tags>
    
    ---question---
    type: ${QuestionType.WRITTEN}
    question: <written response question>
    difficulty: <${Difficulty.HIGH}|${Difficulty.MEDIUM}|${Difficulty.LOW}>
    tags: <comma-separated tags>
    
    ---question---
    type: ${QuestionType.MULTI_SELECT}
    question: <multi-select question>
    difficulty: <${Difficulty.HIGH}|${Difficulty.MEDIUM}|${Difficulty.LOW}>
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
