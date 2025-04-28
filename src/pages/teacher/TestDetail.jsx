import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TestResults } from "@/components/teacher/TestResults";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { AlertCircle, Check, Clock } from "lucide-react";
import { useTests } from '@/context/TestContext';
import { useEffect, useState } from "react";
import { resultApi } from "@/api/result";
export default function TestDetail() {
  const { testId } = useParams();
  const { tests } = useTests();
  const [submissions, setSubmissions] = useState([]);
  const test = tests.find(t => t.testId?._id === testId);
  
  if (!test) {
    return <Navigate to="/teacher" replace />;
  }

  // Use test.testId to access the test data
  const testData = test.testId;
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await resultApi.getResult(testData._id);
        
        setSubmissions(response);

        
      } catch (error) {
        console.error("Failed to fetch results:", error);
      }
    };
  
    fetchResult();
  }, [testData._id]);
  
  // Get submissions for this test
  
  // Determine test status
  let statusComponent;
  if (isTestActive(testData)) {
    statusComponent = (
      <Alert className="border-green-500">
        <Check className="h-4 w-4 text-green-500" />
        <AlertTitle>Active Assessment</AlertTitle>
        <AlertDescription>
          This assessment is currently active and available for students to take.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestUpcoming(testData)) {
    statusComponent = (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>Upcoming Assessment</AlertTitle>
        <AlertDescription>
          This assessment will be available to students starting at {formatDate(testData.startingTime)}.
        </AlertDescription>
      </Alert>
    );
  } else if (isTestPast(testData)) {
    statusComponent = (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Completed Assessment</AlertTitle>
        <AlertDescription>
          This assessment ended at {formatDate(testData.endingTime)}.
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
            <h1 className="text-3xl font-bold tracking-tight">{testData.name}</h1>
            <p className="text-muted-foreground">{testData.course}</p>
          </div>
          <Badge className="text-sm py-1">
            {testData.language === "react" ? "React" : "HTML"}
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
                    <a href={test.githubLink} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                      {test.githubLink}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Max Marks</h3>
                  <p className="text-sm text-muted-foreground">{testData.maxMarks}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Start Time</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(testData.startingTime)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">End Time</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(testData.endingTime)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Resources</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {testData.pdfUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={testData.pdfUrl} target="_blank" rel="noopener noreferrer">
                        View Instructions PDF
                      </a>
                    </Button>
                  )}
                  {testData.videoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={testData.videoUrl} target="_blank" rel="noopener noreferrer">
                        Watch Instructions Video
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Tips for Students</h3>
                <ul className="list-disc pl-5 mt-1">
                  {testData.tips.map((tip, index) => (
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
                  <div className="text-2xl font-bold">{submissions?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                </div>
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">
                  {Array.isArray(submissions) ? submissions.filter(s => s.plagiarism).length : 0}
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
                        width: `${submissions?.length > 0 
                          ? (submissions?.reduce((sum, s) => sum + s.marksObtained, 0) / submissions.length) / testData.maxMarks * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {submissions?.length > 0 
                      ? Math.round((submissions?.reduce((sum, s) => sum + s.marksObtained, 0) / submissions.length) * 10) / 10
                      : 0} / {testData.maxMarks}
                  </span>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-1">Section Distribution</h3>
                <div className="space-y-1">
                  {Array.from(new Set(submissions?.map(s => s.studentId.section))).map(section => {
                    const sectionCount = submissions?.filter(s => s.studentId.section === section).length;
                    return (
                      <div key={section} className="flex justify-between items-center text-sm">
                        <span>Section {section || 0}</span>
                        <Badge variant="outline">{sectionCount||0} students</Badge>
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
            <TestResults  submissions={submissions || []} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
