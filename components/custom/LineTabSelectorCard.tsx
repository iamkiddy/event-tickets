import { cn } from "@/lib/utils";

interface TabSelectorCardProps {
    title: string;
    active: boolean;
    onSelect: (tab: string) => void;
    tab: string;
}


export default function LineTabSelectorCard ({title, active, onSelect, tab}: TabSelectorCardProps) {
    
  return (
    <div onClick={()=>onSelect(tab)} className='w-fit px-3 h-14 flex items-center justify-center relative'>
        <span className={cn(
            'cursor-pointer text-sm md:text-lg text-gray-700 font-semibold',
            active && 'text-primaryColor'
        )}>{title}</span>
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-primaryColor ${active ? 'block' : 'hidden'}`}/>
    </div>
  )
}
