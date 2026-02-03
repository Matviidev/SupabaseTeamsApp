function ProductSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="flex flex-row h-64 gap-5">
          <div className="w-2/3 bg-gray-200 rounded-lg"></div>
          <div className="w-1/3 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="flex flex-row h-30 gap-5">
          <div className="w-full bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
