export async function suggestTags(title, content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("No ANTHROPIC_API_KEY set. Skipping auto-tagging.");
    return [];
  }
  
  const textInfo = `Title: ${title}\n\nContent: ${content}`;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Suggest 3-5 very relevant short tags for the following link/content. Return ONLY a valid JSON object matching { "tags": ["tag1", "tag2"] }. Do not output any markdown code blocks, just the raw JSON.\n\n${textInfo}`
        }]
      })
    });
    
    if (!response.ok) {
      console.error("Anthropic API Error:", await response.text());
      return [];
    }
    
    const data = await response.json();
    const outputText = data.content[0].text.trim();
    
    // safe json parsing
    const startIdx = outputText.indexOf('{');
    const endIdx = outputText.lastIndexOf('}') + 1;
    if(startIdx !== -1 && endIdx !== -1) {
      const jsonStr = outputText.slice(startIdx, endIdx);
      const result = JSON.parse(jsonStr);
      return result.tags || [];
    }
    return [];
  } catch (err) {
    console.error("Error during auto-tagging:", err);
    return [];
  }
}
