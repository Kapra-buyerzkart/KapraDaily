import React, { useState } from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

const noImage = require('../assets/images/logos/noimage.png');

interface FallbackImageProps extends Omit<ImageProps, 'source'> {
    source: ImageSourcePropType;
    fallback?: ImageSourcePropType;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
    source,
    fallback = noImage,
    onError,
    ...rest
}) => {
    const [hasError, setHasError] = useState(false);

    return (
        <Image
            {...rest}
            source={hasError ? fallback : source}
            onError={(e) => {
                setHasError(true);
                onError?.(e);
            }}
        />
    );
};

export default FallbackImage;
