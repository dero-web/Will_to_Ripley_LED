<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;

// Konstanten definieren
const MAX_MESSAGE_LENGTH = 25;

// Zentrale Fehlerbehandlung
function sendError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// Validierungsfunktion
function validateMessage($message) {
    if ($message === '') {
        sendError('Leere Nachrichten funktionieren nicht.');
    }

    if (!preg_match('/^[A-Z ]{1,' . MAX_MESSAGE_LENGTH . '}$/', $message)) {
        sendError('Nur A-Z & Leerzeichen (keine Umlaute), max. ' . MAX_MESSAGE_LENGTH . ' Zeichen!');
    }
    return true;
}

try {
    // Client-ID für MQTT
    $clientId = 'webclient_' . uniqid();

    // Input verarbeiten
    $data = json_decode(file_get_contents('php://input'), true);
    $rawMessage = (string)($data['message'] ?? '');
    $message = strtoupper(substr(trim($rawMessage), 0, MAX_MESSAGE_LENGTH));

    // Validierung
    validateMessage($message);

    // MQTT Verbindung
    $settings = (new ConnectionSettings)
        ->setUsername($mqtt_username)
        ->setPassword($mqtt_password)
        ->setUseTls(true)
        ->setTlsVerifyPeer(true)
        ->setTlsVerifyPeerName(true)
        ->setTlsCertificateAuthorityFile('vendor/isrgrootx1.pem');

    $mqtt = new MqttClient($mqtt_server, $mqtt_port, $clientId);
    $mqtt->connect($settings, true);
    $mqtt->publish($mqtt_topic, $message, 0);
    $mqtt->disconnect();

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Nachricht gesendet!']);

} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
