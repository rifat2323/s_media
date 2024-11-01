import { useState } from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'



export default function ImageComponent({
  src,
  alt,
  

  containerClassName,
  skeletonClassName,
  className,
  ...props
}:{src:string,alt?:string,containerClassName?:string,skeletonClassName?:string,className?:string} ) {

  const [isLoading, setIsLoading] = useState(true)

  return (
    <AspectRatio 
      ratio={1/1} 
      className={cn("bg-muted  rounded-md w-full h-full", containerClassName)}
    >
      {isLoading && (
        <Skeleton 
          className={cn("h-full w-full absolute inset-0", skeletonClassName)} 
        />
      )}
      <img
        src={src}
        alt={alt}
        width={100}
        height={100}
       
        onLoad={() => setIsLoading(false)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300 " ,
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </AspectRatio>
  )
}