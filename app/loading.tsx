import { LighthouseLoader } from '@/components/LighthouseLoader';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-lg">
        <LighthouseLoader
          label="Loading Chaloo Trip..."
          sublabel="Syncing live Windy radar, instant fast-track tickets, and safety dispatchers"
        />
      </div>
    </div>
  );
}
