export async function generateAINarrative(prompt: string): Promise<string> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) throw new Error("Hugging Face API key not set in environment variable HF_API_KEY");
  const response = await fetch(
    'https://api-inference.huggingface.co/models/deepseek/deepseek-r1-0528-qwen3-8b',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );
  const data = await response.json();
  return data?.[0]?.generated_text || data?.generated_text || "No narrative generated.";
} 