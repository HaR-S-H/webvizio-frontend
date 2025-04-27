
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestResults } from "@/components/teacher/TestResults";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { tests, testSubmissions } from "@/lib/dummy-data";
import { AlertCircle, Check, Clock } from "lucide-react";

export default function TestDetail() {
  const { testId } = useParams();
  
  const test = tests.find(t => t.id === testId);
  if (!test) {
    return <Navigate to="/teacher" replace />;
  }
  
  // Get submissions for this test
  const submissions = testSubmissions.filter(submission => submission.testId === test.id);
  
  // Determine test status
  let statusComponent;
  if (isTestActive(test)) {
    statusComponent = (
      <Alert className="border-green-500">
        <Check className="h-4 w-4 text-green-500" />
        <AlertTitle>Active Assessment</AlertTitle>
        <AlertDescription>
          This assessment is currently active and available for students to take.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestUpcoming(test)) {
    statusComponent = (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>Upcoming Assessment</AlertTitle>
        <AlertDescription>
          This assessment will be available to students starting at {formatDate(test.startTime)}.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestPast(test)) {
    statusComponent = (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Completed Assessment</AlertTitle>
        <AlertDescription>
          This assessment ended at {formatDate(test.endTime)}.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
            <p className="text-muted-foreground">{test.course}</p>
          </div>
          <Badge className="text-sm py-1">
            {test.language === "react" ? "React" : "HTML"}
          </Badge>
        </div>
        
        {statusComponent}
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Assessment information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Repository URL</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    <a href={test.repoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                      {test.repoUrl}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Max Marks</h3>
                  <p className="text-sm text-muted-foreground">{test.maxMarks}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Start Time</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(test.startTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">End Time</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(test.endTime)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Resources</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {test.instructionsPdfUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={test.instructionsPdfUrl} target="_blank" rel="noopener noreferrer">
                        View Instructions PDF
                      </a>
                    </Button>
                  )}
                  {test.videoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={test.videoUrl} target="_blank" rel="noopener noreferrer">
                        Watch Instructions Video
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Tips for Students</h3>
                <ul className="list-disc pl-5 mt-1">
                  {test.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Submission Overview</CardTitle>
              <CardDescription>Summary of student submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">{submissions.length}</div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">
                    {submissions.filter(s => s.plagiarismDetected).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Plagiarism Cases</p>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Average Score</h3>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ 
                        width: `${submissions.length > 0 
                          ? (submissions.reduce((sum, s) => sum + s.marks, 0) / submissions.length) / test.maxMarks * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {submissions.length > 0 
                      ? Math.round((submissions.reduce((sum, s) => sum + s.marks, 0) / submissions.length) * 10) / 10
                      : 0} / {test.maxMarks}
                  </span>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-1">Section Distribution</h3>
                <div className="space-y-1">
                  {Array.from(new Set(submissions.map(s => s.section))).map(section => {
                    const sectionCount = submissions.filter(s => s.section === section).length;
                    return (
                      <div key={section} className="flex justify-between items-center text-sm">
                        <span>Section {section}</span>
                        <Badge variant="outline">{sectionCount} students</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              Review all student submissions for this assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestResults submissions={submissions} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
