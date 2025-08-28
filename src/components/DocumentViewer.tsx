import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  category: string;
  imageUrl?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  filename,
  category,
  imageUrl
}) => {
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">
                {filename}
              </DialogTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {category.replace('_', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={!imageUrl}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {imageUrl ? (
            <div className="bg-secondary rounded-lg p-4 max-h-[60vh] overflow-auto">
              <img
                src={imageUrl}
                alt={filename}
                className="max-w-full h-auto mx-auto rounded shadow-sm"
              />
            </div>
          ) : (
            <div className="bg-secondary rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Document preview not available
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Original file: {filename}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};