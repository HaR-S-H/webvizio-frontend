
import { studentTestApi } from "@/api/test";
import { Layout } from "@/components/Layout";
import { StudentTestCard } from "@/components/student/StudentTestCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useStudentTests } from "@/context/StudentContext";
import { StudentTestCardSuccess } from "@/components/student/StudentTestCardSuccess";
export default function StudentDashboard() {
    const { user } = useAuth();
    const { tests, setTests, submittedTests, setSubmittedTests } = useStudentTests();
    const [loading, setLoading] = useState(true);
   useEffect(() => {
       async function fetchStudentData() {
         try {
             const response = await studentTestApi.getAllTests(); // Fetch the teacher's data from the API
   
           if (response.statusCode === 200) {
               setTests(response.data.student.ActiveTests);
           }
         } catch (error) {
           console.error("Error fetching teacher data", error);
         } finally {
           setLoading(false); // Turn off loading state
         }
       }
   
       fetchStudentData();
   }, []);
   useEffect(() => {
    async function getSubmitTest() {
      try {
          const response = await studentTestApi.getsubmittedTests(); // Fetch the teacher's data from the API

        if (response.statusCode === 200) {
            setSubmittedTests(response.data.marks.marks);
          }
      } catch (error) {
        console.error("Error fetching teacher data", error);
      } finally {
        setLoading(false); // Turn off loading state
      }
    }

    getSubmitTest();
}, []);

if (loading) return <div>Loading...</div>;
  // Get submissions for this student
    const userSubmissions =submittedTests
  
  // Get active tests (not past, not submitted)
    const activeTests = tests;
  
  // Get submitted tests
    // const submittedTests = testSubmissions;
  
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
                {userSubmissions?.length > 0 
                  ? `${Math.round((userSubmissions.filter(sub => !sub.plagrism)
                      .reduce((sum, sub) => sum + sub.marksObtained, 0) / userSubmissions.length) * 10) / 10}%`
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
                  <StudentTestCard key={test._id} test={test} />
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
              {submittedTests?.length > 0 ? (
                submittedTests.map(test => {
                    const submission = test;
                  return (
                    <StudentTestCardSuccess
                      key={test._id} 
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
        
        {userSubmissions.some(sub => sub.plagrism[0]?.detected) && (
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
                  .filter(sub => sub.plagrism)
                  .map(sub => {
                    const testInfo = submittedTests.find(t => t.testId._id === sub.testId._id);
                    return (
                      <div key={sub.testId._id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{testInfo?.testId?.name}</p>
                          <p className="text-sm text-muted-foreground">{testInfo?.testId?.course}</p>
                        </div>
                        <Badge variant="destructive">
                          Plagiarism detected with {sub?.plagrism[0]?.detected?sub?.plagrism[0]?.studentId?.name:"No one"}
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
