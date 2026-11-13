import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
export const dynamic='force-dynamic';
export async function GET(){try{await db.product.findFirst({select:{id:true}});return NextResponse.json({status:'ok'},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({status:'unavailable'},{status:503});}}
