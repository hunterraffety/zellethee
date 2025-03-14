import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // grab email
    const userEmail = data.email

    if (!userEmail) {
      return NextResponse.json(
        { message: 'User email is required' },
        { status: 400 }
      )
    }

    // look user up
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // data obj
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}

    // current step in the onboarding process
    if (data.currentStep && typeof data.currentStep === 'number') {
      updateData.currentStep = data.currentStep
    }

    // about me
    if (data.aboutMe !== undefined) {
      updateData.aboutMe = data.aboutMe
    }

    // address fields
    if (data.street !== undefined) updateData.street = data.street
    if (data.city !== undefined) updateData.city = data.city
    if (data.state !== undefined) updateData.state = data.state
    if (data.zip !== undefined) updateData.zip = data.zip

    // birthday
    if (data.birthdate !== undefined) {
      updateData.birthdate = new Date(data.birthdate)
    }

    console.log('Updating user data ***', { email: userEmail, ...updateData })

    // update the user
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: updateData,
    })

    return NextResponse.json({
      message: 'User updated successfully',
      currentStep: updatedUser.currentStep,
      email: updatedUser.email,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Failed to update user: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
