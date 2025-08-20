import React from 'react';
import { Star, Clock, Award, TrendingUp, Calendar, MapPin, Briefcase, Wrench, Mail, Phone, Building, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfileCard = ({ user, reviews = [] }) => {
  if (!user) return null;

  const displayName = user.username || user.name || user.companyName;
  const memberSince = new Date(user.memberSince || user.createdAt).getFullYear();
  const avgRating = user.overallRating || 0;
  const totalReviews = user.totalReviews || reviews.length || 0;

  const renderTechnicianStats = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Closing Rate</p>
          <p className="font-bold text-blue-600">{user.stats?.jobClosingRate || 0}%</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Star className="h-5 w-5 text-green-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Customer Service</p>
          <p className="font-bold text-green-600">{(user.stats?.customerServiceRating || 0).toFixed(1)}</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">On-Time Arrival</p>
          <p className="font-bold text-yellow-600">{(user.stats?.arrivalOnTimeRating || 0).toFixed(1)}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Jobs Completed</p>
          <p className="font-bold text-purple-600">{user.completedJobs || 0}</p>
        </div>
      </div>
      {user.skills && typeof user.skills === 'object' && Object.keys(user.skills).length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-gray-700" />
            Skills & Expertise
          </h4>
          <div className="space-y-3">
            {Object.entries(user.skills).map(([trade, skillsList]) => (
              <div key={trade}>
                <h5 className="font-medium text-blue-700 mb-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {trade}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(skillsList) && skillsList.length > 0 ? (
                    skillsList.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No specific skills listed for this trade.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderAdvertiserStats = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
        <p className="text-sm text-gray-600">Communication</p>
        <p className="font-bold text-blue-600">{(user.stats?.communicationRating || 0).toFixed(1)}</p>
      </div>
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <Star className="h-5 w-5 text-green-600 mx-auto mb-1" />
        <p className="text-sm text-gray-600">Job Clarity</p>
        <p className="font-bold text-green-600">{(user.stats?.jobClarityRating || 0).toFixed(1)}</p>
      </div>
      <div className="text-center p-3 bg-yellow-50 rounded-lg">
        <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
        <p className="text-sm text-gray-600">Payment Reliability</p>
        <p className="font-bold text-yellow-600">{(user.stats?.paymentReliability || 0).toFixed(1)}</p>
      </div>
      <div className="text-center p-3 bg-purple-50 rounded-lg">
        <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
        <p className="text-sm text-gray-600">Jobs Posted</p>
        <p className="font-bold text-purple-600">{user.stats?.totalJobsPosted || 0}</p>
      </div>
    </div>
  );

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-blue-100 via-white to-green-100 p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${displayName}.png`} alt={`${displayName}'s avatar`} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-3xl">
              {displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-1 flex items-center">
              <UserCircle className="h-8 w-8 mr-2 text-blue-600" />
              {displayName}
            </CardTitle>
            {(user.name && displayName !== user.name) && <p className="text-md text-gray-600 -mt-1 mb-1">({user.name})</p>}
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm px-3 py-1 mb-2">
              {user.userType === 'advertiser' ? 'Advertiser' : 'Technician'}
            </Badge>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 text-sm text-gray-600 mt-1 justify-center sm:justify-start">
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{avgRating.toFixed(1)}</span>
                <span>({totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Calendar className="h-4 w-4" />
                <span>Member since {memberSince}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
               {user.email && (
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.companyName && displayName !== user.companyName && (
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Building className="h-4 w-4" />
                  <span>{user.companyName}</span>
                </div>
              )}
            </div>
            {user.bio && (
              <p className="text-sm text-gray-500 mt-3 max-w-xl text-center sm:text-left">{user.bio}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {user.userType === 'technician' ? renderTechnicianStats() : renderAdvertiserStats()}
        
        {user.stats?.specialties && user.stats.specialties.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-lg">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {user.stats.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-sm">{specialty}</Badge>
              ))}
            </div>
          </div>
        )}

        {user.stats?.certifications && user.stats.certifications.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-lg">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {user.stats.certifications.map((cert, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 text-sm">{cert}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;