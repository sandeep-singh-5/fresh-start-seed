import React, { useState } from 'react';
import { useForum } from '../../hooks/useForum.jsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Loader2, Tag } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { Badge } from '../ui/badge';

const CreateThreadForm = ({ categoryId, onThreadCreated }) => {
  const { createThread } = useForum();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagsInputChange = (e) => {
    const newTagsInput = e.target.value;
    setTagsInput(newTagsInput);
    if (newTagsInput.endsWith(',') || newTagsInput.endsWith(' ')) {
      const newTag = newTagsInput.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagsInput('');
      } else if (tags.length >= 5) {
        toast({ title: "Tag limit reached", description: "You can add up to 5 tags.", variant: "default" });
        setTagsInput(newTag); // Keep the input if limit reached
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Error", description: "Title and content cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const finalTags = [...tags];
    if (tagsInput.trim() && !finalTags.includes(tagsInput.trim()) && finalTags.length < 5) {
      finalTags.push(tagsInput.trim());
    }

    const newThread = await createThread({ categoryId, title, content, tags: finalTags });
    setIsSubmitting(false);
    if (newThread) {
      setTitle('');
      setContent('');
      setTagsInput('');
      setTags([]);
      if (onThreadCreated) onThreadCreated(newThread);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div>
        <Label htmlFor="threadTitle" className="font-semibold text-gray-700">Thread Title</Label>
        <Input
          id="threadTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a clear and concise title"
          className="mt-1 focus:ring-blue-500 focus:border-blue-500"
          maxLength={100}
          required
        />
        <p className="text-xs text-gray-500 mt-1">{100 - title.length} characters remaining</p>
      </div>
      <div>
        <Label htmlFor="threadContent" className="font-semibold text-gray-700">Your Message</Label>
        <Textarea
          id="threadContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, questions, or ideas..."
          className="mt-1 min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="threadTags" className="font-semibold text-gray-700">Tags (Optional)</Label>
        <Input
          id="threadTags"
          value={tagsInput}
          onChange={handleTagsInputChange}
          placeholder="Add tags separated by commas or spaces (e.g., plumbing, tips)"
          className="mt-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={tags.length >= 5}
        />
        <p className="text-xs text-gray-500 mt-1">Up to 5 tags. Press comma or space to add a tag.</p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1 bg-blue-100 text-blue-700 border-blue-300">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">
                  &times;
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white min-w-[120px]">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tag className="mr-2 h-4 w-4" />}
          Create Thread
        </Button>
      </div>
    </form>
  );
};

export default CreateThreadForm;