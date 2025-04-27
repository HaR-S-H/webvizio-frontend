
import { Layout } from "@/components/Layout";
import { StudentTestCard } from "@/components/student/StudentTestCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { tests, testSubmissions } from "@/lib/dummy-data";
import { AlertCircle } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // Get submissions for this student
  const userSubmissions = testSubmissions.filter(sub => sub.studentId === user?.id);
  
  // Get active tests (not past, not submitted)
  const activeTests = tests.filter(test => {
    const now = new Date();
    const endTime = new Date(test.endTime);
    const isSubmitted = userSubmissions.some(sub => sub.testId === test.id);
    return now <= endTime && !isSubmitted;
  });
  
  // Get submitted tests
  const submittedTests = tests.filter(test => {
    return userSubmissions.some(sub => sub.testId === test.id);
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            View your assessments and submit your solutions
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tests</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v6.5l5 3" />
                <circle cx="12" cy="14" r="8" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTests.length}</div>
              <p className="text-xs text-muted-foreground">
                Tests available to take
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedTests.length}</div>
              <p className="text-xs text-muted-foreground">
                Tests completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 22V8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userSubmissions.length > 0 
                  ? `${Math.round((userSubmissions.filter(sub => !sub.plagiarismDetected)
                      .reduce((sum, sub) => sum + sub.marks, 0) / userSubmissions.length) * 10) / 10}%`
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Average test score
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Tests</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeTests.length > 0 ? (
                activeTests.map(test => (
                  <StudentTestCard key={test.id} test={test} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <h3 className="text-lg font-medium">No active tests</h3>
                  <p className="text-muted-foreground">You don't have any active tests right now</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="submitted" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {submittedTests.length > 0 ? (
                submittedTests.map(test => {
                  const submission = userSubmissions.find(sub => sub.testId === test.id);
                  return (
                    <StudentTestCard 
                      key={test.id} 
                      test={test} 
                      submission={submission}
                    />
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-10">
                  <h3 className="text-lg font-medium">No submissions yet</h3>
                  <p className="text-muted-foreground">You haven't submitted any tests yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {userSubmissions.some(sub => sub.plagiarismDetected) && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle size={18} />
                Plagiarism Alert
              </CardTitle>
              <CardDescription>
                Some of your submissions have been flagged for plagiarism
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userSubmissions
                  .filter(sub => sub.plagiarismDetected)
                  .map(sub => {
                    const testInfo = tests.find(t => t.id === sub.testId);
                    return (
                      <div key={sub.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{testInfo?.name}</p>
                          <p className="text-sm text-muted-foreground">{testInfo?.course}</p>
                        </div>
                        <Badge variant="destructive">
                          Plagiarism detected with {sub.plagiarismWithStudentName}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
