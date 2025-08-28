import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  onProcess: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  isProcessing,
  onProcess
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    onFilesSelected([]);
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-card border-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Upload and Classify Documents
          </h2>
          <p className="text-muted-foreground">
            Select multiple images, send them to the model in one pass, then review categorizations and grouped purchases.
          </p>
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-2">
            {isDragActive ? "Drop images here" : "Drag & drop images here"}
          </p>
          <Button variant="outline" className="mx-auto">
            Select files
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Uploaded Files ({selectedFiles.length})
              </h3>
              <Button variant="ghost" onClick={clearAll} size="sm">
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedFiles.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                const isImage = file.type.startsWith('image/');
                
                return (
                  <Card key={index} className="p-3 bg-background border">
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        {isImage ? (
                          <img
                            src={fileUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="w-full h-8 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onProcess}
            disabled={selectedFiles.length === 0 || isProcessing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2"
          >
            {isProcessing ? "Processing..." : "Process all"}
          </Button>
        </div>
      </div>
    </Card>
  );
};