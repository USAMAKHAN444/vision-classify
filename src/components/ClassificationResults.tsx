import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, CreditCard, FileText, Receipt, Ship, Plane, Shield } from 'lucide-react';

export interface ClassificationResult {
  credit_cards?: Array<{ card_id: number; front?: string; back?: string; filename?: string }>;
  pos_receipts?: Array<{ pos_id: number; filename: string }>;
  facturas?: Array<{ factura_id: number; filename: string }>;
  credit_card_slips?: Array<{ slip_id: number; filename: string }>;
  passports?: Array<{ passport_id: number; filename: string }>;
  cruise_ids?: Array<{ cruise_id: number; filename: string }>;
  cruise_schedules?: Array<{ schedule_id: number; filename: string }>;
  boarding_passes?: Array<{ boarding_pass_id: number; filename: string }>;
  other_documents?: Array<{ other_id: number; filename: string }>;
}

interface ClassificationResultsProps {
  results: ClassificationResult;
  fileUrls: { [key: string]: string };
  onRemove: (filename: string, category: string, id: number) => void;
}

const categoryConfig = {
  credit_cards: {
    title: 'Credit Cards',
    icon: CreditCard,
    color: 'bg-blue-500',
    idKey: 'card_id'
  },
  pos_receipts: {
    title: 'POS Receipts',
    icon: Receipt,
    color: 'bg-green-500',
    idKey: 'pos_id'
  },
  facturas: {
    title: 'Facturas',
    icon: FileText,
    color: 'bg-purple-500',
    idKey: 'factura_id'
  },
  credit_card_slips: {
    title: 'Credit Card Slips',
    icon: CreditCard,
    color: 'bg-orange-500',
    idKey: 'slip_id'
  },
  passports: {
    title: 'Passports',
    icon: Shield,
    color: 'bg-red-500',
    idKey: 'passport_id'
  },
  cruise_ids: {
    title: 'Cruise IDs',
    icon: Ship,
    color: 'bg-cyan-500',
    idKey: 'cruise_id'
  },
  cruise_schedules: {
    title: 'Cruise Schedules',
    icon: Ship,
    color: 'bg-teal-500',
    idKey: 'schedule_id'
  },
  boarding_passes: {
    title: 'Boarding Passes',
    icon: Plane,
    color: 'bg-indigo-500',
    idKey: 'boarding_pass_id'
  },
  other_documents: {
    title: 'Other Documents',
    icon: FileText,
    color: 'bg-gray-500',
    idKey: 'other_id'
  }
};

export const ClassificationResults: React.FC<ClassificationResultsProps> = ({
  results,
  fileUrls,
  onRemove
}) => {
  const hasResults = Object.values(results).some(category => category && category.length > 0);

  if (!hasResults) {
    return (
      <Card className="p-8 text-center bg-gradient-card shadow-card border-0">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No documents processed yet</h3>
        <p className="text-muted-foreground">Upload and process documents to see classification results</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Classification Results</h2>
      
      <div className="grid gap-6">
        {Object.entries(results).map(([categoryKey, items]) => {
          if (!items || items.length === 0) return null;
          
          const config = categoryConfig[categoryKey as keyof typeof categoryConfig];
          const IconComponent = config.icon;
          
          return (
            <Card key={categoryKey} className="p-6 bg-gradient-card shadow-card border-0 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryKey === 'credit_cards' ? (
                  // Special handling for credit cards to show front/back
                  items.map((item) => {
                    const id = item[config.idKey as keyof typeof item] as number;
                    const frontFile = item.front;
                    const backFile = item.back;
                    
                    return (
                      <div key={id} className="space-y-4">
                        {frontFile && (
                          <Card className="overflow-hidden">
                            <div className="aspect-[3/2] bg-muted">
                              {fileUrls[frontFile] ? (
                                <img
                                  src={fileUrls[frontFile]}
                                  alt={`${frontFile} - Front`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <FileText className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  Credit Card - Front
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemove(frontFile, categoryKey, id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="font-medium text-sm truncate">{frontFile}</p>
                            </div>
                          </Card>
                        )}
                        {backFile && (
                          <Card className="overflow-hidden">
                            <div className="aspect-[3/2] bg-muted">
                              {fileUrls[backFile] ? (
                                <img
                                  src={fileUrls[backFile]}
                                  alt={`${backFile} - Back`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <FileText className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  Credit Card - Back
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemove(backFile, categoryKey, id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="font-medium text-sm truncate">{backFile}</p>
                            </div>
                          </Card>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Regular handling for other document types
                  items.map((item) => {
                    const id = item[config.idKey as keyof typeof item] as number;
                    const filename = item.filename || 'Unknown file';
                    
                    return (
                      <Card key={id} className="overflow-hidden">
                        <div className="aspect-[3/2] bg-muted">
                          {fileUrls[filename] ? (
                            <img
                              src={fileUrls[filename]}
                              alt={filename}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <FileText className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {config.title}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemove(filename, categoryKey, id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-medium text-sm truncate" title={filename}>
                            {filename}
                          </p>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};