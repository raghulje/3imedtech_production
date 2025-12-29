export interface ContentBlock {
    id: number;
    page_id: number;
    block_type: 'hero' | 'text' | 'image' | 'cards' | 'cta' | 'html' | 'text_image';
    block_name: string;
    block_data: any;
    display_order: number;
    is_active: boolean;
}

export interface Page {
    id: number;
    slug: string;
    title: string;
    status: 'draft' | 'published';
    blocks?: ContentBlock[];
}

export interface NavigationItem {
    id: number;
    menu_id: number;
    parent_id: number | null;
    label: string;
    url: string;
    type: 'internal' | 'external' | 'dropdown';
    target: string;
    icon?: string;
    css_class?: string;
    display_order: number;
    children?: NavigationItem[];
}

export interface NavigationMenu {
    id: number;
    name: string;
    location: string;
    items: NavigationItem[];
}

export interface Settings {
    [key: string]: any;
}
