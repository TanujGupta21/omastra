import api from '../lib/api';

export const reviewService = {
  getByProduct: (slugOrId) => api.get(`/api/v1/reviews/product/${slugOrId}`),
  create: (slugOrData, maybeData) => {
    if (typeof slugOrData === 'string') {
      return api.post(`/api/v1/reviews/product/${slugOrData}`, maybeData);
    }
    const slug = slugOrData.productSlug || slugOrData.slug || slugOrData.product;
    return api.post(`/api/v1/reviews/product/${slug}`, slugOrData);
  },
  update: (id, data) => api.put(`/api/v1/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/v1/reviews/${id}`),
  markHelpful: (id) => api.post(`/api/v1/reviews/${id}/helpful`),
};
