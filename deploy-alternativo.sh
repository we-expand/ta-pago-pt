#!/bin/bash

echo "🚀 Script de Deploy Alternativo - TaPago.pt"
echo "=========================================="

# Build do projeto
echo "📦 Fazendo build do projeto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi

# Tentar deploy na Vercel (se estiver funcionando)
echo "🔄 Tentando deploy na Vercel..."
vercel --prod 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Deploy na Vercel realizado com sucesso!"
    echo "🌐 URL: Verifique o dashboard da Vercel"
else
    echo "⚠️ Vercel indisponível. Tentando Netlify..."
    
    # Fazer deploy na Netlify (CLI precisa estar instalada)
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=dist
        if [ $? -eq 0 ]; then
            echo "✅ Deploy na Netlify realizado com sucesso!"
        else
            echo "❌ Erro no deploy da Netlify"
        fi
    else
        echo "⚠️ Netlify CLI não encontrada"
        echo "📋 Opções disponíveis:"
        echo "   1. Aguardar Vercel voltar ao ar"
        echo "   2. Instalar Netlify CLI: npm install -g netlify-cli"
        echo "   3. Usar servidor local: npm run dev"
    fi
fi

echo "=========================================="
echo "🎉 Processo concluído!"
