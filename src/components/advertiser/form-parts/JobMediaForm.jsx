import React, { useState } from 'react';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast';
import { ImagePlus, VideoOff as VideoPlus, Trash2, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobMediaForm = ({ formData, onInputChange }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  };

  const handleAddUrl = (type) => {
    const urlToAdd = type === 'image' ? currentImageUrl : currentVideoUrl;
    const existingUrls = type === 'image' ? formData.imageUrls : formData.videoUrls;

    if (!urlToAdd.trim()) {
      toast({ title: "Error", description: `Please enter a ${type} URL.`, variant: "destructive" });
      return;
    }
    if (!isValidUrl(urlToAdd)) {
      toast({ title: "Error", description: `Invalid ${type} URL format. Please enter a valid URL (e.g., http://example.com/image.jpg).`, variant: "destructive" });
      return;
    }
    if (existingUrls.includes(urlToAdd)) {
      toast({ title: "Info", description: `This ${type} URL has already been added.`, variant: "default" });
      return;
    }

    const updatedUrls = [...existingUrls, urlToAdd];
    onInputChange(type === 'image' ? 'imageUrls' : 'videoUrls', updatedUrls);
    
    if (type === 'image') setCurrentImageUrl('');
    if (type === 'video') setCurrentVideoUrl('');
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} URL Added`, description: `The ${type} URL has been added.` });
  };

  const handleRemoveUrl = (type, urlToRemove) => {
    const existingUrls = type === 'image' ? formData.imageUrls : formData.videoUrls;
    const updatedUrls = existingUrls.filter(url => url !== urlToRemove);
    onInputChange(type === 'image' ? 'imageUrls' : 'videoUrls', updatedUrls);
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} URL Removed`, description: `The ${type} URL has been removed.` });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
        <ImagePlus size={20} className="mr-2 text-teal-600"/>
        Attach Media (Optional)
      </h3>
      <p className="text-sm text-gray-500 -mt-4">Add URLs for images or videos relevant to the job. This helps technicians understand the scope better.</p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="imageUrl" className="font-medium flex items-center mb-1">
            <ImagePlus size={16} className="mr-1 text-teal-600"/>
            Image URLs
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="imageUrl"
              type="url"
              value={currentImageUrl}
              onChange={(e) => setCurrentImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="focus:ring-teal-500 focus:border-teal-500"
            />
            <Button type="button" variant="outline" onClick={() => handleAddUrl('image')} className="whitespace-nowrap">
              Add Image
            </Button>
          </div>
          {formData.imageUrls && formData.imageUrls.length > 0 && (
            <div className="mt-3 space-y-2">
              <AnimatePresence>
                {formData.imageUrls.map((url, index) => (
                  <motion.div
                    key={`img-${index}-${url}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center justify-between p-2 border rounded-md bg-gray-50 text-sm"
                  >
                    <div className="flex items-center truncate">
                      <LinkIcon size={14} className="mr-2 text-teal-500 flex-shrink-0" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline truncate" title={url}>
                        {url}
                      </a>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveUrl('image', url)} className="text-red-500 hover:text-red-700 h-7 w-7">
                      <Trash2 size={16} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="videoUrl" className="font-medium flex items-center mb-1">
            <VideoPlus size={16} className="mr-1 text-teal-600"/>
            Video URLs
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="videoUrl"
              type="url"
              value={currentVideoUrl}
              onChange={(e) => setCurrentVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=example"
              className="focus:ring-teal-500 focus:border-teal-500"
            />
            <Button type="button" variant="outline" onClick={() => handleAddUrl('video')} className="whitespace-nowrap">
              Add Video
            </Button>
          </div>
          {formData.videoUrls && formData.videoUrls.length > 0 && (
            <div className="mt-3 space-y-2">
              <AnimatePresence>
                {formData.videoUrls.map((url, index) => (
                  <motion.div
                    key={`vid-${index}-${url}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center justify-between p-2 border rounded-md bg-gray-50 text-sm"
                  >
                     <div className="flex items-center truncate">
                      <LinkIcon size={14} className="mr-2 text-teal-500 flex-shrink-0" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline truncate" title={url}>
                        {url}
                      </a>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveUrl('video', url)} className="text-red-500 hover:text-red-700 h-7 w-7">
                      <Trash2 size={16} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMediaForm;