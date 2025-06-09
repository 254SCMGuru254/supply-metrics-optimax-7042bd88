
import { useToast } from "@/hooks/use-toast";

export { useToast };
export const toast = (props: Parameters<ReturnType<typeof useToast>['toast']>[0]) => {
  // This is a placeholder - actual toast will be called from components using useToast hook
  console.warn('Toast called outside of component context');
};
