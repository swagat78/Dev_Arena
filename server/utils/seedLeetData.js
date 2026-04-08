import { Contest } from '../models/Contest.js';
import { Problem } from '../models/Problem.js';

const STARTER_PROBLEMS = [
  {
    title: 'Two Sum Lite',
    slug: 'two-sum-lite',
    difficulty: 'easy',
    tags: ['array', 'hash-map'],
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to the target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: '[[2,7,11,15], 9]',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: '[[3,2,4], 6]',
        output: '[1,2]',
      },
    ],
    constraints: ['2 <= nums.length <= 10^5', '-10^9 <= nums[i], target <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      javascript: 'function solve([nums, target]) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    },
    testCases: [
      { input: '[[2,7,11,15],9]', expectedOutput: '[0,1]', isHidden: false },
      { input: '[[3,2,4],6]', expectedOutput: '[1,2]', isHidden: false },
      { input: '[[3,3],6]', expectedOutput: '[0,1]', isHidden: true },
    ],
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    tags: ['stack', 'string'],
    description: 'Given a string containing only brackets, determine if it is valid. Open brackets must be closed by the same type of brackets, and must be closed in the correct order.',
    examples: [
      {
        input: '"()"',
        output: 'true',
        explanation: 'Simple balanced pair.',
      },
      {
        input: '"()[]{}"',
        output: 'true',
        explanation: 'All brackets close in order.',
      },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    starterCode: {
      javascript: 'function solve(s) {\n  const stack = [];\n  const map = { ")": "(", "]": "[", "}": "{" };\n  for (const char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}',
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true', isHidden: false },
      { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { input: '"(]"', expectedOutput: 'false', isHidden: true },
    ],
  },
  {
    title: 'Longest Substring Without Repeating',
    slug: 'longest-substring-without-repeating',
    difficulty: 'medium',
    tags: ['string', 'sliding-window'],
    description: 'Find the length of the longest substring without repeating characters in a given string s.',
    examples: [
      {
        input: '"abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: '"bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: {
      javascript: 'function solve(s) {\n  const seen = new Map();\n  let maxLen = 0;\n  let start = 0;\n  for (let end = 0; end < s.length; end++) {\n    if (seen.has(s[end]) && seen.get(s[end]) >= start) {\n      start = seen.get(s[end]) + 1;\n    }\n    seen.set(s[end], end);\n    maxLen = Math.max(maxLen, end - start + 1);\n  }\n  return maxLen;\n}',
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3', isHidden: false },
      { input: '"bbbbb"', expectedOutput: '1', isHidden: false },
      { input: '"pwwkew"', expectedOutput: '3', isHidden: true },
    ],
  },
  {
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'easy',
    tags: ['string', 'two-pointers'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      {
        input: '["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
    ],
    constraints: ['1 <= s.length <= 10^5'],
    starterCode: {
      javascript: 'function solve(s) {\n  let left = 0;\n  let right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}',
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false },
    ],
  },
  {
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'easy',
    tags: ['math'],
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.',
    examples: [
      {
        input: '121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.',
      },
      {
        input: '-121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.',
      },
    ],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    starterCode: {
      javascript: 'function solve(x) {\n  if (x < 0) return false;\n  const str = String(x);\n  return str === str.split("").reverse().join("");\n}',
    },
    testCases: [
      { input: '121', expectedOutput: 'true', isHidden: false },
      { input: '-121', expectedOutput: 'false', isHidden: false },
      { input: '10', expectedOutput: 'false', isHidden: true },
    ],
  },
  {
    title: 'Maximum Subarray Sum',
    slug: 'maximum-subarray-sum',
    difficulty: 'medium',
    tags: ['array', 'dynamic-programming'],
    description:
      'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'Subarray [4,-1,2,1] has the largest sum = 6.',
      },
      {
        input: '[1]',
        output: '1',
      },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript:
        'function solve(nums) {\n  let best = nums[0];\n  let current = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    current = Math.max(nums[i], current + nums[i]);\n    best = Math.max(best, current);\n  }\n  return best;\n}',
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
      { input: '[1]', expectedOutput: '1', isHidden: false },
      { input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true },
    ],
  },
  {
    title: 'Merge Sorted Arrays',
    slug: 'merge-sorted-arrays',
    difficulty: 'easy',
    tags: ['array', 'two-pointers'],
    description:
      'Given two sorted arrays, return a new sorted array containing all elements from both arrays.',
    examples: [
      {
        input: '[[1,2,4],[1,3,4]]',
        output: '[1,1,2,3,4,4]',
      },
      {
        input: '[[],[0]]',
        output: '[0]',
      },
    ],
    constraints: ['0 <= n, m <= 10^4', '-10^9 <= arr[i] <= 10^9'],
    starterCode: {
      javascript:
        'function solve([a, b]) {\n  const merged = [];\n  let i = 0;\n  let j = 0;\n  while (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) merged.push(a[i++]);\n    else merged.push(b[j++]);\n  }\n  while (i < a.length) merged.push(a[i++]);\n  while (j < b.length) merged.push(b[j++]);\n  return merged;\n}',
    },
    testCases: [
      { input: '[[1,2,4],[1,3,4]]', expectedOutput: '[1,1,2,3,4,4]', isHidden: false },
      { input: '[[],[0]]', expectedOutput: '[0]', isHidden: false },
      { input: '[[2,5,8],[1,3,6,7]]', expectedOutput: '[1,2,3,5,6,7,8]', isHidden: true },
    ],
  },
  {
    title: 'Binary Search Position',
    slug: 'binary-search-position',
    difficulty: 'easy',
    tags: ['binary-search'],
    description:
      'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.',
    examples: [
      {
        input: '[[1,3,5,7,9], 7]',
        output: '3',
      },
      {
        input: '[[1,3,5,7,9], 2]',
        output: '-1',
      },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i], target <= 10^9'],
    starterCode: {
      javascript:
        'function solve([nums, target]) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
    },
    testCases: [
      { input: '[[1,3,5,7,9],7]', expectedOutput: '3', isHidden: false },
      { input: '[[1,3,5,7,9],2]', expectedOutput: '-1', isHidden: false },
      { input: '[[2,4,6,8,10,12],12]', expectedOutput: '5', isHidden: true },
    ],
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'medium',
    tags: ['array', 'prefix-suffix'],
    description:
      'Given an integer array nums, return an array output where output[i] is the product of all elements of nums except nums[i], without using division.',
    examples: [
      {
        input: '[1,2,3,4]',
        output: '[24,12,8,6]',
      },
      {
        input: '[-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
      },
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    starterCode: {
      javascript:
        'function solve(nums) {\n  const result = new Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    result[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    result[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return result;\n}',
    },
    testCases: [
      { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', isHidden: false },
      { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]', isHidden: false },
      { input: '[2,3,4,5]', expectedOutput: '[60,40,30,24]', isHidden: true },
    ],
  },
  {
    title: 'Climbing Stairs Ways',
    slug: 'climbing-stairs-ways',
    difficulty: 'easy',
    tags: ['dynamic-programming'],
    description:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. Return how many distinct ways you can climb to the top.',
    examples: [
      {
        input: '2',
        output: '2',
      },
      {
        input: '5',
        output: '8',
      },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript:
        'function solve(n) {\n  if (n <= 2) return n;\n  let a = 1;\n  let b = 2;\n  for (let i = 3; i <= n; i++) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}',
    },
    testCases: [
      { input: '2', expectedOutput: '2', isHidden: false },
      { input: '5', expectedOutput: '8', isHidden: false },
      { input: '8', expectedOutput: '34', isHidden: true },
    ],
  },
];

const buildStarterContest = (problemIds = []) => {
  const now = Date.now();
  return {
    title: 'Weekly Contest 1',
    slug: 'weekly-contest-1',
    description: 'Starter weekly contest with mixed difficulty problems.',
    startTime: new Date(now - 60 * 60 * 1000),
    endTime: new Date(now + 24 * 60 * 60 * 1000),
    problemIds: problemIds.slice(0, 6),
  };
};

let seeded = false;

export const ensureLeetSeedData = async () => {
  if (seeded) return;

  await Promise.all(
    STARTER_PROBLEMS.map((problem) =>
      Problem.updateOne(
        { slug: problem.slug },
        { $setOnInsert: problem },
        { upsert: true }
      )
    )
  );

  const contestCount = await Contest.countDocuments();
  if (contestCount === 0) {
    const allProblems = await Problem.find().sort({ createdAt: 1 }).select('_id');
    await Contest.create(buildStarterContest(allProblems.map((p) => p._id)));
  }

  seeded = true;
};
