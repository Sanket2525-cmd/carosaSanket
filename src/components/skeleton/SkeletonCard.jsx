'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonCard() {
  return (
    <SkeletonTheme baseColor="#E5E5E5" highlightColor="#F0F0F0" >
      <div className="skeleton-card-wrapper h-100">
        <div className="cardMain h-100">
          <Skeleton height={200} width="100%" className="mb-2" style={{ borderRadius: '8px' }} />
          <Skeleton height={20} width="10%" className="mb-2" />
          <Skeleton height={16} width="6%" className="mb-2" />
          <Skeleton height={16} width="14%" className="mb-2" />
          <Skeleton height={40} width="100%" className="mb-2" />
          <Skeleton height={45} width="100%" />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default SkeletonCard;

