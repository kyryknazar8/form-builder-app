
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { openai } from '../../../../lib/ai';
import { generateFieldsWithAgent } from '../../../../lib/ai-agent';

const FieldSchema = z.object({
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'number', 'textarea']),
  required: z.boolean(),
  placeholder: z.string().optional(),
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  rows: z.number().int().positive().optional(),
});
const FieldsSchema = z.array(FieldSchema).min(1);


const SYSTEM_PROMPT = `
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
- Same language for labels/placeholders as user request
`;


export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> =
      Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    let text = '';
    
    try {
      console.log('🤖 Trying AI Agent with Ollama first...');
      const userMessage = messages[messages.length - 1]?.content || '';
      
      text = await generateFieldsWithAgent(userMessage);
      console.log('✅ AI Agent response:', text);
    } catch (ollamaErr) {
      console.error('⚠️ Ollama error, trying OpenAI:', ollamaErr);
      
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.2,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: String(m.content) })),
          ],
        });

        text = completion.choices[0]?.message?.content?.trim() || '[]';
        console.log('✅ OpenAI fallback response:', text);
      } catch (openaiErr) {
        console.error('⚠️ OpenAI API error, using smart fallback:', openaiErr);

    
      const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      
      let fallbackField;
      if (userMessage.includes('text') || userMessage.includes('text') || userMessage.includes('name') || userMessage.includes('name')) {
        fallbackField = {
          label: 'Text field',
          type: 'text',
          required: false,
          placeholder: 'Enter text...',
        };
      } else if (userMessage.includes('email') || userMessage.includes('e') || userMessage.includes('mail')) {
        fallbackField = {
          label: 'Email',
          type: 'email',
          required: false,
          placeholder: 'example@email.com',
        };
      } else if (userMessage.includes('number') || userMessage.includes('number') || userMessage.includes('count') || userMessage.includes('age')) {
        fallbackField = {
          label: 'Number',
          type: 'number',
          required: false,
          placeholder: '0',
        };
      } else if (userMessage.includes('textarea') || userMessage.includes('description') || userMessage.includes('message') || userMessage.includes('comment')) {
        fallbackField = {
          label: 'Textarea',
          type: 'textarea',
          required: false,
          placeholder: 'Enter text...',
          rows: 3,
        };
      } else {
        fallbackField = {
          label: 'Text field',
          type: 'text',
          required: false,
          placeholder: 'Enter text...',
        };
      }

        text = JSON.stringify([fallbackField]);
      }
    }

    
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed) &&
        'fields' in (parsed as Record<string, unknown>)
      ) {
        parsed = (parsed as Record<string, unknown>).fields;
      }
    } catch {
      parsed = [];
    }

    const result = FieldsSchema.safeParse(parsed);
    if (!result.success) {
      console.error('❌ Invalid AI output:', result.error.flatten());
      return NextResponse.json(
        { error: 'Invalid AI output', details: result.error.format() },
        { status: 422 }
      );
    }

    return NextResponse.json({ fields: result.data });
  } catch (e) {
    console.error('❌ AI assist fatal error:', e);
    return NextResponse.json({ error: 'Internal AI error' }, { status: 500 });
  }
}
