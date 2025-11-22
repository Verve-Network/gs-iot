/*
  Integrantes:
  Igor Grave Teixeira - RM567663
  Renan dos Reis Santos - RM568540
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h> // NECESSÁRIO ADICIONAR NO WOKWI

// --- Configurações de Wi-Fi ---
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// --- Configuração do MockAPI ---
const char* serverBase = "https://691d0f6cd58e64bf0d34dfd3.mockapi.io/api/pontos";
const String userID = "1"; 

// --- Hardware ---
#define BTN_START 4
#define LED_WORK 2
#define BUZZER 15

LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- TEMPOS ---
const int workTimeSeconds = 10;  // 10s de foco 
const int breakTimeSeconds = 5;  // 5s de pausa 

int timer = workTimeSeconds;
bool isRunning = false;

void setup() {
  Serial.begin(115200);

  pinMode(BTN_START, INPUT_PULLUP);
  pinMode(LED_WORK, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  digitalWrite(LED_WORK, LOW);

  lcd.init();
  lcd.backlight();
  lcd.print("Conectando WiFi");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Conectado!");
  lcd.clear();
  lcd.print("Sistema Pronto");
  delay(2000);
  lcd.clear();
  lcd.print("Aperte Start");
}

void loop() {
  if (digitalRead(BTN_START) == LOW && !isRunning) {
    startPomodoro();
  }

  if (isRunning) {
    if (timer > 0) {
      timer--;
      updateDisplay(timer);
      delay(1000);
    } else {
      finishCycle();
    }
  }
}

void startPomodoro() {
  isRunning = true;
  timer = workTimeSeconds;
  digitalWrite(LED_WORK, HIGH);
  lcd.clear();
  lcd.print("MODO FOCO:");
}

void finishCycle() {
  isRunning = false;
  digitalWrite(LED_WORK, LOW);

  lcd.clear();
  lcd.print("Ciclo Concluido!");
  tone(BUZZER, 1000);
  delay(1000);
  noTone(BUZZER);

  // 1. Processa os pontos (Gamificação)
  processGamification();

  // 2. Inicia a Pausa Obrigatória (Countdown de 5s)
  lcd.clear();
  lcd.print("PAUSA DESCANSO:");
  
  for(int i = breakTimeSeconds; i > 0; i--) {
    lcd.setCursor(0, 1);
    lcd.print(i);
    lcd.print(" segundos...   "); // Espaços extras para limpar caracteres antigos
    delay(1000);
  }

  // 3. Libera para o próximo ciclo
  lcd.clear();
  lcd.print("Pausa Finalizada");
  delay(1000);
  lcd.clear();
  lcd.print("Aperte Start");
}

void updateDisplay(int currentTime) {
  int minutes = currentTime / 60;
  int seconds = currentTime % 60;
  lcd.setCursor(0, 1);
  if (minutes < 10) lcd.print("0");
  lcd.print(minutes);
  lcd.print(":");
  if (seconds < 10) lcd.print("0");
  lcd.print(seconds);
}

// --- LÓGICA DE GAMIFICAÇÃO ---
void processGamification() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // GET
    String serverURL = String(serverBase) + "/" + userID;
    http.begin(serverURL);

    lcd.clear();
    lcd.print("Lendo pontos...");

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.println("Dados Recebidos: " + payload);

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      int pontosAtuais = doc["pontos"];
      int novosPontos = pontosAtuais + 50; 

      http.end(); 

      // PUT
      lcd.setCursor(0, 1);
      lcd.print("Somando: " + String(novosPontos));
      delay(1000);

      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");

      String jsonUpdate = "{\"pontos\": " + String(novosPontos) + "}";

      int putResponse = http.PUT(jsonUpdate);

      if (putResponse > 0) {
        Serial.println("Atualizado com sucesso!");
        lcd.clear();
        lcd.print("Saldo Atual:");
        lcd.setCursor(0, 1);
        lcd.print(novosPontos);
      } else {
        Serial.print("Erro no PUT: ");
        Serial.println(putResponse);
      }

    } else {
      Serial.print("Erro no GET: ");
      Serial.println(httpResponseCode);
      lcd.clear();
      lcd.print("Erro ao ler ID 1");
    }
    http.end();
    delay(3000); // Tempo para ver o saldo novo antes de entrar na pausa
  } else {
    Serial.println("WiFi Desconectado");
  }
}