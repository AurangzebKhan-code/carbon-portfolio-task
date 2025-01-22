export interface Project {
    id: string;
    name: string;
    country: string;
    image_url: string;
    price_per_ton: string;
    offered_volume: string;
    distribution_weight: string;
    supplier: string;
    earliest_delivery: Date;
    description: string;
}

export interface Portfolio {
    id: number;
    requested_volume: number;
    total_volume: number;
    items: PortfolioItem[];
}

export interface PortfolioItem {
    project_id: string;
    allocated_volume: number;
    name?: string;
    price_per_ton?: number;
    country?: string;
}