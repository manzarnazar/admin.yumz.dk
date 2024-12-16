import request from './request';

const url = 'dashboard/admin/shop-sections';

const bookingZoneService = {
  getAll: (params) => request.get(url, { params }),
  getById: (id, params) => request.get(`${url}/${id}`, { params }),
  create: (data) => request.post(url, data),
  update: (id, data) => request.put(`${url}/${id}`, data),
  delete: (params) => request.delete(`${url}/delete`, { params }),
};

export default bookingZoneService;