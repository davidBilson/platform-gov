export default function StatCardSkeleton() {
    return ( 
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="p-3 rounded-lg bg-gray-200">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}