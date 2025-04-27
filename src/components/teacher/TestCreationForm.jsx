import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDefaultTips } from "@/lib/utils";
import { X, Upload, FileVideo, FileText, FileSpreadsheet } from "lucide-react";
import { testApi } from "@/api/test";

export function TestCreationForm({ onSuccess, editMode = false, testData = null }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(editMode && testData ? testData.language : "html");
  const [tips, setTips] = useState(editMode && testData ? testData.tips : getDefaultTips("html"));
  const [newTip, setNewTip] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const handleLanguageChange = (value) => {
    const lang = value;
    setLanguage(lang);
    if (!editMode) {
      setTips(getDefaultTips(lang));
    }
  };

  const handleAddTip = () => {
    if (newTip.trim()) {
      setTips([...tips, newTip.trim()]);
      setNewTip("");
    }
  };

  const handleRemoveTip = (index) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.ms-excel' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                 file.name.endsWith('.csv'))) {
      setExcelFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel or CSV file",
        variant: "destructive",
      });
    }
  };

  const validateForm = (formData) => {
    // Check if files are selected
    if (!pdfFile) {
      toast({
        title: "Missing PDF file",
        description: "Please upload instructions PDF",
        variant: "destructive",
      });
      return false;
    }
    
    if (!videoFile) {
      toast({
        title: "Missing video file",
        description: "Please upload instruction video",
        variant: "destructive",
      });
      return false;
    }
    
    if (!excelFile) {
      toast({
        title: "Missing Excel file",
        description: "Please upload student data Excel file",
        variant: "destructive",
      });
      return false;
    }
    
    // Check start and end times
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    
    if (endTime <= startTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData)) {
      return;
    }
    
    setIsSubmitting(true);
    
    const testDataToSend = {
      name: formData.get("name"),
      repoUrl: formData.get("repoUrl"),
      language: language,
      course: formData.get("course"),
      maxMarks: Number(formData.get("maxMarks")),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      instructionsPdf: pdfFile,
      instructionVideo: videoFile,
      studentExcel: excelFile,
      tips: tips,
    };
    
    try {
      if (editMode && testData?._id) {
        await testApi.updateTest(testData._id, testDataToSend);
        toast({
          title: "Test Updated Successfully",
          description: `${testDataToSend.name} has been updated.`,
          variant: "default",
        });
      } else {
        await testApi.createTest(testDataToSend);
        toast({
          title: "Test Created Successfully",
          description: `${testDataToSend.name} has been created and is ready for students.`,
          variant: "default",
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Test creation/update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{editMode ? "Edit Assessment" : "Create New Assessment"}</CardTitle>
        <CardDescription>
          {editMode ? "Update your coding test" : "Set up a new coding test for your students"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="test-creation-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Test Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. HTML Basics Assessment" 
                required
                defaultValue={editMode && testData ? testData.name : ""} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repoUrl">GitHub Repository URL</Label>
              <Input 
                id="repoUrl" 
                name="repoUrl" 
                placeholder="e.g. https://github.com/username/repo" 
                required 
                defaultValue={editMode && testData ? testData.githubLink : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                name="language" 
                defaultValue={language} 
                onValueChange={handleLanguageChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Input 
                id="course" 
                name="course" 
                placeholder="e.g. Web Development Fundamentals" 
                required 
                defaultValue={editMode && testData ? testData.course : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxMarks">Maximum Marks</Label>
              <Input 
                id="maxMarks" 
                name="maxMarks" 
                type="number" 
                min="1" 
                placeholder="e.g. 100" 
                required 
                defaultValue={editMode && testData ? testData.maxMarks : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input 
                id="startTime" 
                name="startTime" 
                type="datetime-local" 
                required 
                defaultValue={editMode && testData ? new Date(testData.startingTime).toISOString().slice(0, 16) : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input 
                id="endTime" 
                name="endTime" 
                type="datetime-local" 
                required 
                defaultValue={editMode && testData ? new Date(testData.endingTime).toISOString().slice(0, 16) : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Instructions PDF</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" className="w-[120px]">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload PDF
                </Button>
              </div>
              {pdfFile && (
                <p className="text-sm text-muted-foreground">
                  Uploaded: {pdfFile.name}
                </p>
              )}
              {editMode && testData?.pdfUrl && !pdfFile && (
                <p className="text-sm text-muted-foreground">
                  Current file: <a href={testData.pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">View PDF</a>
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Instruction Video</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" className="w-[120px]">
                  <FileVideo className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </div>
              {videoFile && (
                <p className="text-sm text-muted-foreground">
                  Uploaded: {videoFile.name}
                </p>
              )}
              {editMode && testData?.videoUrl && !videoFile && (
                <p className="text-sm text-muted-foreground">
                  Current file: <a href={testData.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">View Video</a>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Student Data</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="file" 
                accept=".xlsx,.xls,.csv"
                className="flex-1"
                onChange={handleExcelUpload}
              />
              <Button type="button" variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Upload Excel
              </Button>
            </div>
            {excelFile && (
              <p className="text-sm text-muted-foreground">
                Uploaded: {excelFile.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Upload an Excel sheet containing student data (name, email, roll number, section)
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Tips for Students</Label>
            
            <div className="flex flex-wrap gap-2">
              {tips.map((tip, index) => (
                <Badge key={index} className="py-2 flex items-center gap-1">
                  {tip}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTip(index)}
                    className="ml-1 rounded-full hover:bg-white/20 p-1"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 items-center">
              <Input 
                value={newTip} 
                onChange={(e) => setNewTip(e.target.value)} 
                placeholder="Add a tip for students"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTip} variant="outline">
                Add Tip
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          form="test-creation-form" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (editMode ? "Updating..." : "Creating...") 
            : (editMode ? "Update Assessment" : "Create Assessment")}
        </Button>
      </CardFooter>
    </Card>
  );
}