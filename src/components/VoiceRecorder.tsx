import { useState } from 'react';
import { Mic, MicOff, Square, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const { 
    isRecording, 
    isProcessing, 
    error, 
    startRecording, 
    stopRecording, 
    cancelRecording,
    clearError 
  } = useVoiceRecording();
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (success) {
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store interval ID for cleanup
      (window as any).recordingInterval = interval;
    }
  };

  const handleStopRecording = async () => {
    // Clear timer
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
      (window as any).recordingInterval = null;
    }
    setRecordingTime(0);

    const audioBlob = await stopRecording();
    if (audioBlob) {
      // Convert blob to base64 for transmission
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = (reader.result as string).split(',')[1];
        transcribeAudio(base64Audio);
      };
      reader.readAsDataURL(audioBlob);
    }
  };

  const handleCancelRecording = () => {
    // Clear timer
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
      (window as any).recordingInterval = null;
    }
    setRecordingTime(0);
    cancelRecording();
  };

  const transcribeAudio = async (base64Audio: string) => {
    try {
      // This would typically call a speech-to-text API
      // For now, we'll simulate it
      toast({
        title: "Voice transcription",
        description: "Voice transcription feature coming soon!",
      });
      
      // Simulate transcription result
      setTimeout(() => {
        onTranscription("Voice message transcribed successfully!");
      }, 1000);
      
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: "Failed to transcribe voice message",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    toast({
      title: "Microphone Error",
      description: error,
      variant: "destructive",
    });
    clearError();
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">
            Recording {formatTime(recordingTime)}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStopRecording}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            disabled={isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelRecording}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleStartRecording}
      disabled={disabled || isProcessing}
      className="h-8 w-8 p-0"
    >
      {isProcessing ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}