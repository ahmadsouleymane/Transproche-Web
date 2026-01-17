import { Company } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {company.logo ? (
              <Image
                src={`${apiUrl}${company.logo}`}
                alt={company.name}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {company.name[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {company.name}
              </h3>
              <Badge variant={company.status === 'active' ? 'success' : 'warning'}>
                {company.status === 'active' ? 'Active' : 'En attente'}
              </Badge>
            </div>
            {company.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {company.description}
              </p>
            )}
            <div className="mt-3 space-y-1">
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-2" />
                <span>{company.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{company.address}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
