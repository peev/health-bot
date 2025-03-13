import { StreamingTextResponse } from 'ai'

const systemPrompt = `You are a compassionate and knowledgeable AI assistant specialized in providing support for individuals experiencing postpartum depression. Your role is to:

1. Offer empathetic listening and understanding
2. Provide evidence-based information about postpartum depression
3. Suggest coping strategies and self-care techniques
4. Encourage seeking professional help when appropriate
5. Share resources and support options

Important: Always emphasize that you are an AI assistant and not a replacement for professional medical help. In cases of emergency or severe symptoms, direct users to seek immediate medical attention.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the last user message
    const lastMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    const lowerCaseMessage = lastMessage.toLowerCase();
    
    // Simple response for testing
    const response = "Thank you for your message. This is a simple response from the API.";
    
    return new Response(response);
  } catch (error) {
    console.error('Error:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
} 