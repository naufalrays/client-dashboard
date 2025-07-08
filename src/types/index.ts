export interface MenuItem {
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    path: string;
}

export interface HeaderProps {
    title: string;
}