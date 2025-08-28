import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, X } from 'lucide-react';

interface SettingsModalProps {
  serverConfig: {
    type: string;
    endpoint: string;
  };
  onConfigChange: (config: { type: string; endpoint: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  serverConfig,
  onConfigChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState(serverConfig);

  const handleSave = () => {
    onConfigChange(localConfig);
    setIsOpen(false);
  };

  const serverTypes = [
    { value: 'local', label: 'Local Server' },
    { value: 'ngrok', label: 'Ngrok Tunnel' },
    { value: 'dns', label: 'DNS/Domain' },
    { value: 'custom', label: 'Custom URL' }
  ];

  const getEndpointPlaceholder = () => {
    switch (localConfig.type) {
      case 'local':
        return 'http://localhost:8000/process';
      case 'ngrok':
        return 'https://abc123.ngrok.io/process';
      case 'dns':
        return 'https://api.yourdomain.com/process';
      case 'custom':
        return 'https://your-custom-url.com/process';
      default:
        return 'Enter server endpoint';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-4 right-4">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Settings</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your backend server endpoint
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Server Configuration</h3>
              <span className="text-xs bg-secondary px-2 py-1 rounded">
                {localConfig.type === 'local' ? 'Local' : 'Remote'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure your backend endpoint
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-type">Server Type</Label>
              <Select
                value={localConfig.type}
                onValueChange={(value) =>
                  setLocalConfig({ ...localConfig, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select server type" />
                </SelectTrigger>
                <SelectContent>
                  {serverTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">Current Endpoint</Label>
              <Input
                id="endpoint"
                value={localConfig.endpoint}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, endpoint: e.target.value })
                }
                placeholder={getEndpointPlaceholder()}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};