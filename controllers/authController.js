const axios = require('axios');
const querystring = require('querystring');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

exports.login = (req, res) => {
  const scope = 'user-read-private user-read-email';
  const state = Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    client_id,
    response_type: 'code',
    redirect_uri,
    scope,
    state
  });
  res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
};

exports.callback = async (req, res) => {
  const code = req.query.code || null;
  if (!code) return res.status(400).send('No code provided');
  try {
    const tokenRes = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        }
      }
    );
    // store tokens in session and redirect to home
    if (req.session) {
      req.session.token = tokenRes.data;
    }
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Token exchange failed: ' + (err.response?.data || err.message));
  }
};
