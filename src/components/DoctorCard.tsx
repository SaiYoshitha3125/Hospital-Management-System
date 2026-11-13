import React from 'react';
import { Star, Video, Calendar, Award, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface DoctorCardProps {
  name: string;
  specialty: string;
  qualification?: string;
  rating: number;
  reviewsCount?: number;
  experience: string;
  image: string;
  available: boolean;
  availableForVC?: boolean;
  availableForInPerson?: boolean;
  nextVcSlot?: string;
  consultationFee?: number;
  bio?: string;
  languages?: string[];
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  qualification,
  rating,
  reviewsCount,
  experience,
  image,
  available,
  availableForVC = false,
  availableForInPerson = true,
  nextVcSlot,
  consultationFee,
  bio,
  languages,
}) => {
  return (
    <div className="group flex flex-col rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      {/* Doctor Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-muted/60">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          onError={e => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Availability badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {available && (
            <Badge className="bg-green-500 text-white text-xs font-semibold shadow-lg border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
              Available
            </Badge>
          )}
          {availableForVC && (
            <Badge className="bg-sky-500 text-white text-xs font-semibold shadow-lg border-0">
              <Video className="h-3 w-3 mr-1" />
              VC
            </Badge>
          )}
        </div>

        {/* Rating on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-white text-xs font-bold">{rating.toFixed(1)}</span>
          {reviewsCount && <span className="text-white/70 text-xs">({reviewsCount})</span>}
        </div>
      </div>

      {/* Doctor Info */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div>
          <h3 className="text-base font-bold text-foreground leading-tight">{name}</h3>
          <p className="text-primary font-semibold text-sm mt-0.5">{specialty}</p>
          {qualification && (
            <p className="text-xs text-muted-foreground mt-0.5">{qualification}</p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>{experience}</span>
          </div>
          {languages && languages.length > 0 && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Languages className="h-3.5 w-3.5" />
                <span>{languages.slice(0, 2).join(', ')}</span>
              </div>
            </>
          )}
        </div>

        {bio && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{bio}</p>
        )}

        {/* VC slot info */}
        {availableForVC && nextVcSlot && (
          <div className="flex items-center gap-2 p-2.5 bg-sky-50 dark:bg-sky-950/20 rounded-xl border border-sky-100 dark:border-sky-900">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">{nextVcSlot}</span>
            {consultationFee && (
              <span className="ml-auto text-xs font-bold text-foreground">\${consultationFee}</span>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className={`flex gap-2 pt-1 ${availableForVC ? '' : ''}`}>
          {availableForVC && (
            <Button asChild className="flex-1 gap-1.5 text-xs h-9 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl" size="sm">
              <Link to="/vc-appointment">
                <Video className="h-3.5 w-3.5" />
                VC Now
              </Link>
            </Button>
          )}
          <Button asChild variant={availableForVC ? 'outline' : 'default'} className={`${availableForVC ? 'flex-1' : 'w-full'} gap-1.5 text-xs h-9 rounded-xl`} size="sm">
            <Link to="/appointments">
              <Calendar className="h-3.5 w-3.5" />
              {availableForVC ? 'In-Person' : 'Book Now'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
