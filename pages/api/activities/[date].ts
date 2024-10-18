import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query

  if (req.method === 'PUT') {
    // Handle PUT request
    console.log('Received PUT request for date:', date);
    // Your logic here
    res.status(200).json({ message: 'Activity updated' })
  } else if (req.method === 'DELETE') {
    // Handle DELETE request
    console.log('Received DELETE request for date:', date);
    // Your logic here
    res.status(200).json({ message: 'Activity deleted' })
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

