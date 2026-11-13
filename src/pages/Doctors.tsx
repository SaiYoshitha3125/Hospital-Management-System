import React, { useState } from 'react';
import { Stethoscope, Video, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DoctorCard from '@/components/DoctorCard';
import { HOSPITAL_DOCTORS } from '@/lib/hospitalData';

type FilterType = 'all' | 'vc' | 'in_person';

const Doctors: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredDoctors = HOSPITAL_DOCTORS.filter((doctor) => {
    if (filter === 'all') return true;
    if (filter === 'vc') return doctor.availableForVC;
    if (filter === 'in_person') return doctor.availableForInPerson;
    return true;
  });

  return (
    <div className="page-transition min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5 border border-primary/20">
            <Stethoscope className="h-4 w-4" />
            <span>Our Medical Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Expert Doctors
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Board-certified physicians and specialists available for instant video consultations
            and in-person appointments. Choose your doctor and start your care journey.
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {[
            { id: 'all' as FilterType, label: 'All Doctors', icon: Stethoscope },
            { id: 'vc' as FilterType, label: 'Available for VC', icon: Video },
            { id: 'in_person' as FilterType, label: 'In-Person', icon: Building2 },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={filter === id ? 'default' : 'outline'}
              onClick={() => setFilter(id)}
              className={`rounded-full gap-2 ${filter === id ? 'bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-soft' : ''}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Count */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          Showing <strong className="text-foreground">{filteredDoctors.length}</strong> doctors
          {filter === 'vc' && ' available for instant VC consultation'}
        </p>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
              qualification={doctor.qualification}
              rating={doctor.rating}
              reviewsCount={doctor.reviewsCount}
              experience={doctor.experience}
              image={doctor.image}
              available={true}
              availableForVC={doctor.availableForVC}
              availableForInPerson={doctor.availableForInPerson}
              nextVcSlot={doctor.nextVcSlot}
              consultationFee={doctor.consultationFee}
              bio={doctor.bio}
              languages={doctor.languages}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No doctors match your filter. Try a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
