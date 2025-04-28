import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { Link } from "react-router-dom";


export function StudentTestCardSuccess({ test, submission}) {
  
   
    
  // Determine test status
  let statusBadge;
  let buttonText = "View Details";
  let buttonDisabled = false;
  
  if (submission) {
    statusBadge = <Badge>Submitted</Badge>;
    buttonText = "View Submission";
  } else if (isTestActive(test.testId)) {
    statusBadge = <Badge className="bg-green-500">Active</Badge>;
    buttonText = "Take Test";
  } else if (isTestUpcoming(test.testId)) {
    statusBadge = <Badge variant="outline" className="text-blue-500 border-blue-500">Upcoming</Badge>;
    buttonDisabled = true;
  } else if (isTestPast(test.testId)) {
    statusBadge = <Badge variant="outline" className="text-gray-500">Missed</Badge>;
    buttonDisabled = true;
  }

  return (
    <Card className="hover-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{test.testId.name}</CardTitle>
            <CardDescription>{test.testId.course}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Language</div>
            <div className="font-medium">{test.testId.language.toUpperCase()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Max Marks</div>
            <div className="font-medium">{test.testId.maxMarks }</div>
          </div>
          <div>
            <div className="text-muted-foreground">Start Time</div>
            <div className="font-medium">{formatDate(test.testId.startingTime)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">End Time</div>
            <div className="font-medium">{formatDate(test.testId.endingTime)}</div>
          </div>
        </div>
        
        {submission && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Your Score:</span>
              <span className="font-bold">
                {submission.plagrism 
                  ? "0" 
                  : submission.marksObtained
                } / {test.testId.maxMarks}
              </span>
            </div>
            {submission.plagiarism && (
              <div className="mt-2 text-sm text-destructive">
                Plagiarism detected with: {submission.plagrism[0].detected?submission.plagrism[0].studentId.name:"No one"}
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
            <Link to={`/student/tests/success/${test.testId._id}`}>{buttonText}</Link>
          ) : (
            <span>{buttonText}</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
