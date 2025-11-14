import api from '../api';

const MOCK_POSTS = [
  {
    _id: 'post-1',
    title: 'Highway Billboard - East Entrance',
    description: 'High visibility billboard at the main eastern entrance of Algiers.',
    price: 150000,
    images: ['/times_square.jpg'],
    type: 'Billboard',
    agency: { _id: 'test-agency-1', name: 'Test Agency' },
    category: { name: 'Outdoor' },
    location: 'Algiers'
  },
  {
    _id: 'post-2',
    title: 'City Center Digital Screen',
    description: 'Large LED screen in the heart of downtown.',
    price: 200000,
    images: ['/times_square.jpg'],
    type: 'Digital',
    agency: { _id: 'test-agency-1', name: 'Test Agency' },
    category: { name: 'Digital' },
    location: 'Algiers'
  }
];

export const postsService = {
  getAllPosts: async (params?: any) => {
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock posts:', error);
      // Return structure matching backend response { posts: [], pagination: {} }
      return { posts: MOCK_POSTS, pagination: { total: MOCK_POSTS.length, page: 1, pages: 1 } };
    }
  },

  createPost: async (formData: FormData) => {
    try {
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock post creation:', error);
      return {
        _id: 'new-post-' + Date.now(),
        title: formData.get('title') || 'New Post',
        // ... other fields
      };
    }
  },

  getPostById: async (id: string) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock post:', error);
      return MOCK_POSTS.find(p => p._id === id) || MOCK_POSTS[0];
    }
  },

  updatePost: async (id: string, formData: FormData) => {
    try {
      const response = await api.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock post update:', error);
      return {
        _id: id,
        title: formData.get('title') || 'Updated Post',
      };
    }
  },

  deletePost: async (id: string) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock post deletion:', error);
      return { success: true };
    }
  },
};
