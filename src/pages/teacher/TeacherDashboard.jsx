import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import { TestCard } from "@/components/teacher/TestCard";
import { TestCreationForm } from "@/components/teacher/TestCreationForm";
import { PlusCircle } from "lucide-react";
import { testApi } from "@/api/test"; // Import the testApi to fetch data
import { useTests } from '@/context/TestContext';

export default function TeacherDashboard() {
  const { setTests ,tests} = useTests();
  const [showTestForm, setShowTestForm] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherData() {
      try {
        const response = await testApi.getAllTests(); // Fetch the teacher's data from the API

        if (response.statusCode === 200) {
          setTeacherData(response.data); // Store data on success
          // Store tests in context
          const activeTests = response.data?.teacher?.ActiveTests || [];
          const pastTests = response.data?.teacher?.oldTests || [];
          setTests([...activeTests, ...pastTests]);
        }
      } catch (error) {
        console.error("Error fetching teacher data", error);
      } finally {
        setLoading(false); // Turn off loading state
      }
    }

    fetchTeacherData();
  }, [setTests]);

  if (loading) return <div>Loading...</div>; // Add loading state if data is still being fetched
//   console.log(teacherData);
    const activeTests = teacherData?.teacher?.ActiveTests || [];
    const currActiveTests = activeTests.filter(test => {
        const now = new Date();
        const startTime = new Date(test.testId.startingTime);
        const endTime = new Date(test.testId.endingTime);
        return startTime < now  && endTime > now;
      });
  const upcomingTests = activeTests.filter(test => {
    const now = new Date();
    const startTime = new Date(test.testId.startingTime);
    return startTime > now;
  });

  const pastTests = teacherData?.teacher?.oldTests || [];

  const handleTestCreationSuccess = () => {
    setShowTestForm(false); // Hide the test creation form after successful creation
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your assessments and view student results
            </p>
          </div>
          <Button onClick={() => setShowTestForm(!showTestForm)}>
            {showTestForm ? "Cancel" : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Test
              </>
            )}
          </Button>
        </div>

        {showTestForm ? (
          <TestCreationForm onSuccess={handleTestCreationSuccess} />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currActiveTests.length+pastTests.length+upcomingTests.length}</div>
                  <p className="text-xs text-muted-foreground">Tests created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currActiveTests.length}</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingTests.length}</div>
                  <p className="text-xs text-muted-foreground">Scheduled for future</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Tests</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {tests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No tests created yet</h3>
                    <p className="text-muted-foreground">Create your first test to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tests.map(test => (
                      <TestCard key={test.testId._id} test={test.testId} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Active Tests Tab */}
              <TabsContent value="active">
                {currActiveTests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No active tests</h3>
                    <p className="text-muted-foreground">You don't have any currently active tests</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {currActiveTests.map(test => (
                      <TestCard key={test.testId._id} test={test.testId} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Upcoming Tests Tab */}
              <TabsContent value="upcoming">
                {upcomingTests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No upcoming tests</h3>
                    <p className="text-muted-foreground">You don't have any scheduled tests</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingTests.map(test => (
                      <TestCard key={test.testId._id} test={test.testId} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Past Tests Tab */}
              <TabsContent value="past">
                {pastTests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No past tests</h3>
                    <p className="text-muted-foreground">You don't have any completed tests</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pastTests.map(test => (
                      <TestCard key={test.testId._id} test={test.testId} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
}
