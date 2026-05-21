import { processAIChat } from "./modules/ai/ai.service";
import { config } from "./config";

async function testAIChat() {
  console.log("=== Testing AI Chatbot ===\n");

  // Test 1: Simple greeting
  console.log("Test 1: Simple greeting");
  try {
    const response1 = await processAIChat("Hello, I'm looking for medicine for fever");
    console.log("Response:", response1);
    console.log("✓ Test 1 passed\n");
  } catch (error: any) {
    console.error("✗ Test 1 failed:", error.message);
  }

  // Test 2: Medicine search
  console.log("Test 2: Medicine search");
  try {
    const response2 = await processAIChat("What medicines do you have for headache?");
    console.log("Response:", response2);
    console.log("✓ Test 2 passed\n");
  } catch (error: any) {
    console.error("✗ Test 2 failed:", error.message);
  }

  // Test 3: Category inquiry
  console.log("Test 3: Category inquiry");
  try {
    const response3 = await processAIChat("What categories of medicines do you have?");
    console.log("Response:", response3);
    console.log("✓ Test 3 passed\n");
  } catch (error: any) {
    console.error("✗ Test 3 failed:", error.message);
  }

  // Test 4: Conversation with history
  console.log("Test 4: Conversation with history");
  try {
    const history = [
      { role: "user", parts: "I need medicine for fever" },
      { role: "bot", parts: "I can help you find medicines for fever. Let me search for available options." }
    ];
    const response4 = await processAIChat("What are the prices?", history);
    console.log("Response:", response4);
    console.log("✓ Test 4 passed\n");
  } catch (error: any) {
    console.error("✗ Test 4 failed:", error.message);
  }

  console.log("=== Tests Complete ===");
}

// Run tests
testAIChat().catch(console.error);
