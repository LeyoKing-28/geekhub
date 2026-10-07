const API_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('geekhub_token');
const auth = () => ({ Authorization: `Bearer ${getToken()}` });
const json = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json', ...auth() }, body: JSON.stringify(body) });

export const api = {
  signup: async (data) => (await fetch(`${API_URL}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  login: async (data) => (await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),

  getUser: async (id) => (await fetch(`${API_URL}/users/${id}`, { headers: auth() })).json(),
  updateUser: async (id, data) => (await fetch(`${API_URL}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...auth() }, body: JSON.stringify(data) })).json(),
  getUsers: async () => (await fetch(`${API_URL}/users`, { headers: auth() })).json(),

  toggleFollow: async (userId) => (await fetch(`${API_URL}/follows`, json({ userId }))).json(),
  getFollowers: async (id) => (await fetch(`${API_URL}/users/${id}/followers`, { headers: auth() })).json(),
  getFollowing: async (id) => (await fetch(`${API_URL}/users/${id}/following`, { headers: auth() })).json(),

  sendFriendRequest: async (friendId) => (await fetch(`${API_URL}/friendships`, json({ friendId }))).json(),
  getFriends: async () => (await fetch(`${API_URL}/friendships`, { headers: auth() })).json(),

  getConversations: async () => (await fetch(`${API_URL}/conversations`, { headers: auth() })).json(),
  getMessages: async (cid) => (await fetch(`${API_URL}/conversations/${cid}/messages`, { headers: auth() })).json(),
  createConversation: async (recipientId) => (await fetch(`${API_URL}/conversations`, json({ recipientId }))).json(),

  createPost: async (data) => (await fetch(`${API_URL}/posts`, json(data))).json(),
  getPosts: async () => (await fetch(`${API_URL}/posts`, { headers: auth() })).json(),
  getFeed: async () => (await fetch(`${API_URL}/feed`, { headers: auth() })).json(),
  likePost: async (postId) => (await fetch(`${API_URL}/posts/${postId}/like`, { method: 'POST', headers: auth() })).json(),
  sharePost: async (postId) => (await fetch(`${API_URL}/posts/${postId}/share`, { method: 'POST', headers: auth() })).json(),
  getComments: async (postId) => (await fetch(`${API_URL}/posts/${postId}/comments`, { headers: auth() })).json(),
  addComment: async (postId, content) => (await fetch(`${API_URL}/posts/${postId}/comments`, json({ content }))).json(),

  getRecommendations: async () => (await fetch(`${API_URL}/recommendations`, { headers: auth() })).json(),
  getSuggestions: async () => (await fetch(`${API_URL}/suggestions`, { headers: auth() })).json(),

  labOverview: async () => (await fetch(`${API_URL}/lab/overview`, { headers: auth() })).json(),
  feedTrace: async (postId) => (await fetch(`${API_URL}/lab/feed-trace?post_id=${postId}`, { headers: auth() })).json(),
  suggestTrace: async (userId) => (await fetch(`${API_URL}/lab/suggest-trace?user_id=${userId}`, { headers: auth() })).json(),
  egoGraph: async () => (await fetch(`${API_URL}/lab/ego-graph`, { headers: auth() })).json(),
};
