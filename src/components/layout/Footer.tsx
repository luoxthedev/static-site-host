import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface BuildInfo {
  commitHash: string;
  commitTimestamp: number;
  commitDate: string;
  buildTime: number;
}

export function Footer() {
  const { i18n } = useTranslation();
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  
  useEffect(() => {
    // Dynamically import build info
    import('@/buildInfo.json')
      .then(module => setBuildInfo(module.default as BuildInfo))
      .catch(() => {
        // Build info not available (development mode without build)
        setBuildInfo(null);
      });
  }, []);
  
  if (!buildInfo) {
    return null; // Don't show footer if build info is not available
  }
  
  const locale = i18n.language === 'fr' ? fr : enUS;
  const timeAgo = formatDistanceToNow(new Date(buildInfo.commitTimestamp), {
    addSuffix: true,
    locale
  });
  
  return (
    <footer className="mt-auto py-4 px-4 text-center text-xs text-muted-foreground border-t border-border/50">
      <p>
        Build {buildInfo.commitHash} from {timeAgo}
      </p>
    </footer>
  );
}
