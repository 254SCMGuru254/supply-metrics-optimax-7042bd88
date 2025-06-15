
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataImportExport } from '@/components/data-management/DataImportExport';
import { AdvancedDataImportExport } from '@/components/data-management/AdvancedDataImportExport';
import { EnhancedKenyaFeatures } from '@/components/kenya/EnhancedKenyaFeatures';
import { AdvancedBusinessValueCalculator } from '@/components/business-value/AdvancedBusinessValueCalculator';
import { ProjectManager } from '@/components/project-management/ProjectManager';
import { Database, Globe, Calculator, Zap } from 'lucide-react';

const DataManagement = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          Advanced Features & Data Management
        </h1>
        <p className="text-muted-foreground">
          Complete implementation of data import/export, Kenya-specific features, and business value calculations
        </p>
      </div>

      <Tabs defaultValue="data-import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-import" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Import/Export
          </TabsTrigger>
          <TabsTrigger value="kenya-features" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Kenya Features
          </TabsTrigger>
          <TabsTrigger value="business-value" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Business Value
          </TabsTrigger>
          <TabsTrigger value="project-management" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Project Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-import">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Data Import & Export</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Enhanced data management with validation, progress tracking, and comprehensive export options.
                </p>
                <AdvancedDataImportExport projectId={selectedProject} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kenya-features">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Kenya Supply Chain Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Industry-specific analysis for Kenya's key sectors including tea, coffee, floriculture, and manufacturing.
                </p>
                <EnhancedKenyaFeatures />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business-value">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Business Value Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive ROI analysis with industry benchmarks and detailed financial projections.
                </p>
                <AdvancedBusinessValueCalculator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="project-management">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create and manage multiple supply chain optimization projects with database integration.
                </p>
                <ProjectManager />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagement;
