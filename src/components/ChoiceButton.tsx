import { motion } from 'framer-motion';

interface ChoiceButtonProps {
  label: string;
  variant: 'accept' | 'reject';
  onClick: () => void;
  icon?: string;
}

export default function ChoiceButton({ label, variant, onClick, icon }: ChoiceButtonProps) {
  const styles = {
    accept: {
      bg: 'bg-gradient-to-b from-green-400 to-green-600',
      border: 'border-green-800',
      shadow: 'shadow-[0_4px_0_rgb(22,101,52)]',
      hoverShadow: 'hover:shadow-[0_2px_0_rgb(22,101,52)]',
      text: 'text-white',
    },
    reject: {
      bg: 'bg-gradient-to-b from-amber-200 to-amber-300',
      border: 'border-amber-800',
      shadow: 'shadow-[0_4px_0_rgb(120,53,15)]',
      hoverShadow: 'hover:shadow-[0_2px_0_rgb(120,53,15)]',
      text: 'text-amber-900',
    },
  };

  const style = styles[variant];

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 2 }}
      onClick={onClick}
      className={`
        flex-1 px-6 py-3 rounded-lg font-bold text-lg
        ${style.bg} ${style.border} ${style.text}
        border-3 ${style.shadow} ${style.hoverShadow}
        hover:-translate-y-0.5 active:translate-y-1
        transition-all duration-150
        flex items-center justify-center gap-2
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {label}
    </motion.button>
  );
}
