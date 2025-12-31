export async function POST(request) {
  try {
    const { messages } = await request.json();

    // Using HuggingFace's free inference API with Mistral model
    const lastMessage = messages[messages.length - 1];

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: lastMessage.content,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      // Fallback to a simpler model if rate limited
      const fallbackResponse = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: lastMessage.content,
          })
        }
      );

      if (!fallbackResponse.ok) {
        return Response.json({
          error: 'AI service temporarily unavailable. Please try again in a moment.'
        }, { status: 503 });
      }

      const fallbackData = await fallbackResponse.json();
      const aiResponse = fallbackData[0]?.generated_text || 'I apologize, but I had trouble processing that request.';

      return Response.json({ message: aiResponse });
    }

    const data = await response.json();
    const aiResponse = data[0]?.generated_text || data.generated_text || 'I apologize, but I had trouble generating a response.';

    return Response.json({ message: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({
      error: 'Failed to get AI response. Please try again.'
    }, { status: 500 });
  }
}
