import ErrorDisplay from './ErrorDisplay';

export default function JSONErrorExample({ onRetry, onBack }: { onRetry?: () => void; onBack?: () => void }) {
  return (
    <ErrorDisplay
      title="Erro ao processar resposta do servidor"
      message="Recebemos uma resposta inválida do servidor. Isso pode acontecer quando há um problema na comunicação entre o navegador e nossa API."
      technicalDetails="Unexpected non-whitespace character after JSON at position 4 (line 1 column 5)"
      suggestions={[
        'Verifique sua conexão com a internet e tente novamente',
        'Limpe o cache do navegador e recarregue a página',
        'Se você está em uma rede corporativa, verifique se não há firewall bloqueando a requisição',
        'Tente fazer logout e login novamente',
        'Entre em contato com o suporte se o erro persistir'
      ]}
      onRetry={onRetry}
      onBack={onBack}
      showCopyButton={true}
    />
  );
}
