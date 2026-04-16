import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, ExternalLink, AlertCircle, Loader2, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  getGoogleCloudAPIKey,
  testGoogleCloudAPIKey 
} from '../utils/googleTTS';

interface GoogleTTSStatusWidgetProps {
  onConfigure?: () => void;
}

export default function GoogleTTSStatusWidget({ onConfigure }: GoogleTTSStatusWidgetProps) {
  const [status, setStatus] = useState<'checking' | 'configured' | 'not-configured'>('checking');
  const [voicesCount, setVoicesCount] = useState(0);

  useEffect(() => {
    checkGoogleTTSStatus();
  }, []);

  const checkGoogleTTSStatus = async () => {
    try {
      const apiKey = getGoogleCloudAPIKey();
      
      if (!apiKey) {
        setStatus('not-configured');
        return;
      }

      const result = await testGoogleCloudAPIKey();
      
      if (result.valid) {
        setStatus('configured');
        setVoicesCount(result.voicesAvailable || 0);
      } else {
        setStatus('not-configured');
      }
    } catch (error) {
      console.error('[GOOGLE TTS STATUS] Erro ao verificar:', error);
      setStatus('not-configured');
    }
  };

  return (
    <Card className="p-4 border-slate-200/50 bg-gradient-to-br from-white to-blue-50/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Volume2 className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Google TTS</h3>
            <p className="text-xs text-slate-500">Text-to-Speech PT-PT</p>
          </div>
        </div>
        
        {status === 'checking' && (
          <Loader2 className="size-4 text-blue-600 animate-spin" />
        )}
        
        {status === 'configured' && (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="size-3 mr-1" />
            Ativo
          </Badge>
        )}
        
        {(status === 'not-configured') && (
          <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
            <AlertCircle className="size-3 mr-1" />
            Inativo
          </Badge>
        )}
      </div>

      {status === 'configured' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Vozes disponíveis:</span>
            <span className="font-semibold text-blue-600">{voicesCount} vozes PT-PT</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Estado:</span>
            <span className="font-semibold text-green-600">✅ Operacional</span>
          </div>
        </div>
      )}

      {status === 'not-configured' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Configure a API do Google Cloud para ativar vozes IA em Português de Portugal.
          </p>
          <Button 
            onClick={onConfigure}
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8"
          >
            <Settings className="size-3 mr-1" />
            Configurar Agora
          </Button>
        </div>
      )}
    </Card>
  );
}