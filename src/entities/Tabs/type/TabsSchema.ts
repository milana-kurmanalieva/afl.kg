export interface Tab<queryType = string> {
  value: queryType;
  label: string;
}

type changeTab = (tab:Tab) => void;

export interface TabsProps {
  tabsList: Array<Tab>;
  currentTab?: number;
  changeTab: changeTab;
  variant?: string;
}
export type TabVariants = {
  videoGallery: string;
  newYork: string;
  [key: string]: string;
};

export interface TabsWrapperProps {
  tabsList: Array<Tab>;
  query: string;
  variant?: string;
}
