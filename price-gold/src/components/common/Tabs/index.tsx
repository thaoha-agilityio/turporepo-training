import { ComponentProps, JSX } from 'react';
import { cn } from '@/utils';

// Components
import { TabsContent, TabsList, TabsTrigger, TabsWrapper } from './tabs';

type TabType = {
  value: string;
  label: string;
  content: JSX.Element;
  onClick?: () => void;
};

interface TabsProps extends ComponentProps<typeof TabsWrapper> {
  tabs: TabType[];
  defaultValue?: string;
  extraStyle?: string;
}

export const Tabs = ({
  tabs,
  defaultValue,
  className,
  extraStyle,
  ...props
}: TabsProps) => {
  const initialValue = defaultValue ?? tabs[0].value;

  return (
    <TabsWrapper
      defaultValue={initialValue}
      className={cn('w-full', className)}
      {...props}
    >
      <div className="w-full bg-transparent">
        <TabsList className={extraStyle}>
          {tabs.map(({ value, label, onClick }) => (
            <TabsTrigger
              key={value}
              value={value}
              onClick={onClick}
              className="pb-2 cursor-pointer text-md md:text-xl text-secondary"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value} className="mt-2">
          {content}
        </TabsContent>
      ))}
    </TabsWrapper>
  );
};
