// Add users for authentication
export const users = [
  {
    id: "teacher1",
    name: "John Smith",
    email: "teacher@example.com",
    role: "teacher"
  },
  {
    id: "teacher2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "teacher"
  },
  {
    id: "student1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: "student"
  },
  {
    id: "student2",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "student"
  },
  {
    id: "student3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "student"
  },
  {
    id: "student4",
    name: "Diana Miller",
    email: "diana@example.com",
    role: "student"
  }
];

// Create a function to generate test dates
const getTestDates = (hoursFromNow) => {
  const date = new Date();
  const startTime = new Date(date.getTime() - (hoursFromNow * 60 * 60 * 1000));
  const endTime = new Date(startTime.getTime() + (4 * 60 * 60 * 1000)); // 4 hours duration
  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString()
  };
};

// Example active test (started 1 hour ago, ends in 3 hours)
const activeTestDates = getTestDates(1);

export const tests = [
  {
    id: "1",
    name: "React Components Test",
    repoUrl: "https://github.com/test/react-components",
    language: "react",
    course: "Advanced React",
    maxMarks: 100,
    startTime: activeTestDates.startTime,
    endTime: activeTestDates.endTime,
    instructionsPdfUrl: "https://example.com/instructions.pdf",
    videoUrl: "https://example.com/instruction-video.mp4",
    tips: [
      "Create reusable components",
      "Follow React best practices",
      "Implement proper prop types"
    ],
    createdBy: "teacher1"
  },
  {
    id: "2",
    name: "HTML Fundamentals Quiz",
    repoUrl: "https://github.com/test/html-fundamentals",
    language: "html",
    course: "Web Development Basics",
    maxMarks: 50,
    startTime: "2024-09-20T14:00:00.000Z",
    endTime: "2024-09-20T15:00:00.000Z",
    instructionsPdfUrl: "https://example.com/html-instructions.pdf",
    videoUrl: "https://example.com/html-video.mp4",
    tips: [
      "Use semantic HTML",
      "Validate your HTML",
      "Ensure accessibility"
    ],
    createdBy: "teacher1"
  },
  {
    id: "3",
    name: "Advanced CSS Layouts",
    repoUrl: "https://github.com/test/advanced-css",
    language: "html",
    course: "Advanced Web Design",
    maxMarks: 75,
    startTime: "2024-09-25T10:00:00.000Z",
    endTime: "2024-09-25T12:00:00.000Z",
    instructionsPdfUrl: "https://example.com/css-instructions.pdf",
    videoUrl: "https://example.com/css-video.mp4",
    tips: [
      "Use Flexbox and Grid",
      "Optimize for responsiveness",
      "Write clean CSS"
    ],
    createdBy: "teacher2"
  },
  {
    id: "4",
    name: "JavaScript Algorithms",
    repoUrl: "https://github.com/test/js-algorithms",
    language: "react",
    course: "Data Structures and Algorithms",
    maxMarks: 120,
    startTime: "2024-09-30T16:00:00.000Z",
    endTime: "2024-09-30T18:00:00.000Z",
    instructionsPdfUrl: "https://example.com/js-algo-instructions.pdf",
    videoUrl: "https://example.com/js-algo-video.mp4",
    tips: [
      "Understand Big O notation",
      "Implement common algorithms",
      "Test your code thoroughly"
    ],
    createdBy: "teacher2"
  },
];

export const testSubmissions = [
  {
    id: "101",
    testId: "1",
    studentId: "student1",
    studentName: "Alice Smith",
    rollNo: "ST1001",
    section: "A",
    repoUrl: "https://github.com/alice/react-test",
    marks: 85,
    submittedAt: "2024-09-20T15:30:00.000Z",
    plagiarismDetected: false,
  },
  {
    id: "102",
    testId: "2",
    studentId: "student1",
    studentName: "Alice Smith",
    rollNo: "ST1001",
    section: "A",
    repoUrl: "https://github.com/alice/html-quiz",
    marks: 45,
    submittedAt: "2024-09-20T16:00:00.000Z",
    plagiarismDetected: false,
  },
  {
    id: "103",
    testId: "1",
    studentId: "student2",
    studentName: "Bob Johnson",
    rollNo: "ST1002",
    section: "B",
    repoUrl: "https://github.com/bob/react-test",
    marks: 92,
    submittedAt: "2024-09-20T15:45:00.000Z",
    plagiarismDetected: false,
  },
  {
    id: "104",
    testId: "3",
    studentId: "student2",
    studentName: "Bob Johnson",
    rollNo: "ST1002",
    section: "B",
    repoUrl: "https://github.com/bob/css-layout",
    marks: 68,
    submittedAt: "2024-09-25T11:30:00.000Z",
    plagiarismDetected: false,
  },
  {
    id: "105",
    testId: "4",
    studentId: "student3",
    studentName: "Charlie Brown",
    rollNo: "ST1003",
    section: "A",
    repoUrl: "https://github.com/charlie/js-algorithms",
    marks: 110,
    submittedAt: "2024-09-30T17:30:00.000Z",
    plagiarismDetected: false,
  },
  {
    id: "106",
    testId: "4",
    studentId: "student4",
    studentName: "Diana Miller",
    rollNo: "ST1004",
    section: "B",
    repoUrl: "https://github.com/diana/js-algorithms",
    marks: 60,
    submittedAt: "2024-09-30T17:45:00.000Z",
    plagiarismDetected: true,
    plagiarismWithStudentId: "student3",
    plagiarismWithStudentName: "Charlie Brown",
  },
];
