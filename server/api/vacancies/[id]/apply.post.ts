import { defineEventHandler, getRouterParam, readMultipartFormData, readBody, createError } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const routerVacancyId = getRouterParam(event, 'id')
  const contentType = event.node.req.headers['content-type'] || ''

  let vacancyId = routerVacancyId
  let fullName = ''
  let email = ''
  let phoneNumber = ''
  let gender = ''
  let workExperience = ''
  let languages: string[] = []
  let skills: string[] = []
  let workExperienceInformation: any = []
  let uploadedFiles: string[] = []
  let resumeUrl = ''
  let coverLetter = ''

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    if (parts) {
      for (const part of parts) {
        const name = part.name
        if (name === 'vacancyId' && !vacancyId) {
          vacancyId = part.data.toString('utf-8')
        } else if (name === 'application_form') {
          try {
            const parsed = JSON.parse(part.data.toString('utf-8'))
            fullName = parsed.fullName || ''
            email = parsed.email || ''
            phoneNumber = parsed.phoneNumber || ''
            gender = parsed.gender || ''
            workExperience = parsed.workExperience || ''
            languages = Array.isArray(parsed.languages) ? parsed.languages : (parsed.languages ? [parsed.languages] : [])
            skills = Array.isArray(parsed.skill) ? parsed.skill : (parsed.skill ? [parsed.skill] : [])
            workExperienceInformation = parsed.workExperienceInformation || []
          } catch (e) {
            console.warn('Failed to parse application_form JSON:', e)
          }
        } else if (name === 'uploaded_files') {
          if (part.filename) {
            uploadedFiles.push(part.filename)
          }
        } else if (name === 'fullName') {
          fullName = part.data.toString('utf-8')
        } else if (name === 'email') {
          email = part.data.toString('utf-8')
        } else if (name === 'phoneNumber' || name === 'phone') {
          phoneNumber = part.data.toString('utf-8')
        } else if (name === 'resumeUrl') {
          resumeUrl = part.data.toString('utf-8')
        } else if (name === 'coverLetter') {
          coverLetter = part.data.toString('utf-8')
        }
      }
    }
  } else {
    // JSON body
    const body = await readBody(event)
    if (body) {
      if (body.vacancyId && !vacancyId) vacancyId = body.vacancyId
      fullName = body.fullName || ''
      email = body.email || ''
      phoneNumber = body.phoneNumber || body.phone || ''
      gender = body.gender || ''
      workExperience = body.workExperience || ''
      languages = Array.isArray(body.languages) ? body.languages : (body.languages ? [body.languages] : [])
      skills = Array.isArray(body.skill || body.skills) ? (body.skill || body.skills) : []
      workExperienceInformation = body.workExperienceInformation || []
      uploadedFiles = Array.isArray(body.uploaded_files) ? body.uploaded_files : (body.uploadedFiles || [])
      resumeUrl = body.resumeUrl || ''
      coverLetter = body.coverLetter || ''
    }
  }

  if (!vacancyId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vacancy ID is required.',
    })
  }

  // Ensure vacancy exists and is OPEN
  const vacancy = await prisma.vacancy.findUnique({
    where: { id: vacancyId },
  })

  if (!vacancy) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job vacancy not found.',
    })
  }

  if (vacancy.status !== 'OPEN') {
    throw createError({
      statusCode: 400,
      statusMessage: 'This job vacancy is no longer accepting applications.',
    })
  }

  if (!fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Full name is required.',
    })
  }

  if (!phoneNumber && !email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone number or email is required.',
    })
  }

  const application = await prisma.vacancyApplication.create({
    data: {
      vacancyId,
      fullName: String(fullName).trim(),
      email: email ? String(email).trim().toLowerCase() : null,
      phone: phoneNumber ? String(phoneNumber).trim() : null,
      phoneNumber: phoneNumber ? String(phoneNumber).trim() : null,
      gender: gender ? String(gender).trim() : null,
      workExperience: workExperience ? String(workExperience).trim() : null,
      languages,
      skills,
      workExperienceInformation: workExperienceInformation ? workExperienceInformation : undefined,
      uploadedFiles,
      resumeUrl: resumeUrl ? String(resumeUrl).trim() : null,
      coverLetter: coverLetter ? String(coverLetter).trim() : null,
      status: 'PENDING',
    },
    include: {
      vacancy: {
        select: {
          id: true,
          title: true,
          team: true,
          company: true,
        },
      },
    },
  })

  return {
    success: true,
    message: 'Vacancy applied successfully!',
    data: application,
  }
})
