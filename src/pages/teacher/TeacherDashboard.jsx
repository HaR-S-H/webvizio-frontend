
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import { TestCard } from "@/components/teacher/TestCard";
import { TestCreationForm } from "@/components/teacher/TestCreationForm";
import { tests } from "@/lib/dummy-data";
import { PlusCircle } from "lucide-react";

export default function TeacherDashboard() {
  const [showTestForm, setShowTestForm] = useState(false);
  
  const upcomingTests = tests.filter(test => {
    const now = new Date();
    const startTime = new Date(test.startTime);
    return startTime > now;
  });
  
  const activeTests = tests.filter(test => {
    const now = new Date();
    const startTime = new Date(test.startTime);
    const endTime = new Date(test.endTime);
    return now >= startTime && now <= endTime;
  });
  
  const pastTests = tests.filter(test => {
    const now = new Date();
    const endTime = new Date(test.endTime);
    return endTime < now;
  });
  
  const handleTestCreationSuccess = () => {
    setShowTestForm(false);
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
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Tests created
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
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
                    Currently active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Tests</CardTitle>
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
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingTests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled for future
                  </p>
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
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="active">
                {activeTests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No active tests</h3>
                    <p className="text-muted-foreground">You don't have any currently active tests</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activeTests.map(test => (
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming">
                {upcomingTests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No upcoming tests</h3>
                    <p className="text-muted-foreground">You don't have any scheduled tests</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingTests.map(test => (
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastTests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">No past tests</h3>
                    <p className="text-muted-foreground">You don't have any completed tests</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pastTests.map(test => (
                      <TestCard key={test.id} test={test} />
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
