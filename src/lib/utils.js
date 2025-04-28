import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine Tailwind classes safely
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date to a human-readable format
export const formatDate = (dateString) => {
  // console.log("Received dateString:", dateString);
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}


// Check if a test is active based on current time
export const isTestActive = (test) => {
  const now = new Date()
  const startTime = new Date(test.startingTime)
  const endTime = new Date(test.endingTime)
  return now >= startTime && now <= endTime
}

// Check if a test is upcoming based on current time
export const isTestUpcoming = (test) => {
  const now = new Date()
  const startTime = new Date(test.startingTime)
  return now < startTime
}

// Check if a test is past based on current time
export const isTestPast = (test) => {
  const now = new Date()
  const endTime = new Date(test.endingTime)
  return now > endTime
}

// Filter submissions by section
export const filterSubmissionsBySection = (submissions, section) => {
  if (!section || section === "All") {
    return submissions
  }
  return submissions.filter(submission => submission.studentId.section === section)
}

// Get plagiarism submissions
export const getPlagiarismSubmissions = (submissions) => {
  return submissions.filter(submission => submission.plagrism[0].detected)
}

// Convert submissions to CSV for download
export const submissionsToCSV = (submissions) => {
  const headers = [
    "Student Name",
    "Roll No",
    "Section",
    "Marks",
    "Submitted At",
    "Plagiarism Detected",
    "Plagiarism With"
  ]
  
  const rows = submissions.map(submission => [
    submission.studentId.name,
    submission.studentId.rollNo,
    submission.studentId.section,
    submission.marksObtained.toString(),
    submission.submittedAt || new Date(),
    submission.plagrism[0].detected ? "Yes" : "No",
    submission.plagrism[0].detected ? submission.plagrism[0].studentId.name : ""
  ])
  
  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n")
}

// Download data as CSV file
export const downloadCSV = (data, filename) => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Generate default tips for tests
export const getDefaultTips = (language) => {
  const commonTips = [
    "Make sure to commit and push your changes regularly.",
    "Test your code before submitting to ensure it works correctly.",
  ]
  
  const languageSpecificTips = language === 'react' 
    ? [
        "You should provide the name of every route similar to shown in video or pdf (in react).",
        "Make sure all your components are properly separated.",
        "Check that your React app builds without warnings.",
      ]
    : [
        "You should provide the name of every page similar to shown in video or pdf (in HTML).",
        "Ensure your HTML pages are properly linked.",
        "Validate your HTML before submitting.",
      ]
  
  return [...commonTips, ...languageSpecificTips]
}

// Parse GitHub repository URL to get username and repo name
export const parseGitHubUrl = (url) => {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname !== 'github.com') return null
    
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) return null
    
    return {
      username: pathParts[0],
      repo: pathParts[1],
    }
  } catch (e) {
    return null
  }
}
