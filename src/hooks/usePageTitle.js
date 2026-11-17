import { useEffect } from 'react';

/** Sets the browser tab title, e.g. "Creamy Pasta · OpenJar". */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · OpenJar` : 'OpenJar · Discover & Share Amazing Recipes';
  }, [title]);
}
