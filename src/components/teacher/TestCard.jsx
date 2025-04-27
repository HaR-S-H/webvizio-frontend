
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, isTestActive, isTestPast, isTestUpcoming } from "@/lib/utils";
import { Link } from "react-router-dom";


export function TestCard({ test }) {
  // Determine test status
  let statusBadge;
  if (isTestActive(test)) {
    statusBadge = <Badge className="bg-green-500">Active</Badge>;
  } else if (isTestUpcoming(test)) {
    statusBadge = <Badge variant="outline" className="text-blue-500 border-blue-500">Upcoming</Badge>;
  } else if (isTestPast(test)) {
    statusBadge = <Badge variant="outline" className="text-gray-500">Completed</Badge>;
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
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
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
        
        <div className="flex flex-wrap gap-1 mt-2">
          {test.tips.slice(0, 2).map((tip, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tip.length > 40 ? `${tip.substring(0, 40)}...` : tip}
            </Badge>
          ))}
          {test.tips.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{test.tips.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/teacher/tests/${test.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
