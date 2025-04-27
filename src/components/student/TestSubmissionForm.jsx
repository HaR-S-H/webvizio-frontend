
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, parseGitHubUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";


export function TestSubmissionForm({ test, onSuccess }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(null);
  const { toast } = useToast();

  const handleRepoUrlChange = (e) => {
    const url = e.target.value;
    setRepoUrl(url);
    
    if (url.trim() === "") {
      setIsValidUrl(null);
      return;
    }
    
    const isValid = parseGitHubUrl(url) !== null;
    setIsValidUrl(isValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidUrl) {
      toast({
        title: "Invalid Repository URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission Successful",
        description: "Your test has been submitted for evaluation.",
        variant: "default",
      });
      onSuccess();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Solution</CardTitle>
        <CardDescription>
          Provide your GitHub repository URL to submit your solution for {test.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Course</div>
              <div className="font-medium">{test.course}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Language</div>
              <div className="font-medium">{test.language.toUpperCase()}</div>
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
          
          {(test.instructionsPdfUrl || test.videoUrl) && (
            <div className="space-y-2">
              <h3 className="font-medium">Instructions</h3>
              <div className="flex flex-wrap gap-2">
                {test.instructionsPdfUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={test.instructionsPdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF Instructions
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </Button>
                )}
                {test.videoUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={test.videoUrl} target="_blank" rel="noopener noreferrer">
                      Watch Instruction Video
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {test.tips.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Tips</h3>
              <ul className="list-disc pl-5 space-y-1">
                {test.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit} id="submission-form" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repoUrl">Your GitHub Repository URL</Label>
              <Input 
                id="repoUrl"
                value={repoUrl}
                onChange={handleRepoUrlChange}
                placeholder="e.g. https://github.com/yourusername/your-solution"
                className={isValidUrl === false ? "border-red-500" : ""}
              />
              
              {isValidUrl === false && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please enter a valid GitHub repository URL
                  </AlertDescription>
                </Alert>
              )}
              
              {isValidUrl === true && (
                <Alert variant="default" className="mt-2 border-green-500">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    Valid GitHub repository URL
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          form="submission-form"
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValidUrl}
        >
          {isSubmitting ? "Submitting..." : "Submit Solution"}
        </Button>
      </CardFooter>
    </Card>
  );
}
