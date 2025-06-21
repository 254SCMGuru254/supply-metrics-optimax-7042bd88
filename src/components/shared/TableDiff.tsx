import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DiffProps {
  oldData: Record<string, any>[];
  newData: Record<string, any>[];
  headers: { key: string; label: string }[];
  title?: string;
}

const getChanges = (oldData: any[], newData: any[], keyField: string) => {
  const changes: Record<string, { oldValue: any; newValue: any }> = {};
  const newMap = new Map(newData.map(item => [item[keyField], item]));

  for (const oldItem of oldData) {
    const newItem = newMap.get(oldItem[keyField]);
    if (newItem) {
      for (const key in oldItem) {
        if (oldItem[key] !== newItem[key]) {
          if (!changes[oldItem[keyField]]) {
            changes[oldItem[keyField]] = { oldValue: {}, newValue: {} };
          }
          changes[oldItem[keyField]].oldValue[key] = oldItem[key];
          changes[oldItem[keyField]].newValue[key] = newItem[key];
        }
      }
    }
  }
  return changes;
};

export const TableDiff: React.FC<DiffProps> = ({ oldData, newData, headers, title = "Comparison" }) => {
  if (!oldData.length || !newData.length) {
    return <div>Data not available for comparison.</div>;
  }

  const keyField = headers[0]?.key;
  if (!keyField) {
      return <div>Header key is required for comparison.</div>;
  }
  
  const changes = getChanges(oldData, newData, keyField);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(h => <TableHead key={h.key}>{h.label}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {newData.map(newItem => {
              const itemChanges = changes[newItem[keyField]];
              return (
                <TableRow key={newItem[keyField]}>
                  {headers.map(h => {
                    const changed = itemChanges && itemChanges.newValue.hasOwnProperty(h.key);
                    const oldValue = itemChanges?.oldValue[h.key];

                    return (
                      <TableCell key={h.key} className={changed ? 'bg-yellow-100 dark:bg-yellow-900' : ''}>
                        {changed && (
                          <span className="text-xs text-red-500 line-through mr-2">
                            {oldValue}
                          </span>
                        )}
                        {newItem[h.key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 