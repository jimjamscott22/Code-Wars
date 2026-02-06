import type { Challenge, Category } from '../types.ts'

export const challenges: Challenge[] = [
  // ─── Basics ────────────────────────────────────────────
  {
    id: 'hello-coder',
    title: 'Hello Coder',
    category: 'basics',
    difficulty: 'Beginner',
    description: "Write a function that takes a name and returns 'Hello, [name]!'",
    examples: ["hello('Alice') → 'Hello, Alice!'", "hello('Bob') → 'Hello, Bob!'"],
    solutions: {
      python: `def hello(name):
    return f'Hello, {name}!'`,
      javascript: `function hello(name) {
    return \`Hello, \${name}!\`;
}`,
      java: `public static String hello(String name) {
    return "Hello, " + name + "!";
}`,
    },
  },
  {
    id: 'sum-of-evens',
    title: 'Sum of Evens',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Write a function that returns the sum of all even numbers from 1 to n',
    examples: ['sum_evens(10) → 30 (2+4+6+8+10)', 'sum_evens(5) → 6 (2+4)'],
    solutions: {
      python: `def sum_evens(n):
    return sum(i for i in range(2, n+1, 2))`,
      javascript: `function sumEvens(n) {
    let sum = 0;
    for (let i = 2; i <= n; i += 2) {
        sum += i;
    }
    return sum;
}`,
      java: `public static int sumEvens(int n) {
    int sum = 0;
    for (int i = 2; i <= n; i += 2) {
        sum += i;
    }
    return sum;
}`,
    },
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    category: 'basics',
    difficulty: 'Beginner',
    description:
      'Write a function that returns an array of strings for numbers 1 to n. For multiples of 3, use "Fizz". For multiples of 5, use "Buzz". For multiples of both, use "FizzBuzz". Otherwise, use the number as a string.',
    examples: [
      'fizzbuzz(5) → ["1","2","Fizz","4","Buzz"]',
      'fizzbuzz(15) → ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
    ],
    solutions: {
      python: `def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`,
      javascript: `function fizzbuzz(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) result.push("FizzBuzz");
        else if (i % 3 === 0) result.push("Fizz");
        else if (i % 5 === 0) result.push("Buzz");
        else result.push(String(i));
    }
    return result;
}`,
      java: `public static List<String> fizzbuzz(int n) {
    List<String> result = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) result.add("FizzBuzz");
        else if (i % 3 == 0) result.add("Fizz");
        else if (i % 5 == 0) result.add("Buzz");
        else result.add(String.valueOf(i));
    }
    return result;
}`,
    },
  },

  // ─── Strings ───────────────────────────────────────────
  {
    id: 'palindrome-checker',
    title: 'Palindrome Checker',
    category: 'strings',
    difficulty: 'Intermediate',
    description:
      'Write a function that checks if a string is a palindrome (ignoring spaces and case)',
    examples: [
      "is_palindrome('racecar') → true",
      "is_palindrome('A man a plan a canal Panama') → true",
    ],
    solutions: {
      python: `def is_palindrome(s):
    clean = ''.join(s.lower().split())
    return clean == clean[::-1]`,
      javascript: `function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/\\s/g, '');
    return clean === clean.split('').reverse().join('');
}`,
      java: `public static boolean isPalindrome(String s) {
    String clean = s.toLowerCase().replaceAll("\\\\s", "");
    return clean.equals(new StringBuilder(clean).reverse().toString());
}`,
    },
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    category: 'strings',
    difficulty: 'Advanced',
    description: 'Find the length of the longest substring without repeating characters',
    examples: [
      "longest_substring('abcabcbb') → 3",
      "longest_substring('pwwkew') → 3",
    ],
    solutions: {
      python: `def longest_substring(s):
    seen = {}
    start = max_len = 0
    for i, char in enumerate(s):
        if char in seen and seen[char] >= start:
            start = seen[char] + 1
        seen[char] = i
        max_len = max(max_len, i - start + 1)
    return max_len`,
      javascript: `function longestSubstring(s) {
    const seen = new Map();
    let start = 0, maxLen = 0;
    for (let i = 0; i < s.length; i++) {
        if (seen.has(s[i]) && seen.get(s[i]) >= start) {
            start = seen.get(s[i]) + 1;
        }
        seen.set(s[i], i);
        maxLen = Math.max(maxLen, i - start + 1);
    }
    return maxLen;
}`,
      java: `public static int longestSubstring(String s) {
    Map<Character, Integer> seen = new HashMap<>();
    int start = 0, maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        if (seen.containsKey(s.charAt(i)) && seen.get(s.charAt(i)) >= start) {
            start = seen.get(s.charAt(i)) + 1;
        }
        seen.put(s.charAt(i), i);
        maxLen = Math.max(maxLen, i - start + 1);
    }
    return maxLen;
}`,
    },
  },
  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    category: 'strings',
    difficulty: 'Intermediate',
    description:
      'Write a function that reverses the order of words in a string. Extra spaces should be removed.',
    examples: [
      "reverse_words('hello world') → 'world hello'",
      "reverse_words('  the sky is blue  ') → 'blue is sky the'",
    ],
    solutions: {
      python: `def reverse_words(s):
    return ' '.join(s.split()[::-1])`,
      javascript: `function reverseWords(s) {
    return s.trim().split(/\\s+/).reverse().join(' ');
}`,
      java: `public static String reverseWords(String s) {
    String[] words = s.trim().split("\\\\s+");
    Collections.reverse(Arrays.asList(words));
    return String.join(" ", words);
}`,
    },
  },

  // ─── Hash Maps ─────────────────────────────────────────
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    category: 'hash-maps',
    difficulty: 'Intermediate',
    description:
      'Given an array of integers and a target sum, return indices of two numbers that add up to the target',
    examples: ['two_sum([2,7,11,15], 9) → [0,1]', 'two_sum([3,2,4], 6) → [1,2]'],
    solutions: {
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
      java: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
    },
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    category: 'hash-maps',
    difficulty: 'Beginner',
    description:
      'Write a function that determines if two strings are anagrams of each other (contain the same characters with the same frequencies).',
    examples: [
      "is_anagram('listen', 'silent') → true",
      "is_anagram('hello', 'world') → false",
    ],
    solutions: {
      python: `def is_anagram(s, t):
    return sorted(s) == sorted(t)`,
      javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const count = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;
    for (const c of t) {
        if (!count[c]) return false;
        count[c]--;
    }
    return true;
}`,
      java: `public static boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    char[] a = s.toCharArray();
    char[] b = t.toCharArray();
    Arrays.sort(a);
    Arrays.sort(b);
    return Arrays.equals(a, b);
}`,
    },
  },

  // ─── Trees ─────────────────────────────────────────────
  {
    id: 'binary-tree-depth',
    title: 'Binary Tree Depth',
    category: 'trees',
    difficulty: 'Advanced',
    description:
      'Find the maximum depth of a binary tree. Assume a TreeNode class with left, right, and val properties.',
    examples: ['Tree: [3,9,20,null,null,15,7] → 3', 'Tree: [1,null,2] → 2'],
    solutions: {
      python: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
      javascript: `function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      java: `public static int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    },
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    category: 'trees',
    difficulty: 'Intermediate',
    description:
      'Write a function that inverts a binary tree (swaps left and right children at every node). Return the root of the inverted tree.',
    examples: [
      'Tree: [4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]',
      'Tree: [2,1,3] → [2,3,1]',
    ],
    solutions: {
      python: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
      javascript: `function invertTree(root) {
    if (!root) return null;
    const temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
}`,
      java: `public static TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
}`,
    },
  },

  // ─── Sorting ───────────────────────────────────────────
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'Beginner',
    description:
      'Implement bubble sort to sort an array of integers in ascending order. Return the sorted array.',
    examples: [
      'bubble_sort([5,3,8,4,2]) → [2,3,4,5,8]',
      'bubble_sort([1]) → [1]',
    ],
    solutions: {
      python: `def bubble_sort(arr):
    arr = arr[:]
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      javascript: `function bubbleSort(arr) {
    arr = [...arr];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
      java: `public static int[] bubbleSort(int[] arr) {
    arr = arr.clone();
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}`,
    },
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'sorting',
    difficulty: 'Advanced',
    description:
      'Implement merge sort using the divide-and-conquer approach to sort an array of integers in ascending order.',
    examples: [
      'merge_sort([38,27,43,3,9,82,10]) → [3,9,10,27,38,43,82]',
      'merge_sort([5,1]) → [1,5]',
    ],
    solutions: {
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i), right.slice(j));
}`,
      java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
}

private static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result[k++] = left[i++];
        else result[k++] = right[j++];
    }
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    return result;
}`,
    },
  },
]

export function getChallengesByCategory(category: Category): Challenge[] {
  return challenges.filter(c => c.category === category)
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id)
}

export function getCategories(): Category[] {
  return [...new Set(challenges.map(c => c.category))]
}

export function getChallengeCountByCategory(category: Category): number {
  return challenges.filter(c => c.category === category).length
}
