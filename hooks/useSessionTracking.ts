import { useEffect, useRef } from 'react';

interface SessionTrackingProps {
  chatbotId: string;
  companyId: string;
  threadId: string;
}

export const useSessionTracking = ({ chatbotId, companyId, threadId }: SessionTrackingProps) => {
  const sessionStartTime = useRef<number>(Date.now());
  const interactionCount = useRef<number>(0);

  const trackInteraction = (eventType: string) => {
    interactionCount.current += 1;
    
    // In a real implementation, you would send this data to your analytics service
    console.log('Tracking interaction:', {
      eventType,
      chatbotId,
      companyId,
      threadId,
      timestamp: new Date().toISOString(),
      sessionDuration: Date.now() - sessionStartTime.current,
      interactionCount: interactionCount.current
    });
  };

  useEffect(() => {
    // Track session start
    trackInteraction('session_start');
    
    // Track session end when component unmounts
    return () => {
      trackInteraction('session_end');
    };
  }, []);

  return { trackInteraction };
}; 