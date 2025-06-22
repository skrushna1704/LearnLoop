'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { createPost, CreatePostData } from '@/lib/api/posts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { Image as ImageIcon, BookOpen, Lightbulb, Target } from 'lucide-react';

// Zod schema for validation
const formSchema = z.object({
  type: z.enum(['success_story', 'skill_offer', 'learning_request'], {
    required_error: "You need to select a post type.",
  }),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  image: z.any().optional(),
  tags: z.string().optional(),
  
  // Conditional fields
  taughtSkill: z.string().optional(),
  learnedSkill: z.string().optional(),
  offeredSkill: z.string().optional(),
  seekingSkill: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const postTypes = [
  { value: 'skill_offer', label: 'Share a Skill', icon: Lightbulb, description: 'Offer your expertise to the community.' },
  { value: 'learning_request', label: 'Request a Skill', icon: Target, description: 'Ask for help learning something new.' },
  { value: 'success_story', label: 'Post a Success Story', icon: BookOpen, description: 'Share a successful skill exchange.' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'skill_offer',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const postData: CreatePostData = {
      type: data.type,
      content: data.content,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
    };

    if (data.type === 'success_story') {
      postData.skillsExchanged = { taught: data.taughtSkill || '', learned: data.learnedSkill || '' };
    } else if (data.type === 'skill_offer') {
      postData.skillOffered = data.offeredSkill;
      postData.skillSeeking = data.seekingSkill;
    } else if (data.type === 'learning_request') {
      postData.skillSeeking = data.seekingSkill;
    }

    // TODO: Implement image upload and get URL
    // if (data.image && data.image[0]) {
    //   postData.image = await uploadImage(data.image[0]);
    // }

    try {
      await createPost(postData);
      toast.success('Post created successfully!');
      router.push('/community');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a New Community Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Post Type Selection */}
            <div>
              <Label className="text-lg font-semibold">What would you like to share?</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                  >
                    {postTypes.map(({ value, label, icon: Icon, description }) => (
                      <Label
                        key={value}
                        htmlFor={value}
                        className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all ${field.value === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <RadioGroupItem value={value} id={value} className="sr-only" />
                        <Icon className="w-8 h-8 mb-2" />
                        <span className="font-semibold text-center">{label}</span>
                        <p className="text-sm text-gray-500 text-center mt-1">{description}</p>
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>}
            </div>
            
            {/* Conditional Fields */}
            <div className="space-y-4">
              {selectedType === 'success_story' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taughtSkill">Skill You Taught</Label>
                    <Input id="taughtSkill" {...register('taughtSkill')} />
                  </div>
                  <div>
                    <Label htmlFor="learnedSkill">Skill You Learned</Label>
                    <Input id="learnedSkill" {...register('learnedSkill')} />
                  </div>
                </div>
              )}

              {selectedType === 'skill_offer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offeredSkill">Skill You&apos;re Offering</Label>
                    <Input id="offeredSkill" {...register('offeredSkill')} />
                  </div>
                  <div>
                    <Label htmlFor="seekingSkill">Skill You&apos;re Seeking (Optional)</Label>
                    <Input id="seekingSkill" {...register('seekingSkill')} />
                  </div>
                </div>
              )}

              {selectedType === 'learning_request' && (
                <div>
                  <Label htmlFor="seekingSkill">Skill You Want to Learn</Label>
                  <Input id="seekingSkill" {...register('seekingSkill')} />
                </div>
              )}
            </div>

            {/* Post Content */}
            <div>
              <Label htmlFor="content" className="text-lg font-semibold">Your Message</Label>
              <Textarea
                id="content"
                placeholder="Share your story, offer details, or learning goals..."
                {...register('content')}
                className="mt-2 min-h-[150px]"
              />
              {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>}
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., React, Photography, Cooking"
                {...register('tags')}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Featured Image (Optional)</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <Label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <Input id="file-upload" {...register('image')} type="file" className="sr-only" />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 