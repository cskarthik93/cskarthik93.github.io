<?php
// Import the PHPMailer library
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Check if the OpenSSL extension is loaded
if (!extension_loaded('openssl')) {
    echo 'OpenSSL extension is not loaded.';
    exit;
}

require '../assets/PHPMailer-master/src/Exception.php';
require '../assets/PHPMailer-master/src/PHPMailer.php';
require '../assets/PHPMailer-master/src/SMTP.php';

//Load the configuration file
$config = include '../forms/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Validate and sanitize the form data here
    $name = strip_tags(trim($name));
    $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($subject));
    $message = trim($message);

    // Check if the form fields are not empty
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo 'Please fill in all required fields!';
        exit;
    }

    // Check if the email address is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Please enter a valid email address!';
        exit;
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp-mail.outlook.com';
        $mail->SMTPAuth = true;
        $mail->Username = $config[''];//sender_email_address
        $mail->Password = $config['sender_email_password'];
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Recipients
        $mail->setFrom($config['sender_email_address'], $config['sender']);
        $mail->addAddress($config['receiver_email_address'], $config['receiver']);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "Name: $name<br>Email: $email<br>Message: $message";

        // Send the email
        $mail->send();
        echo 'success';
    } 
    catch (Exception $e) {
        echo 'Error occurred while sending the email: ', $mail->ErrorInfo;
    }
} else {
    echo 'Invalid request method!';
}
?>