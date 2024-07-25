<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Sign</title>
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
            <img class="footerImg" src="{{ resource_path('images/logo/logo.png') }}">
        </div>

        <!-- Content -->
        <div class="content">

            <!-- Text -->
            <p class="text">A new signature has been added to your document by {{ $senderName }} ({{ $senderEmail }})</p>

            @if($document->completed_signed)
                <p>All Signer Has completed their sign</p>
            @else
                <p>As it stands, {{ $document->total_signed }} out of {{ $document->total_signer }} required signatures have been obtained.</p>
            @endif

            <!-- Heading: What is E-signature -->
            <div class="heading">What is Esign.com.sg</div>
            <div class="text">
                <p>With Esign.com.sg you can collect signatures on documents through any channel. Save time, paper and money. All with legal validity</p>
            </div>

            <!-- Heading: Do you have any question about us? -->
            <div class="heading">Do you have any question about us?</div>
            <div class="text">
                <p>Write to support <a href="mailto:e-sginature@gmail.com">e-sgin@gmail.com</a></p>
            </div>

            <div class="text" style="margin-top:35px">Best,</div>
            <div class="text">Esign Team</div>
        </div>
    </div>
</div>
</body>
</html>