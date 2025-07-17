
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
}

const AdminTodoTracker = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Fix RLS Policies for Analytics',
      description: 'Analytics page is blank due to missing RLS policies',
      priority: 'high',
      status: 'pending',
      category: 'Database'
    },
    {
      id: '2',
      title: 'Implement Admin Role Management',
      description: 'Set up admin roles and permissions system',
      priority: 'high',
      status: 'pending',
      category: 'Security'
    },
    {
      id: '3',
      title: 'Create Chat System Backend',
      description: 'Connect chat assistant to database and AI',
      priority: 'medium',
      status: 'pending',
      category: 'Features'
    },
    {
      id: '4',
      title: 'Add Data Validation',
      description: 'Implement comprehensive data validation across forms',
      priority: 'medium',
      status: 'pending',
      category: 'Data Quality'
    },
    {
      id: '5',
      title: 'Fix TypeScript Compilation Errors',
      description: 'Resolve all TypeScript errors preventing builds',
      priority: 'high',
      status: 'completed',
      category: 'Development'
    }
  ]);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }
        : todo
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const completedCount = todos.filter(todo => todo.status === 'completed').length;
  const totalCount = todos.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Issues & TODO Tracker</span>
          <Badge variant="outline">
            {completedCount}/{totalCount} Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 border rounded-lg transition-all ${
                todo.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTodo(todo.id)}
                    className="p-0 h-auto"
                  >
                    {getStatusIcon(todo.status)}
                  </Button>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      todo.status === 'completed' ? 'line-through text-gray-500' : ''
                    }`}>
                      {todo.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                        {todo.priority}
                      </Badge>
                      <Badge variant="secondary">{todo.category}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTodoTracker;
