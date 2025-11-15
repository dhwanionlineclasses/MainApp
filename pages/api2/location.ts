import { NextApiRequest, NextApiResponse } from 'next';

const IpInfoApiToken = process.env.IPINFO_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const response = await fetch(`https://ipinfo.io/json?token=${IpInfoApiToken}`);

    // Fetch the user's IP address from request headers
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // console.log('Client IP:', ip);

    // Fetch location data from ipinfo.io
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${IpInfoApiToken}`);

    if (!response.ok) {
      console.error('Failed to fetch location:', response.status, response.statusText);
      return res.status(500).json({ error: 'Failed to fetch location' });
    }

    
    const data = await response.json();
    // console.log('Fetched location data:', data);

    res.status(200).json({ country: data.country, region: data.region });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ country: 'DEFAULT', region: '' });
  }
}