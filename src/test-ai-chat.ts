import { processAIChat } from "./modules/ai/ai.service";

async function testAIChat() {
  console.log("=== Testing AI Chatbot ===\n");

  console.log("Test 1: Simple greeting");
  try {
    const response1 = await processAIChat("Hello, I'm looking for medicine for fever");
    console.log("Response:", response1);
    console.log("✓ Test 1 passed\n");
  } catch (error: any) {
    console.error("✗ Test 1 failed:", error.message);
  }

  console.log("=== Tests Complete ===");
}

// Run test
testAIChat().catch(console.error);


