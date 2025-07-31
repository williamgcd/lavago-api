import * as path from 'path';

// Custom path resolver for Vercel
const originalResolveFilename = (require('module') as any)._resolveFilename;

(require('module') as any)._resolveFilename = function(request: string, parent: any, isMain: boolean, options: any) {
    if (request.startsWith('@/')) {
        const relativePath = request.substring(2); // Remove '@/' prefix
        const resolvedPath = path.resolve(__dirname, relativePath);
        return originalResolveFilename(resolvedPath, parent, isMain, options);
    }
    return originalResolveFilename(request, parent, isMain, options);
}; 