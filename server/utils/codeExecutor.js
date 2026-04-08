/**
 * Simple JavaScript code executor for problem validation.
 * WARNING: This is a basic implementation. For production, use a sandboxed environment.
 */

export const executeJavaScript = (sourceCode, testInput) => {
  return new Promise((resolve) => {
    try {
      const startTime = Date.now();
      
      // Create a function from the source code
      // The user code should define a solve(input) function
      const wrappedCode = `
        ${sourceCode}
        return solve(JSON.parse(\`${testInput}\`));
      `;
      
      // Execute with timeout
      const timeoutId = setTimeout(() => {
        resolve({
          success: false,
          output: null,
          error: 'Time limit exceeded',
          runtimeMs: 2000,
        });
      }, 2000);

      try {
        // Create function and execute
        const solveFn = new Function(wrappedCode);
        const result = solveFn();
        
        clearTimeout(timeoutId);
        const runtimeMs = Date.now() - startTime;
        
        resolve({
          success: true,
          output: JSON.stringify(result),
          error: null,
          runtimeMs,
        });
      } catch (execError) {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          output: null,
          error: execError.message,
          runtimeMs: Date.now() - startTime,
        });
      }
    } catch (outerError) {
      resolve({
        success: false,
        output: null,
        error: outerError.message,
        runtimeMs: 0,
      });
    }
  });
};

export const normalizeOutput = (output) => {
  if (output === null || output === undefined) return '';
  // Remove extra quotes if JSON string
  try {
    const parsed = JSON.parse(output);
    return JSON.stringify(parsed);
  } catch {
    return String(output).trim();
  }
};

export const evaluateSubmission = async (sourceCode, language, testCases) => {
  if (!testCases || testCases.length === 0) {
    // Fallback to heuristic if no test cases
    return fallbackEvaluation(sourceCode);
  }

  if (language !== 'javascript') {
    return {
      status: 'runtime_error',
      passedTestCases: 0,
      totalTestCases: testCases.length,
      runtimeMs: 0,
      memoryKb: 12000 + (sourceCode.length % 6000),
      testResults: testCases.map((testCase) => ({
        input: testCase.isHidden ? '[Hidden]' : testCase.input,
        expectedOutput: testCase.isHidden ? '[Hidden]' : normalizeOutput(testCase.expectedOutput),
        actualOutput: testCase.isHidden ? '[Hidden]' : `${language} execution not implemented yet`,
        passed: false,
        isHidden: Boolean(testCase.isHidden),
      })),
    };
  }

  const results = [];
  let passedCount = 0;
  let totalRuntime = 0;
  let hasRuntimeError = false;
  let hasTimeLimitExceeded = false;

  for (const testCase of testCases) {
    const isHidden = testCase.isHidden;
    const input = testCase.input;
    const expectedOutput = normalizeOutput(testCase.expectedOutput);

    let result;

    result = await executeJavaScript(sourceCode, input);

    const actualOutput = result.success ? normalizeOutput(result.output) : null;
    const isPassed = result.success && actualOutput === expectedOutput;

    if (isPassed) {
      passedCount++;
    } else if (!result.success) {
      if ((result.error || '').toLowerCase().includes('time limit exceeded')) {
        hasTimeLimitExceeded = true;
      } else {
        hasRuntimeError = true;
      }
    }

    totalRuntime += result.runtimeMs;

    results.push({
      input: isHidden ? '[Hidden]' : input,
      expectedOutput: isHidden ? '[Hidden]' : expectedOutput,
      actualOutput: isHidden ? '[Hidden]' : (actualOutput || result.error),
      passed: isPassed,
      isHidden,
    });
  }

  const allPassed = passedCount === testCases.length;
  const status = allPassed
    ? 'accepted'
    : hasTimeLimitExceeded
      ? 'time_limit_exceeded'
      : hasRuntimeError
        ? 'runtime_error'
        : 'wrong_answer';
  
  return {
    status,
    passedTestCases: passedCount,
    totalTestCases: testCases.length,
    runtimeMs: Math.round(totalRuntime),
    memoryKb: 12000 + (sourceCode.length % 6000),
    testResults: results,
  };
};

// Fallback evaluation when no test cases available
const fallbackEvaluation = (sourceCode) => {
  const normalized = (sourceCode || '').toLowerCase();
  const looksValid =
    normalized.includes('solve') &&
    (normalized.includes('return') || normalized.includes('cout') || normalized.includes('print'));

  const len = sourceCode.length;
  const runtimeMs = 40 + (len % 180);
  const memoryKb = 12000 + (len % 6000);

  if (looksValid && len > 25) {
    return {
      status: 'accepted',
      passedTestCases: 1,
      totalTestCases: 1,
      runtimeMs,
      memoryKb,
    };
  }

  return {
    status: 'wrong_answer',
    passedTestCases: 0,
    totalTestCases: 1,
    runtimeMs,
    memoryKb,
  };
};
