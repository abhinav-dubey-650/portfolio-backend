import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/about', async (_, res) => res.json(await prisma.about.findMany()))
router.get('/projects', async (_, res) => res.json(await prisma.project.findMany()))
router.get('/experience', async (_, res) => res.json(await prisma.experience.findMany()))
router.get('/testimonials', async (_, res) => res.json(await prisma.testimonial.findMany()))
router.get('/tech-stack', async (_, res) => res.json(await prisma.techStack.findMany()))
router.get('/contact', async (_, res) => res.json(await prisma.contactLink.findMany()))
router.get('/contact-messages', async (_, res) => res.json(await prisma.contactMessage.findMany()))
router.get('/blog', async (_, res) => res.json(await prisma.blogPost.findMany()))
router.get('/education', async (_, res) => res.json(await prisma.education.findMany()))
router.get('/certifications', async (_, res) => res.json(await prisma.certification.findMany()))

export default router
