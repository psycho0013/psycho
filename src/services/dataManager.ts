import { homeContent } from '@/data/content/home';
import { aboutContent } from '@/data/content/about';
import { contactContent } from '@/data/content/contact';

export interface SiteContent {
    home: typeof homeContent;
    about: typeof aboutContent;
    contact: typeof contactContent;
}

const defaultContent: SiteContent = {
    home: homeContent,
    about: aboutContent,
    contact: contactContent
};

class DataManager {
    private static STORAGE_KEY = 'phy_site_content';

    static getContent(): SiteContent {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                // Merge with default to ensure new fields are present if schema changes
                return { ...defaultContent, ...JSON.parse(stored) };
            } catch (e) {
                console.error("Failed to parse stored content", e);
                return defaultContent;
            }
        }
        return defaultContent;
    }

    static updateContent(newContent: SiteContent): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newContent));
        // Dispatch a custom event to notify components of updates
        window.dispatchEvent(new Event('content-updated'));
    }

    static resetContent(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        window.dispatchEvent(new Event('content-updated'));
    }
}

export default DataManager;
