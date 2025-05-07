import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSPrisma from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

// Register the Prisma adapter
AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
})

// ✅ Use `databases: [prisma]` instead of resources
const adminJs = new AdminJS({
    rootPath: '/admin',
    resources: [
      { resource: prisma.About },
      { resource: prisma.Project },
      { resource: prisma.Experience },
      { resource: prisma.Testimonial },
      { resource: prisma.TechStack },
      { resource: prisma.ContactLink },
      { resource: prisma.ContactMessage },
      { resource: prisma.BlogPost },
      { resource: prisma.Education },
      { resource: prisma.Certification },
    ],
    branding: {
      companyName: 'Abhinav Admin',
      softwareBrothers: false,
    },
  })
  

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === process.env.ADMIN_EMAIL) {
        const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
        if (valid) return { email }
      }
      return null
    },
    cookieName: 'adminjs',
    cookiePassword: process.env.JWT_SECRET,
  }
)

export { adminJs, adminRouter }
