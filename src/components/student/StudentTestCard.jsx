import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { Link } from "react-router-dom";


export function StudentTestCard({ test, submission }) {
  // Determine test status
  let statusBadge;
  let buttonText = "View Details";
  let buttonDisabled = false;
  
  if (submission) {
    statusBadge = <Badge>Submitted</Badge>;
    buttonText = "View Submission";
  } else if (isTestActive(test)) {
    statusBadge = <Badge className="bg-green-500">Active</Badge>;
    buttonText = "Take Test";
  } else if (isTestUpcoming(test)) {
    statusBadge = <Badge variant="outline" className="text-blue-500 border-blue-500">Upcoming</Badge>;
    buttonDisabled = true;
  } else if (isTestPast(test)) {
    statusBadge = <Badge variant="outline" className="text-gray-500">Missed</Badge>;
    buttonDisabled = true;
  }

  return (
    <Card className="hover-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{test.name}</CardTitle>
            <CardDescription>{test.course}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Language</div>
            <div className="font-medium">{test.language.toUpperCase()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Max Marks</div>
            <div className="font-medium">{test.maxMarks}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Start Time</div>
            <div className="font-medium">{formatDate(test.startTime)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">End Time</div>
            <div className="font-medium">{formatDate(test.endTime)}</div>
          </div>
        </div>
        
        {submission && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Your Score:</span>
              <span className="font-bold">
                {submission.plagiarismDetected 
                  ? "0" 
                  : submission.marks
                } / {test.maxMarks}
              </span>
            </div>
            {submission.plagiarismDetected && (
              <div className="mt-2 text-sm text-destructive">
                Plagiarism detected with: {submission.plagiarismWithStudentName}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          asChild={!buttonDisabled} 
          disabled={buttonDisabled}
          className="w-full"
        >
          {!buttonDisabled ? (
            <Link to={`/student/tests/${test.id}`}>{buttonText}</Link>
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
