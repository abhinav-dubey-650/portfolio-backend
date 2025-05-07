import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
})

export default router
