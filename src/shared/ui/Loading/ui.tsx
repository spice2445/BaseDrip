import ContentLoader from 'react-content-loader';
import { randomSkeleton } from 'shared/lib/random-skeleton';


export const Skeleton = () => (
  <ContentLoader
    speed={2}
    width={'100%'}
    height={'100%'}
    viewBox="0 0 900 65"
    backgroundColor="#050023cc"
    foregroundColor="#14132fcc"
  >
    {randomSkeleton().map((skelet) => (
      <rect key={skelet.width} {...skelet} />
    ))}
    
  </ContentLoader>
);
