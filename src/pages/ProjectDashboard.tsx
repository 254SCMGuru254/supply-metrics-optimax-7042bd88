
import React from 'react';
import { ProjectManager } from '@/components/project-management/ProjectManager';

const ProjectDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">📁</span>
          Project Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your supply chain optimization projects and track progress.
        </p>
      </div>

      <ProjectManager />
    </div>
  );
};

export default ProjectDashboard;
