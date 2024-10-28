import MediaProgressBar from '@/components/media-progress-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InstructorContext } from '@/context/instructor-context'
import { toast } from '@/hooks/use-toast'
import { mediaUploadService } from '@/services/media-services'
import React, { useContext } from 'react'

const CourseSettings = () => {

  const { courseLandingFormData, setCourseLandingFormData,
    mediaUploadProgress, setMediaUploadProgress,
    mediaUploadProgressPercentage, setMediaUploadProgressPercentage
  } = useContext(InstructorContext);

  // handle upload image upload change
  const handleImageUploadChange = async (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append('file', selectedImage);

      try {
        setMediaUploadProgress(true);
        const { success, message, data } = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);

        if (success && data) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: data?.url
          });
          setMediaUploadProgress(false);
          toast({
            title: message || "Image file uploaded successfully!",
          });
        }

      } catch (error) {
        setMediaUploadProgress(false);
        console.error(error);
        toast({
          title: "Error uploading image file!",
          variant: 'destructive'
        });
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Course Settings
        </CardTitle>
      </CardHeader>

      <CardContent>
        {
          courseLandingFormData && courseLandingFormData.image
            ? (<img
              src={courseLandingFormData.image}
              alt="course-image"
            />)
            : (
              <div className='flex flex-col gap-3'>
                <Label>Upload Course Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadChange}
                />
                {
                  mediaUploadProgress ? (
                    <MediaProgressBar
                      isMediaUploading={mediaUploadProgress}
                      progress={mediaUploadProgressPercentage}
                    />
                  ) : (null)
                }
              </div>
            )
        }
      </CardContent>
    </Card>
  )
}

export default CourseSettings