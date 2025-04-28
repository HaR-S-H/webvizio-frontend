
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestSubmissionForm } from "@/components/student/TestSubmissionForm";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Check, Clock } from "lucide-react";
import { useStudentTests } from "@/context/StudentContext";
import { studentTestApi } from "@/api/test";
export default function StudentTestDetailSuccess() {
  const { testId } = useParams();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { tests, submittedTests } = useStudentTests();
  const test = submittedTests.find(t => t.testId._id === testId);
  
  if (!test) {
    return <Navigate to="/student" replace />;
  }
  console.log(submittedTests);
  
  const testSubmissions = submittedTests;
  // Check if the user has already submitted this test
  const existingSubmission = testSubmissions?.find(
    sub => sub.testId._id === test.testId._id 
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
  } else if (isTestActive(test.testId)) {
    statusComponent = (
      <Alert className="border-green-500">
        <Check className="h-4 w-4 text-green-500" />
        <AlertTitle>Active Assessment</AlertTitle>
        <AlertDescription>
          This assessment is currently active. Please submit your solution before {formatDate(test.testId.endingTime)}.
        </AlertDescription>
      </Alert>
    );

    
    canSubmit = true;
  } else if (isTestUpcoming(test.testId)) {
    statusComponent = (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>Upcoming Assessment</AlertTitle>
        <AlertDescription>
          This assessment will be available starting at {formatDate(test.startingTime)}.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestPast(test.testId)) {
    statusComponent = (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Assessment Ended</AlertTitle>
        <AlertDescription>
          This assessment ended at {formatDate(test.testId.endingTime)} and is no longer accepting submissions.
        </AlertDescription>
      </Alert>
    );
  }
  
  const handleSubmitSuccess = async(testId,repoUrl) => {
    const response = await studentTestApi.submitTest(testId, repoUrl);
    if (response.statusCode === 200) {
      navigate("/student");
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{test.testId.name}</h1>
            <p className="text-muted-foreground">{test.testId.course}</p>
          </div>
          <Badge className="text-sm py-1">
            {test.testId.language === "react" ? "React" : "HTML"}
          </Badge>
        </div>
        
        {statusComponent}
        
        {hasSubmitted && existingSubmission && (
          <Card className={existingSubmission.plagrism[0]?.detected ? "border-destructive" : ""}>
            <CardHeader className={existingSubmission.plagrism[0]?.detected ? "text-destructive" : ""}>
              <CardTitle>Your Submission</CardTitle>
              <CardDescription>
                Submitted on {new Date(existingSubmission.testId.updatedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Repository URL</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    <a href={existingSubmission.githubLink} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                      {existingSubmission.githubLink}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Score</h3>
                  <p className="text-sm font-bold">
                    {existingSubmission.plagrism[0]?.detected
                      ? "0" 
                      : existingSubmission.marksObtained
                    } / {test.testId.maxMarks}
                  </p>
                </div>
              </div>
              
              {existingSubmission.plagrism[0]?.detected && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Plagiarism Detected</AlertTitle>
                  <AlertDescription>
                    Your submission was flagged for plagiarism with {existingSubmission?.plagrism[0]?.detected?existingSubmission?.plagrism[0]?.studentId.name:"no one"};
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
                  <p className="text-sm text-muted-foreground">{test.testId.language.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Max Marks</h3>
                  <p className="text-sm text-muted-foreground">{test.testId.maxMarks}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Start Time</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(test.testId.startingTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">End Time</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(test.testId.endingTime)}</p>
                </div>
              </div>
              
              {(test.PdfUrl || test.videoUrl) && (
                <div>
                  <h3 className="text-sm font-medium">Resources</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {test.pdfUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={test.pdfUrl} target="_blank" rel="noopener noreferrer">
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
              
              {test.testId.tips.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Tips</h3>
                  <ul className="list-disc pl-5 mt-1">
                    {test.testId.tips.map((tip, index) => (
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
