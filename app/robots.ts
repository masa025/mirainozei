import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example of disallowed path if you have any
        },
        sitemap: 'https://mirainozei.netlify.app/sitemap.xml', // Replace with real domain
    };
}
