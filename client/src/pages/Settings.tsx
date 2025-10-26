import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  // Check DocuSign OAuth status
  const { data: docusignStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['/api/docusign/oauth/status'],
  });

  // Get authorization URL
  const { mutate: connectDocuSign, isPending: isConnecting } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/docusign/oauth/connect');
      if (!response.ok) throw new Error('Failed to get authorization URL');
      return response.json();
    },
    onSuccess: (data) => {
      // Open DocuSign authorization in popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        data.authorizationUrl,
        'DocuSign Authorization',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      // Poll for popup close (means OAuth completed)
      const pollTimer = window.setInterval(() => {
        if (popup && popup.closed) {
          window.clearInterval(pollTimer);
          // Refresh status after popup closes
          queryClient.invalidateQueries({ queryKey: ['/api/docusign/oauth/status'] });
          toast({
            title: "Connection check",
            description: "Verificando conexão DocuSign...",
          });
        }
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao conectar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Disconnect DocuSign
  const { mutate: disconnectDocuSign, isPending: isDisconnecting } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/docusign/oauth/disconnect', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to disconnect');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/docusign/oauth/status'] });
      toast({
        title: "Desconectado",
        description: "DocuSign foi desconectado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao desconectar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isConnected = (docusignStatus as { connected?: boolean })?.connected === true;

  return (
    <div className="h-full overflow-y-auto">
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Configure integrações e serviços externos
          </p>
        </div>

        {/* Integrations Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Integrações</h2>

          {/* DocuSign OAuth Card */}
          <Card data-testid="card-docusign-oauth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <span>DocuSign</span>
                    {isCheckingStatus ? (
                      <Badge variant="outline">Verificando...</Badge>
                    ) : isConnected ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="w-3 h-3 mr-1" />
                        Desconectado
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Assinatura digital de contratos entre comprador, fornecedor e broker
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status Info */}
              {isConnected ? (
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900 dark:text-green-100">
                      DocuSign está conectado e pronto para uso
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Você pode enviar envelopes de assinatura para contratos de 3 partes (comprador + fornecedor + broker).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-900 dark:text-orange-100">
                      DocuSign não está conectado
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Conecte sua conta DocuSign para enviar contratos digitais. Este é um processo único que leva menos de 1 minuto.
                    </p>
                  </div>
                </div>
              )}

              {/* OAuth Method Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Método de Autenticação</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✓ OAuth 2.0 Authorization Code Grant</p>
                  <p>✓ Renovação automática de tokens</p>
                  <p>✓ Segurança padrão da indústria</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {isConnected ? (
                  <Button
                    variant="destructive"
                    onClick={() => disconnectDocuSign()}
                    disabled={isDisconnecting}
                    data-testid="button-disconnect-docusign"
                  >
                    {isDisconnecting ? 'Desconectando...' : 'Desconectar'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => connectDocuSign()}
                    disabled={isConnecting}
                    data-testid="button-connect-docusign"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isConnecting ? 'Abrindo...' : 'Conectar DocuSign'}
                  </Button>
                )}

                <Button
                  variant="outline"
                  asChild
                >
                  <a
                    href="https://admindemo.docusign.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-docusign-admin"
                  >
                    Abrir Admin Console
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>

              {/* Help Text */}
              <div className="pt-4 border-t space-y-2">
                <h4 className="text-sm font-medium">Como conectar</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Clique em "Conectar DocuSign"</li>
                  <li>Faça login na sua conta DocuSign</li>
                  <li>Autorize o acesso da aplicação</li>
                  <li>Pronto! Os contratos podem ser enviados</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Stripe Card (Status Only) */}
          <Card data-testid="card-stripe">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <span>Stripe</span>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Configurado
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Pagamentos em escrow com liberação automática após entrega
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Stripe está configurado e operacional
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Ambiente: {import.meta.env.MODE === 'production' ? 'Produção' : 'Desenvolvimento'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
