import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params; 
  try {
    await prisma.submission.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting submission:', err);
    return NextResponse.json({ success: false, error: 'Error deleting submission' }, { status: 500 });
  }
}
