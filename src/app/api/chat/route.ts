import { getWeatherData } from '@/services/getWeatherData';
import { openai } from '@ai-sdk/openai';
import { streamText, Message, tool } from 'ai';
import { z } from 'zod';

export function errorHandler(error: unknown) {
    if (error == null) {
      return 'unknown error';
    }
  
    if (typeof error === 'string') {
      return error;
    }
  
    if (error instanceof Error) {
      return error.message;
    }
  
    return JSON.stringify(error);
  }

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    maxSteps: 5,
    messages,
    tools: {
        weather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => {
            const weatherData = await getWeatherData(location);
            console.log('Executed weather tool with location:', location, weatherData);
            // Call actual weather API instead of using mock data
            return weatherData;
          },
        }),
      },
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}