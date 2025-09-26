import { cn } from '@/utils';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

const typographyVariants = cva('font-normal text-sm leading-6', {
  variants: {
    variant: {
      h1: 'text-secondary text-4xl font-bold capitalize',
      h2: 'text-3xl font-semibold',
      h3: 'text-secondary text-xl font-semibold',
      p: 'text-base text-secondary',
      span: 'text-base leading-4',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

interface Props
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

export const Typography = ({
  variant,
  children,
  asChild,
  className,
  ...props
}: Props) => {
  const Comp = asChild ? Slot : (variant ?? 'p');

  return (
    <Comp {...props} className={cn(typographyVariants({ variant, className }))}>
      {children}
    </Comp>
  );
};
