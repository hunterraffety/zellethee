import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // get most current active config.
    let config = await prisma.onboardingConfig.findFirst({
      where: { isActive: true },
    })

    // if none exists, create default
    if (!config) {
      config = await prisma.onboardingConfig.create({
        data: {
          aboutMePage: 2,
          addressPage: 2,
          birthdatePage: 3,
          isActive: true,
        },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching configuration:', error)
    return NextResponse.json(
      { message: 'Failed to fetch configuration: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // validate fields
    if (
      typeof data.aboutMePage !== 'number' ||
      typeof data.addressPage !== 'number' ||
      typeof data.birthdatePage !== 'number'
    ) {
      return NextResponse.json(
        { message: 'Invalid configuration data' },
        { status: 400 }
      )
    }

    // each page must contain AT LEAST one component
    const page2Components = [
      data.aboutMePage === 2,
      data.addressPage === 2,
      data.birthdatePage === 2,
    ].filter(Boolean).length

    const page3Components = [
      data.aboutMePage === 3,
      data.addressPage === 3,
      data.birthdatePage === 3,
    ].filter(Boolean).length

    if (page2Components === 0 || page3Components === 0) {
      return NextResponse.json(
        { message: 'Each page must have at least one component' },
        { status: 400 }
      )
    }

    console.log('Updating config:', data)

    /* multi step update in a transaction:
    deactivate all existing configs and create a new active config */
    const config = await prisma.$transaction(async (tx) => {
      // deactivate
      await tx.onboardingConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      })

      // create new
      return tx.onboardingConfig.create({
        data: {
          aboutMePage: data.aboutMePage,
          addressPage: data.addressPage,
          birthdatePage: data.birthdatePage,
          isActive: true,
        },
      })
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating configuration:', error)
    return NextResponse.json(
      {
        message: 'Failed to update configuration: ' + (error as Error).message,
      },
      { status: 500 }
    )
  }
}
