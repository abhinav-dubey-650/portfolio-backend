import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import formidableMiddleware from 'express-formidable'
import { PrismaClient } from '@prisma/client'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSPrisma from '@adminjs/prisma'
import bcrypt from 'bcrypt'

import apiRoutes from './api.js' // ✅ ADD THIS LINE

dotenv.config()
const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// AdminJS setup
AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
})

const admin = new AdminJS({
  databases: [prisma],
  rootPath: '/admin',
})

// AdminJS Auth Router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      if (email === process.env.ADMIN_EMAIL) {
        const hash = process.env.ADMIN_PASSWORD_HASH
        if (!hash) return null
        const isMatch = await bcrypt.compare(password, hash)
        if (isMatch) {
          return { email }
        }
      }
      return null
    },
    cookiePassword: process.env.JWT_SECRET || 'fallback-secret',
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: process.env.JWT_SECRET || 'fallback-secret',
  }
)

// Block SVG upload (prevent XSS)
const blockSvgMiddleware = formidableMiddleware({
  filter: ({ mimetype, originalFilename }) => {
    if (mimetype === 'image/svg+xml' || originalFilename?.endsWith('.svg')) {
      return false
    }
    return true
  },
})

// ✅ Use AdminJS router
app.use(admin.options.rootPath, blockSvgMiddleware, adminRouter)

// ✅ Use API routes
app.use('/api', apiRoutes) // <<< THIS MOUNTS YOUR API.JS

// Simple test route
app.get('/', (req, res) => {
  res.send('🔥 Portfolio backend running!')
})

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
