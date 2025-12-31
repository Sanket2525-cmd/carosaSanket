import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonGrid({ count = 6, columns = 3 }) {
  return (
    <SkeletonTheme baseColor="#E5E5E5" highlightColor="#F0F0F0">
      <div className={`row g-3 skeleton-grid-wrapper`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={`col-12 col-md-${12 / columns}`}>
            <div className="skeleton-card">
              <Skeleton height={150} className="mb-2" />
              <Skeleton height={20} width="70%" className="mb-1" />
              <Skeleton height={16} width="50%" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default SkeletonGrid;

