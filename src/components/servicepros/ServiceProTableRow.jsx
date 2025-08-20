import React from 'react';
import { motion } from 'framer-motion';
import { Star, Briefcase, MapPin, Award, MessageSquare, ChevronDown, ChevronUp, Heart, CalendarDays, Clock, ShieldCheck, Sparkles, TrendingUp, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from "@/components/ui/table";

const ServiceProTableRow = ({ pro, expandedRow, toggleRowExpansion, openAddToFavoritesDialog, isServiceProInAnyFavoriteList, onContact }) => {
  const jobClosingRate = pro.stats?.jobClosingRate;
  const displayName = pro.username || pro.name || pro.companyName;

  return (
    <React.Fragment>
      <TableRow className="border-b hover:bg-gray-50/70 transition-colors duration-150">
        <TableCell className="py-3 px-4 cursor-pointer align-top" onClick={() => toggleRowExpansion(pro.id)}>
          {expandedRow === pro.id ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-gray-400 hover:text-blue-500" />}
        </TableCell>
        <TableCell className="py-3 px-4 align-top">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12 border-2 border-blue-300 flex-shrink-0">
              <AvatarImage src={pro.avatar || `https://avatar.vercel.sh/${displayName}.png`} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-green-400 text-white">{displayName.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">{displayName}</div>
              {(pro.name && displayName !== pro.name) && <div className="text-xs text-gray-500">{pro.name}</div>}
              {(pro.companyName && displayName !== pro.companyName) && <div className="text-xs text-gray-500">{pro.companyName}</div>}
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1 text-gray-400"/> Member Since: {pro.memberSince ? new Date(pro.memberSince).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell className="py-3 px-4 align-top">
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {(pro.skills && Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills || {}).flat()).slice(0, 3).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-2 py-0.5">{skill}</Badge>
            ))}
            {(pro.skills && Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills || {}).flat()).length > 3 && <Badge variant="outline" className="text-xs px-2 py-0.5">+{ (pro.skills && Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills || {}).flat()).length - 3} more</Badge>}
             {(!pro.skills || (Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills || {}).flat()).length === 0) && <span className="text-xs text-gray-400">No skills listed</span> }
          </div>
        </TableCell>
        <TableCell className="py-3 px-4 align-top">
          <div className="space-y-1">
              <div className="flex items-center text-xs text-gray-700">
                  <Star className={`h-4 w-4 mr-1 ${pro.overallRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  <span className="font-medium">{(pro.overallRating || 0).toFixed(1)}</span>&nbsp;({pro.totalReviews || 0} reviews)
              </div>
              <div className="flex items-center text-xs text-gray-700">
                  <Briefcase className="h-4 w-4 mr-1.5 text-blue-500" />
                  {pro.completedJobs || 0} Jobs Completed
              </div>
              {typeof jobClosingRate === 'number' && (
                <div className="flex items-center text-xs text-gray-700">
                  <TrendingUp className="h-4 w-4 mr-1.5 text-green-500" />
                  {jobClosingRate}% Closing Rate
                </div>
              )}
               {pro.stats?.responseTime && (
                  <div className="flex items-center text-xs text-gray-700">
                      <Clock className="h-4 w-4 mr-1.5 text-purple-500" />
                      Avg. Response: {pro.stats.responseTime}
                  </div>
              )}
          </div>
        </TableCell>
        <TableCell className="py-3 px-4 text-xs text-gray-700 align-top">
          <div className="flex items-center">
             <MapPin className="h-4 w-4 mr-1.5 text-green-500 flex-shrink-0" /> 
             <span>{pro.location || 'N/A'}</span>
          </div>
          {pro.serviceArea && (
              <div className="text-xs text-gray-500 mt-1 ml-0.5">Serves: {pro.serviceArea}</div>
          )}
        </TableCell>
        <TableCell className="py-3 px-4 align-top">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-2">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-xs px-2.5 py-1.5 w-full sm:w-auto"
              onClick={() => onContact(pro)}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Contact
            </Button>
             <Button 
              variant="outline" 
              size="sm" 
              onClick={() => openAddToFavoritesDialog(pro)}
              className={`text-xs px-2.5 py-1.5 w-full sm:w-auto ${isServiceProInAnyFavoriteList(pro.id) ? 'text-pink-600 border-pink-500 hover:bg-pink-50 hover:text-pink-700' : 'text-gray-600 hover:border-pink-500 hover:text-pink-600'}`}
              >
              <Heart className={`h-3.5 w-3.5 mr-1.5 ${isServiceProInAnyFavoriteList(pro.id) ? 'fill-pink-500' : ''}`} /> 
              Favorite
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expandedRow === pro.id && (
        <TableRow className="bg-gradient-to-r from-blue-50/30 via-white to-green-50/30">
          <TableCell colSpan={6} className="p-0">
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-6 bg-white shadow-inner rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><UserCircle className="h-4 w-4 mr-2 text-indigo-500"/>Full Bio</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{pro.bio || 'No detailed bio provided by this Service Pro.'}</p>
                      </div>
                      <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Award className="h-4 w-4 mr-2 text-amber-500"/>All Skills</h4>
                          {(pro.skills && (Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills || {}).flat()).length > 0) ? (
                              <div className="flex flex-wrap gap-1.5">
                              {(Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills || {}).flat()).map(skill => (
                                  <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5 font-normal">{skill}</Badge>
                              ))}
                              </div>
                          ) : <p className="text-xs text-gray-500">No specific skills listed.</p>}
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                           <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-teal-500"/>Verifications & More</h4>
                          {pro.stats?.certifications && pro.stats.certifications.length > 0 && (
                              <div className="flex items-start">
                                  <strong className="w-24 font-medium text-gray-500">Certifications:</strong>
                                  <span>{pro.stats.certifications.join(', ')}</span>
                              </div>
                          )}
                          {pro.yearsOfExperience && (
                              <div className="flex items-center">
                                  <strong className="w-24 font-medium text-gray-500">Experience:</strong>
                                  <span>{pro.yearsOfExperience} years</span>
                              </div>
                          )}
                           <div className="flex items-center">
                              <strong className="w-24 font-medium text-gray-500">Insurance:</strong>
                              <span>{pro.insuranceDetails || 'Details not provided'}</span>
                          </div>
                           <div className="flex items-center">
                              <strong className="w-24 font-medium text-gray-500">License No:</strong>
                              <span>{pro.licenseNumber || 'Not provided'}</span>
                          </div>
                           {typeof pro.stats?.jobsAppliedTo === 'number' && (
                            <div className="flex items-center">
                                <strong className="w-24 font-medium text-gray-500">Jobs Applied:</strong>
                                <span>{pro.stats.jobsAppliedTo}</span>
                            </div>
                           )}
                      </div>
                  </div>
              </div>
            </motion.div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default ServiceProTableRow;