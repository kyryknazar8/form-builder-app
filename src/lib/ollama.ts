import { Ollama } from '@langchain/ollama';

export const ollama = new Ollama({
  baseUrl: 'http://ollama:11434', 
  model: 'codellama:7b', 
});


export async function generateFormFieldsWithOllama(prompt: string): Promise<string> {
  try {
    const response = await ollama.invoke(prompt);
    return response;
  } catch (error) {
    console.error('❌ Ollama error:', error);
    throw error;
  }
}
