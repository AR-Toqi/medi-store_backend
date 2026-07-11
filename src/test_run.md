# AI Chatbot Verification Guide

Because node is not registered in the system environment variables of this sandboxed terminal wrapper, you can run the test cases directly from your own VS Code or system terminal.

## Run Verification Script

We have prepared and fully updated the test script at `src/test-ai-chat.ts`. 

To run it, open your terminal at the root of `medistore-backend` and execute:

```bash
# Set your Gemini API key (if not already set in .env)
# Windows Command Prompt:
set GOOGLE_API_KEY=your_gemini_api_key_here

# Windows PowerShell:
$env:GOOGLE_API_KEY="your_gemini_api_key_here"

# Execute the test script
npx tsx src/test-ai-chat.ts
```

## What the Test Verifies

1. **Test 1: Simple Greeting**
   - Verifies the `gemini-2.0-flash` text generation capability.
   - Expected Output: A helpful response from the Medistore AI assistant.

2. **Test 2 & 3: Medicine & Category Searches**
   - Verifies the automatic function calling loop (`result.functionCalls`).
   - The model calls `get_medicines` and `get_categories` database tools, processes the returned values, and outputs a response.

3. **Test 4: Conversation History**
   - Verifies the multi-turn session logic using `client.chats.create({ history })` to ensure subsequent inquiries remember context.
