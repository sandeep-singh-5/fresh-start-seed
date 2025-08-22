import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Edit, Save, X, Tag } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings.jsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { cn } from '../../lib/utils';

const TagSettings = () => {
  const { settings, addTag, updateTag, deleteTag } = useSettings();
  const { tags = [] } = settings || {};
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366f1');
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [editingTagColor, setEditingTagColor] = useState('');
  const { toast } = useToast();

  const handleAddTag = () => {
    if (newTagName.trim() === '') {
      toast({ title: 'Error', description: 'Tag name cannot be empty.', variant: 'destructive' });
      return;
    }
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      toast({ title: 'Error', description: 'This tag name already exists.', variant: 'destructive' });
      return;
    }
    addTag({ name: newTagName, color: newTagColor });
    setNewTagName('');
    setNewTagColor('#6366f1');
  };

  const handleEdit = (tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
    setEditingTagColor(tag.color);
  };

  const handleUpdate = () => {
    if (editingTagName.trim() === '') {
      toast({ title: 'Error', description: 'Tag name cannot be empty.', variant: 'destructive' });
      return;
    }
    if (tags.some(tag => tag.id !== editingTagId && tag.name.toLowerCase() === editingTagName.trim().toLowerCase())) {
      toast({ title: 'Error', description: 'This tag name already exists.', variant: 'destructive' });
      return;
    }
    updateTag(editingTagId, { name: editingTagName, color: editingTagColor });
    setEditingTagId(null);
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
  };

  const colorPalette = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
  ];

  const renderTag = (tag) => (
    <motion.div
      layout
      key={tag.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    >
      {editingTagId === tag.id ? (
        <div className="flex-grow flex items-center gap-2">
          <Input type="color" value={editingTagColor} onChange={(e) => setEditingTagColor(e.target.value)} className="w-12 h-10 p-1" />
          <Input value={editingTagName} onChange={(e) => setEditingTagName(e.target.value)} className="flex-grow"/>
          <Button size="icon" variant="ghost" className="text-green-500 hover:text-green-600" onClick={handleUpdate}><Save className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
        </div>
      ) : (
        <>
          <Badge style={{ backgroundColor: tag.color }} className="text-white text-sm font-medium">
            <Tag className="h-3 w-3 mr-1.5" />{tag.name}
          </Badge>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="text-gray-500 hover:text-blue-600" onClick={() => handleEdit(tag)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="text-gray-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the "{tag.name}" tag.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteTag(tag.id)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-gray-700">
          <Tag className="h-6 w-6 mr-2 text-blue-500" />
          Manage Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Create New Tag</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Input
                type="text"
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-grow"
              />
              <div className="flex items-center gap-2 self-stretch">
                <Input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-14 h-10 p-1 rounded-md"
                  title="Select tag color"
                />
                <Button onClick={handleAddTag} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>
             <div className="mt-3 flex flex-wrap gap-2">
                {colorPalette.map(color => (
                    <button 
                        key={color}
                        type="button"
                        className={cn("w-6 h-6 rounded-full cursor-pointer border-2 transition-transform duration-150",
                            newTagColor === color ? 'border-blue-500 scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                        aria-label={`Select color ${color}`}
                    />
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Existing Tags</h3>
            {tags.length > 0 ? (
              <div className="space-y-2">
                {tags.map(renderTag)}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No tags created yet. Add one above to get started!</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagSettings;