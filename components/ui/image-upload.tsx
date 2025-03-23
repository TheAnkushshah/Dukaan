"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
    disabled?: boolean;
    onSubmit: (value: { url: string }[]) => void;
    multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onSubmit,
    multiple = false,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        setIsLoading(true);

        if (multiple) {
            setUrls((prev) => [...prev, result.info.secure_url]);
        } else {
            setUrls([result.info.secure_url]);
        }
    };

    const handleOnRemove = (url: string) => {
        setUrls((prev) => prev.filter((item) => item !== url));
    };

    useEffect(() => {
        function handleSubmit() {
            const formattedUrls = urls.map((url) => ({ url }));
            onSubmit(formattedUrls);
        }

        if (!isLoading) {
            const handler = setTimeout(handleSubmit, 50);
            return () => clearTimeout(handler);
        }
    }, [isLoading, urls, onSubmit]);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                {urls.map((url) => (
                    <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button type='button' onClick={() => handleOnRemove(url)} variant='destructive' size='icon'>
                                <Trash className='w-4 h-4' />
                            </Button>
                        </div>
                        <Image fill className='object-cover' alt='Image' src={url} />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={onUpload}
                onQueuesEndAction={() => setIsLoading(false)}
                options={{ multiple, uploadPreset: 'xd1zgfvt' }} // Replace 'your_upload_preset' with your actual upload preset
            >
                {({ open }) => (
                    <Button type='button' disabled={disabled} variant='secondary' onClick={() => open()}>
                        <ImagePlus className='h-4 w-4 mr-2' />
                        Upload an Image
                    </Button>
                )}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;
