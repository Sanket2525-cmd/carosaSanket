import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonFilter() {
  return (
    <SkeletonTheme baseColor="#E5E5E5" highlightColor="#F0F0F0">
      <div className="skeleton-filter-wrapper">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <Skeleton height={20} width="30%" />
              <Skeleton width={24} height={24} circle />
            </div>
            {index % 2 === 0 && (
              <div className="ms-4">
                <Skeleton height={16} width="80%" className="mb-1" />
                <Skeleton height={16} width="60%" />
              </div>
            )}
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default SkeletonFilter;

