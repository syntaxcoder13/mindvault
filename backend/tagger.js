export async function suggestTags(title, content) {
  const apiKeys = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3
  ].filter(Boolean);

  if (apiKeys.length === 0) {
    console.warn("No GROQ_API_KEY set. Skipping auto-tagging.");
    return [];
  }
  
  const textInfo = `Title: ${title}\n\nContent: ${content}`;
  
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          messages: [{
            role: 'user',
            content: `Suggest 3-5 very relevant short tags for the following link/content. Return ONLY a valid JSON object matching { "tags": ["tag1", "tag2"] }. Do not output any markdown code blocks, just the raw JSON.\n\n${textInfo}`
          }],
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 && i < apiKeys.length - 1) {
          console.warn(`[GROQ] Key #${i+1} limited. Retrying with next key...`);
          continue; // Try next key
        }
        console.error("Groq API Error:", errorText);
        return [];
      }
      
      const data = await response.json();
      const outputText = data.choices[0].message.content.trim();
      
      const startIdx = outputText.indexOf('{');
      const endIdx = outputText.lastIndexOf('}') + 1;
      if(startIdx !== -1 && endIdx !== -1) {
        const jsonStr = outputText.slice(startIdx, endIdx);
        const result = JSON.parse(jsonStr);
        return result.tags || [];
      }
      return [];
    } catch (err) {
      console.error(`[GROQ] Error with key #${i+1}:`, err);
      if (i < apiKeys.length - 1) continue;
      return [];
    }
  }
  return [];
}
