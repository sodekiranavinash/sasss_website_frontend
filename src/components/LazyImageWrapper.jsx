import { useState, ImgHTMLAttributes } from 'react';
import Loader from './Loader';

const LazyImageWrapper = ({ src, alt, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <Loader dots={5}/>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  );
};

export default LazyImageWrapper;