const axios = require('axios');

exports.index = async (req, res) => {
  const title = 'Playlist Home';
  const token = req.session?.token?.access_token;
  if (!token) {
    return res.render('index', { title, playlists: null });
  }

  try {
    const resp = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: 'Bearer ' + token }
    });
    return res.render('index', { title, playlists: resp.data });
  } catch (err) {
    return res.render('index', { title, playlists: null, error: err.response?.data || err.message });
  }
};
