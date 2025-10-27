import { ollama } from './ollama';

const AGENT_PROMPT = `
You are a JSON generator for form fields. Respond with ONLY valid JSON array, no explanations.

CRITICAL: Use ONLY these types: "text", "email", "number", "textarea"

Example:
[{"label": "Name", "type": "text", "required": false, "placeholder": "Enter name"}]

RULES:
- type: ONLY "text", "email", "number", "textarea"
- required: true or false
- phone/telephone → type "text" (NEVER "tel")
- Ukrainian requests → Ukrainian labels
- Context mapping:
  * age/count/кількість/вік/сума/ціна → "number"
  * name/ім'я/прізвище/назва/phone/телефон/адреса → "text"  
  * description/опис/повідомлення/коментар/деталі → "textarea"
  * email/електронна пошта/пошта → "email"
- "обов'язкове"/"required" → required: true

Request: {userRequest}
`;

export async function generateFieldsWithAgent(userRequest: string): Promise<string> {
  try {
    const prompt = AGENT_PROMPT.replace('{userRequest}', userRequest);
    const result = await ollama.invoke(prompt);
    
    return result;
  } catch (error) {
    console.error('❌ AI Agent error:', error);
    throw error;
  }
}
