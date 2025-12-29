export const text2SpeechServce = {
  async generate(text) {
    const response = await fetch(
      "https://internguysbackend.com/Chat/textToSpeech",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  },
};