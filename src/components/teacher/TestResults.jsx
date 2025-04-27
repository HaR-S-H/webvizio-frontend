
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { downloadCSV, filterSubmissionsBySection, getPlagiarismSubmissions, submissionsToCSV } from "@/lib/utils";
import { FileDown } from "lucide-react";



export function TestResults({ submissions }) {
  const [selectedSection, setSelectedSection] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get unique sections
  const sections = ["All", ...new Set(submissions.map(sub => sub.section))];
  
  // Filter submissions based on section and search query
  const filteredSubmissions = filterSubmissionsBySection(
    submissions.filter(sub => 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    selectedSection
  );
  
  // Handle section change
  const handleSectionChange = (value) => {
    setSelectedSection(value);
  };
  
  // Handle downloading results as CSV
  const handleDownloadResults = () => {
    const data = submissionsToCSV(filteredSubmissions);
    downloadCSV(data, `results-${selectedSection !== "All" ? selectedSection : "all"}.csv`);
  };
  
  // Handle downloading plagiarism report
  const handleDownloadPlagiarismReport = () => {
    const plagiarismData = submissionsToCSV(getPlagiarismSubmissions(submissions));
    downloadCSV(plagiarismData, "plagiarism-report.csv");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search by name or roll number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={selectedSection} onValueChange={handleSectionChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  Section {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadResults}>
            <FileDown size={16} className="mr-2" />
            Download Results
          </Button>
          <Button variant="outline" onClick={handleDownloadPlagiarismReport}>
            <FileDown size={16} className="mr-2" />
            Plagiarism Report
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.studentName}</TableCell>
                  <TableCell>{submission.rollNo}</TableCell>
                  <TableCell>Section {submission.section}</TableCell>
                  <TableCell>{submission.marks}</TableCell>
                  <TableCell>
                    {submission.plagiarismDetected ? (
                      <div className="flex flex-col gap-1">
                        <Badge variant="destructive">Plagiarism Detected</Badge>
                        <span className="text-xs text-muted-foreground">
                          With: {submission.plagiarismWithStudentName}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
