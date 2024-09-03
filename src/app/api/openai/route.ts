import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  let totalTokensUsed = 0;
  const TOKEN_LIMIT = 2000;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  });

  const { language, prompt } = await request.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'Quero que responda somente com o nome da função e inglês, ou seja, você é treinada especificamente para melhorar nome de funções ou gera-las a partir da função pronta.',
      },
      { role: 'user', content: `${language} function: ${prompt}` },
    ],
    temperature: 0,
    max_tokens: TOKEN_LIMIT,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (response.usage) {
    totalTokensUsed += response.usage.total_tokens;

    if (totalTokensUsed >= TOKEN_LIMIT) {
      console.warn('Você atingiu o limite de tokens');
      throw new Error('Você atingiu o limite de tokens');
    }
  }

  return NextResponse.json(response);
}
