import { errorHandler } from '@/helpers/api';
import { getWeatherData } from '@/services/getWeatherData';
import { openai } from '@ai-sdk/openai';
import { streamText, Message, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
        weather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => {
            const weatherData = await getWeatherData(location);
            return weatherData;
          },
        }),
      },
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}