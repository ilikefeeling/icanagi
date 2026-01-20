import { ProductCategory } from '@prisma/client'
import { Home, ShoppingBag, Briefcase, Wrench, TrendingUp, PenTool, Cpu, Palette, Workflow } from 'lucide-react'

interface CategorySidebarProps {
    currentCategory?: ProductCategory
}

const categories = [
    { name: 'Customer Service & Support', icon: Home, value: null },
    { name: 'Sales', icon: ShoppingBag, value: 'AI_AGENT' },
    { name: 'Back Office', icon: Briefcase, value: 'GENERATIVE_AI' },
    { name: 'Operations', icon: Wrench, value: 'MACHINE_LEARNING' },
    { name: 'Growth & Marketing', icon: TrendingUp, value: 'NLP' },
    { name: 'Writing & Editing', icon: PenTool, value: 'COMPUTER_VISION' },
    { name: 'Technology & IT', icon: Cpu, value: 'AUTOMATION' },
    { name: 'Design & Creative', icon: Palette, value: 'DATA_ANALYTICS' },
    { name: 'Workflow Automation', icon: Workflow, value: 'ROBOTICS' },
]

export function CategorySidebar({ currentCategory }: CategorySidebarProps) {
    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-light-border p-6">
            <h3 className="text-base font-bold text-gray-900 mb-6">
                Most Popular Categories
            </h3>
            <nav className="space-y-1">
                {categories.map((cat) => {
                    const Icon = cat.icon
                    const isActive = currentCategory === cat.value || (!currentCategory && !cat.value)

                    return (
                        <a
                            key={cat.name}
                            href={cat.value ? `/?category=${cat.value}` : '/'}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span>{cat.name}</span>
                        </a>
                    )
                })}
            </nav>
        </aside>
    )
}
