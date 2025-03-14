import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// grabs (all) users
export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
