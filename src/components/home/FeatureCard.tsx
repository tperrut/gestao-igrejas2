
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  colorClass: string;
  buttonText?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  link,
  colorClass,
  buttonText = "Saiba Mais"
}) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2 text-center">
        <div className={`mx-auto p-3 rounded-full ${colorClass} mb-4`}>
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600">
          {description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 justify-center">
        <Link to={link}>
          <Button variant="outline" className={colorClass.replace('bg-', 'text-').replace('/10', '')}>
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
