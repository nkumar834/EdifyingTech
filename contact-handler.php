<?php
// Contact Form Handler for Edifying Tech
// This file handles the contact form submissions

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$to_email = 'skniraj7494@gmail.com'; // Your email address
$from_email = 'noreply@edifyingtech.com'; // Your domain email
$site_name = 'Edifying Tech Consultancy LLP';

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

try {
    // Get form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : '';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

    // Validation
    $errors = [];

    if (strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }

    if (!validate_email($email)) {
        $errors[] = 'Please enter a valid email address';
    }

    if (strlen($subject) < 3) {
        $errors[] = 'Subject must be at least 3 characters long';
    }

    if (strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }

    // If there are validation errors, return them
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $errors
        ]);
        exit;
    }

    // Prepare email content
    $email_subject = "New Contact Form Submission from {$site_name}";
    $email_body = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(45deg, #FF5E00, #00B2FF); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #FF5E00; }
            .value { background: white; padding: 10px; border-left: 3px solid #FF5E00; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>From {$site_name} Website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>{$name}</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>{$email}</div>
                </div>
                <div class='field'>
                    <div class='label'>Subject:</div>
                    <div class='value'>{$subject}</div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br($message) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Submitted at:</div>
                    <div class='value'>" . date('Y-m-d H:i:s') . "</div>
                </div>
                <div class='field'>
                    <div class='label'>IP Address:</div>
                    <div class='value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";

    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: {$from_email}" . "\r\n";
    $headers .= "Reply-To: {$email}" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    $mail_sent = mail($to_email, $email_subject, $email_body, $headers);

    if ($mail_sent) {
        // Optional: Send auto-reply to user
        $auto_reply_subject = "Thank you for contacting {$site_name}";
        $auto_reply_body = "
        <html>
        <head>
            <title>Thank you for contacting us</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(45deg, #FF5E00, #00B2FF); color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Thank You for Contacting Us!</h2>
                </div>
                <div class='content'>
                    <p>Dear {$name},</p>
                    <p>Thank you for reaching out to {$site_name}. We have received your message and will get back to you within 24 hours.</p>
                    <p><strong>Your message:</strong></p>
                    <p style='background: white; padding: 15px; border-left: 3px solid #FF5E00;'>" . nl2br($message) . "</p>
                    <p>Best regards,<br>The Edifying Tech Team</p>
                    <hr>
                    <p style='font-size: 12px; color: #666;'>
                        📧 skniraj7494@gmail.com<br>
                        📱 +(91) 9250031031 || +(91) 916231031<br>
                        📍 Narayan Bhawan, 1st floor, Beside HM college, San Saraiya, Ward No. 42, Bettiah-845438, West Champaran
                    </p>
                </div>
            </div>
        </body>
        </html>
        ";

        $auto_reply_headers = "MIME-Version: 1.0" . "\r\n";
        $auto_reply_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $auto_reply_headers .= "From: {$from_email}" . "\r\n";
        $auto_reply_headers .= "X-Mailer: PHP/" . phpversion();

        // Send auto-reply (optional)
        mail($email, $auto_reply_subject, $auto_reply_body, $auto_reply_headers);

        // Log the submission (optional)
        $log_entry = date('Y-m-d H:i:s') . " - Contact form submission from: {$name} ({$email}) - Subject: {$subject}\n";
        file_put_contents('contact-submissions.log', $log_entry, FILE_APPEND | LOCK_EX);

        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);

    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
        ]);
    }

} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred. Please try again later.'
    ]);
}
?>