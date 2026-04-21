import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const reportPath = path.join(process.cwd(), 'docs', 'reports', 'bangalore_gba_story.html');

export async function GET() {
    try {
        const html = await readFile(reportPath, 'utf8');

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'private, no-store',
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
            },
        });
    } catch {
        return new NextResponse('Report not found.', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex, nofollow, noarchive',
            },
        });
    }
}