import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId } = params;

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: storeId
            }
        });

        return NextResponse.json(size);

    } catch (err) {
        console.log(`[SIZES_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = params;
        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: storeId
            }
        });

        return NextResponse.json(sizes);

    } catch (err) {
        console.log(`[SIZES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function PUT(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  try {
      const { userId } = await auth();
      const body = await req.json();
      const { storeId, sizeId } = params;

      const { name, value } = body;

      if (!userId) {
          return new NextResponse("Unauthenticated", { status: 401 });
      }

      if (!name) {
          return new NextResponse("Name is required", { status: 400 });
      }

      if (!value) {
          return new NextResponse("Value is required", { status: 400 });
      }

      if (!storeId) {
          return new NextResponse("Store Id is required", { status: 400 });
      }

      if (!sizeId) {
          return new NextResponse("Size Id is required", { status: 400 });
      }

      const storeByUserId = await prismadb.store.findFirst({
          where: {
              id: storeId,
              userId
          }
      });

      if (!storeByUserId) {
          return new NextResponse("Unauthorized", { status: 403 });
      }

      const size = await prismadb.size.update({
          where: {
              id: sizeId
          },
          data: {
              name,
              value
          }
      });

      return NextResponse.json(size);

  } catch (err) {
      console.log(`[SIZES_PUT] ${err}`);
      return new NextResponse(`Internal error`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
) {
  return PUT(req, { params });
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } }
) {
    try {
        const { userId } = await auth();
        const { storeId, sizeId } = params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size Id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await prismadb.size.delete({
            where: {
                id: sizeId
            }
        });

        return new NextResponse("Size deleted successfully", { status: 200 });

    } catch (err) {
        console.log(`[SIZES_DELETE] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}