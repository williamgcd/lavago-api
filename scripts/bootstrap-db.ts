#!/usr/bin/env bun

import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { getSupabaseClient } from '../src/libs/supabase-client';

interface SqlFile {
    path: string;
    content: string;
    feature: string;
}

interface TableInfo {
    name: string;
    content: string;
    feature: string;
    dependencies: string[];
}

async function findSqlFiles(featuresDir: string): Promise<SqlFile[]> {
    const sqlFiles: SqlFile[] = [];

    try {
        const features = await readdir(featuresDir, { withFileTypes: true });

        for (const feature of features) {
            if (!feature.isDirectory()) continue;

            const featurePath = join(featuresDir, feature.name);
            const featureFiles = await readdir(featurePath, {
                withFileTypes: true,
            });

            for (const file of featureFiles) {
                if (file.isFile() && extname(file.name) === '.sql') {
                    const filePath = join(featurePath, file.name);
                    const content = await readFile(filePath, 'utf-8');

                    sqlFiles.push({
                        path: filePath,
                        content,
                        feature: feature.name,
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error reading features directory:', error);
        throw error;
    }

    return sqlFiles;
}

function extractTableInfo(sqlFiles: SqlFile[]): TableInfo[] {
    const tableInfos: TableInfo[] = [];

    // First, collect all available table names
    const availableTables = new Set<string>();
    for (const sqlFile of sqlFiles) {
        const createTableMatch = sqlFile.content.match(
            /CREATE TABLE IF NOT EXISTS public\.(\w+)/g
        );
        
        if (createTableMatch) {
            createTableMatch.forEach(match => {
                const tableName = match.replace(
                    'CREATE TABLE IF NOT EXISTS public.',
                    ''
                );
                availableTables.add(tableName);
            });
        }
    }

    for (const sqlFile of sqlFiles) {
        const createTableMatch = sqlFile.content.match(
            /CREATE TABLE IF NOT EXISTS public\.(\w+)/g
        );
        
        if (createTableMatch) {
            createTableMatch.forEach(match => {
                const tableName = match.replace(
                    'CREATE TABLE IF NOT EXISTS public.',
                    ''
                );
                
                // Extract foreign key dependencies
                const dependencies: string[] = [];
                const foreignKeyMatches = sqlFile.content.match(
                    /REFERENCES\s+(?:public\.)?(\w+)/g
                );
                
                if (foreignKeyMatches) {
                    foreignKeyMatches.forEach(fkMatch => {
                        const referencedTable = fkMatch.replace('REFERENCES ', '').replace('public.', '');
                        if (referencedTable !== tableName && availableTables.has(referencedTable)) { // Avoid self-references and non-existent tables
                            dependencies.push(referencedTable);
                        }
                    });
                }

                tableInfos.push({
                    name: tableName,
                    content: sqlFile.content,
                    feature: sqlFile.feature,
                    dependencies: [...new Set(dependencies)] // Remove duplicates
                });
            });
        }
    }

    return tableInfos;
}

function topologicalSort(tables: TableInfo[]): TableInfo[] {
    const result: TableInfo[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    function visit(table: TableInfo) {
        if (visiting.has(table.name)) {
            throw new Error(`Circular dependency detected involving table: ${table.name}`);
        }
        
        if (visited.has(table.name)) {
            return;
        }

        visiting.add(table.name);

        // Visit all dependencies first
        for (const depName of table.dependencies) {
            const depTable = tables.find(t => t.name === depName);
            if (depTable) {
                visit(depTable);
            }
        }

        visiting.delete(table.name);
        visited.add(table.name);
        result.push(table);
    }

    // Visit all tables
    for (const table of tables) {
        if (!visited.has(table.name)) {
            visit(table);
        }
    }

    return result;
}

async function generateBootstrapSql(sqlFiles: SqlFile[]): Promise<string> {
    let bootstrapSql = `-- Database Bootstrap Script
-- Generated on: ${new Date().toISOString()}
-- This script will drop all existing tables and recreate them

`;

    // Extract table information and dependencies
    const tableInfos = extractTableInfo(sqlFiles);
    
    if (tableInfos.length === 0) {
        return bootstrapSql + '-- No tables found\n';
    }

    // Sort tables by dependencies for CREATE order (dependencies first)
    const createOrder = topologicalSort(tableInfos);
    
    // Sort tables by dependencies for DROP order (dependents first)
    const dropOrder = [...createOrder].reverse();

    // Add DROP statements
    bootstrapSql += `-- Drop all existing tables (in dependency order)\n`;
    for (const tableInfo of dropOrder) {
        bootstrapSql += `DROP TABLE IF EXISTS public.${tableInfo.name} CASCADE;\n`;
    }

    bootstrapSql += `\n-- Recreate tables (dependencies first)\n`;

    // Add CREATE statements in dependency order
    for (const tableInfo of createOrder) {
        bootstrapSql += `\n-- ${tableInfo.feature} table (${tableInfo.name})\n`;
        if (tableInfo.dependencies.length > 0) {
            bootstrapSql += `-- Dependencies: ${tableInfo.dependencies.join(', ')}\n`;
        }
        bootstrapSql += tableInfo.content + '\n';
    }

    return bootstrapSql;
}

async function bootstrapDatabase(): Promise<void> {
    console.log('🚀 Starting database bootstrap...');

    // Get Supabase client for connection test
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
        throw new Error(
            '❌ Supabase client not available. Check your environment variables.'
        );
    }

    try {
        // Find all SQL files in features directory
        const featuresDir = join(process.cwd(), 'src', 'features');
        console.log(`🔍 Scanning for SQL files in: ${featuresDir}`);

        const sqlFiles = await findSqlFiles(featuresDir);

        if (sqlFiles.length === 0) {
            console.log('⚠️  No SQL files found in features directory');
            return;
        }

        console.log(`📁 Found ${sqlFiles.length} SQL files:`);
        sqlFiles.forEach(file => {
            console.log(`   - ${file.feature}/${file.path.split('/').pop()}`);
        });

        // Extract and display dependency information
        const tableInfos = extractTableInfo(sqlFiles);
        console.log(`\n📊 Found ${tableInfos.length} tables with dependencies:`);
        tableInfos.forEach(table => {
            if (table.dependencies.length > 0) {
                console.log(`   - ${table.name} depends on: ${table.dependencies.join(', ')}`);
            } else {
                console.log(`   - ${table.name} (no dependencies)`);
            }
        });

        // Generate bootstrap SQL
        console.log('\n📝 Generating bootstrap SQL...');
        const bootstrapSql = await generateBootstrapSql(sqlFiles);

        // Write bootstrap SQL to file
        const bootstrapFile = join(process.cwd(), 'database', 'bootstrap.sql');
        const { writeFile, mkdir } = await import('fs/promises');

        // Ensure database directory exists
        try {
            await mkdir(join(process.cwd(), 'database'), { recursive: true });
        } catch (error) {
            // Directory might already exist
        }

        await writeFile(bootstrapFile, bootstrapSql, 'utf-8');

        console.log(`✅ Bootstrap SQL generated: ${bootstrapFile}`);
        console.log('\n📋 Next steps:');
        console.log('1. Review the generated SQL file');
        console.log('2. Execute it in your database using:');
        console.log(
            `   psql -h your-host -U your-user -d your-database -f ${bootstrapFile}`
        );
        console.log('   or use your preferred database client');

        // Also show the SQL content in console for convenience
        console.log('\n📄 Generated SQL:');
        console.log('='.repeat(80));
        console.log(bootstrapSql);
        console.log('='.repeat(80));
    } catch (error) {
        console.error('❌ Database bootstrap failed:', error);
        process.exit(1);
    }
}

// Run the bootstrap
bootstrapDatabase();

export { bootstrapDatabase };
