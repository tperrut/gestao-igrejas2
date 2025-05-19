
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  testimonial: string;
  name: string;
  church: string;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  name,
  church,
  rating = 5
}) => {
  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex text-church-blue">
            {[...Array(rating)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          "{testimonial}"
        </p>
        <div className="flex items-center">
          <div className="ml-4">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{church}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
