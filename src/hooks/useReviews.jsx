import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useReviews = () => {
  const { user, updateUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
    setLoading(false);
  }, []);

  const saveReviews = (updatedReviews) => {
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const addReview = (reviewData) => {
    const newReview = {
      id: Date.now().toString(),
      reviewerId: user.id,
      reviewerName: user.name,
      reviewerType: user.userType,
      ...reviewData,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [...reviews, newReview];
    saveReviews(updatedReviews);

    updateUserRatings(reviewData.revieweeId, reviewData);
    
    return newReview;
  };

  const updateUserRatings = (userId, reviewData) => {
    const savedUsers = localStorage.getItem('users') || '[]';
    const users = JSON.parse(savedUsers);
    
    const userReviews = reviews.filter(r => r.revieweeId === userId);
    userReviews.push(reviewData);

    const avgOverallRating = userReviews.reduce((sum, r) => sum + r.overallRating, 0) / userReviews.length;
    
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const updatedStats = { ...u.stats };
        
        if (u.userType === 'technician') {
          updatedStats.customerServiceRating = userReviews.reduce((sum, r) => sum + (r.customerService || 0), 0) / userReviews.length;
          updatedStats.arrivalOnTimeRating = userReviews.reduce((sum, r) => sum + (r.arrivalOnTime || 0), 0) / userReviews.length;
        } else {
          updatedStats.communicationRating = userReviews.reduce((sum, r) => sum + (r.communication || 0), 0) / userReviews.length;
          updatedStats.jobClarityRating = userReviews.reduce((sum, r) => sum + (r.jobClarity || 0), 0) / userReviews.length;
          updatedStats.paymentReliability = userReviews.reduce((sum, r) => sum + (r.paymentReliability || 0), 0) / userReviews.length;
        }

        return {
          ...u,
          overallRating: avgOverallRating,
          totalReviews: userReviews.length,
          stats: updatedStats
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    if (userId === user.id) {
      updateUser({
        overallRating: avgOverallRating,
        totalReviews: userReviews.length,
        stats: updatedUsers.find(u => u.id === userId)?.stats
      });
    }
  };

  const getUserReviews = (userId) => {
    return reviews.filter(review => review.revieweeId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAverageRatings = (userId) => {
    const userReviews = getUserReviews(userId);
    if (userReviews.length === 0) return null;

    const avgRatings = {
      overall: userReviews.reduce((sum, r) => sum + r.overallRating, 0) / userReviews.length,
      totalReviews: userReviews.length
    };

    const firstReview = userReviews[0];
    if (firstReview.customerService !== undefined) {
      avgRatings.customerService = userReviews.reduce((sum, r) => sum + (r.customerService || 0), 0) / userReviews.length;
      avgRatings.arrivalOnTime = userReviews.reduce((sum, r) => sum + (r.arrivalOnTime || 0), 0) / userReviews.length;
    } else {
      avgRatings.communication = userReviews.reduce((sum, r) => sum + (r.communication || 0), 0) / userReviews.length;
      avgRatings.jobClarity = userReviews.reduce((sum, r) => sum + (r.jobClarity || 0), 0) / userReviews.length;
      avgRatings.paymentReliability = userReviews.reduce((sum, r) => sum + (r.paymentReliability || 0), 0) / userReviews.length;
    }

    return avgRatings;
  };

  return {
    reviews,
    loading,
    addReview,
    getUserReviews,
    getAverageRatings
  };
};