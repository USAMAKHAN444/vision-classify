# API Integration Documentation

## Overview
This application has been integrated with the OCR categorization endpoint at `https://gb-ocr-stage.vertekx.com/categorize`.

## Configuration

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://gb-ocr-stage.vertekx.com
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3

# App Configuration
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/*,.pdf,.doc,.docx

# Feature Flags
VITE_ENABLE_RETRY=true
VITE_ENABLE_TIMEOUT=true
VITE_ENABLE_PROGRESS=true
```

### Default Values
If no environment variables are set, the application will use these defaults:
- **API Base URL**: `https://gb-ocr-stage.vertekx.com`
- **API Timeout**: 30 seconds
- **Retry Attempts**: 3
- **Max File Size**: 10MB
- **Allowed File Types**: Images, PDFs, and Office documents

## API Endpoints

### POST /categorize
**Endpoint**: `https://gb-ocr-stage.vertekx.com/categorize`

**Purpose**: Categorize uploaded documents using OCR technology

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `files` field containing document files

**Response**:
- Success: JSON object with categorized results
- Error: Error message with appropriate HTTP status code

## Implementation Details

### Files Modified
1. **`src/lib/api.ts`** - API client with error handling and timeout support
2. **`src/lib/config.ts`** - Configuration management
3. **`src/pages/GivebackPortal.tsx`** - Updated to use new API client

### Features Added
- **HTTPS Support**: All API calls now use HTTPS
- **Error Handling**: Comprehensive error handling with custom error classes
- **Timeout Management**: Configurable request timeouts
- **Retry Logic**: Configurable retry attempts for failed requests
- **Environment Configuration**: Easy configuration through environment variables

### Security Features
- **HTTPS Only**: All API calls use secure HTTPS connections
- **Input Validation**: File type and size validation
- **Error Sanitization**: Safe error message display

## Usage

### Basic Integration
The API is automatically used when processing documents in the Giveback Portal:

```typescript
import { apiClient, API_CONFIG } from '@/lib/api';

// Upload and categorize documents
const formData = new FormData();
files.forEach((file) => {
  formData.append('files', file);
});

const results = await apiClient.post(API_CONFIG.OCR_CATEGORIZE, formData);
```

### Custom Configuration
You can customize the API behavior by modifying the configuration:

```typescript
import { config } from '@/lib/config';

// Change timeout
config.api.timeout = 60000; // 60 seconds

// Change base URL
config.api.baseUrl = 'https://your-custom-domain.com';
```

## Error Handling

The application now provides detailed error information:

- **Network Errors**: Connection issues, timeouts
- **HTTP Errors**: Server errors with status codes
- **Validation Errors**: File type/size validation failures
- **API Errors**: Specific error messages from the OCR service

## Testing

To test the integration:

1. Start the development server: `npm run dev`
2. Upload documents through the Giveback Portal
3. Monitor the network tab for HTTPS requests to the OCR endpoint
4. Check console for detailed error information if issues occur

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the API server allows requests from your domain
2. **SSL Certificate Issues**: Verify the HTTPS certificate is valid
3. **Timeout Errors**: Increase `VITE_API_TIMEOUT` for large files
4. **File Size Limits**: Adjust `VITE_MAX_FILE_SIZE` as needed

### Debug Mode
Enable debug logging by setting:
```bash
VITE_DEBUG=true
```

## Support

For API-related issues, contact the OCR service team at the configured endpoint.
For application issues, check the console logs and network tab for detailed error information.
