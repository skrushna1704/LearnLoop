import { apiClient } from '../api-client';

export interface ProfilePictureResponse {
  message: string;
  profilePicture: string | null;
}

export const profileApi = {
  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<ProfilePictureResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Remove profile picture
  removeProfilePicture: async (): Promise<ProfilePictureResponse> => {
    const response = await apiClient.delete('/users/profile-picture');
    return response.data;
  },
}; 