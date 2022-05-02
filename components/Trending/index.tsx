import * as React from 'react';

interface TrendingProps {
  result: any;
}

const Trending: React.FC<TrendingProps> = ({result}) => {
  // TODO: Trending
  return (
    <h1>Trending</h1>
  )
};

export default React.memo<TrendingProps>(Trending);