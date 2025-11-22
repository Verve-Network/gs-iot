## Integrantes:

Igor Grave Teixeira - RM567663

Renan dos Reis Santos - RM568540

## Link do simulador:

https://wokwi.com/projects/448010756710769665

## Link do site da Verve:

https://gs-iot-three.vercel.app/

## Descrição do projeto:

A ausência de pausas durante o trabalho pode levar à fadiga e à redução da eficiência operacional. Este software implementa a técnica Pomodoro para estruturar intervalos de foco e descanso, mitigando esses efeitos. O diferencial da aplicação reside na camada de gamificação: o sistema converte ciclos de foco bem-sucedidos em pontos. O usuário pode utilizar essa pontuação para adquirir recompensas virtuais, promovendo um mecanismo de feedback positivo que estimula o engajamento contínuo.

## Instruções de uso:

Ao pressionar o botão, o ciclo de foco se inicia. Assim que o tempo acaba, seus pontos são somados e o tempo de pausa começa. Depois, é só acessar a loja da Verve para conferir seu saldo e resgatar recompensas criadas sob medida para você.

## Imagem do circuito:

<img width="898" height="548" alt="image" src="https://github.com/user-attachments/assets/669195b4-8525-4de7-911d-08dccc8ab85f" />

## Requisições HTTP:

https://691d0f6cd58e64bf0d34dfd3.mockapi.io/api/pontos

O nosso ESP32 faz uma requisição GET para saber quantos pontos o usuário possui e depois soma mais 50 e faz uma requisição PUT para atualizar os dados, que são imediatamente recebidos pelo site da loja.
