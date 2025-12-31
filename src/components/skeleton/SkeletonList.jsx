import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonList({ count = 3, height = 60 }) {
  return (
    <SkeletonTheme baseColor="#E5E5E5" highlightColor="#F0F0F0">
      <div className="skeleton-list-wrapper">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex align-items-center gap-3">
              <Skeleton width={20} height={20} />
              <Skeleton width={20} height={20} />
              <Skeleton height={height} width="60%" />
              <Skeleton height={height} width="20%" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default SkeletonList;

