import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ClassificationResults, ClassificationResult } from '@/components/ClassificationResults';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, apiClient, ApiError } from '@/lib/api';

export const GivebackPortal: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ClassificationResult>({});
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});

  const { toast } = useToast();

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const data = await apiClient.post(API_CONFIG.OCR_CATEGORIZE, formData);
      setResults(data);
      
      // Store file URLs for viewing
      const fileUrls: { [key: string]: string } = {};
      files.forEach((file) => {
        fileUrls[file.name] = URL.createObjectURL(file);
      });
      setFileUrls(fileUrls);

      toast({
        title: "Processing complete",
        description: `Successfully classified ${files.length} documents`,
      });
    } catch (error) {
      console.error('Processing error:', error);
      
      let errorMessage = "An error occurred during processing";
      if (error instanceof ApiError) {
        errorMessage = apiClient.getErrorMessage(error);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleRemove = (filename: string, category: string, id: number) => {
    setResults(prevResults => {
      const newResults = { ...prevResults };
      const categoryItems = newResults[category as keyof ClassificationResult];
      
      if (categoryItems) {
        const filteredItems = categoryItems.filter((item: any) => {
          const config = {
            credit_cards: 'card_id',
            pos_receipts: 'pos_id',
            facturas: 'factura_id',
            credit_card_slips: 'slip_id',
            passports: 'passport_id',
            cruise_ids: 'cruise_id',
            cruise_schedules: 'schedule_id',
            boarding_passes: 'boarding_pass_id',
            other_documents: 'other_id'
          };
          const idKey = config[category as keyof typeof config];
          return item[idKey] !== id;
        });
        
        if (filteredItems.length === 0) {
          delete newResults[category as keyof ClassificationResult];
        } else {
          (newResults as any)[category] = filteredItems;
        }
      }
      
      return newResults;
    });

    toast({
      title: "Document removed",
      description: `${filename} has been removed from ${category.replace('_', ' ')}`,
    });
  };

  const downloadResults = () => {
    if (Object.keys(results).length === 0) {
      toast({
        title: "No results to download",
        description: "Please process documents first",
        variant: "destructive"
      });
      return;
    }

    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `classification-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Results downloaded",
      description: "Classification results have been saved as JSON file",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="relative">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Giveback Portal
            </h1>
            <p className="text-muted-foreground">
              Upload and classify your documents with AI-powered recognition
            </p>
          </header>


          <div className="space-y-8">
            <FileUpload
              onFilesSelected={setFiles}
              isProcessing={isProcessing}
              onProcess={handleProcess}
            />

            {Object.keys(results).length > 0 && (
              <div className="flex justify-end">
                <Button onClick={downloadResults} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download JSON Results
                </Button>
              </div>
            )}

            <ClassificationResults
              results={results}
              fileUrls={fileUrls}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </div>

    </div>
  );
};