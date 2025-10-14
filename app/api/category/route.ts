import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaConnect';


// GET /category - fetch all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST /category - create a new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        const newCategory = await prisma.category.create({
            data: { name },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
