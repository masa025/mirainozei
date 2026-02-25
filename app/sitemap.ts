import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Base URL of your application
    const baseUrl = 'https://mirainozei.netlify.app'; // Replace with real domain

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always', // Dashboard is highly dynamic
            priority: 1.0,
        },
        // Add more URLs here if the dashboard expands to multiple pages
    ];
}
