export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req, res) => {
  const request = await fetch('http://data.banzai.meme:8081/leaderboard')

  if (request && request.ok) {
    const data = await request.json()
    return res.status(200).json(data)
  }

  res.status(200).json({ error: 'wrong request' })
}

export default handler
