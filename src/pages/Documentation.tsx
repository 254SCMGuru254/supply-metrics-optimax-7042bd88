
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppDocumentation } from '@/components/documentation/AppDocumentation';
import { FormulaDropdownSelector } from '@/components/documentation/FormulaDropdownSelector';
import { Book, Calculator, FileText } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Book className="h-8 w-8 text-blue-600" />
          Supply Chain Optimization Documentation
        </h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guide to all mathematical models, formulas, and optimization techniques
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Complete Overview
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Formula Selector
          </TabsTrigger>
          <TabsTrigger value="implementation" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Implementation Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AppDocumentation />
        </TabsContent>

        <TabsContent value="formulas">
          <FormulaDropdownSelector />
        </TabsContent>

        <TabsContent value="implementation">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Implementation Guide</h2>
              <p className="text-muted-foreground mb-6">
                Step-by-step instructions for implementing Supply Metrics Optimax in your organization
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-blue-700 mb-3">Phase 1: Assessment</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Current state analysis</li>
                    <li>• Data quality assessment</li>
                    <li>• Model suitability evaluation</li>
                    <li>• Business case development</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-green-700 mb-3">Phase 2: Implementation</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Data integration setup</li>
                    <li>• Model configuration</li>
                    <li>• User training programs</li>
                    <li>• Pilot testing</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-purple-700 mb-3">Phase 3: Optimization</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Performance monitoring</li>
                    <li>• Continuous improvement</li>
                    <li>• Scale-up planning</li>
                    <li>• ROI measurement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
