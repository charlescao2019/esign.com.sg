<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Signature</title>
    <style>
        /* CSS for centering elements */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .logo {
            margin-bottom: 20px;
        }
        .otp-box {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            display: inline-block;
        }
        .heading {
            font-size: 18px;
            font-weight: bold;
            margin-top: 35px;
        }
        .text {
            line-height: 1.6;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="card">
        <!-- Logo -->
        <div class="logo">
        </div>

        <!-- Content -->
        <div class="content">

            Dear {{ $name }},

@if(isset($type) && (strtolower($type) == 'sender'))
            <!-- Text -->
            <p class="text">
            Your customer has been sent an email to sign the document. Please check the following document.</p>
@else
            <!-- Text -->
            <p class="text">
            You have been invited to sign a document. Please check the following document.</p>
@endif

            <!-- OTP Box -->
            <div class="otp-box">
                <a href='{{ env("API_URL").$url ?? "" }}'><strong>Please Sign Your Employment Documents</strong></a>
            </div>

            <!-- Heading: What is E-signature -->
            <div class="heading">What is Esign.com.sg</div>
            <div class="text">
                <p>With Esign.com.sg you can collect signatures on documents through any channel. Save time, paper and money. All with legal validity</p>
            </div>

            <!-- Heading: Do you have any question about us? -->
            <div class="heading">Do you have any question about us?</div>
            <div class="text">
                <p>Write to support <a href="mailto:info@esign.com.sg">info@esign.com.sg</a></p>
            </div>

            <div class="text" style="margin-top:35px">Best,</div>

@if(isset($type) && (strtolower($type) == 'sender'))
            <div class="text">E-Sign Team</div>
@else
            <div class="text">{{ $document->sender_name }}</div>
            <div class="text">{{ $document->company_name }}</div>
@endif

        </div>
    </div>
</div>
</body>
</html>
