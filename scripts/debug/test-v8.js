const { runPrediction } = require('./src/lib/predictor');

const mockData = [
  {
    college: "SM College (High Demand)",
    college_code: "SMC",
    quota: "SM",
    cutoff_2025: 275,
    cutoff_2024: 275,
    safe_cutoff_2025: 280,
    safe_cutoff_2024: 280,
    trend: "Stable →",
    total_seats: 30
  },
  {
    college: "SC College (Sparse Tail)",
    college_code: "SCC",
    quota: "SC",
    cutoff_2025: 235,
    cutoff_2024: 235,
    safe_cutoff_2025: 240,
    safe_cutoff_2024: 240,
    trend: "Stable →",
    total_seats: 15
  }
];

console.log("--- TESTING v8 INTELLIGENCE ---");

// Test 1: SM student with +5 buffer
console.log("\n[TEST 1] SM student with +5 buffer (Mark 285 vs 280 Safe)");
const result1 = runPrediction([mockData[0]], 285);
console.log(`Result: ${result1[0].display} | Confidence: ${result1[0].confidence}`);
console.log(`Explanation: ${result1[0].explanation}`);

// Test 2: SC student with +5 buffer
console.log("\n[TEST 2] SC student with +5 buffer (Mark 245 vs 240 Safe)");
const result2 = runPrediction([mockData[1]], 245);
console.log(`Result: ${result2[0].display} | Confidence: ${result2[0].confidence}`);
console.log(`Explanation: ${result2[0].explanation}`);

console.log("\n--- VERIFICATION COMPLETE ---");
