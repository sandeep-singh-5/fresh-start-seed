import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Phone, Mail, MapPin, Building, Edit, Briefcase } from 'lucide-react';

const formatAddress = (customer) => {
  if (!customer) return 'N/A';
  const parts = [customer.streetAddress, customer.aptSuite, customer.city, customer.state, customer.zipCode].filter(Boolean);
  return parts.join(', ') || 'Not provided';
};

export const CustomerDetailsDialog = ({ isOpen, onOpenChange, customer, jobs, onAddNote, onEditCustomer }) => {
  const [newNote, setNewNote] = useState('');

  if (!customer) return null;

  const handleAddNoteSubmit = () => {
    if (newNote.trim()) {
      const success = onAddNote(customer.id, newNote.trim());
      if (success) {
        setNewNote(''); 
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {customer.firstName} {customer.lastName}
            <Button variant="outline" size="sm" onClick={() => { onOpenChange(false); onEditCustomer(customer); }} className="ml-auto">
              <Edit className="h-4 w-4 mr-1" />Edit Customer
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1 text-gray-700">Contact Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><Mail className="inline h-4 w-4 mr-2 text-blue-500" />{customer.email}</p>
                  <p><Phone className="inline h-4 w-4 mr-2 text-blue-500" />{customer.phone || 'N/A'}</p>
                  <p><Building className="inline h-4 w-4 mr-2 text-blue-500" />{customer.company || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-gray-700">Address</h4>
                <p className="text-sm text-gray-600"><MapPin className="inline h-4 w-4 mr-2 text-blue-500" />{formatAddress(customer)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-gray-700">Customer Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded"><strong>Jobs:</strong> {jobs.length || 0}</div>
                <div className="text-center p-2 bg-gray-50 rounded"><strong>Spent:</strong> ${customer.totalSpent || 0}</div>
                <div className="text-center p-2 bg-gray-50 rounded"><strong>Rating:</strong> {customer.rating || 0}/5</div>
                <div className="text-center p-2 bg-gray-50 rounded"><strong>Status:</strong> <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>{customer.status || 'N/A'}</Badge></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center"><Briefcase className="h-5 w-5 mr-2 text-blue-600" />Job History ({jobs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {jobs.map(job => (
                    <div key={job.id} className="p-3 border rounded-md bg-gray-50 hover:shadow-sm">
                      <div className="flex justify-between items-center">
                        <h5 className="font-semibold text-gray-800">{job.title}</h5>
                        <Badge variant={job.status === 'completed' || job.status === 'paid' ? 'default' : 'secondary'}>{job.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{job.category} - Budget: ${job.budget}</p>
                      <p className="text-xs text-gray-500">Created: {new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-3">No jobs recorded for this customer yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3 pr-2">
                {customer.notes && customer.notes.length > 0 ? (
                  customer.notes.slice().reverse().map((note) => (
                    <div key={note.id} className="p-2.5 bg-blue-50/50 border border-blue-200 rounded text-sm">
                      <p className="text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-3">No notes yet for this customer.</p>
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddNoteSubmit}
                  disabled={!newNote.trim()}
                  className="self-end"
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};