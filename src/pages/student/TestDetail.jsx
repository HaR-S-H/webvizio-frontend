
import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestSubmissionForm } from "@/components/student/TestSubmissionForm";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { tests, testSubmissions } from "@/lib/dummy-data";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Check, Clock } from "lucide-react";

export default function StudentTestDetail() {
  const { testId } = useParams();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  
  const test = tests.find(t => t.id === testId);
  if (!test) {
    return <Navigate to="/student" replace />;
  }
  
  // Check if the user has already submitted this test
  const existingSubmission = testSubmissions.find(
    sub => sub.testId === test.id && sub.studentId === user?.id
  );
  
  const hasSubmitted = submitted || !!existingSubmission;
  
  // Determine test status
  let statusComponent;
  let canSubmit = false;
  
  if (hasSubmitted) {
    statusComponent = (
      <Alert>
        <Check className="h-4 w-4" />
        <AlertTitle>Submitted</AlertTitle>
        <AlertDescription>
          You have already submitted your solution for this test.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestActive(test)) {
    statusComponent = (
      <Alert className="border-green-500">
        <Check className="h-4 w-4 text-green-500" />
        <AlertTitle>Active Assessment</AlertTitle>
        <AlertDescription>
          This assessment is currently active. Please submit your solution before {formatDate(test.endTime)}.
        </AlertDescription>
      </Alert>
    );
    canSubmit = true;
  } else if (isTestUpcoming(test)) {
    statusComponent = (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>Upcoming Assessment</AlertTitle>
        <AlertDescription>
          This assessment will be available starting at {formatDate(test.startTime)}.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestPast(test)) {
    statusComponent = (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Assessment Ended</AlertTitle>
        <AlertDescription>
          This assessment ended at {formatDate(test.endTime)} and is no longer accepting submissions.
        </AlertDescription>
      </Alert>
    );
  }
  
  const handleSubmitSuccess = () => {
    setSubmitted(true);
  };
  
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
        
        {hasSubmitted && existingSubmission && (
          <Card className={existingSubmission.plagiarismDetected ? "border-destructive" : ""}>
            <CardHeader className={existingSubmission.plagiarismDetected ? "text-destructive" : ""}>
              <CardTitle>Your Submission</CardTitle>
              <CardDescription>
                Submitted on {new Date(existingSubmission.submittedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Repository URL</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    <a href={existingSubmission.repoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                      {existingSubmission.repoUrl}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Score</h3>
                  <p className="text-sm font-bold">
                    {existingSubmission.plagiarismDetected 
                      ? "0" 
                      : existingSubmission.marks
                    } / {test.maxMarks}
                  </p>
                </div>
              </div>
              
              {existingSubmission.plagiarismDetected && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Plagiarism Detected</AlertTitle>
                  <AlertDescription>
                    Your submission was flagged for plagiarism with {existingSubmission.plagiarismWithStudentName}.
                    As a result, your score has been set to 0.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
        
        {canSubmit && !hasSubmitted && (
          <TestSubmissionForm test={test} onSuccess={handleSubmitSuccess} />
        )}
        
        {!canSubmit && !hasSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>
                Details about this assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">{test.language.toUpperCase()}</p>
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
              
              {(test.instructionsPdfUrl || test.videoUrl) && (
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
              )}
              
              {test.tips.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Tips</h3>
                  <ul className="list-disc pl-5 mt-1">
                    {test.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
