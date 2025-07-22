import { isValidAddress  } from "@/helpers/utils"

const handler = async (req, res) => {
  const addr = req.query.address

  if (!isValidAddress(addr)) return res.send({ error: 'Invalid address' })

  const request = await fetch(`http://data.banzai.meme:8081/tx/${addr}`)
  if (request && request.ok) {
    const data = await request.json()
    return res.status(200).json(data)
  }

  res.status(200).json({ error: 'Something wrong' })
}

export default handler
