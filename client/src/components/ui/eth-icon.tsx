import { cn } from "@/lib/utils";

interface EthIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EthIcon({ size = 'md', className }: EthIconProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={cn(sizes[size], className)}
      viewBox="0 0 256 417"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <path
        fill="#343434"
        d="M127.9611 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
      />
      <path
        fill="#8C8C8C"
        d="M127.962 0L0 212.32l127.962 75.639V154.158z"
      />
      <path
        fill="#3C3C3B"
        d="M127.9611 312.1866l-1.575 1.92v98.199l1.575 4.601 128.038-180.32z"
      />
      <path
        fill="#8C8C8C"
        d="M127.962 416.9066v-104.72L0 236.5866z"
      />
      <path
        fill="#141414"
        d="M127.9611 287.9577l127.96-75.637-127.96-58.162z"
      />
      <path
        fill="#393939"
        d="M0 212.3207l127.96 75.637V154.1587z"
      />
    </svg>
  );
}
