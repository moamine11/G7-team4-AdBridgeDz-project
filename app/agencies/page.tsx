
import { Suspense } from 'react'; 
import AgenciesListingPage from '@/components/pages/agencies-listing-page';

export default function Page() {
  return (
    
    <Suspense fallback={<div>Loading agencies...</div>}>
      <AgenciesListingPage />
    </Suspense>
  );
}